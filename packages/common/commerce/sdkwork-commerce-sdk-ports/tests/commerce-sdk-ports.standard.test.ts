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
      "commerce.shops.list",
      "commerce.shops.retrieve",
      "commerce.shops.current.retrieve",
      "commerce.shops.current.dashboard.retrieve",
      "commerce.shops.current.readiness.retrieve",
      "commerce.shops.current.applications.list",
      "commerce.shops.current.applications.create",
      "commerce.shops.current.categoryBindings.list",
      "commerce.shops.current.categoryBindings.upsert",
      "commerce.shops.current.brandAuthorizations.list",
      "commerce.shops.current.brandAuthorizations.upsert",
      "commerce.shops.current.qualifications.list",
      "commerce.shops.current.qualifications.upsert",
      "commerce.shops.current.customerServices.list",
      "commerce.shops.current.customerServices.upsert",
      "commerce.shops.current.returnAddresses.list",
      "commerce.shops.current.returnAddresses.upsert",
      "commerce.shops.current.shippingTemplates.list",
      "commerce.shops.current.shippingTemplates.upsert",
      "commerce.shops.current.verifications.list",
      "commerce.shops.current.statusEvents.list",
      "commerce.shops.current.businessHours.retrieve",
      "commerce.shops.current.businessHours.update",
      "commerce.shops.current.serviceAreas.list",
      "commerce.shops.current.serviceAreas.create",
      "commerce.shops.current.serviceAreas.update",
      "commerce.shops.current.policies.list",
      "commerce.shops.current.policies.update",
      "commerce.shops.current.depositAccount.retrieve",
      "commerce.shops.current.riskSignals.list",
      "commerce.shops.current.channels.list",
      "commerce.shops.current.channels.update",
      "commerce.shops.current.fulfillmentProfile.retrieve",
      "commerce.shops.current.fulfillmentProfile.update",
      "commerce.shops.current.settlementProfile.retrieve",
      "commerce.shops.current.settlementProfile.update",
      "commerce.shops.current.products.create",
      "commerce.shops.current.products.publish",
      "commerce.shops.current.inventory.stocks.adjustments.create",
      "commerce.shops.current.orders.fulfillments.create",
      "commerce.shops.current.settlements.list",
      "commerce.cart.current.retrieve",
      "commerce.cart.items.create",
      "commerce.addresses.defaultSelection.create",
      "commerce.checkout.sessions.orders.create",
      "commerce.orders.cancellations.create",
      "commerce.payments.intents.attempts.create",
      "commerce.refunds.create",
      "commerce.afterSales.requests.list",
      "commerce.afterSales.requests.create",
      "commerce.afterSales.requests.retrieve",
      "commerce.afterSales.returnShipments.list",
      "commerce.afterSales.returnShipments.create",
      "commerce.afterSales.events.list",
      "commerce.fulfillments.retrieve",
      "commerce.shipments.retrieve",
      "commerce.shipments.packages.list",
      "commerce.shipments.trackingEvents.list",
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
      "commerce.shops.staff.list",
      "commerce.shops.members.list",
      "commerce.shops.roles.list",
      "commerce.shops.permissions.list",
      "users.current.coupons.list",
      RETIRED_TIER_ROOT + ".purchase.create",
      "preflight.preholds.create",
    ]) {
      expect(SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS).not.toContain(retired);
    }
  });

  it("publishes required backend SDK methods through commerce root", () => {
    for (const method of [
      "commerce.shops.management.list",
      "commerce.shops.management.retrieve",
      "commerce.shops.create",
      "commerce.shops.update",
      "commerce.shops.submitReview",
      "commerce.shops.approve",
      "commerce.shops.reject",
      "commerce.shops.suspend",
      "commerce.shops.resume",
      "commerce.shops.close",
      "commerce.shops.verifications.list",
      "commerce.shops.verifications.update",
      "commerce.shops.statusEvents.list",
      "commerce.shops.channels.list",
      "commerce.shops.channels.create",
      "commerce.shops.channels.update",
      "commerce.shops.fulfillmentProfile.retrieve",
      "commerce.shops.fulfillmentProfile.update",
      "commerce.shops.settlementProfile.retrieve",
      "commerce.shops.settlementProfile.update",
      "commerce.shops.settlementProfile.approve",
      "commerce.shops.settlementProfile.reject",
      "commerce.shops.businessHours.retrieve",
      "commerce.shops.businessHours.update",
      "commerce.shops.serviceAreas.list",
      "commerce.shops.serviceAreas.create",
      "commerce.shops.serviceAreas.update",
      "commerce.shops.policies.list",
      "commerce.shops.policies.create",
      "commerce.shops.policies.update",
      "commerce.shops.depositAccount.retrieve",
      "commerce.shops.depositAccount.update",
      "commerce.shops.depositAccount.review",
      "commerce.shops.riskSignals.list",
      "commerce.shops.riskSignals.create",
      "commerce.shops.riskSignals.resolve",
      "commerce.shops.readiness.retrieve",
      "commerce.shops.categoryBindings.list",
      "commerce.shops.categoryBindings.upsert",
      "commerce.shops.brandAuthorizations.list",
      "commerce.shops.brandAuthorizations.upsert",
      "commerce.shops.qualifications.list",
      "commerce.shops.qualifications.upsert",
      "commerce.shops.customerServices.list",
      "commerce.shops.customerServices.upsert",
      "commerce.shops.returnAddresses.list",
      "commerce.shops.returnAddresses.upsert",
      "commerce.shops.shippingTemplates.list",
      "commerce.shops.shippingTemplates.upsert",
      "commerce.catalog.attributes.management.list",
      "commerce.catalog.categories.management.list",
      "commerce.catalog.products.management.list",
      "commerce.catalog.products.management.retrieve",
      "commerce.catalog.products.create",
      "commerce.inventory.movements.list",
      "commerce.inventory.stocks.update",
      "commerce.orders.management.list",
      "commerce.orders.management.retrieve",
      "commerce.orders.management.cancel",
      "commerce.orders.management.close",
      "commerce.orders.events.management.list",
      "commerce.payments.methods.management.list",
      "commerce.payments.intents.management.retrieve",
      "commerce.payments.providerAccounts.create",
      "commerce.payments.providerAccounts.delete",
      "commerce.payments.providerAccounts.status.update",
      "commerce.payments.reconciliationRuns.list",
      "commerce.payments.runtime.snapshot.retrieve",
      "commerce.refunds.management.list",
      "commerce.refunds.management.retrieve",
      "commerce.afterSales.management.list",
      "commerce.afterSales.management.retrieve",
      "commerce.afterSales.reviews.create",
      "commerce.afterSales.returnShipments.list",
      "commerce.afterSales.events.list",
      "commerce.fulfillments.management.list",
      "commerce.fulfillments.management.retrieve",
      "commerce.shipments.management.retrieve",
      "commerce.shipments.packages.management.list",
      "commerce.shipments.packages.create",
      "commerce.shipments.packages.update",
      "commerce.shipments.trackingEvents.list",
      "commerce.entitlements.grants.list",
      "commerce.entitlements.accounts.list",
      "commerce.entitlements.ledgerEntries.list",
      "commerce.memberships.plans.management.list",
      "commerce.memberships.packageGroups.management.list",
      "commerce.memberships.packages.management.list",
      "commerce.memberships.entitlements.list",
      "commerce.recharges.packages.management.list",
      "commerce.recharges.packages.delete",
      "commerce.recharges.settings.management.retrieve",
      "commerce.recharges.orders.management.list",
      "commerce.recharges.orders.management.retrieve",
      "commerce.recharges.settings.update",
      "commerce.wallet.accounts.management.list",
      "commerce.wallet.ledgerEntries.management.list",
      "commerce.wallet.adjustments.management.create",
      "commerce.wallet.exchangeRules.management.list",
      "commerce.promotions.offers.management.list",
      "commerce.promotions.couponStocks.list",
      "commerce.promotions.codes.list",
      "commerce.promotions.userCoupons.management.list",
      "commerce.promotions.discountApplications.list",
      "commerce.promotions.discountAllocations.list",
      "commerce.invoices.management.list",
      "commerce.invoices.management.retrieve",
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
      "commerce.memberships.plans.list",
      "commerce.invoices.list",
      "commerce.wallet.accounts.list",
      "commerce.shops.list",
      "commerce.shops.retrieve",
      "commerce.catalog.attributes.list",
      "commerce.catalog.categories.list",
      "commerce.catalog.products.list",
      "commerce.orders.list",
      "commerce.orders.retrieve",
      "commerce.orders.events.list",
      "commerce.payments.methods.list",
      "commerce.payments.intents.retrieve",
      "commerce.refunds.list",
      "commerce.refunds.retrieve",
      "commerce.fulfillments.list",
      "commerce.fulfillments.retrieve",
      "commerce.shipments.retrieve",
      "commerce.shipments.packages.list",
      "commerce.memberships.packageGroups.list",
      "commerce.memberships.packages.list",
      "commerce.recharges.packages.list",
      "commerce.recharges.settings.retrieve",
      "commerce.recharges.orders.list",
      "commerce.recharges.orders.retrieve",
      "commerce.wallet.ledgerEntries.list",
      "commerce.inventory.ledgerEntries.list",
      "commerce.wallet.adjustments.create",
      "commerce.wallet.exchangeRules.list",
      "commerce.invoices.retrieve",
      "commerce.shops.staff.list",
      "commerce.shops.members.list",
      "commerce.shops.roles.list",
      "commerce.shops.permissions.list",
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
