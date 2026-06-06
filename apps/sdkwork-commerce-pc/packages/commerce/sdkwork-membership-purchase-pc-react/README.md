# @sdkwork/membership-purchase-pc-react

## Purpose

membership package purchase entry points for top-header menus, package selection, renewal, and upgrade submission.

## Placement

- Architecture: `pc-react`
- Domain: `commerce`
- Capability: `membership-purchase`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/membership-pc-react` for membership dashboard types and membership mutation mapping
- `@sdkwork/commerce-service` for generated app SDK boundaries, session checks, and response normalization
- Lower-level appbase packages only

## Ownership

This package owns purchase-specific header and menu contracts. membership dashboard display remains in `@sdkwork/membership-pc-react`, and admin membership management remains in `@sdkwork/membership-admin-pc-react`.

The purchase flow is intentionally service-first:

- `createSdkworkMembershipPurchaseService()` is the package-level submission boundary.
- `SdkworkMembershipPurchaseMenu` always submits through the purchase service, then refreshes the injected membership controller.
- Hosts can inject a custom purchase service for composition, but the default path still resolves to the shared commerce service boundary.

## Runtime Boundary

Remote purchase, renew, and upgrade calls are routed through `@sdkwork/commerce-service` and `memberships.purchases.*` via the reusable membership service. This package does not create raw HTTP clients, mutate browser location, or own wallet state.

## Verification

Use the package `typecheck` script and focused Vitest coverage for route intents, purchase service behavior, header integration, duplicate-submit protection, and failure display.
