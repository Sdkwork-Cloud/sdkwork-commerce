import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const workspaceRoot = path.resolve(import.meta.dirname, "..", "..");

function readWorkspaceFile(relativePath) {
  return readFileSync(path.join(workspaceRoot, relativePath), "utf8");
}

function collectFiles(root, predicate) {
  const files = [];
  for (const entry of readdirSync(root)) {
    const fullPath = path.join(root, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectFiles(fullPath, predicate));
      continue;
    }
    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

test("commerce OpenAPI and SDK tools no longer expose appbase extraction mode", () => {
  const toolFiles = [
    "tools/commerce_openapi_export.mjs",
    "tools/commerce_sdk_generate.mjs",
  ];
  const forbiddenMarkers = [
    "--from-appbase",
    "fromAppbase",
    "DEFAULT_APPBASE_ROOT",
    "defaultAppbase",
    "extractCommerceOnlyDocument",
    "sdkwork-appbase-app-api.openapi.yaml",
    "sdkwork-appbase-backend-api.openapi.yaml",
  ];

  for (const relativePath of toolFiles) {
    const source = readWorkspaceFile(relativePath);
    for (const marker of forbiddenMarkers) {
      assert.equal(
        source.includes(marker),
        false,
        `${relativePath} must not keep migration-only appbase extraction marker ${marker}`,
      );
    }
  }
});

test("commerce Rust HTTP source exposes commerce-owned store type names", () => {
  const rustFiles = collectFiles(
    path.join(workspaceRoot, "crates", "sdkwork-commerce-http-rust", "src"),
    (filePath) => filePath.endsWith(".rs"),
  );

  for (const filePath of rustFiles) {
    const source = readFileSync(filePath, "utf8");
    const matches = source.match(/\bAppbase[A-Za-z0-9_]*\b/g) ?? [];
    assert.deepEqual(
      [...new Set(matches)].sort(),
      [],
      `${path.relative(workspaceRoot, filePath)} must not expose Appbase-prefixed commerce Rust identifiers`,
    );
  }
});

test("commerce source text does not describe migrated commerce capabilities as appbase-owned", () => {
  const textRoots = [
    "packages/common/commerce",
    "apps/sdkwork-commerce-pc/packages/commerce",
    "crates",
    "README.md",
  ];
  const forbiddenPatterns = [
    /\bappbase app services\b/i,
    /\bappbase admin services\b/i,
    /\bappbase output\b/i,
    /\bshared appbase contract\b/i,
    /\bLower-level appbase packages only\b/i,
    /\bfrom_appbase_tables\b/i,
    /\bappbase_membership\b/i,
  ];
  const allowedPathFragments = [
    "target",
    "node_modules",
    "generated",
    "sdks/test/verify-commerce-migration-cleanup.test.mjs",
  ];

  const files = textRoots.flatMap((relativePath) => {
    const absolutePath = path.join(workspaceRoot, relativePath);
    if (statSync(absolutePath).isFile()) {
      return [absolutePath];
    }
    return collectFiles(absolutePath, (filePath) => /\.(md|rs|ts|tsx|mjs|json)$/.test(filePath));
  });

  const violations = [];
  for (const filePath of files) {
    const relativePath = path.relative(workspaceRoot, filePath).replaceAll("\\", "/");
    if (allowedPathFragments.some((fragment) => relativePath.includes(fragment))) {
      continue;
    }
    const source = readFileSync(filePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      const match = source.match(pattern);
      if (match) {
        violations.push(`${relativePath}: ${match[0]}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});
