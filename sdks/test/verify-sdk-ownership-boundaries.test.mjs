import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const sdksRoot = path.resolve(testDir, "..");
const workspaceRoot = path.resolve(sdksRoot, "..");

const families = [
  {
    root: "sdkwork-commerce-sdk",
    owner: "sdkwork-commerce",
    authority: "sdkwork-commerce.open",
    input: "generated/openapi/commerce-open-api.openapi.json",
  },
  {
    root: "sdkwork-commerce-app-sdk",
    owner: "sdkwork-commerce",
    authority: "sdkwork-commerce.app",
    input: "generated/openapi/commerce-app-api.openapi.json",
    dependencyWorkspace: "sdkwork-appbase-app-sdk",
    dependencyAuthority: "sdkwork-appbase.app",
  },
  {
    root: "sdkwork-commerce-backend-sdk",
    owner: "sdkwork-commerce",
    authority: "sdkwork-commerce.backend",
    input: "generated/openapi/commerce-backend-api.openapi.json",
    dependencyWorkspace: "sdkwork-appbase-backend-sdk",
    dependencyAuthority: "sdkwork-appbase.backend",
  },
];

const appbaseOwnedPathPrefixes = [
  "/app/v3/api/auth/",
  "/app/v3/api/iam/",
  "/app/v3/api/open_platform/",
  "/app/v3/api/system/iam/",
  "/backend/v3/api/auth/",
  "/backend/v3/api/iam/",
  "/backend/v3/api/open_platform/",
  "/backend/v3/api/system/iam/",
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(workspaceRoot, relativePath), "utf8"));
}

function operationEntries(openapi) {
  const entries = [];
  for (const [pathKey, pathItem] of Object.entries(openapi.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem || {})) {
      if (!["get", "put", "post", "patch", "delete", "head", "options", "trace"].includes(method)) {
        continue;
      }
      entries.push({ pathKey, method, operation });
    }
  }
  return entries;
}

test("commerce SDK family assemblies declare owner-only authority metadata", () => {
  for (const family of families) {
    const assembly = readJson(path.join("sdks", family.root, ".sdkwork-assembly.json"));
    const manifest = readJson(path.join("sdks", family.root, "sdk-manifest.json"));
    const componentSpec = readJson(path.join("sdks", family.root, "specs/component.spec.json"));

    assert.equal(assembly.sdkOwner, family.owner, `${family.root} must declare sdkOwner`);
    assert.equal(assembly.apiAuthority, family.authority, `${family.root} must declare apiAuthority`);
    assert.equal(assembly.sdkFamily, family.root, `${family.root} must declare sdkFamily`);
    assert.equal(manifest.sdkName, family.root, `${family.root} manifest sdkName must match family`);
    assert.equal(manifest.sdkFamily, family.root, `${family.root} manifest sdkFamily must match family`);
    assert.equal(
      assembly.generationInputSpec,
      `../../${family.input.replaceAll("\\", "/")}`,
      `${family.root} must generate from its owner-only input`,
    );
    assert.deepEqual(
      assembly.sdkDependencies ?? [],
      manifest.sdkDependencies ?? [],
      `${family.root} assembly and manifest sdkDependencies must match`,
    );
    assert.deepEqual(
      componentSpec.contracts?.sdkDependencies ?? [],
      manifest.sdkDependencies ?? [],
      `${family.root} component spec and manifest sdkDependencies must match`,
    );

    if (family.dependencyWorkspace) {
      assert.deepEqual(
        assembly.sdkDependencies?.map((dependency) => ({
          workspace: dependency.workspace,
          apiAuthority: dependency.apiAuthority,
          dependencyMode: dependency.dependencyMode,
          generatedTransportImportPolicy: dependency.generatedTransportImportPolicy,
        })),
        [
          {
            workspace: family.dependencyWorkspace,
            apiAuthority: family.dependencyAuthority,
            dependencyMode: "consumer-sdk",
            generatedTransportImportPolicy: "forbidden",
          },
        ],
        `${family.root} must declare appbase as a consumer SDK dependency`,
      );
    }
  }
});

test("commerce generated OpenAPI inputs contain only sdkwork-commerce owned operations", () => {
  for (const family of families) {
    const openapi = readJson(family.input);
    assert.equal(openapi["x-sdkwork-owner"], family.owner);
    assert.equal(openapi["x-sdkwork-api-authority"], family.authority);

    for (const { pathKey, method, operation } of operationEntries(openapi)) {
      assert.equal(
        operation["x-sdkwork-owner"],
        family.owner,
        `${family.root} ${method.toUpperCase()} ${pathKey} must be commerce-owned`,
      );
      assert.equal(
        operation["x-sdkwork-api-authority"],
        family.authority,
        `${family.root} ${method.toUpperCase()} ${pathKey} must use ${family.authority}`,
      );
      assert.equal(
        operation["x-sdkwork-domain"],
        "commerce",
        `${family.root} ${method.toUpperCase()} ${pathKey} must declare commerce domain`,
      );
      assert(
        !appbaseOwnedPathPrefixes.some((prefix) => pathKey.startsWith(prefix)),
        `${family.root} must not copy appbase-owned route ${method.toUpperCase()} ${pathKey}`,
      );
    }
  }
});
