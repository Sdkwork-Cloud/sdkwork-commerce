use axum::body::Body;
use axum::http::{Request, StatusCode};
use http_body_util::BodyExt;
use sdkwork_commerce_http::app_invoice_router_with_sqlite_pool;
use sdkwork_iam_core::{AuthLevel, DeploymentMode, Environment, IamAppContext};
use sqlx::SqlitePool;
use tower::ServiceExt;

async fn migrated_pool() -> SqlitePool {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    sqlx::query(sdkwork_commerce_storage_sqlx::commerce_initial_migration_sql())
        .execute(&pool)
        .await
        .expect("commerce migration");
    pool
}

async fn seed_invoices(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_invoice
            (id, tenant_id, organization_id, owner_user_id, order_id, payment_id,
             title_id, status, invoice_no, invoice_code, document_url, created_at,
             issued_at, updated_at)
        VALUES
            ('invoice-1', 'tenant-1', 'org-1', 'user-1', 'order-1', 'payment-1',
             'title-1', 'issued', 'INV-2026-05', 'IC-2026-05',
             'https://cdn.example.test/invoice-1.pdf', '2026-05-21T00:00:00Z',
             '2026-05-22T00:00:00Z', '2026-05-22T00:00:00Z'),
            ('invoice-2', 'tenant-1', 'org-1', 'user-1', 'order-2', 'payment-2',
             'title-1', 'draft', 'INV-2026-04', NULL,
             NULL, '2026-04-21T00:00:00Z', NULL, '2026-04-21T00:00:00Z'),
            ('invoice-other-user', 'tenant-1', 'org-1', 'user-2', 'order-3', 'payment-3',
             'title-1', 'issued', 'INV-OTHER', NULL,
             NULL, '2026-05-23T00:00:00Z', NULL, '2026-05-23T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed invoices");

    sqlx::query(
        r#"
        INSERT INTO commerce_invoice_item
            (id, tenant_id, invoice_id, order_item_id, title, amount, tax_amount, created_at)
        VALUES
            ('invoice-item-1', 'tenant-1', 'invoice-1', 'order-item-1',
             'LLM usage', '80.00', '8.25', '2026-05-21T00:00:00Z'),
            ('invoice-item-2', 'tenant-1', 'invoice-1', 'order-item-2',
             'Image usage', '8.25', '0.00', '2026-05-21T00:00:00Z'),
            ('invoice-item-3', 'tenant-1', 'invoice-2', 'order-item-3',
             'April usage', '12.50', '0.00', '2026-04-21T00:00:00Z'),
            ('invoice-item-other-user', 'tenant-1', 'invoice-other-user', 'order-item-4',
             'Other user usage', '1.00', '0.00', '2026-05-23T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed invoice items");
}

fn subject_request(method: &str, uri: &str, body: Body) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .extension(standard_context())
        .body(body)
        .expect("request")
}

fn standard_context() -> IamAppContext {
    IamAppContext::new(
        "tenant-1",
        Some("org-1"),
        "user-1",
        "session-1",
        "app-1",
        Environment::Test,
        DeploymentMode::Local,
        AuthLevel::Password,
        vec!["tenant:tenant-1".to_owned()],
        vec!["commerce:read".to_owned()],
    )
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    serde_json::from_slice(&body).expect("json response")
}

#[tokio::test]
async fn app_invoice_router_lists_invoices_from_sqlite_store() {
    let pool = migrated_pool().await;
    seed_invoices(&pool).await;
    let app = app_invoice_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/invoices?page=1&page_size=20",
            Body::empty(),
        ))
        .await
        .expect("invoice list response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(2, payload["data"]["total"]);
    assert_eq!(1, payload["data"]["page"]);
    assert_eq!(20, payload["data"]["pageSize"]);
    let items = payload["data"]["items"].as_array().unwrap();
    assert_eq!(2, items.len());
    assert_eq!("invoice-1", items[0]["id"]);
    assert_eq!("INV-2026-05", items[0]["invoiceNo"]);
    assert_eq!("issued", items[0]["status"]);
    assert_eq!("88.25", items[0]["totalAmount"]);
    assert_eq!("invoice-2", items[1]["id"]);
}

#[tokio::test]
async fn app_invoice_router_filters_by_status() {
    let pool = migrated_pool().await;
    seed_invoices(&pool).await;
    let app = app_invoice_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/invoices?status=draft&page=1&page_size=20",
            Body::empty(),
        ))
        .await
        .expect("filtered invoice list response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let items = payload["data"]["items"].as_array().unwrap();
    assert_eq!(1, items.len());
    assert_eq!("invoice-2", items[0]["id"]);
    assert_eq!("draft", items[0]["status"]);
}

#[tokio::test]
async fn app_invoice_router_retrieves_invoice_resource() {
    let pool = migrated_pool().await;
    seed_invoices(&pool).await;
    let app = app_invoice_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/invoices/invoice-1",
            Body::empty(),
        ))
        .await
        .expect("invoice retrieve response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("invoice-1", payload["data"]["item"]["id"]);
    assert_eq!("INV-2026-05", payload["data"]["item"]["invoiceNo"]);
    assert_eq!("88.25", payload["data"]["item"]["totalAmount"]);
}

#[tokio::test]
async fn app_invoice_router_validates_page_size() {
    let pool = migrated_pool().await;
    let app = app_invoice_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/invoices?page=1&page_size=201",
            Body::empty(),
        ))
        .await
        .expect("invoice validation response");

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert_eq!("page_size must be between 1 and 200", payload["msg"]);
}

#[tokio::test]
async fn app_invoice_router_requires_authenticated_runtime_context() {
    let pool = migrated_pool().await;
    let app = app_invoice_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/invoices")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("response");

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
}
