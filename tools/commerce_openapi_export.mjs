#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
]);
const SDK_OWNER = "sdkwork-commerce";
const SDK_AUTHORITIES = {
  open: "sdkwork-commerce.open",
  app: "sdkwork-commerce.app",
  backend: "sdkwork-commerce.backend",
};
const DEFAULT_APPBASE_ROOT =
  "D:\\javasource\\spring-ai-plus\\spring-ai-plus-business\\apps\\sdkwork-appbase";
const COMMERCE_SCHEMA_RENAMES = new Map([
  ["AppbaseApiResult", "CommerceApiResult"],
  ["AppbaseOperationCommand", "CommerceOperationCommand"],
]);
const COMMERCE_TAGS = new Set([
  "audit",
  "billing",
  "cart",
  "catalog",
  "checkout",
  "commerce",
  "commerceReports",
  "fulfillments",
  "inventory",
  "invoices",
  "memberships",
  "orders",
  "payments",
  "promotions",
  "recharges",
  "refunds",
  "reports",
  "shipments",
  "wallet",
]);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const generatedOpenapiDir = path.join(workspaceRoot, "generated", "openapi");
const defaultOpenOpenapiPath = path.join(
  generatedOpenapiDir,
  "commerce-open-api.openapi.json",
);
const defaultAppOpenapiPath = path.join(
  generatedOpenapiDir,
  "commerce-app-api.openapi.json",
);
const defaultBackendOpenapiPath = path.join(
  generatedOpenapiDir,
  "commerce-backend-api.openapi.json",
);
const defaultAppbaseAppOpenapiPath = path.join(
  DEFAULT_APPBASE_ROOT,
  "sdks",
  "sdkwork-appbase-app-sdk",
  "openapi",
  "sdkwork-appbase-app-api.openapi.yaml",
);
const defaultAppbaseBackendOpenapiPath = path.join(
  DEFAULT_APPBASE_ROOT,
  "sdks",
  "sdkwork-appbase-backend-sdk",
  "openapi",
  "sdkwork-appbase-backend-api.openapi.yaml",
);

function fail(message) {
  process.stderr.write(`[commerce_openapi_export] ${message}\n`);
  process.exit(1);
}

function resolveWorkspacePath(inputPath) {
  if (!inputPath) {
    fail("path argument cannot be empty");
  }
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(workspaceRoot, inputPath);
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    fail(`missing OpenAPI file: ${filePath}`);
  }
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`invalid JSON OpenAPI ${filePath}: ${error.message}`);
  }
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function operationEntries(document) {
  const entries = [];
  for (const [pathKey, pathItem] of Object.entries(document.paths || {})) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const [methodName, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(methodName.toLowerCase())) {
        continue;
      }
      entries.push({ pathKey, methodName: methodName.toLowerCase(), operation });
    }
  }
  return entries;
}

function isCommerceOperation(operation) {
  if (!operation || typeof operation !== "object") {
    return false;
  }
  if (operation["x-sdkwork-domain"] === "commerce") {
    return true;
  }
  return Array.isArray(operation.tags)
    && operation.tags.some((tag) => COMMERCE_TAGS.has(String(tag || "")));
}

function renameSchemaRefs(value) {
  if (Array.isArray(value)) {
    return value.map(renameSchemaRefs);
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string") {
      return value
        .replaceAll("AppbaseApiResult", "CommerceApiResult")
        .replaceAll("AppbaseOperationCommand", "CommerceOperationCommand")
        .replaceAll("appbase Rust module", "commerce Rust module")
        .replaceAll("Appbase", "Commerce")
        .replaceAll("appbase", "commerce");
    }
    return value;
  }

  const next = {};
  for (const [key, child] of Object.entries(value)) {
    let nextKey = key;
    if (key === "$ref" && typeof child === "string") {
      next[nextKey] = child.replace(
        /#\/components\/schemas\/([^/]+)/g,
        (full, schemaName) => {
          const replacement = COMMERCE_SCHEMA_RENAMES.get(schemaName);
          return replacement ? `#/components/schemas/${replacement}` : full;
        },
      );
      continue;
    }
    if (COMMERCE_SCHEMA_RENAMES.has(key)) {
      nextKey = COMMERCE_SCHEMA_RENAMES.get(key);
    }
    next[nextKey] = renameSchemaRefs(child);
  }
  return next;
}

function normalizeErrorResponseContent(document) {
  for (const { operation } of operationEntries(document)) {
    for (const [statusCode, response] of Object.entries(operation.responses || {})) {
      const numericStatus = Number(statusCode);
      if (!Number.isFinite(numericStatus) || numericStatus < 400) {
        continue;
      }
      if (!response || typeof response !== "object") {
        continue;
      }
      const content =
        response.content && typeof response.content === "object" ? response.content : {};
      if (content["application/problem+json"]) {
        continue;
      }
      response.content = {
        "application/problem+json": content["application/json"] ?? {
          schema: { $ref: "#/components/schemas/ProblemDetail" },
        },
        ...content,
      };
    }
  }
}

function normalizeOperationTags(document) {
  const usedTags = new Set();
  for (const { operation } of operationEntries(document)) {
    const tags = Array.isArray(operation.tags) ? operation.tags : [];
    const normalizedTags = tags.map((tag) => normalizeTagName(tag));
    operation.tags = normalizedTags.length > 0 ? [normalizedTags[0]] : ["commerce"];
    usedTags.add(operation.tags[0]);
  }
  document.tags = Array.from(usedTags)
    .sort()
    .map((name) => ({
      name,
      description: `${toTitle(name)} API resources.`,
      "x-sdk-nested-resource-surface": true,
    }));
}

function normalizeTagName(tagName) {
  const raw = String(tagName || "").trim();
  if (!raw) {
    return "commerce";
  }
  return raw
    .replace(/[^A-Za-z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^./, (char) => char.toLowerCase());
}

function extractCommerceOnlyDocument(sourceDocument, options) {
  const source = cloneJson(sourceDocument);
  const paths = {};
  for (const [pathKey, pathItem] of Object.entries(source.paths || {})) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    const nextPathItem = {};
    for (const [methodName, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(methodName.toLowerCase())) {
        continue;
      }
      if (!isCommerceOperation(operation)) {
        continue;
      }
      nextPathItem[methodName.toLowerCase()] = operation;
    }
    if (Object.keys(nextPathItem).length > 0) {
      paths[pathKey] = nextPathItem;
    }
  }

  const document = {
    ...source,
    info: {
      ...(source.info || {}),
      title: options.title,
      version: options.version,
      description: options.description,
      "x-sdkwork-owner": SDK_OWNER,
      "x-sdkwork-api-authority": options.authority,
      "x-sdkwork-sdk-family": options.sdkFamily,
      "x-sdkwork-audience": options.audience,
    },
    servers: [
      {
        url: options.serverUrl,
        description: "Local sdkwork-commerce runtime",
      },
    ],
    paths,
  };

  delete document["x-sdkwork-materialized-from"];
  return normalizeOwnerOnlyDocument(document, options);
}

function normalizeOwnerOnlyDocument(inputDocument, options) {
  const document = renameSchemaRefs(cloneJson(inputDocument));
  if (!document.openapi || !String(document.openapi).startsWith("3.1")) {
    document.openapi = "3.1.2";
  }
  document.info = {
    ...(document.info || {}),
    title: options.title,
    version: options.version,
    description: options.description,
    "x-sdkwork-owner": SDK_OWNER,
    "x-sdkwork-api-authority": options.authority,
    "x-sdkwork-sdk-family": options.sdkFamily,
    "x-sdkwork-audience": options.audience,
  };
  document.servers = [
    {
      url: options.serverUrl,
      description: "Local sdkwork-commerce runtime",
    },
  ];
  document.paths = document.paths || {};
  document.components = document.components || {};
  document.components.securitySchemes = document.components.securitySchemes || {};
  document.components.schemas = document.components.schemas || {};
  normalizeOperationTags(document);
  normalizeErrorResponseContent(document);
  document["x-sdkwork-owner"] = SDK_OWNER;
  document["x-sdkwork-api-authority"] = options.authority;
  document["x-sdkwork-domain"] = "commerce";
  document["x-sdkwork-standard-profile"] = options.standardProfile;

  for (const { operation } of operationEntries(document)) {
    operation["x-sdkwork-owner"] = SDK_OWNER;
    operation["x-sdkwork-api-authority"] = options.authority;
    operation["x-sdkwork-domain"] = "commerce";
  }

  return document;
}

function emptyOpenDocument() {
  return normalizeOwnerOnlyDocument(
    {
      openapi: "3.1.2",
      paths: {},
      components: {
        securitySchemes: {},
        schemas: {
          CommerceApiResult: {
            type: "object",
            additionalProperties: false,
            required: ["code", "message", "requestId", "data"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              requestId: { type: "string", format: "uuid" },
              data: { type: "object", additionalProperties: true },
            },
          },
          CommerceOperationCommand: {
            type: "object",
            additionalProperties: true,
          },
          ProblemDetail: {
            type: "object",
            additionalProperties: true,
            required: ["type", "title", "status"],
            properties: {
              type: { type: "string", format: "uri-reference" },
              title: { type: "string" },
              status: { type: "integer", minimum: 100, maximum: 599 },
              detail: { type: "string" },
              instance: { type: "string" },
              code: { type: "string" },
              traceId: { type: "string" },
              requestId: { type: "string", format: "uuid" },
              errors: {
                type: "array",
                items: { $ref: "#/components/schemas/FieldError" },
              },
            },
          },
          FieldError: {
            type: "object",
            additionalProperties: false,
            required: ["field", "message"],
            properties: {
              field: { type: "string" },
              message: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
    surfaceOptions.open,
  );
}

function toTitle(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function parseArgs(argv) {
  const parsed = {
    check: false,
    fromAppbase: false,
    outputDir: generatedOpenapiDir,
    openInput: defaultOpenOpenapiPath,
    appInput: defaultAppOpenapiPath,
    backendInput: defaultBackendOpenapiPath,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--check") {
      parsed.check = true;
      continue;
    }
    if (current === "--from-appbase") {
      parsed.fromAppbase = true;
      parsed.appInput = defaultAppbaseAppOpenapiPath;
      parsed.backendInput = defaultAppbaseBackendOpenapiPath;
      continue;
    }
    if (current === "--open-input") {
      parsed.openInput = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current === "--app-input") {
      parsed.appInput = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current === "--backend-input") {
      parsed.backendInput = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    if (current === "--output-dir") {
      parsed.outputDir = resolveWorkspacePath(argv[index + 1] || "");
      index += 1;
      continue;
    }
    fail(`unknown argument: ${current}`);
  }
  return parsed;
}

const surfaceOptions = {
  open: {
    authority: SDK_AUTHORITIES.open,
    sdkFamily: "sdkwork-commerce-sdk",
    title: "SDKWork Commerce Open API",
    version: "1.0.0",
    description: "Public commerce contract for SDKWork Commerce owned Open API operations.",
    audience: "Public commerce integrations.",
    serverUrl: "http://127.0.0.1:18082",
    standardProfile: "sdkwork-commerce-open-v3",
  },
  app: {
    authority: SDK_AUTHORITIES.app,
    sdkFamily: "sdkwork-commerce-app-sdk",
    title: "SDKWork Commerce App API",
    version: "1.0.0",
    description: "App/client contract for SDKWork Commerce product, order, payment, wallet, promotion, invoice, and membership modules.",
    audience: "App, desktop, mobile, H5, and user-facing clients.",
    serverUrl: "http://127.0.0.1:18080",
    standardProfile: "sdkwork-v3",
  },
  backend: {
    authority: SDK_AUTHORITIES.backend,
    sdkFamily: "sdkwork-commerce-backend-sdk",
    title: "SDKWork Commerce Backend API",
    version: "1.0.0",
    description: "Backend/admin contract for SDKWork Commerce catalog, order, payment, inventory, wallet, promotion, invoice, membership, and reporting modules.",
    audience: "Backend consoles, operators, control-plane integrations, and admin automation.",
    serverUrl: "http://127.0.0.1:18080",
    standardProfile: "sdkwork-v3",
  },
};

const args = parseArgs(process.argv.slice(2));
const openOpenapi = args.fromAppbase
  ? emptyOpenDocument()
  : normalizeOwnerOnlyDocument(readJson(args.openInput), surfaceOptions.open);
const appOpenapi = args.fromAppbase
  ? extractCommerceOnlyDocument(readJson(args.appInput), surfaceOptions.app)
  : normalizeOwnerOnlyDocument(readJson(args.appInput), surfaceOptions.app);
const backendOpenapi = args.fromAppbase
  ? extractCommerceOnlyDocument(readJson(args.backendInput), surfaceOptions.backend)
  : normalizeOwnerOnlyDocument(readJson(args.backendInput), surfaceOptions.backend);

if (!args.check) {
  mkdirSync(args.outputDir, { recursive: true });
  writeFileSync(
    path.join(args.outputDir, "commerce-open-api.openapi.json"),
    `${JSON.stringify(openOpenapi, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    path.join(args.outputDir, "commerce-app-api.openapi.json"),
    `${JSON.stringify(appOpenapi, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    path.join(args.outputDir, "commerce-backend-api.openapi.json"),
    `${JSON.stringify(backendOpenapi, null, 2)}\n`,
    "utf8",
  );
}

process.stdout.write(
  `[commerce_openapi_export] ok app=${operationEntries(appOpenapi).length} backend=${operationEntries(backendOpenapi).length}\n`,
);

