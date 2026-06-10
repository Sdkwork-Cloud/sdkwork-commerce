#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceShopServiceAreaKeyError {
    pub code: &'static str,
    pub message: String,
}

pub fn commerce_shop_service_area_key(
    country_code: &str,
    region_code: Option<&str>,
    city_code: Option<&str>,
    postal_code_pattern: Option<&str>,
    delivery_radius_meters: Option<i64>,
) -> Result<String, CommerceShopServiceAreaKeyError> {
    let radius_key = match delivery_radius_meters {
        Some(meters) if meters < 0 => {
            return Err(service_area_key_error(
                "delivery_radius_meters must be zero or positive",
            ));
        }
        Some(meters) => meters.to_string(),
        None => wildcard(),
    };

    Ok([
        normalize_country_code(country_code),
        normalize_optional_scope(region_code),
        normalize_optional_scope(city_code),
        normalize_optional_scope(postal_code_pattern),
        radius_key,
    ]
    .join("|"))
}

fn normalize_country_code(value: &str) -> String {
    let normalized = value.trim().to_ascii_uppercase();
    if normalized.is_empty() {
        wildcard()
    } else {
        normalized
    }
}

fn normalize_optional_scope(value: Option<&str>) -> String {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_ascii_lowercase)
        .unwrap_or_else(wildcard)
}

fn wildcard() -> String {
    "*".to_string()
}

fn service_area_key_error(message: impl Into<String>) -> CommerceShopServiceAreaKeyError {
    CommerceShopServiceAreaKeyError {
        code: "commerce-shop-service-area-radius-invalid",
        message: message.into(),
    }
}
