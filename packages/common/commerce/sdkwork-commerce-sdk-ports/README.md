# @sdkwork/commerce-sdk-ports

Generated app and backend SDK port contracts for the commerce foundation.

The standard generated SDK surfaces are `appClient.commerce.*` and `backendClient.commerce.*`. Account, wallet, points, token, order, payment, invoice, membership package, privilege, checkout, and reporting resources stay under domain-oriented commerce resource trees. Retired top-level shortcut roots are rejected so reusable appbase packages consume only the generated commerce SDK boundary.
