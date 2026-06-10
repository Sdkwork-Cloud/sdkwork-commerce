import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

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
  "shops",
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
  "shops",
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
      "shops",
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
        "/app/v3/api/shops",
        "/app/v3/api/shops/{shopId}",
        "/app/v3/api/shops/current",
        "/app/v3/api/shops/current/dashboard",
        "/app/v3/api/shops/current/readiness",
        "/app/v3/api/shops/current/category_bindings",
        "/app/v3/api/shops/current/brand_authorizations",
        "/app/v3/api/shops/current/qualifications",
        "/app/v3/api/shops/current/customer_services",
        "/app/v3/api/shops/current/return_addresses",
        "/app/v3/api/shops/current/shipping_templates",
        "/app/v3/api/shops/current/business_hours",
        "/app/v3/api/shops/current/service_areas",
        "/app/v3/api/shops/current/service_areas/{serviceAreaId}",
        "/app/v3/api/shops/current/policies",
        "/app/v3/api/shops/current/policies/{policyId}",
        "/app/v3/api/shops/current/deposit_account",
        "/app/v3/api/shops/current/risk_signals",
        "/app/v3/api/shops/current/products",
        "/app/v3/api/shops/current/inventory/stocks",
        "/app/v3/api/shops/current/orders",
        "/app/v3/api/shops/current/settlements",
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
        "/backend/v3/api/shops",
        "/backend/v3/api/shops/{shopId}",
        "/backend/v3/api/shops/{shopId}/readiness",
        "/backend/v3/api/shops/{shopId}/submit_review",
        "/backend/v3/api/shops/{shopId}/approve",
        "/backend/v3/api/shops/{shopId}/suspend",
        "/backend/v3/api/shops/{shopId}/category_bindings",
        "/backend/v3/api/shops/{shopId}/brand_authorizations",
        "/backend/v3/api/shops/{shopId}/qualifications",
        "/backend/v3/api/shops/{shopId}/customer_services",
        "/backend/v3/api/shops/{shopId}/return_addresses",
        "/backend/v3/api/shops/{shopId}/shipping_templates",
        "/backend/v3/api/shops/{shopId}/business_hours",
        "/backend/v3/api/shops/{shopId}/service_areas",
        "/backend/v3/api/shops/{shopId}/service_areas/{serviceAreaId}",
        "/backend/v3/api/shops/{shopId}/policies",
        "/backend/v3/api/shops/{shopId}/policies/{policyId}",
        "/backend/v3/api/shops/{shopId}/deposit_account",
        "/backend/v3/api/shops/{shopId}/deposit_account/review",
        "/backend/v3/api/shops/{shopId}/risk_signals",
        "/backend/v3/api/shops/{shopId}/risk_signals/{riskSignalId}/resolve",
        "/backend/v3/api/catalog/price_lists",
        "/backend/v3/api/catalog/products/{productId}",
        "/backend/v3/api/catalog/spus",
        "/backend/v3/api/inventory/movements",
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
        "/backend/v3/api/wallet/accounts",
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
        "shops.list",
        "shops.retrieve",
        "shops.current.retrieve",
        "shops.current.dashboard.retrieve",
        "shops.current.readiness.retrieve",
        "shops.current.categoryBindings.list",
        "shops.current.categoryBindings.upsert",
        "shops.current.brandAuthorizations.list",
        "shops.current.brandAuthorizations.upsert",
        "shops.current.qualifications.list",
        "shops.current.qualifications.upsert",
        "shops.current.customerServices.list",
        "shops.current.customerServices.upsert",
        "shops.current.returnAddresses.list",
        "shops.current.returnAddresses.upsert",
        "shops.current.shippingTemplates.list",
        "shops.current.shippingTemplates.upsert",
        "shops.current.businessHours.retrieve",
        "shops.current.businessHours.update",
        "shops.current.serviceAreas.list",
        "shops.current.serviceAreas.create",
        "shops.current.serviceAreas.update",
        "shops.current.policies.list",
        "shops.current.policies.update",
        "shops.current.depositAccount.retrieve",
        "shops.current.riskSignals.list",
        "shops.current.products.create",
        "shops.current.products.publish",
        "shops.current.inventory.stocks.adjustments.create",
        "shops.current.orders.fulfillments.create",
        "shops.current.settlements.list",
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
        "memberships.plans.management.list",
        "memberships.purchases.create",
        "billing.history.list",
        "recharges.orders.create",
        "recharges.settings.retrieve",
        "wallet.accounts.management.list",
        "wallet.ledgerEntries.list",
        "wallet.transactions.list",
        "promotions.offers.list",
        "promotions.codes.redemptions.create",
        "invoices.management.list",
        "invoices.submissions.create",
        "inventory.movements.list",
        "catalog.products.management.retrieve",
        "payments.providerAccounts.create",
        "payments.providerAccounts.delete",
        "payments.providerAccounts.status.update",
        "payments.runtime.snapshot.retrieve",
        "payments.routeRules.update",
        "payments.webhookEvents.replays.create",
        "shops.businessHours.retrieve",
        "shops.businessHours.update",
        "shops.serviceAreas.list",
        "shops.serviceAreas.create",
        "shops.serviceAreas.update",
        "shops.policies.list",
        "shops.policies.create",
        "shops.policies.update",
        "shops.depositAccount.retrieve",
        "shops.depositAccount.update",
        "shops.depositAccount.review",
        "shops.riskSignals.list",
        "shops.riskSignals.create",
        "shops.riskSignals.resolve",
        "shops.readiness.retrieve",
        "shops.categoryBindings.list",
        "shops.categoryBindings.upsert",
        "shops.brandAuthorizations.list",
        "shops.brandAuthorizations.upsert",
        "shops.qualifications.list",
        "shops.qualifications.upsert",
        "shops.customerServices.list",
        "shops.customerServices.upsert",
        "shops.returnAddresses.list",
        "shops.returnAddresses.upsert",
        "shops.shippingTemplates.list",
        "shops.shippingTemplates.upsert",
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
      expect(operation.operationId).not.toMatch(/^shops\.(staff|members|roles|permissions)(\.|$)/);
      expect(operation.operationId).not.toBe("inventory.ledgerEntries.list");
      expect(operation.operationId).not.toBe("inventory.ledger.list");
      expect(operation.path).not.toBe("/backend/v3/api/inventory/ledger_entries");
      expect(operation.path).not.toBe("/backend/v3/api/inventory/ledger");
    }
  });

  it("uses provider_code for payment provider filters across backend contracts", () => {
    for (const operationKey of [
      "backend.payments.attempts.list",
      "backend.payments.webhookEvents.list",
      "backend.payments.reconciliationRuns.list",
      "backend.commerceReports.paymentReconciliation.retrieve",
      "backend.reports.paymentReconciliation.list",
    ]) {
      const operation = SDKWORK_COMMERCE_OPERATION_IDS[operationKey];
      expect(operation.queryParameters).toContain("provider_code");
      expect(operation.queryParameters).not.toContain("provider");
    }
  });

  it("defines commerce-prefixed table contracts for the complete transaction loop", () => {
    expect(SDKWORK_COMMERCE_TABLES).toEqual(
      expect.objectContaining({
        shop: "commerce_shop",
        shopApplication: "commerce_shop_application",
        shopVerification: "commerce_shop_verification",
        shopStatusEvent: "commerce_shop_status_event",
        shopChannel: "commerce_shop_channel",
        shopFulfillmentProfile: "commerce_shop_fulfillment_profile",
        shopSettlementProfile: "commerce_shop_settlement_profile",
        shopMetricSnapshot: "commerce_shop_metric_snapshot",
        shopReadiness: "commerce_shop_readiness",
        shopBusinessHour: "commerce_shop_business_hour",
        shopServiceArea: "commerce_shop_service_area",
        shopPolicy: "commerce_shop_policy",
        shopDepositAccount: "commerce_shop_deposit_account",
        shopRiskSignal: "commerce_shop_risk_signal",
        shopCategoryBinding: "commerce_shop_category_binding",
        shopBrandAuthorization: "commerce_shop_brand_authorization",
        shopQualification: "commerce_shop_qualification",
        shopCustomerService: "commerce_shop_customer_service",
        shopReturnAddress: "commerce_shop_return_address",
        shopShippingTemplate: "commerce_shop_shipping_template",
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
      expect(tableName).not.toMatch(/^commerce_shop_(staff|member|role|permission|department|position)$/);
      expect(tableName).not.toContain("benefits_" + "json");
      expect(tableName).not.toMatch(/float|double/i);
    }
  });

  it("assigns every route to a composable capability and model set", () => {
    const operationIds = Object.keys(SDKWORK_COMMERCE_OPERATION_IDS).sort();
    const capabilityOperationIds = SDKWORK_COMMERCE_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(SDKWORK_COMMERCE_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "accounts",
      "shops",
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
    const shops = SDKWORK_COMMERCE_CAPABILITIES.find((capability) => capability.name === "shops");
    expect(shops?.models).toEqual([
      "shop",
      "shopApplication",
      "shopVerification",
      "shopStatusEvent",
      "shopChannel",
      "shopFulfillmentProfile",
      "shopSettlementProfile",
      "shopMetricSnapshot",
      "shopReadiness",
      "shopBusinessHour",
      "shopServiceArea",
      "shopPolicy",
      "shopDepositAccount",
      "shopRiskSignal",
      "shopCategoryBinding",
      "shopBrandAuthorization",
      "shopQualification",
      "shopCustomerService",
      "shopReturnAddress",
      "shopShippingTemplate",
    ]);
    expect(shops?.operations).toEqual([
      "app.shops.current.applications.create",
      "app.shops.current.applications.list",
      "app.shops.current.brandAuthorizations.list",
      "app.shops.current.brandAuthorizations.upsert",
      "app.shops.current.businessHours.retrieve",
      "app.shops.current.businessHours.update",
      "app.shops.current.categoryBindings.list",
      "app.shops.current.categoryBindings.upsert",
      "app.shops.current.channels.list",
      "app.shops.current.channels.update",
      "app.shops.current.customerServices.list",
      "app.shops.current.customerServices.upsert",
      "app.shops.current.dashboard.retrieve",
      "app.shops.current.depositAccount.retrieve",
      "app.shops.current.fulfillmentProfile.retrieve",
      "app.shops.current.fulfillmentProfile.update",
      "app.shops.current.inventory.stocks.adjustments.create",
      "app.shops.current.inventory.stocks.list",
      "app.shops.current.orders.fulfillments.create",
      "app.shops.current.orders.list",
      "app.shops.current.orders.retrieve",
      "app.shops.current.policies.list",
      "app.shops.current.policies.update",
      "app.shops.current.products.create",
      "app.shops.current.products.list",
      "app.shops.current.products.publish",
      "app.shops.current.products.unpublish",
      "app.shops.current.products.update",
      "app.shops.current.readiness.retrieve",
      "app.shops.current.retrieve",
      "app.shops.current.returnAddresses.list",
      "app.shops.current.returnAddresses.upsert",
      "app.shops.current.riskSignals.list",
      "app.shops.current.settlementProfile.retrieve",
      "app.shops.current.settlementProfile.update",
      "app.shops.current.settlements.list",
      "app.shops.current.serviceAreas.create",
      "app.shops.current.serviceAreas.list",
      "app.shops.current.serviceAreas.update",
      "app.shops.current.shippingTemplates.list",
      "app.shops.current.shippingTemplates.upsert",
      "app.shops.current.statusEvents.list",
      "app.shops.current.qualifications.list",
      "app.shops.current.qualifications.upsert",
      "app.shops.current.verifications.list",
      "app.shops.list",
      "app.shops.retrieve",
      "backend.shops.approve",
      "backend.shops.brandAuthorizations.list",
      "backend.shops.brandAuthorizations.upsert",
      "backend.shops.businessHours.retrieve",
      "backend.shops.businessHours.update",
      "backend.shops.categoryBindings.list",
      "backend.shops.categoryBindings.upsert",
      "backend.shops.channels.create",
      "backend.shops.channels.list",
      "backend.shops.channels.update",
      "backend.shops.close",
      "backend.shops.create",
      "backend.shops.customerServices.list",
      "backend.shops.customerServices.upsert",
      "backend.shops.depositAccount.retrieve",
      "backend.shops.depositAccount.review",
      "backend.shops.depositAccount.update",
      "backend.shops.fulfillmentProfile.retrieve",
      "backend.shops.fulfillmentProfile.update",
      "backend.shops.management.list",
      "backend.shops.management.retrieve",
      "backend.shops.policies.create",
      "backend.shops.policies.list",
      "backend.shops.policies.update",
      "backend.shops.qualifications.list",
      "backend.shops.qualifications.upsert",
      "backend.shops.readiness.retrieve",
      "backend.shops.reject",
      "backend.shops.resume",
      "backend.shops.returnAddresses.list",
      "backend.shops.returnAddresses.upsert",
      "backend.shops.riskSignals.create",
      "backend.shops.riskSignals.list",
      "backend.shops.riskSignals.resolve",
      "backend.shops.settlementProfile.approve",
      "backend.shops.settlementProfile.reject",
      "backend.shops.settlementProfile.retrieve",
      "backend.shops.settlementProfile.update",
      "backend.shops.serviceAreas.create",
      "backend.shops.serviceAreas.list",
      "backend.shops.serviceAreas.update",
      "backend.shops.shippingTemplates.list",
      "backend.shops.shippingTemplates.upsert",
      "backend.shops.statusEvents.list",
      "backend.shops.submitReview",
      "backend.shops.suspend",
      "backend.shops.update",
      "backend.shops.verifications.list",
      "backend.shops.verifications.update",
    ]);
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
    expect(paths).not.toEqual(expect.arrayContaining([
      "/app/v3/api/shops/{shopId}/staff",
      "/backend/v3/api/shops/{shopId}/staff",
      "/backend/v3/api/shops/{shopId}/roles",
      "/backend/v3/api/shops/{shopId}/permissions",
    ]));
    expect(routeOperationIds).not.toEqual(expect.arrayContaining([
      "shops.staff.list",
      "shops.members.list",
      "shops.roles.list",
      "shops.permissions.list",
    ]));
  });

  it("orders shop operations without typo-based normalization sentinels", () => {
    const contractSource = readFileSync(
      "packages/common/commerce/sdkwork-commerce-contracts/src/index.ts",
      "utf8",
    );

    for (const typoSentinel of ["tualifications", "settlezServiceAreas"]) {
      expect(contractSource).not.toContain(typoSentinel);
    }
  });

  it("models shipping template defaults for professional shop fulfillment setup", () => {
    const shippingTemplate = SDKWORK_COMMERCE_DOMAIN_MODELS.find(
      (model) => model.name === "shopShippingTemplate",
    );

    expect(shippingTemplate?.fields).toContain("is_default");

    for (const operationKey of [
      "app.shops.current.shippingTemplates.list",
      "backend.shops.shippingTemplates.list",
    ]) {
      const operation = SDKWORK_COMMERCE_OPERATION_IDS[operationKey];
      expect(operation.queryParameters).toContain("is_default");
    }
  });

  it("models default customer service contact for professional shop support setup", () => {
    const customerService = SDKWORK_COMMERCE_DOMAIN_MODELS.find(
      (model) => model.name === "shopCustomerService",
    );

    expect(customerService?.fields).toContain("is_default");

    for (const operationKey of [
      "app.shops.current.customerServices.list",
      "backend.shops.customerServices.list",
    ]) {
      const operation = SDKWORK_COMMERCE_OPERATION_IDS[operationKey];
      expect(operation.queryParameters).toContain("is_default");
    }
  });

  it("keeps backend-admin management operations distinct from app user operations", () => {
    const appOperationIds = new Set(
      Object.values(SDKWORK_COMMERCE_OPERATION_IDS)
        .filter((operation) => operation.apiSurface === "app")
        .map((operation) => operation.operationId),
    );
    const backendOperationIds = new Set(
      Object.values(SDKWORK_COMMERCE_OPERATION_IDS)
        .filter((operation) => operation.apiSurface === "backend")
        .map((operation) => operation.operationId),
    );

    expect([...backendOperationIds]).toEqual(expect.arrayContaining([
      "shops.management.list",
      "shops.management.retrieve",
      "catalog.categories.management.list",
      "catalog.attributes.management.list",
      "catalog.products.management.list",
      "catalog.products.management.retrieve",
      "orders.management.list",
      "orders.management.retrieve",
      "orders.management.cancel",
      "orders.management.close",
      "orders.events.management.list",
      "payments.methods.management.list",
      "payments.intents.management.retrieve",
      "refunds.management.list",
      "refunds.management.retrieve",
      "fulfillments.management.list",
      "fulfillments.management.retrieve",
      "shipments.management.retrieve",
      "memberships.packageGroups.management.list",
      "memberships.packages.management.list",
      "recharges.packages.management.list",
      "recharges.settings.management.retrieve",
      "recharges.orders.management.list",
      "recharges.orders.management.retrieve",
      "wallet.ledgerEntries.management.list",
      "wallet.adjustments.management.create",
      "wallet.exchangeRules.management.list",
      "invoices.management.retrieve",
    ]));

    expect([...appOperationIds]).toEqual(expect.arrayContaining([
      "shops.retrieve",
      "catalog.categories.list",
      "catalog.attributes.list",
      "catalog.products.list",
      "orders.list",
      "orders.retrieve",
      "orders.cancel",
      "orders.events.list",
      "payments.methods.list",
      "payments.intents.retrieve",
      "refunds.list",
      "refunds.retrieve",
      "fulfillments.list",
      "fulfillments.retrieve",
      "shipments.retrieve",
      "memberships.packageGroups.list",
      "memberships.packages.list",
      "recharges.packages.list",
      "recharges.settings.retrieve",
      "recharges.orders.retrieve",
      "wallet.ledgerEntries.list",
      "wallet.adjustments.create",
      "wallet.exchangeRules.list",
      "invoices.retrieve",
    ]));

    for (const retiredBackendOperationId of [
      "shops.retrieve",
      "catalog.categories.list",
      "catalog.attributes.list",
      "catalog.products.list",
      "orders.list",
      "orders.retrieve",
      "orders.events.list",
      "payments.methods.list",
      "payments.intents.retrieve",
      "refunds.list",
      "refunds.retrieve",
      "fulfillments.list",
      "fulfillments.retrieve",
      "shipments.retrieve",
      "memberships.packageGroups.list",
      "memberships.packages.list",
      "recharges.packages.list",
      "recharges.settings.retrieve",
      "recharges.orders.list",
      "recharges.orders.retrieve",
      "wallet.ledgerEntries.list",
      "wallet.adjustments.create",
      "wallet.exchangeRules.list",
      "invoices.retrieve",
    ]) {
      expect(backendOperationIds).not.toContain(retiredBackendOperationId);
    }
  });

  it("models shop as an industry-grade commerce aggregate without duplicating IAM", () => {
    const shopModel = SDKWORK_COMMERCE_DOMAIN_MODELS.find((model) => model.name === "shop");
    expect(shopModel?.fields).toEqual(
      expect.arrayContaining([
        "version",
        "review_status",
        "data_scope",
        "submitted_at",
        "approved_at",
        "rejected_at",
        "suspended_at",
        "closed_at",
        "deleted_at",
      ]),
    );

    expect(SDKWORK_COMMERCE_DOMAIN_MODELS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "shopApplication",
          table: "commerce_shop_application",
          fields: expect.arrayContaining([
            "application_no",
            "application_type",
            "review_status",
            "submitted_by",
            "submitted_at",
            "reviewed_by",
            "reviewed_at",
          ]),
        }),
        expect.objectContaining({
          name: "shopVerification",
          table: "commerce_shop_verification",
          fields: expect.arrayContaining([
            "verification_type",
            "verification_status",
            "legal_entity_name",
            "credential_no_hash",
            "expires_at",
          ]),
        }),
        expect.objectContaining({
          name: "shopStatusEvent",
          table: "commerce_shop_status_event",
          fields: expect.arrayContaining([
            "event_type",
            "from_status",
            "to_status",
            "actor_id",
            "idempotency_key",
          ]),
        }),
        expect.objectContaining({
          name: "shopChannel",
          table: "commerce_shop_channel",
          fields: expect.arrayContaining([
            "channel_code",
            "storefront_status",
            "domain_name",
            "path_prefix",
            "theme_code",
          ]),
        }),
        expect.objectContaining({
          name: "shopFulfillmentProfile",
          table: "commerce_shop_fulfillment_profile",
          fields: expect.arrayContaining([
            "fulfillment_mode",
            "shipping_origin_region_code",
            "service_level_code",
            "after_sales_policy_json",
          ]),
        }),
        expect.objectContaining({
          name: "shopSettlementProfile",
          table: "commerce_shop_settlement_profile",
          fields: expect.arrayContaining([
            "settlement_status",
            "settlement_cycle",
            "settlement_currency_code",
            "account_ref",
            "risk_hold_days",
          ]),
        }),
        expect.objectContaining({
          name: "shopMetricSnapshot",
          table: "commerce_shop_metric_snapshot",
          fields: expect.arrayContaining([
            "snapshot_date",
            "gross_sales_amount",
            "paid_order_count",
            "fulfillment_pending_count",
          ]),
        }),
        expect.objectContaining({
          name: "shopBusinessHour",
          table: "commerce_shop_business_hour",
          fields: expect.arrayContaining([
            "schedule_type",
            "timezone",
            "weekly_schedule_json",
            "holiday_schedule_json",
            "effective_from",
            "effective_to",
            "status",
            "version",
          ]),
        }),
        expect.objectContaining({
          name: "shopServiceArea",
          table: "commerce_shop_service_area",
          fields: expect.arrayContaining([
            "area_type",
            "country_code",
            "region_code",
            "city_code",
            "area_key",
            "postal_code_pattern",
            "delivery_radius_meters",
            "service_status",
            "service_config_json",
          ]),
        }),
        expect.objectContaining({
          name: "shopPolicy",
          table: "commerce_shop_policy",
          fields: expect.arrayContaining([
            "policy_type",
            "policy_status",
            "policy_version",
            "policy_json",
            "published_at",
            "reviewed_by",
            "reviewed_at",
          ]),
        }),
        expect.objectContaining({
          name: "shopDepositAccount",
          table: "commerce_shop_deposit_account",
          fields: expect.arrayContaining([
            "deposit_status",
            "currency_code",
            "required_amount",
            "paid_amount",
            "frozen_amount",
            "account_ref",
            "due_at",
            "reviewed_by",
            "reviewed_at",
          ]),
        }),
        expect.objectContaining({
          name: "shopRiskSignal",
          table: "commerce_shop_risk_signal",
          fields: expect.arrayContaining([
            "signal_no",
            "signal_type",
            "risk_level",
            "signal_status",
            "source_type",
            "source_id",
            "risk_score",
            "payload_json",
            "detected_at",
            "resolved_at",
          ]),
        }),
      ]),
    );

    for (const forbiddenModel of ["shopStaff", "shopMember", "shopRole", "shopPermission"]) {
      expect(SDKWORK_COMMERCE_DOMAIN_MODELS.map((model) => model.name)).not.toContain(forbiddenModel);
    }
  });

  it("declares typed shop API schemas and backend governance metadata at the contract source", () => {
    const operations = SDKWORK_COMMERCE_OPERATION_IDS;

    expect(operations["app.shops.list"]).toEqual(
      expect.objectContaining({ responseSchema: "ShopListResponse", permission: "commerce.shops.read" }),
    );
    expect(operations["app.shops.current.retrieve"]).toEqual(
      expect.objectContaining({ responseSchema: "CurrentShopResponse", permission: "commerce.shops.self.read" }),
    );
    expect(operations["app.shops.current.applications.create"]).toEqual(
      expect.objectContaining({
        requestSchema: "SubmitShopApplicationRequest",
        responseSchema: "ShopApplicationResponse",
        permission: "commerce.shops.self.write",
        idempotent: true,
      }),
    );
    expect(operations["app.shops.current.channels.update"]).toEqual(
      expect.objectContaining({
        requestSchema: "UpdateShopChannelRequest",
        responseSchema: "ShopChannelResponse",
        permission: "commerce.shops.self.write",
        idempotent: true,
      }),
    );
    expect(operations["app.shops.current.businessHours.update"]).toEqual(
      expect.objectContaining({
        requestSchema: "UpdateShopBusinessHourRequest",
        responseSchema: "ShopBusinessHourResponse",
        permission: "commerce.shops.self.write",
        idempotent: true,
      }),
    );
    expect(operations["app.shops.current.serviceAreas.create"]).toEqual(
      expect.objectContaining({
        requestSchema: "CreateShopServiceAreaRequest",
        responseSchema: "ShopServiceAreaResponse",
        permission: "commerce.shops.self.write",
        idempotent: true,
      }),
    );
    expect(operations["app.shops.current.policies.update"]).toEqual(
      expect.objectContaining({
        requestSchema: "UpdateShopPolicyRequest",
        responseSchema: "ShopPolicyResponse",
        permission: "commerce.shops.self.write",
        idempotent: true,
      }),
    );

    for (const operationKey of [
      "backend.shops.create",
      "backend.shops.update",
      "backend.shops.submitReview",
      "backend.shops.approve",
      "backend.shops.reject",
      "backend.shops.suspend",
      "backend.shops.resume",
      "backend.shops.close",
      "backend.shops.channels.create",
      "backend.shops.channels.update",
      "backend.shops.fulfillmentProfile.update",
      "backend.shops.settlementProfile.update",
      "backend.shops.settlementProfile.approve",
      "backend.shops.settlementProfile.reject",
      "backend.shops.verifications.update",
      "backend.shops.businessHours.update",
      "backend.shops.serviceAreas.create",
      "backend.shops.serviceAreas.update",
      "backend.shops.policies.create",
      "backend.shops.policies.update",
      "backend.shops.depositAccount.update",
      "backend.shops.depositAccount.review",
      "backend.shops.riskSignals.create",
      "backend.shops.riskSignals.resolve",
    ]) {
      expect(operations[operationKey]).toEqual(
        expect.objectContaining({
          auditEvent: expect.stringMatching(/^commerce\.shop\./),
          idempotent: true,
          permission: expect.stringMatching(/^commerce\.shops\./),
          requestSchema: expect.any(String),
          responseSchema: expect.any(String),
        }),
      );
    }
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
