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
  "commerce_product_category",
  "commerce_product_spu",
  "commerce_product_sku",
  "commerce_inventory_stock",
  "commerce_inventory_reservation",
  "commerce_cart",
  "commerce_cart_item",
  "commerce_order",
  "commerce_order_item",
  "commerce_order_amount_breakdown",
  "commerce_payment_intent",
  "commerce_payment_attempt",
  "commerce_payment_method",
  "commerce_payment_provider",
  "commerce_payment_channel",
  "commerce_payment_webhook_event",
  "commerce_refund",
];

const requiredAppCommerceOperations = [
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
  "refunds.create",
];

const requiredBackendCommerceOperations = [
  "catalog.products.list",
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
  "payments.webhooks.replay",
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
});
