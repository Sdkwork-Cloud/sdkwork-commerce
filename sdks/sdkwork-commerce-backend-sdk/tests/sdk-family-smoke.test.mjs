import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(testDir, "..");

test("sdkwork-commerce-backend-sdk uses sdkwork-v3 profile", () => {
  const source = readFileSync(path.join(sdkRoot, "bin/generate-sdk.mjs"), "utf8");
  assert.match(source, /--standard-profile/);
  assert.match(source, /sdkwork-v3/);
  assert.match(source, /runCommerceSdkGenerator/);
});

test("sdkwork-commerce-backend-sdk declares appbase as a consumer SDK dependency", () => {
  const assembly = JSON.parse(readFileSync(path.join(sdkRoot, ".sdkwork-assembly.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(path.join(sdkRoot, "sdk-manifest.json"), "utf8"));
  for (const document of [assembly, manifest]) {
    assert.equal(document.sdkOwner, "sdkwork-commerce");
    assert.equal(document.apiAuthority, "sdkwork-commerce.backend");
    assert.equal(document.generationInputSpec, "../../generated/openapi/commerce-backend-api.openapi.json");
    assert.deepEqual(
      document.sdkDependencies?.map((dependency) => ({
        workspace: dependency.workspace,
        apiAuthority: dependency.apiAuthority,
        dependencyMode: dependency.dependencyMode,
        generatedTransportImportPolicy: dependency.generatedTransportImportPolicy,
      })),
      [
        {
          workspace: "sdkwork-appbase-backend-sdk",
          apiAuthority: "sdkwork-appbase.backend",
          dependencyMode: "consumer-sdk",
          generatedTransportImportPolicy: "forbidden",
        },
      ],
    );
  }
});

test("sdkwork-commerce-backend-sdk exposes complete admin payment and recharge management methods", () => {
  const openapi = readFileSync(
    path.join(sdkRoot, "..", "..", "generated", "openapi", "commerce-backend-api.openapi.json"),
    "utf8",
  );
  const paymentsSource = readFileSync(
    path.join(
      sdkRoot,
      "sdkwork-commerce-backend-sdk-typescript",
      "generated",
      "server-openapi",
      "src",
      "api",
      "payments.ts",
    ),
    "utf8",
  );
  const rechargesSource = readFileSync(
    path.join(
      sdkRoot,
      "sdkwork-commerce-backend-sdk-typescript",
      "generated",
      "server-openapi",
      "src",
      "api",
      "recharges.ts",
    ),
    "utf8",
  );

  assert.match(openapi, /"operationId": "payments\.providerAccounts\.delete"/);
  assert.match(openapi, /"operationId": "payments\.providerAccounts\.status\.update"/);
  assert.match(openapi, /"operationId": "payments\.runtime\.snapshot\.retrieve"/);
  assert.match(openapi, /"operationId": "recharges\.packages\.list"/);
  assert.doesNotMatch(openapi, /"operationId": "recharges\.packages\.management\.list"/);
  assert.match(openapi, /"operationId": "recharges\.packages\.delete"/);
  assert.match(openapi, /"operationId": "recharges\.settings\.retrieve"/);
  assert.match(openapi, /"operationId": "recharges\.settings\.update"/);
  assert.match(paymentsSource, /async delete\(providerAccountId: string/);
  assert.match(paymentsSource, /class PaymentsProviderAccountsStatusApi/);
  assert.match(paymentsSource, /class PaymentsRuntimeSnapshotApi/);
  assert.match(paymentsSource, /public readonly status: PaymentsProviderAccountsStatusApi/);
  assert.match(paymentsSource, /public readonly snapshot: PaymentsRuntimeSnapshotApi/);
  assert.match(rechargesSource, /class RechargesPackagesApi[\s\S]*async list\(params\?: RechargesPackagesListParams/);
  assert.doesNotMatch(rechargesSource, /class RechargesPackagesManagementApi/);
  assert.match(rechargesSource, /async delete\(packageId: string/);
  assert.match(rechargesSource, /class RechargesSettingsApi/);
  assert.match(rechargesSource, /public readonly settings: RechargesSettingsApi/);
});

test("sdkwork-commerce-backend-sdk exposes complete admin promotion inspection methods", () => {
  const openapi = readFileSync(
    path.join(sdkRoot, "..", "..", "generated", "openapi", "commerce-backend-api.openapi.json"),
    "utf8",
  );
  const promotionsSource = readFileSync(
    path.join(
      sdkRoot,
      "sdkwork-commerce-backend-sdk-typescript",
      "generated",
      "server-openapi",
      "src",
      "api",
      "promotions.ts",
    ),
    "utf8",
  );

  for (const operationId of [
    "promotions.codes.redemptions.list",
    "promotions.couponLedgerEntries.list",
    "promotions.budgetLedgerEntries.list",
    "promotions.externalBindings.list",
    "promotions.events.list",
  ]) {
    assert.match(openapi, new RegExp(`"operationId": "${operationId.replaceAll(".", "\\.")}"`));
  }
  assert.match(promotionsSource, /class PromotionsCodesRedemptionsApi/);
  assert.match(promotionsSource, /public readonly redemptions: PromotionsCodesRedemptionsApi/);
  assert.match(promotionsSource, /class PromotionsCouponLedgerEntriesApi/);
  assert.match(promotionsSource, /class PromotionsBudgetLedgerEntriesApi/);
  assert.match(promotionsSource, /class PromotionsExternalBindingsApi/);
  assert.match(promotionsSource, /class PromotionsEventsApi/);
});

test("sdkwork-commerce-backend-sdk exposes canonical admin membership entitlement methods", () => {
  const openapi = readFileSync(
    path.join(sdkRoot, "..", "..", "generated", "openapi", "commerce-backend-api.openapi.json"),
    "utf8",
  );
  const membershipsSource = readFileSync(
    path.join(
      sdkRoot,
      "sdkwork-commerce-backend-sdk-typescript",
      "generated",
      "server-openapi",
      "src",
      "api",
      "memberships.ts",
    ),
    "utf8",
  );

  assert.match(openapi, /"operationId": "memberships\.entitlements\.list"/);
  assert.doesNotMatch(openapi, /"operationId": "memberships\.entitlements\.management\.list"/);
  assert.match(openapi, /"x-sdkwork-resource": "memberships\.entitlements"/);
  assert.match(membershipsSource, /class MembershipsEntitlementsApi[\s\S]*async list\(params\?: MembershipsEntitlementsListParams/);
  assert.doesNotMatch(membershipsSource, /class MembershipsEntitlementsManagementApi/);
});

