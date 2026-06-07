import { HttpClient, createHttpClient } from './http/client';
import type { SdkworkAppConfig } from './types/common';
import type { AuthTokenManager } from '@sdkwork/sdk-common';

import { CommerceApi, createCommerceApi } from './api/commerce';
import { PaymentsApi, createPaymentsApi } from './api/payments';
import { WalletApi, createWalletApi } from './api/wallet';
import { PromotionsApi, createPromotionsApi } from './api/promotions';

export class SdkworkAppClient {
  private httpClient: HttpClient;

  public readonly commerce: CommerceApi;
  public readonly payments: PaymentsApi;
  public readonly wallet: WalletApi;
  public readonly promotions: PromotionsApi;

  constructor(config: SdkworkAppConfig) {
    this.httpClient = createHttpClient(config);
    this.commerce = createCommerceApi(this.httpClient);

    this.payments = createPaymentsApi(this.httpClient);

    this.wallet = createWalletApi(this.httpClient);

    this.promotions = createPromotionsApi(this.httpClient);
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

export function createClient(config: SdkworkAppConfig): SdkworkAppClient {
  return new SdkworkAppClient(config);
}

export default SdkworkAppClient;
