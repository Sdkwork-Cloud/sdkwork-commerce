import { describe, expect, it } from "vitest";

import {
  SDKWORK_COMMERCE_API_ROUTES,
  SDKWORK_COMMERCE_CAPABILITIES,
  SDKWORK_COMMERCE_DOMAIN_MODELS,
  SDKWORK_COMMERCE_OPERATION_IDS,
  SDKWORK_COMMERCE_STANDARD,
  SDKWORK_COMMERCE_TABLES,
  createCommerceLedgerPolicy,
  isCommerceMoneyAmount,
  isCommercePointAmount,
} from "../src/index";

const APP_DOMAINS = [
  "accounts",
  "catalog",
  "cart",
  "addresses",
  "checkout",
  "orders",
  "payments",
  "refunds",
  "fulfillments",
  "shipments",
  "memberships",
  "billing",
  "recharges",
  "wallet",
  "promotions",
  "invoices",
] as const;

const BACKEND_DOMAINS = [
  "catalog",
  "inventory",
  "orders",
  "payments",
  "refunds",
  "fulfillments",
  "shipments",
  "entitlements",
  "memberships",
  "recharges",
  "wallet",
  "promotions",
  "invoices",
  "commerceReports",
  "reports",
  "audit",
] as const;

describe("SDKWork commerce standard contracts", () => {
  it("uses domain-oriented SDK namespaces with billing history under commerce root", () => {
    expect(SDKWORK_COMMERCE_STANDARD.api.appPrefix).toBe("/app/v3/api");
    expect(SDKWORK_COMMERCE_STANDARD.api.backendPrefix).toBe("/backend/v3/api");
    expect(SDKWORK_COMMERCE_STANDARD.api.openapi).toBe("3.1.2");
    expect(SDKWORK_COMMERCE_STANDARD.domain).toBe("commerce");
    expect(SDKWORK_COMMERCE_STANDARD.sdkNamespaces).toEqual([
      "accounts",
      "catalog",
      "cart",
      "addresses",
      "checkout",
      "orders",
      "payments",
      "refunds",
      "fulfillments",
      "shipments",
      "entitlements",
      "memberships",
      "billing",
      "recharges",
      "wallet",
      "promotions",
      "invoices",
      "inventory",
      "commerceReports",
      "reports",
      "audit",
    ]);

    for (const domain of APP_DOMAINS) {
      expect(SDKWORK_COMMERCE_API_ROUTES).toHaveProperty(domain);
    }

    for (const domain of BACKEND_DOMAINS) {
      expect(SDKWORK_COMMERCE_API_ROUTES.backend).toHaveProperty(domain);
    }

    expect(SDKWORK_COMMERCE_API_ROUTES).toHaveProperty("billing");
    expect(SDKWORK_COMMERCE_API_ROUTES.backend).not.toHaveProperty("billing");
  });

  it("defines app and backend paths by bounded context and follows API_SPEC path rules", () => {
    const paths = Object.values(SDKWORK_COMMERCE_OPERATION_IDS).map((operation) => operation.path);

    expect(paths).toEqual(
      expect.arrayContaining([
        "/app/v3/api/accounts/current/summary",
        "/app/v3/api/catalog/products",
        "/app/v3/api/catalog/spus",
        "/app/v3/api/catalog/skus/{skuId}",
        "/app/v3/api/cart/current",
        "/app/v3/api/addresses/{addressId}/default_selection",
        "/app/v3/api/checkout/sessions/{checkoutSessionId}/orders",
        "/app/v3/api/orders/{orderId}/cancellations",
        "/app/v3/api/payments/intents/{paymentIntentId}/attempts",
        "/app/v3/api/refunds/{refundId}",
        "/app/v3/api/fulfillments/{fulfillmentId}",
        "/app/v3/api/shipments/{shipmentId}",
        "/app/v3/api/memberships/current",
        "/app/v3/api/billing/history",
        "/app/v3/api/recharges/orders/{orderId}",
        "/app/v3/api/recharges/settings",
        "/app/v3/api/wallet/ledger_entries/{ledgerEntryId}",
        "/app/v3/api/wallet/transactions",
        "/app/v3/api/promotions/offers",
        "/app/v3/api/promotions/codes/redemptions",
        "/app/v3/api/invoices/{invoiceId}/submissions",
        "/backend/v3/api/catalog/price_lists",
        "/backend/v3/api/catalog/spus",
        "/backend/v3/api/inventory/reservations",
        "/backend/v3/api/orders/{orderId}/events",
        "/backend/v3/api/payments/provider_accounts",
        "/backend/v3/api/payments/provider_accounts/{providerAccountId}",
        "/backend/v3/api/payments/provider_accounts/{providerAccountId}/status",
        "/backend/v3/api/payments/runtime/snapshot",
        "/backend/v3/api/payments/webhook_events/{eventId}/replays",
        "/backend/v3/api/refunds/{refundId}/attempts",
        "/backend/v3/api/fulfillments/{fulfillmentId}",
        "/backend/v3/api/shipments",
        "/backend/v3/api/shipments/{shipmentId}/tracking_events",
        "/backend/v3/api/entitlements/grants",
        "/backend/v3/api/entitlements/accounts",
        "/backend/v3/api/entitlements/ledger_entries",
        "/backend/v3/api/memberships/packages",
        "/backend/v3/api/recharges/orders",
        "/backend/v3/api/recharges/packages/{packageId}",
        "/backend/v3/api/recharges/settings",
        "/backend/v3/api/wallet/exchange_rules",
        "/backend/v3/api/promotions/offers",
        "/backend/v3/api/invoices/{invoiceId}/issuances",
        "/backend/v3/api/commerce_reports/usage_statements",
        "/backend/v3/api/commerce_reports/payment_reconciliation",
        "/backend/v3/api/reports/commerce_overview",
        "/backend/v3/api/audit/commerce_events",
      ]),
    );

    for (const path of paths) {
      if (path !== "/app/v3/api/billing/history") {
        expect(path).not.toContain("/billing");
      }
      expect(path).not.toContain("/" + "v" + "ip");
      expect(path).not.toContain("/finance");
      expect(path).not.toContain("/coupons");
      expect(path).not.toContain("/preflight");
      expect(path).not.toContain("__");
      expect(path).toMatch(/^\/(app|backend)\/v3\/api\//);

      const staticSegments = path
        .split("/")
        .filter((segment) => segment && !segment.startsWith("{") && !["app", "backend", "v3", "api"].includes(segment));
      for (const segment of staticSegments) {
        expect(segment).toMatch(/^[a-z0-9_]+$/);
      }

      const params = [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
      for (const param of params) {
        expect(param).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      }
    }
  });

  it("uses unique resource-tree operationIds without legacy roots", () => {
    const operations = Object.values(SDKWORK_COMMERCE_OPERATION_IDS);
    const operationIds = operations.map((operation) => operation.operationId);
    const operationKeys = operations.map((operation) => operation.operationKey);
    const uniqueOperationKeys = new Set(operationKeys);
    const surfaceOperationIds = operations.map((operation) => `${operation.apiSurface}:${operation.operationId}`);
    const uniqueSurfaceOperationIds = new Set(surfaceOperationIds);

    expect(uniqueOperationKeys.size).toBe(operations.length);
    expect(uniqueSurfaceOperationIds.size).toBe(operations.length);
    expect(operationIds).toEqual(
      expect.arrayContaining([
        "accounts.current.summary.retrieve",
        "catalog.products.list",
        "catalog.spus.list",
        "cart.items.create",
        "addresses.defaultSelection.create",
        "checkout.sessions.orders.create",
        "orders.cancellations.create",
        "payments.methods.list",
        "payments.intents.attempts.create",
        "refunds.create",
        "fulfillments.retrieve",
        "shipments.retrieve",
        "shipments.trackingEvents.list",
        "entitlements.grants.list",
        "entitlements.accounts.list",
        "entitlements.ledgerEntries.list",
        "memberships.purchases.create",
        "billing.history.list",
        "recharges.orders.create",
        "recharges.settings.retrieve",
        "wallet.ledgerEntries.list",
        "wallet.transactions.list",
        "promotions.offers.list",
        "promotions.codes.redemptions.create",
        "invoices.submissions.create",
        "inventory.ledgerEntries.list",
        "payments.providerAccounts.create",
        "payments.providerAccounts.delete",
        "payments.providerAccounts.status.update",
        "payments.runtime.snapshot.retrieve",
        "payments.routeRules.update",
        "payments.webhookEvents.replays.create",
        "recharges.settings.update",
        "commerceReports.usageStatements.list",
        "commerceReports.paymentReconciliation.retrieve",
        "reports.commerceOverview.retrieve",
        "audit.commerceEvents.list",
      ]),
    );

    for (const operation of operations) {
      expect(operation.operationId).toMatch(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/);
      if (operation.operationId !== "billing.history.list") {
        expect(operation.operationId).not.toMatch(
          new RegExp("^(app|backend|billing|" + "v" + "ip" + "|preflight|finance|account|coupons)\\."),
        );
      }
      expect(operation.tag).toBe(operation.operationId.split(".")[0]);
      expect(SDKWORK_COMMERCE_STANDARD.sdkNamespaces).toContain(operation.tag);
      expect(operation).not.toHaveProperty("sdkMethodId");
    }
  });

  it("defines commerce-prefixed table contracts for the complete transaction loop", () => {
    expect(SDKWORK_COMMERCE_TABLES).toEqual(
      expect.objectContaining({
        productCategory: "commerce_product_category",
        productSpu: "commerce_product_spu",
        productSku: "commerce_product_sku",
        productAttribute: "commerce_product_attribute",
        priceList: "commerce_price_list",
        inventoryStock: "commerce_inventory_stock",
        cart: "commerce_cart",
        cartItem: "commerce_cart_item",
        userAddress: "commerce_user_address",
        checkoutSession: "commerce_checkout_session",
        order: "commerce_order",
        orderItem: "commerce_order_item",
        orderEvent: "commerce_order_event",
        orderAmountBreakdown: "commerce_order_amount_breakdown",
        fulfillmentOrder: "commerce_fulfillment_order",
        fulfillmentItem: "commerce_fulfillment_item",
        shipment: "commerce_shipment",
        paymentProvider: "commerce_payment_provider",
        paymentProviderAccount: "commerce_payment_provider_account",
        paymentIntent: "commerce_payment_intent",
        paymentAttempt: "commerce_payment_attempt",
        refund: "commerce_refund",
        refundAttempt: "commerce_refund_attempt",
        benefitDefinition: "benefit_definition",
        entitlementAccount: "entitlement_account",
        entitlementLedgerEntry: "entitlement_ledger_entry",
        membershipPlan: "membership_plan",
        membershipPlanVersion: "membership_plan_version",
        membershipPlanBenefit: "membership_plan_benefit",
        membershipPackageGroup: "membership_package_group",
        membershipPackage: "membership_package",
        membershipSubscription: "membership_subscription",
        membershipPeriod: "membership_period",
        billingHistory: "commerce_billing_history",
        account: "commerce_account",
        accountHold: "commerce_account_hold",
        accountLedgerEntry: "commerce_account_ledger_entry",
        promotionOffer: "promotion_offer",
        promotionOfferVersion: "promotion_offer_version",
        promotionCouponStock: "promotion_coupon_stock",
        promotionCode: "promotion_code",
        promotionUserCoupon: "promotion_user_coupon",
        promotionDiscountApplication: "promotion_discount_application",
        promotionDiscountAllocation: "promotion_discount_allocation",
        invoice: "commerce_invoice",
        auditLog: "commerce_audit_log",
        outboxEvent: "commerce_outbox_event",
      }),
    );

    for (const tableName of Object.values(SDKWORK_COMMERCE_TABLES)) {
      expect(tableName).toMatch(/^(commerce|benefit|entitlement|membership|promotion)_[a-z0-9_]+$/);
      if (tableName !== "commerce_billing_history") {
        expect(tableName).not.toContain("billing");
      }
      expect(tableName).not.toContain("v" + "ip");
      expect(tableName).not.toMatch(new RegExp("^commerce_" + "coupon"));
      expect(tableName).not.toMatch(new RegExp("^commerce_" + "membership"));
      expect(tableName).not.toContain("benefits_" + "json");
      expect(tableName).not.toMatch(/float|double/i);
    }
  });

  it("assigns every route to a composable capability and model set", () => {
    const operationIds = Object.keys(SDKWORK_COMMERCE_OPERATION_IDS).sort();
    const capabilityOperationIds = SDKWORK_COMMERCE_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(SDKWORK_COMMERCE_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "accounts",
      "catalog",
      "inventory",
      "cart",
      "addresses",
      "checkout",
      "orders",
      "payments",
      "refunds",
      "fulfillments",
      "shipments",
      "entitlements",
      "memberships",
      "billing",
      "recharges",
      "wallet",
      "promotions",
      "invoices",
      "commerceReports",
      "reports",
      "audit",
    ]);
    expect(capabilityOperationIds).toEqual(operationIds);
    expect(new Set(capabilityOperationIds).size).toBe(operationIds.length);

    for (const capability of SDKWORK_COMMERCE_CAPABILITIES) {
      expect(capability.domain).toBe("commerce");
      expect(capability.sdkNamespaces).toContain(capability.name);
      expect(capability.models.length).toBeGreaterThan(0);
    }

    for (const model of SDKWORK_COMMERCE_DOMAIN_MODELS) {
      expect(model.domain).toBe("commerce");
      expect(model.table).toBe(SDKWORK_COMMERCE_TABLES[model.name]);
      expect(model.fields).toContain("id");
      expect(model.fields).toContain("tenant_id");
      expect(model.capabilities.length).toBeGreaterThan(0);
    }

    const entitlements = SDKWORK_COMMERCE_CAPABILITIES.find((capability) => capability.name === "entitlements");
    const memberships = SDKWORK_COMMERCE_CAPABILITIES.find((capability) => capability.name === "memberships");
    const promotions = SDKWORK_COMMERCE_CAPABILITIES.find((capability) => capability.name === "promotions");
    expect(entitlements?.models).toEqual([
      "benefitDefinition",
      "entitlementGrant",
      "entitlementAccount",
      "entitlementLedgerEntry",
    ]);
    expect(entitlements?.operations).toEqual([
      "backend.entitlements.accounts.list",
      "backend.entitlements.grants.list",
      "backend.entitlements.ledgerEntries.list",
    ]);
    expect(memberships?.models).not.toEqual(expect.arrayContaining([
      "benefitDefinition",
      "entitlementGrant",
      "entitlementAccount",
      "entitlementLedgerEntry",
    ]));
    expect(promotions?.models).not.toEqual(expect.arrayContaining([
      "benefitDefinition",
      "entitlementGrant",
      "entitlementAccount",
      "entitlementLedgerEntry",
    ]));

    const paths = Object.values(SDKWORK_COMMERCE_OPERATION_IDS).map((operation) => operation.path);
    const routeOperationIds = Object.values(SDKWORK_COMMERCE_OPERATION_IDS).map((operation) => operation.operationId);
    expect(paths).not.toContain("/backend/v3/api/memberships/" + "entitlements");
    expect(routeOperationIds).not.toContain("memberships." + "entitlements.list");
  });

  it("validates amount formats and ledger policy for financial correctness", () => {
    expect(isCommerceMoneyAmount("0")).toBe(true);
    expect(isCommerceMoneyAmount("19.90")).toBe(true);
    expect(isCommerceMoneyAmount("19.999")).toBe(false);
    expect(isCommerceMoneyAmount("-1")).toBe(false);

    expect(isCommercePointAmount("0")).toBe(true);
    expect(isCommercePointAmount("1000000")).toBe(true);
    expect(isCommercePointAmount("1.5")).toBe(false);
    expect(isCommercePointAmount("-1")).toBe(false);

    expect(createCommerceLedgerPolicy()).toEqual({
      amountScale: 6,
      moneyScale: 2,
      optimisticLocking: true,
      requireIdempotencyKey: true,
      requireImmutableLedger: true,
    });
  });
});
