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

export type SdkworkMediaKind =
  | "archive"
  | "audio"
  | "document"
  | "image"
  | "model"
  | "other"
  | "video";

export type SdkworkMediaSource =
  | "data_url"
  | "external_url"
  | "generated"
  | "object_storage"
  | "provider_asset";

export interface SdkworkMediaChecksum {
  algorithm: "etag" | "md5" | "sha256";
  value: string;
}

export interface SdkworkMediaAccess {
  expiresAt?: string;
  visibility: "organization" | "private" | "public" | "signed" | "tenant";
}

export interface SdkworkMediaAiProvenance {
  generationTaskId?: string;
  model?: string;
  moderationStatus?: "approved" | "blocked" | "pending" | "rejected" | "unknown";
  promptId?: string;
  provider?: string;
  provenance?: "edited" | "generated" | "imported" | "uploaded";
  safetyLabels?: string[];
  seed?: string;
  sourceMediaIds?: string[];
}

export interface SdkworkMediaResource {
  access?: SdkworkMediaAccess;
  ai?: SdkworkMediaAiProvenance;
  altText?: string;
  bucketId?: string;
  checksum?: SdkworkMediaChecksum;
  durationSeconds?: number;
  fileName?: string;
  height?: number;
  id?: string;
  kind: SdkworkMediaKind;
  metadata?: Record<string, unknown>;
  mimeType?: string;
  objectBlobId?: string;
  objectKey?: string;
  objectVersion?: string;
  poster?: SdkworkMediaResource;
  publicUrl?: string;
  sizeBytes?: string;
  source: SdkworkMediaSource;
  thumbnails?: SdkworkMediaResource[];
  title?: string;
  uri?: string;
  url?: string;
  variants?: SdkworkMediaResource[];
  width?: number;
}

export function getSdkworkMediaDeliveryUrl(
  resource: Pick<SdkworkMediaResource, "publicUrl" | "url"> | null | undefined,
): string | undefined {
  return normalizeOptionalText(resource?.publicUrl) || normalizeOptionalText(resource?.url);
}

export function readSdkworkMediaResource(value: unknown): SdkworkMediaResource | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const kind = normalizeSdkworkMediaKind(record.kind);
  const source = normalizeSdkworkMediaSource(record.source);
  if (!kind || !source) {
    return undefined;
  }

  return {
    ...record,
    kind,
    source,
  } as SdkworkMediaResource;
}

export function toExternalSdkworkMediaResource(
  value: string | null | undefined,
  kind: SdkworkMediaKind,
): SdkworkMediaResource | undefined {
  const url = normalizeOptionalText(value);
  return url
    ? {
        kind,
        publicUrl: url,
        source: url.startsWith("data:") ? "data_url" : "external_url",
        url,
      }
    : undefined;
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
    const parent = node;
    node = (parent as Record<string, unknown>)[segment];
    if (typeof node === "function") {
      return node.bind(parent) as CommerceSdkMethod;
    }
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

function normalizeSdkworkMediaKind(value: unknown): SdkworkMediaKind | undefined {
  const normalized = normalizeOptionalText(value);
  if (
    normalized === "archive"
    || normalized === "audio"
    || normalized === "document"
    || normalized === "image"
    || normalized === "model"
    || normalized === "other"
    || normalized === "video"
  ) {
    return normalized;
  }

  return undefined;
}

function normalizeSdkworkMediaSource(value: unknown): SdkworkMediaSource | undefined {
  const normalized = normalizeOptionalText(value);
  if (
    normalized === "data_url"
    || normalized === "external_url"
    || normalized === "generated"
    || normalized === "object_storage"
    || normalized === "provider_asset"
  ) {
    return normalized;
  }

  return undefined;
}

function normalizeOptionalText(value: unknown): string | undefined {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || undefined;
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
