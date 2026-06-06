import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(testDir, "..");

test("sdkwork-commerce-app-sdk uses sdkwork-v3 profile", () => {
  const source = readFileSync(path.join(sdkRoot, "bin/generate-sdk.mjs"), "utf8");
  assert.match(source, /--standard-profile/);
  assert.match(source, /sdkwork-v3/);
  assert.match(source, /runCommerceSdkGenerator/);
});

test("sdkwork-commerce-app-sdk declares appbase as a consumer SDK dependency", () => {
  const assembly = JSON.parse(readFileSync(path.join(sdkRoot, ".sdkwork-assembly.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(path.join(sdkRoot, "sdk-manifest.json"), "utf8"));
  for (const document of [assembly, manifest]) {
    assert.equal(document.sdkOwner, "sdkwork-commerce");
    assert.equal(document.apiAuthority, "sdkwork-commerce.app");
    assert.equal(document.generationInputSpec, "../../generated/openapi/commerce-app-api.openapi.json");
    assert.deepEqual(
      document.sdkDependencies?.map((dependency) => ({
        workspace: dependency.workspace,
        apiAuthority: dependency.apiAuthority,
        dependencyMode: dependency.dependencyMode,
        generatedTransportImportPolicy: dependency.generatedTransportImportPolicy,
      })),
      [
        {
          workspace: "sdkwork-appbase-app-sdk",
          apiAuthority: "sdkwork-appbase.app",
          dependencyMode: "consumer-sdk",
          generatedTransportImportPolicy: "forbidden",
        },
      ],
    );
  }
});

