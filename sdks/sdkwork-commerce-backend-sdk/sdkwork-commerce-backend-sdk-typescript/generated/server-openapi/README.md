# sdkwork-commerce-backend-sdk

Generated SDKWork v3 dual-token transport SDK.

## Installation

```bash
npm install sdkwork-commerce-backend-sdk-generated-typescript
# or
yarn add sdkwork-commerce-backend-sdk-generated-typescript
# or
pnpm add sdkwork-commerce-backend-sdk-generated-typescript
```

## Quick Start

```typescript
import { SdkworkBackendClient } from 'sdkwork-commerce-backend-sdk-generated-typescript';

const client = new SdkworkBackendClient({
  baseUrl: 'http://127.0.0.1:18080',
  timeout: 30000,
});

// Authentication
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');

// Use the SDK
const result = await client.recharges.settings.retrieve();
```

## Authentication

```text
Authorization: Bearer <authToken>
Access-Token: <accessToken>
```


## Configuration (Non-Auth)

```typescript
import { SdkworkBackendClient } from 'sdkwork-commerce-backend-sdk-generated-typescript';

const client = new SdkworkBackendClient({
  baseUrl: 'http://127.0.0.1:18080',
  timeout: 30000, // Request timeout in ms
  headers: {      // Custom headers
    'X-Custom-Header': 'value',
  },
});
```

## API Modules

- `client.audit` - audit API
- `client.catalog` - catalog API
- `client.commerceReports` - commerce_reports API
- `client.fulfillments` - fulfillments API
- `client.inventory` - inventory API
- `client.invoices` - invoices API
- `client.memberships` - memberships API
- `client.orders` - orders API
- `client.payments` - payments API
- `client.promotions` - promotions API
- `client.recharges` - recharges API
- `client.refunds` - refunds API
- `client.reports` - reports API
- `client.shipments` - shipments API
- `client.wallet` - wallet API
- `client.entitlements` - entitlements API

## Usage Examples

### audit

```typescript
// Audit commerce Events list.
const params = {
  actor_id: 'actor_id',
  source_type: 'source_type',
  page: 3,
  page_size: 4,
};
const result = await client.audit.commerceEvents.list(params);
```

### catalog

```typescript
// Catalog attributes list.
const params = {
  scope: 'scope',
  status: 'status',
  page: 3,
  page_size: 4,
};
const result = await client.catalog.attributes.list(params);
```

### commerce_reports

```typescript
// Commerce Reports payment Reconciliation retrieve.
const params = {
  provider: 'provider',
  start_time: 'start_time',
  end_time: 'end_time',
};
const result = await client.commerceReports.paymentReconciliation.retrieve(params);
```

### fulfillments

```typescript
// Fulfillments list.
const params = {
  status: 'status',
  page: 2,
  page_size: 3,
};
const result = await client.fulfillments.list(params);
```

### inventory

```typescript
// Inventory ledger list.
const params = {
  page: 1,
  page_size: 2,
  cursor: 'cursor',
  sort: 'sort',
  q: 'q',
};
const result = await client.inventory.ledger.list(params);
```

### invoices

```typescript
// Invoices list.
const params = {
  status: 'status',
  page: 2,
  page_size: 3,
};
const result = await client.invoices.list(params);
```

### memberships

```typescript
// Memberships plans list.
const params = {
  status: 'status',
};
const result = await client.memberships.plans.list(params);
```

### orders

```typescript
// Orders cancellations list.
const params = {
  status: 'status',
  page: 2,
  page_size: 3,
};
const result = await client.orders.cancellations.list(params);
```

### payments

```typescript
// Payments methods list.
const params = {
  status: 'status',
};
const result = await client.payments.methods.list(params);
```

### promotions

```typescript
// Promotions codes redemptions list.
const params = {
  page: 1,
  page_size: 2,
  code_status: 'code_status',
};
const result = await client.promotions.codes.redemptions.list(params);
```

### recharges

```typescript
// Recharges settings retrieve.
const result = await client.recharges.settings.retrieve();
```

### refunds

```typescript
// Refunds list.
const params = {
  status: 'status',
  page: 2,
  page_size: 3,
};
const result = await client.refunds.list(params);
```

### reports

```typescript
// Reports commerce Overview retrieve.
const params = {
  period_start: 'period_start',
  period_end: 'period_end',
};
const result = await client.reports.commerceOverview.retrieve(params);
```

### shipments

```typescript
// Shipments list.
const params = {
  status: 'status',
  page: 2,
  page_size: 3,
};
const result = await client.shipments.list(params);
```

### wallet

```typescript
// Wallet exchange Rules list.
const params = {
  source_asset_type: 'source_asset_type',
  target_asset_type: 'target_asset_type',
  status: 'status',
};
const result = await client.wallet.exchangeRules.list(params);
```

### entitlements

```typescript
// Entitlements accounts list.
const params = {
  subject_type: 'subject_type',
  subject_id: 'subject_id',
  benefit_id: 'benefit_id',
  status: 'status',
  page: 5,
  page_size: 6,
};
const result = await client.entitlements.accounts.list(params);
```

## Error Handling

```typescript
import { SdkworkBackendClient, NetworkError, TimeoutError, AuthenticationError } from 'sdkwork-commerce-backend-sdk-generated-typescript';

try {
  const result = await client.recharges.settings.retrieve();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    throw error;
  }
}
```

## Publishing

This SDK includes cross-platform publish scripts in `bin/`:
- `bin/publish-core.mjs`
- `bin/publish.sh`
- `bin/publish.ps1`

### Check

```bash
./bin/publish.sh --action check
```

### Publish

```bash
./bin/publish.sh --action publish --channel release
```

```powershell
.\bin\publish.ps1 --action publish --channel test --dry-run
```

> Configure npm registry credentials before release publish.

## License

MIT

## Regeneration Contract

- Generator-owned files are tracked in `.sdkwork/sdkwork-generator-manifest.json`.
- Each run also writes `.sdkwork/sdkwork-generator-changes.json` so automation can inspect created, updated, deleted, unchanged, scaffolded, and backed-up files plus the classified impact areas, verification plan, and execution decision for the latest generation.
- Apply mode also writes `.sdkwork/sdkwork-generator-report.json` with the full execution report, including `schemaVersion`, `generator`, stable artifact paths, and the execution handoff commands that match CLI `--json` output.
- CLI JSON output also includes an execution handoff with concrete next commands, including reviewed apply commands for dry-run flows.
- Put hand-written wrappers, adapters, and orchestration in `custom/`.
- Files scaffolded under `custom/` are created once and preserved across regenerations.
- If a generated-owned file was modified locally, its previous content is copied to `.sdkwork/manual-backups/` before overwrite or removal.
