export type CommerceEnvironment = "development" | "test" | "staging" | "production";
export type CommerceDeploymentMode = "saas" | "local" | "private";
export type CommerceOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type CommerceOperationSecurity = "dualToken" | "public";

export type CommerceSdkNamespace =
  | "accounts"
  | "shops"
  | "catalog"
  | "cart"
  | "addresses"
  | "checkout"
  | "orders"
  | "payments"
  | "refunds"
  | "fulfillments"
  | "shipments"
  | "entitlements"
  | "memberships"
  | "billing"
  | "recharges"
  | "wallet"
  | "promotions"
  | "invoices"
  | "inventory"
  | "commerceReports"
  | "reports"
  | "audit";

export type CommerceCapabilityName = CommerceSdkNamespace;

export const SDKWORK_COMMERCE_TABLES = {
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
  productSpuCategory: "commerce_product_spu_category",
  productSpu: "commerce_product_spu",
  productSku: "commerce_product_sku",
  productAttribute: "commerce_product_attribute",
  productAttributeValue: "commerce_product_attribute_value",
  productSkuAttribute: "commerce_product_sku_attribute",
  productMedia: "commerce_product_media",
  priceList: "commerce_price_list",
  priceListItem: "commerce_price_list_item",
  inventoryStock: "commerce_inventory_stock",
  inventoryReservation: "commerce_inventory_reservation",
  inventoryMovement: "commerce_inventory_movement",
  cart: "commerce_cart",
  cartItem: "commerce_cart_item",
  userAddress: "commerce_user_address",
  orderAddressSnapshot: "commerce_order_address_snapshot",
  checkoutSession: "commerce_checkout_session",
  checkoutLine: "commerce_checkout_line",
  checkoutQuote: "commerce_checkout_quote",
  order: "commerce_order",
  orderItem: "commerce_order_item",
  orderAmountBreakdown: "commerce_order_amount_breakdown",
  orderEvent: "commerce_order_event",
  orderCancellation: "commerce_order_cancellation",
  fulfillmentOrder: "commerce_fulfillment_order",
  fulfillmentItem: "commerce_fulfillment_item",
  shipment: "commerce_shipment",
  shipmentPackage: "commerce_shipment_package",
  shipmentTrackingEvent: "commerce_shipment_tracking_event",
  digitalDelivery: "commerce_digital_delivery",
  paymentProvider: "commerce_payment_provider",
  paymentProviderAccount: "commerce_payment_provider_account",
  paymentMethod: "commerce_payment_method",
  paymentChannel: "commerce_payment_channel",
  paymentRouteRule: "commerce_payment_route_rule",
  paymentIntent: "commerce_payment_intent",
  paymentAttempt: "commerce_payment_attempt",
  paymentWebhookEvent: "commerce_payment_webhook_event",
  paymentReconciliationRun: "commerce_payment_reconciliation_run",
  paymentDispute: "commerce_payment_dispute",
  refund: "commerce_refund",
  refundItem: "commerce_refund_item",
  refundAttempt: "commerce_refund_attempt",
  benefitDefinition: "benefit_definition",
  entitlementGrant: "entitlement_grant",
  entitlementAccount: "entitlement_account",
  entitlementLedgerEntry: "entitlement_ledger_entry",
  membershipPlan: "membership_plan",
  membershipPlanVersion: "membership_plan_version",
  membershipPlanBenefit: "membership_plan_benefit",
  membershipPackageGroup: "membership_package_group",
  membershipPackage: "membership_package",
  membershipSubscription: "membership_subscription",
  membershipPeriod: "membership_period",
  rechargePackage: "commerce_recharge_package",
  rechargeOrder: "commerce_recharge_order",
  billingHistory: "commerce_billing_history",
  account: "commerce_account",
  accountHold: "commerce_account_hold",
  accountLedgerEntry: "commerce_account_ledger_entry",
  exchangeRule: "commerce_exchange_rule",
  exchangeTransaction: "commerce_exchange_transaction",
  promotionOffer: "promotion_offer",
  promotionOfferVersion: "promotion_offer_version",
  promotionCouponStock: "promotion_coupon_stock",
  promotionCode: "promotion_code",
  promotionUserCoupon: "promotion_user_coupon",
  promotionCouponLedgerEntry: "promotion_coupon_ledger_entry",
  promotionDiscountApplication: "promotion_discount_application",
  promotionDiscountAllocation: "promotion_discount_allocation",
  invoiceTitle: "commerce_invoice_title",
  invoice: "commerce_invoice",
  invoiceItem: "commerce_invoice_item",
  invoiceEvent: "commerce_invoice_event",
  invoiceProviderAttempt: "commerce_invoice_provider_attempt",
  usageStatement: "commerce_usage_statement",
  idempotencyKey: "commerce_idempotency_key",
  auditLog: "commerce_audit_log",
  outboxEvent: "commerce_outbox_event",
} as const;

export type CommerceDomainModelName = keyof typeof SDKWORK_COMMERCE_TABLES;

export interface CommerceOperationContract {
  apiSurface: "app" | "backend";
  auditEvent?: string;
  bodyRequired?: boolean;
  idempotent?: boolean;
  method: CommerceOperationMethod;
  operationKey: string;
  operationId: string;
  path: string;
  permission?: string;
  queryParameters?: readonly string[];
  requestSchema?: string;
  responseSchema?: string;
  security: CommerceOperationSecurity;
  tag: CommerceSdkNamespace;
}

export interface CommerceOperationOptions {
  auditEvent?: string;
  bodyRequired?: boolean;
  idempotent?: boolean;
  permission?: string;
  requestSchema?: string;
  responseSchema?: string;
}

export interface CommerceDomainModelContract {
  capabilities: readonly CommerceCapabilityName[];
  domain: "commerce";
  fields: readonly string[];
  name: CommerceDomainModelName;
  table: (typeof SDKWORK_COMMERCE_TABLES)[CommerceDomainModelName];
}

export interface CommerceCapabilityContract {
  domain: "commerce";
  models: readonly CommerceDomainModelName[];
  name: CommerceCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly CommerceSdkNamespace[];
}

export interface CommerceLedgerPolicy {
  amountScale: number;
  moneyScale: number;
  optimisticLocking: boolean;
  requireIdempotencyKey: boolean;
  requireImmutableLedger: boolean;
}

export const SDKWORK_COMMERCE_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  databasePrefix: "commerce",
  domain: "commerce",
  sdkNamespaces: [
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
  ],
} as const;

const app = SDKWORK_COMMERCE_STANDARD.api.appPrefix;
const backend = SDKWORK_COMMERCE_STANDARD.api.backendPrefix;

export const SDKWORK_COMMERCE_API_ROUTES = {
  accounts: {
    current: {
      summary: {
        retrieve: operation("GET", `${app}/accounts/current/summary`, "accounts.current.summary.retrieve"),
      },
    },
  },
  shops: {
    list: operation("GET", `${app}/shops`, "shops.list", ["q", "shop_type", "operation_status", "page", "page_size"], {
      permission: "commerce.shops.read",
      responseSchema: "ShopListResponse",
    }),
    retrieve: operation("GET", `${app}/shops/{shopId}`, "shops.retrieve", undefined, {
      permission: "commerce.shops.read",
      responseSchema: "ShopDetailResponse",
    }),
    current: {
      retrieve: operation("GET", `${app}/shops/current`, "shops.current.retrieve", undefined, {
        permission: "commerce.shops.self.read",
        responseSchema: "CurrentShopResponse",
      }),
      dashboard: {
        retrieve: operation("GET", `${app}/shops/current/dashboard`, "shops.current.dashboard.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopDashboardResponse",
        }),
      },
      readiness: {
        retrieve: operation("GET", `${app}/shops/current/readiness`, "shops.current.readiness.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopReadinessResponse",
        }),
      },
      categoryBindings: {
        list: operation("GET", `${app}/shops/current/category_bindings`, "shops.current.categoryBindings.list", ["shop_category_code", "platform_category_code", "category_status", "review_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopCategoryBindingListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/category_bindings`, "shops.current.categoryBindings.upsert", undefined, {
          auditEvent: "commerce.shop.categoryBinding.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopCategoryBindingRequest",
          responseSchema: "ShopCategoryBindingResponse",
        }),
      },
      brandAuthorizations: {
        list: operation("GET", `${app}/shops/current/brand_authorizations`, "shops.current.brandAuthorizations.list", ["brand_code", "authorization_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopBrandAuthorizationListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/brand_authorizations`, "shops.current.brandAuthorizations.upsert", undefined, {
          auditEvent: "commerce.shop.brandAuthorization.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopBrandAuthorizationRequest",
          responseSchema: "ShopBrandAuthorizationResponse",
        }),
      },
      qualifications: {
        list: operation("GET", `${app}/shops/current/qualifications`, "shops.current.qualifications.list", ["qualification_type", "subject_type", "subject_id", "qualification_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopQualificationListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/qualifications`, "shops.current.qualifications.upsert", undefined, {
          auditEvent: "commerce.shop.qualification.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopQualificationRequest",
          responseSchema: "ShopQualificationResponse",
        }),
      },
      customerServices: {
        list: operation("GET", `${app}/shops/current/customer_services`, "shops.current.customerServices.list", ["service_channel", "service_status", "is_default", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopCustomerServiceListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/customer_services`, "shops.current.customerServices.upsert", undefined, {
          auditEvent: "commerce.shop.customerService.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopCustomerServiceRequest",
          responseSchema: "ShopCustomerServiceResponse",
        }),
      },
      returnAddresses: {
        list: operation("GET", `${app}/shops/current/return_addresses`, "shops.current.returnAddresses.list", ["address_usage", "address_status", "is_default", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopReturnAddressListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/return_addresses`, "shops.current.returnAddresses.upsert", undefined, {
          auditEvent: "commerce.shop.returnAddress.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopReturnAddressRequest",
          responseSchema: "ShopReturnAddressResponse",
        }),
      },
      shippingTemplates: {
        list: operation("GET", `${app}/shops/current/shipping_templates`, "shops.current.shippingTemplates.list", ["template_status", "delivery_method", "is_default", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopShippingTemplateListResponse",
        }),
        upsert: operation("PUT", `${app}/shops/current/shipping_templates`, "shops.current.shippingTemplates.upsert", undefined, {
          auditEvent: "commerce.shop.shippingTemplate.upserted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpsertShopShippingTemplateRequest",
          responseSchema: "ShopShippingTemplateResponse",
        }),
      },
      applications: {
        list: operation("GET", `${app}/shops/current/applications`, "shops.current.applications.list", ["status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopApplicationListResponse",
        }),
        create: operation("POST", `${app}/shops/current/applications`, "shops.current.applications.create", undefined, {
          auditEvent: "commerce.shop.application.submitted",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "SubmitShopApplicationRequest",
          responseSchema: "ShopApplicationResponse",
        }),
      },
      verifications: {
        list: operation("GET", `${app}/shops/current/verifications`, "shops.current.verifications.list", ["verification_type", "verification_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopVerificationListResponse",
        }),
      },
      statusEvents: {
        list: operation("GET", `${app}/shops/current/status_events`, "shops.current.statusEvents.list", ["event_type", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopStatusEventListResponse",
        }),
      },
      channels: {
        list: operation("GET", `${app}/shops/current/channels`, "shops.current.channels.list", ["channel_code", "storefront_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopChannelListResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/channels/{channelId}`, "shops.current.channels.update", undefined, {
          auditEvent: "commerce.shop.channel.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopChannelRequest",
          responseSchema: "ShopChannelResponse",
        }),
      },
      fulfillmentProfile: {
        retrieve: operation("GET", `${app}/shops/current/fulfillment_profile`, "shops.current.fulfillmentProfile.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopFulfillmentProfileResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/fulfillment_profile`, "shops.current.fulfillmentProfile.update", undefined, {
          auditEvent: "commerce.shop.fulfillmentProfile.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopFulfillmentProfileRequest",
          responseSchema: "ShopFulfillmentProfileResponse",
        }),
      },
      settlementProfile: {
        retrieve: operation("GET", `${app}/shops/current/settlement_profile`, "shops.current.settlementProfile.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopSettlementProfileResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/settlement_profile`, "shops.current.settlementProfile.update", undefined, {
          auditEvent: "commerce.shop.settlementProfile.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopSettlementProfileRequest",
          responseSchema: "ShopSettlementProfileResponse",
        }),
      },
      businessHours: {
        retrieve: operation("GET", `${app}/shops/current/business_hours`, "shops.current.businessHours.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopBusinessHourResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/business_hours`, "shops.current.businessHours.update", undefined, {
          auditEvent: "commerce.shop.businessHours.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopBusinessHourRequest",
          responseSchema: "ShopBusinessHourResponse",
        }),
      },
      serviceAreas: {
        list: operation("GET", `${app}/shops/current/service_areas`, "shops.current.serviceAreas.list", ["area_type", "region_code", "service_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopServiceAreaListResponse",
        }),
        create: operation("POST", `${app}/shops/current/service_areas`, "shops.current.serviceAreas.create", undefined, {
          auditEvent: "commerce.shop.serviceArea.created",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "CreateShopServiceAreaRequest",
          responseSchema: "ShopServiceAreaResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/service_areas/{serviceAreaId}`, "shops.current.serviceAreas.update", undefined, {
          auditEvent: "commerce.shop.serviceArea.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopServiceAreaRequest",
          responseSchema: "ShopServiceAreaResponse",
        }),
      },
      policies: {
        list: operation("GET", `${app}/shops/current/policies`, "shops.current.policies.list", ["policy_type", "policy_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopPolicyListResponse",
        }),
        update: operation("PATCH", `${app}/shops/current/policies/{policyId}`, "shops.current.policies.update", undefined, {
          auditEvent: "commerce.shop.policy.updated",
          idempotent: true,
          permission: "commerce.shops.self.write",
          requestSchema: "UpdateShopPolicyRequest",
          responseSchema: "ShopPolicyResponse",
        }),
      },
      depositAccount: {
        retrieve: operation("GET", `${app}/shops/current/deposit_account`, "shops.current.depositAccount.retrieve", undefined, {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopDepositAccountResponse",
        }),
      },
      riskSignals: {
        list: operation("GET", `${app}/shops/current/risk_signals`, "shops.current.riskSignals.list", ["signal_type", "risk_level", "signal_status", "page", "page_size"], {
          permission: "commerce.shops.self.read",
          responseSchema: "ShopRiskSignalListResponse",
        }),
      },
      products: {
        list: operation("GET", `${app}/shops/current/products`, "shops.current.products.list", ["q", "status", "page", "page_size"]),
        create: operation("POST", `${app}/shops/current/products`, "shops.current.products.create"),
        update: operation("PATCH", `${app}/shops/current/products/{productId}`, "shops.current.products.update"),
        publish: operation("POST", `${app}/shops/current/products/{productId}/publish`, "shops.current.products.publish"),
        unpublish: operation("POST", `${app}/shops/current/products/{productId}/unpublish`, "shops.current.products.unpublish"),
      },
      inventory: {
        stocks: {
          list: operation("GET", `${app}/shops/current/inventory/stocks`, "shops.current.inventory.stocks.list", ["sku_id", "warehouse_id", "status", "page", "page_size"]),
          adjustments: {
            create: operation("POST", `${app}/shops/current/inventory/stocks/{stockId}/adjustments`, "shops.current.inventory.stocks.adjustments.create"),
          },
        },
      },
      orders: {
        list: operation("GET", `${app}/shops/current/orders`, "shops.current.orders.list", ["status", "page", "page_size"]),
        retrieve: operation("GET", `${app}/shops/current/orders/{orderId}`, "shops.current.orders.retrieve"),
        fulfillments: {
          create: operation("POST", `${app}/shops/current/orders/{orderId}/fulfillments`, "shops.current.orders.fulfillments.create"),
        },
      },
      settlements: {
        list: operation("GET", `${app}/shops/current/settlements`, "shops.current.settlements.list", ["status", "page", "page_size"]),
      },
    },
  },
  catalog: {
    attributes: {
      list: operation("GET", `${app}/catalog/attributes`, "catalog.attributes.list", ["category_id"]),
    },
    categories: {
      list: operation("GET", `${app}/catalog/categories`, "catalog.categories.list", ["parent_id", "status", "page", "page_size"]),
      retrieve: operation("GET", `${app}/catalog/categories/{categoryId}`, "catalog.categories.retrieve"),
    },
    products: {
      list: operation("GET", `${app}/catalog/products`, "catalog.products.list", ["q", "category_id", "product_type", "status", "page", "page_size", "sort"]),
      retrieve: operation("GET", `${app}/catalog/products/{productId}`, "catalog.products.retrieve"),
    },
    skus: {
      retrieve: operation("GET", `${app}/catalog/skus/{skuId}`, "catalog.skus.retrieve"),
      prices: {
        retrieve: operation("GET", `${app}/catalog/skus/{skuId}/prices`, "catalog.skus.prices.retrieve", ["currency_code", "channel"]),
      },
    },
    spus: {
      list: operation("GET", `${app}/catalog/spus`, "catalog.spus.list", ["q", "category_id", "product_type", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/catalog/spus/{spuId}`, "catalog.spus.retrieve"),
    },
  },
  cart: {
    current: {
      retrieve: operation("GET", `${app}/cart/current`, "cart.current.retrieve"),
    },
    items: {
      create: operation("POST", `${app}/cart/items`, "cart.items.create"),
      update: operation("PATCH", `${app}/cart/items/{cartItemId}`, "cart.items.update"),
      delete: operation("DELETE", `${app}/cart/items/{cartItemId}`, "cart.items.delete"),
    },
  },
  addresses: {
    list: operation("GET", `${app}/addresses`, "addresses.list", ["page", "page_size"]),
    create: operation("POST", `${app}/addresses`, "addresses.create"),
    update: operation("PATCH", `${app}/addresses/{addressId}`, "addresses.update"),
    delete: operation("DELETE", `${app}/addresses/{addressId}`, "addresses.delete"),
    defaultSelection: {
      create: operation("POST", `${app}/addresses/{addressId}/default_selection`, "addresses.defaultSelection.create"),
    },
  },
  checkout: {
    sessions: {
      create: operation("POST", `${app}/checkout/sessions`, "checkout.sessions.create"),
      retrieve: operation("GET", `${app}/checkout/sessions/{checkoutSessionId}`, "checkout.sessions.retrieve"),
      quotes: {
        create: operation("POST", `${app}/checkout/sessions/{checkoutSessionId}/quotes`, "checkout.sessions.quotes.create"),
      },
      orders: {
        create: operation("POST", `${app}/checkout/sessions/{checkoutSessionId}/orders`, "checkout.sessions.orders.create"),
      },
    },
  },
  orders: {
    list: operation("GET", `${app}/orders`, "orders.list", ["status", "page", "page_size"]),
    create: operation("POST", `${app}/orders`, "orders.create"),
    retrieve: operation("GET", `${app}/orders/{orderId}`, "orders.retrieve"),
    pay: operation("POST", `${app}/orders/{orderId}/payments`, "orders.pay"),
    cancel: operation("POST", `${app}/orders/{orderId}/cancel`, "orders.cancel"),
    events: {
      list: operation("GET", `${app}/orders/{orderId}/events`, "orders.events.list"),
    },
    cancellations: {
      create: operation("POST", `${app}/orders/{orderId}/cancellations`, "orders.cancellations.create"),
    },
    paymentSuccess: {
      retrieve: operation("GET", `${app}/orders/{orderId}/payment_success`, "orders.paymentSuccess.retrieve"),
    },
    statistics: {
      retrieve: operation("GET", `${app}/orders/statistics`, "orders.statistics.retrieve"),
    },
    status: {
      retrieve: operation("GET", `${app}/orders/{orderId}/status`, "orders.status.retrieve"),
    },
  },
  payments: {
    close: operation("POST", `${app}/payments/{paymentId}/close`, "payments.close"),
    create: operation("POST", `${app}/payments`, "payments.create"),
    checkout: {
      retrieve: operation("GET", `${app}/payments/checkout/{paymentId}`, "payments.checkout.retrieve"),
    },
    methods: {
      list: operation("GET", `${app}/payments/methods`, "payments.methods.list"),
    },
    intents: {
      create: operation("POST", `${app}/payments/intents`, "payments.intents.create"),
      retrieve: operation("GET", `${app}/payments/intents/{paymentIntentId}`, "payments.intents.retrieve"),
      cancel: operation("POST", `${app}/payments/intents/{paymentIntentId}/cancel`, "payments.intents.cancel"),
      attempts: {
        create: operation("POST", `${app}/payments/intents/{paymentIntentId}/attempts`, "payments.intents.attempts.create"),
      },
    },
    attempts: {
      retrieve: operation("GET", `${app}/payments/attempts/{paymentAttemptId}`, "payments.attempts.retrieve"),
    },
    records: {
      list: operation("GET", `${app}/payments/records`, "payments.records.list", ["status", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/payments/records/{paymentId}`, "payments.records.retrieve"),
    },
    orderPayments: {
      list: operation("GET", `${app}/orders/{orderId}/payments`, "payments.orderPayments.list"),
    },
    reconcile: operation("POST", `${app}/payments/reconciliations`, "payments.reconcile"),
    statistics: {
      retrieve: operation("GET", `${app}/payments/statistics`, "payments.statistics.retrieve"),
    },
    status: {
      retrieve: operation("GET", `${app}/payments/status/{paymentId}`, "payments.status.retrieve"),
      retrieveByOutTradeNo: operation("GET", `${app}/payments/status/out_trade_no/{outTradeNo}`, "payments.status.retrieveByOutTradeNo"),
    },
  },
  refunds: {
    create: operation("POST", `${app}/refunds`, "refunds.create"),
    list: operation("GET", `${app}/refunds`, "refunds.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/refunds/{refundId}`, "refunds.retrieve"),
  },
  fulfillments: {
    list: operation("GET", `${app}/fulfillments`, "fulfillments.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/fulfillments/{fulfillmentId}`, "fulfillments.retrieve"),
  },
  shipments: {
    retrieve: operation("GET", `${app}/shipments/{shipmentId}`, "shipments.retrieve"),
    trackingEvents: {
      list: operation("GET", `${app}/shipments/{shipmentId}/tracking_events`, "shipments.trackingEvents.list"),
    },
  },
  memberships: {
    current: {
      retrieve: operation("GET", `${app}/memberships/current`, "memberships.current.retrieve"),
      status: {
        retrieve: operation("GET", `${app}/memberships/current/status`, "memberships.current.status.retrieve"),
      },
    },
    benefits: {
      list: operation("GET", `${app}/memberships/benefits`, "memberships.benefits.list"),
    },
    plans: {
      list: operation("GET", `${app}/memberships/plans`, "memberships.plans.list", ["status"]),
    },
    packageGroups: {
      list: operation("GET", `${app}/memberships/package_groups`, "memberships.packageGroups.list", ["status"]),
      retrieve: operation("GET", `${app}/memberships/package_groups/{packageGroupId}`, "memberships.packageGroups.retrieve"),
      packages: {
        list: operation("GET", `${app}/memberships/package_groups/{packageGroupId}/packages`, "memberships.packageGroups.packages.list", ["status"]),
      },
    },
    packages: {
      list: operation("GET", `${app}/memberships/packages`, "memberships.packages.list", ["status"]),
      retrieve: operation("GET", `${app}/memberships/packages/{packageId}`, "memberships.packages.retrieve"),
    },
    purchases: {
      create: operation("POST", `${app}/memberships/purchases`, "memberships.purchases.create"),
      renew: operation("POST", `${app}/memberships/purchases/renew`, "memberships.purchases.renew"),
      upgrade: operation("POST", `${app}/memberships/purchases/upgrade`, "memberships.purchases.upgrade"),
    },
    points: {
      balance: {
        retrieve: operation("GET", `${app}/memberships/points/balance`, "memberships.points.balance.retrieve"),
      },
      history: {
        list: operation("GET", `${app}/memberships/points/history`, "memberships.points.history.list", ["page", "page_size", "cursor"]),
      },
      dailyRewards: {
        create: operation("POST", `${app}/memberships/points/daily_rewards`, "memberships.points.dailyRewards.create"),
        status: {
          retrieve: operation("GET", `${app}/memberships/points/daily_rewards/status`, "memberships.points.dailyRewards.status.retrieve"),
        },
      },
    },
    privileges: {
      usage: {
        retrieve: operation("GET", `${app}/memberships/privileges/usage`, "memberships.privileges.usage.retrieve"),
      },
      speedUps: {
        create: operation("POST", `${app}/memberships/privileges/speed_ups`, "memberships.privileges.speedUps.create"),
      },
    },
  },
  recharges: {
    packages: {
      list: operation("GET", `${app}/recharges/packages`, "recharges.packages.list", ["status"]),
    },
    settings: {
      retrieve: operation("GET", `${app}/recharges/settings`, "recharges.settings.retrieve"),
    },
    orders: {
      create: operation("POST", `${app}/recharges/orders`, "recharges.orders.create"),
      retrieve: operation("GET", `${app}/recharges/orders/{orderId}`, "recharges.orders.retrieve"),
      cancel: operation("POST", `${app}/recharges/orders/{orderId}/cancellations`, "recharges.orders.cancel"),
    },
  },
  billing: {
    history: {
      list: operation("GET", `${app}/billing/history`, "billing.history.list", ["page", "page_size", "type", "status", "cursor"]),
    },
  },
  wallet: {
    overview: {
      retrieve: operation("GET", `${app}/wallet/overview`, "wallet.overview.retrieve"),
    },
    accounts: {
      list: operation("GET", `${app}/wallet/accounts`, "wallet.accounts.list", ["asset_type"]),
      retrieve: operation("GET", `${app}/wallet/accounts/{accountId}`, "wallet.accounts.retrieve"),
      overview: {
        retrieve: operation("GET", `${app}/wallet/accounts/overview`, "wallet.accounts.overview.retrieve"),
      },
      points: {
        retrieve: operation("GET", `${app}/wallet/accounts/points`, "wallet.accounts.points.retrieve"),
      },
      tokens: {
        retrieve: operation("GET", `${app}/wallet/accounts/tokens`, "wallet.accounts.tokens.retrieve"),
      },
    },
    ledgerEntries: {
      list: operation("GET", `${app}/wallet/ledger_entries`, "wallet.ledgerEntries.list", ["page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/wallet/ledger_entries/{ledgerEntryId}`, "wallet.ledgerEntries.retrieve"),
      points: {
        list: operation("GET", `${app}/wallet/ledger_entries/points`, "wallet.ledgerEntries.points.list", ["page", "page_size", "cursor"]),
      },
    },
    holds: {
      create: operation("POST", `${app}/wallet/holds`, "wallet.holds.create"),
      releases: {
        create: operation("POST", `${app}/wallet/holds/releases`, "wallet.holds.releases.create"),
      },
      settlements: {
        create: operation("POST", `${app}/wallet/holds/settlements`, "wallet.holds.settlements.create"),
      },
    },
    exchangeRate: {
      retrieve: operation("GET", `${app}/wallet/exchange_rate`, "wallet.exchangeRate.retrieve"),
    },
    exchangeRules: {
      list: operation("GET", `${app}/wallet/exchange_rules`, "wallet.exchangeRules.list", ["source_asset_type", "target_asset_type"]),
    },
    points: {
      exchangeRules: {
        list: operation("GET", `${app}/wallet/points/exchanges/rules`, "wallet.points.exchangeRules.list"),
      },
    },
    tokens: {
      retrieve: operation("GET", `${app}/wallet/tokens`, "wallet.tokens.retrieve"),
    },
    exchanges: {
      create: operation("POST", `${app}/wallet/exchanges`, "wallet.exchanges.create"),
    },
    pointTransfers: {
      create: operation("POST", `${app}/wallet/point_transfers`, "wallet.pointTransfers.create"),
    },
    pointExchanges: {
      create: operation("POST", `${app}/wallet/point_exchanges`, "wallet.pointExchanges.create"),
      retrieve: operation("GET", `${app}/wallet/point_exchanges/{exchangeNo}`, "wallet.pointExchanges.retrieve"),
    },
    transfers: {
      create: operation("POST", `${app}/wallet/transfers`, "wallet.transfers.create"),
    },
    topupTransfers: {
      create: operation("POST", `${app}/wallet/topup_transfers`, "wallet.topupTransfers.create"),
    },
    withdrawalTransfers: {
      create: operation("POST", `${app}/wallet/withdrawal_transfers`, "wallet.withdrawalTransfers.create"),
    },
    requests: {
      retrieve: operation("GET", `${app}/wallet/requests/{requestNo}`, "wallet.requests.retrieve"),
    },
    adjustments: {
      create: operation("POST", `${app}/wallet/adjustments`, "wallet.adjustments.create"),
    },
    transactions: {
      list: operation("GET", `${app}/wallet/transactions`, "wallet.transactions.list", ["asset_type", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/wallet/transactions/{transactionId}`, "wallet.transactions.retrieve"),
    },
  },
  promotions: {
    userCoupons: {
      list: operation("GET", `${app}/promotions/user_coupons`, "promotions.userCoupons.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${app}/promotions/user_coupons/{userCouponId}`, "promotions.userCoupons.retrieve"),
      claims: {
        create: operation("POST", `${app}/promotions/user_coupon_claims`, "promotions.userCoupons.claims.create"),
      },
      wallet: {
        list: operation("GET", `${app}/promotions/user_coupons/wallet`, "promotions.userCoupons.wallet.list", ["status", "page", "page_size"]),
        retrieve: operation("GET", `${app}/promotions/user_coupons/wallet/{userCouponId}`, "promotions.userCoupons.wallet.retrieve"),
      },
    },
    offers: {
      list: operation("GET", `${app}/promotions/offers`, "promotions.offers.list", ["status", "page", "page_size", "cursor"]),
      retrieve: operation("GET", `${app}/promotions/offers/{offerId}`, "promotions.offers.retrieve"),
    },
    codes: {
      redemptions: {
        create: operation("POST", `${app}/promotions/codes/redemptions`, "promotions.codes.redemptions.create"),
      },
    },
    discountApplications: {
      create: operation("POST", `${app}/promotions/discount_applications`, "promotions.discountApplications.create"),
      settle: operation("POST", `${app}/promotions/discount_applications/{applicationId}/settlements`, "promotions.discountApplications.settle"),
      release: operation("POST", `${app}/promotions/discount_applications/{applicationId}/releases`, "promotions.discountApplications.release"),
      rollback: operation("POST", `${app}/promotions/discount_applications/{applicationId}/rollback`, "promotions.discountApplications.rollback"),
      reversals: {
        create: operation("POST", `${app}/promotions/discount_applications/reversals`, "promotions.discountApplications.reversals.create"),
      },
    },
  },
  invoices: {
    list: operation("GET", `${app}/invoices`, "invoices.list", ["status", "page", "page_size"]),
    retrieve: operation("GET", `${app}/invoices/{invoiceId}`, "invoices.retrieve"),
    create: operation("POST", `${app}/invoices`, "invoices.create"),
    update: operation("PATCH", `${app}/invoices/{invoiceId}`, "invoices.update"),
    submit: operation("POST", `${app}/invoices/{invoiceId}/submissions`, "invoices.submit"),
    cancel: operation("POST", `${app}/invoices/{invoiceId}/cancellations`, "invoices.cancel"),
    items: {
      list: operation("GET", `${app}/invoices/{invoiceId}/items`, "invoices.items.list"),
    },
    mine: {
      list: operation("GET", `${app}/invoices/mine`, "invoices.mine.list", ["status", "page", "page_size"]),
    },
    statistics: {
      retrieve: operation("GET", `${app}/invoices/statistics`, "invoices.statistics.retrieve"),
    },
    submissions: {
      create: operation("POST", `${app}/invoices/{invoiceId}/submissions`, "invoices.submissions.create"),
    },
    cancellations: {
      create: operation("POST", `${app}/invoices/{invoiceId}/cancellations`, "invoices.cancellations.create"),
    },
  },
  backend: {
    shops: {
      list: operation("GET", `${backend}/shops`, "shops.management.list", ["q", "shop_type", "operation_status", "review_status", "page", "page_size"], {
        permission: "commerce.shops.read",
        responseSchema: "ShopManagementListResponse",
      }),
      create: operation("POST", `${backend}/shops`, "shops.create", undefined, {
        auditEvent: "commerce.shop.created",
        idempotent: true,
        permission: "commerce.shops.write",
        requestSchema: "CreateShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      retrieve: operation("GET", `${backend}/shops/{shopId}`, "shops.management.retrieve", undefined, {
        permission: "commerce.shops.read",
        responseSchema: "ShopManagementDetailResponse",
      }),
      update: operation("PATCH", `${backend}/shops/{shopId}`, "shops.update", undefined, {
        auditEvent: "commerce.shop.updated",
        idempotent: true,
        permission: "commerce.shops.write",
        requestSchema: "UpdateShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      categoryBindings: {
        list: operation("GET", `${backend}/shops/{shopId}/category_bindings`, "shops.categoryBindings.list", ["shop_category_code", "platform_category_code", "category_status", "review_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopCategoryBindingListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/category_bindings`, "shops.categoryBindings.upsert", undefined, {
          auditEvent: "commerce.shop.categoryBinding.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopCategoryBindingRequest",
          responseSchema: "ShopCategoryBindingResponse",
        }),
      },
      brandAuthorizations: {
        list: operation("GET", `${backend}/shops/{shopId}/brand_authorizations`, "shops.brandAuthorizations.list", ["brand_code", "authorization_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopBrandAuthorizationListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/brand_authorizations`, "shops.brandAuthorizations.upsert", undefined, {
          auditEvent: "commerce.shop.brandAuthorization.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopBrandAuthorizationRequest",
          responseSchema: "ShopBrandAuthorizationResponse",
        }),
      },
      qualifications: {
        list: operation("GET", `${backend}/shops/{shopId}/qualifications`, "shops.qualifications.list", ["qualification_type", "subject_type", "subject_id", "qualification_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopQualificationListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/qualifications`, "shops.qualifications.upsert", undefined, {
          auditEvent: "commerce.shop.qualification.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopQualificationRequest",
          responseSchema: "ShopQualificationResponse",
        }),
      },
      customerServices: {
        list: operation("GET", `${backend}/shops/{shopId}/customer_services`, "shops.customerServices.list", ["service_channel", "service_status", "is_default", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopCustomerServiceListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/customer_services`, "shops.customerServices.upsert", undefined, {
          auditEvent: "commerce.shop.customerService.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopCustomerServiceRequest",
          responseSchema: "ShopCustomerServiceResponse",
        }),
      },
      returnAddresses: {
        list: operation("GET", `${backend}/shops/{shopId}/return_addresses`, "shops.returnAddresses.list", ["address_usage", "address_status", "is_default", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopReturnAddressListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/return_addresses`, "shops.returnAddresses.upsert", undefined, {
          auditEvent: "commerce.shop.returnAddress.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopReturnAddressRequest",
          responseSchema: "ShopReturnAddressResponse",
        }),
      },
      shippingTemplates: {
        list: operation("GET", `${backend}/shops/{shopId}/shipping_templates`, "shops.shippingTemplates.list", ["template_status", "delivery_method", "is_default", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopShippingTemplateListResponse",
        }),
        upsert: operation("PUT", `${backend}/shops/{shopId}/shipping_templates`, "shops.shippingTemplates.upsert", undefined, {
          auditEvent: "commerce.shop.shippingTemplate.upserted",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpsertShopShippingTemplateRequest",
          responseSchema: "ShopShippingTemplateResponse",
        }),
      },
      verifications: {
        list: operation("GET", `${backend}/shops/{shopId}/verifications`, "shops.verifications.list", ["verification_type", "verification_status", "page", "page_size"], {
          permission: "commerce.shops.review",
          responseSchema: "ShopVerificationListResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/verifications/{verificationId}`, "shops.verifications.update", undefined, {
          auditEvent: "commerce.shop.verification.updated",
          idempotent: true,
          permission: "commerce.shops.review",
          requestSchema: "UpdateShopVerificationRequest",
          responseSchema: "ShopVerificationListResponse",
        }),
      },
      statusEvents: {
        list: operation("GET", `${backend}/shops/{shopId}/status_events`, "shops.statusEvents.list", ["event_type", "page", "page_size"], {
          permission: "commerce.shops.audit.read",
          responseSchema: "ShopStatusEventListResponse",
        }),
      },
      channels: {
        list: operation("GET", `${backend}/shops/{shopId}/channels`, "shops.channels.list", ["channel_code", "storefront_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopChannelListResponse",
        }),
        create: operation("POST", `${backend}/shops/{shopId}/channels`, "shops.channels.create", undefined, {
          auditEvent: "commerce.shop.channel.created",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "CreateShopChannelRequest",
          responseSchema: "ShopChannelResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/channels/{channelId}`, "shops.channels.update", undefined, {
          auditEvent: "commerce.shop.channel.updated",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpdateShopChannelRequest",
          responseSchema: "ShopChannelResponse",
        }),
      },
      fulfillmentProfile: {
        retrieve: operation("GET", `${backend}/shops/{shopId}/fulfillment_profile`, "shops.fulfillmentProfile.retrieve", undefined, {
          permission: "commerce.shops.read",
          responseSchema: "ShopFulfillmentProfileResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/fulfillment_profile`, "shops.fulfillmentProfile.update", undefined, {
          auditEvent: "commerce.shop.fulfillmentProfile.updated",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpdateShopFulfillmentProfileRequest",
          responseSchema: "ShopFulfillmentProfileResponse",
        }),
      },
      settlementProfile: {
        retrieve: operation("GET", `${backend}/shops/{shopId}/settlement_profile`, "shops.settlementProfile.retrieve", undefined, {
          permission: "commerce.shops.settlement.read",
          responseSchema: "ShopSettlementProfileResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/settlement_profile`, "shops.settlementProfile.update", undefined, {
          auditEvent: "commerce.shop.settlementProfile.updated",
          idempotent: true,
          permission: "commerce.shops.settlement.write",
          requestSchema: "UpdateShopSettlementProfileRequest",
          responseSchema: "ShopSettlementProfileResponse",
        }),
        approve: operation("POST", `${backend}/shops/{shopId}/settlement_profile/approve`, "shops.settlementProfile.approve", undefined, {
          auditEvent: "commerce.shop.settlementProfile.approved",
          idempotent: true,
          permission: "commerce.shops.settlement.review",
          requestSchema: "ApproveShopSettlementProfileRequest",
          responseSchema: "ShopSettlementProfileResponse",
        }),
        reject: operation("POST", `${backend}/shops/{shopId}/settlement_profile/reject`, "shops.settlementProfile.reject", undefined, {
          auditEvent: "commerce.shop.settlementProfile.rejected",
          idempotent: true,
          permission: "commerce.shops.settlement.review",
          requestSchema: "RejectShopSettlementProfileRequest",
          responseSchema: "ShopSettlementProfileResponse",
        }),
      },
      businessHours: {
        retrieve: operation("GET", `${backend}/shops/{shopId}/business_hours`, "shops.businessHours.retrieve", undefined, {
          permission: "commerce.shops.read",
          responseSchema: "ShopBusinessHourResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/business_hours`, "shops.businessHours.update", undefined, {
          auditEvent: "commerce.shop.businessHours.updated",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpdateShopBusinessHourRequest",
          responseSchema: "ShopBusinessHourResponse",
        }),
      },
      serviceAreas: {
        list: operation("GET", `${backend}/shops/{shopId}/service_areas`, "shops.serviceAreas.list", ["area_type", "region_code", "service_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopServiceAreaListResponse",
        }),
        create: operation("POST", `${backend}/shops/{shopId}/service_areas`, "shops.serviceAreas.create", undefined, {
          auditEvent: "commerce.shop.serviceArea.created",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "CreateShopServiceAreaRequest",
          responseSchema: "ShopServiceAreaResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/service_areas/{serviceAreaId}`, "shops.serviceAreas.update", undefined, {
          auditEvent: "commerce.shop.serviceArea.updated",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpdateShopServiceAreaRequest",
          responseSchema: "ShopServiceAreaResponse",
        }),
      },
      policies: {
        list: operation("GET", `${backend}/shops/{shopId}/policies`, "shops.policies.list", ["policy_type", "policy_status", "page", "page_size"], {
          permission: "commerce.shops.read",
          responseSchema: "ShopPolicyListResponse",
        }),
        create: operation("POST", `${backend}/shops/{shopId}/policies`, "shops.policies.create", undefined, {
          auditEvent: "commerce.shop.policy.created",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "CreateShopPolicyRequest",
          responseSchema: "ShopPolicyResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/policies/{policyId}`, "shops.policies.update", undefined, {
          auditEvent: "commerce.shop.policy.updated",
          idempotent: true,
          permission: "commerce.shops.write",
          requestSchema: "UpdateShopPolicyRequest",
          responseSchema: "ShopPolicyResponse",
        }),
      },
      depositAccount: {
        retrieve: operation("GET", `${backend}/shops/{shopId}/deposit_account`, "shops.depositAccount.retrieve", undefined, {
          permission: "commerce.shops.deposit.read",
          responseSchema: "ShopDepositAccountResponse",
        }),
        update: operation("PATCH", `${backend}/shops/{shopId}/deposit_account`, "shops.depositAccount.update", undefined, {
          auditEvent: "commerce.shop.depositAccount.updated",
          idempotent: true,
          permission: "commerce.shops.deposit.write",
          requestSchema: "UpdateShopDepositAccountRequest",
          responseSchema: "ShopDepositAccountResponse",
        }),
        review: operation("POST", `${backend}/shops/{shopId}/deposit_account/review`, "shops.depositAccount.review", undefined, {
          auditEvent: "commerce.shop.depositAccount.reviewed",
          idempotent: true,
          permission: "commerce.shops.deposit.review",
          requestSchema: "ReviewShopDepositAccountRequest",
          responseSchema: "ShopDepositAccountResponse",
        }),
      },
      riskSignals: {
        list: operation("GET", `${backend}/shops/{shopId}/risk_signals`, "shops.riskSignals.list", ["signal_type", "risk_level", "signal_status", "page", "page_size"], {
          permission: "commerce.shops.risk.read",
          responseSchema: "ShopRiskSignalListResponse",
        }),
        create: operation("POST", `${backend}/shops/{shopId}/risk_signals`, "shops.riskSignals.create", undefined, {
          auditEvent: "commerce.shop.riskSignal.created",
          idempotent: true,
          permission: "commerce.shops.risk.write",
          requestSchema: "CreateShopRiskSignalRequest",
          responseSchema: "ShopRiskSignalResponse",
        }),
        resolve: operation("POST", `${backend}/shops/{shopId}/risk_signals/{riskSignalId}/resolve`, "shops.riskSignals.resolve", undefined, {
          auditEvent: "commerce.shop.riskSignal.resolved",
          idempotent: true,
          permission: "commerce.shops.risk.write",
          requestSchema: "ResolveShopRiskSignalRequest",
          responseSchema: "ShopRiskSignalResponse",
        }),
      },
      readiness: {
        retrieve: operation("GET", `${backend}/shops/{shopId}/readiness`, "shops.readiness.retrieve", undefined, {
          permission: "commerce.shops.read",
          responseSchema: "ShopReadinessResponse",
        }),
      },
      submitReview: operation("POST", `${backend}/shops/{shopId}/submit_review`, "shops.submitReview", undefined, {
        auditEvent: "commerce.shop.review.submitted",
        idempotent: true,
        permission: "commerce.shops.review",
        requestSchema: "SubmitShopReviewRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      approve: operation("POST", `${backend}/shops/{shopId}/approve`, "shops.approve", undefined, {
        auditEvent: "commerce.shop.approved",
        idempotent: true,
        permission: "commerce.shops.review",
        requestSchema: "ApproveShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      reject: operation("POST", `${backend}/shops/{shopId}/reject`, "shops.reject", undefined, {
        auditEvent: "commerce.shop.rejected",
        idempotent: true,
        permission: "commerce.shops.review",
        requestSchema: "RejectShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      suspend: operation("POST", `${backend}/shops/{shopId}/suspend`, "shops.suspend", undefined, {
        auditEvent: "commerce.shop.suspended",
        idempotent: true,
        permission: "commerce.shops.status.write",
        requestSchema: "SuspendShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      resume: operation("POST", `${backend}/shops/{shopId}/resume`, "shops.resume", undefined, {
        auditEvent: "commerce.shop.resumed",
        idempotent: true,
        permission: "commerce.shops.status.write",
        requestSchema: "ResumeShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
      close: operation("POST", `${backend}/shops/{shopId}/close`, "shops.close", undefined, {
        auditEvent: "commerce.shop.closed",
        idempotent: true,
        permission: "commerce.shops.status.write",
        requestSchema: "CloseShopRequest",
        responseSchema: "ShopManagementDetailResponse",
      }),
    },
    catalog: {
      categories: {
        list: operation("GET", `${backend}/catalog/categories`, "catalog.categories.management.list", ["parent_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/categories`, "catalog.categories.create"),
        update: operation("PATCH", `${backend}/catalog/categories/{categoryId}`, "catalog.categories.update"),
        delete: operation("DELETE", `${backend}/catalog/categories/{categoryId}`, "catalog.categories.delete"),
      },
      products: {
        list: operation("GET", `${backend}/catalog/products`, "catalog.products.management.list", ["q", "category_id", "product_type", "status", "page", "page_size", "sort"]),
        retrieve: operation("GET", `${backend}/catalog/products/{productId}`, "catalog.products.management.retrieve"),
        create: operation("POST", `${backend}/catalog/products`, "catalog.products.create"),
        update: operation("PATCH", `${backend}/catalog/products/{productId}`, "catalog.products.update"),
        delete: operation("DELETE", `${backend}/catalog/products/{productId}`, "catalog.products.delete"),
      },
      spus: {
        list: operation("GET", `${backend}/catalog/spus`, "catalog.spus.management.list", ["q", "status", "page", "page_size", "cursor"]),
        create: operation("POST", `${backend}/catalog/spus`, "catalog.spus.create"),
        update: operation("PATCH", `${backend}/catalog/spus/{spuId}`, "catalog.spus.update"),
        publish: operation("POST", `${backend}/catalog/spus/{spuId}/publish`, "catalog.spus.publish"),
        archive: operation("POST", `${backend}/catalog/spus/{spuId}/archive`, "catalog.spus.archive"),
      },
      skus: {
        list: operation("GET", `${backend}/catalog/skus`, "catalog.skus.list", ["product_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/skus`, "catalog.skus.create"),
        update: operation("PATCH", `${backend}/catalog/skus/{skuId}`, "catalog.skus.update"),
        delete: operation("DELETE", `${backend}/catalog/skus/{skuId}`, "catalog.skus.delete"),
      },
      attributes: {
        list: operation("GET", `${backend}/catalog/attributes`, "catalog.attributes.management.list", ["scope", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/attributes`, "catalog.attributes.create"),
      },
      categorySeeds: {
        create: operation("POST", `${backend}/catalog/category_seeds/initialize`, "catalog.categorySeeds.create"),
      },
      categoryAttributes: {
        list: operation("GET", `${backend}/catalog/category_attributes`, "catalog.categoryAttributes.list", ["category_id", "attribute_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/category_attributes`, "catalog.categoryAttributes.create"),
        update: operation("PATCH", `${backend}/catalog/category_attributes/{bindingId}`, "catalog.categoryAttributes.update"),
        delete: operation("DELETE", `${backend}/catalog/category_attributes/{bindingId}`, "catalog.categoryAttributes.delete"),
      },
      priceLists: {
        list: operation("GET", `${backend}/catalog/price_lists`, "catalog.priceLists.list", ["currency_code", "market_code", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/catalog/price_lists`, "catalog.priceLists.create"),
        update: operation("PATCH", `${backend}/catalog/price_lists/{priceListId}`, "catalog.priceLists.update"),
      },
    },
    inventory: {
      stocks: {
        list: operation("GET", `${backend}/inventory/stocks`, "inventory.stocks.list", ["sku_id", "warehouse_id", "status", "page", "page_size"]),
        update: operation("PATCH", `${backend}/inventory/stocks/{stockId}`, "inventory.stocks.update"),
      },
      reservations: {
        list: operation("GET", `${backend}/inventory/reservations`, "inventory.reservations.list", ["sku_id", "order_id", "checkout_session_id", "status", "page", "page_size"]),
      },
      movements: {
        list: operation("GET", `${backend}/inventory/movements`, "inventory.movements.list", ["sku_id", "warehouse_id", "movement_type", "source_type", "source_id", "page", "page_size"]),
      },
    },
    orders: {
      list: operation("GET", `${backend}/orders`, "orders.management.list", ["status", "page", "page_size", "q"]),
      retrieve: operation("GET", `${backend}/orders/{orderId}`, "orders.management.retrieve"),
      cancel: operation("POST", `${backend}/orders/{orderId}/cancel`, "orders.management.cancel"),
      close: operation("POST", `${backend}/orders/{orderId}/close`, "orders.management.close"),
      events: {
        list: operation("GET", `${backend}/orders/{orderId}/events`, "orders.events.management.list", ["page", "page_size"]),
      },
      cancellations: {
        list: operation("GET", `${backend}/orders/cancellations`, "orders.cancellations.list", ["status", "page", "page_size"]),
      },
    },
    payments: {
      providers: {
        list: operation("GET", `${backend}/payments/providers`, "payments.providers.list", ["status"]),
        update: operation("PATCH", `${backend}/payments/providers/{providerCode}`, "payments.providers.update"),
      },
      providerAccounts: {
        list: operation("GET", `${backend}/payments/provider_accounts`, "payments.providerAccounts.list", ["provider_code", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/payments/provider_accounts`, "payments.providerAccounts.create"),
        update: operation("PATCH", `${backend}/payments/provider_accounts/{providerAccountId}`, "payments.providerAccounts.update"),
        delete: operation("DELETE", `${backend}/payments/provider_accounts/{providerAccountId}`, "payments.providerAccounts.delete"),
        status: {
          update: operation("PATCH", `${backend}/payments/provider_accounts/{providerAccountId}/status`, "payments.providerAccounts.status.update"),
        },
      },
      methods: {
        list: operation("GET", `${backend}/payments/methods`, "payments.methods.management.list", ["status"]),
        create: operation("POST", `${backend}/payments/methods`, "payments.methods.create"),
        update: operation("PATCH", `${backend}/payments/methods/{methodId}`, "payments.methods.update"),
      },
      channels: {
        list: operation("GET", `${backend}/payments/channels`, "payments.channels.list", ["provider_account_id", "method_id", "status"]),
        create: operation("POST", `${backend}/payments/channels`, "payments.channels.create"),
        update: operation("PATCH", `${backend}/payments/channels/{channelId}`, "payments.channels.update"),
      },
      routeRules: {
        list: operation("GET", `${backend}/payments/route_rules`, "payments.routeRules.list", ["status"]),
        create: operation("POST", `${backend}/payments/route_rules`, "payments.routeRules.create"),
        update: operation("PATCH", `${backend}/payments/route_rules/{routeRuleId}`, "payments.routeRules.update"),
      },
      intents: {
        list: operation("GET", `${backend}/payments/intents`, "payments.intents.list", ["status", "page", "page_size"]),
        retrieve: operation("GET", `${backend}/payments/intents/{paymentIntentId}`, "payments.intents.management.retrieve"),
      },
      attempts: {
        list: operation("GET", `${backend}/payments/attempts`, "payments.attempts.list", ["provider_code", "status", "page", "page_size", "cursor"]),
      },
      webhookEvents: {
        list: operation("GET", `${backend}/payments/webhook_events`, "payments.webhookEvents.list", ["provider_code", "status", "page", "page_size"]),
        replays: {
          create: operation("POST", `${backend}/payments/webhook_events/{eventId}/replays`, "payments.webhookEvents.replays.create"),
        },
      },
      reconciliationRuns: {
        list: operation("GET", `${backend}/payments/reconciliation_runs`, "payments.reconciliationRuns.list", ["provider_code", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/payments/reconciliation_runs`, "payments.reconciliationRuns.create"),
      },
      runtime: {
        snapshot: {
          retrieve: operation("GET", `${backend}/payments/runtime/snapshot`, "payments.runtime.snapshot.retrieve", ["environment"]),
        },
      },
      disputes: {
        list: operation("GET", `${backend}/payments/disputes`, "payments.disputes.list", ["status", "page", "page_size"]),
      },
    },
    refunds: {
      list: operation("GET", `${backend}/refunds`, "refunds.management.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/refunds/{refundId}`, "refunds.management.retrieve"),
      attempts: {
        list: operation("GET", `${backend}/refunds/{refundId}/attempts`, "refunds.attempts.list"),
      },
    },
    fulfillments: {
      list: operation("GET", `${backend}/fulfillments`, "fulfillments.management.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/fulfillments/{fulfillmentId}`, "fulfillments.management.retrieve"),
      update: operation("PATCH", `${backend}/fulfillments/{fulfillmentId}`, "fulfillments.update"),
    },
    shipments: {
      list: operation("GET", `${backend}/shipments`, "shipments.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/shipments/{shipmentId}`, "shipments.management.retrieve"),
      trackingEvents: {
        list: operation("GET", `${backend}/shipments/{shipmentId}/tracking_events`, "shipments.trackingEvents.list"),
      },
    },
    entitlements: {
      grants: {
        list: operation("GET", `${backend}/entitlements/grants`, "entitlements.grants.list", ["subject_type", "subject_id", "benefit_id", "source_type", "source_id", "status", "page", "page_size"]),
      },
      accounts: {
        list: operation("GET", `${backend}/entitlements/accounts`, "entitlements.accounts.list", ["subject_type", "subject_id", "benefit_id", "status", "page", "page_size"]),
      },
      ledgerEntries: {
        list: operation("GET", `${backend}/entitlements/ledger_entries`, "entitlements.ledgerEntries.list", ["account_id", "subject_type", "subject_id", "benefit_id", "source_type", "source_id", "direction", "page", "page_size"]),
      },
    },
    memberships: {
      plans: {
        list: operation("GET", `${backend}/memberships/plans`, "memberships.plans.management.list", ["status"]),
        create: operation("POST", `${backend}/memberships/plans`, "memberships.plans.create"),
        update: operation("PATCH", `${backend}/memberships/plans/{planId}`, "memberships.plans.update"),
      },
      packages: {
        list: operation("GET", `${backend}/memberships/packages`, "memberships.packages.management.list", ["plan_id", "status"]),
        create: operation("POST", `${backend}/memberships/packages`, "memberships.packages.create"),
        update: operation("PATCH", `${backend}/memberships/packages/{packageId}`, "memberships.packages.update"),
        delete: operation("DELETE", `${backend}/memberships/packages/{packageId}`, "memberships.packages.delete"),
      },
      packageGroups: {
        list: operation("GET", `${backend}/memberships/package_groups`, "memberships.packageGroups.management.list", ["status"]),
        create: operation("POST", `${backend}/memberships/package_groups`, "memberships.packageGroups.create"),
        update: operation("PATCH", `${backend}/memberships/package_groups/{packageGroupId}`, "memberships.packageGroups.update"),
        delete: operation("DELETE", `${backend}/memberships/package_groups/{packageGroupId}`, "memberships.packageGroups.delete"),
      },
      members: {
        list: operation("GET", `${backend}/memberships/members`, "memberships.members.list", ["user_id", "plan_id", "status", "page", "page_size"]),
        update: operation("PATCH", `${backend}/memberships/members/{membershipId}`, "memberships.members.update"),
      },
      entitlements: {
        list: operation("GET", `${backend}/memberships/entitlements`, "memberships.entitlements.list", ["membership_id", "plan_id", "status", "page", "page_size"]),
      },
    },
    recharges: {
      packages: {
        list: operation("GET", `${backend}/recharges/packages`, "recharges.packages.management.list", ["status"]),
        create: operation("POST", `${backend}/recharges/packages`, "recharges.packages.create"),
        update: operation("PATCH", `${backend}/recharges/packages/{packageId}`, "recharges.packages.update"),
        delete: operation("DELETE", `${backend}/recharges/packages/{packageId}`, "recharges.packages.delete"),
      },
      settings: {
        retrieve: operation("GET", `${backend}/recharges/settings`, "recharges.settings.management.retrieve"),
        update: operation("PUT", `${backend}/recharges/settings`, "recharges.settings.update"),
      },
      orders: {
        list: operation("GET", `${backend}/recharges/orders`, "recharges.orders.management.list", ["user_id", "status", "page", "page_size", "cursor"]),
        retrieve: operation("GET", `${backend}/recharges/orders/{orderId}`, "recharges.orders.management.retrieve"),
      },
    },
    wallet: {
      accounts: {
        list: operation("GET", `${backend}/wallet/accounts`, "wallet.accounts.management.list", [
          "user_id",
          "asset_type",
          "status",
          "page",
          "page_size",
        ]),
      },
      ledgerEntries: {
        list: operation("GET", `${backend}/wallet/ledger_entries`, "wallet.ledgerEntries.management.list", ["page", "page_size", "q", "status", "start_time", "end_time"]),
      },
      adjustments: {
        create: operation("POST", `${backend}/wallet/adjustments`, "wallet.adjustments.management.create"),
      },
      holds: {
        list: operation("GET", `${backend}/wallet/holds`, "wallet.holds.list", ["status", "page", "page_size"]),
      },
      exchangeRules: {
        list: operation("GET", `${backend}/wallet/exchange_rules`, "wallet.exchangeRules.management.list", ["source_asset_type", "target_asset_type", "status"]),
        update: operation("PUT", `${backend}/wallet/exchange_rules`, "wallet.exchangeRules.update"),
      },
    },
    promotions: {
      offers: {
        list: operation("GET", `${backend}/promotions/offers`, "promotions.offers.management.list", ["status", "page", "page_size", "cursor"]),
        create: operation("POST", `${backend}/promotions/offers`, "promotions.offers.create"),
        update: operation("PATCH", `${backend}/promotions/offers/{offerId}`, "promotions.offers.update"),
      },
      couponStocks: {
        list: operation("GET", `${backend}/promotions/coupon_stocks`, "promotions.couponStocks.list", ["offer_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/promotions/coupon_stocks`, "promotions.couponStocks.create"),
      },
      codes: {
        list: operation("GET", `${backend}/promotions/codes`, "promotions.codes.list", ["stock_id", "offer_id", "status", "page", "page_size"]),
        create: operation("POST", `${backend}/promotions/codes`, "promotions.codes.create"),
        redemptions: {
          list: operation("GET", `${backend}/promotions/codes/redemptions`, "promotions.codes.redemptions.list", ["page", "page_size", "code_status"]),
        },
      },
      userCoupons: {
        list: operation("GET", `${backend}/promotions/user_coupons`, "promotions.userCoupons.management.list", ["user_id", "status", "page", "page_size", "cursor"]),
      },
      discountApplications: {
        list: operation("GET", `${backend}/promotions/discount_applications`, "promotions.discountApplications.list", ["order_id", "status", "page", "page_size", "cursor"]),
      },
      discountAllocations: {
        list: operation("GET", `${backend}/promotions/discount_allocations`, "promotions.discountAllocations.list", ["application_id", "order_item_id", "page", "page_size"]),
      },
      couponLedgerEntries: {
        list: operation("GET", `${backend}/promotions/coupon_ledger_entries`, "promotions.couponLedgerEntries.list", ["stock_id", "page", "page_size"]),
      },
      budgetLedgerEntries: {
        list: operation("GET", `${backend}/promotions/budget_ledger_entries`, "promotions.budgetLedgerEntries.list", ["budget_account_id", "page", "page_size"]),
      },
      externalBindings: {
        list: operation("GET", `${backend}/promotions/external_bindings`, "promotions.externalBindings.list", ["platform", "page", "page_size"]),
      },
      events: {
        list: operation("GET", `${backend}/promotions/events`, "promotions.events.list", ["status", "page", "page_size"]),
      },
    },
    invoices: {
      titles: {
        list: operation("GET", `${backend}/invoices/titles`, "invoices.titles.list", ["user_id", "status", "page", "page_size"]),
      },
      list: operation("GET", `${backend}/invoices`, "invoices.management.list", ["status", "page", "page_size"]),
      retrieve: operation("GET", `${backend}/invoices/{invoiceId}`, "invoices.management.retrieve"),
      issuances: {
        create: operation("POST", `${backend}/invoices/{invoiceId}/issuances`, "invoices.issuances.create"),
      },
      voids: {
        create: operation("POST", `${backend}/invoices/{invoiceId}/voids`, "invoices.voids.create"),
      },
    },
    commerceReports: {
      usageStatements: {
        list: operation("GET", `${backend}/commerce_reports/usage_statements`, "commerceReports.usageStatements.list", ["user_id", "period_start", "period_end", "page", "page_size"]),
      },
      paymentReconciliation: {
        retrieve: operation("GET", `${backend}/commerce_reports/payment_reconciliation`, "commerceReports.paymentReconciliation.retrieve", ["provider_code", "start_time", "end_time"]),
      },
      orderRevenue: {
        list: operation("GET", `${backend}/commerce_reports/order_revenue`, "commerceReports.orderRevenue.list", ["start_time", "end_time", "page", "page_size"]),
      },
      refunds: {
        list: operation("GET", `${backend}/commerce_reports/refunds`, "commerceReports.refunds.list", ["start_time", "end_time", "page", "page_size"]),
      },
    },
    reports: {
      commerceOverview: {
        retrieve: operation("GET", `${backend}/reports/commerce_overview`, "reports.commerceOverview.retrieve", ["period_start", "period_end"]),
      },
      sales: {
        list: operation("GET", `${backend}/reports/sales`, "reports.sales.list", ["period_start", "period_end", "currency_code"]),
      },
      paymentReconciliation: {
        list: operation("GET", `${backend}/reports/payment_reconciliation`, "reports.paymentReconciliation.list", ["provider_code", "period_start", "period_end"]),
      },
    },
    audit: {
      commerceEvents: {
        list: operation("GET", `${backend}/audit/commerce_events`, "audit.commerceEvents.list", ["actor_id", "source_type", "page", "page_size"]),
      },
    },
  },
} as const;

export const SDKWORK_COMMERCE_OPERATION_IDS = flattenOperations(SDKWORK_COMMERCE_API_ROUTES);

export const SDKWORK_COMMERCE_DOMAIN_MODELS = [
  model("shop", ["shops"], ["id", "tenant_id", "organization_id", "shop_no", "shop_name", "shop_type", "business_model", "storefront_status", "operation_status", "review_status", "data_scope", "logo_media_resource_id", "cover_media_resource_id", "default_currency_code", "default_locale", "timezone", "version", "submitted_at", "approved_at", "rejected_at", "suspended_at", "closed_at", "deleted_at", "created_at", "updated_at"]),
  model("shopApplication", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "application_no", "application_type", "review_status", "legal_entity_snapshot_json", "contact_snapshot_json", "qualification_snapshot_json", "submitted_by", "submitted_at", "reviewed_by", "reviewed_at", "review_comment", "idempotency_key", "created_at", "updated_at"]),
  model("shopVerification", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "verification_type", "verification_status", "legal_entity_name", "credential_no_hash", "credential_media_resource_id", "verification_snapshot_json", "expires_at", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopStatusEvent", ["shops", "audit"], ["id", "tenant_id", "organization_id", "shop_id", "event_no", "event_type", "from_status", "to_status", "reason_code", "reason_detail", "actor_type", "actor_id", "idempotency_key", "created_at"]),
  model("shopChannel", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "channel_code", "storefront_status", "domain_name", "path_prefix", "theme_code", "channel_config_json", "sort_order", "created_at", "updated_at"]),
  model("shopFulfillmentProfile", ["shops", "fulfillments"], ["id", "tenant_id", "organization_id", "shop_id", "fulfillment_mode", "shipping_origin_region_code", "service_level_code", "after_sales_policy_json", "service_config_json", "created_at", "updated_at"]),
  model("shopSettlementProfile", ["shops", "payments"], ["id", "tenant_id", "organization_id", "shop_id", "settlement_status", "settlement_cycle", "settlement_currency_code", "account_ref", "risk_hold_days", "settlement_config_json", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopMetricSnapshot", ["shops", "commerceReports"], ["id", "tenant_id", "organization_id", "shop_id", "snapshot_date", "gross_sales_amount", "currency_code", "paid_order_count", "refund_order_count", "fulfillment_pending_count", "settlement_pending_amount", "created_at"]),
  model("shopReadiness", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "readiness_scope", "readiness_status", "blocking_count", "warning_count", "checklist_json", "evaluated_at", "created_at", "updated_at", "version"]),
  model("shopBusinessHour", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "schedule_type", "timezone", "weekly_schedule_json", "holiday_schedule_json", "effective_from", "effective_to", "status", "version", "created_at", "updated_at"]),
  model("shopServiceArea", ["shops", "fulfillments"], ["id", "tenant_id", "organization_id", "shop_id", "area_type", "country_code", "region_code", "city_code", "area_key", "postal_code_pattern", "delivery_radius_meters", "service_status", "service_config_json", "sort_order", "created_at", "updated_at"]),
  model("shopPolicy", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "policy_type", "policy_status", "policy_version", "policy_json", "published_at", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopDepositAccount", ["shops", "payments"], ["id", "tenant_id", "organization_id", "shop_id", "deposit_status", "currency_code", "required_amount", "paid_amount", "frozen_amount", "account_ref", "due_at", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopRiskSignal", ["shops", "audit"], ["id", "tenant_id", "organization_id", "shop_id", "signal_no", "signal_type", "risk_level", "signal_status", "source_type", "source_id", "risk_score", "payload_json", "detected_at", "resolved_at", "created_at", "updated_at"]),
  model("shopCategoryBinding", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "shop_category_code", "platform_category_code", "platform_category_name", "category_path", "category_level", "category_status", "qualification_required", "qualification_snapshot_json", "review_status", "reviewed_by", "reviewed_at", "effective_from", "effective_to", "created_at", "updated_at"]),
  model("shopBrandAuthorization", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "brand_code", "brand_name", "authorization_type", "authorization_status", "brand_owner_name", "trademark_no_hash", "trademark_media_resource_id", "authorization_media_resource_id", "authorization_snapshot_json", "valid_from", "valid_to", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopQualification", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "qualification_type", "qualification_status", "subject_type", "subject_id", "credential_name", "credential_no_hash", "credential_media_resource_id", "qualification_snapshot_json", "issued_at", "expires_at", "reviewed_by", "reviewed_at", "created_at", "updated_at"]),
  model("shopCustomerService", ["shops"], ["id", "tenant_id", "organization_id", "shop_id", "service_channel", "service_status", "contact_ref", "contact_label", "service_window_json", "service_config_json", "is_default", "sort_order", "created_at", "updated_at"]),
  model("shopReturnAddress", ["shops", "fulfillments"], ["id", "tenant_id", "organization_id", "shop_id", "address_usage", "address_key", "receiver_name", "phone_hash", "country_code", "region_code", "city_code", "district_code", "address_line1", "postal_code", "is_default", "address_status", "address_snapshot_json", "created_at", "updated_at"]),
  model("shopShippingTemplate", ["shops", "fulfillments"], ["id", "tenant_id", "organization_id", "shop_id", "template_code", "template_name", "template_status", "pricing_mode", "delivery_method", "base_quantity", "base_fee_amount", "currency_code", "is_default", "region_rule_json", "free_shipping_rule_json", "created_at", "updated_at"]),
  model("productCategory", ["catalog"], ["id", "tenant_id", "organization_id", "category_no", "parent_id", "path", "level_no", "name", "status", "sort_order", "created_at", "updated_at"]),
  model("productSpu", ["catalog"], ["id", "tenant_id", "organization_id", "spu_no", "product_type", "title", "category_id", "status", "published_at", "created_at", "updated_at"]),
  model("productSpuCategory", ["catalog"], ["id", "tenant_id", "organization_id", "spu_id", "category_id", "primary_flag", "sort_order", "status", "created_at", "updated_at"]),
  model("productSku", ["catalog"], ["id", "tenant_id", "organization_id", "sku_no", "spu_id", "fulfillment_type", "status", "published_at", "created_at", "updated_at"]),
  model("productAttribute", ["catalog"], ["id", "tenant_id", "organization_id", "attribute_no", "name", "value_type", "scope", "status", "created_at", "updated_at"]),
  model("productAttributeValue", ["catalog"], ["id", "tenant_id", "organization_id", "attribute_id", "value_code", "display_value", "status", "created_at", "updated_at"]),
  model("productSkuAttribute", ["catalog"], ["id", "tenant_id", "organization_id", "sku_id", "attribute_id", "attribute_value_id", "custom_value", "created_at", "updated_at"]),
  model("productMedia", ["catalog"], ["id", "tenant_id", "organization_id", "owner_type", "owner_id", "media_type", "url", "status", "created_at", "updated_at"]),
  model("priceList", ["catalog"], ["id", "tenant_id", "organization_id", "price_list_no", "currency_code", "market_code", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("priceListItem", ["catalog"], ["id", "tenant_id", "organization_id", "price_list_id", "sku_id", "price_amount", "currency_code", "created_at", "updated_at"]),
  model("inventoryStock", ["inventory"], ["id", "tenant_id", "organization_id", "sku_id", "warehouse_id", "available_quantity", "reserved_quantity", "sold_quantity", "version", "status", "created_at", "updated_at"]),
  model("inventoryReservation", ["inventory", "checkout", "orders"], ["id", "tenant_id", "organization_id", "reservation_no", "checkout_session_id", "order_id", "sku_id", "quantity", "status", "expires_at", "idempotency_key", "created_at", "updated_at"]),
  model("inventoryMovement", ["inventory"], ["id", "tenant_id", "organization_id", "movement_no", "sku_id", "warehouse_id", "movement_type", "quantity", "business_type", "source_id", "idempotency_key", "created_at"]),
  model("cart", ["cart"], ["id", "tenant_id", "organization_id", "owner_user_id", "status", "currency_code", "version", "created_at", "updated_at"]),
  model("cartItem", ["cart"], ["id", "tenant_id", "organization_id", "cart_id", "sku_id", "quantity", "selected", "created_at", "updated_at"]),
  model("userAddress", ["addresses"], ["id", "tenant_id", "organization_id", "owner_user_id", "recipient_name", "country_code", "region_code", "city", "status", "created_at", "updated_at"]),
  model("orderAddressSnapshot", ["addresses", "orders"], ["id", "tenant_id", "organization_id", "order_id", "snapshot_version", "country_code", "region_code", "city", "captured_at", "created_at"]),
  model("checkoutSession", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_no", "owner_user_id", "source_type", "status", "currency_code", "expires_at", "idempotency_key", "request_hash", "created_at", "updated_at"]),
  model("checkoutLine", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_id", "sku_id", "quantity", "purchase_type", "fulfillment_type", "created_at", "updated_at"]),
  model("checkoutQuote", ["checkout"], ["id", "tenant_id", "organization_id", "checkout_session_id", "quote_no", "original_amount", "discount_amount", "payable_amount", "currency_code", "expires_at", "created_at"]),
  model("order", ["orders"], ["id", "tenant_id", "organization_id", "order_no", "owner_user_id", "purchase_type", "status", "currency_code", "payable_amount", "paid_amount", "refunded_amount", "payment_intent_id", "idempotency_key", "created_at", "updated_at"]),
  model("orderItem", ["orders"], ["id", "tenant_id", "organization_id", "order_id", "order_item_no", "spu_id", "sku_id", "purchase_type", "fulfillment_type", "quantity", "payable_amount", "created_at", "updated_at"]),
  model("orderAmountBreakdown", ["orders", "promotions", "refunds"], ["id", "tenant_id", "organization_id", "order_id", "order_item_id", "allocation_type", "source_type", "source_id", "amount", "currency_code", "created_at"]),
  model("orderEvent", ["orders", "audit"], ["id", "tenant_id", "organization_id", "event_no", "order_id", "event_type", "from_status", "to_status", "actor_type", "actor_id", "idempotency_key", "created_at"]),
  model("orderCancellation", ["orders"], ["id", "tenant_id", "organization_id", "cancellation_no", "order_id", "status", "reason_code", "idempotency_key", "created_at", "updated_at"]),
  model("fulfillmentOrder", ["fulfillments"], ["id", "tenant_id", "organization_id", "fulfillment_no", "order_id", "fulfillment_type", "status", "created_at", "updated_at"]),
  model("fulfillmentItem", ["fulfillments"], ["id", "tenant_id", "organization_id", "fulfillment_id", "order_item_id", "quantity", "status", "created_at", "updated_at"]),
  model("shipment", ["shipments", "fulfillments"], ["id", "tenant_id", "organization_id", "shipment_no", "fulfillment_id", "carrier_code", "tracking_no", "status", "created_at", "updated_at"]),
  model("shipmentPackage", ["shipments", "fulfillments"], ["id", "tenant_id", "organization_id", "shipment_id", "package_no", "package_type", "weight_gram", "label_ref", "status", "created_at", "updated_at"]),
  model("shipmentTrackingEvent", ["shipments"], ["id", "tenant_id", "organization_id", "shipment_id", "event_type", "event_time", "payload_json", "created_at"]),
  model("digitalDelivery", ["fulfillments"], ["id", "tenant_id", "organization_id", "delivery_no", "fulfillment_id", "asset_ref", "status", "created_at", "updated_at"]),
  model("paymentProvider", ["payments"], ["id", "tenant_id", "organization_id", "provider_code", "display_name", "provider_type", "status", "created_at", "updated_at"]),
  model("paymentProviderAccount", ["payments"], ["id", "tenant_id", "organization_id", "account_no", "provider_code", "merchant_id", "environment", "secret_ref", "webhook_secret_ref", "certificate_ref", "status", "created_at", "updated_at"]),
  model("paymentMethod", ["payments"], ["id", "tenant_id", "organization_id", "method_code", "method_type", "display_name", "status", "sort_order", "created_at", "updated_at"]),
  model("paymentChannel", ["payments"], ["id", "tenant_id", "organization_id", "channel_no", "provider_account_id", "method_id", "scene_code", "currency_code", "country_code", "status", "created_at", "updated_at"]),
  model("paymentRouteRule", ["payments"], ["id", "tenant_id", "organization_id", "rule_no", "priority", "purchase_type", "country_code", "currency_code", "client_platform", "status", "created_at", "updated_at"]),
  model("paymentIntent", ["payments", "orders"], ["id", "tenant_id", "organization_id", "payment_intent_no", "order_id", "amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("paymentAttempt", ["payments"], ["id", "tenant_id", "organization_id", "payment_attempt_no", "payment_intent_id", "provider_account_id", "channel_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("paymentWebhookEvent", ["payments", "audit"], ["id", "tenant_id", "organization_id", "provider_code", "provider_event_id", "payload_digest", "verification_status", "processing_status", "created_at", "updated_at"]),
  model("paymentReconciliationRun", ["payments", "commerceReports"], ["id", "tenant_id", "organization_id", "run_no", "provider_code", "status", "started_at", "completed_at", "created_at", "updated_at"]),
  model("paymentDispute", ["payments"], ["id", "tenant_id", "organization_id", "dispute_no", "payment_attempt_id", "status", "amount", "currency_code", "created_at", "updated_at"]),
  model("refund", ["refunds"], ["id", "tenant_id", "organization_id", "refund_no", "order_id", "payment_intent_id", "amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("refundItem", ["refunds"], ["id", "tenant_id", "organization_id", "refund_id", "order_item_id", "quantity", "amount", "currency_code", "created_at", "updated_at"]),
  model("refundAttempt", ["refunds", "payments"], ["id", "tenant_id", "organization_id", "refund_attempt_no", "refund_id", "provider_account_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("benefitDefinition", ["entitlements"], ["id", "tenant_id", "organization_id", "benefit_code", "name", "benefit_type", "unit_code", "status", "created_at", "updated_at"]),
  model("entitlementGrant", ["entitlements"], ["id", "tenant_id", "organization_id", "grant_no", "subject_type", "subject_id", "benefit_id", "source_type", "source_id", "status", "created_at", "updated_at"]),
  model("entitlementAccount", ["entitlements"], ["id", "tenant_id", "organization_id", "account_no", "subject_type", "subject_id", "benefit_id", "available_amount", "frozen_amount", "status", "created_at", "updated_at"]),
  model("entitlementLedgerEntry", ["entitlements"], ["id", "tenant_id", "organization_id", "ledger_no", "account_id", "direction", "quantity_delta", "balance_after", "source_type", "source_id", "created_at"]),
  model("membershipPlan", ["memberships"], ["id", "tenant_id", "organization_id", "plan_no", "plan_code", "name", "level_code", "status", "sort_order", "created_at", "updated_at"]),
  model("membershipPlanVersion", ["memberships"], ["id", "tenant_id", "organization_id", "plan_id", "version_no", "lifecycle_status", "published_at", "created_at", "updated_at"]),
  model("membershipPlanBenefit", ["memberships"], ["id", "tenant_id", "organization_id", "plan_id", "plan_version_id", "benefit_id", "benefit_value", "cycle_type", "status", "created_at", "updated_at"]),
  model("membershipPackageGroup", ["memberships"], ["id", "tenant_id", "organization_id", "group_no", "group_code", "name", "status", "sort_order", "created_at", "updated_at"]),
  model("membershipPackage", ["memberships", "catalog"], ["id", "tenant_id", "organization_id", "package_no", "group_id", "plan_id", "plan_version_id", "sku_id", "duration_days", "price_amount", "currency_code", "status", "created_at", "updated_at"]),
  model("membershipSubscription", ["memberships"], ["id", "tenant_id", "organization_id", "subscription_no", "subject_type", "subject_id", "plan_id", "status", "starts_at", "expires_at", "created_at", "updated_at"]),
  model("membershipPeriod", ["memberships"], ["id", "tenant_id", "organization_id", "period_no", "subscription_id", "plan_id", "starts_at", "ends_at", "status", "created_at", "updated_at"]),
  model("rechargePackage", ["recharges", "catalog"], ["id", "tenant_id", "organization_id", "package_no", "sku_id", "asset_type", "amount", "bonus_amount", "price_amount", "currency_code", "status", "created_at", "updated_at"]),
  model("rechargeOrder", ["recharges", "orders", "payments"], ["id", "tenant_id", "organization_id", "order_no", "owner_user_id", "package_id", "asset_type", "amount", "pay_amount", "currency_code", "status", "idempotency_key", "created_at", "updated_at"]),
  model("billingHistory", ["billing"], ["id", "tenant_id", "organization_id", "owner_user_id", "history_no", "history_type", "direction", "asset_type", "amount", "currency_code", "points_delta", "status", "title", "reference_no", "source_type", "source_id", "related_order_no", "payment_method", "occurred_at", "created_at", "updated_at"]),
  model("account", ["accounts", "wallet"], ["id", "tenant_id", "organization_id", "account_no", "owner_user_id", "asset_type", "currency_code", "available_amount", "frozen_amount", "version", "status", "created_at", "updated_at"]),
  model("accountHold", ["wallet"], ["id", "tenant_id", "organization_id", "hold_no", "account_id", "owner_user_id", "asset_type", "amount", "status", "expires_at", "idempotency_key", "created_at", "updated_at"]),
  model("accountLedgerEntry", ["wallet", "accounts", "recharges"], ["id", "tenant_id", "organization_id", "ledger_entry_no", "account_id", "owner_user_id", "asset_type", "direction", "amount", "balance_after", "source_type", "source_id", "idempotency_key", "created_at"]),
  model("exchangeRule", ["wallet"], ["id", "tenant_id", "organization_id", "source_asset_type", "target_asset_type", "rate_numerator", "rate_denominator", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("exchangeTransaction", ["wallet"], ["id", "tenant_id", "organization_id", "exchange_no", "owner_user_id", "source_account_id", "target_account_id", "source_amount", "target_amount", "status", "idempotency_key", "created_at", "updated_at"]),
  model("promotionOffer", ["promotions"], ["id", "tenant_id", "organization_id", "offer_no", "offer_code", "name", "offer_type", "status", "starts_at", "ends_at", "created_at", "updated_at"]),
  model("promotionOfferVersion", ["promotions"], ["id", "tenant_id", "organization_id", "offer_id", "version_no", "discount_type", "discount_value", "lifecycle_status", "created_at", "updated_at"]),
  model("promotionCouponStock", ["promotions"], ["id", "tenant_id", "organization_id", "stock_no", "offer_id", "offer_version_id", "total_quantity", "available_quantity", "status", "created_at", "updated_at"]),
  model("promotionCode", ["promotions"], ["id", "tenant_id", "organization_id", "code_no", "stock_id", "offer_id", "promotion_code", "status", "created_at", "updated_at"]),
  model("promotionUserCoupon", ["promotions"], ["id", "tenant_id", "organization_id", "coupon_no", "stock_id", "offer_id", "subject_type", "subject_id", "status", "claimed_at", "redeemed_at", "created_at", "updated_at"]),
  model("promotionCouponLedgerEntry", ["promotions", "audit"], ["id", "tenant_id", "organization_id", "ledger_no", "user_coupon_id", "stock_id", "offer_id", "direction", "quantity_delta", "balance_after", "source_type", "source_id", "created_at"]),
  model("promotionDiscountApplication", ["promotions", "orders"], ["id", "tenant_id", "organization_id", "application_no", "order_id", "user_coupon_id", "discount_amount", "currency_code", "status", "created_at", "updated_at"]),
  model("promotionDiscountAllocation", ["promotions", "orders"], ["id", "tenant_id", "organization_id", "allocation_no", "application_id", "order_id", "order_item_id", "discount_amount", "currency_code", "created_at"]),
  model("invoiceTitle", ["invoices"], ["id", "tenant_id", "organization_id", "owner_user_id", "title_type", "name", "tax_no", "status", "created_at", "updated_at"]),
  model("invoice", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_no", "owner_user_id", "order_id", "amount", "currency_code", "status", "created_at", "updated_at"]),
  model("invoiceItem", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_id", "order_item_id", "amount", "currency_code", "created_at", "updated_at"]),
  model("invoiceEvent", ["invoices", "audit"], ["id", "tenant_id", "organization_id", "invoice_id", "event_type", "from_status", "to_status", "created_at"]),
  model("invoiceProviderAttempt", ["invoices"], ["id", "tenant_id", "organization_id", "invoice_id", "provider_code", "status", "created_at", "updated_at"]),
  model("usageStatement", ["commerceReports"], ["id", "tenant_id", "organization_id", "statement_no", "owner_user_id", "period_start", "period_end", "total_credit", "total_debit", "closing_balance", "status", "created_at", "updated_at"]),
  model("idempotencyKey", ["checkout", "orders", "payments", "refunds", "wallet", "promotions", "invoices"], ["id", "tenant_id", "organization_id", "scope", "operation_id", "idempotency_key", "request_hash", "response_json", "status", "expires_at", "created_at", "updated_at"]),
  model("auditLog", ["audit"], ["id", "tenant_id", "organization_id", "audit_no", "actor_type", "actor_id", "operation_id", "source_type", "source_id", "created_at"]),
  model("outboxEvent", ["audit"], ["id", "tenant_id", "organization_id", "event_no", "aggregate_type", "aggregate_id", "event_type", "payload_json", "published_at", "created_at"]),
] as const satisfies readonly CommerceDomainModelContract[];

const APP_CURRENT_SHOP_OPERATION_RESOURCE_ORDER = [
  "applications",
  "brandAuthorizations",
  "businessHours",
  "categoryBindings",
  "channels",
  "customerServices",
  "dashboard",
  "depositAccount",
  "fulfillmentProfile",
  "inventory",
  "orders",
  "policies",
  "products",
  "readiness",
  "retrieve",
  "returnAddresses",
  "riskSignals",
  "settlementProfile",
  "settlements",
  "serviceAreas",
  "shippingTemplates",
  "statusEvents",
  "qualifications",
  "verifications",
] as const;

const BACKEND_SHOP_OPERATION_RESOURCE_ORDER = [
  "approve",
  "brandAuthorizations",
  "businessHours",
  "categoryBindings",
  "channels",
  "close",
  "create",
  "customerServices",
  "depositAccount",
  "fulfillmentProfile",
  "management",
  "policies",
  "qualifications",
  "readiness",
  "reject",
  "resume",
  "returnAddresses",
  "riskSignals",
  "settlementProfile",
  "serviceAreas",
  "shippingTemplates",
  "statusEvents",
  "submitReview",
  "suspend",
  "update",
  "verifications",
] as const;

export const SDKWORK_COMMERCE_CAPABILITIES = [
  capability("accounts", ["account", "accountLedgerEntry"], operationsForRoot("accounts")),
  capability("shops", ["shop", "shopApplication", "shopVerification", "shopStatusEvent", "shopChannel", "shopFulfillmentProfile", "shopSettlementProfile", "shopMetricSnapshot", "shopReadiness", "shopBusinessHour", "shopServiceArea", "shopPolicy", "shopDepositAccount", "shopRiskSignal", "shopCategoryBinding", "shopBrandAuthorization", "shopQualification", "shopCustomerService", "shopReturnAddress", "shopShippingTemplate"], operationsForRoot("shops")),
  capability("catalog", ["productCategory", "productSpu", "productSpuCategory", "productSku", "productAttribute", "productAttributeValue", "productSkuAttribute", "productMedia", "priceList", "priceListItem"], operationsForRoot("catalog")),
  capability("inventory", ["inventoryStock", "inventoryReservation", "inventoryMovement"], operationsForRoot("inventory")),
  capability("cart", ["cart", "cartItem"], operationsForRoot("cart")),
  capability("addresses", ["userAddress", "orderAddressSnapshot"], operationsForRoot("addresses")),
  capability("checkout", ["checkoutSession", "checkoutLine", "checkoutQuote", "inventoryReservation", "idempotencyKey"], operationsForRoot("checkout")),
  capability("orders", ["order", "orderItem", "orderAmountBreakdown", "orderEvent", "orderCancellation", "idempotencyKey"], operationsForRoot("orders")),
  capability("payments", ["paymentProvider", "paymentProviderAccount", "paymentMethod", "paymentChannel", "paymentRouteRule", "paymentIntent", "paymentAttempt", "paymentWebhookEvent", "paymentReconciliationRun", "paymentDispute", "idempotencyKey"], operationsForRoot("payments")),
  capability("refunds", ["refund", "refundItem", "refundAttempt", "idempotencyKey"], operationsForRoot("refunds")),
  capability("fulfillments", ["fulfillmentOrder", "fulfillmentItem", "digitalDelivery"], operationsForRoot("fulfillments")),
  capability("shipments", ["shipment", "shipmentPackage", "shipmentTrackingEvent"], operationsForRoot("shipments")),
  capability("entitlements", ["benefitDefinition", "entitlementGrant", "entitlementAccount", "entitlementLedgerEntry"], operationsForRoot("entitlements")),
  capability("memberships", ["membershipPlan", "membershipPlanVersion", "membershipPlanBenefit", "membershipPackageGroup", "membershipPackage", "membershipSubscription", "membershipPeriod"], operationsForRoot("memberships")),
  capability("billing", ["billingHistory"], operationsForRoot("billing")),
  capability("recharges", ["rechargePackage", "rechargeOrder", "accountLedgerEntry"], operationsForRoot("recharges")),
  capability("wallet", ["account", "accountHold", "accountLedgerEntry", "exchangeRule", "exchangeTransaction", "idempotencyKey"], operationsForRoot("wallet")),
  capability("promotions", ["promotionOffer", "promotionOfferVersion", "promotionCouponStock", "promotionCode", "promotionUserCoupon", "promotionCouponLedgerEntry", "promotionDiscountApplication", "promotionDiscountAllocation", "idempotencyKey"], operationsForRoot("promotions")),
  capability("invoices", ["invoiceTitle", "invoice", "invoiceItem", "invoiceEvent", "invoiceProviderAttempt", "idempotencyKey"], operationsForRoot("invoices")),
  capability("commerceReports", ["usageStatement", "paymentReconciliationRun"], operationsForRoot("commerceReports")),
  capability("reports", ["usageStatement", "paymentReconciliationRun"], operationsForRoot("reports")),
  capability("audit", ["auditLog", "outboxEvent", "orderEvent", "paymentWebhookEvent"], operationsForRoot("audit")),
] as const satisfies readonly CommerceCapabilityContract[];

export function isCommerceMoneyAmount(value: string): boolean {
  return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value);
}

export function isCommercePointAmount(value: string): boolean {
  return /^(0|[1-9]\d*)$/.test(value);
}

export function createCommerceLedgerPolicy(): CommerceLedgerPolicy {
  return {
    amountScale: 6,
    moneyScale: 2,
    optimisticLocking: true,
    requireIdempotencyKey: true,
    requireImmutableLedger: true,
  };
}

function operation(
  method: CommerceOperationMethod,
  path: string,
  operationId: string,
  queryParameters?: readonly string[],
  options: CommerceOperationOptions = {},
): CommerceOperationContract {
  const apiSurface = path.startsWith(`${backend}/`) ? "backend" : "app";
  const tag = operationId.split(".")[0] as CommerceSdkNamespace;
  return {
    apiSurface,
    ...(options.auditEvent ? { auditEvent: options.auditEvent } : {}),
    ...(options.bodyRequired === undefined ? {} : { bodyRequired: options.bodyRequired }),
    ...(options.idempotent === undefined ? {} : { idempotent: options.idempotent }),
    method,
    operationKey: `${apiSurface}.${operationId}`,
    operationId,
    ...(options.permission ? { permission: options.permission } : {}),
    ...(queryParameters ? { queryParameters } : {}),
    ...(options.requestSchema ? { requestSchema: options.requestSchema } : {}),
    ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
    path,
    security: "dualToken",
    tag,
  };
}

function model(
  name: CommerceDomainModelName,
  capabilities: readonly CommerceCapabilityName[],
  fields: readonly string[],
): CommerceDomainModelContract {
  return {
    capabilities,
    domain: "commerce",
    fields,
    name,
    table: SDKWORK_COMMERCE_TABLES[name],
  };
}

function capability(
  name: CommerceCapabilityName,
  models: readonly CommerceDomainModelName[],
  operations: readonly string[],
): CommerceCapabilityContract {
  return {
    domain: "commerce",
    models,
    name,
    operations,
    sdkNamespaces: [name],
  };
}

function operationsForRoot(root: CommerceCapabilityName): string[] {
  return Object.values(SDKWORK_COMMERCE_OPERATION_IDS)
    .filter((operation) => operation.operationId.split(".")[0] === root)
    .map((operation) => operation.operationKey)
    .sort(compareCommerceOperationKeys);
}

function compareCommerceOperationKeys(left: string, right: string): number {
  const leftRank = commerceOperationSortRank(left);
  const rightRank = commerceOperationSortRank(right);

  if (leftRank && rightRank && leftRank.scope === rightRank.scope && leftRank.rank !== rightRank.rank) {
    return leftRank.rank - rightRank.rank;
  }

  return left.localeCompare(right);
}

function commerceOperationSortRank(operationKey: string): { rank: number; scope: string } | undefined {
  const parts = operationKey.split(".");

  if (parts[0] === "app" && parts[1] === "shops" && parts[2] === "current" && parts[3]) {
    return {
      rank: operationResourceRank(parts[3], APP_CURRENT_SHOP_OPERATION_RESOURCE_ORDER),
      scope: "app.shops.current",
    };
  }

  if (parts[0] === "backend" && parts[1] === "shops" && parts[2]) {
    return {
      rank: operationResourceRank(parts[2], BACKEND_SHOP_OPERATION_RESOURCE_ORDER),
      scope: "backend.shops",
    };
  }

  return undefined;
}

function operationResourceRank(resource: string, orderedResources: readonly string[]): number {
  const rank = orderedResources.indexOf(resource);
  return rank === -1 ? orderedResources.length : rank;
}

function flattenOperations(value: unknown): Record<string, CommerceOperationContract> {
  const result: Record<string, CommerceOperationContract> = {};

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      const route = node as CommerceOperationContract;
      result[route.operationKey] = route;
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return result;
}
