use std::path::PathBuf;

#[test]
fn business_domain_crates_follow_the_standard_module_layout() {
    let workspace = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("runtime crate should live under native-rust/commerce")
        .to_path_buf();
    let business_crates = [
        "sdkwork-commerce-account-rust",
        "sdkwork-commerce-catalog-rust",
        "sdkwork-commerce-inventory-rust",
        "sdkwork-commerce-order-rust",
        "sdkwork-commerce-payment-rust",
        "sdkwork-commerce-promotion-rust",
        "sdkwork-commerce-membership-rust",
        "sdkwork-commerce-invoice-rust",
    ];
    let required_modules = [
        "src/domain/mod.rs",
        "src/commands/mod.rs",
        "src/queries/mod.rs",
        "src/ports/mod.rs",
        "src/service/mod.rs",
        "src/validation/mod.rs",
    ];

    for crate_name in business_crates {
        for module_path in required_modules {
            let path = workspace.join(crate_name).join(module_path);
            assert!(
                path.is_file(),
                "business crate {crate_name} is missing standard module {module_path}",
            );
        }
    }
}
