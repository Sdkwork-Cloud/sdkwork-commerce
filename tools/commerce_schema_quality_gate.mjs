#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
]);
const SDK_OWNER = "sdkwork-commerce";
const SDK_AUTHORITIES = {
  open: "sdkwork-commerce.open",
  app: "sdkwork-commerce.app",
  backend: "sdkwork-commerce.backend",
};
const APPBASE_DEPENDENCY_PATH_PREFIXES = [
  "/app/v3/api/auth/",
  "/app/v3/api/iam/",
  "/app/v3/api/open_platform/",
  "/app/v3/api/system/iam/",
  "/backend/v3/api/auth/",
  "/backend/v3/api/iam/",
  "/backend/v3/api/open_platform/",
  "/backend/v3/api/system/iam/",
];
const REQUIRED_APP_OPERATION_IDS = [
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
  "wallet.transactions.list",
  "wallet.accounts.list",
  "wallet.overview.retrieve",
  "memberships.packages.list",
  "memberships.purchases.create",
  "promotions.offers.list",
  "promotions.userCoupons.list",
  "invoices.create",
  "invoices.list",
  "recharges.orders.create",
  "refunds.create",
];
const REQUIRED_BACKEND_OPERATION_IDS = [
  "catalog.products.list",
  "catalog.products.create",
  "catalog.products.delete",
  "catalog.skus.list",
  "catalog.skus.delete",
  "catalog.categorySeeds.create",
  "catalog.categoryAttributes.list",
  "catalog.categoryAttributes.create",
  "catalog.categoryAttributes.update",
  "catalog.categoryAttributes.delete",
  "catalog.spus.publish",
  "inventory.stocks.list",
  "inventory.reservations.list",
  "orders.management.list",
  "orders.management.retrieve",
  "payments.providerAccounts.list",
  "payments.providerAccounts.create",
  "payments.reconciliationRuns.list",
  "payments.webhooks.replay",
  "wallet.accounts.management.list",
  "wallet.adjustments.create",
  "memberships.plans.management.list",
  "memberships.packages.list",
  "promotions.offers.management.list",
  "promotions.couponStocks.list",
  "invoices.management.list",
  "commerceReports.paymentReconciliation.retrieve",
  "reports.commerceOverview.retrieve",
  "refunds.management.list",
];
const REQUIRED_DATABASE_MARKERS = [
  "commerce_product_spu",
  "commerce_product_sku",
  "commerce_inventory_stock",
  "commerce_order",
  "commerce_order_item",
  "commerce_payment_intent",
  "commerce_payment_webhook_event",
  "commerce_refund",
  "commerce_account",
  "commerce_account_ledger_entry",
  "commerce_billing_history",
  "commerce_invoice",
  "promotion_offer",
  "promotion_user_coupon",
  "membership_plan",
  "membership_package",
  "membership_subscription",
];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const defaultOpenOpenapiPath = path.join(
  workspaceRoot,
  "generated",
  "openapi",
  "commerce-open-api.openapi.json",
);
const defaultAppOpenapiPath = path.join(
  workspaceRoot,
  "generated",
  "openapi",
  "commerce-app-api.openapi.json",
);
const defaultBackendOpenapiPath = path.join(
  workspaceRoot,
  "generated",
  "openapi",
  "commerce-backend-api.openapi.json",
);

function fail(message) {
  process.stderr.write(`[commerce_schema_quality_gate] ${message}\n`);
  process.exit(1);
}

function resolveWorkspacePath(inputPath) {
  if (!inputPath) {
    fail("path argument cannot be empty");
  }
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(workspaceRoot, inputPath);
}

function parseArgs(argv) {
  const parsed = {
    openOpenapiPath: defaultOpenOpenapiPath,
    appOpenapiPath: defaultAppOpenapiPath,
    backendOpenapiPath: defaultBackendOpenapiPath,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--open-openapi") {
      parsed.openOpenapiPath = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current === "--app-openapi") {
      parsed.appOpenapiPath = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current === "--backend-openapi") {
      parsed.backendOpenapiPath = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    fail(`unknown argument: ${current}`);
  }
  return parsed;
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing file: ${filePath}`);
  }
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`invalid json ${filePath}: ${error.message}`);
  }
}

function operationEntries(document) {
  const entries = [];
  for (const [pathKey, pathItem] of Object.entries(document.paths || {})) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method.toLowerCase())) {
        continue;
      }
      entries.push({ pathKey, method: method.toLowerCase(), operation });
    }
  }
  return entries;
}

function collectOperationIds(document, label) {
  const ids = [];
  for (const { pathKey, method, operation } of operationEntries(document)) {
    if (!operation?.operationId) {
      fail(`${label} ${method.toUpperCase()} ${pathKey} missing operationId`);
    }
    ids.push(String(operation.operationId));
  }
  return ids;
}

function assertOpenapiVersion31(document, label) {
  if (!document.openapi || !String(document.openapi).startsWith("3.1")) {
    fail(`${label} must use OpenAPI 3.1.x`);
  }
}

function assertPathPrefix(document, prefix, label) {
  for (const pathKey of Object.keys(document.paths || {})) {
    if (!pathKey.startsWith(prefix)) {
      fail(`${label} path must start with ${prefix}: ${pathKey}`);
    }
  }
}

function assertNoDependencyOwnedPaths(document, label) {
  for (const pathKey of Object.keys(document.paths || {})) {
    const prefix = APPBASE_DEPENDENCY_PATH_PREFIXES.find((candidate) =>
      pathKey.startsWith(candidate),
    );
    if (prefix) {
      fail(`${label} must not include appbase dependency path ${pathKey}; prefix=${prefix}`);
    }
  }
}

function assertOwnerMetadata(document, expectedAuthority, label) {
  if (document["x-sdkwork-owner"] !== SDK_OWNER) {
    fail(`${label} must declare x-sdkwork-owner=${SDK_OWNER}`);
  }
  if (document["x-sdkwork-api-authority"] !== expectedAuthority) {
    fail(`${label} must declare x-sdkwork-api-authority=${expectedAuthority}`);
  }
  if (document.info?.["x-sdkwork-owner"] !== SDK_OWNER) {
    fail(`${label} info must declare x-sdkwork-owner=${SDK_OWNER}`);
  }
  if (document.info?.["x-sdkwork-api-authority"] !== expectedAuthority) {
    fail(`${label} info must declare x-sdkwork-api-authority=${expectedAuthority}`);
  }
  for (const { pathKey, method, operation } of operationEntries(document)) {
    if (operation?.["x-sdkwork-owner"] !== SDK_OWNER) {
      fail(`${label} ${method.toUpperCase()} ${pathKey} must be ${SDK_OWNER} owned`);
    }
    if (operation?.["x-sdkwork-api-authority"] !== expectedAuthority) {
      fail(`${label} ${method.toUpperCase()} ${pathKey} must use ${expectedAuthority}`);
    }
    if (operation?.["x-sdkwork-domain"] !== "commerce") {
      fail(`${label} ${method.toUpperCase()} ${pathKey} must declare commerce domain`);
    }
  }
}

function assertProblemDetailSchema(document, label) {
  const schema = document.components?.schemas?.ProblemDetail;
  if (!schema) {
    fail(`${label} missing components.schemas.ProblemDetail`);
  }
  const properties = schema.properties || {};
  for (const propertyName of ["type", "title", "status", "detail", "code", "traceId", "requestId"]) {
    if (!properties[propertyName]) {
      fail(`${label} ProblemDetail missing property ${propertyName}`);
    }
  }
}

function assertCommerceEnvelopeSchemas(document, label) {
  const schemas = document.components?.schemas || {};
  if (!schemas.CommerceApiResult) {
    fail(`${label} missing CommerceApiResult schema`);
  }
  if (!schemas.CommerceOperationCommand) {
    fail(`${label} missing CommerceOperationCommand schema`);
  }
  if (schemas.AppbaseApiResult || schemas.AppbaseOperationCommand) {
    fail(`${label} must not expose appbase-named commerce envelope schemas`);
  }
}

function assertDualTokenSecurity(document, label) {
  const schemes = document.components?.securitySchemes;
  if (!schemes || typeof schemes !== "object") {
    fail(`${label} missing components.securitySchemes`);
  }
  if (schemes.AuthToken?.type !== "http" || schemes.AuthToken?.scheme !== "bearer") {
    fail(`${label} AuthToken must be HTTP bearer`);
  }
  if (
    schemes.AccessToken?.type !== "apiKey" ||
    schemes.AccessToken?.in !== "header" ||
    schemes.AccessToken?.name !== "Access-Token"
  ) {
    fail(`${label} AccessToken must be canonical Access-Token header`);
  }
}

function assertUniqueOperationIds(operationIds, label) {
  const seen = new Set();
  for (const operationId of operationIds) {
    if (seen.has(operationId)) {
      fail(`${label} duplicate operationId: ${operationId}`);
    }
    seen.add(operationId);
  }
}

function assertOperationIdsInclude(operationIds, requiredOperationIds, label) {
  const actual = new Set(operationIds);
  for (const operationId of requiredOperationIds) {
    if (!actual.has(operationId)) {
      fail(`${label} missing required operationId: ${operationId}`);
    }
  }
}

function assertNoAppbaseOwnershipStrings(document, label) {
  const source = JSON.stringify(document);
  for (const forbidden of [
    "\"x-sdkwork-owner\":\"sdkwork-appbase\"",
    "\"x-sdkwork-domain\":\"iam\"",
    "\"x-sdkwork-domain\":\"auth\"",
    "#/components/schemas/Appbase",
  ]) {
    if (source.includes(forbidden)) {
      fail(`${label} contains forbidden appbase ownership marker: ${forbidden}`);
    }
  }
}

function assertCommerceDatabaseMigrated() {
  const storageSourcePath = path.join(
    workspaceRoot,
    "crates",
    "sdkwork-commerce-storage-sqlx-rust",
    "src",
    "lib.rs",
  );
  const migrationSourcePath = path.join(
    workspaceRoot,
    "crates",
    "sdkwork-commerce-storage-sqlx-rust",
    "migrations",
    "0001_commerce_foundation.sql",
  );
  const storageSource = readFileSync(storageSourcePath, "utf8");
  const migrationSource = readFileSync(migrationSourcePath, "utf8");
  for (const marker of REQUIRED_DATABASE_MARKERS) {
    if (!storageSource.includes(marker) && !migrationSource.includes(marker)) {
      fail(`commerce storage migration missing database marker: ${marker}`);
    }
  }
}

const args = parseArgs(process.argv.slice(2));
const openOpenapi = readJson(args.openOpenapiPath);
const appOpenapi = readJson(args.appOpenapiPath);
const backendOpenapi = readJson(args.backendOpenapiPath);

assertOpenapiVersion31(openOpenapi, "open openapi");
assertOpenapiVersion31(appOpenapi, "app openapi");
assertOpenapiVersion31(backendOpenapi, "backend openapi");
assertPathPrefix(openOpenapi, "/open/v3/api", "open openapi");
assertPathPrefix(appOpenapi, "/app/v3/api", "app openapi");
assertPathPrefix(backendOpenapi, "/backend/v3/api", "backend openapi");
assertNoDependencyOwnedPaths(openOpenapi, "open openapi");
assertNoDependencyOwnedPaths(appOpenapi, "app openapi");
assertNoDependencyOwnedPaths(backendOpenapi, "backend openapi");
assertOwnerMetadata(openOpenapi, SDK_AUTHORITIES.open, "open openapi");
assertOwnerMetadata(appOpenapi, SDK_AUTHORITIES.app, "app openapi");
assertOwnerMetadata(backendOpenapi, SDK_AUTHORITIES.backend, "backend openapi");
assertProblemDetailSchema(appOpenapi, "app openapi");
assertProblemDetailSchema(backendOpenapi, "backend openapi");
assertCommerceEnvelopeSchemas(appOpenapi, "app openapi");
assertCommerceEnvelopeSchemas(backendOpenapi, "backend openapi");
assertDualTokenSecurity(appOpenapi, "app openapi");
assertDualTokenSecurity(backendOpenapi, "backend openapi");
assertNoAppbaseOwnershipStrings(openOpenapi, "open openapi");
assertNoAppbaseOwnershipStrings(appOpenapi, "app openapi");
assertNoAppbaseOwnershipStrings(backendOpenapi, "backend openapi");

const openOperationIds = collectOperationIds(openOpenapi, "open openapi");
const appOperationIds = collectOperationIds(appOpenapi, "app openapi");
const backendOperationIds = collectOperationIds(backendOpenapi, "backend openapi");
assertUniqueOperationIds(openOperationIds, "open openapi");
assertUniqueOperationIds(appOperationIds, "app openapi");
assertUniqueOperationIds(backendOperationIds, "backend openapi");
assertOperationIdsInclude(appOperationIds, REQUIRED_APP_OPERATION_IDS, "app openapi");
assertOperationIdsInclude(
  backendOperationIds,
  REQUIRED_BACKEND_OPERATION_IDS,
  "backend openapi",
);
assertCommerceDatabaseMigrated();

process.stdout.write("[commerce_schema_quality_gate] passed\n");

