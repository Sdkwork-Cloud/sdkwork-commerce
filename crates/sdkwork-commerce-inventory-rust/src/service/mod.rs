use sdkwork_commerce_core::CommerceServiceContract;

pub fn inventory_service_contract() -> CommerceServiceContract {
    CommerceServiceContract::new(
        "inventory",
        "commerce.inventory",
        vec!["inventory.stocks.update"],
        vec![
            "inventory.stocks.list",
            "inventory.reservations.list",
            "inventory.ledgerEntries.list",
        ],
        vec![
            crate::ports::INVENTORY_REPOSITORY_PORT,
            crate::ports::IDEMPOTENCY_REPOSITORY_PORT,
        ],
        true,
    )
}
