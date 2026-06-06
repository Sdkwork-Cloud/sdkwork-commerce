# @sdkwork/commerce-service

Framework-independent commerce service composition.

The service calls only injected generated SDK resources under `appClient.commerce.*` and `backendClient.commerce.*`.
It does not perform raw HTTP, construct auth headers, or import a concrete generated SDK package.
