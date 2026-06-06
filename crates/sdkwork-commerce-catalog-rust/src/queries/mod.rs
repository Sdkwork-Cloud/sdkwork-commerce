use sdkwork_commerce_core::CommerceServiceError;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProductSpuListQuery {
    pub category_id: Option<String>,
    pub organization_id: Option<String>,
    pub page: Option<i64>,
    pub page_size: Option<i64>,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProductSkuListQuery {
    pub organization_id: Option<String>,
    pub spu_id: Option<String>,
    pub tenant_id: String,
}

impl ProductSpuListQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
        category_id: Option<&str>,
        page: Option<i64>,
        page_size: Option<i64>,
    ) -> Result<Self, CommerceServiceError> {
        if let Some(page) = page {
            if page < 1 {
                return Err(CommerceServiceError::validation(
                    "page must be greater than or equal to 1",
                ));
            }
        }
        if let Some(page_size) = page_size {
            if !(1..=200).contains(&page_size) {
                return Err(CommerceServiceError::validation(
                    "page_size must be between 1 and 200",
                ));
            }
        }

        Ok(Self {
            category_id: optional_text(category_id),
            organization_id: optional_text(organization_id),
            page,
            page_size,
            tenant_id: required_text("tenant_id", tenant_id)?,
        })
    }
}

impl ProductSkuListQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
        spu_id: Option<&str>,
    ) -> Result<Self, CommerceServiceError> {
        Ok(Self {
            organization_id: optional_text(organization_id),
            spu_id: optional_text(spu_id),
            tenant_id: required_text("tenant_id", tenant_id)?,
        })
    }
}

fn required_text(field_name: &str, value: &str) -> Result<String, CommerceServiceError> {
    crate::validation::require_non_empty(field_name, value)?;
    Ok(value.trim().to_string())
}

fn optional_text(value: Option<&str>) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_string)
}
