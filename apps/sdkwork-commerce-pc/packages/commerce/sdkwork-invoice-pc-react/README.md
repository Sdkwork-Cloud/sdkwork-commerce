# @sdkwork/invoice-pc-react

## Purpose

Invoice applications, billing documents, and tax-ready history surfaces.

## Placement

- Architecture: `pc-react`
- Domain: `commerce`
- Capability: `invoice`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/commerce-service` for generated app/backend SDK boundaries, session checks, and response normalization
- Lower-level appbase packages only

## Ownership

This package is implemented as an independent SDKWork commerce capability. It owns its public React/service contracts and consumes commerce data through injected service boundaries with wallet and membership ownership kept separate.

## Runtime boundary

All remote commerce access goes through `@sdkwork/commerce-service` or through sibling commerce services that use the same boundary. Generated SDK clients remain behind the shared service contract.

## Verification

Use the package `typecheck` script and focused Vitest coverage for service, controller, and UI behavior when changing this package.
