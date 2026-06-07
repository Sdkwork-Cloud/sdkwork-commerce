import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkBackendConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { AuditApi, createAuditApi } from './api/audit';
import { CatalogApi, createCatalogApi } from './api/catalog';
import { CommerceReportsApi, createCommerceReportsApi } from './api/commerce-reports';
import { FulfillmentsApi, createFulfillmentsApi } from './api/fulfillments';
import { InventoryApi, createInventoryApi } from './api/inventory';
import { InvoicesApi, createInvoicesApi } from './api/invoices';
import { MembershipsApi, createMembershipsApi } from './api/memberships';
import { OrdersApi, createOrdersApi } from './api/orders';
import { PaymentsApi, createPaymentsApi } from './api/payments';
import { PromotionsApi, createPromotionsApi } from './api/promotions';
import { RechargesApi, createRechargesApi } from './api/recharges';
import { RefundsApi, createRefundsApi } from './api/refunds';
import { ReportsApi, createReportsApi } from './api/reports';
import { ShipmentsApi, createShipmentsApi } from './api/shipments';
import { WalletApi, createWalletApi } from './api/wallet';
import { EntitlementsApi, createEntitlementsApi } from './api/entitlements';

export class SdkworkBackendClient {
  private httpClient: HttpClient;

  public readonly audit: AuditApi;
  public readonly catalog: CatalogApi;
  public readonly commerceReports: CommerceReportsApi;
  public readonly fulfillments: FulfillmentsApi;
  public readonly inventory: InventoryApi;
  public readonly invoices: InvoicesApi;
  public readonly memberships: MembershipsApi;
  public readonly orders: OrdersApi;
  public readonly payments: PaymentsApi;
  public readonly promotions: PromotionsApi;
  public readonly recharges: RechargesApi;
  public readonly refunds: RefundsApi;
  public readonly reports: ReportsApi;
  public readonly shipments: ShipmentsApi;
  public readonly wallet: WalletApi;
  public readonly entitlements: EntitlementsApi;

  constructor(config: SdkworkBackendConfig) {
    this.httpClient = createHttpClient(config);
    this.audit = createAuditApi(this.httpClient);

    this.catalog = createCatalogApi(this.httpClient);

    this.commerceReports = createCommerceReportsApi(this.httpClient);

    this.fulfillments = createFulfillmentsApi(this.httpClient);

    this.inventory = createInventoryApi(this.httpClient);

    this.invoices = createInvoicesApi(this.httpClient);

    this.memberships = createMembershipsApi(this.httpClient);

    this.orders = createOrdersApi(this.httpClient);

    this.payments = createPaymentsApi(this.httpClient);

    this.promotions = createPromotionsApi(this.httpClient);

    this.recharges = createRechargesApi(this.httpClient);

    this.refunds = createRefundsApi(this.httpClient);

    this.reports = createReportsApi(this.httpClient);

    this.shipments = createShipmentsApi(this.httpClient);

    this.wallet = createWalletApi(this.httpClient);

    this.entitlements = createEntitlementsApi(this.httpClient);
  }
  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  get http(): HttpClient {
    return this.httpClient;
  }
}

export function createClient(config: SdkworkBackendConfig): SdkworkBackendClient {
  return new SdkworkBackendClient(config);
}

export default SdkworkBackendClient;
