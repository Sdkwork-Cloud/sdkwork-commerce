use sdkwork_commerce_storage_sqlx::{
    commerce_business_repository_sql_catalogs, commerce_database_indexes, commerce_database_tables,
    commerce_idempotency_repository_sql_contract, commerce_initial_migration_sql,
    commerce_migration_names, commerce_migration_plan, commerce_migration_runner_execution_plan,
    commerce_migration_runner_execution_result, commerce_migration_runner_failed_execution_result,
    commerce_migration_runner_failure_recovery, commerce_migration_runner_final_state,
    commerce_migration_runner_lock_acquire_outcome, commerce_migration_runner_lock_cleanup,
    commerce_migration_runner_lock_lifecycle, commerce_migration_runner_lock_record,
    commerce_migration_runner_preflight, commerce_migration_runner_sql_contract,
    commerce_repository_bindings, commerce_storage_applied_migration_record,
    commerce_storage_capability_manifest, commerce_transaction_boundary_sql_contract,
    validate_commerce_migration_plan, validate_commerce_migration_runner_execution_plan,
    validate_commerce_migration_runner_execution_result,
    validate_commerce_migration_runner_failure_recovery,
    validate_commerce_migration_runner_final_state,
    validate_commerce_migration_runner_lock_cleanup,
    validate_commerce_migration_runner_lock_lifecycle,
    validate_commerce_migration_runner_sql_contract,
};

#[test]
fn exposes_first_slice_commerce_table_catalog() {
    let tables = commerce_database_tables();

    assert_eq!(tables.len(), 68);
    assert!(tables.contains(&"commerce_idempotency_key"));
    assert!(tables.contains(&"commerce_account"));
    assert!(tables.contains(&"commerce_account_ledger_entry"));
    assert!(tables.contains(&"commerce_billing_prehold"));
    assert!(tables.contains(&"commerce_billing_history"));
    assert!(tables.contains(&"benefit_definition"));
    assert!(tables.contains(&"entitlement_grant"));
    assert!(tables.contains(&"entitlement_account"));
    assert!(tables.contains(&"entitlement_ledger_entry"));
    assert!(tables.contains(&"membership_plan"));
    assert!(tables.contains(&"membership_plan_version"));
    assert!(tables.contains(&"membership_plan_benefit"));
    assert!(tables.contains(&"membership_package_group"));
    assert!(tables.contains(&"membership_package"));
    assert!(tables.contains(&"membership_subscription"));
    assert!(tables.contains(&"membership_period"));
    assert!(tables.contains(&"promotion_offer"));
    assert!(tables.contains(&"promotion_offer_version"));
    assert!(tables.contains(&"promotion_coupon_stock"));
    assert!(tables.contains(&"promotion_code"));
    assert!(tables.contains(&"promotion_user_coupon"));
    assert!(tables.contains(&"promotion_coupon_ledger_entry"));
    assert!(tables.contains(&"promotion_discount_application"));
    assert!(tables.contains(&"promotion_discount_allocation"));
    assert!(tables.contains(&"commerce_product_category"));
    assert!(tables.contains(&"commerce_product_attribute"));
    assert!(tables.contains(&"commerce_product_attribute_value"));
    assert!(tables.contains(&"commerce_product_spu"));
    assert!(tables.contains(&"commerce_product_sku"));
    assert!(tables.contains(&"commerce_product_sku_attribute_value"));
    assert!(tables.contains(&"commerce_recharge_package"));
    assert!(tables.contains(&"commerce_inventory_stock"));
    assert!(tables.contains(&"commerce_inventory_reservation"));
    assert!(tables.contains(&"commerce_inventory_movement"));
    assert!(tables.contains(&"commerce_cart"));
    assert!(tables.contains(&"commerce_cart_item"));
    assert!(tables.contains(&"commerce_user_address"));
    assert!(tables.contains(&"commerce_order"));
    assert!(tables.contains(&"commerce_order_item"));
    assert!(tables.contains(&"commerce_order_amount_breakdown"));
    assert!(tables.contains(&"commerce_payment_intent"));
    assert!(tables.contains(&"commerce_payment_attempt"));
    assert!(tables.contains(&"commerce_payment_webhook_event"));
    assert!(tables.contains(&"commerce_payment_method"));
    assert!(tables.contains(&"commerce_payment_provider"));
    assert!(tables.contains(&"commerce_payment_provider_account"));
    assert!(tables.contains(&"commerce_payment_channel"));
    assert!(tables.contains(&"commerce_payment_route_rule"));
    assert!(tables.contains(&"commerce_payment_provider_capability"));
    assert!(tables.contains(&"commerce_payment_operation_attempt"));
    assert!(tables.contains(&"commerce_payment_route_decision"));
    assert!(tables.contains(&"commerce_payment_capture"));
    assert!(tables.contains(&"commerce_payment_webhook_delivery"));
    assert!(tables.contains(&"commerce_payment_statement"));
    assert!(tables.contains(&"commerce_payment_statement_item"));
    assert!(tables.contains(&"commerce_payment_reconciliation_item"));
    assert!(tables.contains(&"commerce_payment_fee"));
    assert!(tables.contains(&"commerce_payment_dispute"));
    assert!(tables.contains(&"commerce_payment_dispute_event"));
    assert!(tables.contains(&"commerce_refund"));
    assert!(tables.contains(&"commerce_refund_item"));
    assert!(tables.contains(&"commerce_refund_attempt"));
    assert!(tables.contains(&"commerce_refund_event"));
    assert!(tables.contains(&"commerce_exchange_rule"));
    assert!(tables.contains(&"commerce_invoice_title"));
    assert!(tables.contains(&"commerce_invoice"));
    assert!(tables.contains(&"commerce_invoice_item"));

    for legacy_table in [
        "commerce_coupon_template",
        "commerce_coupon_issue_batch",
        "commerce_coupon",
        "commerce_coupon_redemption",
        "commerce_membership_plan",
        "commerce_membership_package_group",
        "commerce_membership_package",
        "commerce_membership",
        "commerce_membership_entitlement",
        "commerce_membership_entitlement_usage",
    ] {
        assert!(
            !tables.contains(&legacy_table),
            "legacy commerce storage table must be removed: {legacy_table}",
        );
    }

    for table in tables {
        assert!(
            table.starts_with("commerce_")
                || table.starts_with("benefit_")
                || table.starts_with("entitlement_")
                || table.starts_with("membership_")
                || table.starts_with("promotion_")
        );
        assert!(!table.contains("__"));
        assert!(!table.starts_with("plus_"));
    }
}

#[test]
fn first_slice_migrations_are_domain_ordered() {
    assert_eq!(
        commerce_migration_names(),
        vec![
            "0001_core_idempotency.sql",
            "0002_account_ledger.sql",
            "0003_benefit.sql",
            "0004_entitlement.sql",
            "0005_membership.sql",
            "0006_promotion.sql",
            "0007_catalog.sql",
            "0008_inventory.sql",
            "0009_order.sql",
            "0010_payment_refund.sql",
            "0011_exchange.sql",
            "0012_invoice.sql",
            "0013_billing_history.sql",
        ],
    );
}

#[test]
fn initial_migration_declares_first_slice_tables_and_columns() {
    let sql = commerce_initial_migration_sql();

    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_idempotency_key"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_account"));
    assert!(sql.contains("tenant_id"));
    assert!(sql.contains("organization_id"));
    assert!(sql.contains("owner_user_id"));
    assert!(sql.contains("asset_type"));
    assert!(sql.contains("available_amount"));
    assert!(sql.contains("frozen_amount"));
    assert!(sql.contains("version"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_account_ledger_entry"));
    assert!(sql.contains("request_no"));
    assert!(sql.contains("idempotency_key"));
    assert!(sql.contains("balance_after"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_billing_prehold"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_billing_history"));
    assert!(sql.contains("history_no"));
    assert!(sql.contains("history_type"));
    assert!(sql.contains("direction"));
    assert!(sql.contains("asset_type"));
    assert!(sql.contains("points_delta"));
    assert!(sql.contains("source_type"));
    assert!(sql.contains("source_id"));
    assert!(sql.contains("related_order_no"));
    assert!(sql.contains("payment_method"));
    assert!(sql.contains("occurred_at"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS benefit_definition"));
    assert!(sql.contains("benefit_code"));
    assert!(sql.contains("value_unit"));
    assert!(sql.contains("measurement_type"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS entitlement_grant"));
    assert!(sql.contains("grant_no"));
    assert!(sql.contains("subject_type"));
    assert!(sql.contains("subject_id"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS entitlement_account"));
    assert!(sql.contains("total_granted"));
    assert!(sql.contains("total_used"));
    assert!(sql.contains("balance"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS entitlement_ledger_entry"));
    assert!(sql.contains("ledger_no"));
    assert!(sql.contains("balance_after"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_plan"));
    assert!(sql.contains("plan_code"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_plan_version"));
    assert!(sql.contains("version_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_plan_benefit"));
    assert!(sql.contains("benefit_id"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_package_group"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_package"));
    assert!(sql.contains("billing_cycle"));
    assert!(sql.contains("duration_days"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_subscription"));
    assert!(sql.contains("subscription_no"));
    assert!(sql.contains("current_period_id"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS membership_period"));
    assert!(sql.contains("period_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_offer"));
    assert!(sql.contains("offer_no"));
    assert!(sql.contains("offer_code"));
    assert!(sql.contains("current_offer_version_id TEXT NOT NULL"));
    assert!(!sql.contains("current_version_id TEXT"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_offer_version"));
    assert!(sql.contains("discount_type"));
    assert!(sql.contains("rule_json"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_coupon_stock"));
    assert!(sql.contains("stock_no"));
    assert!(sql.contains("name TEXT NOT NULL"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_code"));
    assert!(sql.contains("promotion_code"));
    assert!(sql.contains("offer_version_id TEXT NOT NULL"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_user_coupon"));
    assert!(sql.contains("coupon_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_coupon_ledger_entry"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_discount_application"));
    assert!(sql.contains("application_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS promotion_discount_allocation"));
    assert!(sql.contains("UNIQUE (tenant_id, coupon_code)"));
    assert!(sql.contains("UNIQUE (tenant_id, offer_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, stock_no)"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_coupon_template"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_coupon_issue_batch"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_coupon ("));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_coupon_redemption"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_category"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_attribute"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_attribute_value"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_spu"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_spu_category"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_sku"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_product_sku_attribute_value"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_recharge_package"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_product ("));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_sku ("));
    assert!(sql.contains("spu_no"));
    assert!(sql.contains("product_type"));
    assert!(sql.contains("delivery_mode"));
    assert!(sql.contains("inventory_tracking"));
    assert!(sql.contains("UNIQUE (tenant_id, spu_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, sku_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, organization_id, external_id)"));
    assert!(sql.contains("UNIQUE (tenant_id, package_no)"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_inventory_stock"));
    assert!(sql.contains("available_quantity"));
    assert!(sql.contains("reserved_quantity"));
    assert!(sql.contains("sold_quantity"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_inventory_reservation"));
    assert!(sql.contains("reservation_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_inventory_movement"));
    assert!(sql.contains("movement_no"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_cart"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_cart_item"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_user_address"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_order"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_order_item"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_order_amount_breakdown"));
    assert!(sql.contains("UNIQUE (tenant_id, order_no)"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_intent"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_attempt"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_webhook_event"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_method"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_provider"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_provider_account"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_channel"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_payment_route_rule"));
    assert!(sql.contains("UNIQUE (tenant_id, provider, out_trade_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, provider, event_id)"));
    assert!(sql.contains("UNIQUE (tenant_id, provider, nonce)"));
    assert!(sql.contains("UNIQUE (tenant_id, organization_id, method_key)"));
    assert!(sql.contains("UNIQUE (tenant_id, organization_id, provider_code)"));
    assert!(sql.contains("UNIQUE (tenant_id, account_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, channel_no)"));
    assert!(sql.contains("UNIQUE (tenant_id, rule_no)"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_refund"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_exchange_rule"));
    assert!(sql.contains("source_asset_type"));
    assert!(sql.contains("target_asset_type"));
    assert!(sql.contains("rate"));
    assert!(!sql.contains("level_code"));
    assert!(!sql.contains("benefits_json"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_membership_plan"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_membership_entitlement"));
    assert!(!sql.contains("CREATE TABLE IF NOT EXISTS commerce_membership_entitlement_usage"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_invoice_title"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_invoice"));
    assert!(sql.contains("CREATE TABLE IF NOT EXISTS commerce_invoice_item"));
    assert!(sql.contains("prehold_no"));
    assert!(sql.contains("expires_at"));
    assert!(sql.contains("settled_at"));
    assert!(sql.contains("released_at"));
}

#[test]
fn initial_migration_declares_standard_query_indexes() {
    let sql = commerce_initial_migration_sql();
    let indexes = commerce_database_indexes();

    let required_indexes = [
        "idx_commerce_idempotency_key_tenant_key",
        "idx_commerce_account_owner_asset",
        "idx_commerce_account_ledger_account_created_at",
        "idx_commerce_account_ledger_request_no",
        "idx_commerce_account_ledger_idempotency_key",
        "idx_commerce_billing_prehold_request_no",
        "idx_commerce_billing_prehold_status_expires_at",
        "idx_commerce_billing_history_owner_occurred_at",
        "idx_commerce_billing_history_owner_type_occurred_at",
        "idx_commerce_billing_history_source",
        "idx_benefit_definition_code_status",
        "idx_entitlement_grant_subject_status",
        "idx_entitlement_grant_source",
        "idx_entitlement_account_subject_status",
        "idx_entitlement_ledger_entry_account_occurred_at",
        "idx_commerce_product_category_parent_status",
        "idx_commerce_product_attribute_status",
        "idx_commerce_product_spu_category_status",
        "idx_commerce_product_spu_category_category",
        "idx_commerce_product_spu_category_spu",
        "idx_commerce_product_spu_type_status",
        "idx_commerce_product_sku_spu_status",
        "idx_commerce_product_sku_price_status",
        "idx_commerce_recharge_package_amount_status",
        "idx_commerce_inventory_stock_sku_warehouse",
        "idx_commerce_inventory_reservation_order_status",
        "idx_commerce_inventory_reservation_expires_at",
        "idx_commerce_inventory_movement_source",
        "idx_commerce_cart_owner_status",
        "idx_commerce_cart_item_cart_sku",
        "idx_commerce_user_address_owner_default",
        "idx_commerce_order_owner_status_created_at",
        "idx_commerce_order_no",
        "idx_commerce_payment_intent_order",
        "idx_commerce_payment_attempt_provider_trade_no",
        "idx_commerce_payment_webhook_event_provider_event",
        "idx_commerce_payment_webhook_event_provider_nonce",
        "idx_commerce_payment_webhook_event_status_processed_at",
        "idx_commerce_payment_method_status",
        "idx_commerce_payment_provider_status",
        "idx_commerce_payment_provider_account_provider",
        "idx_commerce_payment_channel_route",
        "idx_commerce_payment_route_rule_match",
        "idx_commerce_refund_payment",
        "idx_commerce_exchange_rule_pair_status",
        "idx_membership_plan_status",
        "idx_membership_plan_code",
        "idx_membership_plan_version_plan_status",
        "idx_membership_plan_benefit_plan_version",
        "idx_membership_package_group_status",
        "idx_membership_package_status",
        "idx_membership_package_group_plan",
        "idx_membership_subscription_subject_status",
        "idx_membership_period_subscription_range",
        "idx_promotion_offer_status",
        "idx_promotion_offer_code",
        "idx_promotion_offer_current_version",
        "idx_promotion_offer_version_offer_status",
        "idx_promotion_coupon_stock_offer_status",
        "idx_promotion_code_code",
        "idx_promotion_code_stock_status",
        "idx_promotion_user_coupon_subject_status",
        "idx_promotion_discount_application_order",
        "idx_promotion_discount_allocation_application_item",
        "idx_commerce_invoice_order_payment",
        "idx_commerce_invoice_owner_status",
    ];

    for index_name in required_indexes {
        assert!(indexes.contains(&index_name));
        assert!(
            sql.contains(&format!("CREATE INDEX IF NOT EXISTS {index_name}")),
            "missing standard commerce migration index: {index_name}",
        );
    }
}

#[test]
fn repository_bindings_cover_first_slice_storage_boundaries() {
    let bindings = commerce_repository_bindings();

    assert_eq!(
        bindings
            .iter()
            .map(|binding| binding.repository_name)
            .collect::<Vec<_>>(),
        vec![
            "idempotency.repository",
            "account.repository",
            "benefit.repository",
            "entitlement.repository",
            "membership.repository",
            "promotion.repository",
            "catalog.repository",
            "inventory.repository",
            "cart.repository",
            "buyer_address.repository",
            "order.repository",
            "payment.repository",
            "exchange.repository",
            "invoice.repository",
            "billing.repository",
        ],
    );

    let idempotency = bindings
        .iter()
        .find(|binding| binding.repository_name == "idempotency.repository")
        .unwrap();
    assert_eq!(idempotency.domain, "core");
    assert_eq!(idempotency.tables, vec!["commerce_idempotency_key"]);
    assert!(idempotency.requires_transaction);

    let benefit = bindings
        .iter()
        .find(|binding| binding.repository_name == "benefit.repository")
        .unwrap();
    assert_eq!(benefit.domain, "benefit");
    assert_eq!(benefit.tables, vec!["benefit_definition"]);
    assert!(benefit.requires_transaction);

    let entitlement = bindings
        .iter()
        .find(|binding| binding.repository_name == "entitlement.repository")
        .unwrap();
    assert_eq!(entitlement.domain, "entitlement");
    assert_eq!(
        entitlement.tables,
        vec![
            "entitlement_grant",
            "entitlement_account",
            "entitlement_ledger_entry",
        ],
    );
    assert!(entitlement.requires_transaction);

    let membership = bindings
        .iter()
        .find(|binding| binding.repository_name == "membership.repository")
        .unwrap();
    assert_eq!(membership.domain, "membership");
    assert_eq!(
        membership.tables,
        vec![
            "membership_plan",
            "membership_plan_version",
            "membership_plan_benefit",
            "membership_package_group",
            "membership_package",
            "membership_subscription",
            "membership_period",
        ],
    );
    assert!(membership.requires_transaction);

    let promotion = bindings
        .iter()
        .find(|binding| binding.repository_name == "promotion.repository")
        .unwrap();
    assert_eq!(promotion.domain, "promotion");
    assert_eq!(
        promotion.tables,
        vec![
            "promotion_offer",
            "promotion_offer_version",
            "promotion_coupon_stock",
            "promotion_code",
            "promotion_user_coupon",
            "promotion_coupon_ledger_entry",
            "promotion_discount_application",
            "promotion_discount_allocation",
        ],
    );
    assert!(promotion.requires_transaction);

    let catalog = bindings
        .iter()
        .find(|binding| binding.repository_name == "catalog.repository")
        .unwrap();
    assert_eq!(catalog.domain, "catalog");
    assert_eq!(
        catalog.tables,
        vec![
            "commerce_product_category",
            "commerce_product_attribute",
            "commerce_product_attribute_value",
            "commerce_product_spu",
            "commerce_product_sku",
            "commerce_product_sku_attribute_value",
            "commerce_recharge_package",
        ],
    );
    assert!(catalog.requires_transaction);

    let cart = bindings
        .iter()
        .find(|binding| binding.repository_name == "cart.repository")
        .unwrap();
    assert_eq!(cart.domain, "cart");
    assert_eq!(cart.tables, vec!["commerce_cart", "commerce_cart_item"]);
    assert!(cart.requires_transaction);

    let buyer_address = bindings
        .iter()
        .find(|binding| binding.repository_name == "buyer_address.repository")
        .unwrap();
    assert_eq!(buyer_address.domain, "buyer_address");
    assert_eq!(buyer_address.tables, vec!["commerce_user_address"]);
    assert!(buyer_address.requires_transaction);

    let inventory = bindings
        .iter()
        .find(|binding| binding.repository_name == "inventory.repository")
        .unwrap();
    assert_eq!(inventory.domain, "inventory");
    assert_eq!(
        inventory.tables,
        vec![
            "commerce_inventory_stock",
            "commerce_inventory_reservation",
            "commerce_inventory_movement",
        ],
    );
    assert!(inventory.requires_transaction);

    let payment = bindings
        .iter()
        .find(|binding| binding.repository_name == "payment.repository")
        .unwrap();
    assert_eq!(
        payment.tables,
        vec![
            "commerce_payment_intent",
            "commerce_payment_attempt",
            "commerce_payment_webhook_event",
            "commerce_payment_method",
            "commerce_payment_provider",
            "commerce_payment_provider_account",
            "commerce_payment_channel",
            "commerce_payment_route_rule",
            "commerce_refund",
        ],
    );
    assert!(payment.requires_transaction);

    let exchange = bindings
        .iter()
        .find(|binding| binding.repository_name == "exchange.repository")
        .unwrap();
    assert_eq!(exchange.domain, "exchange");
    assert_eq!(exchange.tables, vec!["commerce_exchange_rule"]);
    assert!(exchange.requires_transaction);

    let billing = bindings
        .iter()
        .find(|binding| binding.repository_name == "billing.repository")
        .unwrap();
    assert_eq!(billing.domain, "billing");
    assert_eq!(billing.tables, vec!["commerce_billing_history"]);
    assert!(billing.requires_transaction);
}

#[test]
fn idempotency_repository_sql_contract_matches_runtime_store_port() {
    let contract = commerce_idempotency_repository_sql_contract();

    assert_eq!(contract.repository_name, "idempotency.repository");
    assert_eq!(contract.table, "commerce_idempotency_key");
    assert_eq!(
        contract.columns,
        vec![
            "id",
            "tenant_id",
            "organization_id",
            "scope",
            "idempotency_key",
            "request_hash",
            "response_json",
            "status",
            "locked_until",
            "expires_at",
            "created_at",
            "updated_at",
        ],
    );
    assert_eq!(
        contract.unique_key,
        vec!["tenant_id", "scope", "idempotency_key"],
    );
    assert!(contract.requires_transaction);

    assert_eq!(contract.find_by_key.operation, "find");
    assert_eq!(
        contract.find_by_key.sql,
        "SELECT id, tenant_id, organization_id, scope, idempotency_key, request_hash, response_json, status, locked_until, expires_at, created_at, updated_at FROM commerce_idempotency_key WHERE tenant_id = ? AND scope = ? AND idempotency_key = ? LIMIT 1",
    );
    assert_eq!(
        contract.find_by_key.bindings,
        vec!["tenant_id", "scope", "idempotency_key"],
    );

    assert_eq!(contract.lock_new.operation, "lock");
    assert!(contract
        .lock_new
        .sql
        .starts_with("INSERT INTO commerce_idempotency_key"));
    assert!(contract.lock_new.sql.contains("status"));
    assert!(contract.lock_new.sql.contains("locked_until"));
    assert!(contract.lock_new.sql.contains("expires_at"));
    assert_eq!(
        contract.lock_new.bindings,
        vec![
            "id",
            "tenant_id",
            "organization_id",
            "scope",
            "idempotency_key",
            "request_hash",
            "status",
            "locked_until",
            "expires_at",
            "created_at",
            "updated_at",
        ],
    );

    assert_eq!(contract.complete.operation, "complete");
    assert_eq!(
        contract.complete.sql,
        "UPDATE commerce_idempotency_key SET response_json = ?, status = 'completed', updated_at = ? WHERE tenant_id = ? AND scope = ? AND idempotency_key = ?",
    );
    assert_eq!(
        contract.complete.bindings,
        vec![
            "response_json",
            "updated_at",
            "tenant_id",
            "scope",
            "idempotency_key",
        ],
    );

    assert_eq!(contract.fail.operation, "fail");
    assert_eq!(
        contract.fail.sql,
        "UPDATE commerce_idempotency_key SET status = 'failed', updated_at = ? WHERE tenant_id = ? AND scope = ? AND idempotency_key = ?",
    );
    assert_eq!(
        contract.fail.bindings,
        vec!["updated_at", "tenant_id", "scope", "idempotency_key"],
    );
}

#[test]
fn idempotency_repository_contract_standardizes_sql_conflict_classification() {
    let contract = commerce_idempotency_repository_sql_contract();

    assert_eq!(
        contract.conflict_classifier.table,
        "commerce_idempotency_key"
    );
    assert_eq!(
        contract.conflict_classifier.unique_key,
        vec!["tenant_id", "scope", "idempotency_key"],
    );
    assert_eq!(
        contract.conflict_classifier.error_code,
        "idempotency-key-conflict",
    );
    assert_eq!(
        contract.conflict_classifier.message,
        "idempotency key lock conflicts must be resolved by reading the existing record",
    );

    assert!(contract
        .conflict_classifier
        .matches_constraint("commerce_idempotency_key_tenant_id_scope_idempotency_key_key"));
    assert!(contract
        .conflict_classifier
        .matches_constraint("UNIQUE constraint failed: commerce_idempotency_key.tenant_id, commerce_idempotency_key.scope, commerce_idempotency_key.idempotency_key"));
    assert!(!contract
        .conflict_classifier
        .matches_constraint("commerce_order_tenant_id_order_no_key"));
}

#[test]
fn transaction_boundary_sql_contract_matches_runtime_transaction_manager_port() {
    let contract = commerce_transaction_boundary_sql_contract();

    assert_eq!(
        contract.manager_name,
        "commerce.runtime.transaction-manager"
    );
    assert_eq!(
        contract.scope_fields,
        vec!["operation_id", "service_name", "tenant_id"],
    );
    assert_eq!(contract.begin.operation, "begin");
    assert_eq!(contract.begin.sql, "BEGIN");
    assert!(contract.begin.bindings.is_empty());
    assert_eq!(contract.commit.operation, "commit");
    assert_eq!(contract.commit.sql, "COMMIT");
    assert!(contract.commit.bindings.is_empty());
    assert_eq!(contract.rollback.operation, "rollback");
    assert_eq!(contract.rollback.sql, "ROLLBACK");
    assert!(contract.rollback.bindings.is_empty());
    assert!(contract.rollback_is_required_on_dispatch_error);
    assert!(contract.commit_is_required_after_idempotency_complete);
}

#[test]
fn transaction_boundary_contract_covers_every_transactional_repository() {
    let contract = commerce_transaction_boundary_sql_contract();
    let transactional_repositories = commerce_repository_bindings()
        .into_iter()
        .filter(|binding| binding.requires_transaction)
        .map(|binding| binding.repository_name)
        .collect::<Vec<_>>();

    assert_eq!(contract.covered_repositories, transactional_repositories);
    assert!(contract
        .covered_repositories
        .contains(&"idempotency.repository"));
    assert!(contract.covered_repositories.contains(&"order.repository"));
    assert!(contract
        .covered_repositories
        .contains(&"payment.repository"));
}

#[test]
fn business_repository_sql_catalogs_cover_every_first_slice_business_repository() {
    let catalogs = commerce_business_repository_sql_catalogs();

    assert_eq!(
        catalogs
            .iter()
            .map(|catalog| catalog.repository_name)
            .collect::<Vec<_>>(),
        vec![
            "account.repository",
            "benefit.repository",
            "entitlement.repository",
            "membership.repository",
            "promotion.repository",
            "catalog.repository",
            "inventory.repository",
            "cart.repository",
            "buyer_address.repository",
            "order.repository",
            "payment.repository",
            "exchange.repository",
            "invoice.repository",
            "billing.repository",
        ],
    );

    for catalog in &catalogs {
        let binding = commerce_repository_bindings()
            .into_iter()
            .find(|binding| binding.repository_name == catalog.repository_name)
            .expect("business catalog must have a repository binding");
        assert_eq!(catalog.domain, binding.domain);
        assert_eq!(catalog.tables, binding.tables);
        assert!(catalog.requires_transaction);
        assert_eq!(catalog.tenant_scope_field, "tenant_id");
        assert!(!catalog.operations.is_empty());
        assert!(catalog.operations.iter().any(|operation| operation.is_read));
        assert!(catalog
            .operations
            .iter()
            .any(|operation| operation.is_write));
    }
}

#[test]
fn business_repository_sql_catalogs_standardize_operation_names_and_tables() {
    let catalogs = commerce_business_repository_sql_catalogs();
    let account = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "account.repository")
        .unwrap();
    assert_eq!(
        account
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            ("account.find_by_owner_asset", "commerce_account", false),
            ("account.upsert_account", "commerce_account", true),
            (
                "account.append_ledger_entry",
                "commerce_account_ledger_entry",
                true,
            ),
            ("account.create_prehold", "commerce_billing_prehold", true),
            ("account.settle_prehold", "commerce_billing_prehold", true),
            ("account.release_prehold", "commerce_billing_prehold", true),
        ],
    );

    let billing = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "billing.repository")
        .unwrap();
    assert_eq!(
        billing
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            ("billing.list_history", "commerce_billing_history", false),
            ("billing.append_history", "commerce_billing_history", true),
        ],
    );

    let benefit = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "benefit.repository")
        .unwrap();
    assert_eq!(
        benefit
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            ("benefit.list_definitions", "benefit_definition", false),
            ("benefit.upsert_definition", "benefit_definition", true),
            ("benefit.archive_definition", "benefit_definition", true),
        ],
    );

    let entitlement = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "entitlement.repository")
        .unwrap();
    assert!(entitlement.operations.iter().any(|operation| {
        operation.name == "entitlement.create_grant"
            && operation.table == "entitlement_grant"
            && operation.is_write
    }));
    assert!(entitlement.operations.iter().any(|operation| {
        operation.name == "entitlement.find_account"
            && operation.table == "entitlement_account"
            && operation.is_read
    }));
    assert!(entitlement.operations.iter().any(|operation| {
        operation.name == "entitlement.append_ledger_entry"
            && operation.table == "entitlement_ledger_entry"
            && operation.is_write
    }));

    let membership = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "membership.repository")
        .unwrap();
    assert_eq!(
        membership.tables,
        vec![
            "membership_plan",
            "membership_plan_version",
            "membership_plan_benefit",
            "membership_package_group",
            "membership_package",
            "membership_subscription",
            "membership_period",
        ],
    );
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.list_plans"
            && operation.table == "membership_plan"
            && operation.is_read
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.publish_plan_version"
            && operation.table == "membership_plan_version"
            && operation.is_write
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.upsert_plan_benefit"
            && operation.table == "membership_plan_benefit"
            && operation.is_write
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.list_package_groups"
            && operation.table == "membership_package_group"
            && operation.is_read
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.upsert_package"
            && operation.table == "membership_package"
            && operation.is_write
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.activate_subscription"
            && operation.table == "membership_subscription"
            && operation.is_write
    }));
    assert!(membership.operations.iter().any(|operation| {
        operation.name == "membership.append_period"
            && operation.table == "membership_period"
            && operation.is_write
    }));

    let promotion = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "promotion.repository")
        .unwrap();
    assert_eq!(
        promotion.tables,
        vec![
            "promotion_offer",
            "promotion_offer_version",
            "promotion_coupon_stock",
            "promotion_code",
            "promotion_user_coupon",
            "promotion_coupon_ledger_entry",
            "promotion_discount_application",
            "promotion_discount_allocation",
        ],
    );
    assert!(promotion.operations.iter().any(|operation| {
        operation.name == "promotion.list_offers"
            && operation.table == "promotion_offer"
            && operation.is_read
    }));
    assert!(promotion.operations.iter().any(|operation| {
        operation.name == "promotion.publish_offer_version"
            && operation.table == "promotion_offer_version"
            && operation.is_write
    }));
    assert!(promotion.operations.iter().any(|operation| {
        operation.name == "promotion.create_coupon_stock"
            && operation.table == "promotion_coupon_stock"
            && operation.is_write
    }));
    assert!(promotion.operations.iter().any(|operation| {
        operation.name == "promotion.issue_user_coupon"
            && operation.table == "promotion_user_coupon"
            && operation.is_write
    }));
    assert!(promotion.operations.iter().any(|operation| {
        operation.name == "promotion.apply_discount"
            && operation.table == "promotion_discount_application"
            && operation.is_write
    }));

    let order = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "order.repository")
        .unwrap();
    assert!(order
        .operations
        .iter()
        .any(|operation| operation.name == "order.create_order" && operation.is_write));
    assert!(order
        .operations
        .iter()
        .any(|operation| operation.name == "order.find_by_order_no" && operation.is_read));
    assert!(order
        .operations
        .iter()
        .any(|operation| operation.table == "commerce_order_amount_breakdown"));

    let catalog = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "catalog.repository")
        .unwrap();
    assert_eq!(
        (catalog.domain, catalog.requires_transaction),
        ("catalog", true)
    );
    assert_eq!(
        catalog
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            (
                "catalog.list_categories",
                "commerce_product_category",
                false
            ),
            ("catalog.upsert_category", "commerce_product_category", true),
            (
                "catalog.list_attributes",
                "commerce_product_attribute",
                false
            ),
            (
                "catalog.upsert_attribute",
                "commerce_product_attribute",
                true
            ),
            ("catalog.list_spu", "commerce_product_spu", false),
            ("catalog.upsert_spu", "commerce_product_spu", true),
            ("catalog.list_skus", "commerce_product_sku", false),
            ("catalog.upsert_sku", "commerce_product_sku", true),
            (
                "catalog.list_recharge_packages",
                "commerce_recharge_package",
                false,
            ),
            (
                "catalog.upsert_recharge_package",
                "commerce_recharge_package",
                true,
            ),
        ],
    );

    let inventory = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "inventory.repository")
        .unwrap();
    assert_eq!(
        inventory
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            ("inventory.find_stock", "commerce_inventory_stock", false),
            ("inventory.upsert_stock", "commerce_inventory_stock", true),
            (
                "inventory.create_reservation",
                "commerce_inventory_reservation",
                true,
            ),
            (
                "inventory.consume_reservation",
                "commerce_inventory_reservation",
                true,
            ),
            (
                "inventory.release_reservation",
                "commerce_inventory_reservation",
                true,
            ),
            (
                "inventory.append_movement",
                "commerce_inventory_movement",
                true,
            ),
        ],
    );

    let payment = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "payment.repository")
        .unwrap();
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.create_intent"
            && operation.table == "commerce_payment_intent"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.record_attempt"
            && operation.table == "commerce_payment_attempt"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.list_methods"
            && operation.table == "commerce_payment_method"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.upsert_method"
            && operation.table == "commerce_payment_method"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.list_providers"
            && operation.table == "commerce_payment_provider"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.upsert_provider"
            && operation.table == "commerce_payment_provider"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.list_provider_accounts"
            && operation.table == "commerce_payment_provider_account"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.upsert_provider_account"
            && operation.table == "commerce_payment_provider_account"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.list_channels"
            && operation.table == "commerce_payment_channel"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.upsert_channel"
            && operation.table == "commerce_payment_channel"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.list_route_rules"
            && operation.table == "commerce_payment_route_rule"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.upsert_route_rule"
            && operation.table == "commerce_payment_route_rule"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.find_webhook_event"
            && operation.table == "commerce_payment_webhook_event"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.find_webhook_nonce"
            && operation.table == "commerce_payment_webhook_event"
            && operation.is_read
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.record_webhook_event"
            && operation.table == "commerce_payment_webhook_event"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.finish_webhook_event"
            && operation.table == "commerce_payment_webhook_event"
            && operation.is_write
    }));
    assert!(payment.operations.iter().any(|operation| {
        operation.name == "payment.create_refund"
            && operation.table == "commerce_refund"
            && operation.is_write
    }));

    let exchange = catalogs
        .iter()
        .find(|catalog| catalog.repository_name == "exchange.repository")
        .unwrap();
    assert_eq!(
        exchange
            .operations
            .iter()
            .map(|operation| (operation.name, operation.table, operation.is_write))
            .collect::<Vec<_>>(),
        vec![
            ("exchange.list_rules", "commerce_exchange_rule", false),
            ("exchange.find_rule", "commerce_exchange_rule", false),
            ("exchange.upsert_rule", "commerce_exchange_rule", true),
        ],
    );
}

#[test]
fn storage_capability_manifest_composes_every_storage_contract_for_runtime_bootstrap() {
    let manifest = commerce_storage_capability_manifest();

    assert_eq!(manifest.name, "sdkwork-commerce-storage-sqlx");
    assert_eq!(manifest.schema_version, "commerce.storage.v1");
    assert_eq!(manifest.tables, commerce_database_tables());
    assert_eq!(manifest.indexes, commerce_database_indexes());
    assert_eq!(manifest.migrations, commerce_migration_names());
    assert_eq!(manifest.migration_plan, commerce_migration_plan());
    assert_eq!(
        manifest.migration_runner,
        commerce_migration_runner_sql_contract(),
    );
    assert_eq!(manifest.repository_bindings, commerce_repository_bindings());
    assert_eq!(
        manifest.idempotency_repository,
        commerce_idempotency_repository_sql_contract(),
    );
    assert_eq!(
        manifest.transaction_boundary,
        commerce_transaction_boundary_sql_contract(),
    );
    assert_eq!(
        manifest.business_repositories,
        commerce_business_repository_sql_catalogs(),
    );
}

#[test]
fn migration_runner_sql_contract_exposes_schema_version_table_and_operations() {
    let contract = commerce_migration_runner_sql_contract();

    assert_eq!(contract.runner_name, "commerce.database.migration-runner");
    assert_eq!(contract.schema_version_table, "commerce_schema_migration");
    assert_eq!(
        contract.columns,
        vec![
            "sequence",
            "name",
            "domain",
            "source_path",
            "checksum",
            "applied_at",
        ],
    );
    assert_eq!(contract.unique_key, vec!["sequence", "name"]);
    assert!(contract.requires_transaction);

    assert_eq!(
        contract.ensure_schema_version_table.operation,
        "ensure_schema_version_table"
    );
    assert!(contract
        .ensure_schema_version_table
        .sql
        .contains("CREATE TABLE IF NOT EXISTS commerce_schema_migration"));
    assert!(contract.ensure_schema_version_table.bindings.is_empty());

    assert_eq!(
        contract.read_applied_migrations.operation,
        "read_applied_migrations"
    );
    assert_eq!(
        contract.read_applied_migrations.sql,
        "SELECT sequence, name, domain, source_path, checksum, applied_at FROM commerce_schema_migration ORDER BY sequence ASC",
    );
    assert!(contract.read_applied_migrations.bindings.is_empty());

    assert_eq!(
        contract.insert_applied_migration.operation,
        "insert_applied_migration"
    );
    assert!(contract
        .insert_applied_migration
        .sql
        .starts_with("INSERT INTO commerce_schema_migration"));
    assert_eq!(
        contract.insert_applied_migration.bindings,
        vec![
            "sequence",
            "name",
            "domain",
            "source_path",
            "checksum",
            "applied_at",
        ],
    );
}

#[test]
fn migration_runner_sql_contract_exposes_exclusive_lock_operations() {
    let contract = commerce_migration_runner_sql_contract();

    assert_eq!(contract.lock_table, "commerce_schema_migration_lock");
    assert_eq!(
        contract.lock_columns,
        vec![
            "runner_name",
            "lock_owner",
            "locked_until",
            "heartbeat_at",
            "created_at",
            "updated_at",
        ],
    );
    assert_eq!(contract.lock_unique_key, vec!["runner_name"]);

    assert_eq!(contract.ensure_lock_table.operation, "ensure_lock_table");
    assert!(contract
        .ensure_lock_table
        .sql
        .contains("CREATE TABLE IF NOT EXISTS commerce_schema_migration_lock"));
    assert!(contract.ensure_lock_table.bindings.is_empty());

    assert_eq!(contract.acquire_lock.operation, "acquire_lock");
    assert!(contract
        .acquire_lock
        .sql
        .starts_with("INSERT INTO commerce_schema_migration_lock"));
    assert!(contract.acquire_lock.sql.contains("locked_until"));
    assert_eq!(
        contract.acquire_lock.bindings,
        vec![
            "runner_name",
            "lock_owner",
            "locked_until",
            "heartbeat_at",
            "created_at",
            "updated_at",
        ],
    );

    assert_eq!(contract.heartbeat_lock.operation, "heartbeat_lock");
    assert!(contract
        .heartbeat_lock
        .sql
        .starts_with("UPDATE commerce_schema_migration_lock"));
    assert_eq!(
        contract.heartbeat_lock.bindings,
        vec![
            "lock_owner",
            "locked_until",
            "heartbeat_at",
            "updated_at",
            "runner_name",
        ],
    );

    assert_eq!(contract.release_lock.operation, "release_lock");
    assert!(contract
        .release_lock
        .sql
        .starts_with("DELETE FROM commerce_schema_migration_lock"));
    assert_eq!(
        contract.release_lock.bindings,
        vec!["runner_name", "lock_owner"],
    );
}

#[test]
fn migration_runner_lock_acquire_outcome_allows_empty_lock_state() {
    let contract = commerce_migration_runner_sql_contract();

    let outcome = commerce_migration_runner_lock_acquire_outcome(
        &contract,
        None,
        "host-a",
        "2026-05-17T00:00:00Z",
        "2026-05-17T00:05:00Z",
    )
    .unwrap();

    assert_eq!(outcome.runner_name, "commerce.database.migration-runner");
    assert_eq!(outcome.lock_table, "commerce_schema_migration_lock");
    assert_eq!(outcome.requested_owner, "host-a");
    assert_eq!(outcome.effective_owner, "host-a");
    assert_eq!(outcome.status, "acquired");
    assert!(outcome.can_run_migrations);
    assert!(!outcome.requires_steal);
    assert_eq!(outcome.locked_until, "2026-05-17T00:05:00Z");
}

#[test]
fn migration_runner_lock_acquire_outcome_allows_same_owner_renewal() {
    let contract = commerce_migration_runner_sql_contract();
    let existing = commerce_migration_runner_lock_record(
        &contract,
        "host-a",
        "2026-05-17T00:10:00Z",
        "2026-05-17T00:01:00Z",
    );

    let outcome = commerce_migration_runner_lock_acquire_outcome(
        &contract,
        Some(&existing),
        "host-a",
        "2026-05-17T00:02:00Z",
        "2026-05-17T00:12:00Z",
    )
    .unwrap();

    assert_eq!(outcome.status, "renewed");
    assert!(outcome.can_run_migrations);
    assert!(!outcome.requires_steal);
    assert_eq!(outcome.previous_owner, Some("host-a"));
    assert_eq!(outcome.effective_owner, "host-a");
}

#[test]
fn migration_runner_lock_acquire_outcome_blocks_when_other_owner_lock_is_active() {
    let contract = commerce_migration_runner_sql_contract();
    let existing = commerce_migration_runner_lock_record(
        &contract,
        "host-a",
        "2026-05-17T00:10:00Z",
        "2026-05-17T00:01:00Z",
    );

    let outcome = commerce_migration_runner_lock_acquire_outcome(
        &contract,
        Some(&existing),
        "host-b",
        "2026-05-17T00:02:00Z",
        "2026-05-17T00:12:00Z",
    )
    .unwrap();

    assert_eq!(outcome.status, "blocked");
    assert!(!outcome.can_run_migrations);
    assert!(!outcome.requires_steal);
    assert_eq!(outcome.previous_owner, Some("host-a"));
    assert_eq!(outcome.effective_owner, "host-a");
    assert_eq!(outcome.locked_until, "2026-05-17T00:10:00Z");
}

#[test]
fn migration_runner_lock_acquire_outcome_allows_stealing_expired_lock() {
    let contract = commerce_migration_runner_sql_contract();
    let existing = commerce_migration_runner_lock_record(
        &contract,
        "host-a",
        "2026-05-17T00:01:00Z",
        "2026-05-17T00:00:30Z",
    );

    let outcome = commerce_migration_runner_lock_acquire_outcome(
        &contract,
        Some(&existing),
        "host-b",
        "2026-05-17T00:02:00Z",
        "2026-05-17T00:12:00Z",
    )
    .unwrap();

    assert_eq!(outcome.status, "stolen");
    assert!(outcome.can_run_migrations);
    assert!(outcome.requires_steal);
    assert_eq!(outcome.previous_owner, Some("host-a"));
    assert_eq!(outcome.effective_owner, "host-b");
    assert_eq!(outcome.locked_until, "2026-05-17T00:12:00Z");
}

#[test]
fn migration_runner_lock_acquire_outcome_rejects_mismatched_runner_record() {
    let contract = commerce_migration_runner_sql_contract();
    let mut existing = commerce_migration_runner_lock_record(
        &contract,
        "host-a",
        "2026-05-17T00:10:00Z",
        "2026-05-17T00:01:00Z",
    );
    existing.runner_name = "wrong-runner";

    let error = commerce_migration_runner_lock_acquire_outcome(
        &contract,
        Some(&existing),
        "host-b",
        "2026-05-17T00:02:00Z",
        "2026-05-17T00:12:00Z",
    )
    .unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-lock-invalid");
    assert!(error.message.contains("lock runner name drift"));
}

#[test]
fn migration_runner_lock_lifecycle_exposes_standard_statuses_and_decisions() {
    let contract = commerce_migration_runner_sql_contract();
    let lifecycle = commerce_migration_runner_lock_lifecycle(&contract);

    assert_eq!(lifecycle.runner_name, "commerce.database.migration-runner");
    assert_eq!(lifecycle.lock_table, "commerce_schema_migration_lock");
    assert_eq!(lifecycle.lock_owner_binding, "lock_owner");
    assert_eq!(lifecycle.fresh_acquire_status, "acquired");
    assert_eq!(lifecycle.renewal_status, "renewed");
    assert_eq!(lifecycle.stolen_status, "stolen");
    assert_eq!(lifecycle.blocked_status, "blocked");
    assert!(lifecycle.fresh_acquire_can_run_migrations);
    assert!(lifecycle.renewal_can_run_migrations);
    assert!(lifecycle.stolen_can_run_migrations);
    assert!(!lifecycle.blocked_can_run_migrations);
    assert!(lifecycle.steal_required_for_expired_lock);
}

#[test]
fn validates_standard_migration_runner_lock_lifecycle_for_host_preflight() {
    let contract = commerce_migration_runner_sql_contract();
    let lifecycle = commerce_migration_runner_lock_lifecycle(&contract);

    assert_eq!(
        validate_commerce_migration_runner_lock_lifecycle(&contract, &lifecycle),
        Ok(())
    );
}

#[test]
fn migration_runner_lock_lifecycle_validation_rejects_status_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut lifecycle = commerce_migration_runner_lock_lifecycle(&contract);
    lifecycle.blocked_status = "wrong";

    let error =
        validate_commerce_migration_runner_lock_lifecycle(&contract, &lifecycle).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-lock-invalid");
    assert!(error.message.contains("lock lifecycle drift"));
}

#[test]
fn migration_runner_lock_cleanup_exposes_failure_recovery_release_policy() {
    let contract = commerce_migration_runner_sql_contract();
    let cleanup = commerce_migration_runner_lock_cleanup(&contract);

    assert_eq!(cleanup.runner_name, "commerce.database.migration-runner");
    assert_eq!(cleanup.lock_table, "commerce_schema_migration_lock");
    assert_eq!(cleanup.release_operation, "release_lock");
    assert_eq!(cleanup.lock_owner_binding, "lock_owner");
    assert!(cleanup.release_required_after_acquired_failure);
    assert!(cleanup.release_skipped_before_acquire);
    assert!(cleanup.release_uses_owner_binding);
}

#[test]
fn validates_standard_migration_runner_lock_cleanup_for_host_preflight() {
    let contract = commerce_migration_runner_sql_contract();
    let cleanup = commerce_migration_runner_lock_cleanup(&contract);

    assert_eq!(
        validate_commerce_migration_runner_lock_cleanup(&contract, &cleanup),
        Ok(())
    );
}

#[test]
fn migration_runner_lock_cleanup_validation_rejects_release_operation_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut cleanup = commerce_migration_runner_lock_cleanup(&contract);
    cleanup.release_operation = "wrong";

    let error = validate_commerce_migration_runner_lock_cleanup(&contract, &cleanup).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-lock-invalid");
    assert!(error.message.contains("lock cleanup drift"));
}

#[test]
fn migration_runner_contract_tracks_migration_plan_and_transaction_boundary() {
    let contract = commerce_migration_runner_sql_contract();

    assert_eq!(contract.plan, commerce_migration_plan());
    assert_eq!(
        contract.applied_migration_sequence,
        commerce_migration_names(),
    );
    assert_eq!(
        contract.transaction_boundary_manager,
        commerce_transaction_boundary_sql_contract().manager_name,
    );
    assert_eq!(
        contract.conflict_classifier.table,
        "commerce_schema_migration"
    );
    assert_eq!(
        contract.conflict_classifier.unique_key,
        vec!["sequence", "name"],
    );
    assert_eq!(
        contract.conflict_classifier.error_code,
        "commerce-migration-already-applied",
    );
    assert!(contract
        .conflict_classifier
        .matches_constraint("commerce_schema_migration_sequence_name_key"));
}

#[test]
fn validates_standard_migration_runner_contract_for_host_preflight() {
    assert_eq!(
        validate_commerce_migration_runner_sql_contract(&commerce_migration_runner_sql_contract()),
        Ok(())
    );
}

#[test]
fn migration_runner_validation_rejects_schema_table_drift() {
    let mut contract = commerce_migration_runner_sql_contract();
    contract.schema_version_table = "wrong_schema_migration";

    let error = validate_commerce_migration_runner_sql_contract(&contract).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-invalid");
    assert!(error.message.contains("schema version table drift"));
}

#[test]
fn migration_runner_validation_rejects_applied_sequence_drift() {
    let mut contract = commerce_migration_runner_sql_contract();
    contract.applied_migration_sequence.pop();

    let error = validate_commerce_migration_runner_sql_contract(&contract).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-invalid");
    assert!(error.message.contains("applied migration sequence drift"));
}

#[test]
fn migration_runner_validation_rejects_plan_drift() {
    let mut contract = commerce_migration_runner_sql_contract();
    contract.plan[0].checksum = "commerce-migration-checksum:bad".to_string();

    let error = validate_commerce_migration_runner_sql_contract(&contract).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-invalid");
    assert!(error.message.contains("migration plan drift"));
}

#[test]
fn migration_runner_preflight_returns_full_pending_plan_when_nothing_is_applied() {
    let contract = commerce_migration_runner_sql_contract();
    let preflight = commerce_migration_runner_preflight(&contract, &[]).unwrap();

    assert_eq!(preflight.runner_name, "commerce.database.migration-runner");
    assert_eq!(preflight.schema_version_table, "commerce_schema_migration");
    assert_eq!(preflight.applied_count, 0);
    assert_eq!(preflight.pending_count, commerce_migration_plan().len());
    assert!(preflight.requires_execution);
    assert_eq!(preflight.pending_migrations, commerce_migration_plan());
    assert_eq!(
        preflight.next_migration.unwrap().name,
        "0001_core_idempotency.sql",
    );
}

#[test]
fn migration_runner_preflight_returns_remaining_pending_migrations_for_prefix_state() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_plan();
    let applied = vec![
        commerce_storage_applied_migration_record(&plan[0], "2026-05-17T00:00:00Z"),
        commerce_storage_applied_migration_record(&plan[1], "2026-05-17T00:01:00Z"),
    ];

    let preflight = commerce_migration_runner_preflight(&contract, &applied).unwrap();

    assert_eq!(preflight.applied_count, 2);
    assert_eq!(preflight.pending_count, commerce_migration_plan().len() - 2);
    assert!(preflight.requires_execution);
    assert_eq!(preflight.pending_migrations[0].name, "0003_benefit.sql");
    assert_eq!(preflight.next_migration.unwrap().name, "0003_benefit.sql",);
}

#[test]
fn migration_runner_preflight_returns_no_pending_migrations_when_plan_is_applied() {
    let contract = commerce_migration_runner_sql_contract();
    let applied = commerce_migration_plan()
        .iter()
        .map(|migration| {
            commerce_storage_applied_migration_record(migration, "2026-05-17T00:00:00Z")
        })
        .collect::<Vec<_>>();

    let preflight = commerce_migration_runner_preflight(&contract, &applied).unwrap();

    assert_eq!(preflight.applied_count, commerce_migration_plan().len());
    assert_eq!(preflight.pending_count, 0);
    assert!(!preflight.requires_execution);
    assert!(preflight.pending_migrations.is_empty());
    assert_eq!(preflight.next_migration, None);
}

#[test]
fn migration_runner_preflight_rejects_applied_checksum_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_plan();
    let mut applied = vec![commerce_storage_applied_migration_record(
        &plan[0],
        "2026-05-17T00:00:00Z",
    )];
    applied[0].checksum = "commerce-migration-checksum:bad".to_string();

    let error = commerce_migration_runner_preflight(&contract, &applied).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-preflight-invalid");
    assert!(error.message.contains("applied migration checksum drift"));
}

#[test]
fn migration_runner_preflight_rejects_non_prefix_applied_state() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_plan();
    let applied = vec![commerce_storage_applied_migration_record(
        &plan[1],
        "2026-05-17T00:01:00Z",
    )];

    let error = commerce_migration_runner_preflight(&contract, &applied).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-preflight-invalid");
    assert!(error.message.contains("applied migration sequence drift"));
}

#[test]
fn migration_runner_execution_plan_builds_ordered_steps_for_empty_database() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();

    assert_eq!(plan.runner_name, "commerce.database.migration-runner");
    assert_eq!(plan.schema_version_table, "commerce_schema_migration");
    assert_eq!(plan.applied_count, 0);
    assert_eq!(plan.pending_count, commerce_migration_plan().len());
    assert!(plan.requires_execution);
    assert_eq!(
        plan.steps.len(),
        4 + (commerce_migration_plan().len() * 2) + 1
    );
    assert_eq!(plan.steps[0].kind, "ensure_lock_table");
    assert_eq!(plan.steps[0].statement.operation, "ensure_lock_table");
    assert_eq!(plan.steps[1].kind, "acquire_lock");
    assert_eq!(plan.steps[1].statement.operation, "acquire_lock");
    assert_eq!(plan.steps[2].kind, "ensure_schema_version_table");
    assert_eq!(
        plan.steps[2].statement.operation,
        "ensure_schema_version_table"
    );
    assert_eq!(plan.steps[3].kind, "read_applied_migrations");
    assert_eq!(plan.steps[3].statement.operation, "read_applied_migrations");
    assert_eq!(plan.steps[4].kind, "apply_migration_sql");
    assert_eq!(
        plan.steps[4].migration_name,
        Some("0001_core_idempotency.sql")
    );
    assert_eq!(
        plan.steps[4].statement.sql,
        commerce_migration_plan()[0].sql
    );
    assert_eq!(plan.steps[5].kind, "record_applied_migration");
    assert_eq!(
        plan.steps[5].statement.operation,
        "insert_applied_migration"
    );
    assert!(plan.steps.iter().all(|step| step.requires_transaction));
    assert_eq!(plan.steps.last().unwrap().migration_name, None);
    assert_eq!(plan.steps.last().unwrap().kind, "release_lock");
    assert_eq!(
        plan.steps.last().unwrap().statement.operation,
        "release_lock"
    );
}

#[test]
fn migration_runner_execution_plan_only_applies_pending_migrations() {
    let contract = commerce_migration_runner_sql_contract();
    let migrations = commerce_migration_plan();
    let applied = vec![
        commerce_storage_applied_migration_record(&migrations[0], "2026-05-17T00:00:00Z"),
        commerce_storage_applied_migration_record(&migrations[1], "2026-05-17T00:01:00Z"),
    ];

    let plan = commerce_migration_runner_execution_plan(&contract, &applied).unwrap();

    assert_eq!(plan.applied_count, 2);
    assert_eq!(plan.pending_count, commerce_migration_plan().len() - 2);
    assert!(plan.requires_execution);
    assert_eq!(
        plan.steps.len(),
        4 + ((commerce_migration_plan().len() - 2) * 2) + 1
    );
    assert_eq!(plan.steps[4].migration_name, Some("0003_benefit.sql"));
    assert_eq!(plan.steps[5].migration_name, Some("0003_benefit.sql"));
    assert!(plan
        .steps
        .iter()
        .skip(4)
        .all(|step| step.migration_name != Some("0001_core_idempotency.sql")));
}

#[test]
fn migration_runner_execution_plan_is_noop_after_all_migrations_are_applied() {
    let contract = commerce_migration_runner_sql_contract();
    let applied = commerce_migration_plan()
        .iter()
        .map(|migration| {
            commerce_storage_applied_migration_record(migration, "2026-05-17T00:00:00Z")
        })
        .collect::<Vec<_>>();

    let plan = commerce_migration_runner_execution_plan(&contract, &applied).unwrap();

    assert_eq!(plan.applied_count, commerce_migration_plan().len());
    assert_eq!(plan.pending_count, 0);
    assert!(!plan.requires_execution);
    assert_eq!(plan.steps.len(), 5);
    assert_eq!(plan.steps[0].kind, "ensure_lock_table");
    assert_eq!(plan.steps[1].kind, "acquire_lock");
    assert_eq!(plan.steps[2].kind, "ensure_schema_version_table");
    assert_eq!(plan.steps[3].kind, "read_applied_migrations");
    assert_eq!(plan.steps[4].kind, "release_lock");
    assert!(plan.steps.iter().all(|step| step.migration_name.is_none()));
}

#[test]
fn migration_runner_execution_plan_rejects_invalid_applied_state() {
    let contract = commerce_migration_runner_sql_contract();
    let migrations = commerce_migration_plan();
    let mut applied = vec![commerce_storage_applied_migration_record(
        &migrations[0],
        "2026-05-17T00:00:00Z",
    )];
    applied[0].checksum = "commerce-migration-checksum:bad".to_string();

    let error = commerce_migration_runner_execution_plan(&contract, &applied).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-preflight-invalid");
    assert!(error.message.contains("applied migration checksum drift"));
}

#[test]
fn validates_standard_migration_runner_execution_plan_for_host_preflight() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();

    assert_eq!(
        validate_commerce_migration_runner_execution_plan(&contract, &[], &plan),
        Ok(())
    );
}

#[test]
fn migration_runner_execution_plan_validation_rejects_step_order_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    plan.steps.swap(2, 3);

    let error =
        validate_commerce_migration_runner_execution_plan(&contract, &[], &plan).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-plan-invalid"
    );
    assert!(error.message.contains("execution step drift"));
}

#[test]
fn migration_runner_execution_plan_validation_rejects_apply_sql_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    plan.steps[2].statement.sql = "SELECT 1";

    let error =
        validate_commerce_migration_runner_execution_plan(&contract, &[], &plan).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-plan-invalid"
    );
    assert!(error.message.contains("execution step drift"));
}

#[test]
fn migration_runner_execution_plan_validation_rejects_record_statement_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    plan.steps[3].statement.operation = "wrong_record";

    let error =
        validate_commerce_migration_runner_execution_plan(&contract, &[], &plan).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-plan-invalid"
    );
    assert!(error.message.contains("execution step drift"));
}

#[test]
fn migration_runner_execution_plan_validation_rejects_transaction_flag_drift() {
    let contract = commerce_migration_runner_sql_contract();
    let mut plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    plan.steps[0].requires_transaction = false;

    let error =
        validate_commerce_migration_runner_execution_plan(&contract, &[], &plan).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-plan-invalid"
    );
    assert!(error.message.contains("execution step drift"));
}

#[test]
fn migration_runner_execution_result_summarizes_successful_plan_execution() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();

    let result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");

    assert_eq!(result.runner_name, "commerce.database.migration-runner");
    assert_eq!(result.schema_version_table, "commerce_schema_migration");
    assert_eq!(result.executed_steps, plan.steps.len());
    assert_eq!(result.applied_migrations, commerce_migration_plan().len());
    assert_eq!(result.recorded_migrations, commerce_migration_plan().len());
    assert!(result.success);
    assert_eq!(result.completed_at, "2026-05-17T00:00:00Z");
    assert_eq!(result.step_results.len(), plan.steps.len());
    assert!(result.step_results.iter().all(|step| step.success));
    assert_eq!(result.applied_records[0].name, "0001_core_idempotency.sql",);
    assert_eq!(
        result.applied_records.len(),
        commerce_migration_plan().len()
    );
}

#[test]
fn validates_successful_migration_runner_execution_result() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");

    assert_eq!(
        validate_commerce_migration_runner_execution_result(&plan, &result),
        Ok(())
    );
}

#[test]
fn migration_runner_execution_result_validation_rejects_missing_step_result() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let mut result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");
    result.step_results.pop();

    let error = validate_commerce_migration_runner_execution_result(&plan, &result).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-result-invalid"
    );
    assert!(error.message.contains("step result count drift"));
}

#[test]
fn migration_runner_execution_result_validation_rejects_failed_step() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let mut result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");
    result.step_results[4].success = false;

    let error = validate_commerce_migration_runner_execution_result(&plan, &result).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-result-invalid"
    );
    assert!(error.message.contains("failed execution step"));
}

#[test]
fn migration_runner_execution_result_validation_rejects_missing_applied_record() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let mut result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");
    result.applied_records.pop();

    let error = validate_commerce_migration_runner_execution_result(&plan, &result).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-execution-result-invalid"
    );
    assert!(error.message.contains("applied record count drift"));
}

#[test]
fn migration_runner_final_state_marks_schema_current_after_empty_database_execution() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");

    let final_state = commerce_migration_runner_final_state(&contract, &[], &result).unwrap();

    assert_eq!(
        final_state.runner_name,
        "commerce.database.migration-runner"
    );
    assert_eq!(
        final_state.schema_version_table,
        "commerce_schema_migration"
    );
    assert_eq!(final_state.applied_count_before, 0);
    assert_eq!(
        final_state.newly_applied_count,
        commerce_migration_plan().len()
    );
    assert_eq!(
        final_state.applied_count_after,
        commerce_migration_plan().len()
    );
    assert_eq!(final_state.pending_count_after, 0);
    assert!(final_state.schema_is_current);
    assert_eq!(final_state.applied_migrations, result.applied_records);
    assert_eq!(
        validate_commerce_migration_runner_final_state(&contract, &[], &result, &final_state),
        Ok(())
    );
}

#[test]
fn migration_runner_final_state_appends_new_records_after_prefix_state() {
    let contract = commerce_migration_runner_sql_contract();
    let migrations = commerce_migration_plan();
    let before = vec![
        commerce_storage_applied_migration_record(&migrations[0], "2026-05-17T00:00:00Z"),
        commerce_storage_applied_migration_record(&migrations[1], "2026-05-17T00:01:00Z"),
    ];
    let plan = commerce_migration_runner_execution_plan(&contract, &before).unwrap();
    let result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:02:00Z");

    let final_state = commerce_migration_runner_final_state(&contract, &before, &result).unwrap();

    assert_eq!(final_state.applied_count_before, 2);
    assert_eq!(
        final_state.newly_applied_count,
        commerce_migration_plan().len() - 2
    );
    assert_eq!(
        final_state.applied_count_after,
        commerce_migration_plan().len()
    );
    assert_eq!(final_state.pending_count_after, 0);
    assert!(final_state.schema_is_current);
    assert_eq!(&final_state.applied_migrations[..2], before.as_slice());
    assert_eq!(final_state.applied_migrations[2].name, "0003_benefit.sql");
}

#[test]
fn migration_runner_final_state_rejects_result_not_matching_initial_state() {
    let contract = commerce_migration_runner_sql_contract();
    let migrations = commerce_migration_plan();
    let before = vec![
        commerce_storage_applied_migration_record(&migrations[0], "2026-05-17T00:00:00Z"),
        commerce_storage_applied_migration_record(&migrations[1], "2026-05-17T00:01:00Z"),
    ];
    let empty_database_plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result =
        commerce_migration_runner_execution_result(&empty_database_plan, "2026-05-17T00:02:00Z");

    let error = commerce_migration_runner_final_state(&contract, &before, &result).unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-final-state-invalid");
    assert!(error
        .message
        .contains("execution result must match initial applied state"));
}

#[test]
fn migration_runner_final_state_validation_rejects_duplicate_final_records() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result = commerce_migration_runner_execution_result(&plan, "2026-05-17T00:00:00Z");
    let mut final_state = commerce_migration_runner_final_state(&contract, &[], &result).unwrap();
    final_state.applied_migrations[1] = final_state.applied_migrations[0].clone();

    let error =
        validate_commerce_migration_runner_final_state(&contract, &[], &result, &final_state)
            .unwrap_err();

    assert_eq!(error.code, "commerce-migration-runner-final-state-invalid");
    assert!(error
        .message
        .contains("final applied migration state invalid"));
}

#[test]
fn migration_runner_failed_execution_result_stops_at_failed_migration_step() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();

    let result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();

    assert_eq!(result.runner_name, "commerce.database.migration-runner");
    assert_eq!(result.executed_steps, 5);
    assert!(!result.success);
    assert_eq!(result.applied_migrations, 0);
    assert_eq!(result.recorded_migrations, 0);
    assert!(result.applied_records.is_empty());
    assert_eq!(result.step_results.len(), 5);
    assert!(result.step_results.iter().take(4).all(|step| step.success));
    assert!(!result.step_results[4].success);
    assert_eq!(result.step_results[4].kind, "apply_migration_sql");
    assert_eq!(
        result.step_results[4].migration_name,
        Some("0001_core_idempotency.sql")
    );
}

#[test]
fn migration_runner_failure_recovery_resumes_from_failed_migration() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();

    let recovery = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap();

    assert_eq!(recovery.runner_name, "commerce.database.migration-runner");
    assert_eq!(recovery.failed_step_index, 4);
    assert_eq!(recovery.failed_step_kind, "apply_migration_sql");
    assert_eq!(recovery.failed_migration_sequence, Some(1));
    assert_eq!(
        recovery.failed_migration_name,
        Some("0001_core_idempotency.sql")
    );
    assert!(recovery.rollback_required);
    assert!(recovery.stop_execution);
    assert!(recovery.lock_was_acquired);
    assert!(recovery.lock_release_required);
    assert!(recovery.lock_owner_required);
    assert_eq!(recovery.release_lock_operation, Some("release_lock"));
    assert_eq!(recovery.applied_count_before, 0);
    assert_eq!(recovery.safely_recorded_count, 0);
    assert_eq!(recovery.applied_count_after, 0);
    assert_eq!(
        recovery.pending_count_after,
        commerce_migration_plan().len()
    );
    assert_eq!(
        recovery.resume_migration.as_ref().unwrap().name,
        "0001_core_idempotency.sql"
    );
    assert_eq!(
        validate_commerce_migration_runner_failure_recovery(&contract, &[], &result, &recovery),
        Ok(())
    );
}

#[test]
fn migration_runner_failure_recovery_requires_lock_release_after_acquired_lock() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();

    let recovery = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap();

    assert!(recovery.lock_was_acquired);
    assert!(recovery.lock_release_required);
    assert!(recovery.lock_owner_required);
    assert_eq!(recovery.release_lock_operation, Some("release_lock"));
}

#[test]
fn migration_runner_failure_recovery_does_not_release_before_lock_acquisition() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result =
        commerce_migration_runner_failed_execution_result(&plan, 1, "2026-05-17T00:00:00Z")
            .unwrap();

    let recovery = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap();

    assert_eq!(recovery.failed_step_kind, "acquire_lock");
    assert!(!recovery.lock_was_acquired);
    assert!(!recovery.lock_release_required);
    assert!(!recovery.lock_owner_required);
    assert_eq!(recovery.release_lock_operation, None);
}

#[test]
fn migration_runner_failure_recovery_rejects_missing_lock_release_after_acquired_lock() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();
    let mut recovery = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap();
    recovery.lock_release_required = false;

    let error =
        validate_commerce_migration_runner_failure_recovery(&contract, &[], &result, &recovery)
            .unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-failure-recovery-invalid"
    );
    assert!(error
        .message
        .contains("migration runner failure recovery drift"));
    assert!(error.message.contains("lock_release_required"));
}

#[test]
fn migration_runner_failure_recovery_preserves_successfully_recorded_prefix() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();

    let result =
        commerce_migration_runner_failed_execution_result(&plan, 8, "2026-05-17T00:03:00Z")
            .unwrap();

    let recovery = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap();

    assert_eq!(recovery.failed_step_index, 8);
    assert_eq!(recovery.failed_migration_name, Some("0003_benefit.sql"));
    assert_eq!(recovery.safely_recorded_count, 2);
    assert_eq!(recovery.applied_count_after, 2);
    assert_eq!(
        recovery.pending_count_after,
        commerce_migration_plan().len() - 2
    );
    assert_eq!(
        recovery.applied_migrations[0].name,
        "0001_core_idempotency.sql"
    );
    assert_eq!(
        recovery.applied_migrations[1].name,
        "0002_account_ledger.sql"
    );
    assert_eq!(
        recovery.resume_migration.as_ref().unwrap().name,
        "0003_benefit.sql"
    );
}

#[test]
fn migration_runner_failure_recovery_rejects_continued_execution_after_failed_step() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let mut result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();
    result.step_results.push(result.step_results[4].clone());
    result.step_results[5].success = true;
    result.executed_steps = result.step_results.len();

    let error = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-failure-recovery-invalid"
    );
    assert!(error
        .message
        .contains("failed execution result must stop at first failed step"));
}

#[test]
fn migration_runner_failure_recovery_rejects_recorded_failed_migration() {
    let contract = commerce_migration_runner_sql_contract();
    let plan = commerce_migration_runner_execution_plan(&contract, &[]).unwrap();
    let mut result =
        commerce_migration_runner_failed_execution_result(&plan, 4, "2026-05-17T00:00:00Z")
            .unwrap();
    result
        .applied_records
        .push(commerce_storage_applied_migration_record(
            &commerce_migration_plan()[0],
            "2026-05-17T00:00:00Z",
        ));
    result.recorded_migrations = 1;

    let error = commerce_migration_runner_failure_recovery(&contract, &[], &result).unwrap_err();

    assert_eq!(
        error.code,
        "commerce-migration-runner-failure-recovery-invalid"
    );
    assert!(error
        .message
        .contains("recorded migrations must be limited to successful record steps"));
}

#[test]
fn storage_capability_manifest_is_complete_for_first_slice_runtime_bootstrap() {
    let manifest = commerce_storage_capability_manifest();

    assert_eq!(manifest.tables.len(), 68);
    assert_eq!(manifest.indexes.len(), 66);
    assert_eq!(manifest.migration_plan.len(), 13);
    assert_eq!(manifest.repository_bindings.len(), 15);
    assert_eq!(manifest.business_repositories.len(), 14);
    assert!(manifest
        .transaction_boundary
        .covered_repositories
        .contains(&"idempotency.repository"));
    assert!(manifest
        .business_repositories
        .iter()
        .all(|catalog| catalog.requires_transaction));
}

#[test]
fn migration_plan_exposes_host_consumable_order_and_sql_sources() {
    let plan = commerce_migration_plan();

    assert_eq!(plan.len(), commerce_migration_names().len());
    assert_eq!(plan[0].sequence, 1);
    assert_eq!(plan[0].name, "0001_core_idempotency.sql");
    assert_eq!(plan[0].domain, "core");
    assert_eq!(
        plan[0].source_path,
        "migrations/0001_commerce_foundation.sql"
    );
    assert_eq!(plan[0].sql, commerce_initial_migration_sql());
    assert!(plan[0].checksum.starts_with("commerce-migration-checksum:"));
    assert!(plan[0]
        .required_tables
        .contains(&"commerce_idempotency_key"));

    assert_eq!(
        plan.iter()
            .map(|migration| migration.name)
            .collect::<Vec<_>>(),
        commerce_migration_names(),
    );
    assert_eq!(
        plan.iter()
            .map(|migration| migration.domain)
            .collect::<Vec<_>>(),
        vec![
            "core",
            "account",
            "benefit",
            "entitlement",
            "membership",
            "promotion",
            "catalog",
            "inventory",
            "order",
            "payment",
            "exchange",
            "invoice",
            "billing",
        ],
    );
}

#[test]
fn migration_plan_covers_first_slice_tables_by_domain() {
    let plan = commerce_migration_plan();

    let declared_tables = plan
        .iter()
        .flat_map(|migration| migration.required_tables.iter().copied())
        .collect::<Vec<_>>();

    for table in commerce_database_tables() {
        assert!(
            declared_tables.contains(&table),
            "migration plan must cover table {table}",
        );
    }

    let account = plan
        .iter()
        .find(|migration| migration.domain == "account")
        .unwrap();
    assert_eq!(
        account.required_tables,
        vec![
            "commerce_account",
            "commerce_account_ledger_entry",
            "commerce_billing_prehold",
            "commerce_billing_history",
        ],
    );
    assert_eq!(
        account.source_path,
        "migrations/0001_commerce_foundation.sql"
    );
    assert_eq!(account.sql, commerce_initial_migration_sql());

    let benefit = plan
        .iter()
        .find(|migration| migration.domain == "benefit")
        .unwrap();
    assert_eq!(benefit.required_tables, vec!["benefit_definition"]);

    let entitlement = plan
        .iter()
        .find(|migration| migration.domain == "entitlement")
        .unwrap();
    assert_eq!(
        entitlement.required_tables,
        vec![
            "entitlement_grant",
            "entitlement_account",
            "entitlement_ledger_entry",
        ],
    );

    let membership = plan
        .iter()
        .find(|migration| migration.domain == "membership")
        .unwrap();
    assert_eq!(
        membership.required_tables,
        vec![
            "membership_plan",
            "membership_plan_version",
            "membership_plan_benefit",
            "membership_package_group",
            "membership_package",
            "membership_subscription",
            "membership_period",
        ],
    );

    let promotion = plan
        .iter()
        .find(|migration| migration.domain == "promotion")
        .unwrap();
    assert_eq!(
        promotion.required_tables,
        vec![
            "promotion_offer",
            "promotion_offer_version",
            "promotion_coupon_stock",
            "promotion_code",
            "promotion_user_coupon",
            "promotion_coupon_ledger_entry",
            "promotion_discount_application",
            "promotion_discount_allocation",
        ],
    );

    let payment = plan
        .iter()
        .find(|migration| migration.domain == "payment")
        .unwrap();
    assert_eq!(
        payment.required_tables,
        vec![
            "commerce_payment_intent",
            "commerce_payment_attempt",
            "commerce_payment_webhook_event",
            "commerce_payment_method",
            "commerce_payment_provider",
            "commerce_payment_provider_account",
            "commerce_payment_channel",
            "commerce_payment_route_rule",
            "commerce_payment_provider_capability",
            "commerce_payment_operation_attempt",
            "commerce_payment_route_decision",
            "commerce_payment_capture",
            "commerce_payment_webhook_delivery",
            "commerce_payment_statement",
            "commerce_payment_statement_item",
            "commerce_payment_reconciliation_item",
            "commerce_payment_fee",
            "commerce_payment_dispute",
            "commerce_payment_dispute_event",
            "commerce_refund",
            "commerce_refund_item",
            "commerce_refund_attempt",
            "commerce_refund_event",
        ],
    );
}

#[test]
fn validates_standard_migration_plan_for_host_preflight() {
    assert_eq!(
        validate_commerce_migration_plan(&commerce_migration_plan()),
        Ok(())
    );
}

#[test]
fn migration_plan_validation_rejects_sequence_drift() {
    let mut plan = commerce_migration_plan();
    plan[1].sequence = 7;

    let error = validate_commerce_migration_plan(&plan).unwrap_err();

    assert_eq!(error.code, "commerce-migration-plan-invalid");
    assert!(error.message.contains("sequence drift"));
}

#[test]
fn migration_plan_validation_rejects_name_drift() {
    let mut plan = commerce_migration_plan();
    plan[0].name = "0001_wrong.sql";

    let error = validate_commerce_migration_plan(&plan).unwrap_err();

    assert_eq!(error.code, "commerce-migration-plan-invalid");
    assert!(error.message.contains("name drift"));
}

#[test]
fn migration_plan_validation_rejects_checksum_drift() {
    let mut plan = commerce_migration_plan();
    plan[0].checksum = "commerce-migration-checksum:bad".to_string();

    let error = validate_commerce_migration_plan(&plan).unwrap_err();

    assert_eq!(error.code, "commerce-migration-plan-invalid");
    assert!(error.message.contains("checksum drift"));
}

#[test]
fn migration_plan_validation_rejects_missing_sql_text() {
    let mut plan = commerce_migration_plan();
    plan[0].sql = "";

    let error = validate_commerce_migration_plan(&plan).unwrap_err();

    assert_eq!(error.code, "commerce-migration-plan-invalid");
    assert!(error.message.contains("SQL text is required"));
}

#[test]
fn migration_plan_validation_rejects_missing_required_table_coverage() {
    let mut plan = commerce_migration_plan();
    plan[0].required_tables.clear();

    let error = validate_commerce_migration_plan(&plan).unwrap_err();

    assert_eq!(error.code, "commerce-migration-plan-invalid");
    assert!(error
        .message
        .contains("migration plan must cover table commerce_idempotency_key"));
}
