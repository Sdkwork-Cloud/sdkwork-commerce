# @sdkwork/commerce-contracts

Canonical SDKWork commerce contract catalog.

This package defines the standard domain-oriented `/app/v3/api/**` and `/backend/v3/api/**` commerce API surfaces, generated SDK operationIds, `commerce_*` table names, composable capability blocks, and amount/ledger policy helpers shared by SaaS Java and local/private Rust deployments. Public commerce contracts do not expose a `billing` namespace or alias layer.

## SDKWork Documentation Contract

Domain: commerce
Capability: commerce-contracts
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

- `pnpm --filter @sdkwork/commerce-contracts typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
