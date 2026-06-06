import { describe, expect, it } from "vitest";
import {
  createPointsRouteIntent,
  createPointsWorkspaceManifest,
  pointsPackageMeta,
} from "../src";

describe("sdkwork-points-pc-react headless contract", () => {
  it("creates a points workspace manifest and route intent for reusable host routing", () => {
    expect(pointsPackageMeta).toMatchObject({
      domain: "commerce",
      package: "@sdkwork/points-pc-react",
    });

    expect(
      createPointsWorkspaceManifest({
        title: "Points",
      }),
    ).toMatchObject({
      capability: "points",
      packageNames: ["@sdkwork/points-pc-react", "@sdkwork/wallet-pc-react"],
      routePath: "/points",
      title: "Points",
    });

    expect(
      createPointsRouteIntent({
        sectionId: "transactions",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/points?section=transactions",
      sectionId: "transactions",
      source: "points-workspace",
      type: "points-route-intent",
    });
  });
});
