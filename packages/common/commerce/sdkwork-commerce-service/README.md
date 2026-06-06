# @sdkwork/commerce-service

Framework-independent commerce service composition.

The service calls only injected generated SDK resources under `appClient.commerce.*` and `backendClient.commerce.*`.
It does not perform raw HTTP, construct auth headers, or import a concrete generated SDK package.

## SDKWork Documentation Contract

Domain: commerce
Capability: commerce-service
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

- `pnpm --filter @sdkwork/commerce-service typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
