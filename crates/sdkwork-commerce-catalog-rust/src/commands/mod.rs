use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateProductSpuCommand {
    pub idempotency_key: String,
    pub request_no: String,
    pub spu_no: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateProductSkuCommand {
    pub idempotency_key: String,
    pub price_amount: CommerceMoney,
    pub request_no: String,
    pub sku_no: String,
    pub spu_id: String,
    pub tenant_id: String,
}

impl CreateProductSpuCommand {
    pub fn new(
        tenant_id: &str,
        spu_no: &str,
        request_no: &str,
        idempotency_key: &str,
    ) -> Result<Self, CommerceServiceError> {
        Ok(Self {
            idempotency_key: required_text("idempotency_key", idempotency_key)?,
            request_no: required_text("request_no", request_no)?,
            spu_no: required_text("spu_no", spu_no)?,
            tenant_id: required_text("tenant_id", tenant_id)?,
        })
    }
}

impl CreateProductSkuCommand {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        tenant_id: &str,
        spu_id: &str,
        sku_no: &str,
        price_amount: CommerceMoney,
        request_no: &str,
        idempotency_key: &str,
    ) -> Result<Self, CommerceServiceError> {
        Ok(Self {
            idempotency_key: required_text("idempotency_key", idempotency_key)?,
            price_amount,
            request_no: required_text("request_no", request_no)?,
            sku_no: required_text("sku_no", sku_no)?,
            spu_id: required_text("spu_id", spu_id)?,
            tenant_id: required_text("tenant_id", tenant_id)?,
        })
    }
}

fn required_text(field_name: &str, value: &str) -> Result<String, CommerceServiceError> {
    crate::validation::require_non_empty(field_name, value)?;
    Ok(value.trim().to_string())
}
