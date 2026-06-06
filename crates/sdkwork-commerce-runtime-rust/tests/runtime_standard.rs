use sdkwork_commerce_core::{DeploymentMode, Environment, OperationExecutionPolicy};
use sdkwork_commerce_runtime::{
    commerce_runtime_capability_manifest, first_slice_capability_manifest,
    first_slice_service_names, operation_contracts, operation_service_bindings,
    CommerceRuntimeConfig,
};

#[test]
fn validates_local_and_private_runtime_configurations() {
    let local = CommerceRuntimeConfig::new(
        "sdkwork-local",
        DeploymentMode::Local,
        Environment::Development,
        "sqlite://sdkwork-commerce.db",
    )
    .unwrap();
    let private = CommerceRuntimeConfig::new(
        "sdkwork-private",
        DeploymentMode::Private,
        Environment::Production,
        "postgres://commerce",
    )
    .unwrap();

    assert_eq!(local.app_id, "sdkwork-local");
    assert_eq!(private.database_url, "postgres://commerce");
}

#[test]
fn rejects_saas_as_a_local_private_rust_execution_mode() {
    assert!(CommerceRuntimeConfig::new(
        "sdkwork-saas",
        DeploymentMode::Saas,
        Environment::Production,
        "postgres://commerce",
    )
    .is_err());
}

#[test]
fn exposes_first_slice_capabilities_and_service_names() {
    assert_eq!(
        first_slice_service_names(),
        vec![
            "core",
            "account",
            "catalog",
            "inventory",
            "promotion",
            "order",
            "payment",
            "membership",
            "invoice"
        ],
    );

    let manifest = first_slice_capability_manifest();
    assert!(manifest.contains(&"commerce.account.summary"));
    assert!(manifest.contains(&"commerce.catalog.product"));
    assert!(manifest.contains(&"commerce.catalog.priceList"));
    assert!(manifest.contains(&"commerce.catalog.sku"));
    assert!(manifest.contains(&"commerce.catalog.cart"));
    assert!(manifest.contains(&"commerce.catalog.address"));
    assert!(manifest.contains(&"commerce.inventory.stock"));
    assert!(manifest.contains(&"commerce.inventory.reservation"));
    assert!(manifest.contains(&"commerce.inventory.ledger"));
    assert!(manifest.contains(&"commerce.promotion.offer"));
    assert!(manifest.contains(&"commerce.promotion.couponStock"));
    assert!(manifest.contains(&"commerce.promotion.code"));
    assert!(manifest.contains(&"commerce.promotion.userCoupon"));
    assert!(manifest.contains(&"commerce.promotion.discountApplication"));
    assert!(manifest.contains(&"commerce.promotion.discountAllocation"));
    assert!(manifest.contains(&"commerce.promotion.points"));
    assert!(manifest.contains(&"commerce.order.checkout"));
    assert!(manifest.contains(&"commerce.order.lifecycle"));
    assert!(manifest.contains(&"commerce.order.fulfillment"));
    assert!(manifest.contains(&"commerce.payment.intent"));
    assert!(manifest.contains(&"commerce.payment.provider"));
    assert!(manifest.contains(&"commerce.payment.recharge"));
    assert!(manifest.contains(&"commerce.membership.current"));
    assert!(manifest.contains(&"commerce.membership.plan"));
    assert!(manifest.contains(&"commerce.membership.member"));
    assert!(manifest.contains(&"commerce.invoice.application"));
    assert!(!manifest.contains(&"commerce.catalog.spu"));
    assert!(!manifest.contains(&"commerce.account.preflight"));
}

#[test]
fn runtime_capability_manifest_composes_every_runtime_contract_for_bootstrap() {
    let manifest = commerce_runtime_capability_manifest();

    assert_eq!(manifest.name, "sdkwork-commerce-runtime");
    assert_eq!(manifest.runtime_version, "commerce.runtime.v1");
    assert_eq!(manifest.service_names, first_slice_service_names());
    assert_eq!(manifest.capability_flags, first_slice_capability_manifest());
    assert_eq!(manifest.operation_contracts, operation_contracts());
    assert_eq!(
        manifest.operation_service_bindings,
        operation_service_bindings()
    );
    assert_eq!(
        manifest.operation_input_type,
        "CommerceRuntimeOperationInput"
    );
    assert_eq!(
        manifest.operation_output_type,
        "CommerceRuntimeOperationEnvelope"
    );
    assert_eq!(
        manifest.idempotency_store_port,
        "CommerceRuntimeIdempotencyStore"
    );
    assert_eq!(
        manifest.transaction_manager_port,
        "CommerceRuntimeTransactionManager"
    );
}

#[test]
fn runtime_capability_manifest_is_complete_for_first_slice_local_private_host() {
    let manifest = commerce_runtime_capability_manifest();
    let operation_contract_count = operation_contracts().len();
    let operation_binding_count = operation_service_bindings().len();

    assert_eq!(manifest.service_names.len(), 9);
    assert_eq!(manifest.service_contracts.len(), 8);
    assert_eq!(manifest.operation_contracts.len(), operation_contract_count);
    assert_eq!(
        manifest.operation_service_bindings.len(),
        operation_binding_count
    );
    assert_eq!(operation_contract_count, operation_binding_count);
    assert!(manifest
        .service_contracts
        .iter()
        .all(|contract| contract.requires_idempotency_for_writes));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "checkout.sessions.orders.create"
                && contract.service_name == "commerce.order"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "memberships.packageGroups.list"
                && contract.service_name == "commerce.membership"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "memberships.purchases.create"
                && contract.service_name == "commerce.membership"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "wallet.adjustments.create"
                && contract.service_name == "commerce.account"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "payments.intents.attempts.create"
                && contract.service_name == "commerce.payment"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(|contract| contract.operation_id == "catalog.products.list"
            && contract.service_name == "commerce.catalog"));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(|contract| contract.operation_id == "catalog.spus.list"
            && contract.service_name == "commerce.catalog"));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "inventory.stocks.update"
                && contract.service_name == "commerce.inventory"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(|contract| contract.operation_id == "orders.create"
            && contract.service_name == "commerce.order"));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "wallet.transactions.list"
                && contract.service_name == "commerce.account"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .any(
            |contract| contract.operation_id == "reports.commerceOverview.retrieve"
                && contract.service_name == "commerce.order"
        ));
    assert!(manifest
        .operation_contracts
        .iter()
        .all(|contract| contract.operation_id != "memberships.activate"));
    assert!(manifest
        .operation_contracts
        .iter()
        .all(|contract| !contract.operation_id.starts_with("checkout.preflight.")));
    assert!(manifest
        .operation_contracts
        .iter()
        .all(|contract| !contract.operation_id.starts_with("catalog.spu.")));
}

#[test]
fn promotion_points_operation_contracts_are_registered_with_standard_policy() {
    let contracts = operation_contracts();

    for operation_id in [
        "promotions.offers.list",
        "promotions.userCoupons.list",
        "wallet.exchangeRate.retrieve",
        "wallet.points.exchangeRules.list",
    ] {
        let contract = contracts
            .iter()
            .find(|contract| contract.operation_id == operation_id)
            .unwrap_or_else(|| panic!("missing operation contract: {operation_id}"));

        assert_eq!(contract.service_name, "commerce.promotion");
        assert_eq!(
            contract.execution_policy,
            OperationExecutionPolicy::ReadOnly
        );
        assert!(!contract.requires_transaction());
        assert!(!contract.requires_idempotency());
    }

    let redeem = contracts
        .iter()
        .find(|contract| contract.operation_id == "promotions.codes.redemptions.create")
        .expect("promotion code redemption operation contract");

    assert_eq!(redeem.service_name, "commerce.promotion");
    assert_eq!(
        redeem.execution_policy,
        OperationExecutionPolicy::TransactionalWrite
    );
    assert_eq!(redeem.capability_name, "commerce.promotion.code");
    assert!(redeem.requires_transaction());
    assert!(redeem.requires_idempotency());
}

#[test]
fn wallet_operation_contracts_are_registered_with_account_runtime_policy() {
    let contracts = operation_contracts();

    for operation_id in [
        "accounts.current.summary.retrieve",
        "wallet.tokens.retrieve",
        "wallet.overview.retrieve",
        "wallet.accounts.list",
        "wallet.ledgerEntries.list",
        "wallet.ledgerEntries.retrieve",
        "billing.history.list",
    ] {
        let contract = contracts
            .iter()
            .find(|contract| contract.operation_id == operation_id)
            .unwrap_or_else(|| panic!("missing operation contract: {operation_id}"));

        assert_eq!(contract.service_name, "commerce.account");
        assert_eq!(
            contract.execution_policy,
            OperationExecutionPolicy::ReadOnly
        );
        assert!(!contract.requires_transaction());
        assert!(!contract.requires_idempotency());
    }

    let adjustment = contracts
        .iter()
        .find(|contract| contract.operation_id == "wallet.adjustments.create")
        .expect("wallet adjustment operation contract");

    assert_eq!(adjustment.service_name, "commerce.account");
    assert_eq!(
        adjustment.execution_policy,
        OperationExecutionPolicy::TransactionalWrite
    );
    assert_eq!(adjustment.capability_name, "commerce.account.wallet");
    assert!(adjustment.requires_transaction());
    assert!(adjustment.requires_idempotency());
}
