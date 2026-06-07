import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { CommerceApiResult, CommerceOperationCommand } from '../types';


export interface CommerceWalletTransactionsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  assetType?: string;
}

export class CommerceWalletTransactionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet transactions list. */
  async list(params?: CommerceWalletTransactionsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'asset_type', value: params?.assetType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/wallet/transactions`), query));
  }

/** Wallet transactions retrieve. */
  async retrieve(transactionId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/transactions/${serializePathParameter(transactionId, { name: 'transactionId', style: 'simple', explode: false })}`));
  }
}

export class CommerceWalletTokensApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet tokens retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/tokens`));
  }
}

export interface CommerceWalletPointsExchangeRulesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceWalletPointsExchangeRulesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet points exchange Rules list. */
  async list(params?: CommerceWalletPointsExchangeRulesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/wallet/points/exchanges/rules`), query));
  }
}

export class CommerceWalletPointsApi {
  private client: HttpClient;
  public readonly exchangeRules: CommerceWalletPointsExchangeRulesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.exchangeRules = new CommerceWalletPointsExchangeRulesApi(client);
  }

}

export class CommerceWalletOverviewApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet overview retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/overview`));
  }
}

export interface CommerceWalletLedgerEntriesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceWalletLedgerEntriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet ledger Entries list. */
  async list(params?: CommerceWalletLedgerEntriesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/wallet/ledger_entries`), query));
  }

/** Wallet ledger Entries retrieve. */
  async retrieve(ledgerEntryId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/ledger_entries/${serializePathParameter(ledgerEntryId, { name: 'ledgerEntryId', style: 'simple', explode: false })}`));
  }
}

export class CommerceWalletExchangeRateApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet exchange Rate retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/exchange_rate`));
  }
}

export interface CommerceWalletAccountsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  assetType?: string;
}

export class CommerceWalletAccountsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Wallet accounts list. */
  async list(params?: CommerceWalletAccountsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'asset_type', value: params?.assetType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/wallet/accounts`), query));
  }

/** Wallet accounts retrieve. */
  async retrieve(accountId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/wallet/accounts/${serializePathParameter(accountId, { name: 'accountId', style: 'simple', explode: false })}`));
  }
}

export class CommerceWalletApi {
  private client: HttpClient;
  public readonly accounts: CommerceWalletAccountsApi;
  public readonly exchangeRate: CommerceWalletExchangeRateApi;
  public readonly ledgerEntries: CommerceWalletLedgerEntriesApi;
  public readonly overview: CommerceWalletOverviewApi;
  public readonly points: CommerceWalletPointsApi;
  public readonly tokens: CommerceWalletTokensApi;
  public readonly transactions: CommerceWalletTransactionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new CommerceWalletAccountsApi(client);
    this.exchangeRate = new CommerceWalletExchangeRateApi(client);
    this.ledgerEntries = new CommerceWalletLedgerEntriesApi(client);
    this.overview = new CommerceWalletOverviewApi(client);
    this.points = new CommerceWalletPointsApi(client);
    this.tokens = new CommerceWalletTokensApi(client);
    this.transactions = new CommerceWalletTransactionsApi(client);
  }

}

export class CommerceShipmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Shipments retrieve. */
  async retrieve(shipmentId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/shipments/${serializePathParameter(shipmentId, { name: 'shipmentId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceRefundsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceRefundsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Refunds list. */
  async list(params?: CommerceRefundsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/refunds`), query));
  }

/** Refunds create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/refunds`), body, undefined, undefined, 'application/json');
  }

/** Refunds retrieve. */
  async retrieve(refundId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/refunds/${serializePathParameter(refundId, { name: 'refundId', style: 'simple', explode: false })}`));
  }
}

export class CommerceRechargesSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges settings retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/recharges/settings`));
  }
}

export interface CommerceRechargesPackagesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceRechargesPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges packages list. */
  async list(params?: CommerceRechargesPackagesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/recharges/packages`), query));
  }
}

export class CommerceRechargesOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges orders create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/recharges/orders`), body, undefined, undefined, 'application/json');
  }

/** Recharges orders retrieve. */
  async retrieve(orderId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/recharges/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }

/** Recharges orders cancel. */
  async cancel(orderId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/recharges/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/cancellations`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceRechargesApi {
  private client: HttpClient;
  public readonly orders: CommerceRechargesOrdersApi;
  public readonly packages: CommerceRechargesPackagesApi;
  public readonly settings: CommerceRechargesSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new CommerceRechargesOrdersApi(client);
    this.packages = new CommerceRechargesPackagesApi(client);
    this.settings = new CommerceRechargesSettingsApi(client);
  }

}

export class CommercePromotionsUserCouponsClaimsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotions user Coupons claims create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/promotions/user_coupon_claims`), body, undefined, undefined, 'application/json');
  }
}

export interface CommercePromotionsUserCouponsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommercePromotionsUserCouponsApi {
  private client: HttpClient;
  public readonly claims: CommercePromotionsUserCouponsClaimsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.claims = new CommercePromotionsUserCouponsClaimsApi(client);
  }


/** Promotions user Coupons list. */
  async list(params?: CommercePromotionsUserCouponsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/promotions/user_coupons`), query));
  }
}

export interface CommercePromotionsOffersListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommercePromotionsOffersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotions offers list. */
  async list(params?: CommercePromotionsOffersListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/promotions/offers`), query));
  }
}

export class CommercePromotionsCodesRedemptionsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Promotions codes redemptions create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/promotions/codes/redemptions`), body, undefined, undefined, 'application/json');
  }
}

export class CommercePromotionsCodesApi {
  private client: HttpClient;
  public readonly redemptions: CommercePromotionsCodesRedemptionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.redemptions = new CommercePromotionsCodesRedemptionsApi(client);
  }

}

export class CommercePromotionsApi {
  private client: HttpClient;
  public readonly codes: CommercePromotionsCodesApi;
  public readonly offers: CommercePromotionsOffersApi;
  public readonly userCoupons: CommercePromotionsUserCouponsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.codes = new CommercePromotionsCodesApi(client);
    this.offers = new CommercePromotionsOffersApi(client);
    this.userCoupons = new CommercePromotionsUserCouponsApi(client);
  }

}

export class CommercePaymentsStatisticsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments statistics retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/payments/statistics`));
  }
}

export interface CommercePaymentsRecordsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommercePaymentsRecordsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments records list. */
  async list(params?: CommercePaymentsRecordsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/payments/records`), query));
  }

/** Payments records retrieve. */
  async retrieve(paymentId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/payments/records/${serializePathParameter(paymentId, { name: 'paymentId', style: 'simple', explode: false })}`));
  }
}

export interface CommercePaymentsMethodsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommercePaymentsMethodsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments methods list. */
  async list(params?: CommercePaymentsMethodsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/payments/methods`), query));
  }
}

export class CommercePaymentsIntentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments intents attempts create. */
  async create(paymentIntentId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/payments/intents/${serializePathParameter(paymentIntentId, { name: 'paymentIntentId', style: 'simple', explode: false })}/attempts`), body, undefined, undefined, 'application/json');
  }
}

export class CommercePaymentsIntentsApi {
  private client: HttpClient;
  public readonly attempts: CommercePaymentsIntentsAttemptsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new CommercePaymentsIntentsAttemptsApi(client);
  }


/** Payments intents create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/payments/intents`), body, undefined, undefined, 'application/json');
  }

/** Payments intents retrieve. */
  async retrieve(paymentIntentId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/payments/intents/${serializePathParameter(paymentIntentId, { name: 'paymentIntentId', style: 'simple', explode: false })}`));
  }
}

export class CommercePaymentsAttemptsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Payments attempts retrieve. */
  async retrieve(paymentAttemptId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/payments/attempts/${serializePathParameter(paymentAttemptId, { name: 'paymentAttemptId', style: 'simple', explode: false })}`));
  }
}

export class CommercePaymentsApi {
  private client: HttpClient;
  public readonly attempts: CommercePaymentsAttemptsApi;
  public readonly intents: CommercePaymentsIntentsApi;
  public readonly methods: CommercePaymentsMethodsApi;
  public readonly records: CommercePaymentsRecordsApi;
  public readonly statistics: CommercePaymentsStatisticsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attempts = new CommercePaymentsAttemptsApi(client);
    this.intents = new CommercePaymentsIntentsApi(client);
    this.methods = new CommercePaymentsMethodsApi(client);
    this.records = new CommercePaymentsRecordsApi(client);
    this.statistics = new CommercePaymentsStatisticsApi(client);
  }


/** Payments create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/payments`), body, undefined, undefined, 'application/json');
  }

/** Payments close. */
  async close(paymentId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/payments/${serializePathParameter(paymentId, { name: 'paymentId', style: 'simple', explode: false })}/close`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceOrdersStatisticsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders statistics retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/orders/statistics`));
  }
}

export class CommerceOrdersStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders status retrieve. */
  async retrieve(orderId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/status`));
  }
}

export class CommerceOrdersPaymentSuccessApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders payment Success retrieve. */
  async retrieve(orderId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/payment_success`));
  }
}

export interface CommerceOrdersEventsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceOrdersEventsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders events list. */
  async list(orderId: string, params?: CommerceOrdersEventsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/events`), query));
  }
}

export class CommerceOrdersCancellationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Orders cancellations create. */
  async create(orderId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/cancellations`), body, undefined, undefined, 'application/json');
  }
}

export interface CommerceOrdersListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceOrdersApi {
  private client: HttpClient;
  public readonly cancellations: CommerceOrdersCancellationsApi;
  public readonly events: CommerceOrdersEventsApi;
  public readonly paymentSuccess: CommerceOrdersPaymentSuccessApi;
  public readonly status: CommerceOrdersStatusApi;
  public readonly statistics: CommerceOrdersStatisticsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.cancellations = new CommerceOrdersCancellationsApi(client);
    this.events = new CommerceOrdersEventsApi(client);
    this.paymentSuccess = new CommerceOrdersPaymentSuccessApi(client);
    this.status = new CommerceOrdersStatusApi(client);
    this.statistics = new CommerceOrdersStatisticsApi(client);
  }


/** Orders list. */
  async list(params?: CommerceOrdersListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/orders`), query));
  }

/** Orders create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/orders`), body, undefined, undefined, 'application/json');
  }

/** Orders retrieve. */
  async retrieve(orderId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}`));
  }

/** Orders cancel. */
  async cancel(orderId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/cancel`), body, undefined, undefined, 'application/json');
  }

/** Orders pay. */
  async pay(orderId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/orders/${serializePathParameter(orderId, { name: 'orderId', style: 'simple', explode: false })}/payments`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPurchasesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships purchases create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/memberships/purchases`), body, undefined, undefined, 'application/json');
  }

/** Memberships purchases renew. */
  async renew(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/memberships/purchases/renew`), body, undefined, undefined, 'application/json');
  }

/** Memberships purchases upgrade. */
  async upgrade(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/memberships/purchases/upgrade`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPrivilegesUsageApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships privileges usage retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/privileges/usage`));
  }
}

export class CommerceMembershipsPrivilegesSpeedUpsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships privileges speed Ups create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/memberships/privileges/speed_ups`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPrivilegesApi {
  private client: HttpClient;
  public readonly speedUps: CommerceMembershipsPrivilegesSpeedUpsApi;
  public readonly usage: CommerceMembershipsPrivilegesUsageApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.speedUps = new CommerceMembershipsPrivilegesSpeedUpsApi(client);
    this.usage = new CommerceMembershipsPrivilegesUsageApi(client);
  }

}

export interface CommerceMembershipsPointsHistoryListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceMembershipsPointsHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships points history list. */
  async list(params?: CommerceMembershipsPointsHistoryListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/points/history`), query));
  }
}

export class CommerceMembershipsPointsDailyRewardsStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships points daily Rewards status retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/points/daily_rewards/status`));
  }
}

export class CommerceMembershipsPointsDailyRewardsApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsPointsDailyRewardsStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsPointsDailyRewardsStatusApi(client);
  }


/** Memberships points daily Rewards create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/memberships/points/daily_rewards`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceMembershipsPointsBalanceApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships points balance retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/points/balance`));
  }
}

export class CommerceMembershipsPointsApi {
  private client: HttpClient;
  public readonly balance: CommerceMembershipsPointsBalanceApi;
  public readonly dailyRewards: CommerceMembershipsPointsDailyRewardsApi;
  public readonly history: CommerceMembershipsPointsHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.balance = new CommerceMembershipsPointsBalanceApi(client);
    this.dailyRewards = new CommerceMembershipsPointsDailyRewardsApi(client);
    this.history = new CommerceMembershipsPointsHistoryApi(client);
  }

}

export interface CommerceMembershipsPlansListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceMembershipsPlansApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships plans list. */
  async list(params?: CommerceMembershipsPlansListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/plans`), query));
  }
}

export interface CommerceMembershipsPackagesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceMembershipsPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships packages list. */
  async list(params?: CommerceMembershipsPackagesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/packages`), query));
  }

/** Memberships packages retrieve. */
  async retrieve(packageId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/packages/${serializePathParameter(packageId, { name: 'packageId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceMembershipsPackageGroupsPackagesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceMembershipsPackageGroupsPackagesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships package Groups packages list. */
  async list(packageGroupId: string, params?: CommerceMembershipsPackageGroupsPackagesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}/packages`), query));
  }
}

export interface CommerceMembershipsPackageGroupsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceMembershipsPackageGroupsApi {
  private client: HttpClient;
  public readonly packages: CommerceMembershipsPackageGroupsPackagesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.packages = new CommerceMembershipsPackageGroupsPackagesApi(client);
  }


/** Memberships package Groups list. */
  async list(params?: CommerceMembershipsPackageGroupsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/package_groups`), query));
  }

/** Memberships package Groups retrieve. */
  async retrieve(packageGroupId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/package_groups/${serializePathParameter(packageGroupId, { name: 'packageGroupId', style: 'simple', explode: false })}`));
  }
}

export class CommerceMembershipsCurrentStatusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships current status retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/current/status`));
  }
}

export class CommerceMembershipsCurrentApi {
  private client: HttpClient;
  public readonly status: CommerceMembershipsCurrentStatusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.status = new CommerceMembershipsCurrentStatusApi(client);
  }


/** Memberships current retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/memberships/current`));
  }
}

export interface CommerceMembershipsBenefitsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceMembershipsBenefitsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Memberships benefits list. */
  async list(params?: CommerceMembershipsBenefitsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/memberships/benefits`), query));
  }
}

export class CommerceMembershipsApi {
  private client: HttpClient;
  public readonly benefits: CommerceMembershipsBenefitsApi;
  public readonly current: CommerceMembershipsCurrentApi;
  public readonly packageGroups: CommerceMembershipsPackageGroupsApi;
  public readonly packages: CommerceMembershipsPackagesApi;
  public readonly plans: CommerceMembershipsPlansApi;
  public readonly points: CommerceMembershipsPointsApi;
  public readonly privileges: CommerceMembershipsPrivilegesApi;
  public readonly purchases: CommerceMembershipsPurchasesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.benefits = new CommerceMembershipsBenefitsApi(client);
    this.current = new CommerceMembershipsCurrentApi(client);
    this.packageGroups = new CommerceMembershipsPackageGroupsApi(client);
    this.packages = new CommerceMembershipsPackagesApi(client);
    this.plans = new CommerceMembershipsPlansApi(client);
    this.points = new CommerceMembershipsPointsApi(client);
    this.privileges = new CommerceMembershipsPrivilegesApi(client);
    this.purchases = new CommerceMembershipsPurchasesApi(client);
  }

}

export class CommerceInvoicesStatisticsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Invoices statistics retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/invoices/statistics`));
  }
}

export interface CommerceInvoicesMineListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceInvoicesMineApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Invoices mine list. */
  async list(params?: CommerceInvoicesMineListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/invoices/mine`), query));
  }
}

export interface CommerceInvoicesItemsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceInvoicesItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Invoices items list. */
  async list(invoiceId: string, params?: CommerceInvoicesItemsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}/items`), query));
  }
}

export interface CommerceInvoicesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceInvoicesApi {
  private client: HttpClient;
  public readonly items: CommerceInvoicesItemsApi;
  public readonly mine: CommerceInvoicesMineApi;
  public readonly statistics: CommerceInvoicesStatisticsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.items = new CommerceInvoicesItemsApi(client);
    this.mine = new CommerceInvoicesMineApi(client);
    this.statistics = new CommerceInvoicesStatisticsApi(client);
  }


/** Invoices list. */
  async list(params?: CommerceInvoicesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/invoices`), query));
  }

/** Invoices create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/invoices`), body, undefined, undefined, 'application/json');
  }

/** Invoices retrieve. */
  async retrieve(invoiceId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}`));
  }

/** Invoices update. */
  async update(invoiceId: string, body?: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.patch<CommerceApiResult>(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }

/** Invoices cancel. */
  async cancel(invoiceId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}/cancellations`), body, undefined, undefined, 'application/json');
  }

/** Invoices submit. */
  async submit(invoiceId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/invoices/${serializePathParameter(invoiceId, { name: 'invoiceId', style: 'simple', explode: false })}/submissions`), body, undefined, undefined, 'application/json');
  }
}

export interface CommerceFulfillmentsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  status?: string;
}

export class CommerceFulfillmentsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Fulfillments list. */
  async list(params?: CommerceFulfillmentsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/fulfillments`), query));
  }

/** Fulfillments retrieve. */
  async retrieve(fulfillmentId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/fulfillments/${serializePathParameter(fulfillmentId, { name: 'fulfillmentId', style: 'simple', explode: false })}`));
  }
}

export class CommerceCheckoutSessionsQuotesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Checkout sessions quotes create. */
  async create(checkoutSessionId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}/quotes`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceCheckoutSessionsOrdersApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Checkout sessions orders create. */
  async create(checkoutSessionId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}/orders`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceCheckoutSessionsApi {
  private client: HttpClient;
  public readonly orders: CommerceCheckoutSessionsOrdersApi;
  public readonly quotes: CommerceCheckoutSessionsQuotesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.orders = new CommerceCheckoutSessionsOrdersApi(client);
    this.quotes = new CommerceCheckoutSessionsQuotesApi(client);
  }


/** Checkout sessions create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/checkout/sessions`), body, undefined, undefined, 'application/json');
  }

/** Checkout sessions retrieve. */
  async retrieve(checkoutSessionId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/checkout/sessions/${serializePathParameter(checkoutSessionId, { name: 'checkoutSessionId', style: 'simple', explode: false })}`));
  }
}

export class CommerceCheckoutApi {
  private client: HttpClient;
  public readonly sessions: CommerceCheckoutSessionsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.sessions = new CommerceCheckoutSessionsApi(client);
  }

}

export interface CommerceCatalogSpusListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  categoryId?: string;
  productType?: string;
}

export class CommerceCatalogSpusApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Catalog spus list. */
  async list(params?: CommerceCatalogSpusListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'product_type', value: params?.productType, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/catalog/spus`), query));
  }

/** Catalog spus retrieve. */
  async retrieve(spuId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/catalog/spus/${serializePathParameter(spuId, { name: 'spuId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogSkusPricesRetrieveParams {
  currencyCode?: string;
  channel?: string;
}

export class CommerceCatalogSkusPricesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Catalog skus prices retrieve. */
  async retrieve(skuId: string, params?: CommerceCatalogSkusPricesRetrieveParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'currency_code', value: params?.currencyCode, style: 'form', explode: true, allowReserved: false },
      { name: 'channel', value: params?.channel, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/catalog/skus/${serializePathParameter(skuId, { name: 'skuId', style: 'simple', explode: false })}/prices`), query));
  }
}

export class CommerceCatalogSkusApi {
  private client: HttpClient;
  public readonly prices: CommerceCatalogSkusPricesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.prices = new CommerceCatalogSkusPricesApi(client);
  }


/** Catalog skus retrieve. */
  async retrieve(skuId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/catalog/skus/${serializePathParameter(skuId, { name: 'skuId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogProductsListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  categoryId?: string;
  productType?: string;
  status?: string;
}

export class CommerceCatalogProductsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Catalog products list. */
  async list(params?: CommerceCatalogProductsListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
      { name: 'product_type', value: params?.productType, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/catalog/products`), query));
  }

/** Catalog products retrieve. */
  async retrieve(productId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/catalog/products/${serializePathParameter(productId, { name: 'productId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogCategoriesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  parentId?: string;
  status?: string;
}

export class CommerceCatalogCategoriesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Catalog categories list. */
  async list(params?: CommerceCatalogCategoriesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'parent_id', value: params?.parentId, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/catalog/categories`), query));
  }

/** Catalog categories retrieve. */
  async retrieve(categoryId: string): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/catalog/categories/${serializePathParameter(categoryId, { name: 'categoryId', style: 'simple', explode: false })}`));
  }
}

export interface CommerceCatalogAttributesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  categoryId?: string;
}

export class CommerceCatalogAttributesApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Catalog attributes list. */
  async list(params?: CommerceCatalogAttributesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'category_id', value: params?.categoryId, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/catalog/attributes`), query));
  }
}

export class CommerceCatalogApi {
  private client: HttpClient;
  public readonly attributes: CommerceCatalogAttributesApi;
  public readonly categories: CommerceCatalogCategoriesApi;
  public readonly products: CommerceCatalogProductsApi;
  public readonly skus: CommerceCatalogSkusApi;
  public readonly spus: CommerceCatalogSpusApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.attributes = new CommerceCatalogAttributesApi(client);
    this.categories = new CommerceCatalogCategoriesApi(client);
    this.products = new CommerceCatalogProductsApi(client);
    this.skus = new CommerceCatalogSkusApi(client);
    this.spus = new CommerceCatalogSpusApi(client);
  }

}

export class CommerceCartItemsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Cart items create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/cart/items`), body, undefined, undefined, 'application/json');
  }

/** Cart items delete. */
  async delete(cartItemId: string): Promise<CommerceApiResult> {
    return this.client.delete<CommerceApiResult>(appApiPath(`/cart/items/${serializePathParameter(cartItemId, { name: 'cartItemId', style: 'simple', explode: false })}`));
  }

/** Cart items update. */
  async update(cartItemId: string, body?: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.patch<CommerceApiResult>(appApiPath(`/cart/items/${serializePathParameter(cartItemId, { name: 'cartItemId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceCartCurrentApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Cart current retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/cart/current`));
  }
}

export class CommerceCartApi {
  private client: HttpClient;
  public readonly current: CommerceCartCurrentApi;
  public readonly items: CommerceCartItemsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new CommerceCartCurrentApi(client);
    this.items = new CommerceCartItemsApi(client);
  }

}

export interface CommerceBillingHistoryListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
  type_?: string;
  status?: string;
}

export class CommerceBillingHistoryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Billing history list. */
  async list(params?: CommerceBillingHistoryListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
      { name: 'type', value: params?.type_, style: 'form', explode: true, allowReserved: false },
      { name: 'status', value: params?.status, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/billing/history`), query));
  }
}

export class CommerceBillingApi {
  private client: HttpClient;
  public readonly history: CommerceBillingHistoryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.history = new CommerceBillingHistoryApi(client);
  }

}

export class CommerceAddressesDefaultSelectionApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Addresses default Selection create. */
  async create(addressId: string, body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}/default_selection`), body, undefined, undefined, 'application/json');
  }
}

export interface CommerceAddressesListParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
  sort?: string;
  q?: string;
}

export class CommerceAddressesApi {
  private client: HttpClient;
  public readonly defaultSelection: CommerceAddressesDefaultSelectionApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.defaultSelection = new CommerceAddressesDefaultSelectionApi(client);
  }


/** Addresses list. */
  async list(params?: CommerceAddressesListParams): Promise<CommerceApiResult> {
    const query = buildQueryString([
      { name: 'page', value: params?.page, style: 'form', explode: true, allowReserved: false },
      { name: 'page_size', value: params?.pageSize, style: 'form', explode: true, allowReserved: false },
      { name: 'cursor', value: params?.cursor, style: 'form', explode: true, allowReserved: false },
      { name: 'sort', value: params?.sort, style: 'form', explode: true, allowReserved: false },
      { name: 'q', value: params?.q, style: 'form', explode: true, allowReserved: false },
    ]);
    return this.client.get<CommerceApiResult>(appendQueryString(appApiPath(`/addresses`), query));
  }

/** Addresses create. */
  async create(body: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.post<CommerceApiResult>(appApiPath(`/addresses`), body, undefined, undefined, 'application/json');
  }

/** Addresses delete. */
  async delete(addressId: string): Promise<CommerceApiResult> {
    return this.client.delete<CommerceApiResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}`));
  }

/** Addresses update. */
  async update(addressId: string, body?: CommerceOperationCommand): Promise<CommerceApiResult> {
    return this.client.patch<CommerceApiResult>(appApiPath(`/addresses/${serializePathParameter(addressId, { name: 'addressId', style: 'simple', explode: false })}`), body, undefined, undefined, 'application/json');
  }
}

export class CommerceAccountsCurrentSummaryApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Accounts current summary retrieve. */
  async retrieve(): Promise<CommerceApiResult> {
    return this.client.get<CommerceApiResult>(appApiPath(`/accounts/current/summary`));
  }
}

export class CommerceAccountsCurrentApi {
  private client: HttpClient;
  public readonly summary: CommerceAccountsCurrentSummaryApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.summary = new CommerceAccountsCurrentSummaryApi(client);
  }

}

export class CommerceAccountsApi {
  private client: HttpClient;
  public readonly current: CommerceAccountsCurrentApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.current = new CommerceAccountsCurrentApi(client);
  }

}

export class CommerceApi {
  private client: HttpClient;
  public readonly accounts: CommerceAccountsApi;
  public readonly addresses: CommerceAddressesApi;
  public readonly billing: CommerceBillingApi;
  public readonly cart: CommerceCartApi;
  public readonly catalog: CommerceCatalogApi;
  public readonly checkout: CommerceCheckoutApi;
  public readonly fulfillments: CommerceFulfillmentsApi;
  public readonly invoices: CommerceInvoicesApi;
  public readonly memberships: CommerceMembershipsApi;
  public readonly orders: CommerceOrdersApi;
  public readonly payments: CommercePaymentsApi;
  public readonly promotions: CommercePromotionsApi;
  public readonly recharges: CommerceRechargesApi;
  public readonly refunds: CommerceRefundsApi;
  public readonly shipments: CommerceShipmentsApi;
  public readonly wallet: CommerceWalletApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.accounts = new CommerceAccountsApi(client);
    this.addresses = new CommerceAddressesApi(client);
    this.billing = new CommerceBillingApi(client);
    this.cart = new CommerceCartApi(client);
    this.catalog = new CommerceCatalogApi(client);
    this.checkout = new CommerceCheckoutApi(client);
    this.fulfillments = new CommerceFulfillmentsApi(client);
    this.invoices = new CommerceInvoicesApi(client);
    this.memberships = new CommerceMembershipsApi(client);
    this.orders = new CommerceOrdersApi(client);
    this.payments = new CommercePaymentsApi(client);
    this.promotions = new CommercePromotionsApi(client);
    this.recharges = new CommerceRechargesApi(client);
    this.refunds = new CommerceRefundsApi(client);
    this.shipments = new CommerceShipmentsApi(client);
    this.wallet = new CommerceWalletApi(client);
  }

}

export function createCommerceApi(client: HttpClient): CommerceApi {
  return new CommerceApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

interface PathParameterSpec {
  name: string;
  style: string;
  explode: boolean;
}

function serializePathParameter(value: unknown, spec: PathParameterSpec): string {
  if (value === undefined || value === null) {
    return '';
  }

  const style = spec.style || 'simple';
  if (Array.isArray(value)) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (typeof value === 'object') {
    return serializePathObject(spec.name, value as Record<string, unknown>, style, spec.explode);
  }
  return pathPrefix(spec.name, style, false) + encodePathValue(serializePathPrimitive(value));
}

function serializePathArray(name: string, values: unknown[], style: string, explode: boolean): string {
  const serialized = values
    .filter((item) => item !== undefined && item !== null)
    .map((item) => encodePathValue(serializePathPrimitive(item)));
  if (serialized.length === 0) {
    return pathPrefix(name, style, false);
  }
  if (style === 'matrix') {
    return explode
      ? serialized.map((item) => `;${name}=${item}`).join('')
      : `;${name}=${serialized.join(',')}`;
  }
  return pathPrefix(name, style, false) + serialized.join(explode ? '.' : ',');
}

function serializePathObject(name: string, value: Record<string, unknown>, style: string, explode: boolean): string {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return pathPrefix(name, style, true);
  }
  if (style === 'matrix') {
    return explode
      ? entries.map(([key, entryValue]) => `;${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join('')
      : `;${name}=${entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',')}`;
  }
  const serialized = explode
    ? entries.map(([key, entryValue]) => `${encodePathValue(key)}=${encodePathValue(serializePathPrimitive(entryValue))}`).join(style === 'label' ? '.' : ',')
    : entries.flatMap(([key, entryValue]) => [encodePathValue(key), encodePathValue(serializePathPrimitive(entryValue))]).join(',');
  return pathPrefix(name, style, true) + serialized;
}

function pathPrefix(name: string, style: string, _objectValue: boolean): string {
  if (style === 'label') return '.';
  if (style === 'matrix') return `;${name}`;
  return '';
}

function encodePathValue(value: string): string {
  return encodeURIComponent(value);
}

function serializePathPrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
interface QueryParameterSpec {
  name: string;
  value: unknown;
  style: string;
  explode: boolean;
  allowReserved: boolean;
  contentType?: string;
}

function buildQueryString(parameters: QueryParameterSpec[]): string {
  const pairs: string[] = [];
  for (const parameter of parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

function appendSerializedParameter(pairs: string[], parameter: QueryParameterSpec): void {
  if (parameter.value === undefined || parameter.value === null) {
    return;
  }

  if (parameter.contentType) {
    pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(JSON.stringify(parameter.value), parameter.allowReserved)}`);
    return;
  }

  const style = parameter.style || 'form';
  if (style === 'deepObject') {
    appendDeepObjectParameter(pairs, parameter.name, parameter.value, parameter.allowReserved);
    return;
  }

  if (Array.isArray(parameter.value)) {
    appendArrayParameter(pairs, parameter.name, parameter.value, style, parameter.explode, parameter.allowReserved);
    return;
  }

  if (typeof parameter.value === 'object') {
    appendObjectParameter(pairs, parameter.name, parameter.value as Record<string, unknown>, style, parameter.explode, parameter.allowReserved);
    return;
  }

  pairs.push(`${encodeQueryComponent(parameter.name)}=${encodeQueryValue(serializePrimitive(parameter.value), parameter.allowReserved)}`);
}

function appendArrayParameter(
  pairs: string[],
  name: string,
  value: unknown[],
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const values = value
    .filter((item) => item !== undefined && item !== null)
    .map((item) => serializePrimitive(item));
  if (values.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const item of values) {
      pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(item, allowReserved)}`);
    }
    return;
  }

  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(values.join(','), allowReserved)}`);
}

function appendObjectParameter(
  pairs: string[],
  name: string,
  value: Record<string, unknown>,
  style: string,
  explode: boolean,
  allowReserved: boolean,
): void {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null);
  if (entries.length === 0) {
    return;
  }

  if (style === 'form' && explode) {
    for (const [key, entryValue] of entries) {
      pairs.push(`${encodeQueryComponent(key)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
    }
    return;
  }

  const serialized = entries.flatMap(([key, entryValue]) => [key, serializePrimitive(entryValue)]).join(',');
  pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serialized, allowReserved)}`);
}

function appendDeepObjectParameter(
  pairs: string[],
  name: string,
  value: unknown,
  allowReserved: boolean,
): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    pairs.push(`${encodeQueryComponent(name)}=${encodeQueryValue(serializePrimitive(value), allowReserved)}`);
    return;
  }

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    if (entryValue === undefined || entryValue === null) {
      continue;
    }
    pairs.push(`${encodeQueryComponent(`${name}[${key}]`)}=${encodeQueryValue(serializePrimitive(entryValue), allowReserved)}`);
  }
}

function serializePrimitive(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function encodeQueryComponent(value: string): string {
  return encodeURIComponent(value);
}

function encodeQueryValue(value: string, allowReserved: boolean): string {
  const encoded = encodeURIComponent(value);
  if (!allowReserved) {
    return encoded;
  }
  return encoded.replace(/%3A/gi, ':')
    .replace(/%2F/gi, '/')
    .replace(/%3F/gi, '?')
    .replace(/%23/gi, '#')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
    .replace(/%40/gi, '@')
    .replace(/%21/gi, '!')
    .replace(/%24/gi, '$')
    .replace(/%26/gi, '&')
    .replace(/%27/gi, "'")
    .replace(/%28/gi, '(')
    .replace(/%29/gi, ')')
    .replace(/%2A/gi, '*')
    .replace(/%2B/gi, '+')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%3D/gi, '=');
}
