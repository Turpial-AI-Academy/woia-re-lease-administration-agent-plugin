# Validation

Provider domain regression: mise run test (tests/lease.test.mjs).
Official local schema/skill/link validation plus full tests: mise run ci:fast.
Thin certification from Ecosystem v0.5.4 on the exact clean committed candidate:
mise run plugin:certify-thin --repo <absolute-provider-path>.

Thin centralized gates own clean candidate, official Agent Plugin validation, Agent
Skills validation, payload/root safety, portable archive, and provider-domain
regression. No container or optional adapter is advertised or required here.
Domain tests include exact accepted terms, writer handoff, physical return after
termination, independent activation prerequisites, financial proposals only,
source/freshness/authority rejection, expected revision and idempotency.
Operator E2E=NOT_RUN; Production Ready=false. Certification is engineering evidence.
