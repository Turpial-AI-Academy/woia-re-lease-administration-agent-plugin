---
name: woia-re-lease-administration
description: Manage attributable Lease versions, participants, physical handovers and approved transitions; propose obligations and adjustments without financial effects.
license: MIT
---

# Lease Administration

Use for lease.create, lease.version, lease.activate, lease.renew, lease.terminate,
lease.participant.link, lease.handover.record, lease.obligation.evaluate and
lease.adjustment.evaluate. Resolve shared identities and canonical relation contracts
from the published woia-re-domain-contracts; never duplicate its 85 relations.

Read [the contract](references/contract.md) before any transition or financial
proposal. Validate the [command schema](schemas/command.schema.json), resolve current
trusted authority/source-map snapshots, and invoke the pure
[reducer](scripts/lease.mjs). Persist its returned state using atomic expected-revision
compare-and-swap in a separately qualified organization store. No store/adapter is
implemented or claimed here; caller-supplied booleans are not authentication.

1. Resolve organization, actor, purpose, resource access, effective source and writer.
2. Resolve competent human decision for mutations, bound to exact payload digest.
3. Preserve Lease identity and immutable LeaseVersion terms/evidence. Existing
administration imports require accepted Property, administration Mandate and actual
existing Lease source/version; do not create fictional Listing or placement history.
4. Activation requires the exact current accepted version and sourced policy plus
its independently accepted signature, initial money, possession and administrative
transfer conditions. Do not infer any one fact from another. Financial Ledger
alone executes accepted Charge/journal consequences.
5. Handovers record physical possession evidence, including actual return after
termination, without reopening a Lease or releasing funds.
6. Evaluate accepted rule references to an auditable proposal for Finance. No rate,
rounding, fee, legal rule, DBMS, authority or configured organization values are invented.
7. External requests/notices go through Customer Service/Communications. This provider
has no dispatch, payment, accounting or signature execution route.

Report exact state revision, source evidence and unresolved conditions. Unknown,
conflicting, stale or unauthorized inputs block acceptance; never call them satisfied.
Engineering regression is not Operator E2E or Production Ready.
