import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const workspaceRoot = path.resolve(import.meta.dirname, "..", "..");

const requiredCommerceRustCrates = [
  "crates/sdkwork-commerce-catalog-rust/Cargo.toml",
  "crates/sdkwork-commerce-inventory-rust/Cargo.toml",
  "crates/sdkwork-commerce-order-rust/Cargo.toml",
  "crates/sdkwork-commerce-payment-rust/Cargo.toml",
  "crates/sdkwork-commerce-storage-sqlx-rust/Cargo.toml",
  "crates/sdkwork-commerce-http-rust/Cargo.toml",
  "crates/sdkwork-commerce-runtime-rust/Cargo.toml",
  "crates/sdkwork-commerce-core-rust/Cargo.toml",
];

const requiredCommerceDatabaseTables = [
  "commerce_shop",
  "commerce_shop_application",
  "commerce_shop_verification",
  "commerce_shop_status_event",
  "commerce_shop_channel",
  "commerce_shop_fulfillment_profile",
  "commerce_shop_settlement_profile",
  "commerce_shop_metric_snapshot",
  "commerce_shop_readiness",
  "commerce_product_category",
  "commerce_product_spu",
  "commerce_product_sku",
  "commerce_inventory_stock",
  "commerce_inventory_reservation",
  "commerce_cart",
  "commerce_cart_item",
  "commerce_checkout_session",
  "commerce_checkout_line",
  "commerce_checkout_quote",
  "commerce_order_address_snapshot",
  "commerce_order",
  "commerce_order_item",
  "commerce_order_amount_breakdown",
  "commerce_order_event",
  "commerce_order_cancellation",
  "commerce_fulfillment_order",
  "commerce_fulfillment_item",
  "commerce_shipment",
  "commerce_shipment_package",
  "commerce_shipment_tracking_event",
  "commerce_digital_delivery",
  "commerce_payment_intent",
  "commerce_payment_attempt",
  "commerce_payment_method",
  "commerce_payment_provider",
  "commerce_payment_channel",
  "commerce_payment_webhook_event",
  "commerce_refund",
];

const requiredAppCommerceOperations = [
  "shops.list",
  "shops.retrieve",
  "shops.current.retrieve",
  "shops.current.applications.list",
  "shops.current.applications.create",
  "shops.current.verifications.list",
  "shops.current.statusEvents.list",
  "shops.current.channels.list",
  "shops.current.channels.update",
  "shops.current.fulfillmentProfile.retrieve",
  "shops.current.fulfillmentProfile.update",
  "shops.current.settlementProfile.retrieve",
  "shops.current.settlementProfile.update",
  "shops.current.products.create",
  "shops.current.inventory.stocks.adjustments.create",
  "shops.current.orders.fulfillments.create",
  "catalog.categories.list",
  "catalog.products.list",
  "catalog.products.retrieve",
  "catalog.skus.retrieve",
  "checkout.sessions.create",
  "orders.create",
  "orders.list",
  "orders.retrieve",
  "orders.pay",
  "payments.create",
  "payments.intents.create",
  "payments.methods.list",
  "shipments.trackingEvents.list",
  "refunds.create",
];

const requiredBackendCommerceOperations = [
  "shops.management.list",
  "shops.create",
  "shops.management.retrieve",
  "shops.update",
  "shops.submitReview",
  "shops.approve",
  "shops.reject",
  "shops.suspend",
  "shops.resume",
  "shops.close",
  "shops.verifications.list",
  "shops.verifications.update",
  "shops.statusEvents.list",
  "shops.channels.list",
  "shops.channels.create",
  "shops.channels.update",
  "shops.fulfillmentProfile.retrieve",
  "shops.fulfillmentProfile.update",
  "shops.settlementProfile.retrieve",
  "shops.settlementProfile.update",
  "shops.settlementProfile.approve",
  "shops.settlementProfile.reject",
  "catalog.products.management.list",
  "catalog.products.create",
  "catalog.skus.list",
  "catalog.skus.create",
  "catalog.spus.publish",
  "inventory.stocks.list",
  "inventory.reservations.list",
  "orders.management.list",
  "orders.management.retrieve",
  "payments.providerAccounts.list",
  "payments.providerAccounts.create",
  "payments.channels.list",
  "payments.routeRules.list",
  "payments.reconciliationRuns.list",
  "payments.webhookEvents.replays.create",
  "refunds.management.list",
  "commerceReports.paymentReconciliation.retrieve",
];

function readWorkspaceFile(relativePath) {
  return readFileSync(path.join(workspaceRoot, relativePath), "utf8");
}

function collectFiles(root, predicate) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const fullPath = path.join(root, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectFiles(fullPath, predicate));
      continue;
    }
    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function openApiOperationIds(relativePath) {
  const document = JSON.parse(readWorkspaceFile(relativePath));
  const operationIds = [];
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!["get", "post", "put", "patch", "delete", "head", "options", "trace"].includes(method)) {
        continue;
      }
      operationIds.push(String(operation.operationId));
    }
  }
  return new Set(operationIds);
}

test("commerce OpenAPI and SDK tools no longer expose appbase extraction mode", () => {
  const toolFiles = [
    "tools/commerce_openapi_export.mjs",
    "tools/commerce_sdk_generate.mjs",
  ];
  const forbiddenMarkers = [
    "--from-appbase",
    "fromAppbase",
    "DEFAULT_APPBASE_ROOT",
    "defaultAppbase",
    "extractCommerceOnlyDocument",
    "sdkwork-appbase-app-api.openapi.yaml",
    "sdkwork-appbase-backend-api.openapi.yaml",
  ];

  for (const relativePath of toolFiles) {
    const source = readWorkspaceFile(relativePath);
    for (const marker of forbiddenMarkers) {
      assert.equal(
        source.includes(marker),
        false,
        `${relativePath} must not keep migration-only appbase extraction marker ${marker}`,
      );
    }
  }
});

test("commerce Rust HTTP source exposes commerce-owned store type names", () => {
  const rustFiles = collectFiles(
    path.join(workspaceRoot, "crates", "sdkwork-commerce-http-rust", "src"),
    (filePath) => filePath.endsWith(".rs"),
  );

  for (const filePath of rustFiles) {
    const source = readFileSync(filePath, "utf8");
    const matches = source.match(/\bAppbase[A-Za-z0-9_]*\b/g) ?? [];
    assert.deepEqual(
      [...new Set(matches)].sort(),
      [],
      `${path.relative(workspaceRoot, filePath)} must not expose Appbase-prefixed commerce Rust identifiers`,
    );
  }
});

test("commerce source text does not describe migrated commerce capabilities as appbase-owned", () => {
  const textRoots = [
    "packages/common/commerce",
    "apps/sdkwork-commerce-pc/packages/commerce",
    "crates",
    "README.md",
  ];
  const forbiddenPatterns = [
    /\bappbase app services\b/i,
    /\bappbase admin services\b/i,
    /\bappbase output\b/i,
    /\bshared appbase contract\b/i,
    /\bLower-level appbase packages only\b/i,
    /\bfrom_appbase_tables\b/i,
    /\bappbase_membership\b/i,
  ];
  const allowedPathFragments = [
    "target",
    "node_modules",
    "generated",
    "sdks/test/verify-commerce-migration-cleanup.test.mjs",
  ];

  const files = textRoots.flatMap((relativePath) => {
    const absolutePath = path.join(workspaceRoot, relativePath);
    if (statSync(absolutePath).isFile()) {
      return [absolutePath];
    }
    return collectFiles(absolutePath, (filePath) => /\.(md|rs|ts|tsx|mjs|json)$/.test(filePath));
  });

  const violations = [];
  for (const filePath of files) {
    const relativePath = path.relative(workspaceRoot, filePath).replaceAll("\\", "/");
    if (allowedPathFragments.some((fragment) => relativePath.includes(fragment))) {
      continue;
    }
    const source = readFileSync(filePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      const match = source.match(pattern);
      if (match) {
        violations.push(`${relativePath}: ${match[0]}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});

test("commerce owns the migrated product, order, and payment Rust persistence surface", () => {
  const missingCrates = requiredCommerceRustCrates.filter(
    (relativePath) => !existsSync(path.join(workspaceRoot, relativePath)),
  );
  assert.deepEqual(missingCrates, [], "commerce must keep product, order, payment, HTTP, runtime, and storage Rust crates");

  const workspaceCargo = readWorkspaceFile("Cargo.toml");
  for (const relativePath of requiredCommerceRustCrates) {
    const memberPath = relativePath.replace(/\/Cargo\.toml$/u, "");
    assert.match(
      workspaceCargo,
      new RegExp(memberPath.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")),
      `workspace Cargo.toml must include ${memberPath}`,
    );
  }

  const migrationSource = readWorkspaceFile(
    "crates/sdkwork-commerce-storage-sqlx-rust/migrations/0001_commerce_foundation.sql",
  );
  const missingTables = requiredCommerceDatabaseTables.filter(
    (tableName) => !migrationSource.includes(tableName),
  );
  assert.deepEqual(missingTables, [], "commerce SQL migration must own product, order, and payment tables");
  assert.match(
    migrationSource,
    /CREATE TABLE IF NOT EXISTS commerce_shop\s*\([\s\S]*organization_id TEXT NOT NULL[\s\S]*UNIQUE \(tenant_id, shop_no\)/,
    "commerce SQL migration must keep commerce_shop linked to appbase IAM organization_id",
  );
  assert.equal(
    /CREATE TABLE IF NOT EXISTS commerce_shop_(staff|member|role|permission|department|position)\b/.test(
      migrationSource,
    ),
    false,
    "commerce SQL migration must not duplicate appbase IAM staff, member, role, permission, department, or position tables",
  );

  for (const [tableName, requiredColumns] of Object.entries({
    commerce_shop: [
      "version INTEGER NOT NULL DEFAULT 0",
      "review_status TEXT NOT NULL",
      "data_scope TEXT NOT NULL",
      "submitted_at TEXT",
      "approved_at TEXT",
      "rejected_at TEXT",
      "suspended_at TEXT",
      "closed_at TEXT",
      "deleted_at TEXT",
    ],
    commerce_shop_application: [
      "application_no TEXT NOT NULL",
      "application_type TEXT NOT NULL",
      "review_status TEXT NOT NULL",
      "submitted_by TEXT NOT NULL",
      "submitted_at TEXT NOT NULL",
      "reviewed_by TEXT",
      "reviewed_at TEXT",
    ],
    commerce_shop_verification: [
      "verification_type TEXT NOT NULL",
      "verification_status TEXT NOT NULL",
      "legal_entity_name TEXT",
      "credential_no_hash TEXT",
      "expires_at TEXT",
    ],
    commerce_shop_status_event: [
      "event_type TEXT NOT NULL",
      "from_status TEXT",
      "to_status TEXT NOT NULL",
      "actor_id TEXT",
      "idempotency_key TEXT NOT NULL",
    ],
    commerce_shop_channel: [
      "channel_code TEXT NOT NULL",
      "storefront_status TEXT NOT NULL",
      "domain_name TEXT",
      "path_prefix TEXT",
      "theme_code TEXT",
    ],
    commerce_shop_fulfillment_profile: [
      "fulfillment_mode TEXT NOT NULL",
      "shipping_origin_region_code TEXT",
      "service_level_code TEXT",
      "after_sales_policy_json TEXT",
    ],
    commerce_shop_settlement_profile: [
      "settlement_status TEXT NOT NULL",
      "settlement_cycle TEXT NOT NULL",
      "settlement_currency_code TEXT NOT NULL",
      "account_ref TEXT",
      "risk_hold_days INTEGER NOT NULL DEFAULT 0",
    ],
    commerce_shop_metric_snapshot: [
      "snapshot_date TEXT NOT NULL",
      "gross_sales_amount TEXT NOT NULL DEFAULT '0'",
      "paid_order_count INTEGER NOT NULL DEFAULT 0",
      "fulfillment_pending_count INTEGER NOT NULL DEFAULT 0",
    ],
    commerce_shop_readiness: [
      "readiness_scope TEXT NOT NULL",
      "readiness_status TEXT NOT NULL",
      "blocking_count INTEGER NOT NULL DEFAULT 0",
      "warning_count INTEGER NOT NULL DEFAULT 0",
      "checklist_json TEXT NOT NULL DEFAULT '[]'",
      "evaluated_at TEXT NOT NULL",
      "version INTEGER NOT NULL DEFAULT 0",
    ],
    commerce_checkout_session: [
      "checkout_session_no TEXT NOT NULL",
      "owner_user_id TEXT NOT NULL",
      "request_hash TEXT NOT NULL",
      "idempotency_key TEXT NOT NULL",
      "expires_at TEXT NOT NULL",
    ],
    commerce_checkout_line: [
      "checkout_session_id TEXT NOT NULL",
      "sku_id TEXT NOT NULL",
      "purchase_type TEXT NOT NULL",
      "fulfillment_type TEXT NOT NULL",
      "price_amount_snapshot TEXT NOT NULL",
    ],
    commerce_checkout_quote: [
      "checkout_session_id TEXT NOT NULL",
      "quote_no TEXT NOT NULL",
      "shipping_amount TEXT NOT NULL DEFAULT '0'",
      "tax_amount TEXT NOT NULL DEFAULT '0'",
      "payable_amount TEXT NOT NULL",
    ],
    commerce_order_address_snapshot: [
      "order_id TEXT NOT NULL",
      "address_type TEXT NOT NULL",
      "snapshot_version INTEGER NOT NULL DEFAULT 1",
      "phone_hash TEXT",
      "address_snapshot_json TEXT NOT NULL",
    ],
    commerce_order_event: [
      "event_no TEXT NOT NULL",
      "order_id TEXT NOT NULL",
      "event_type TEXT NOT NULL",
      "from_status TEXT",
      "to_status TEXT NOT NULL",
      "idempotency_key TEXT NOT NULL",
    ],
    commerce_order_cancellation: [
      "cancellation_no TEXT NOT NULL",
      "order_id TEXT NOT NULL",
      "status TEXT NOT NULL",
      "reason_code TEXT NOT NULL",
      "idempotency_key TEXT NOT NULL",
    ],
    commerce_fulfillment_order: [
      "fulfillment_no TEXT NOT NULL",
      "order_id TEXT NOT NULL",
      "fulfillment_type TEXT NOT NULL",
      "delivery_method TEXT",
      "idempotency_key TEXT NOT NULL",
    ],
    commerce_fulfillment_item: [
      "fulfillment_id TEXT NOT NULL",
      "order_item_id TEXT NOT NULL",
      "quantity INTEGER NOT NULL",
      "fulfilled_quantity INTEGER NOT NULL DEFAULT 0",
      "status TEXT NOT NULL",
    ],
    commerce_shipment: [
      "shipment_no TEXT NOT NULL",
      "fulfillment_id TEXT NOT NULL",
      "carrier_code TEXT NOT NULL",
      "tracking_no TEXT",
      "label_ref TEXT",
    ],
    commerce_shipment_package: [
      "shipment_id TEXT NOT NULL",
      "package_no TEXT NOT NULL",
      "package_type TEXT NOT NULL",
      "weight_gram INTEGER",
      "label_ref TEXT",
    ],
    commerce_shipment_tracking_event: [
      "shipment_id TEXT NOT NULL",
      "carrier_code TEXT NOT NULL",
      "event_type TEXT NOT NULL",
      "event_time TEXT NOT NULL",
      "payload_json TEXT",
    ],
    commerce_digital_delivery: [
      "delivery_no TEXT NOT NULL",
      "fulfillment_id TEXT NOT NULL",
      "asset_ref TEXT NOT NULL",
      "access_grant_ref TEXT",
      "status TEXT NOT NULL",
    ],
  })) {
    assert.ok(
      migrationSource.includes(`CREATE TABLE IF NOT EXISTS ${tableName}`),
      `commerce SQL migration must create ${tableName}`,
    );
    for (const column of requiredColumns) {
      assert.ok(
        migrationSource.includes(column),
        `commerce SQL migration ${tableName} must include ${column}`,
      );
    }
  }

  for (const indexName of [
    "idx_commerce_shop_review_status",
    "idx_commerce_shop_application_review",
    "idx_commerce_shop_verification_status",
    "idx_commerce_shop_status_event_shop_created",
    "idx_commerce_shop_channel_shop_code",
    "idx_commerce_shop_fulfillment_profile_shop",
    "idx_commerce_shop_settlement_profile_status",
    "idx_commerce_shop_metric_snapshot_shop_date",
    "idx_commerce_shop_readiness_status",
    "idx_commerce_checkout_session_owner_status",
    "idx_commerce_checkout_line_session_sku",
    "idx_commerce_checkout_quote_session_status",
    "idx_commerce_order_address_snapshot_order_type",
    "idx_commerce_order_event_order_created",
    "idx_commerce_order_cancellation_order_status",
    "idx_commerce_fulfillment_order_order_status",
    "idx_commerce_fulfillment_item_fulfillment_status",
    "idx_commerce_shipment_fulfillment_status",
    "idx_commerce_shipment_tracking_no",
    "idx_commerce_shipment_package_shipment",
    "idx_commerce_shipment_tracking_event_shipment_time",
    "idx_commerce_digital_delivery_fulfillment_status",
  ]) {
    assert.ok(
      migrationSource.includes(`CREATE INDEX IF NOT EXISTS ${indexName}`),
      `commerce SQL migration must expose shop index ${indexName}`,
    );
  }
});

test("commerce app and backend OpenAPI keep migrated product, order, and payment operations", () => {
  const appOperationIds = openApiOperationIds("generated/openapi/commerce-app-api.openapi.json");
  const backendOperationIds = openApiOperationIds(
    "generated/openapi/commerce-backend-api.openapi.json",
  );

  assert.deepEqual(
    requiredAppCommerceOperations.filter((operationId) => !appOperationIds.has(operationId)),
    [],
    "commerce app OpenAPI must keep product, checkout, order, payment, and refund operations",
  );
  assert.deepEqual(
    requiredBackendCommerceOperations.filter((operationId) => !backendOperationIds.has(operationId)),
    [],
    "commerce backend OpenAPI must keep product, inventory, order, payment, refund, and reporting operations",
  );
  for (const operationId of [...appOperationIds, ...backendOperationIds]) {
    assert.equal(
      /(^|\.)shops\.(staff|members|roles|permissions)\./.test(operationId),
      false,
      `commerce OpenAPI must not expose shop IAM duplicate operation ${operationId}`,
    );
  }
});
