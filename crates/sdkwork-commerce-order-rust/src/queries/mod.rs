#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OrderListQuery {
    pub owner_user_id: String,
    pub status: Option<String>,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OrderDetailQuery {
    pub order_id: String,
    pub tenant_id: String,
}
