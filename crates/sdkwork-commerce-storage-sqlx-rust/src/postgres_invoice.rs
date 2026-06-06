use std::collections::HashMap;

use sdkwork_commerce_core::CommerceServiceError;
use sdkwork_commerce_invoice::{
    InvoiceDetailQuery, InvoiceItemRecord, InvoiceListPage, InvoiceListQuery, InvoiceRecord,
};
use sqlx::{PgPool, Postgres, QueryBuilder, Row};

#[derive(Debug, Clone)]
pub struct PostgresCommerceInvoiceStore {
    pool: PgPool,
}

#[derive(Debug, Clone)]
struct InvoiceRow {
    id: String,
    tenant_id: String,
    organization_id: Option<String>,
    owner_user_id: String,
    order_id: String,
    payment_id: String,
    title_id: String,
    status: String,
    invoice_no: Option<String>,
    invoice_code: Option<String>,
    document_url: Option<String>,
    created_at: String,
    issued_at: Option<String>,
    updated_at: String,
}

impl PostgresCommerceInvoiceStore {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn list_invoices(
        &self,
        query: InvoiceListQuery,
    ) -> Result<InvoiceListPage, CommerceServiceError> {
        let total = count_invoices(&self.pool, &query).await?;
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, organization_id, owner_user_id, order_id, payment_id,
                   title_id, status, invoice_no, invoice_code, document_url,
                   created_at, issued_at, updated_at
            FROM commerce_invoice
            WHERE tenant_id = CAST($1 AS TEXT)
              AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
              AND owner_user_id = CAST($3 AS TEXT)
              AND ($4 IS NULL OR status = $4)
            ORDER BY COALESCE(issued_at, created_at) DESC NULLS LAST, id DESC
            LIMIT $5 OFFSET $6
            "#,
        )
        .bind(&query.tenant_id)
        .bind(query.organization_id.as_deref())
        .bind(&query.owner_user_id)
        .bind(query.status.as_deref())
        .bind(query.limit())
        .bind(query.offset())
        .fetch_all(&self.pool)
        .await
        .map_err(|error| store_error("failed to list invoices", error))?;

        let invoice_rows = rows.iter().map(map_invoice_row).collect::<Vec<_>>();
        let items_by_invoice =
            load_items_by_invoice(&self.pool, &query.tenant_id, invoice_rows.as_slice()).await?;
        let invoices = invoice_rows
            .into_iter()
            .map(|row| invoice_from_row(row, &items_by_invoice))
            .collect::<Result<Vec<_>, _>>()?;

        InvoiceListPage::new(invoices, total, query.page_no(), query.limit())
    }

    pub async fn retrieve_invoice(
        &self,
        query: InvoiceDetailQuery,
    ) -> Result<Option<InvoiceRecord>, CommerceServiceError> {
        let row = sqlx::query(
            r#"
            SELECT id, tenant_id, organization_id, owner_user_id, order_id, payment_id,
                   title_id, status, invoice_no, invoice_code, document_url,
                   created_at, issued_at, updated_at
            FROM commerce_invoice
            WHERE tenant_id = CAST($1 AS TEXT)
              AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
              AND owner_user_id = CAST($3 AS TEXT)
              AND id = CAST($4 AS TEXT)
            "#,
        )
        .bind(&query.tenant_id)
        .bind(query.organization_id.as_deref())
        .bind(&query.owner_user_id)
        .bind(&query.invoice_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|error| store_error("failed to retrieve invoice", error))?;

        let Some(row) = row else {
            return Ok(None);
        };
        let invoice_row = map_invoice_row(&row);
        let items_by_invoice = load_items_by_invoice(
            &self.pool,
            &query.tenant_id,
            std::slice::from_ref(&invoice_row),
        )
        .await?;

        invoice_from_row(invoice_row, &items_by_invoice).map(Some)
    }
}

async fn count_invoices(
    pool: &PgPool,
    query: &InvoiceListQuery,
) -> Result<i64, CommerceServiceError> {
    sqlx::query_scalar(
        r#"
        SELECT COUNT(1)
        FROM commerce_invoice
        WHERE tenant_id = CAST($1 AS TEXT)
          AND ((organization_id = CAST($2 AS TEXT)) OR (organization_id IS NULL AND $2 IS NULL))
          AND owner_user_id = CAST($3 AS TEXT)
          AND ($4 IS NULL OR status = $4)
        "#,
    )
    .bind(&query.tenant_id)
    .bind(query.organization_id.as_deref())
    .bind(&query.owner_user_id)
    .bind(query.status.as_deref())
    .fetch_one(pool)
    .await
    .map_err(|error| store_error("failed to count invoices", error))
}

async fn load_items_by_invoice(
    pool: &PgPool,
    tenant_id: &str,
    invoices: &[InvoiceRow],
) -> Result<HashMap<String, Vec<InvoiceItemRecord>>, CommerceServiceError> {
    if invoices.is_empty() {
        return Ok(HashMap::new());
    }

    let mut builder = QueryBuilder::<Postgres>::new(
        "SELECT id, tenant_id, invoice_id, order_item_id, title, amount, tax_amount, created_at \
         FROM commerce_invoice_item WHERE tenant_id = ",
    );
    builder.push_bind(tenant_id);
    builder.push(" AND invoice_id IN (");
    {
        let mut separated = builder.separated(", ");
        for invoice in invoices {
            separated.push_bind(&invoice.id);
        }
        separated.push_unseparated(")");
    }
    builder.push(" ORDER BY created_at ASC, id ASC");

    let rows = builder
        .build()
        .fetch_all(pool)
        .await
        .map_err(|error| store_error("failed to list invoice items", error))?;

    let mut items_by_invoice: HashMap<String, Vec<InvoiceItemRecord>> = HashMap::new();
    for row in rows {
        let invoice_id = string_cell(&row, "invoice_id");
        let item = InvoiceItemRecord::new(
            &string_cell(&row, "id"),
            &string_cell(&row, "tenant_id"),
            &invoice_id,
            optional_string_cell(&row, "order_item_id").as_deref(),
            &string_cell(&row, "title"),
            &string_cell(&row, "amount"),
            &string_cell(&row, "tax_amount"),
            &string_cell(&row, "created_at"),
        )?;
        items_by_invoice.entry(invoice_id).or_default().push(item);
    }
    Ok(items_by_invoice)
}

fn invoice_from_row(
    row: InvoiceRow,
    items_by_invoice: &HashMap<String, Vec<InvoiceItemRecord>>,
) -> Result<InvoiceRecord, CommerceServiceError> {
    let items = items_by_invoice
        .get(&row.id)
        .cloned()
        .unwrap_or_else(Vec::new);
    InvoiceRecord::new(
        &row.id,
        &row.tenant_id,
        row.organization_id.as_deref(),
        &row.owner_user_id,
        &row.order_id,
        &row.payment_id,
        &row.title_id,
        &row.status,
        row.invoice_no.as_deref(),
        row.invoice_code.as_deref(),
        row.document_url.as_deref(),
        &row.created_at,
        row.issued_at.as_deref(),
        &row.updated_at,
        items,
    )
}

fn map_invoice_row(row: &sqlx::postgres::PgRow) -> InvoiceRow {
    InvoiceRow {
        id: string_cell(row, "id"),
        tenant_id: string_cell(row, "tenant_id"),
        organization_id: optional_string_cell(row, "organization_id"),
        owner_user_id: string_cell(row, "owner_user_id"),
        order_id: string_cell(row, "order_id"),
        payment_id: string_cell(row, "payment_id"),
        title_id: string_cell(row, "title_id"),
        status: string_cell(row, "status"),
        invoice_no: optional_string_cell(row, "invoice_no"),
        invoice_code: optional_string_cell(row, "invoice_code"),
        document_url: optional_string_cell(row, "document_url"),
        created_at: string_cell(row, "created_at"),
        issued_at: optional_string_cell(row, "issued_at"),
        updated_at: string_cell(row, "updated_at"),
    }
}

fn string_cell(row: &sqlx::postgres::PgRow, name: &str) -> String {
    row.try_get::<String, _>(name).unwrap_or_default()
}

fn optional_string_cell(row: &sqlx::postgres::PgRow, name: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(name)
        .ok()
        .flatten()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn store_error(context: &str, error: sqlx::Error) -> CommerceServiceError {
    CommerceServiceError::storage(format!("{context}: {error}"))
}
