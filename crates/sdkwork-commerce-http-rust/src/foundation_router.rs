use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use axum::extract::{Extension, Path, Query, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_commerce_core::CommerceServiceError;
use sdkwork_commerce_payment::{PaymentRecordDetailQuery, PaymentRecordItem};
use sdkwork_commerce_promotion::{
    AppCommerceExchangeRuleItem, AppCommerceExchangeRuleQuery, AppCommerceSubject,
};
use sdkwork_commerce_storage_sqlx::{
    PostgresCommerceExchangeStore, PostgresCommercePaymentRecordStore, SqliteCommerceExchangeStore,
    SqliteCommercePaymentRecordStore,
};
use sdkwork_iam_core::IamAppContext;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, SqlitePool};

use crate::subject::app_runtime_subject_from_extension;
use crate::with_request_identity;
const MAX_ASSET_TYPE_LEN: usize = 32;
const POINTS_ASSET_TYPE: &str = "POINTS";
const CASH_ASSET_TYPE: &str = "CASH";

pub type CommerceFoundationFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, CommerceServiceError>> + Send + 'a>>;

pub trait CommerceFoundationStore: Send + Sync {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Vec<AppCommerceExchangeRuleItem>>;

    fn load_points_exchange_rate<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Option<AppCommerceExchangeRuleItem>>;

    fn retrieve_payment_record<'a>(
        &'a self,
        query: PaymentRecordDetailQuery,
    ) -> CommerceFoundationFuture<'a, PaymentRecordItem>;
}

#[derive(Clone)]
struct AppCommerceFoundationState {
    store: Option<Arc<dyn CommerceFoundationStore>>,
    require_subject: bool,
}

#[derive(Debug, Deserialize)]
struct ExchangeRulesQueryRequest {
    #[serde(rename = "source_asset_type", alias = "sourceAssetType")]
    source_asset_type: Option<String>,
    #[serde(rename = "target_asset_type", alias = "targetAssetType")]
    target_asset_type: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppCommerceFoundationApiResult<T: Serialize> {
    code: String,
    msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppCommerceExchangeRuleResponse {
    id: String,
    source_asset_type: String,
    target_asset_type: String,
    rate: String,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppCommercePointsExchangeRateResponse {
    source_asset_type: String,
    target_asset_type: String,
    rate: String,
}

#[derive(Clone)]
struct SqliteCommerceFoundationStore {
    exchange_store: SqliteCommerceExchangeStore,
    payment_record_store: SqliteCommercePaymentRecordStore,
}

#[derive(Clone)]
struct PostgresCommerceFoundationStore {
    exchange_store: PostgresCommerceExchangeStore,
    payment_record_store: PostgresCommercePaymentRecordStore,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppCommercePaymentRecordResponse {
    id: String,
    order_no: String,
    method: String,
    amount: String,
    date: String,
    status: String,
}

impl SqliteCommerceFoundationStore {
    fn new(pool: SqlitePool) -> Self {
        Self {
            exchange_store: SqliteCommerceExchangeStore::new(pool.clone()),
            payment_record_store: SqliteCommercePaymentRecordStore::new(pool),
        }
    }
}

impl PostgresCommerceFoundationStore {
    fn new(pool: PgPool) -> Self {
        Self {
            exchange_store: PostgresCommerceExchangeStore::new(pool.clone()),
            payment_record_store: PostgresCommercePaymentRecordStore::new(pool),
        }
    }
}

impl CommerceFoundationStore for SqliteCommerceFoundationStore {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Vec<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { self.exchange_store.list_exchange_rules(query).await })
    }

    fn load_points_exchange_rate<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Option<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { self.exchange_store.load_points_exchange_rate(query).await })
    }

    fn retrieve_payment_record<'a>(
        &'a self,
        query: PaymentRecordDetailQuery,
    ) -> CommerceFoundationFuture<'a, PaymentRecordItem> {
        Box::pin(async move {
            self.payment_record_store
                .retrieve_payment_record(query)
                .await
        })
    }
}

impl CommerceFoundationStore for PostgresCommerceFoundationStore {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Vec<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { self.exchange_store.list_exchange_rules(query).await })
    }

    fn load_points_exchange_rate<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> CommerceFoundationFuture<'a, Option<AppCommerceExchangeRuleItem>> {
        Box::pin(async move { self.exchange_store.load_points_exchange_rate(query).await })
    }

    fn retrieve_payment_record<'a>(
        &'a self,
        query: PaymentRecordDetailQuery,
    ) -> CommerceFoundationFuture<'a, PaymentRecordItem> {
        Box::pin(async move {
            self.payment_record_store
                .retrieve_payment_record(query)
                .await
        })
    }
}

impl<T: Serialize> AppCommerceFoundationApiResult<T> {
    fn success(data: T) -> Self {
        Self {
            code: "2000".to_owned(),
            msg: "SUCCESS".to_owned(),
            data: Some(data),
        }
    }
}

impl AppCommerceFoundationApiResult<()> {
    fn error(code: impl Into<String>, msg: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            msg: msg.into(),
            data: None,
        }
    }
}

pub fn app_commerce_foundation_router() -> Router {
    app_commerce_foundation_router_with_state(AppCommerceFoundationState {
        store: None,
        require_subject: false,
    })
}

pub fn app_commerce_foundation_router_with_sqlite_pool(pool: SqlitePool) -> Router {
    app_commerce_foundation_router_with_store(Arc::new(SqliteCommerceFoundationStore::new(pool)))
}

pub fn app_commerce_foundation_router_with_postgres_pool(pool: PgPool) -> Router {
    app_commerce_foundation_router_with_store(Arc::new(PostgresCommerceFoundationStore::new(pool)))
}

pub fn app_commerce_foundation_router_with_store(
    store: Arc<dyn CommerceFoundationStore>,
) -> Router {
    app_commerce_foundation_router_with_state(AppCommerceFoundationState {
        store: Some(store),
        require_subject: true,
    })
}

fn app_commerce_foundation_router_with_state(state: AppCommerceFoundationState) -> Router {
    with_request_identity(
        Router::new()
            .route(
                "/app/v3/api/wallet/exchange_rate",
                get(points_exchange_rate),
            )
            .route(
                "/app/v3/api/wallet/points/exchanges/rules",
                get(points_exchange_rules),
            )
            .route(
                "/app/v3/api/promotions/user_coupon_claims",
                post(unavailable_command),
            )
            .route(
                "/app/v3/api/payments/intents/{paymentIntentId}/attempts",
                post(unavailable_command_with_path),
            )
            .route(
                "/app/v3/api/payments/attempts/{paymentAttemptId}",
                get(payment_record),
            )
            .with_state(state),
    )
}

async fn points_exchange_rate(
    State(state): State<AppCommerceFoundationState>,
    runtime_context: Option<Extension<IamAppContext>>,
) -> Response {
    let Some(store) = state.store.as_ref() else {
        return unavailable_read().await;
    };
    let subject = match resolve_subject(runtime_context, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let query = AppCommerceExchangeRuleQuery {
        subject,
        source_asset_type: Some(POINTS_ASSET_TYPE.to_owned()),
        target_asset_type: Some(CASH_ASSET_TYPE.to_owned()),
    };

    match store.load_points_exchange_rate(query).await {
        Ok(Some(item)) => Json(AppCommerceFoundationApiResult::success(
            AppCommercePointsExchangeRateResponse {
                source_asset_type: item.source_asset_type,
                target_asset_type: item.target_asset_type,
                rate: item.rate,
            },
        ))
        .into_response(),
        Ok(None) => not_found_response("exchange rule was not found"),
        Err(error) => commerce_error_response("exchange rule read model is unavailable", error),
    }
}

async fn points_exchange_rules(
    State(state): State<AppCommerceFoundationState>,
    Query(params): Query<ExchangeRulesQueryRequest>,
    runtime_context: Option<Extension<IamAppContext>>,
) -> Response {
    let Some(store) = state.store.as_ref() else {
        return empty_list().await;
    };
    let subject = match resolve_subject(runtime_context, state.require_subject) {
        Ok(subject) => subject,
        Err(response) => return response,
    };
    let source_asset_type = match normalize_optional_asset_type(params.source_asset_type.as_deref())
    {
        Ok(value) => value,
        Err(message) => return validation_response(message),
    };
    let target_asset_type = match normalize_optional_asset_type(params.target_asset_type.as_deref())
    {
        Ok(value) => value,
        Err(message) => return validation_response(message),
    };

    match store
        .list_exchange_rules(AppCommerceExchangeRuleQuery {
            subject,
            source_asset_type,
            target_asset_type,
        })
        .await
    {
        Ok(items) => Json(AppCommerceFoundationApiResult::success(
            items.into_iter().map(map_exchange_rule).collect::<Vec<_>>(),
        ))
        .into_response(),
        Err(error) => commerce_error_response("exchange rule read model is unavailable", error),
    }
}

async fn payment_record(
    State(state): State<AppCommerceFoundationState>,
    Path(payment_id): Path<String>,
    runtime_context: Option<Extension<IamAppContext>>,
) -> Response {
    let Some(store) = state.store.as_ref() else {
        return unavailable_read().await;
    };
    let subject = match resolve_subject(runtime_context, state.require_subject) {
        Ok(Some(subject)) => subject,
        Ok(None) => return unavailable_read().await,
        Err(response) => return response,
    };
    let query = match PaymentRecordDetailQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        &payment_id,
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response("payment record query is invalid", error),
    };

    match store.retrieve_payment_record(query).await {
        Ok(item) => Json(AppCommerceFoundationApiResult::success(map_payment_record(
            item,
        )))
        .into_response(),
        Err(error) => commerce_error_response("payment record read model is unavailable", error),
    }
}

async fn empty_list() -> Response {
    Json(AppCommerceFoundationApiResult::success(Vec::<
        serde_json::Value,
    >::new()))
    .into_response()
}

async fn unavailable_command_with_path() -> Response {
    unavailable_command().await
}

async fn unavailable_read() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(AppCommerceFoundationApiResult::error(
            "5010",
            "commerce foundation read model is not configured",
        )),
    )
        .into_response()
}

async fn unavailable_command() -> Response {
    (
        StatusCode::NOT_IMPLEMENTED,
        Json(AppCommerceFoundationApiResult::error(
            "5010",
            "commerce foundation command store is not configured",
        )),
    )
        .into_response()
}

fn resolve_subject(
    runtime_context: Option<Extension<IamAppContext>>,
    required: bool,
) -> Result<Option<AppCommerceSubject>, Response> {
    match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => Ok(Some(AppCommerceSubject {
            tenant_id: subject.tenant_id,
            organization_id: subject.organization_id,
            user_id: subject.user_id,
        })),
        Err(message) if required => Err(unauthorized_response(message)),
        Err(_) => Ok(None),
    }
}

fn normalize_optional_asset_type(value: Option<&str>) -> Result<Option<String>, String> {
    let Some(value) = value.map(str::trim).filter(|value| !value.is_empty()) else {
        return Ok(None);
    };
    let normalized = value.to_ascii_uppercase();
    if normalized.chars().count() > MAX_ASSET_TYPE_LEN {
        return Err(format!(
            "asset type must be at most {MAX_ASSET_TYPE_LEN} characters"
        ));
    }
    if !normalized
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
    {
        return Err("asset type may only contain letters, numbers, -, and _".to_owned());
    }
    if normalized != POINTS_ASSET_TYPE && normalized != CASH_ASSET_TYPE {
        return Err("exchange rule currently supports POINTS to CASH only".to_owned());
    }
    Ok(Some(normalized))
}

fn map_exchange_rule(value: AppCommerceExchangeRuleItem) -> AppCommerceExchangeRuleResponse {
    AppCommerceExchangeRuleResponse {
        id: value.id,
        source_asset_type: value.source_asset_type,
        target_asset_type: value.target_asset_type,
        rate: value.rate,
        status: value.status,
    }
}

fn map_payment_record(value: PaymentRecordItem) -> AppCommercePaymentRecordResponse {
    AppCommercePaymentRecordResponse {
        id: value.id,
        order_no: value.order_no,
        method: value.method,
        amount: value.amount.as_str().to_owned(),
        date: value.date,
        status: value.status,
    }
}

fn commerce_error_response(context: &str, error: CommerceServiceError) -> Response {
    match error.code() {
        "validation" => validation_response(error.message()),
        "unauthenticated" | "unauthorized" => unauthorized_response(error.message().to_owned()),
        "not-found" => not_found_response(error.message()),
        "conflict" | "invalid-state" | "unsupported-capability" => (
            StatusCode::CONFLICT,
            Json(AppCommerceFoundationApiResult::error(
                "4090",
                error.message(),
            )),
        )
            .into_response(),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(AppCommerceFoundationApiResult::error(
                "5000",
                format!("{context}: {}", error.message()),
            )),
        )
            .into_response(),
    }
}

fn unauthorized_response(message: String) -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(AppCommerceFoundationApiResult::error("4010", message)),
    )
        .into_response()
}

fn validation_response(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(AppCommerceFoundationApiResult::error(
            "4001",
            message.into(),
        )),
    )
        .into_response()
}

fn not_found_response(message: impl Into<String>) -> Response {
    (
        StatusCode::NOT_FOUND,
        Json(AppCommerceFoundationApiResult::error(
            "4040",
            message.into(),
        )),
    )
        .into_response()
}
