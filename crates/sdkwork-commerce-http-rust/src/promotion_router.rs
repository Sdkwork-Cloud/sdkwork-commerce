use axum::extract::{Extension, Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use sdkwork_commerce_core::CommerceServiceError;
use sdkwork_commerce_promotion::{
    PointsBalance, PointsBalanceQuery, PointsHistoryItem, PointsHistoryQuery,
    PromotionCodeRedemptionCommand, PromotionCodeRedemptionOutcome, PromotionUserCouponItem,
    PromotionUserCouponListQuery,
};
use sdkwork_commerce_storage_sqlx::{PostgresCommercePromotionStore, SqliteCommercePromotionStore};
use sdkwork_iam_core::IamAppContext;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, SqlitePool};
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use crate::subject::{app_runtime_subject_from_extension, AppRuntimeSubject};
use crate::with_request_identity;

const IDEMPOTENCY_KEY_HEADER: &str = "Idempotency-Key";
const REQUEST_NO_HEADER: &str = "Sdkwork-Request-No";
const MAX_PROMOTION_CODE_LEN: usize = 128;

pub type CommercePromotionFuture<'a, T> =
    Pin<Box<dyn Future<Output = Result<T, CommerceServiceError>> + Send + 'a>>;

pub trait CommercePromotionStore: Send + Sync {
    fn list_promotion_user_coupons<'a>(
        &'a self,
        query: PromotionUserCouponListQuery,
    ) -> CommercePromotionFuture<'a, Vec<PromotionUserCouponItem>>;

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> CommercePromotionFuture<'a, PointsBalance>;

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> CommercePromotionFuture<'a, Vec<PointsHistoryItem>>;

    fn redeem_promotion_code<'a>(
        &'a self,
        command: PromotionCodeRedemptionCommand,
    ) -> CommercePromotionFuture<'a, PromotionCodeRedemptionOutcome>;
}

#[derive(Clone)]
struct AppPromotionState {
    store: Arc<dyn CommercePromotionStore>,
}

#[derive(Debug, Deserialize)]
struct CouponListQueryParams {
    status: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PromotionCodeRedemptionRequest {
    code: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppPromotionApiResult<T: Serialize> {
    code: String,
    msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PromotionUserCouponItemResponse {
    id: String,
    code: String,
    amount: String,
    date: String,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PointsBalanceResponse {
    available_points: i64,
    frozen_points: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PointsHistoryItemResponse {
    id: String,
    amount: i64,
    direction: String,
    balance_after: i64,
    business_type: String,
    created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PromotionCodeRedemptionOutcomeResponse {
    message: String,
    amount: String,
    credited_points: i64,
    balance: i64,
}

impl CommercePromotionStore for SqliteCommercePromotionStore {
    fn list_promotion_user_coupons<'a>(
        &'a self,
        query: PromotionUserCouponListQuery,
    ) -> CommercePromotionFuture<'a, Vec<PromotionUserCouponItem>> {
        Box::pin(async move { self.list_promotion_user_coupons(query).await })
    }

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> CommercePromotionFuture<'a, PointsBalance> {
        Box::pin(async move { self.retrieve_points_balance(query).await })
    }

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> CommercePromotionFuture<'a, Vec<PointsHistoryItem>> {
        Box::pin(async move { self.list_points_history(query).await })
    }

    fn redeem_promotion_code<'a>(
        &'a self,
        command: PromotionCodeRedemptionCommand,
    ) -> CommercePromotionFuture<'a, PromotionCodeRedemptionOutcome> {
        Box::pin(async move { self.redeem_promotion_code(command).await })
    }
}

impl CommercePromotionStore for PostgresCommercePromotionStore {
    fn list_promotion_user_coupons<'a>(
        &'a self,
        query: PromotionUserCouponListQuery,
    ) -> CommercePromotionFuture<'a, Vec<PromotionUserCouponItem>> {
        Box::pin(async move { self.list_promotion_user_coupons(query).await })
    }

    fn retrieve_points_balance<'a>(
        &'a self,
        query: PointsBalanceQuery,
    ) -> CommercePromotionFuture<'a, PointsBalance> {
        Box::pin(async move { self.retrieve_points_balance(query).await })
    }

    fn list_points_history<'a>(
        &'a self,
        query: PointsHistoryQuery,
    ) -> CommercePromotionFuture<'a, Vec<PointsHistoryItem>> {
        Box::pin(async move { self.list_points_history(query).await })
    }

    fn redeem_promotion_code<'a>(
        &'a self,
        command: PromotionCodeRedemptionCommand,
    ) -> CommercePromotionFuture<'a, PromotionCodeRedemptionOutcome> {
        Box::pin(async move { self.redeem_promotion_code(command).await })
    }
}

impl<T: Serialize> AppPromotionApiResult<T> {
    fn success(data: T) -> Self {
        Self {
            code: "2000".to_owned(),
            msg: "SUCCESS".to_owned(),
            data: Some(data),
        }
    }
}

impl AppPromotionApiResult<()> {
    fn error(code: impl Into<String>, msg: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            msg: msg.into(),
            data: None,
        }
    }
}

pub fn app_promotion_router_with_sqlite_pool(pool: SqlitePool) -> Router {
    app_promotion_router_with_store(Arc::new(SqliteCommercePromotionStore::new(pool)))
}

pub fn app_promotion_router_with_postgres_pool(pool: PgPool) -> Router {
    app_promotion_router_with_store(Arc::new(PostgresCommercePromotionStore::new(pool)))
}

pub fn app_promotion_router_with_store(store: Arc<dyn CommercePromotionStore>) -> Router {
    with_request_identity(
        Router::new()
            .route(
                "/app/v3/api/promotions/user_coupons",
                get(fetch_promotion_user_coupons),
            )
            .route("/app/v3/api/wallet/points", get(fetch_points_balance))
            .route(
                "/app/v3/api/wallet/points/history",
                get(fetch_points_history),
            )
            .route(
                "/app/v3/api/promotions/codes/redemptions",
                post(redeem_promotion_code),
            )
            .with_state(AppPromotionState { store }),
    )
}

async fn fetch_promotion_user_coupons(
    State(state): State<AppPromotionState>,
    runtime_context: Option<Extension<IamAppContext>>,
    Query(query): Query<CouponListQueryParams>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let query = match PromotionUserCouponListQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        query.status.as_deref(),
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.list_promotion_user_coupons(query).await {
        Ok(items) => Json(AppPromotionApiResult::success(
            items
                .into_iter()
                .map(map_promotion_user_coupon)
                .collect::<Vec<_>>(),
        ))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

async fn fetch_points_balance(
    State(state): State<AppPromotionState>,
    runtime_context: Option<Extension<IamAppContext>>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let query = match PointsBalanceQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.retrieve_points_balance(query).await {
        Ok(balance) => {
            Json(AppPromotionApiResult::success(map_points_balance(balance))).into_response()
        }
        Err(error) => commerce_error_response(error),
    }
}

async fn fetch_points_history(
    State(state): State<AppPromotionState>,
    runtime_context: Option<Extension<IamAppContext>>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let query = match PointsHistoryQuery::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
    ) {
        Ok(query) => query,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.list_points_history(query).await {
        Ok(items) => Json(AppPromotionApiResult::success(
            items
                .into_iter()
                .map(map_points_history)
                .collect::<Vec<_>>(),
        ))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

async fn redeem_promotion_code(
    State(state): State<AppPromotionState>,
    runtime_context: Option<Extension<IamAppContext>>,
    headers: HeaderMap,
    Json(request): Json<PromotionCodeRedemptionRequest>,
) -> Response {
    let subject = match app_runtime_subject_from_extension(runtime_context) {
        Ok(subject) => subject,
        Err(message) => return unauthorized_response(message),
    };
    let code = match validate_promotion_code_redemption_request(request) {
        Ok(code) => code,
        Err(message) => return validation_response(message),
    };
    let idempotency_key = match required_text_header(&headers, IDEMPOTENCY_KEY_HEADER) {
        Ok(value) => value,
        Err(response) => return response,
    };
    let request_no = optional_text_header(&headers, REQUEST_NO_HEADER)
        .unwrap_or_else(|| fallback_request_no(&subject, &code, &idempotency_key));
    let command = match PromotionCodeRedemptionCommand::new(
        &subject.tenant_id,
        subject.organization_id.as_deref(),
        &subject.user_id,
        &code,
        &request_no,
        &idempotency_key,
    ) {
        Ok(command) => command,
        Err(error) => return commerce_error_response(error),
    };

    match state.store.redeem_promotion_code(command).await {
        Ok(outcome) => Json(AppPromotionApiResult::success(
            map_promotion_code_redemption_outcome(outcome),
        ))
        .into_response(),
        Err(error) => commerce_error_response(error),
    }
}

#[allow(clippy::result_large_err)]
fn required_text_header(headers: &HeaderMap, name: &'static str) -> Result<String, Response> {
    let value = headers
        .get(name)
        .ok_or_else(|| unauthorized_response(format!("{name} header is required")))?
        .to_str()
        .map(str::trim)
        .map_err(|_| unauthorized_response(format!("{name} header value is invalid")))?;
    if value.is_empty() {
        return Err(unauthorized_response(format!("{name} header is required")));
    }
    Ok(value.to_owned())
}

fn optional_text_header(headers: &HeaderMap, name: &'static str) -> Option<String> {
    headers
        .get(name)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
}

fn validate_promotion_code_redemption_request(
    request: PromotionCodeRedemptionRequest,
) -> Result<String, String> {
    let code = request.code.unwrap_or_default().trim().to_owned();
    if code.is_empty() {
        return Err("promotion code must not be empty".to_owned());
    }
    if code.chars().count() > MAX_PROMOTION_CODE_LEN {
        return Err(format!(
            "promotion code length must not exceed {MAX_PROMOTION_CODE_LEN} characters"
        ));
    }
    if !code.bytes().all(|byte| (0x21..=0x7e).contains(&byte)) {
        return Err("promotion code must contain only visible ASCII characters".to_owned());
    }
    Ok(code)
}

fn map_promotion_user_coupon(value: PromotionUserCouponItem) -> PromotionUserCouponItemResponse {
    PromotionUserCouponItemResponse {
        id: value.id,
        code: value.code,
        amount: value.amount.as_str().to_owned(),
        date: value.date,
        status: value.status,
    }
}

fn map_points_balance(value: PointsBalance) -> PointsBalanceResponse {
    PointsBalanceResponse {
        available_points: value.available_points,
        frozen_points: value.frozen_points,
    }
}

fn map_points_history(value: PointsHistoryItem) -> PointsHistoryItemResponse {
    PointsHistoryItemResponse {
        id: value.id,
        amount: value.amount,
        direction: value.direction,
        balance_after: value.balance_after,
        business_type: value.business_type,
        created_at: value.created_at,
    }
}

fn map_promotion_code_redemption_outcome(
    value: PromotionCodeRedemptionOutcome,
) -> PromotionCodeRedemptionOutcomeResponse {
    PromotionCodeRedemptionOutcomeResponse {
        message: value.message,
        amount: value.amount.as_str().to_owned(),
        credited_points: value.credited_points,
        balance: value.balance,
    }
}

fn commerce_error_response(error: CommerceServiceError) -> Response {
    match error.code() {
        "validation" => validation_response(error.message()),
        "unauthenticated" | "unauthorized" => unauthorized_response(error.message().to_owned()),
        "not-found" => (
            StatusCode::NOT_FOUND,
            Json(AppPromotionApiResult::error("4040", error.message())),
        )
            .into_response(),
        "conflict" | "invalid-state" | "unsupported-capability" => (
            StatusCode::CONFLICT,
            Json(AppPromotionApiResult::error("4090", error.message())),
        )
            .into_response(),
        _ => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(AppPromotionApiResult::error("5000", error.message())),
        )
            .into_response(),
    }
}

fn unauthorized_response(message: String) -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(AppPromotionApiResult::error("4010", message)),
    )
        .into_response()
}

fn validation_response(message: impl Into<String>) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(AppPromotionApiResult::error("4001", message)),
    )
        .into_response()
}

fn fallback_request_no(subject: &AppRuntimeSubject, code: &str, idempotency_key: &str) -> String {
    let code_part = code
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.') {
                character
            } else {
                '-'
            }
        })
        .collect::<String>();
    format!(
        "promotion-code-redemption-{}-{}-{}",
        subject.user_id,
        code_part,
        stable_header_token(idempotency_key),
    )
}

fn stable_header_token(value: &str) -> String {
    value
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.') {
                character
            } else {
                '-'
            }
        })
        .collect()
}
