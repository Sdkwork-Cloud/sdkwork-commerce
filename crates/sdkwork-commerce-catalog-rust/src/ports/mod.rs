use crate::{
    BuyerAddressDraft, CartItemDraft, ProductAttributeDraft, ProductCategoryDraft, ProductSkuDraft,
    ProductSkuListQuery, ProductSpuDraft, ProductSpuListQuery,
};
use sdkwork_commerce_core::CommerceServiceError;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CatalogRepositoryCommand {
    CreateCategory,
    CreateAttribute,
    CreateSpu,
    CreateSku,
    AddCartItem,
    RemoveCartItem,
    UpsertBuyerAddress,
}

pub struct CatalogPortRequirement;

pub trait CatalogRepositoryPort {
    fn create_category(&self, draft: &ProductCategoryDraft) -> Result<(), CommerceServiceError>;

    fn create_attribute(&self, draft: &ProductAttributeDraft) -> Result<(), CommerceServiceError>;

    fn create_spu(&self, draft: &ProductSpuDraft) -> Result<(), CommerceServiceError>;

    fn create_sku(&self, draft: &ProductSkuDraft) -> Result<(), CommerceServiceError>;

    fn list_spu(
        &self,
        query: &ProductSpuListQuery,
    ) -> Result<Vec<ProductSpuDraft>, CommerceServiceError>;

    fn list_skus(
        &self,
        query: &ProductSkuListQuery,
    ) -> Result<Vec<ProductSkuDraft>, CommerceServiceError>;

    fn add_cart_item(&self, draft: &CartItemDraft) -> Result<(), CommerceServiceError>;

    fn upsert_buyer_address(&self, draft: &BuyerAddressDraft) -> Result<(), CommerceServiceError>;
}

pub const CATALOG_REPOSITORY_PORT: &str = "catalog.repository";
pub const CART_REPOSITORY_PORT: &str = "cart.repository";
pub const BUYER_ADDRESS_REPOSITORY_PORT: &str = "buyer_address.repository";
pub const IDEMPOTENCY_REPOSITORY_PORT: &str = "idempotency.repository";

impl CatalogPortRequirement {
    pub fn standard_commands() -> Vec<CatalogRepositoryCommand> {
        vec![
            CatalogRepositoryCommand::CreateCategory,
            CatalogRepositoryCommand::CreateAttribute,
            CatalogRepositoryCommand::CreateSpu,
            CatalogRepositoryCommand::CreateSku,
            CatalogRepositoryCommand::AddCartItem,
            CatalogRepositoryCommand::RemoveCartItem,
            CatalogRepositoryCommand::UpsertBuyerAddress,
        ]
    }
}
