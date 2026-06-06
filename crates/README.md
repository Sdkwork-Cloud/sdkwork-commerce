# native-rust/commerce

Rust commerce foundation for local/private deployments.

These crates mirror the Java SaaS app contract and expose the same domain-oriented `/app/v3/api/**` and `/backend/v3/api/**` commerce paths, operationIds, token semantics, context model, and `commerce_*` database table catalog. New appbase commerce routes are organized by bounded context such as catalog, cart, checkout, orders, payments, refunds, fulfillments, shipments, memberships, recharges, wallet, coupons, invoices, inventory, commerce reports, and audit.

## Crates

- `sdkwork-commerce-core-rust`: runtime context, account asset types, ledger direction, and amount validation.
- `sdkwork-commerce-account-rust`: account summary, ledger, and prehold domain rules.
- `sdkwork-commerce-promotion-rust`: coupon template, claim, redemption, and promotion repository contracts.
- `sdkwork-commerce-order-rust`: order lifecycle, amount breakdown, and payment/invoice references.
- `sdkwork-commerce-payment-rust`: payment intent, attempt, refund, and provider command contracts.
- `sdkwork-commerce-membership-rust`: membership plan, package, member, entitlement, and usage contracts.
- `sdkwork-commerce-invoice-rust`: invoice title, application, document lifecycle, and provider command contracts.
- `sdkwork-commerce-runtime-rust`: local/private runtime composition, operation contracts, dispatch, idempotency, transaction, and envelope standards.
- `sdkwork-commerce-storage-sqlx-rust`: SQL table catalog, migrations, migration runner SQL contract, migration lock contract/lifecycle/cleanup, migration execution plan/result/final-state/failure-recovery contracts, repository SQL catalogs, idempotency, transaction, and storage capability manifest.
- `sdkwork-commerce-http-rust`: route contracts, execution metadata, response envelope metadata, and runtime input binding for standard commerce app/backend routes.
- `sdkwork-commerce-rpc-rust`: gRPC service manifests, operationId mappings, and RPC surface split for commerce app/backend calls.
- `sdkwork-commerce-tauri-rust`: Tauri host adapter manifest and command bindings for local/private apps.
- `sdkwork-commerce-bootstrap-rust`: single local/private bootstrap manifest that composes runtime, storage, HTTP, and Tauri contracts.

The crates intentionally avoid app-specific product UI logic. Applications compose them with repositories, generated SDKs, and host startup code.

## Bootstrap contract

`sdkwork-commerce-bootstrap-rust` is the local/private host entry contract for this slice. It does not run infrastructure side effects and does not contain domain business logic. It provides:

- `commerce_local_private_bootstrap_manifest()`: composes runtime, storage, HTTP, and Tauri manifests.
- `CommerceLocalPrivateBootstrapManifest::validate()`: fails fast when cross-layer operation, envelope, input binding, idempotency, transaction, storage migration plan, migration runner SQL/lock contract, lifecycle, cleanup, migration execution plan/result/final-state/failure-recovery contracts, HTTP, or Tauri contracts drift.
- `CommerceLocalPrivateBootstrapManifest::preflight()`: validates the manifest and returns host startup counts, storage migration pending summary, migration lock summary, lifecycle statuses, cleanup policy, migration execution plan summary, migration final-state summary, migration failure-recovery summary, and stage metadata.
- `run_commerce_local_private_bootstrap_preflight()`: convenience entrypoint for host startup checks.

The standard host startup stage order is:

1. `validate-bootstrap-contracts`
2. `initialize-commerce-storage`
3. `initialize-commerce-runtime`
4. `bind-commerce-http-routes`
5. `bind-commerce-tauri-commands`

The host must provide these capabilities for the bootstrap stages:

- `commerce.database.connection`
- `commerce.database.migration-runner`
- `commerce.runtime.idempotency-store`
- `commerce.runtime.transaction-manager`
- `commerce.runtime.service-registry`
- `commerce.http.authenticated-context`
- `commerce.http.route-binding`
- `commerce.tauri.command-binding`
