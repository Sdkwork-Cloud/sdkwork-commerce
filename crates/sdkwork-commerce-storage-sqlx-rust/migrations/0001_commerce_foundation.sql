CREATE TABLE IF NOT EXISTS commerce_idempotency_key (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_json TEXT,
  status TEXT NOT NULL,
  locked_until TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, scope, idempotency_key)
);

CREATE TABLE IF NOT EXISTS commerce_shop (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_no TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  shop_type TEXT NOT NULL,
  business_model TEXT NOT NULL,
  storefront_status TEXT NOT NULL,
  operation_status TEXT NOT NULL,
  review_status TEXT NOT NULL,
  data_scope TEXT NOT NULL DEFAULT 'organization',
  verification_snapshot_json TEXT,
  contact_snapshot_json TEXT,
  logo_media_resource_id TEXT,
  cover_media_resource_id TEXT,
  default_currency_code TEXT NOT NULL,
  default_locale TEXT,
  timezone TEXT,
  operation_config_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL DEFAULT 0,
  submitted_at TEXT,
  approved_at TEXT,
  rejected_at TEXT,
  suspended_at TEXT,
  closed_at TEXT,
  deleted_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_no)
);

CREATE TABLE IF NOT EXISTS commerce_shop_application (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  application_no TEXT NOT NULL,
  application_type TEXT NOT NULL,
  review_status TEXT NOT NULL,
  legal_entity_snapshot_json TEXT NOT NULL DEFAULT '{}',
  contact_snapshot_json TEXT NOT NULL DEFAULT '{}',
  qualification_snapshot_json TEXT NOT NULL DEFAULT '{}',
  submitted_by TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_comment TEXT,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, application_no),
  UNIQUE (tenant_id, shop_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS commerce_shop_verification (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  verification_type TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  legal_entity_name TEXT,
  credential_no_hash TEXT,
  credential_media_resource_id TEXT,
  verification_snapshot_json TEXT NOT NULL DEFAULT '{}',
  expires_at TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, verification_type)
);

CREATE TABLE IF NOT EXISTS commerce_shop_status_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  event_no TEXT NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  reason_code TEXT,
  reason_detail TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, event_no),
  UNIQUE (tenant_id, shop_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS commerce_shop_channel (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  channel_code TEXT NOT NULL,
  storefront_status TEXT NOT NULL,
  domain_name TEXT,
  path_prefix TEXT,
  theme_code TEXT,
  channel_config_json TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, channel_code)
);

CREATE TABLE IF NOT EXISTS commerce_shop_fulfillment_profile (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  fulfillment_mode TEXT NOT NULL,
  shipping_origin_region_code TEXT,
  service_level_code TEXT,
  after_sales_policy_json TEXT NOT NULL DEFAULT '{}',
  service_config_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id)
);

CREATE TABLE IF NOT EXISTS commerce_shop_settlement_profile (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  settlement_status TEXT NOT NULL,
  settlement_cycle TEXT NOT NULL,
  settlement_currency_code TEXT NOT NULL,
  account_ref TEXT,
  risk_hold_days INTEGER NOT NULL DEFAULT 0,
  settlement_config_json TEXT NOT NULL DEFAULT '{}',
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id)
);

CREATE TABLE IF NOT EXISTS commerce_shop_metric_snapshot (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  snapshot_date TEXT NOT NULL,
  gross_sales_amount TEXT NOT NULL DEFAULT '0',
  currency_code TEXT NOT NULL,
  paid_order_count INTEGER NOT NULL DEFAULT 0,
  refund_order_count INTEGER NOT NULL DEFAULT 0,
  fulfillment_pending_count INTEGER NOT NULL DEFAULT 0,
  settlement_pending_amount TEXT NOT NULL DEFAULT '0',
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, snapshot_date)
);

CREATE TABLE IF NOT EXISTS commerce_shop_readiness (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  readiness_scope TEXT NOT NULL,
  readiness_status TEXT NOT NULL,
  blocking_count INTEGER NOT NULL DEFAULT 0,
  warning_count INTEGER NOT NULL DEFAULT 0,
  checklist_json TEXT NOT NULL DEFAULT '[]',
  evaluated_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  UNIQUE (tenant_id, shop_id, readiness_scope)
);

CREATE TABLE IF NOT EXISTS commerce_shop_business_hour (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  schedule_type TEXT NOT NULL,
  timezone TEXT NOT NULL,
  weekly_schedule_json TEXT NOT NULL DEFAULT '{}',
  holiday_schedule_json TEXT NOT NULL DEFAULT '{}',
  effective_from TEXT,
  effective_to TEXT,
  status TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, schedule_type)
);

CREATE TABLE IF NOT EXISTS commerce_shop_service_area (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  area_type TEXT NOT NULL,
  country_code TEXT NOT NULL,
  region_code TEXT,
  city_code TEXT,
  area_key TEXT NOT NULL,
  postal_code_pattern TEXT,
  delivery_radius_meters INTEGER,
  service_status TEXT NOT NULL,
  service_config_json TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (delivery_radius_meters IS NULL OR delivery_radius_meters >= 0)
);

CREATE TABLE IF NOT EXISTS commerce_shop_policy (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  policy_type TEXT NOT NULL,
  policy_status TEXT NOT NULL,
  policy_version INTEGER NOT NULL DEFAULT 1,
  policy_json TEXT NOT NULL DEFAULT '{}',
  published_at TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, policy_type, policy_version)
);

CREATE TABLE IF NOT EXISTS commerce_shop_deposit_account (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  deposit_status TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  required_amount TEXT NOT NULL DEFAULT '0',
  paid_amount TEXT NOT NULL DEFAULT '0',
  frozen_amount TEXT NOT NULL DEFAULT '0',
  account_ref TEXT,
  due_at TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, shop_id, currency_code)
);

CREATE TABLE IF NOT EXISTS commerce_shop_risk_signal (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  signal_no TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  signal_status TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  risk_score INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL DEFAULT '{}',
  detected_at TEXT NOT NULL,
  resolved_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, signal_no)
);

CREATE TABLE IF NOT EXISTS commerce_shop_category_binding (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  shop_category_code TEXT NOT NULL,
  platform_category_code TEXT,
  platform_category_name TEXT,
  category_path TEXT,
  category_level INTEGER NOT NULL DEFAULT 0,
  category_status TEXT NOT NULL,
  qualification_required INTEGER NOT NULL DEFAULT 0,
  qualification_snapshot_json TEXT NOT NULL DEFAULT '{}',
  review_status TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  effective_from TEXT,
  effective_to TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (qualification_required IN (0, 1)),
  CONSTRAINT uk_commerce_shop_category_binding_scope UNIQUE (tenant_id, shop_id, shop_category_code)
);

CREATE TABLE IF NOT EXISTS commerce_shop_brand_authorization (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  brand_code TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  authorization_type TEXT NOT NULL,
  authorization_status TEXT NOT NULL,
  brand_owner_name TEXT,
  trademark_no_hash TEXT,
  trademark_media_resource_id TEXT,
  authorization_media_resource_id TEXT,
  authorization_snapshot_json TEXT NOT NULL DEFAULT '{}',
  valid_from TEXT,
  valid_to TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CONSTRAINT uk_commerce_shop_brand_authorization_scope UNIQUE (tenant_id, shop_id, brand_code)
);

CREATE TABLE IF NOT EXISTS commerce_shop_qualification (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  qualification_type TEXT NOT NULL,
  qualification_status TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL DEFAULT '',
  credential_name TEXT,
  credential_no_hash TEXT,
  credential_media_resource_id TEXT,
  qualification_snapshot_json TEXT NOT NULL DEFAULT '{}',
  issued_at TEXT,
  expires_at TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CONSTRAINT uk_commerce_shop_qualification_scope UNIQUE (tenant_id, shop_id, qualification_type, subject_type, subject_id)
);

CREATE TABLE IF NOT EXISTS commerce_shop_customer_service (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  service_channel TEXT NOT NULL,
  service_status TEXT NOT NULL,
  contact_ref TEXT NOT NULL,
  contact_label TEXT,
  service_window_json TEXT NOT NULL DEFAULT '{}',
  service_config_json TEXT NOT NULL DEFAULT '{}',
  is_default INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (is_default IN (0, 1)),
  CONSTRAINT uk_commerce_shop_customer_service_scope UNIQUE (tenant_id, shop_id, service_channel, contact_ref)
);

CREATE TABLE IF NOT EXISTS commerce_shop_return_address (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  address_usage TEXT NOT NULL,
  address_key TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  phone_hash TEXT,
  country_code TEXT NOT NULL,
  region_code TEXT,
  city_code TEXT,
  district_code TEXT,
  address_line1 TEXT NOT NULL,
  postal_code TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  address_status TEXT NOT NULL,
  address_snapshot_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (is_default IN (0, 1)),
  CONSTRAINT uk_commerce_shop_return_address_scope UNIQUE (tenant_id, shop_id, address_usage, address_key)
);

CREATE TABLE IF NOT EXISTS commerce_shop_shipping_template (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  template_code TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_status TEXT NOT NULL,
  pricing_mode TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  base_quantity INTEGER NOT NULL DEFAULT 1,
  base_fee_amount TEXT NOT NULL DEFAULT '0',
  currency_code TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  region_rule_json TEXT NOT NULL DEFAULT '[]',
  free_shipping_rule_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (base_quantity > 0),
  CHECK (is_default IN (0, 1)),
  CONSTRAINT uk_commerce_shop_shipping_template_scope UNIQUE (tenant_id, shop_id, template_code)
);

CREATE TABLE IF NOT EXISTS commerce_account (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  currency_code TEXT,
  available_amount TEXT NOT NULL DEFAULT '0',
  frozen_amount TEXT NOT NULL DEFAULT '0',
  version INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, owner_user_id, asset_type, currency_code)
);

CREATE TABLE IF NOT EXISTS commerce_account_ledger_entry (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  account_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount TEXT NOT NULL,
  balance_after TEXT NOT NULL,
  business_type TEXT NOT NULL,
  transaction_no TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  remark TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, transaction_no)
);

CREATE TABLE IF NOT EXISTS commerce_billing_prehold (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  prehold_no TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  settled_at TEXT,
  released_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, prehold_no)
);

CREATE TABLE IF NOT EXISTS commerce_billing_history (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  history_no TEXT NOT NULL,
  history_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  amount TEXT NOT NULL DEFAULT '0',
  currency_code TEXT,
  points_delta INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  reference_no TEXT,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  related_order_id TEXT,
  related_order_no TEXT,
  payment_method TEXT,
  occurred_at TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, history_no),
  UNIQUE (tenant_id, source_type, source_id)
);

CREATE TABLE IF NOT EXISTS benefit_definition (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  benefit_code TEXT NOT NULL,
  name TEXT NOT NULL,
  benefit_type TEXT NOT NULL,
  value_unit TEXT NOT NULL,
  measurement_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, benefit_code)
);

CREATE TABLE IF NOT EXISTS entitlement_grant (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  grant_no TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  grant_policy TEXT NOT NULL,
  granted_quantity TEXT NOT NULL,
  status TEXT NOT NULL,
  starts_at TEXT,
  expires_at TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, grant_no),
  UNIQUE (tenant_id, source_type, source_id, benefit_id, subject_type, subject_id)
);

CREATE TABLE IF NOT EXISTS entitlement_account (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  account_no TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  total_granted TEXT NOT NULL DEFAULT '0',
  total_used TEXT NOT NULL DEFAULT '0',
  balance TEXT NOT NULL DEFAULT '0',
  status TEXT NOT NULL,
  expires_at TEXT,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, account_no),
  UNIQUE (tenant_id, subject_type, subject_id, benefit_id)
);

CREATE TABLE IF NOT EXISTS entitlement_ledger_entry (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  ledger_no TEXT NOT NULL,
  account_id TEXT NOT NULL,
  grant_id TEXT,
  benefit_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount TEXT NOT NULL,
  balance_after TEXT NOT NULL,
  business_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, ledger_no),
  UNIQUE (tenant_id, request_no)
);

CREATE TABLE IF NOT EXISTS membership_plan (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  plan_no TEXT NOT NULL,
  plan_code TEXT NOT NULL,
  name TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, plan_no),
  UNIQUE (tenant_id, organization_id, plan_code)
);

CREATE TABLE IF NOT EXISTS membership_plan_version (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  plan_id TEXT NOT NULL,
  version_no TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  lifecycle_status TEXT NOT NULL,
  effective_from TEXT,
  effective_to TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, plan_id, version_no)
);

CREATE TABLE IF NOT EXISTS membership_plan_benefit (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  plan_id TEXT NOT NULL,
  plan_version_id TEXT NOT NULL,
  benefit_id TEXT NOT NULL,
  benefit_code TEXT NOT NULL,
  grant_quantity TEXT NOT NULL,
  grant_period TEXT,
  reset_policy TEXT,
  usage_policy TEXT,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, plan_version_id, benefit_id)
);

CREATE TABLE IF NOT EXISTS membership_package_group (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  group_no TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  billing_cycle TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  display_channel TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, group_no)
);

CREATE TABLE IF NOT EXISTS membership_package (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  package_no TEXT NOT NULL,
  package_group_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_version_id TEXT NOT NULL,
  sku_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price_amount TEXT NOT NULL,
  original_price_amount TEXT,
  currency_code TEXT NOT NULL,
  point_amount INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL,
  recurrence_cycle TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  recommended INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, package_no)
);

CREATE TABLE IF NOT EXISTS membership_subscription (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  subscription_no TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  owner_user_id TEXT,
  plan_id TEXT NOT NULL,
  plan_version_id TEXT NOT NULL,
  package_id TEXT,
  current_period_id TEXT,
  source_order_id TEXT,
  source_payment_intent_id TEXT,
  status TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  grace_until TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, subscription_no),
  UNIQUE (tenant_id, source_order_id, source_payment_intent_id)
);

CREATE TABLE IF NOT EXISTS membership_period (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  period_no TEXT NOT NULL,
  subscription_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_version_id TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  status TEXT NOT NULL,
  source_order_id TEXT,
  source_payment_intent_id TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, period_no)
);

CREATE TABLE IF NOT EXISTS promotion_offer (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  offer_no TEXT NOT NULL,
  offer_code TEXT NOT NULL,
  name TEXT NOT NULL,
  offer_type TEXT NOT NULL,
  audience_scope TEXT NOT NULL,
  combinability TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  current_offer_version_id TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, offer_no),
  UNIQUE (tenant_id, organization_id, offer_code)
);

CREATE TABLE IF NOT EXISTS promotion_offer_version (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  offer_id TEXT NOT NULL,
  version_no TEXT NOT NULL,
  lifecycle_status TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value TEXT NOT NULL,
  minimum_amount TEXT NOT NULL DEFAULT '0',
  maximum_discount_amount TEXT,
  currency_code TEXT,
  rule_json TEXT NOT NULL,
  stack_rule_json TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, offer_id, version_no)
);

CREATE TABLE IF NOT EXISTS promotion_coupon_stock (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  stock_no TEXT NOT NULL,
  name TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  offer_version_id TEXT NOT NULL,
  stock_type TEXT NOT NULL,
  total_quantity INTEGER,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  claimed_quantity INTEGER NOT NULL DEFAULT 0,
  redeemed_quantity INTEGER NOT NULL DEFAULT 0,
  locked_quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  starts_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, stock_no)
);

CREATE TABLE IF NOT EXISTS promotion_code (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  code_no TEXT NOT NULL,
  stock_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  offer_version_id TEXT NOT NULL,
  promotion_code TEXT NOT NULL,
  code_type TEXT NOT NULL,
  max_claims INTEGER NOT NULL DEFAULT 1,
  claimed_quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  starts_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, code_no),
  UNIQUE (tenant_id, promotion_code)
);

CREATE TABLE IF NOT EXISTS promotion_user_coupon (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  coupon_no TEXT NOT NULL,
  stock_id TEXT NOT NULL,
  code_id TEXT,
  offer_id TEXT NOT NULL,
  offer_version_id TEXT NOT NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  owner_user_id TEXT,
  coupon_code TEXT NOT NULL,
  status TEXT NOT NULL,
  claimed_at TEXT,
  valid_from TEXT,
  expires_at TEXT,
  redeemed_at TEXT,
  disabled_at TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, coupon_no),
  UNIQUE (tenant_id, coupon_code)
);

CREATE TABLE IF NOT EXISTS promotion_coupon_ledger_entry (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  ledger_no TEXT NOT NULL,
  user_coupon_id TEXT,
  stock_id TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  subject_type TEXT,
  subject_id TEXT,
  direction TEXT NOT NULL,
  quantity_delta INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  business_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, ledger_no),
  UNIQUE (tenant_id, request_no)
);

CREATE TABLE IF NOT EXISTS promotion_discount_application (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  application_no TEXT NOT NULL,
  offer_id TEXT NOT NULL,
  offer_version_id TEXT NOT NULL,
  user_coupon_id TEXT,
  order_id TEXT NOT NULL,
  order_no TEXT,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  discount_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  applied_at TEXT NOT NULL,
  rolled_back_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, application_no),
  UNIQUE (tenant_id, order_id, user_coupon_id)
);

CREATE TABLE IF NOT EXISTS promotion_discount_allocation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  application_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  order_item_id TEXT,
  sku_id TEXT,
  allocation_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, application_id, order_item_id)
);

CREATE TABLE IF NOT EXISTS commerce_product_category (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  category_no TEXT NOT NULL,
  parent_id TEXT,
  path TEXT NOT NULL,
  level_no INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, category_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_attribute (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  attribute_no TEXT NOT NULL,
  name TEXT NOT NULL,
  value_type TEXT NOT NULL,
  scope TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, attribute_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_attribute_value (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  attribute_id TEXT NOT NULL,
  value_code TEXT NOT NULL,
  display_value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, attribute_id, value_code)
);

CREATE TABLE IF NOT EXISTS commerce_product_spu (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  spu_no TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  product_type TEXT NOT NULL,
  category_id TEXT,
  status TEXT NOT NULL,
  published_at TEXT,
  visible_surfaces TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, spu_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_spu_category (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  spu_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  primary_flag INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, spu_id, category_id)
);

CREATE TABLE IF NOT EXISTS commerce_product_sku (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  spu_id TEXT NOT NULL,
  sku_no TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  price_amount TEXT NOT NULL,
  original_price_amount TEXT,
  currency_code TEXT NOT NULL,
  fulfillment_type TEXT NOT NULL,
  inventory_tracking TEXT NOT NULL,
  status TEXT NOT NULL,
  published_at TEXT,
  spec_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_sku_attribute (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  sku_id TEXT NOT NULL,
  attribute_id TEXT NOT NULL,
  attribute_value_id TEXT NOT NULL,
  custom_value TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_id, attribute_id)
);

CREATE TABLE IF NOT EXISTS commerce_product_media (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  media_type TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_price_list (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  price_list_no TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  market_code TEXT,
  status TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, price_list_no)
);

CREATE TABLE IF NOT EXISTS commerce_price_list_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  price_list_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  price_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, price_list_id, sku_id)
);

CREATE TABLE IF NOT EXISTS commerce_recharge_package (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  package_no TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  bonus_points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  valid_from TEXT,
  valid_to TEXT,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, package_no)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_stock (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  sold_quantity INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_reservation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  reservation_no TEXT NOT NULL,
  order_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  released_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, reservation_no)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_movement (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  movement_no TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  business_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, movement_no)
);

CREATE TABLE IF NOT EXISTS commerce_cart (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, owner_user_id, status)
);

CREATE TABLE IF NOT EXISTS commerce_cart_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cart_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  selected INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, cart_id, sku_id)
);

CREATE TABLE IF NOT EXISTS commerce_user_address (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  country_code TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  detail_address TEXT NOT NULL,
  postal_code TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_order (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_no TEXT NOT NULL,
  status TEXT NOT NULL,
  subject TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  cancelled_at TEXT,
  expired_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, order_no)
);

CREATE TABLE IF NOT EXISTS commerce_order_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_amount TEXT NOT NULL,
  total_amount TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_order_amount_breakdown (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  original_amount TEXT NOT NULL,
  discount_amount TEXT NOT NULL,
  payable_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, order_id)
);

CREATE TABLE IF NOT EXISTS commerce_payment_intent (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_attempt (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  out_trade_no TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  callback_payload TEXT,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, provider_code, out_trade_no)
);

CREATE TABLE IF NOT EXISTS commerce_payment_webhook_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  provider_code TEXT NOT NULL,
  event_id TEXT NOT NULL,
  nonce TEXT NOT NULL,
  signature TEXT,
  request_timestamp INTEGER,
  out_trade_no TEXT NOT NULL,
  transaction_id TEXT,
  payload_digest TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  processed_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, provider_code, event_id),
  UNIQUE (tenant_id, provider_code, nonce)
);

CREATE TABLE IF NOT EXISTS commerce_payment_method (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  method_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, method_key)
);

CREATE TABLE IF NOT EXISTS commerce_payment_provider (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  provider_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  provider_type TEXT NOT NULL,
  supported_countries TEXT,
  supported_currencies TEXT,
  supported_methods TEXT,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, provider_code)
);

CREATE TABLE IF NOT EXISTS commerce_payment_provider_account (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  account_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  merchant_id TEXT NOT NULL,
  environment TEXT NOT NULL,
  country_code TEXT NOT NULL,
  settlement_currency TEXT NOT NULL,
  secret_ref TEXT NOT NULL,
  webhook_secret_ref TEXT,
  certificate_ref TEXT,
  status TEXT NOT NULL,
  rotated_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, account_no)
);

CREATE TABLE IF NOT EXISTS commerce_payment_channel (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  channel_no TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  method_id TEXT NOT NULL,
  scene_code TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, channel_no)
);

CREATE TABLE IF NOT EXISTS commerce_payment_route_rule (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  rule_no TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  purchase_type TEXT,
  country_code TEXT,
  currency_code TEXT,
  client_platform TEXT,
  amount_min TEXT,
  amount_max TEXT,
  user_segment TEXT,
  risk_level TEXT,
  channel_id TEXT NOT NULL,
  status TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, rule_no)
);

CREATE TABLE IF NOT EXISTS commerce_payment_provider_capability (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  capability_code TEXT NOT NULL,
  payment_method TEXT,
  scene_code TEXT,
  country_code TEXT,
  currency_code TEXT,
  min_amount TEXT,
  max_amount TEXT,
  supported_statement_types TEXT,
  supported_webhook_events TEXT,
  native_operation_codes TEXT,
  status TEXT NOT NULL,
  effective_from TEXT,
  effective_to TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_operation_attempt (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  operation_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  channel_id TEXT,
  operation_code TEXT NOT NULL,
  sdkwork_resource_type TEXT NOT NULL,
  sdkwork_resource_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_digest TEXT NOT NULL,
  response_digest TEXT,
  native_request_id TEXT,
  native_trade_id TEXT,
  native_refund_id TEXT,
  http_status INTEGER,
  provider_error_code TEXT,
  provider_error_message TEXT,
  retryable TEXT,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_route_decision (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  payment_intent_id TEXT NOT NULL,
  payment_attempt_id TEXT NOT NULL,
  route_rule_id TEXT,
  channel_id TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  payment_method TEXT NOT NULL,
  scene_code TEXT NOT NULL,
  country_code TEXT,
  currency_code TEXT NOT NULL,
  amount TEXT NOT NULL,
  risk_level TEXT,
  decision_reason TEXT,
  fallback_from_channel_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_capture (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  capture_no TEXT NOT NULL,
  payment_attempt_id TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  native_capture_id TEXT,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  final_capture INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL,
  failure_code TEXT,
  failure_message TEXT,
  submitted_at TEXT,
  succeeded_at TEXT,
  failed_at TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_webhook_delivery (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  delivery_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  event_id TEXT NOT NULL,
  nonce TEXT NOT NULL,
  request_timestamp INTEGER,
  signature TEXT,
  signature_algorithm TEXT,
  headers_json TEXT,
  payload_digest TEXT NOT NULL,
  payload_ref TEXT,
  source_ip TEXT,
  user_agent TEXT,
  verification_status TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  failure_code TEXT,
  failure_message TEXT,
  received_at TEXT NOT NULL,
  verified_at TEXT,
  normalized_event_id TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_statement (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  statement_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  statement_type TEXT NOT NULL,
  settlement_currency TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  provider_statement_id TEXT,
  file_ref TEXT,
  file_digest TEXT,
  download_status TEXT NOT NULL,
  parse_status TEXT NOT NULL,
  row_count INTEGER NOT NULL DEFAULT 0,
  total_amount TEXT NOT NULL DEFAULT '0',
  fee_amount TEXT NOT NULL DEFAULT '0',
  net_amount TEXT NOT NULL DEFAULT '0',
  downloaded_at TEXT,
  parsed_at TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_statement_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  statement_id TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  row_no TEXT NOT NULL,
  native_trade_id TEXT,
  native_refund_id TEXT,
  native_order_no TEXT,
  sdkwork_out_trade_no TEXT,
  sdkwork_out_refund_no TEXT,
  transaction_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  settled_at TEXT,
  gross_amount TEXT NOT NULL,
  fee_amount TEXT NOT NULL DEFAULT '0',
  net_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  provider_status TEXT,
  raw_row_digest TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_reconciliation_run (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  run_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  statement_id TEXT,
  reconciliation_type TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  status TEXT NOT NULL,
  matched_count INTEGER NOT NULL DEFAULT 0,
  mismatched_count INTEGER NOT NULL DEFAULT 0,
  unmatched_count INTEGER NOT NULL DEFAULT 0,
  total_difference_amount TEXT NOT NULL DEFAULT '0',
  currency_code TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_reconciliation_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  reconciliation_run_id TEXT NOT NULL,
  statement_id TEXT,
  statement_item_id TEXT,
  payment_attempt_id TEXT,
  refund_id TEXT,
  refund_attempt_id TEXT,
  provider_code TEXT NOT NULL,
  difference_type TEXT NOT NULL,
  match_status TEXT NOT NULL,
  internal_amount TEXT,
  provider_amount TEXT,
  difference_amount TEXT,
  currency_code TEXT,
  internal_status TEXT,
  provider_status TEXT,
  resolution_status TEXT NOT NULL,
  resolution_note TEXT,
  resolved_by TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_fee (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  payment_attempt_id TEXT,
  refund_id TEXT,
  statement_item_id TEXT,
  fee_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_dispute (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  dispute_no TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  payment_attempt_id TEXT NOT NULL,
  native_dispute_id TEXT NOT NULL,
  reason_code TEXT,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  evidence_due_at TEXT,
  opened_at TEXT NOT NULL,
  closed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_dispute_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  event_no TEXT NOT NULL,
  dispute_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_refund (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  payment_attempt_id TEXT NOT NULL,
  refund_no TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, refund_no)
);

CREATE TABLE IF NOT EXISTS commerce_refund_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  refund_id TEXT NOT NULL,
  order_item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  refund_amount TEXT NOT NULL,
  tax_refund_amount TEXT NOT NULL DEFAULT '0',
  shipping_refund_amount TEXT NOT NULL DEFAULT '0',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_refund_attempt (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  refund_attempt_no TEXT NOT NULL,
  refund_id TEXT NOT NULL,
  provider_code TEXT NOT NULL,
  provider_account_id TEXT,
  out_refund_no TEXT NOT NULL,
  provider_refund_id TEXT,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  failure_code TEXT,
  failure_message TEXT,
  submitted_at TEXT,
  succeeded_at TEXT,
  failed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_refund_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  event_no TEXT NOT NULL,
  refund_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  reason_code TEXT,
  message TEXT,
  payload_json TEXT,
  request_id TEXT,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_exchange_rule (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  rule_no TEXT NOT NULL,
  source_asset_type TEXT NOT NULL,
  target_asset_type TEXT NOT NULL,
  rate TEXT NOT NULL,
  status TEXT NOT NULL,
  remark TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, source_asset_type, target_asset_type)
);

CREATE TABLE IF NOT EXISTS commerce_invoice_title (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  title_type TEXT NOT NULL,
  name TEXT NOT NULL,
  tax_no TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_invoice (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  title_id TEXT NOT NULL,
  status TEXT NOT NULL,
  invoice_no TEXT,
  invoice_code TEXT,
  document_url TEXT,
  created_at TEXT NOT NULL,
  issued_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_invoice_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  order_item_id TEXT,
  title TEXT NOT NULL,
  amount TEXT NOT NULL,
  tax_amount TEXT NOT NULL DEFAULT '0',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commerce_idempotency_key_tenant_key
  ON commerce_idempotency_key (tenant_id, scope, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_account_owner_asset
  ON commerce_account (tenant_id, owner_user_id, asset_type, currency_code);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_account_created_at
  ON commerce_account_ledger_entry (tenant_id, account_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_request_no
  ON commerce_account_ledger_entry (tenant_id, request_no);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_idempotency_key
  ON commerce_account_ledger_entry (tenant_id, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_prehold_request_no
  ON commerce_billing_prehold (tenant_id, request_no);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_prehold_status_expires_at
  ON commerce_billing_prehold (tenant_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_history_owner_occurred_at
  ON commerce_billing_history (tenant_id, owner_user_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_history_owner_type_occurred_at
  ON commerce_billing_history (tenant_id, owner_user_id, history_type, occurred_at);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_history_source
  ON commerce_billing_history (tenant_id, source_type, source_id);

CREATE INDEX IF NOT EXISTS idx_benefit_definition_code_status
  ON benefit_definition (tenant_id, organization_id, benefit_code, status);

CREATE INDEX IF NOT EXISTS idx_entitlement_grant_subject_status
  ON entitlement_grant (tenant_id, subject_type, subject_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_entitlement_grant_source
  ON entitlement_grant (tenant_id, source_type, source_id);

CREATE INDEX IF NOT EXISTS idx_entitlement_account_subject_status
  ON entitlement_account (tenant_id, subject_type, subject_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_entitlement_ledger_entry_account_occurred_at
  ON entitlement_ledger_entry (tenant_id, account_id, occurred_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_organization
  ON commerce_shop (tenant_id, organization_id, operation_status);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_status
  ON commerce_shop (tenant_id, operation_status, storefront_status, updated_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_review_status
  ON commerce_shop (tenant_id, organization_id, review_status, updated_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_application_review
  ON commerce_shop_application (tenant_id, shop_id, review_status, submitted_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_verification_status
  ON commerce_shop_verification (tenant_id, shop_id, verification_status, verification_type);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_status_event_shop_created
  ON commerce_shop_status_event (tenant_id, shop_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_channel_shop_code
  ON commerce_shop_channel (tenant_id, shop_id, channel_code);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_fulfillment_profile_shop
  ON commerce_shop_fulfillment_profile (tenant_id, shop_id);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_settlement_profile_status
  ON commerce_shop_settlement_profile (tenant_id, settlement_status, reviewed_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_metric_snapshot_shop_date
  ON commerce_shop_metric_snapshot (tenant_id, shop_id, snapshot_date);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_readiness_status
  ON commerce_shop_readiness (tenant_id, shop_id, readiness_status, evaluated_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_business_hour_shop
  ON commerce_shop_business_hour (tenant_id, shop_id, status, effective_from);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_shop_service_area_scope
  ON commerce_shop_service_area (tenant_id, shop_id, area_type, country_code, area_key);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_service_area_region
  ON commerce_shop_service_area (tenant_id, region_code, city_code, service_status);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_policy_type_status
  ON commerce_shop_policy (tenant_id, shop_id, policy_type, policy_status);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_deposit_account_status
  ON commerce_shop_deposit_account (tenant_id, deposit_status, due_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_risk_signal_status
  ON commerce_shop_risk_signal (tenant_id, shop_id, signal_status, risk_level, detected_at);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_category_binding_status
  ON commerce_shop_category_binding (tenant_id, shop_id, category_status, review_status);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_brand_authorization_status
  ON commerce_shop_brand_authorization (tenant_id, shop_id, authorization_status, brand_code);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_qualification_status
  ON commerce_shop_qualification (tenant_id, shop_id, qualification_status, qualification_type);

CREATE INDEX IF NOT EXISTS idx_commerce_shop_customer_service_status
  ON commerce_shop_customer_service (tenant_id, shop_id, service_channel, is_default, service_status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_shop_customer_service_single_default
  ON commerce_shop_customer_service (tenant_id, shop_id, service_channel)
  WHERE is_default = 1;

CREATE INDEX IF NOT EXISTS idx_commerce_shop_return_address_default
  ON commerce_shop_return_address (tenant_id, shop_id, address_usage, is_default, address_status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_shop_return_address_single_default
  ON commerce_shop_return_address (tenant_id, shop_id, address_usage)
  WHERE is_default = 1;

CREATE INDEX IF NOT EXISTS idx_commerce_shop_shipping_template_status
  ON commerce_shop_shipping_template (tenant_id, shop_id, delivery_method, is_default, template_status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_shop_shipping_template_single_default
  ON commerce_shop_shipping_template (tenant_id, shop_id, delivery_method)
  WHERE is_default = 1;

CREATE INDEX IF NOT EXISTS idx_commerce_product_category_parent_status
  ON commerce_product_category (tenant_id, organization_id, parent_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_attribute_status
  ON commerce_product_attribute (tenant_id, organization_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_category_status
  ON commerce_product_spu (tenant_id, organization_id, category_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_category_category
  ON commerce_product_spu_category (tenant_id, organization_id, category_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_category_spu
  ON commerce_product_spu_category (tenant_id, organization_id, spu_id, primary_flag, sort_order);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_type_status
  ON commerce_product_spu (tenant_id, organization_id, product_type, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_sku_spu_status
  ON commerce_product_sku (tenant_id, spu_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_sku_price_status
  ON commerce_product_sku (tenant_id, organization_id, price_amount, currency_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_media_owner
  ON commerce_product_media (tenant_id, organization_id, owner_type, owner_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_price_list_market_status
  ON commerce_price_list (tenant_id, organization_id, market_code, currency_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_price_list_item_sku
  ON commerce_price_list_item (tenant_id, sku_id, currency_code);

CREATE INDEX IF NOT EXISTS idx_commerce_recharge_package_amount_status
  ON commerce_recharge_package (tenant_id, organization_id, price_amount, currency_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_stock_sku_warehouse
  ON commerce_inventory_stock (tenant_id, sku_id, warehouse_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_reservation_order_status
  ON commerce_inventory_reservation (tenant_id, order_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_reservation_expires_at
  ON commerce_inventory_reservation (tenant_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_movement_source
  ON commerce_inventory_movement (tenant_id, source_id, business_type);

CREATE INDEX IF NOT EXISTS idx_commerce_cart_owner_status
  ON commerce_cart (tenant_id, owner_user_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_cart_item_cart_sku
  ON commerce_cart_item (tenant_id, cart_id, sku_id);

CREATE INDEX IF NOT EXISTS idx_commerce_user_address_owner_default
  ON commerce_user_address (tenant_id, owner_user_id, is_default, status);

CREATE INDEX IF NOT EXISTS idx_commerce_order_owner_status_created_at
  ON commerce_order (tenant_id, owner_user_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_order_no
  ON commerce_order (tenant_id, order_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_intent_order
  ON commerce_payment_intent (tenant_id, order_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_attempt_provider_code_trade_no
  ON commerce_payment_attempt (tenant_id, provider_code, out_trade_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_provider_code_event
  ON commerce_payment_webhook_event (tenant_id, provider_code, event_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_provider_code_nonce
  ON commerce_payment_webhook_event (tenant_id, provider_code, nonce);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_status_processed_at
  ON commerce_payment_webhook_event (tenant_id, status, processed_at);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_method_status
  ON commerce_payment_method (tenant_id, organization_id, status, sort_order);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_provider_status
  ON commerce_payment_provider (tenant_id, organization_id, status, sort_order);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_provider_account_provider
  ON commerce_payment_provider_account (tenant_id, organization_id, provider_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_channel_route
  ON commerce_payment_channel (tenant_id, organization_id, method_id, scene_code, currency_code, country_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_route_rule_match
  ON commerce_payment_route_rule (tenant_id, organization_id, status, purchase_type, country_code, currency_code, client_platform, priority);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_provider_capability_scope
  ON commerce_payment_provider_capability (tenant_id, provider_account_id, capability_code, payment_method, scene_code, country_code, currency_code);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_provider_capability_lookup
  ON commerce_payment_provider_capability (tenant_id, organization_id, provider_code, capability_code, status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_operation_attempt_no
  ON commerce_payment_operation_attempt (tenant_id, operation_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_operation_attempt_idempotency
  ON commerce_payment_operation_attempt (tenant_id, provider_code, operation_code, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_operation_attempt_resource
  ON commerce_payment_operation_attempt (tenant_id, sdkwork_resource_type, sdkwork_resource_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_operation_attempt_native_request
  ON commerce_payment_operation_attempt (tenant_id, provider_code, native_request_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_route_decision_attempt
  ON commerce_payment_route_decision (tenant_id, payment_attempt_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_route_decision_intent
  ON commerce_payment_route_decision (tenant_id, payment_intent_id, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_capture_no
  ON commerce_payment_capture (tenant_id, capture_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_capture_native
  ON commerce_payment_capture (tenant_id, provider_code, native_capture_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_capture_attempt_status
  ON commerce_payment_capture (tenant_id, payment_attempt_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_webhook_delivery_event
  ON commerce_payment_webhook_delivery (tenant_id, provider_code, event_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_webhook_delivery_nonce
  ON commerce_payment_webhook_delivery (tenant_id, provider_code, nonce);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_delivery_status
  ON commerce_payment_webhook_delivery (tenant_id, provider_code, delivery_status, received_at);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_statement_no
  ON commerce_payment_statement (tenant_id, statement_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_statement_scope
  ON commerce_payment_statement (tenant_id, provider_code, provider_account_id, statement_type, period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_statement_period
  ON commerce_payment_statement (tenant_id, provider_code, period_start, period_end);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_statement_item_row
  ON commerce_payment_statement_item (tenant_id, statement_id, row_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_statement_item_trade
  ON commerce_payment_statement_item (tenant_id, provider_code, native_trade_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_statement_item_out_trade
  ON commerce_payment_statement_item (tenant_id, sdkwork_out_trade_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_reconciliation_run_no
  ON commerce_payment_reconciliation_run (tenant_id, run_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_reconciliation_run_idempotency
  ON commerce_payment_reconciliation_run (tenant_id, provider_code, reconciliation_type, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_reconciliation_run_status
  ON commerce_payment_reconciliation_run (tenant_id, provider_code, status, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_reconciliation_run_period
  ON commerce_payment_reconciliation_run (tenant_id, provider_code, period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_reconciliation_item_run_status
  ON commerce_payment_reconciliation_item (tenant_id, reconciliation_run_id, match_status);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_reconciliation_item_resolution
  ON commerce_payment_reconciliation_item (tenant_id, difference_type, resolution_status);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_reconciliation_item_payment
  ON commerce_payment_reconciliation_item (tenant_id, payment_attempt_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_fee_payment
  ON commerce_payment_fee (tenant_id, payment_attempt_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_fee_refund
  ON commerce_payment_fee (tenant_id, refund_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_dispute_no
  ON commerce_payment_dispute (tenant_id, dispute_no);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_dispute_native
  ON commerce_payment_dispute (tenant_id, provider_code, native_dispute_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_dispute_payment_status
  ON commerce_payment_dispute (tenant_id, payment_attempt_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_payment_dispute_event_no
  ON commerce_payment_dispute_event (tenant_id, event_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_dispute_event_created
  ON commerce_payment_dispute_event (tenant_id, dispute_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_refund_payment
  ON commerce_refund (tenant_id, payment_attempt_id);

CREATE INDEX IF NOT EXISTS idx_commerce_refund_item_refund
  ON commerce_refund_item (tenant_id, refund_id, order_item_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_refund_attempt_out_no
  ON commerce_refund_attempt (tenant_id, provider_code, out_refund_no);

CREATE INDEX IF NOT EXISTS idx_commerce_refund_attempt_status
  ON commerce_refund_attempt (tenant_id, refund_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS uk_commerce_refund_event_no
  ON commerce_refund_event (tenant_id, event_no);

CREATE INDEX IF NOT EXISTS idx_commerce_refund_event_created
  ON commerce_refund_event (tenant_id, refund_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_exchange_rule_pair_status
  ON commerce_exchange_rule (tenant_id, organization_id, source_asset_type, target_asset_type, status);

CREATE INDEX IF NOT EXISTS idx_membership_plan_status
  ON membership_plan (tenant_id, organization_id, status, rank);

CREATE INDEX IF NOT EXISTS idx_membership_plan_code
  ON membership_plan (tenant_id, organization_id, plan_code);

CREATE INDEX IF NOT EXISTS idx_membership_plan_version_plan_status
  ON membership_plan_version (tenant_id, plan_id, lifecycle_status);

CREATE INDEX IF NOT EXISTS idx_membership_plan_benefit_plan_version
  ON membership_plan_benefit (tenant_id, plan_version_id, benefit_id, status);

CREATE INDEX IF NOT EXISTS idx_membership_package_group_status
  ON membership_package_group (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_membership_package_status
  ON membership_package (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_membership_package_group_plan
  ON membership_package (tenant_id, package_group_id, plan_id, status);

CREATE INDEX IF NOT EXISTS idx_membership_subscription_subject_status
  ON membership_subscription (tenant_id, subject_type, subject_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_membership_period_subscription_range
  ON membership_period (tenant_id, subscription_id, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS idx_promotion_offer_status
  ON promotion_offer (tenant_id, organization_id, status, starts_at, ends_at);

CREATE INDEX IF NOT EXISTS idx_promotion_offer_code
  ON promotion_offer (tenant_id, organization_id, offer_code);

CREATE INDEX IF NOT EXISTS idx_promotion_offer_current_version
  ON promotion_offer (tenant_id, current_offer_version_id);

CREATE INDEX IF NOT EXISTS idx_promotion_offer_version_offer_status
  ON promotion_offer_version (tenant_id, offer_id, lifecycle_status);

CREATE INDEX IF NOT EXISTS idx_promotion_coupon_stock_offer_status
  ON promotion_coupon_stock (tenant_id, offer_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_promotion_code_code
  ON promotion_code (tenant_id, promotion_code);

CREATE INDEX IF NOT EXISTS idx_promotion_code_stock_status
  ON promotion_code (tenant_id, stock_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_promotion_user_coupon_subject_status
  ON promotion_user_coupon (tenant_id, subject_type, subject_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_promotion_discount_application_order
  ON promotion_discount_application (tenant_id, order_id, status);

CREATE INDEX IF NOT EXISTS idx_promotion_discount_allocation_application_item
  ON promotion_discount_allocation (tenant_id, application_id, order_item_id);

CREATE INDEX IF NOT EXISTS idx_commerce_invoice_order_payment
  ON commerce_invoice (tenant_id, order_id, payment_id);

CREATE INDEX IF NOT EXISTS idx_commerce_invoice_owner_status
  ON commerce_invoice (tenant_id, owner_user_id, status);
