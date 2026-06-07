import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS,
  SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS,
  assertCommerceAppSdkClient,
  assertCommerceBackendSdkClient,
  getCommerceSdkSurface,
} from "../src/index";

const RETIRED_TIER_ROOT = "v" + "ip";

describe("SDKWork commerce SDK port contracts", () => {
  it("defines app and backend SDK ports as commerce-root generated capabilities", () => {
    const source = readFileSync(
      resolve(process.cwd(), "packages/common/commerce/sdkwork-commerce-sdk-ports/src/index.ts"),
      "utf8",
    );

    expect(source).toContain("APP_COMMERCE_METHOD_TREE");
    expect(source).toContain("BACKEND_COMMERCE_METHOD_TREE");
    expect(source).toContain("APP_SDK_METHOD_TREE");
    expect(source).toContain("BACKEND_SDK_METHOD_TREE");
    expect(source).toContain("CommerceAppResourceClient");
    expect(source).toContain("CommerceBackendResourceClient");
    expect(source).not.toContain("APP_BILLING_METHOD_TREE");
    expect(source).not.toContain("BACKEND_BILLING_METHOD_TREE");
    expect(source).not.toContain("CommerceBillingResourceClient");
    expect(source).not.toContain("CommerceBackendBillingResourceClient");
  });

  it("publishes required app SDK methods through commerce root", () => {
    for (const method of [
      "commerce.accounts.current.summary.retrieve",
      "commerce.cart.current.retrieve",
      "commerce.cart.items.create",
      "commerce.addresses.defaultSelection.create",
      "commerce.checkout.sessions.orders.create",
      "commerce.orders.cancellations.create",
      "commerce.payments.intents.attempts.create",
      "commerce.refunds.create",
      "commerce.fulfillments.retrieve",
      "commerce.shipments.retrieve",
      "commerce.memberships.purchases.create",
      "commerce.billing.history.list",
      "commerce.recharges.orders.create",
      "commerce.recharges.settings.retrieve",
      "commerce.wallet.ledgerEntries.retrieve",
      "commerce.promotions.offers.list",
      "commerce.promotions.userCoupons.list",
      "commerce.promotions.userCoupons.claims.create",
      "commerce.promotions.codes.redemptions.create",
      "commerce.promotions.discountApplications.create",
      "commerce.promotions.discountApplications.settle",
      "commerce.promotions.discountApplications.release",
      "commerce.invoices.create",
    ]) {
      expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).toContain(method);
    }

    for (const retired of [
      "billing.account.summary.retrieve",
      "billing.wallet.transactions.retrieve",
      "billing.coupons.redeem.create",
      "billing.payments.checkout.retrieve",
      "billing." + RETIRED_TIER_ROOT + ".purchase.create",
      "billing.preflight.preholds.create",
      "commerce.coupons.list",
      "commerce.coupons.redemptions.create",
      "commerce.coupons.templates.list",
      "users.current.coupons.list",
      RETIRED_TIER_ROOT + ".purchase.create",
      "preflight.preholds.create",
    ]) {
      expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).not.toContain(retired);
    }
  });

  it("publishes required backend SDK methods through commerce root", () => {
    for (const method of [
      "commerce.catalog.products.create",
      "commerce.inventory.stocks.update",
      "commerce.orders.events.list",
      "commerce.payments.providerAccounts.create",
      "commerce.payments.providerAccounts.delete",
      "commerce.payments.providerAccounts.status.update",
      "commerce.payments.reconciliationRuns.list",
      "commerce.payments.runtime.snapshot.retrieve",
      "commerce.refunds.retrieve",
      "commerce.entitlements.grants.list",
      "commerce.entitlements.accounts.list",
      "commerce.entitlements.ledgerEntries.list",
      "commerce.memberships.entitlements.list",
      "commerce.recharges.packages.delete",
      "commerce.recharges.orders.list",
      "commerce.recharges.settings.update",
      "commerce.wallet.adjustments.create",
      "commerce.promotions.offers.management.list",
      "commerce.promotions.couponStocks.list",
      "commerce.promotions.codes.list",
      "commerce.promotions.userCoupons.management.list",
      "commerce.promotions.discountApplications.list",
      "commerce.promotions.discountAllocations.list",
      "commerce.invoices.titles.list",
      "commerce.commerceReports.paymentReconciliation.retrieve",
      "commerce.audit.commerceEvents.list",
    ]) {
      expect(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS).toContain(method);
    }

    for (const retired of [
      "billing.coupons.list",
      "billing.finance.usageStatements.list",
      "billing." + RETIRED_TIER_ROOT + ".levels.create",
      "commerce.coupons.campaigns.list",
      "commerce.coupons.codes.list",
      "commerce.coupons.redemptions.list",
      "finance.usageStatements.list",
      RETIRED_TIER_ROOT + ".levels.create",
    ]) {
      expect(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS).not.toContain(retired);
    }
  });

  it("accepts generated SDK clients mounted at commerce root", () => {
    const appClient = createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS);
    const backendClient = createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS);

    expect(() => assertCommerceAppSdkClient(appClient)).not.toThrow();
    expect(() => assertCommerceBackendSdkClient(backendClient)).not.toThrow();
    expect(getCommerceSdkSurface(appClient)).toContain("commerce.memberships.purchases.create");
    expect(getCommerceSdkSurface(backendClient)).toContain("commerce.payments.providerAccounts.create");
  });

  it("rejects billing roots and incomplete commerce clients", () => {
    expect(() =>
      assertCommerceAppSdkClient({
        ...createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
        billing: { account: { summary: { retrieve: vi.fn() } } },
      }),
    ).toThrow(/retired.*billing/i);

    expect(() =>
      assertCommerceBackendSdkClient({
        ...createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS),
        billing: { finance: { usageStatements: { list: vi.fn() } } },
      }),
    ).toThrow(/retired.*billing/i);

    expect(() =>
      assertCommerceAppSdkClient({
        ...createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS),
        commerce: {
          ...createClient(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).commerce,
          coupons: { redemptions: { create: vi.fn() } },
        },
      }),
    ).toThrow(/retired.*commerce\.coupons/i);

    expect(() =>
      assertCommerceBackendSdkClient({
        ...createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS),
        commerce: {
          ...createClient(SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS).commerce,
          coupons: { redemptions: { list: vi.fn() } },
        },
      }),
    ).toThrow(/retired.*commerce\.coupons/i);

    expect(() =>
      assertCommerceAppSdkClient({
        commerce: {
          accounts: {
            current: {
              summary: { retrieve: vi.fn() },
            },
          },
        },
      }),
    ).toThrow(/commerce\.promotions\.codes\.redemptions\.create/);
  });
});

function createClient(methods: readonly string[]) {
  const root: Record<string, any> = {};
  for (const method of methods) {
    let node = root;
    const segments = method.split(".");
    for (const segment of segments.slice(0, -1)) {
      node[segment] ??= {};
      node = node[segment];
    }
    node[segments.at(-1)!] = vi.fn();
  }
  return root;
}
