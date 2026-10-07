# Lease contract and authority

Permanent source contract: woia-re-domain-contracts v0.5.0, commit
fb1c8a3f7fb116f2a00daf05ae335fdfbc7c3f3f, tree
f3ff5a68a0d5df2e615a650eddc313c9585b7f08. Resolve canonical Lease relations,
source authority, exact financial boundaries and Rental E2E specifications there.
Historical planning derivation is retained in external implementation evidence only.

The reducer owns Lease lifecycle and contextual participants only. A new accepted
version appends terms and returns DRAFT: prior signatures and activation decisions
cannot authorize changed terms. accepted_version.terms_digest must match exact
terms_ref/property_refs/mandate_ref. Physical handover evidence remains independent
of contract activation/termination. Activation rules specify required fact kinds
without inventing organizational prerequisites. Unknown or absent required facts
fail closed. Each fact is accepted by the competent scoped source writer with exact
organization, target, LeaseVersion, policy, effective source map and freshness.

Leasing is lifecycle writer until accepted administration transfer to Asset Management
(Property Management); subsequent commands require that writer. Before transition,
current authentication, action/resource/purpose/time, revocations, holds, emergency
stop and policy are checked. Mutations additionally require competent human acceptance
bound to action/target/payload digest. No actor may approve itself. Host adapters must
resolve trusted snapshots; public JSON is a protocol, not a cryptographic permission.

Operation IDs bind full payload/evidence/action and expected revisions prevent lost
updates. Caller persists atomically. History is append-only; prior versions are not
mutated. No infrastructure, identity copies, contact dispatch, legal validity claims,
monetary booking or deposit release is implemented. An evaluation returns only an
exact accepted rule reference proposal; Finance determines and executes consequences.
Termination alone does not prove vacancy, money settlement, deposit refund or keys.

Tests cover authority/source negatives, changed terms, stale version/facts, physical
handover, bounded import, lifecycle, writer transfer, replay and concurrency. These
are synthetic engineering tests, not organization acceptance or Operator E2E.
