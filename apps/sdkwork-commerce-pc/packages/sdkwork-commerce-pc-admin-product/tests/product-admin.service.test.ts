import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  configureCommerceServiceMockSession,
  createCommerceServiceMock,
  resetCommerceServiceMockSession,
} from "../../commerce/test-utils/commerce-service-mock";
import {
  createCommerceProductAdminService,
  createCommerceProductAdminWorkspaceManifest,
} from "../src";

describe("sdkwork-commerce-pc-admin-product service", () => {
  beforeEach(() => {
    configureCommerceServiceMockSession({ authToken: "commerce-product-admin-token" });
  });

  afterEach(() => {
    resetCommerceServiceMockSession();
  });

  it("delegates the complete catalog admin workflow through the Commerce service boundary", async () => {
    const calls = {
      categoryCreate: vi.fn().mockResolvedValue({ data: { id: "category-1" } }),
      categoryUpdate: vi.fn().mockResolvedValue({ data: { id: "category-1", name: "Updated" } }),
      categoryDelete: vi.fn().mockResolvedValue({ data: { deleted: true } }),
      categorySeedsCreate: vi.fn().mockResolvedValue({ data: [{ dataset: "product", requested: 2, upserted: 2 }] }),
      productCreate: vi.fn().mockResolvedValue({ data: { id: "product-1" } }),
      productUpdate: vi.fn().mockResolvedValue({ data: { id: "product-1", title: "Updated" } }),
      productDelete: vi.fn().mockResolvedValue({ data: { deleted: true } }),
      skuCreate: vi.fn().mockResolvedValue({ data: { id: "sku-1" } }),
      skuUpdate: vi.fn().mockResolvedValue({ data: { id: "sku-1", skuNo: "SKU-1" } }),
      skuDelete: vi.fn().mockResolvedValue({ data: { deleted: true } }),
      attributeCreate: vi.fn().mockResolvedValue({ data: { id: "attribute-1" } }),
      categoryAttributeCreate: vi.fn().mockResolvedValue({ data: { id: "binding-1" } }),
      categoryAttributeUpdate: vi.fn().mockResolvedValue({ data: { id: "binding-1", required: true } }),
      categoryAttributeDelete: vi.fn().mockResolvedValue({ data: { deleted: true } }),
      priceListCreate: vi.fn().mockResolvedValue({ data: { id: "price-list-1" } }),
    };
    const commerceService = createCommerceServiceMock({
      admin: {
        catalog: {
          attributes: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "attribute-1" }] }),
            create: calls.attributeCreate,
          },
          categories: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "category-1" }] }),
            create: calls.categoryCreate,
            update: calls.categoryUpdate,
            delete: calls.categoryDelete,
          },
          categoryAttributes: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "binding-1" }] }),
            create: calls.categoryAttributeCreate,
            update: calls.categoryAttributeUpdate,
            delete: calls.categoryAttributeDelete,
          },
          categorySeeds: {
            create: calls.categorySeedsCreate,
          },
          priceLists: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "price-list-1" }] }),
            create: calls.priceListCreate,
          },
          products: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "product-1" }] }),
            create: calls.productCreate,
            update: calls.productUpdate,
            delete: calls.productDelete,
          },
          skus: {
            list: vi.fn().mockResolvedValue({ data: [{ id: "sku-1" }] }),
            create: calls.skuCreate,
            update: calls.skuUpdate,
            delete: calls.skuDelete,
          },
        },
      },
    });
    const service = createCommerceProductAdminService({ commerceService });

    await expect(service.listCategories({ page: "1" })).resolves.toEqual({ data: [{ id: "category-1" }] });
    await expect(service.createCategory({ name: "Root" })).resolves.toEqual({ data: { id: "category-1" } });
    await expect(service.updateCategory("category-1", { name: "Updated" })).resolves.toEqual({
      data: { id: "category-1", name: "Updated" },
    });
    await expect(service.deleteCategory("category-1")).resolves.toEqual({ data: { deleted: true } });
    await expect(service.initializeCategorySeeds({ datasets: ["product"] })).resolves.toEqual({
      data: [{ dataset: "product", requested: 2, upserted: 2 }],
    });
    await expect(service.listProducts({ status: "active" })).resolves.toEqual({ data: [{ id: "product-1" }] });
    await expect(service.createProduct({ title: "Product" })).resolves.toEqual({ data: { id: "product-1" } });
    await expect(service.updateProduct("product-1", { title: "Updated" })).resolves.toEqual({
      data: { id: "product-1", title: "Updated" },
    });
    await expect(service.deleteProduct("product-1")).resolves.toEqual({ data: { deleted: true } });
    await expect(service.listSkus({ productId: "product-1" })).resolves.toEqual({ data: [{ id: "sku-1" }] });
    await expect(service.createSku({ skuNo: "SKU-1" })).resolves.toEqual({ data: { id: "sku-1" } });
    await expect(service.updateSku("sku-1", { skuNo: "SKU-1" })).resolves.toEqual({
      data: { id: "sku-1", skuNo: "SKU-1" },
    });
    await expect(service.deleteSku("sku-1")).resolves.toEqual({ data: { deleted: true } });
    await expect(service.listAttributes({ scope: "sku" })).resolves.toEqual({ data: [{ id: "attribute-1" }] });
    await expect(service.createAttribute({ name: "Color" })).resolves.toEqual({ data: { id: "attribute-1" } });
    await expect(service.listCategoryAttributes({ categoryId: "category-1" })).resolves.toEqual({
      data: [{ id: "binding-1" }],
    });
    await expect(service.createCategoryAttribute({ categoryId: "category-1" })).resolves.toEqual({
      data: { id: "binding-1" },
    });
    await expect(service.updateCategoryAttribute("binding-1", { required: true })).resolves.toEqual({
      data: { id: "binding-1", required: true },
    });
    await expect(service.deleteCategoryAttribute("binding-1")).resolves.toEqual({ data: { deleted: true } });
    await expect(service.listPriceLists({ page: "1" })).resolves.toEqual({ data: [{ id: "price-list-1" }] });
    await expect(service.createPriceList({ name: "Default" })).resolves.toEqual({ data: { id: "price-list-1" } });

    expect(calls.categoryCreate).toHaveBeenCalledWith({ name: "Root" });
    expect(calls.categoryUpdate).toHaveBeenCalledWith("category-1", { name: "Updated" });
    expect(calls.categoryDelete).toHaveBeenCalledWith("category-1");
    expect(calls.categorySeedsCreate).toHaveBeenCalledWith({ datasets: ["product"] });
    expect(calls.productDelete).toHaveBeenCalledWith("product-1");
    expect(calls.skuDelete).toHaveBeenCalledWith("sku-1");
    expect(calls.categoryAttributeUpdate).toHaveBeenCalledWith("binding-1", { required: true });
  });

  it("exports a reusable workspace manifest for Claw Router integration", () => {
    expect(createCommerceProductAdminWorkspaceManifest()).toMatchObject({
      capability: "product-admin",
      packageNames: ["sdkwork-commerce-pc-admin-product"],
      routePath: "/admin/catalog",
    });
  });
});
