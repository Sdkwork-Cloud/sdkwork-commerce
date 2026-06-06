# @sdkwork/commerce-sdk-ports

Generated app and backend SDK port contracts for the commerce foundation.

The standard generated SDK surfaces are `appClient.commerce.*` and `backendClient.commerce.*`. Account, wallet, points, token, order, payment, invoice, membership package, privilege, checkout, and reporting resources stay under domain-oriented commerce resource trees. Retired top-level shortcut roots are rejected so reusable appbase packages consume only the generated commerce SDK boundary.

## SDKWork Documentation Contract

Domain: commerce
Capability: commerce-sdk-ports
Package type: node-package
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

- `pnpm --filter @sdkwork/commerce-sdk-ports typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
