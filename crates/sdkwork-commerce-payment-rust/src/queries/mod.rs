#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RechargePackageListQuery {
    pub organization_id: Option<String>,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RechargeSettingsQuery {
    pub organization_id: Option<String>,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CheckoutStatusQuery {
    pub order_no: String,
    pub organization_id: Option<String>,
    pub owner_user_id: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentRecordListQuery {
    pub organization_id: Option<String>,
    pub owner_user_id: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentRecordDetailQuery {
    pub organization_id: Option<String>,
    pub owner_user_id: String,
    pub payment_id: String,
    pub tenant_id: String,
}

impl RechargePackageListQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
    ) -> Result<Self, sdkwork_commerce_core::CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;

        Ok(Self {
            organization_id: optional_text(organization_id),
            tenant_id: tenant_id.trim().to_string(),
        })
    }

    pub fn public() -> Self {
        Self {
            organization_id: None,
            tenant_id: String::new(),
        }
    }
}

impl RechargeSettingsQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
    ) -> Result<Self, sdkwork_commerce_core::CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;

        Ok(Self {
            organization_id: optional_text(organization_id),
            tenant_id: tenant_id.trim().to_string(),
        })
    }

    pub fn public() -> Self {
        Self {
            organization_id: None,
            tenant_id: String::new(),
        }
    }
}

impl CheckoutStatusQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
        owner_user_id: &str,
        order_no: &str,
    ) -> Result<Self, sdkwork_commerce_core::CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("owner_user_id", owner_user_id)?;
        crate::validation::require_non_empty("order_no", order_no)?;

        Ok(Self {
            order_no: order_no.trim().to_string(),
            organization_id: optional_text(organization_id),
            owner_user_id: owner_user_id.trim().to_string(),
            tenant_id: tenant_id.trim().to_string(),
        })
    }
}

impl PaymentRecordListQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
        owner_user_id: &str,
    ) -> Result<Self, sdkwork_commerce_core::CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("owner_user_id", owner_user_id)?;

        Ok(Self {
            organization_id: optional_text(organization_id),
            owner_user_id: owner_user_id.trim().to_string(),
            tenant_id: tenant_id.trim().to_string(),
        })
    }
}

impl PaymentRecordDetailQuery {
    pub fn new(
        tenant_id: &str,
        organization_id: Option<&str>,
        owner_user_id: &str,
        payment_id: &str,
    ) -> Result<Self, sdkwork_commerce_core::CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("owner_user_id", owner_user_id)?;
        crate::validation::require_non_empty("payment_id", payment_id)?;

        Ok(Self {
            organization_id: optional_text(organization_id),
            owner_user_id: owner_user_id.trim().to_string(),
            payment_id: payment_id.trim().to_string(),
            tenant_id: tenant_id.trim().to_string(),
        })
    }
}

fn optional_text(value: Option<&str>) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_string)
}
