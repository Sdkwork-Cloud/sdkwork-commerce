# sdkwork-commerce

Standalone SDKWork Commerce workspace.

This application owns reusable commerce services that previously lived inside
`sdkwork-appbase`: product catalog, inventory, cart, checkout, order, payment,
refund, fulfillment, wallet, billing, invoice, promotion, coupon, membership,
entitlement, reporting, local/private Rust storage, HTTP contracts, RPC
contracts, PC React packages, and SDK generation inputs.

## Architecture

- Rust commerce implementation lives in `crates/`.
- Framework-independent TypeScript contracts, runtime, SDK ports, and service
  boundaries live in `packages/common/commerce/`.
- PC React commerce packages live in
  `apps/sdkwork-commerce-pc/packages/commerce/`.
- Owner-only OpenAPI inputs live in `generated/openapi/`.
- SDK families live in `sdks/sdkwork-commerce-sdk`,
  `sdks/sdkwork-commerce-app-sdk`, and `sdks/sdkwork-commerce-backend-sdk`.

`sdkwork-commerce` depends on appbase IAM/foundation for session context,
runtime bootstrap, and host integration. It does not copy appbase login,
registration, session, or IAM management ownership.

## Standards

The workspace follows the same owner-only SDK family pattern as
`../sdkwork-drive` and the root SDKWork standards in:

- `../sdkwork-specs/API_SPEC.md`
- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`
- `../sdkwork-specs/DATABASE_SPEC.md`
- `../sdkwork-specs/RPC_SPEC.md`
- `../sdkwork-specs/RUST_RPC_SPEC.md`

## SDK And OpenAPI

Check and materialize owner-only OpenAPI inputs:

```bash
pnpm sdk:check
```

Run SDK generation for the default TypeScript language:

```bash
pnpm sdk:generate
```

Generate a selected language:

```bash
node tools/commerce_sdk_generate.mjs --language rust
```

The app and backend commerce SDKs declare appbase SDKs as consumer
dependencies. Auth/session/IAM routes remain appbase-owned and are not copied
into generated commerce transports.

## Verification

```bash
pnpm sdk:check
pnpm test:node
pnpm test:vitest
cargo test --workspace
```


## SDKWork Documentation Contract

Domain: commerce
Capability: workspace
Package type: rust-crate
Status: standard

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
