use axum::body::Body;
use axum::http::{Request, StatusCode};
use http_body_util::BodyExt;
use sdkwork_commerce_http::app_recharge_checkout_router_with_sqlite_pool;
use sdkwork_commerce_membership_sqlx::upsert_sqlite_commerce_experience_seed;
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

async fn seed_recharge_data(pool: &SqlitePool) {
    for statement in [
        r#"
        INSERT INTO commerce_product_spu
            (id, tenant_id, organization_id, spu_no, title, product_type, sales_status, visible_surfaces, created_at, updated_at)
        VALUES
            ('product-owner', 'tenant-1', 'org-1', 'points-recharge-owner', 'Points recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('product-tenant-20', 'tenant-1', NULL, 'points-recharge-tenant', 'Tenant points recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('product-other-org', 'tenant-1', 'org-2', 'points-recharge-other', 'Other Org Recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, created_at, updated_at)
        VALUES
            ('sku-owner-10', 'tenant-1', 'org-1', 'product-owner', 'starter', 'Starter Pack', 'Starter Pack', '10.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('sku-tenant-20', 'tenant-1', NULL, 'product-tenant-20', 'tenant-pack', 'Tenant Pack', 'Tenant Pack', '20.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('sku-other-org-30', 'tenant-1', 'org-2', 'product-other-org', 'other-pack', 'Other Org Pack', 'Other Org Pack', '30.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_recharge_package
            (id, tenant_id, organization_id, external_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('pack-owner-10', 'tenant-1', 'org-1', 1001, 'starter', 'sku-owner-10', 'Starter Pack', '10.00', 'CNY', 25, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 1, 'seed-pack-owner', 'seed-pack-owner', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('pack-tenant-20', 'tenant-1', NULL, 1002, 'tenant-pack', 'sku-tenant-20', 'Tenant Pack', '20.00', 'CNY', 50, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 2, 'seed-pack-tenant', 'seed-pack-tenant', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('pack-other-org-30', 'tenant-1', 'org-2', 1002, 'other-pack', 'sku-other-org-30', 'Other Org Pack', '30.00', 'CNY', 75, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 2, 'seed-pack-other', 'seed-pack-other', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_payment_method
            (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('method-wechat', 'tenant-1', 'org-1', 'wechat', 'WeChat Pay', 'wechat', 'active', 1, 'seed-method-wechat', 'seed-method-wechat', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_exchange_rule
            (id, tenant_id, organization_id, rule_no, source_asset_type, target_asset_type, rate, status, remark, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('exchange-cash-points-owner', 'tenant-1', 'org-1', 'CASH_TO_POINTS', 'cash', 'points', '10.000000', 'active', '{"baseCurrencyCode":"CNY","currencyToCnyRates":{"CNY":"1","USD":"7"}}', 'seed-exchange-cash-points-owner', 'seed-exchange-cash-points-owner', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    ] {
        sqlx::query(statement)
            .execute(pool)
            .await
            .expect("seed recharge data");
    }
}

fn subject_request(method: &str, uri: &str, body: Body) -> Request<Body> {
    subject_request_with_idempotency(method, uri, "recharge-idem-1", "recharge-request-1", body)
}

fn subject_request_with_idempotency(
    method: &str,
    uri: &str,
    idempotency_key: &str,
    request_no: &str,
    body: Body,
) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .extension(standard_context())
        .header("Idempotency-Key", idempotency_key)
        .header("Sdkwork-Request-No", request_no)
        .body(body)
        .expect("request")
}

fn subject_request_with_request_id_header_only(
    method: &str,
    uri: &str,
    idempotency_key: &str,
    body: Body,
) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .extension(standard_context())
        .header("Idempotency-Key", idempotency_key)
        .header("X-Request-Id", "123e4567-e89b-12d3-a456-426614174000")
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
        vec!["commerce:write".to_owned()],
    )
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    serde_json::from_slice(&body).expect("json response")
}

#[tokio::test]
async fn app_recharge_router_lists_packages_from_sqlite_store() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/recharges/packages",
            Body::empty(),
        ))
        .await
        .expect("packages response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(2, payload["data"]["items"].as_array().unwrap().len());
    assert_eq!("pack-owner-10", payload["data"]["items"][0]["id"]);
    assert_eq!("10.00", payload["data"]["items"][0]["priceAmount"]);
    assert_eq!("CNY", payload["data"]["items"][0]["currencyCode"]);
    assert_eq!(25, payload["data"]["items"][0]["bonusPoints"]);
    assert_eq!(125, payload["data"]["items"][0]["grantAmount"]);
    assert_eq!(125, payload["data"]["items"][0]["points"]);
    assert_eq!("pack-tenant-20", payload["data"]["items"][1]["id"]);
    assert_eq!("20.00", payload["data"]["items"][1]["priceAmount"]);
    assert_eq!("CNY", payload["data"]["items"][1]["currencyCode"]);
    assert_eq!(50, payload["data"]["items"][1]["bonusPoints"]);
    assert_eq!(250, payload["data"]["items"][1]["grantAmount"]);
    assert_eq!(250, payload["data"]["items"][1]["points"]);
}

#[tokio::test]
async fn app_recharge_router_lists_default_seed_packages_for_current_tenant() {
    let pool = migrated_pool().await;
    upsert_sqlite_commerce_experience_seed(&pool)
        .await
        .expect("commerce experience seed");
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/recharges/packages",
            Body::empty(),
        ))
        .await
        .expect("packages response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    let items = payload["data"]["items"].as_array().expect("seeded items");
    assert_eq!(9, items.len());
    assert_eq!("5.00", payload["data"]["items"][0]["priceAmount"]);
    assert_eq!("CNY", payload["data"]["items"][0]["currencyCode"]);
    assert_eq!(50, payload["data"]["items"][0]["grantAmount"]);
    assert_eq!("10.00", payload["data"]["items"][1]["priceAmount"]);
    assert_eq!("CNY", payload["data"]["items"][1]["currencyCode"]);
    assert_eq!(100, payload["data"]["items"][1]["grantAmount"]);
    assert_eq!("1000.00", payload["data"]["items"][8]["priceAmount"]);
    assert_eq!("CNY", payload["data"]["items"][8]["currencyCode"]);
    assert_eq!(10000, payload["data"]["items"][8]["grantAmount"]);
    assert!(items.iter().all(|item| item["currencyCode"] == "CNY"));
}

#[tokio::test]
async fn app_recharge_router_creates_current_tenant_order_from_default_seed_package() {
    let pool = migrated_pool().await;
    upsert_sqlite_commerce_experience_seed(&pool)
        .await
        .expect("commerce experience seed");
    sqlx::query(
        r#"
        UPDATE commerce_payment_method
        SET status = 'active'
        WHERE tenant_id = '0'
          AND organization_id = '0'
          AND method_key = 'alipay'
        "#,
    )
    .execute(&pool)
    .await
    .expect("activate seeded payment method");
    let inspect_pool = pool.clone();
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/recharges/orders",
            Body::from(
                r#"{"clientRequestNo":"seed-recharge-1","amount":"5.00","currencyCode":"CNY","packageId":"seed-recharge-package-cny-500","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("recharge response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(true, payload["data"]["success"]);
    assert_eq!("5.00", payload["data"]["amount"]);
    assert_eq!("CNY", payload["data"]["currencyCode"]);
    assert_eq!(50, payload["data"]["points"]);
    assert_eq!("wechat_pay", payload["data"]["providerCode"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
    assert_eq!("wechat_native", payload["data"]["paymentProduct"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert_eq!("scan_qr", payload["data"]["nextAction"]);
    assert_eq!(
        payload["data"]["cashierUrl"],
        payload["data"]["qrCodePayload"]
    );
    assert_eq!(
        serde_json::Value::Null,
        payload["data"]["requestPaymentPayload"]
    );

    let order_no = payload["data"]["orderNo"].as_str().expect("orderNo");
    let row: (String, String, String) = sqlx::query_as(
        r#"
        SELECT tenant_id, organization_id, owner_user_id
        FROM commerce_order
        WHERE order_no = ?
        "#,
    )
    .bind(order_no)
    .fetch_one(&inspect_pool)
    .await
    .expect("created order row");
    assert_eq!("tenant-1", row.0);
    assert_eq!("org-1", row.1);
    assert_eq!("user-1", row.2);
}

#[tokio::test]
async fn app_recharge_router_serves_recharge_settings_for_current_tenant() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/recharges/settings",
            Body::empty(),
        ))
        .await
        .expect("settings response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("CNY", payload["data"]["baseCurrencyCode"]);
    assert_eq!("10", payload["data"]["basePointsPerCny"]);
    assert_eq!("1", payload["data"]["currencyToCnyRates"]["CNY"]);
    assert_eq!("7", payload["data"]["currencyToCnyRates"]["USD"]);
    assert_eq!(
        50,
        payload["data"]["previewExamples"]["CNY"]["5"]["grantAmount"]
    );
    assert_eq!(
        350,
        payload["data"]["previewExamples"]["USD"]["5"]["grantAmount"]
    );
}

#[tokio::test]
async fn app_recharge_router_creates_recharge_order_and_checkout_reads_status() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .clone()
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/recharges/orders",
            Body::from(r#"{"amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10"}"#),
        ))
        .await
        .expect("recharge response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(true, payload["data"]["success"]);
    assert_eq!("10.00", payload["data"]["amount"]);
    assert_eq!("CNY", payload["data"]["currencyCode"]);
    assert_eq!(125, payload["data"]["points"]);
    assert_eq!("wechat_pay", payload["data"]["providerCode"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
    assert_eq!("wechat_native", payload["data"]["paymentProduct"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert_eq!("scan_qr", payload["data"]["nextAction"]);
    let order_no = payload["data"]["orderNo"]
        .as_str()
        .expect("orderNo")
        .to_owned();
    let expected_cashier_url = format!(
        "https://im.sdkwork.com/cashier?scene=recharge&orderId={order_no}&outTradeNo={}",
        payload["data"]["outTradeNo"].as_str().unwrap_or_default()
    );
    assert_eq!(expected_cashier_url, payload["data"]["cashierUrl"]);
    assert_eq!(expected_cashier_url, payload["data"]["qrCodePayload"]);
    assert_eq!(
        serde_json::Value::Null,
        payload["data"]["requestPaymentPayload"]
    );

    let response = app
        .oneshot(subject_request(
            "GET",
            &format!("/app/v3/api/recharges/orders/{order_no}"),
            Body::empty(),
        ))
        .await
        .expect("checkout response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(order_no, payload["data"]["orderNo"]);
    assert_eq!("10.00", payload["data"]["amount"]);
    assert_eq!("CNY", payload["data"]["currencyCode"]);
    assert_eq!(125, payload["data"]["points"]);
    assert_eq!("wechat_pay", payload["data"]["providerCode"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
    assert_eq!("wechat_native", payload["data"]["paymentProduct"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert_eq!("pending", payload["data"]["paymentStatus"]);
    assert_eq!("scan_qr", payload["data"]["nextAction"]);
    assert_eq!(
        format!(
            "https://im.sdkwork.com/cashier?scene=recharge&orderId={order_no}&outTradeNo={}",
            payload["data"]["outTradeNo"].as_str().expect("outTradeNo")
        ),
        payload["data"]["qrCodePayload"]
    );
    assert_eq!(
        payload["data"]["cashierUrl"],
        payload["data"]["qrCodePayload"]
    );
    assert_eq!(
        serde_json::Value::Null,
        payload["data"]["requestPaymentPayload"]
    );
}

#[tokio::test]
async fn app_recharge_router_reuses_pending_unpaid_order_for_same_user_package_amount_and_currency()
{
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let inspect_pool = pool.clone();
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let first_response = app
        .clone()
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-reuse-1",
            "recharge-request-reuse-1",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-1","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("first recharge response");

    assert_eq!(StatusCode::OK, first_response.status());
    let first_payload = response_json(first_response).await;
    assert_eq!("2000", first_payload["code"]);
    let first_order_no = first_payload["data"]["orderNo"]
        .as_str()
        .expect("first order no")
        .to_owned();
    let first_out_trade_no = first_payload["data"]["outTradeNo"]
        .as_str()
        .expect("first out trade no")
        .to_owned();

    let second_response = app
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-reuse-2",
            "recharge-request-reuse-2",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-2","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("second recharge response");

    assert_eq!(StatusCode::OK, second_response.status());
    let second_payload = response_json(second_response).await;
    assert_eq!("2000", second_payload["code"]);
    assert_eq!(first_order_no, second_payload["data"]["orderNo"]);
    assert_eq!(first_out_trade_no, second_payload["data"]["outTradeNo"]);
    assert_eq!(
        first_payload["data"]["cashierUrl"],
        second_payload["data"]["cashierUrl"]
    );
    assert_eq!(
        first_payload["data"]["qrCodePayload"],
        second_payload["data"]["qrCodePayload"]
    );
    assert_eq!(
        first_payload["data"]["points"],
        second_payload["data"]["points"]
    );

    let order_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_order
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND subject = 'points_recharge'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("recharge order count");
    assert_eq!(1, order_count);

    let payment_intent_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_payment_intent
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("recharge payment intent count");
    assert_eq!(1, payment_intent_count);

    let payment_attempt_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_payment_attempt
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("recharge payment attempt count");
    assert_eq!(1, payment_attempt_count);
}

#[tokio::test]
async fn app_recharge_router_reuses_original_package_order_after_switching_packages_with_fallback_method(
) {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    sqlx::query(
        r#"
        UPDATE commerce_payment_method
        SET status = 'inactive'
        WHERE tenant_id = 'tenant-1'
          AND organization_id = 'org-1'
          AND method_key = 'wechat'
        "#,
    )
    .execute(&pool)
    .await
    .expect("deactivate preferred method");
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_method
            (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('method-alipay', 'tenant-1', 'org-1', 'alipay', 'Alipay', 'alipay', 'active', 2, 'seed-method-alipay', 'seed-method-alipay', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    )
    .execute(&pool)
    .await
    .expect("insert fallback method");
    let inspect_pool = pool.clone();
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let package_a_first = app
        .clone()
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-switch-a-1",
            "recharge-request-switch-a-1",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-switch-a-1","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("package a first response");

    assert_eq!(StatusCode::OK, package_a_first.status());
    let package_a_first_payload = response_json(package_a_first).await;
    assert_eq!("2000", package_a_first_payload["code"]);
    assert_eq!("alipay", package_a_first_payload["data"]["paymentMethod"]);
    let package_a_order_no = package_a_first_payload["data"]["orderNo"]
        .as_str()
        .expect("package a order no")
        .to_owned();

    let package_b_response = app
        .clone()
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-switch-b-1",
            "recharge-request-switch-b-1",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-switch-b-1","amount":"20.00","currencyCode":"CNY","packageId":"pack-tenant-20","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("package b response");

    assert_eq!(StatusCode::OK, package_b_response.status());
    let package_b_payload = response_json(package_b_response).await;
    assert_eq!("2000", package_b_payload["code"]);
    assert_eq!("alipay", package_b_payload["data"]["paymentMethod"]);
    assert_ne!(package_a_order_no, package_b_payload["data"]["orderNo"]);

    let package_a_second = app
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-switch-a-2",
            "recharge-request-switch-a-2",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-switch-a-2","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("package a second response");

    assert_eq!(StatusCode::OK, package_a_second.status());
    let package_a_second_payload = response_json(package_a_second).await;
    assert_eq!("2000", package_a_second_payload["code"]);
    assert_eq!("alipay", package_a_second_payload["data"]["paymentMethod"]);
    assert_eq!(
        package_a_order_no,
        package_a_second_payload["data"]["orderNo"]
    );

    let order_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_order
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND subject = 'points_recharge'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("recharge order count after switch");
    assert_eq!(2, order_count);

    let package_a_order_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_payment_attempt
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND amount = '10.00'
          AND currency_code = 'CNY'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("package a payment attempt count");
    assert_eq!(1, package_a_order_count);
}

#[tokio::test]
async fn app_recharge_router_creates_new_order_after_previous_package_order_is_paid() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let inspect_pool = pool.clone();
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let first_response = app
        .clone()
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-paid-1",
            "recharge-request-paid-1",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-paid-1","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("first paid-scene response");

    assert_eq!(StatusCode::OK, first_response.status());
    let first_payload = response_json(first_response).await;
    let first_order_no = first_payload["data"]["orderNo"]
        .as_str()
        .expect("first paid-scene order no")
        .to_owned();

    sqlx::query(
        r#"
        UPDATE commerce_order
        SET status = 'paid',
            paid_at = '2026-05-20 10:05:00',
            updated_at = '2026-05-20 10:05:00'
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND order_no = ?1
        "#,
    )
    .bind(&first_order_no)
    .execute(&inspect_pool)
    .await
    .expect("mark order paid");

    sqlx::query(
        r#"
        UPDATE commerce_payment_intent
        SET status = 'succeeded',
            updated_at = '2026-05-20 10:05:00'
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND order_id = (
              SELECT id
              FROM commerce_order
              WHERE tenant_id = 'tenant-1'
                AND owner_user_id = 'user-1'
                AND order_no = ?1
          )
        "#,
    )
    .bind(&first_order_no)
    .execute(&inspect_pool)
    .await
    .expect("mark payment intent succeeded");

    sqlx::query(
        r#"
        UPDATE commerce_payment_attempt
        SET status = 'succeeded',
            paid_at = '2026-05-20 10:05:00',
            updated_at = '2026-05-20 10:05:00'
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND order_id = (
              SELECT id
              FROM commerce_order
              WHERE tenant_id = 'tenant-1'
                AND owner_user_id = 'user-1'
                AND order_no = ?1
          )
        "#,
    )
    .bind(&first_order_no)
    .execute(&inspect_pool)
    .await
    .expect("mark payment attempt succeeded");

    let second_response = app
        .oneshot(subject_request_with_idempotency(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-paid-2",
            "recharge-request-paid-2",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-paid-2","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("second paid-scene response");

    assert_eq!(StatusCode::OK, second_response.status());
    let second_payload = response_json(second_response).await;
    let second_order_no = second_payload["data"]["orderNo"]
        .as_str()
        .expect("second paid-scene order no");
    assert_ne!(first_order_no, second_order_no);

    let package_order_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*)
        FROM commerce_order
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND subject = 'points_recharge'
          AND currency_code = 'CNY'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("paid-scene recharge order count");
    assert_eq!(2, package_order_count);
}

#[tokio::test]
async fn app_recharge_router_does_not_use_frontend_request_id_as_business_request_no() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let inspect_pool = pool.clone();
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request_with_request_id_header_only(
            "POST",
            "/app/v3/api/recharges/orders",
            "recharge-idem-header-only",
            Body::from(r#"{"amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10"}"#),
        ))
        .await
        .expect("recharge response");

    assert_eq!(response.status(), StatusCode::OK);
    let order_no: String = sqlx::query_scalar(
        r#"
        SELECT order_no
        FROM commerce_order
        WHERE tenant_id = 'tenant-1'
          AND owner_user_id = 'user-1'
          AND idempotency_key = 'recharge-idem-header-only'
        "#,
    )
    .fetch_one(&inspect_pool)
    .await
    .expect("order number");
    let frontend_request_id_order_no =
        expected_recharge_order_no("123e4567-e89b-12d3-a456-426614174000");
    let server_owned_order_no =
        expected_recharge_order_no("points-recharge-user-1-10.00-wechat-recharge-idem-header-only");
    assert_ne!(frontend_request_id_order_no, order_no);
    assert_eq!(server_owned_order_no, order_no);
}

#[tokio::test]
async fn app_recharge_router_accepts_standard_top_level_payload() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/recharges/orders",
            Body::from(
                r#"{"clientRequestNo":"console-recharge-1","amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10","source":"console-recharge"}"#,
            ),
        ))
        .await
        .expect("recharge response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(true, payload["data"]["success"]);
    assert_eq!("10.00", payload["data"]["amount"]);
    assert_eq!("CNY", payload["data"]["currencyCode"]);
    assert_eq!(125, payload["data"]["points"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
}

#[tokio::test]
async fn app_recharge_router_allows_public_recharge_reads_but_still_requires_auth_for_order_create()
{
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let packages_response = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/recharges/packages")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("packages response");
    assert_eq!(StatusCode::OK, packages_response.status());

    let settings_response = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/recharges/settings")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("settings response");
    assert_eq!(StatusCode::OK, settings_response.status());

    let create_response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/recharges/orders")
                .header("content-type", "application/json")
                .header("Idempotency-Key", "public-recharge-idem")
                .body(Body::from(
                    r#"{"amount":"10.00","currencyCode":"CNY","packageId":"pack-owner-10"}"#,
                ))
                .expect("request"),
        )
        .await
        .expect("response");

    assert_eq!(StatusCode::UNAUTHORIZED, create_response.status());
    let payload = response_json(create_response).await;
    assert_eq!("4010", payload["code"]);
}

fn expected_recharge_order_no(request_no: &str) -> String {
    let seed = format!("tenant-1|org-1|user-1|10.00|wechat|{request_no}|recharge-idem-header-only");
    format!("RC{}", stable_hex_token(&seed))
}

fn stable_hex_token(value: &str) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in value.bytes() {
        hash ^= u64::from(byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("{hash:016x}")
}
