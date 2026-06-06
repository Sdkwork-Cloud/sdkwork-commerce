import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = process.cwd();
const appbaseRoot = resolve(
  workspaceRoot,
  "../../javasource/spring-ai-plus/spring-ai-plus-business/apps/sdkwork-appbase",
);

function resolveCommerceWorkspacePath(relativePath: string): string {
  if (relativePath === "pc-react/commerce") {
    return resolve(workspaceRoot, "apps/sdkwork-commerce-pc/packages/commerce");
  }
  if (relativePath.startsWith("pc-react/commerce/")) {
    return resolve(
      workspaceRoot,
      "apps/sdkwork-commerce-pc/packages/commerce",
      relativePath.slice("pc-react/commerce/".length),
    );
  }
  if (relativePath.startsWith("pc-react/foundation/")) {
    return resolve(appbaseRoot, "packages", relativePath);
  }
  if (relativePath.startsWith("common/commerce/") || relativePath === "common/commerce") {
    return resolve(workspaceRoot, "packages", relativePath);
  }
  return resolve(workspaceRoot, relativePath);
}

const governanceTextRoots = [
  "common/commerce",
  "pc-react/commerce",
  "pc-react/foundation/sdkwork-appbase-pc-react",
] as const;

const pcCommerceServiceFiles = [
  "pc-react/commerce/sdkwork-billing-pc-react/src/billing-service.ts",
  "pc-react/commerce/sdkwork-coupon-pc-react/src/coupon-service.ts",
  "pc-react/commerce/sdkwork-invoice-pc-react/src/invoice-service.ts",
  "pc-react/commerce/sdkwork-order-pc-react/src/order-service.ts",
  "pc-react/commerce/sdkwork-payment-pc-react/src/payment-service.ts",
  "pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-service.ts",
  "pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-service.ts",
  "pc-react/commerce/sdkwork-membership-admin-pc-react/src/membership-admin-service.ts",
  "pc-react/commerce/sdkwork-membership-pc-react/src/membership-service.ts",
  "pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-service.ts",
] as const;

const pcCommerceDomainFiles = [
  "pc-react/commerce/sdkwork-coupon-pc-react/src/coupon.ts",
] as const;

const pcCommerceRuntimeFiles = [
  ...pcCommerceServiceFiles,
  "pc-react/commerce/sdkwork-billing-pc-react/src/components/BillingBreakdownTable.tsx",
  "pc-react/commerce/sdkwork-billing-pc-react/src/components/BillingSummaryCards.tsx",
  "pc-react/commerce/sdkwork-billing-pc-react/src/pages/BillingPage.tsx",
  "pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-copy.ts",
  "pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-intl.tsx",
  "pc-react/commerce/sdkwork-commerce-pc-react/src/commerce-intl.tsx",
  "pc-react/commerce/sdkwork-coupon-pc-react/src/coupon-intl.tsx",
  "pc-react/commerce/sdkwork-invoice-pc-react/src/invoice-intl.tsx",
  "pc-react/commerce/sdkwork-offer-pc-react/src/offer-intl.tsx",
  "pc-react/commerce/sdkwork-order-pc-react/src/order-intl.tsx",
  "pc-react/commerce/sdkwork-payment-pc-react/src/payment-intl.tsx",
  "pc-react/commerce/sdkwork-points-pc-react/src/points-copy.ts",
  "pc-react/commerce/sdkwork-pricing-pc-react/src/pages/PricingPage.tsx",
  "pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-copy.ts",
  "pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-intl.tsx",
  "pc-react/commerce/sdkwork-membership-pc-react/src/components/membership-hero.tsx",
  "pc-react/commerce/sdkwork-membership-pc-react/src/pages/MembershipPage.tsx",
  "pc-react/commerce/sdkwork-membership-pc-react/src/membership-copy.ts",
  "pc-react/commerce/sdkwork-membership-purchase-pc-react/src/components/membership-purchase-header-entry.tsx",
  "pc-react/commerce/sdkwork-membership-purchase-pc-react/src/components/membership-purchase-menu.tsx",
  "pc-react/commerce/test-utils/commerce-service-mock.ts",
] as const;

const pcCommerceAggregatorServiceFiles = [
  "pc-react/commerce/sdkwork-billing-pc-react/src/billing-service.ts",
  "pc-react/commerce/sdkwork-checkout-pc-react/src/checkout-service.ts",
  "pc-react/commerce/sdkwork-commerce-pc-react/src/commerce-service.ts",
  "pc-react/commerce/sdkwork-offer-pc-react/src/offer-service.ts",
  "pc-react/commerce/sdkwork-points-pc-react/src/points-service.ts",
  "pc-react/commerce/sdkwork-pricing-pc-react/src/pricing-service.ts",
] as const;

const pcCommercePackageManifests = [
  "pc-react/commerce/sdkwork-billing-pc-react/package.json",
  "pc-react/commerce/sdkwork-coupon-pc-react/package.json",
  "pc-react/commerce/sdkwork-invoice-pc-react/package.json",
  "pc-react/commerce/sdkwork-order-pc-react/package.json",
  "pc-react/commerce/sdkwork-payment-pc-react/package.json",
  "pc-react/commerce/sdkwork-pricing-pc-react/package.json",
  "pc-react/commerce/sdkwork-subscription-pc-react/package.json",
  "pc-react/commerce/sdkwork-membership-admin-pc-react/package.json",
  "pc-react/commerce/sdkwork-membership-pc-react/package.json",
  "pc-react/commerce/sdkwork-wallet-pc-react/package.json",
] as const;

const packagesThatMayDependOnWallet = new Set([
  "pc-react/commerce/sdkwork-billing-pc-react/package.json",
  "pc-react/commerce/sdkwork-checkout-pc-react/package.json",
  "pc-react/commerce/sdkwork-commerce-pc-react/package.json",
  "pc-react/commerce/sdkwork-offer-pc-react/package.json",
  "pc-react/commerce/sdkwork-points-pc-react/package.json",
  "pc-react/commerce/sdkwork-pricing-pc-react/package.json",
  "pc-react/commerce/sdkwork-subscription-pc-react/package.json",
  "pc-react/commerce/sdkwork-wallet-pc-react/package.json",
]);

function listPcCommercePackageManifests(): string[] {
  return readdirSync(resolveCommerceWorkspacePath("pc-react/commerce"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `pc-react/commerce/${entry.name}/package.json`)
    .filter((relativePath) => existsSync(resolveCommerceWorkspacePath(relativePath)));
}

function listGovernanceTextFiles(): string[] {
  const files: string[] = [];

  function walk(relativeDirectory: string): void {
    for (const entry of readdirSync(resolveCommerceWorkspacePath(relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(relativePath);
      } else if (entry.name === "README.md" || entry.name === "component.spec.json") {
        files.push(relativePath);
      }
    }
  }

  for (const root of governanceTextRoots) {
    walk(root);
  }

  return files.sort();
}

function listTypedCommerceTestFiles(): string[] {
  const files = [
    "common/commerce/sdkwork-commerce-service/tests/commerce-service.standard.test.ts",
    "common/commerce/sdkwork-commerce-service/tests/pc-commerce-service-boundary.test.ts",
  ];

  function walk(relativeDirectory: string): void {
    for (const entry of readdirSync(resolveCommerceWorkspacePath(relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) {
        walk(relativePath);
      } else if (/\.test\.(ts|tsx)$/.test(entry.name)) {
        files.push(relativePath);
      }
    }
  }

  walk("pc-react/commerce");

  return files.sort();
}

function listMembershipGovernanceFiles(): string[] {
  const files: string[] = [];
  const allowedExtensions = new Set([".json", ".md", ".ts", ".tsx"]);
  const roots = [
    "common/commerce",
    "pc-react/commerce",
    "pc-react/foundation/sdkwork-appbase-pc-react",
  ] as const;

  function hasAllowedExtension(fileName: string): boolean {
    return Array.from(allowedExtensions).some((extension) => fileName.endsWith(extension));
  }

  function walk(relativeDirectory: string): void {
    for (const entry of readdirSync(resolveCommerceWorkspacePath(relativeDirectory), { withFileTypes: true })) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name !== "tests" && entry.name !== "node_modules") {
          walk(relativePath);
        }
      } else if (hasAllowedExtension(entry.name)) {
        files.push(relativePath);
      }
    }
  }

  for (const root of roots) {
    walk(root);
  }

  return files.sort();
}

describe("SDKWork PC commerce service boundaries", () => {
  const RETIRED_TIER_ROOT = "v" + "ip";

  it("does not keep retired app-client defaults, core-pc session reads, or adapter bypasses in commerce PC services", () => {
    for (const relativePath of pcCommerceServiceFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toContain("getAppClientWithSession");
      expect(source, relativePath).not.toContain("@sdkwork/core-pc-react");
      expect(source, relativePath).not.toContain("readPcReactRuntimeSession");
      expect(source, relativePath).not.toContain("getSessionTokens");
      expect(source, relativePath).not.toContain("getSdkworkCommerceSessionTokens");
      expect(source, relativePath).not.toContain("SdkworkAppSdkEnvelope");
      expect(source, relativePath).not.toContain("function isSuccessCode");
      expect(source, relativePath).not.toContain("function unwrapAppSdkResponse");
      expect(source, relativePath).not.toContain("function readOptional");
      expect(source, relativePath).not.toContain("readOptionalSdkworkCommerceResponse");
      expect(source, relativePath).not.toContain("Promise.allSettled");
      expect(source, relativePath).not.toContain("resolveSettledValue");
      expect(source, relativePath).not.toContain("function toOptionalString");
      expect(source, relativePath).not.toContain("function toNullableNumber");
      expect(source, relativePath).not.toContain("function toNumber");
      expect(source, relativePath).not.toContain("function mapMutationStatus");
      expect(source, relativePath).not.toMatch(new RegExp("\\bcom" + "pat\\b", "i"));
      expect(source, relativePath).not.toMatch(/\bfake\b/i);
      expect(source, relativePath).toContain("@sdkwork/commerce-service");
      expect(source, relativePath).toMatch(/hasSdkworkCommerceSession|requireSdkworkCommerceSession/);
      if (!relativePath.includes("sdkwork-pricing-pc-react")) {
        expect(source, relativePath).toContain("unwrapSdkworkCommerceResponse");
      }
    }
  });

  it("keeps shared scalar normalization in the commerce service instead of feature domains", () => {
    for (const relativePath of pcCommerceDomainFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toContain("function toOptionalString");
      expect(source, relativePath).not.toContain("function toNullableNumber");
      expect(source, relativePath).not.toContain("function toNumber");
      expect(source, relativePath).toContain("@sdkwork/commerce-service");
      expect(source, relativePath).toMatch(/toSdkworkCommerceOptionalString|toNullableSdkworkCommerceNumber|toSdkworkCommerceNumber/);
    }
  });

  it("uses membership package vocabulary instead of public membership pack aliases in PC commerce services", () => {
    const retiredMembershipNames = [
      blockedVocabularyPattern("Membership", "Pack"),
      blockedVocabularyPattern(RETIRED_TIER_ROOT, "Packs"),
      blockedVocabularyPattern("purchaseMembership", "Pack"),
      blockedVocabularyPattern(RETIRED_TIER_ROOT, "PackCatalog"),
      blockedVocabularyPattern("target", "LevelId"),
      blockedVocabularyPattern("noMembership", "PackPublished"),
      blockedVocabularyPattern("formatMembership", "PackSummary"),
      new RegExp("\\bmembership-p" + "ack-", "i"),
    ];

    for (const relativePath of pcCommerceRuntimeFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      for (const pattern of retiredMembershipNames) {
        expect(source, relativePath).not.toMatch(pattern);
      }
      expect(source, relativePath).not.toMatch(/\bany\[\]/);
    }
  });

  it("uses recharge package vocabulary instead of wallet recharge pack aliases in PC commerce services", () => {
    const retiredTypeNames = [
      blockedVocabularyPattern("SdkworkWalletRecharge", "Pack"),
      blockedVocabularyPattern("RemoteRecharge", "Pack"),
      blockedVocabularyPattern("recharge", "Packs"),
    ];
    const retiredCopyNames = [
      blockedVocabularyPattern("formatRecharge", "PackSummary"),
      blockedVocabularyPattern("noRecharge", "Pack"),
      blockedVocabularyPattern("no", "Packs"),
    ];
    const retiredDisplayText = new RegExp("\\brecharge p" + "ack(s)?\\b", "i");

    for (const relativePath of pcCommerceRuntimeFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      for (const pattern of [...retiredTypeNames, ...retiredCopyNames]) {
        expect(source, relativePath).not.toMatch(pattern);
      }
      expect(source, relativePath).not.toMatch(retiredDisplayText);
    }
  });

  it("keeps PC commerce navigation host-owned instead of mutating browser location directly", () => {
    for (const relativePath of pcCommerceRuntimeFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toMatch(/\bwindow\.location\b/);
      expect(source, relativePath).not.toMatch(/\blocation\.href\b/);
      expect(source, relativePath).not.toMatch(/\bwindow\.open\b/);
    }
  });

  it("keeps wallet and membership package purchase responsibilities separated", () => {
    const walletSource = readFileSync(
      resolveCommerceWorkspacePath("pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-service.ts"),
      "utf8",
    );
    const membershipSource = readFileSync(
      resolveCommerceWorkspacePath("pc-react/commerce/sdkwork-membership-pc-react/src/membership-service.ts"),
      "utf8",
    );

    expect(walletSource).not.toContain(RETIRED_TIER_ROOT + ".packages");
    expect(walletSource).not.toContain(RETIRED_TIER_ROOT + ".purchase");
    expect(walletSource).not.toContain(RETIRED_TIER_ROOT + ".info");
    expect(walletSource).not.toContain(RETIRED_TIER_ROOT + ".status");
    expect(walletSource).not.toMatch(blockedVocabularyPattern("purchaseMembership", "Package"));
    expect(walletSource).not.toMatch(/\bmembershipPackages\b/);
    expect(membershipSource).toContain("commerceService.memberships.packages.list");
    expect(membershipSource).toContain("commerceService.memberships.purchases.create");
    expect(membershipSource).not.toContain("commerceService." + RETIRED_TIER_ROOT);
    expect(membershipSource).not.toContain("@sdkwork/wallet-pc-react");
  });

  it("keeps wallet UI free of membership purchase navigation and membership ownership labels", () => {
    const walletUiFiles = [
      "pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-balance-panel.tsx",
      "pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-header-entry.tsx",
      "pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-quick-panel.tsx",
      "pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-copy.ts",
    ] as const;

    for (const relativePath of walletUiFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toContain('"/memberships"');
      expect(source, relativePath).not.toContain("manageMembership");
      expect(source, relativePath).not.toContain(RETIRED_TIER_ROOT + "CenterLabel");
      expect(source, relativePath).not.toMatch(/\bVIP center\b/i);
      expect(source, relativePath).not.toMatch(/\bmembership\b/i);
    }
  });

  it("keeps generic commerce display formatters in the shared commerce service instead of wallet exports", () => {
    const walletSource = readFileSync(
      resolveCommerceWorkspacePath("pc-react/commerce/sdkwork-wallet-pc-react/src/wallet.ts"),
      "utf8",
    );
    const commerceServiceSource = readFileSync(
      resolveCommerceWorkspacePath("common/commerce/sdkwork-commerce-service/src/index.ts"),
      "utf8",
    );

    expect(walletSource).not.toMatch(/\bexport function formatSdkwork(CurrencyCny|Points|PointsRate)\b/);
    expect(commerceServiceSource).toContain("export function formatSdkworkCommerceCurrencyCny");
    expect(commerceServiceSource).toContain("export function formatSdkworkCommercePoints");
    expect(commerceServiceSource).toContain("export function formatSdkworkCommercePointsRate");
  });

  it("does not use wallet as the shared commerce formatting or membership dependency", () => {
    const walletImportPattern = /import\s+\{(?<imports>[^}]*)\}\s+from\s+["']@sdkwork\/wallet-pc-react["']/g;
    const walletFormatterNamePattern = /\bformatSdkwork(CurrencyCny|Points|PointsRate|WalletDelta)\b/;

    for (const relativePath of pcCommerceRuntimeFiles) {
      if (relativePath.includes("sdkwork-wallet-pc-react")) {
        continue;
      }

      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");
      for (const match of source.matchAll(walletImportPattern)) {
        expect(match.groups?.imports ?? "", relativePath).not.toMatch(walletFormatterNamePattern);
      }
    }

    const entitlementTestSource = readFileSync(
      resolveCommerceWorkspacePath("pc-react/commerce/sdkwork-entitlement-pc-react/tests/entitlement.service.test.ts"),
      "utf8",
    );
    expect(entitlementTestSource).not.toMatch(/walletService:[\s\S]*?membership:\s*\{/);
  });

  it("does not declare @sdkwork/core-pc-react as a commerce package dependency", () => {
    for (const relativePath of listPcCommercePackageManifests()) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toContain('"@sdkwork/core-pc-react"');
      if (!packagesThatMayDependOnWallet.has(relativePath)) {
        expect(source, relativePath).not.toContain('"@sdkwork/wallet-pc-react"');
      }
    }

    for (const relativePath of pcCommercePackageManifests) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).toContain('"@sdkwork/commerce-service"');
    }
  });

  it("uses membership package identifiers instead of membership package identifiers in PC commerce package manifests", () => {
    for (const relativePath of listPcCommercePackageManifests()) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toContain("@sdkwork/memberships");
      expect(source, relativePath).not.toContain("sdkwork-" + RETIRED_TIER_ROOT);
      expect(source, relativePath).not.toMatch(new RegExp(`"capability":\\s*"${RETIRED_TIER_ROOT}`));
    }

    const membershipPackageNames = listPcCommercePackageManifests()
      .map((relativePath) => JSON.parse(readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8")).name as string)
      .filter((packageName) => packageName.includes("membership"));

    expect(membershipPackageNames).toEqual(expect.arrayContaining([
      "@sdkwork/membership-admin-pc-react",
      "@sdkwork/membership-pc-react",
      "@sdkwork/membership-purchase-pc-react",
    ]));
  });

  it("keeps membership commerce surfaces free of retired tier vocabulary", () => {
    const retiredTierBrandPattern = new RegExp("\\b" + "V" + "IP" + "\\b");
    const retiredTierTechnicalPattern = new RegExp("\\b" + "v" + "ip" + "\\b", "i");

    for (const relativePath of listMembershipGovernanceFiles()) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toMatch(retiredTierBrandPattern);
      expect(source, relativePath).not.toMatch(retiredTierTechnicalPattern);
    }
  });

  it("propagates the injected commerce SDK boundary through aggregate PC commerce services", () => {
    for (const relativePath of pcCommerceAggregatorServiceFiles) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");
      const sourceWithoutDefaultExport = source.replace(
        /export const sdkwork[A-Za-z]+Service = createSdkwork[A-Za-z]+Service\(\);/g,
        "",
      );

      expect(source, relativePath).toContain("commerceService?: SdkworkCommerceService");
      expect(sourceWithoutDefaultExport, relativePath).not.toMatch(/createSdkwork[A-Za-z]+Service\(\)/);
    }
  });

  it("keeps core commerce service and all PC commerce tests on typed boundaries", () => {
    for (const relativePath of listTypedCommerceTestFiles()) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      expect(source, relativePath).not.toMatch(/\bas any\b/);
      expect(source, relativePath).not.toMatch(/\bas unknown as\b/);
      expect(source, relativePath).not.toMatch(/\bRecord<string,\s*any>/);
    }
  });

  it("keeps commerce governance text free of retired-boundary vocabulary", () => {
    const blockedPatterns = [
      blockedVocabularyPattern("leg", "acy"),
      blockedVocabularyPattern("com", "pat"),
      /\bapp-client adapters\b/i,
      /\braw app-client\b/i,
      /\bhandwritten HTTP\b/i,
      /\bVIP, pack\b/i,
    ];

    for (const relativePath of listGovernanceTextFiles()) {
      const source = readFileSync(resolveCommerceWorkspacePath(relativePath), "utf8");

      for (const pattern of blockedPatterns) {
        expect(source, relativePath).not.toMatch(pattern);
      }
    }
  });
});

function blockedVocabularyPattern(prefix: string, suffix: string): RegExp {
  return new RegExp(`\\b${prefix}${suffix}\\b`, "i");
}
