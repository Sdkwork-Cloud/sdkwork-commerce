# @sdkwork/membership-admin-pc-react

Admin membership management package for SDKWork PC React applications.

This package owns the admin-facing membership management surface. It uses the shared
`@sdkwork/commerce-service` SDK boundary and calls `admin.memberships.*` resources for:

- membership levels
- membership packages
- membership records
- membership entitlement inventory

Runtime ownership stays separated from user-facing membership purchase flows:
`@sdkwork/membership-pc-react` owns member dashboards and purchase actions, while this
package owns admin review and mutation workflows.
