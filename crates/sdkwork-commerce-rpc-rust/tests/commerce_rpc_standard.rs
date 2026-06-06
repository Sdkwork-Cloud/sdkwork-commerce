use sdkwork_commerce_rpc::{
    all_commerce_rpc_service_manifests, commerce_app_rpc_service_manifests,
};
use sdkwork_rpc_core::validate_manifest;

#[test]
fn commerce_rpc_manifests_use_standard_packages_and_validate() {
    let manifests = all_commerce_rpc_service_manifests();

    assert!(manifests
        .iter()
        .any(|manifest| manifest.package_name == "sdkwork.commerce.app.v3"));
    assert!(manifests
        .iter()
        .any(|manifest| manifest.package_name == "sdkwork.commerce.backend.v3"));

    for manifest in &manifests {
        assert!(validate_manifest(manifest).is_ok(), "{manifest:?}");
    }
}

#[test]
fn commerce_app_rpc_owns_wallet_and_checkout_operations() {
    let operation_ids: Vec<&str> = commerce_app_rpc_service_manifests()
        .into_iter()
        .flat_map(|manifest| {
            manifest
                .methods
                .into_iter()
                .map(|method| method.operation_id)
                .collect::<Vec<_>>()
        })
        .collect();

    assert!(operation_ids.contains(&"wallet.overview.retrieve"));
    assert!(operation_ids.contains(&"wallet.accounts.list"));
    assert!(operation_ids.contains(&"wallet.ledgerEntries.list"));
    assert!(operation_ids.contains(&"checkout.sessions.create"));
    assert!(operation_ids.contains(&"checkout.sessions.retrieve"));
    assert!(operation_ids.contains(&"checkout.sessions.quotes.create"));
    assert!(operation_ids.contains(&"checkout.sessions.orders.create"));
}

#[test]
fn commerce_backend_rpc_does_not_expose_app_checkout_operations() {
    let backend_operations: Vec<&str> = all_commerce_rpc_service_manifests()
        .into_iter()
        .filter(|manifest| manifest.surface == "backend")
        .flat_map(|manifest| {
            manifest
                .methods
                .into_iter()
                .map(|method| method.operation_id)
                .collect::<Vec<_>>()
        })
        .collect();

    assert!(!backend_operations.contains(&"checkout.sessions.create"));
    assert!(!backend_operations
        .iter()
        .any(|operation_id| operation_id.starts_with("wallet.")));
}

#[test]
fn commerce_rpc_operation_ids_are_backed_by_existing_http_route_contracts() {
    for operation_id in all_commerce_rpc_service_manifests()
        .into_iter()
        .flat_map(|manifest| {
            manifest
                .methods
                .into_iter()
                .map(|method| method.operation_id)
                .collect::<Vec<_>>()
        })
    {
        assert!(
            STANDARD_COMMERCE_HTTP_OPERATION_IDS.contains(&operation_id),
            "missing standard HTTP parity for {operation_id}"
        );
    }
}

const STANDARD_COMMERCE_HTTP_OPERATION_IDS: &[&str] = &[
    "wallet.overview.retrieve",
    "wallet.accounts.list",
    "wallet.ledgerEntries.list",
    "checkout.sessions.create",
    "checkout.sessions.retrieve",
    "checkout.sessions.quotes.create",
    "checkout.sessions.orders.create",
    "payments.providerAccounts.list",
    "payments.providerAccounts.create",
    "payments.methods.management.list",
    "payments.channels.list",
    "payments.intents.list",
    "payments.attempts.list",
    "payments.reconciliationRuns.list",
    "commerceReports.usageStatements.list",
    "commerceReports.paymentReconciliation.retrieve",
    "commerceReports.orderRevenue.list",
    "commerceReports.refunds.list",
];
