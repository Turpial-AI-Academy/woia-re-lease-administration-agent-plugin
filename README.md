# WOIA RE Lease Administration v0.5.0

Thin shared-provider for attributable Lease versions, participants and lifecycle,
physical handover and obligation/adjustment proposals. Independent signature, money,
possession and administrative transfer are preserved. No live adapter/store or
external/financial execution is advertised.

See [skill instructions](skills/woia-re-lease-administration/SKILL.md) and
VALIDATION.md in the source checkout. Runtime contracts resolve from published
woia-re-domain-contracts; planning coordination is not a runtime dependency.

Use the pure apply(state, request) export in
skills/woia-re-lease-administration/scripts/lease.mjs behind trusted host authority
resolution and an atomic expected-revision store. No DBMS is selected.

## Local engineering

mise run test
mise run ci:fast

From exact Ecosystem v0.5.4, certify a committed clean candidate:

mise run plugin:certify-thin --repo <absolute-provider-path>

Publication, admission and Operator E2E remain later authorized gates.
