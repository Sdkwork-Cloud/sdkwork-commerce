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

function normalizeOwnerOnlyDocument(inputDocument, options) {
  const document = cloneJson(inputDocument);
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
const openOpenapi = normalizeOwnerOnlyDocument(readJson(args.openInput), surfaceOptions.open);
const appOpenapi = normalizeOwnerOnlyDocument(readJson(args.appInput), surfaceOptions.app);
const backendOpenapi = normalizeOwnerOnlyDocument(
  readJson(args.backendInput),
  surfaceOptions.backend,
);

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
