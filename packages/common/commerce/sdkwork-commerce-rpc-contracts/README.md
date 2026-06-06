# @sdkwork/commerce-rpc-contracts

Canonical SDKWork commerce RPC contract package.

This package owns protobuf service definitions for the first commerce gRPC slice:

- `sdkwork.commerce.app.v3.WalletService`
- `sdkwork.commerce.app.v3.CheckoutService`
- `sdkwork.commerce.backend.v3.PaymentAdminService`
- `sdkwork.commerce.backend.v3.CommerceReportService`

The RPC package is contract-first. Rust manifests in `sdkwork-commerce-rpc-rust`
map every RPC method back to the canonical SDKWork operationId catalog so that
HTTP/OpenAPI, Tauri, and gRPC surfaces stay aligned.
