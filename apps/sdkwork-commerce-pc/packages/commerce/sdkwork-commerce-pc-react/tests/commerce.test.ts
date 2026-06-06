import { describe, expect, it } from "vitest";
import {
  commercePackageMeta,
  createCommerceRouteIntent,
  createCommerceWorkspaceManifest,
} from "../src";

describe("sdkwork-commerce-pc-react headless contract", () => {
  it("creates reusable commerce manifests and route intents", () => {
    expect(commercePackageMeta).toMatchObject({
      domain: "commerce",
      package: "@sdkwork/commerce-pc-react",
    });

    expect(
      createCommerceWorkspaceManifest({
        title: "Commerce",
      }),
    ).toMatchObject({
      capability: "commerce",
      packageNames: [
        "@sdkwork/commerce-pc-react",
        "@sdkwork/billing-pc-react",
        "@sdkwork/checkout-pc-react",
        "@sdkwork/entitlement-pc-react",
        "@sdkwork/offer-pc-react",
        "@sdkwork/pricing-pc-react",
        "@sdkwork/wallet-pc-react",
        "@sdkwork/points-pc-react",
        "@sdkwork/membership-pc-react",
        "@sdkwork/membership-purchase-pc-react",
        "@sdkwork/coupon-pc-react",
        "@sdkwork/subscription-pc-react",
        "@sdkwork/order-pc-react",
        "@sdkwork/payment-pc-react",
        "@sdkwork/invoice-pc-react",
      ],
      routePath: "/commerce",
      title: "Commerce",
    });

    expect(
      createCommerceRouteIntent({
        sectionId: "orders",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/commerce?section=orders",
      sectionId: "orders",
      source: "commerce-workspace",
      type: "commerce-route-intent",
    });
  });
});
