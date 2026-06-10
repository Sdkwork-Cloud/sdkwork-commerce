use axum::body::Body;
use axum::http::{Request, StatusCode};
use http_body_util::BodyExt;
use sdkwork_commerce_http::app_commerce_foundation_router_with_sqlite_pool;
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

fn subject_request(uri: &str) -> Request<Body> {
    Request::builder()
        .method("GET")
        .uri(uri)
        .extension(standard_context())
        .body(Body::empty())
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
async fn app_commerce_foundation_router_retrieves_payment_record_from_standard_payment_schema() {
    let pool = migrated_pool().await;
    seed_payment_record(&pool).await;
    let app = app_commerce_foundation_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "/app/v3/api/payments/attempts/payment-attempt-1",
        ))
        .await
        .expect("payment record response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("payment-attempt-1", payload["data"]["id"]);
    assert_eq!("TRADE-1", payload["data"]["orderNo"]);
    assert_eq!("wechat_pay", payload["data"]["method"]);
    assert_eq!("29.90", payload["data"]["amount"]);
    assert_eq!("2026-05-20 10:03:00", payload["data"]["date"]);
    assert_eq!("success", payload["data"]["status"]);
}

#[tokio::test]
async fn app_commerce_foundation_router_does_not_register_retired_app_routes() {
    let pool = migrated_pool().await;
    seed_payment_record(&pool).await;
    let app = app_commerce_foundation_router_with_sqlite_pool(pool);

    for (method, path) in [
        ("GET", "/app/v3/api/payments/attempts"),
        ("POST", "/app/v3/api/wallet/points/exchanges"),
        ("GET", "/app/v3/api/wallet/points/exchanges/exchange-1"),
        ("GET", "/app/v3/api/coupons"),
        ("POST", "/app/v3/api/coupons/claims"),
        ("POST", "/app/v3/api/coupons/redemptions"),
        ("GET", "/app/v3/api/coupons/catalog"),
        ("GET", "/app/v3/api/coupons/catalog/coupon-1"),
        ("GET", "/app/v3/api/coupons/user_coupons/user-coupon-1"),
        ("POST", "/app/v3/api/coupons/usage"),
        ("POST", "/app/v3/api/coupons/usage_reversals"),
        ("POST", "/app/v3/api/checkout/preflight/estimates"),
        ("POST", "/app/v3/api/checkout/preflight/prechecks"),
        ("POST", "/app/v3/api/checkout/preflight/preholds"),
        ("POST", "/app/v3/api/checkout/preflight/settlements"),
        ("POST", "/app/v3/api/checkout/preflight/releases"),
    ] {
        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(path)
                    .extension(standard_context())
                    .body(Body::empty())
                    .expect("request"),
            )
            .await
            .expect("retired route response");

        assert_eq!(response.status(), StatusCode::NOT_FOUND, "{method} {path}");
    }
}

async fn seed_payment_record(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
        VALUES
            ('order-1', 'tenant-1', 'org-1', 'user-1', 'ORD-1', 'paid', 'points_recharge', 'CNY', 'req-order-1', 'idem-order-1', '2026-05-20 10:00:00', '2026-05-20 10:03:00', NULL, NULL, '2026-05-20 10:03:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed order");

    sqlx::query(
        r#"
        INSERT INTO commerce_payment_intent
            (id, tenant_id, organization_id, owner_user_id, order_id, payment_method, provider_code, amount, currency_code, status, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('payment-intent-1', 'tenant-1', 'org-1', 'user-1', 'order-1', 'wechat_pay', 'wechat_pay', '29.90', 'CNY', 'succeeded', 'req-pay-1', 'idem-pay-1', '2026-05-20 10:01:00', '2026-05-20 10:03:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed payment intent");

    sqlx::query(
        r#"
        INSERT INTO commerce_payment_attempt
            (id, tenant_id, organization_id, owner_user_id, payment_intent_id, order_id, payment_method, provider_code, out_trade_no, amount, currency_code, status, callback_payload, created_at, paid_at, updated_at)
        VALUES
            ('payment-attempt-1', 'tenant-1', 'org-1', 'user-1', 'payment-intent-1', 'order-1', 'wechat_pay', 'wechat_pay', 'TRADE-1', '29.90', 'CNY', 'succeeded', NULL, '2026-05-20 10:02:00', '2026-05-20 10:03:00', '2026-05-20 10:03:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed payment attempt");
}
