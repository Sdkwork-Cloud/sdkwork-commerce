export type CommerceRequestParams = Record<string, unknown>;
export type CommerceSdkResponse<T> = Promise<T | { code?: number | string; data?: T; message?: string; msg?: string }>;
export type CommerceSdkMethod = (...args: any[]) => CommerceSdkResponse<any>;

type MethodTree = {
  readonly [key: string]: true | MethodTree;
};

type ClientFromMethodTree<TTree extends MethodTree> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? CommerceSdkMethod
    : TTree[TKey] extends MethodTree
      ? ClientFromMethodTree<TTree[TKey]>
      : never;
};

export const APP_COMMERCE_METHOD_TREE = {
  accounts: {
    current: {
      summary: { retrieve: true },
    },
  },
  addresses: {
    list: true,
    create: true,
    update: true,
    delete: true,
    defaultSelection: { create: true },
  },
  cart: {
    current: { retrieve: true },
    items: {
      create: true,
      update: true,
      delete: true,
    },
  },
  catalog: {
    attributes: { list: true },
    categories: {
      list: true,
      retrieve: true,
    },
    products: {
      list: true,
      retrieve: true,
    },
    skus: {
      retrieve: true,
      prices: { retrieve: true },
    },
    spus: {
      list: true,
      retrieve: true,
    },
  },
  checkout: {
    sessions: {
      create: true,
      retrieve: true,
      quotes: { create: true },
      orders: { create: true },
    },
  },
  orders: {
    list: true,
    create: true,
    retrieve: true,
    pay: true,
    cancel: true,
    events: { list: true },
    cancellations: { create: true },
    paymentSuccess: { retrieve: true },
    statistics: { retrieve: true },
    status: { retrieve: true },
  },
  payments: {
    methods: { list: true },
    intents: {
      create: true,
      retrieve: true,
      cancel: true,
      attempts: { create: true },
    },
    attempts: { retrieve: true },
    checkout: { retrieve: true },
    close: true,
    create: true,
    orderPayments: { list: true },
    records: {
      list: true,
      retrieve: true,
    },
    reconcile: true,
    statistics: { retrieve: true },
    status: {
      retrieve: true,
      retrieveByOutTradeNo: true,
    },
  },
  refunds: {
    create: true,
    list: true,
    retrieve: true,
  },
  fulfillments: {
    list: true,
    retrieve: true,
  },
  shipments: { retrieve: true },
  memberships: {
    benefits: { list: true },
    current: {
      retrieve: true,
      status: { retrieve: true },
    },
    plans: { list: true },
    packageGroups: {
      list: true,
      retrieve: true,
      packages: { list: true },
    },
    packages: {
      list: true,
      retrieve: true,
    },
    purchases: {
      create: true,
      renew: true,
      upgrade: true,
    },
    points: {
      balance: { retrieve: true },
      history: { list: true },
      dailyRewards: {
        create: true,
        status: { retrieve: true },
      },
    },
    privileges: {
      usage: { retrieve: true },
      speedUps: { create: true },
    },
  },
  billing: {
    history: { list: true },
  },
  recharges: {
    packages: { list: true },
    settings: { retrieve: true },
    orders: {
      create: true,
      retrieve: true,
      cancel: true,
    },
  },
  wallet: {
    overview: { retrieve: true },
    accounts: {
      list: true,
      retrieve: true,
      overview: { retrieve: true },
      points: { retrieve: true },
      tokens: { retrieve: true },
    },
    ledgerEntries: {
      list: true,
      retrieve: true,
      points: { list: true },
    },
    exchangeRate: { retrieve: true },
    exchangeRules: { list: true },
    points: {
      exchangeRules: { list: true },
    },
    tokens: { retrieve: true },
    exchanges: { create: true },
    holds: {
      create: true,
      releases: { create: true },
      settlements: { create: true },
    },
    pointExchanges: {
      create: true,
      retrieve: true,
    },
    pointTransfers: { create: true },
    requests: { retrieve: true },
    adjustments: { create: true },
    topupTransfers: { create: true },
    transactions: {
      list: true,
      retrieve: true,
    },
    transfers: { create: true },
    withdrawalTransfers: { create: true },
  },
  promotions: {
    userCoupons: {
      list: true,
      retrieve: true,
      claims: { create: true },
      wallet: {
        list: true,
        retrieve: true,
      },
    },
    offers: {
      list: true,
      retrieve: true,
    },
    codes: {
      redemptions: { create: true },
    },
    discountApplications: {
      create: true,
      settle: true,
      release: true,
      rollback: true,
      reversals: { create: true },
    },
  },
  invoices: {
    list: true,
    retrieve: true,
    create: true,
    update: true,
    submit: true,
    cancel: true,
    items: { list: true },
    mine: { list: true },
    statistics: { retrieve: true },
    submissions: { create: true },
    cancellations: { create: true },
  },
} as const satisfies MethodTree;

export const BACKEND_COMMERCE_METHOD_TREE = {
  audit: {
    commerceEvents: { list: true },
  },
  catalog: {
    attributes: {
      list: true,
      create: true,
    },
    categories: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    categoryAttributes: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    categorySeeds: {
      create: true,
    },
    priceLists: {
      list: true,
      create: true,
      update: true,
    },
    products: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    skus: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    spus: {
      list: true,
      create: true,
      update: true,
      publish: true,
      archive: true,
    },
  },
  commerceReports: {
    orderRevenue: { list: true },
    paymentReconciliation: { retrieve: true },
    refunds: { list: true },
  },
  promotions: {
    offers: {
      management: { list: true },
      create: true,
      update: true,
    },
    couponStocks: {
      list: true,
      create: true,
    },
    codes: {
      list: true,
      create: true,
      redemptions: { list: true },
    },
    userCoupons: {
      management: { list: true },
    },
    discountApplications: { list: true },
    discountAllocations: { list: true },
    couponLedgerEntries: { list: true },
    budgetLedgerEntries: { list: true },
    externalBindings: { list: true },
    events: { list: true },
  },
  fulfillments: {
    list: true,
    create: true,
    retrieve: true,
    update: true,
    shipments: {
      create: true,
      update: true,
    },
    trackingEvents: { create: true },
  },
  entitlements: {
    grants: { list: true },
    accounts: { list: true },
    ledgerEntries: { list: true },
  },
  inventory: {
    stocks: {
      list: true,
      update: true,
    },
    reservations: { list: true },
    ledgerEntries: { list: true },
  },
  invoices: {
    titles: { list: true },
    list: true,
    retrieve: true,
  },
  memberships: {
    plans: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    packages: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    packageGroups: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    members: {
      list: true,
      update: true,
    },
    entitlements: {
      list: true,
    },
  },
  orders: {
    list: true,
    retrieve: true,
    events: { list: true },
    management: {
      list: true,
      retrieve: true,
      cancel: true,
      close: true,
    },
    cancellations: { list: true },
  },
  payments: {
    providers: { list: true },
    providerAccounts: {
      list: true,
      create: true,
      update: true,
      delete: true,
      status: { update: true },
    },
    methods: { list: true },
    channels: { list: true },
    routeRules: { list: true },
    intents: { list: true },
    attempts: { list: true },
    webhookEvents: { list: true },
    reconciliationRuns: { list: true },
    runtime: {
      snapshot: { retrieve: true },
    },
  },
  recharges: {
    packages: {
      list: true,
      create: true,
      update: true,
      delete: true,
    },
    settings: {
      retrieve: true,
      update: true,
    },
    orders: { list: true },
  },
  refunds: {
    list: true,
    retrieve: true,
    approvals: { create: true },
    attempts: {
      list: true,
      create: true,
    },
    management: {
      list: true,
      retrieve: true,
    },
  },
  shipments: {
    list: true,
    retrieve: true,
    trackingEvents: { list: true },
  },
  wallet: {
    accounts: { list: true },
    ledgerEntries: { list: true },
    adjustments: { create: true },
    exchangeRules: { list: true },
  },
  reports: {
    commerceOverview: { retrieve: true },
    paymentReconciliation: { list: true },
    sales: { list: true },
  },
} as const satisfies MethodTree;

export const APP_SDK_METHOD_TREE = {
  commerce: APP_COMMERCE_METHOD_TREE,
} as const satisfies MethodTree;

export const BACKEND_SDK_METHOD_TREE = {
  commerce: BACKEND_COMMERCE_METHOD_TREE,
} as const satisfies MethodTree;

export type CommerceAppResourceClient = ClientFromMethodTree<typeof APP_COMMERCE_METHOD_TREE>;
export type CommerceBackendResourceClient = ClientFromMethodTree<typeof BACKEND_COMMERCE_METHOD_TREE>;
export type CommerceAppSdkClient = ClientFromMethodTree<typeof APP_SDK_METHOD_TREE>;
export type CommerceBackendSdkClient = ClientFromMethodTree<typeof BACKEND_SDK_METHOD_TREE>;

export const SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS = flattenRequiredMethods(APP_SDK_METHOD_TREE);
export const SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS = flattenRequiredMethods(BACKEND_SDK_METHOD_TREE);
const RETIRED_TIER_ROOT = "v" + "ip";

const APP_RETIRED_TOP_LEVEL_ROOTS = new Set([
  "account",
  "billing",
  "coupons",
  "preflight",
  "settlements",
  "users",
  RETIRED_TIER_ROOT,
]);

const APP_RETIRED_COMMERCE_NAMESPACES = new Set([
  "account",
  "coupons",
  "preflight",
  "settlements",
  "users",
  RETIRED_TIER_ROOT,
]);

const BACKEND_RETIRED_TOP_LEVEL_ROOTS = new Set([
  "billing",
  "coupons",
  "couponBatches",
  "couponCodes",
  "exchangeRules",
  "finance",
  "referrals",
  "users",
  RETIRED_TIER_ROOT,
]);

const BACKEND_RETIRED_COMMERCE_NAMESPACES = new Set([
  "billing",
  "coupons",
  "couponBatches",
  "couponCodes",
  "exchangeRules",
  "finance",
  "referrals",
  "users",
  RETIRED_TIER_ROOT,
]);

export function assertCommerceAppSdkClient(client: unknown): asserts client is CommerceAppSdkClient {
  assertNoRetiredCommerceShape(client, "app", APP_RETIRED_TOP_LEVEL_ROOTS, APP_RETIRED_COMMERCE_NAMESPACES);
  const missingMethods = findMissingMethods(getCommerceSdkSurface(client), SDKWORK_COMMERCE_APP_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(`Generated app commerce SDK client is missing commerce methods: ${missingMethods.join(", ")}`);
  }
}

export function assertCommerceBackendSdkClient(client: unknown): asserts client is CommerceBackendSdkClient {
  assertNoRetiredCommerceShape(
    client,
    "backend",
    BACKEND_RETIRED_TOP_LEVEL_ROOTS,
    BACKEND_RETIRED_COMMERCE_NAMESPACES,
  );
  const missingMethods = findMissingMethods(getCommerceSdkSurface(client), SDKWORK_COMMERCE_BACKEND_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(
      `Generated backend commerce SDK client is missing commerce methods: ${missingMethods.join(", ")}`,
    );
  }
}

export function getCommerceSdkSurface(client: unknown): string[] {
  const methods: string[] = [];

  function visit(node: unknown, path: string[]) {
    if (!node || typeof node !== "object") {
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (typeof value === "function") {
        methods.push(next.join("."));
      } else {
        visit(value, next);
      }
    }
  }

  visit(client, []);
  return methods.sort();
}

function assertNoRetiredCommerceShape(
  client: unknown,
  surface: "app" | "backend",
  retiredTopLevelRootNames: ReadonlySet<string>,
  retiredCommerceNamespaceNames: ReadonlySet<string>,
): void {
  const retiredRoots = findRetiredCommerceRoots(client, retiredTopLevelRootNames, retiredCommerceNamespaceNames);
  if (retiredRoots.length > 0) {
    throw new Error(
      `Generated ${surface} commerce SDK client exposes retired roots: ${retiredRoots.join(", ")}. Mount commerce APIs through the commerce namespace.`,
    );
  }
}

function findRetiredCommerceRoots(
  client: unknown,
  retiredTopLevelRootNames: ReadonlySet<string>,
  retiredCommerceNamespaceNames: ReadonlySet<string>,
): string[] {
  if (!client || typeof client !== "object") {
    return [];
  }

  const root = client as Record<string, unknown>;
  const retiredRoots = Object.keys(root).filter((namespace) => retiredTopLevelRootNames.has(namespace));
  const commerce = root.commerce;
  if (commerce && typeof commerce === "object") {
    for (const namespace of Object.keys(commerce)) {
      if (retiredCommerceNamespaceNames.has(namespace)) {
        retiredRoots.push(`commerce.${namespace}`);
      }
    }
  }

  return retiredRoots;
}

function findMissingMethods(surface: readonly string[], requiredMethods: readonly string[]): string[] {
  const surfaceSet = new Set(surface);
  return requiredMethods.filter((method) => !surfaceSet.has(method));
}

function flattenRequiredMethods(tree: MethodTree, path: readonly string[] = []): string[] {
  const methods: string[] = [];
  for (const [key, marker] of Object.entries(tree)) {
    const nextPath = [...path, key];
    if (marker === true) {
      methods.push(nextPath.join("."));
    } else {
      methods.push(...flattenRequiredMethods(marker, nextPath));
    }
  }
  return methods.sort();
}
