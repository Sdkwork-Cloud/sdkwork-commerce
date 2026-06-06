use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use axum::extract::{Extension, Path, Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_commerce_core::CommerceServiceError;
use sdkwork_commerce_invoice::{
    InvoiceDetailQuery, InvoiceItemRecord, InvoiceListPage, InvoiceListQuery, InvoiceRecord,
};
use sdkwork_commerce_storage_sqlx::{PostgresCommerceInvoiceStore, SqliteCommerceInvoiceStore};
use sdkwork_iam_core::IamAppContext;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, SqlitePool};

use crate::subject::app_runtime_subject_from_extension;
use crate::with_request_identity;

pub type CommerceInvoiceFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, CommerceServiceError>> + Send + 'a>>;

pub trait CommerceInvoiceStore: Send + Sync {
    fn list_invoices<'a>(
        &'a self,
        query: InvoiceListQuery,
    ) -> CommerceInvoiceFuture<'a, InvoiceListPage>;

    fn retrieve_invoice<'a>(
        &'a self,
        query: InvoiceDetailQuery,
    ) -> CommerceInvoiceFuture<'a, Option<InvoiceRecord>>;
}

#[derive(Clone)]
struct AppInvoiceState {
    store: Arc<dyn CommerceInvoiceStore>,
}

#[derive(Debug, Deserialize)]
struct InvoiceListQueryParams {
    page: Option<i64>,
    #[serde(rename = "pageSize", alias = "page_size")]
    page_size: Option<i64>,
    status: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppInvoiceApiResult<T: Serialize> {
    code: String,
    msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InvoiceCollectionResponse {
    items: Vec<InvoiceResponse>,
    total: i64,
    page: i64,
    page_size: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InvoiceResourceResponse {
    item: InvoiceResponse,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InvoiceResponse {
    id: String,
    tenant_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    organization_id: Option<String>,
    owner_user_id: String,
    order_id: String,
    payment_id: String,
    title_id: String,
    status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    invoice_no: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    invoice_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    document_url: Option<String>,
    created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    issued_at: Option<String>,
    updated_at: String,
    total_amount: String,
    items: Vec<InvoiceItemResponse>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct InvoiceItemResponse {
    id: String,
    tenant_id: String,
    invoice_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    order_item_id: Option<String>,
    title: String,
    amount: String,
    tax_amount: String,
    created_at: String,
}

impl CommerceInvoiceStore for SqliteCommerceInvoiceStore {
    fn list_invoices<'a>(
        &'a self,
        query: InvoiceListQuery,
    ) -> CommerceInvoiceFuture<'a, InvoiceListPage> {
        Box::pin(async move { self.list_invoices(query).await })
    }

    fn retrieve_invoice<'a>(
        &'a self,
        query: InvoiceDetailQuery,
    ) -> CommerceInvoiceFuture<'a, Option<InvoiceRecord>> {
        Box::pin(async move { self.retrieve_invoice(query).await })
    }
}

impl CommerceInvoiceStore for PostgresCommerceInvoiceStore {
    fn list_invoices<'a>(
        &'a self,
        query: InvoiceListQuery,
    ) -> CommerceInvoiceFuture<'a, InvoiceListPage> {
        Box::pin(async move { self.list_invoices(query).await })
    }

    fn retrieve_invoice<'a>(
        &'a self,
        query: InvoiceDetailQuery,
    ) -> CommerceInvoiceFuture<'a, Option<InvoiceRecord>> {
        Box::pin(async move { self.retrieve_invoice(query).await })
    }
}

impl<T: Serialize> AppInvoiceApiResult<T> {
    fn success(data: T) -> Self {
        Self {
            code: "2000".to_owned(),
            msg: "SUCCESS".to_owned(),
            data: Some(data),
        }
    }
}

impl AppInvoiceApiResult<()> {
    fn error(code: impl Into<String>, msg: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            msg: msg.into(),
            data: None,
        }
    }
}

pub fn app_invoice_router_with_sqlite_pool(pool: SqlitePool) -> Router {
    app_invoice_router_with_store(Arc::new(SqliteCommerceInvoiceStore::new(pool)))
}

pub fn app_invoice_router_with_postgres_pool(pool: PgPool) -> Router {
    app_invoice_router_with_store(Arc::new(PostgresCommerceInvoiceStore::new(pool)))
}

pub fn app_invoice_router_with_store(store: Arc<dyn CommerceInvoiceStore>) -> Router {
    with_request_identity(
        Router::new()
            .route(
                "/app/v3/api/invoices",
                get(fetch_invoices).post(unavailable_command),
            )
            .route("/app/v3/api/invoices/mine", get(unavailable_read))
            .route("/app/v3/api/invoices/statistics", get(unavailable_read))
            .route(
                "/app/v3/api/invoices/{invoiceId}",
                get(fetch_invoice).patch(unavailable_command),
            )
            .route(
                "/app/v3/api/invoices/{invoiceId}/items",
                get(unavailable_read),
            )
            .route(
                "/app/v3/api/invoices/{invoiceId}/submissions",
                post(unavailable_command),
            )
            .route(
                "/app/v3/api/invoices/{invoiceId}/cancellations",
                post(unavailable_command),
            )
            .with_state(AppInvoiceState { store }),
    )
}

async fn fetch_invoices(
    State(state): State<AppInvoiceState>,
    runtime_context: Option<Extension<IamAppContext>>,
    Query(params): Query<InvoiceListQueryParams>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let query = match InvoiceListQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        params.status.as_deref(),
        params.page,
        params.page_size,
    ) {
        Ok(query) => query,
        Err(error) => return validation_response(error.message()),
    };

    match state.store.list_invoices(query).await {
        Ok(page) => Json(AppInvoiceApiResult::success(map_invoice_page(page))).into_response(),
        Err(error) => invoice_system_response("invoice read model is unavailable", error),
    }
}

async fn fetch_invoice(
    State(state): State<AppInvoiceState>,
    runtime_context: Option<Extension<IamAppContext>>,
    Path(invoice_id): Path<String>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let query = match InvoiceDetailQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        &invoice_id,
    ) {
        Ok(query) => query,
        Err(error) => return validation_response(error.message()),
    };

    match state.store.retrieve_invoice(query).await {
        Ok(Some(item)) => Json(AppInvoiceApiResult::success(InvoiceResourceResponse {
            item: map_invoice(item),
        }))
        .into_response(),
        Ok(None) => not_found_response("invoice was not found"),
        Err(error) => invoice_system_response("invoice read model is unavailable", error),
    }
}

async fn unavailable_read() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(AppInvoiceApiResult::error(
            "5010",
            "commerce invoice read operation is not implemented",
        )),
    )
        .into_response()
}

async fn unavailable_command() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(AppInvoiceApiResult::error(
            "5010",
            "commerce invoice command store is not configured",
        )),
    )
        .into_response()
}

fn map_invoice_page(page: InvoiceListPage) -> InvoiceCollectionResponse {
    InvoiceCollectionResponse {
        items: page.items.into_iter().map(map_invoice).collect(),
        total: page.total,
        page: page.page,
        page_size: page.page_size,
    }
}

fn map_invoice(value: InvoiceRecord) -> InvoiceResponse {
    InvoiceResponse {
        id: value.id,
        tenant_id: value.tenant_id,
        organization_id: value.organization_id,
        owner_user_id: value.owner_user_id,
        order_id: value.order_id,
        payment_id: value.payment_id,
        title_id: value.title_id,
        status: value.status,
        invoice_no: value.invoice_no,
        invoice_code: value.invoice_code,
        document_url: value.document_url,
        created_at: value.created_at,
        issued_at: value.issued_at,
        updated_at: value.updated_at,
        total_amount: value.total_amount,
        items: value.items.into_iter().map(map_invoice_item).collect(),
    }
}

fn map_invoice_item(value: InvoiceItemRecord) -> InvoiceItemResponse {
    InvoiceItemResponse {
        id: value.id,
        tenant_id: value.tenant_id,
        invoice_id: value.invoice_id,
        order_item_id: value.order_item_id,
        title: value.title,
        amount: value.amount,
        tax_amount: value.tax_amount,
        created_at: value.created_at,
    }
}

fn unauthorized_response(message: String) -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(AppInvoiceApiResult::error("4010", message)),
    )
        .into_response()
}

fn validation_response(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(AppInvoiceApiResult::error("4001", message)),
    )
        .into_response()
}

fn not_found_response(message: impl Into<String>) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(AppInvoiceApiResult::error("4040", message)),
    )
        .into_response()
}

fn invoice_system_response(context: &str, error: CommerceServiceError) -> Response {
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(AppInvoiceApiResult::error(
            "5000",
            format!("{context}: {}", error.message()),
        )),
    )
        .into_response()
}
