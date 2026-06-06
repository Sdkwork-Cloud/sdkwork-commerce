use sdkwork_commerce_core::CommerceServiceContract;

pub fn order_service_contract() -> CommerceServiceContract {
    CommerceServiceContract::new(
        "order",
        "commerce.order",
        vec![
            "checkout.sessions.create",
            "checkout.sessions.quotes.create",
            "checkout.sessions.orders.create",
            "orders.cancellations.create",
        ],
        vec![
            "checkout.sessions.retrieve",
            "orders.list",
            "orders.retrieve",
            "orders.events.list",
            "fulfillments.list",
            "fulfillments.retrieve",
            "shipments.list",
            "shipments.retrieve",
            "shipments.trackingEvents.list",
            "commerceReports.orderRevenue.list",
            "audit.commerceEvents.list",
        ],
        vec![
            crate::ports::ORDER_REPOSITORY_PORT,
            crate::ports::IDEMPOTENCY_REPOSITORY_PORT,
        ],
        true,
    )
}
