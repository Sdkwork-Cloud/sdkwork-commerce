import {
  APP_COMMERCE_METHOD_TREE,
  BACKEND_COMMERCE_METHOD_TREE,
  type CommerceAppSdkClient,
  type CommerceBackendSdkClient,
  type CommerceRequestParams,
  type CommerceSdkMethod,
} from "@sdkwork/commerce-sdk-ports";

type SdkworkCommerceServiceMethod = (...args: Parameters<CommerceSdkMethod>) => Promise<unknown>;

export interface CreateSdkworkCommerceServiceInput {
  appClient: CommerceAppSdkClient;
  backendClient?: CommerceBackendSdkClient;
}

export type SdkworkCommerceServiceProvider = () => SdkworkCommerceService;

let sdkworkCommerceServiceProvider: SdkworkCommerceServiceProvider | null = null;

export interface SdkworkCommerceSessionTokens {
  accessToken?: string;
  authToken?: string;
  refreshToken?: string;
}

export type SdkworkCommerceSessionTokenProvider = () => SdkworkCommerceSessionTokens;

let sdkworkCommerceSessionTokenProvider: SdkworkCommerceSessionTokenProvider = () => ({});

type ServiceTemplate = {
  readonly [key: string]: true | ServiceTemplate;
};

type ServiceFromTemplate<TTree extends ServiceTemplate> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? SdkworkCommerceServiceMethod
    : TTree[TKey] extends ServiceTemplate
      ? ServiceFromTemplate<TTree[TKey]>
      : never;
};

export type SdkworkCommerceAppService = ServiceFromTemplate<typeof APP_COMMERCE_METHOD_TREE>;
export type SdkworkCommerceAdminService = ServiceFromTemplate<typeof BACKEND_COMMERCE_METHOD_TREE>;

export type SdkworkCommerceService = SdkworkCommerceAppService & {
  admin: SdkworkCommerceAdminService;
};

export interface SdkworkCommerceResponseEnvelope<T> {
  code?: number | string;
  data?: T;
  message?: string;
  msg?: string;
}

export function configureSdkworkCommerceServiceProvider(provider: SdkworkCommerceServiceProvider | null): void {
  sdkworkCommerceServiceProvider = provider;
}

export function configureSdkworkCommerceSessionTokenProvider(
  provider: SdkworkCommerceSessionTokenProvider | null,
): void {
  sdkworkCommerceSessionTokenProvider = provider ?? (() => ({}));
}

export function getSdkworkCommerceService(): SdkworkCommerceService {
  if (!sdkworkCommerceServiceProvider) {
    throw new Error(
      "SDKWork commerce service provider is not configured. Pass commerceService to the feature service or call configureSdkworkCommerceServiceProvider().",
    );
  }

  return sdkworkCommerceServiceProvider();
}

export function getSdkworkCommerceSessionTokens(): SdkworkCommerceSessionTokens {
  const tokens = sdkworkCommerceSessionTokenProvider();
  return {
    accessToken: normalizeSessionToken(tokens.accessToken),
    authToken: normalizeSessionToken(tokens.authToken),
    refreshToken: normalizeSessionToken(tokens.refreshToken),
  };
}

export function hasSdkworkCommerceSession(): boolean {
  const tokens = getSdkworkCommerceSessionTokens();
  return Boolean(normalizeSessionToken(tokens.authToken) || normalizeSessionToken(tokens.accessToken));
}

export function requireSdkworkCommerceSession(message = "Authentication required"): void {
  if (!hasSdkworkCommerceSession()) {
    throw new Error(message);
  }
}

export function createSdkworkCommerceService(input: CreateSdkworkCommerceServiceInput): SdkworkCommerceService {
  const appCommerce = input.appClient.commerce;
  const backendCommerce = input.backendClient?.commerce;
  const appService = buildServiceTree<SdkworkCommerceAppService>(APP_COMMERCE_METHOD_TREE, appCommerce, ["commerce"]);
  const adminService = buildServiceTree<SdkworkCommerceAdminService>(
    BACKEND_COMMERCE_METHOD_TREE,
    backendCommerce,
    ["commerce"],
  );

  return {
    ...appService,
    admin: adminService,
  };
}

export function unwrapSdkworkCommerceResponse<T>(value: unknown, fallbackMessage = "Request failed."): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }

  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }

  const envelope = value as SdkworkCommerceResponseEnvelope<T>;
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }

  return (envelope.data ?? null) as T;
}

export function toSdkworkCommerceOptionalString(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : String(value ?? "").trim();
  return normalized || undefined;
}

export function toNullableSdkworkCommerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function toSdkworkCommerceNumber(value: unknown, fallback = 0): number {
  return toNullableSdkworkCommerceNumber(value) ?? fallback;
}

export type SdkworkCommerceMutationStatus = "completed" | "failed" | "pending";

export function toSdkworkCommerceMutationStatus(status: unknown): SdkworkCommerceMutationStatus {
  const normalized = String(status ?? "").trim().toUpperCase();
  if (normalized === "SUCCESS" || normalized === "COMPLETED" || normalized === "PAID") {
    return "completed";
  }

  if (normalized === "FAILED" || normalized === "REJECTED") {
    return "failed";
  }

  return "pending";
}

export function formatSdkworkCommercePoints(value: number, language = "en-US"): string {
  return new Intl.NumberFormat(language).format(value);
}

export function formatSdkworkCommerceCurrencyCny(value: number | null | undefined, language = "en-US"): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "--";
  }

  return new Intl.NumberFormat(language, {
    currency: "CNY",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function formatSdkworkCommercePointsRate(points: number, language = "en-US"): string {
  return language === "zh-CN"
    ? `${formatSdkworkCommercePoints(points, language)} \u79ef\u5206 / 1 \u5143`
    : `${formatSdkworkCommercePoints(points, language)} pts / CNY 1`;
}

export function formatSdkworkCommercePointsDelta(value: number, language = "en-US"): string {
  const formatted = formatSdkworkCommercePoints(Math.abs(value), language);
  if (value > 0) {
    return `+${formatted}`;
  }
  if (value < 0) {
    return `-${formatted}`;
  }
  return "0";
}

function buildServiceTree<TService>(
  template: ServiceTemplate,
  client: unknown,
  missingPathPrefix: readonly string[],
  servicePath: readonly string[] = [],
): TService {
  const service: Record<string, unknown> = {};

  for (const [key, marker] of Object.entries(template)) {
    const nextServicePath = [...servicePath, key];
    if (marker === true) {
      const missingPath = [...missingPathPrefix, ...nextServicePath].join(".");
      service[key] = (...args: Parameters<CommerceSdkMethod>) =>
        callCommerce(readMethod(client, nextServicePath), missingPath, ...args);
    } else {
      service[key] = buildServiceTree<Record<string, unknown>>(
        marker,
        client,
        missingPathPrefix,
        nextServicePath,
      );
    }
  }

  return service as TService;
}

function readMethod(root: unknown, path: readonly string[]): CommerceSdkMethod | undefined {
  let node: unknown = root;
  for (const segment of path) {
    if (!node || typeof node !== "object") {
      return undefined;
    }
    node = (node as Record<string, unknown>)[segment];
  }

  return typeof node === "function" ? (node as CommerceSdkMethod) : undefined;
}

async function callCommerce(
  method: CommerceSdkMethod | undefined,
  name: string,
  ...args: Parameters<CommerceSdkMethod>
): Promise<unknown> {
  if (!method) {
    throw new Error(`Missing SDKWork commerce SDK resource: ${name}`);
  }

  return unwrapSdkworkCommerceResponse(await method(...args), `${name} failed`);
}

function normalizeSessionToken(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }

  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}

export type {
  CommerceAppSdkClient,
  CommerceBackendSdkClient,
  CommerceRequestParams as SdkworkCommerceRequestParams,
};
