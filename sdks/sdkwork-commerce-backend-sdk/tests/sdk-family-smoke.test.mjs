import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(testDir, "..");

test("sdkwork-commerce-backend-sdk uses sdkwork-v3 profile", () => {
  const source = readFileSync(path.join(sdkRoot, "bin/generate-sdk.mjs"), "utf8");
  assert.match(source, /--standard-profile/);
  assert.match(source, /sdkwork-v3/);
  assert.match(source, /runCommerceSdkGenerator/);
});

test("sdkwork-commerce-backend-sdk declares appbase as a consumer SDK dependency", () => {
  const assembly = JSON.parse(readFileSync(path.join(sdkRoot, ".sdkwork-assembly.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(path.join(sdkRoot, "sdk-manifest.json"), "utf8"));
  for (const document of [assembly, manifest]) {
    assert.equal(document.sdkOwner, "sdkwork-commerce");
    assert.equal(document.apiAuthority, "sdkwork-commerce.backend");
    assert.equal(document.generationInputSpec, "../../generated/openapi/commerce-backend-api.openapi.json");
    assert.deepEqual(
      document.sdkDependencies?.map((dependency) => ({
        workspace: dependency.workspace,
        apiAuthority: dependency.apiAuthority,
        dependencyMode: dependency.dependencyMode,
        generatedTransportImportPolicy: dependency.generatedTransportImportPolicy,
      })),
      [
        {
          workspace: "sdkwork-appbase-backend-sdk",
          apiAuthority: "sdkwork-appbase.backend",
          dependencyMode: "consumer-sdk",
          generatedTransportImportPolicy: "forbidden",
        },
      ],
    );
  }
});

