import {begin, finish, fields, references, human, requireValue as need, time, digest} from './guard.mjs';
export const actions = ['lease.create','lease.version','lease.activate','lease.renew','lease.terminate','lease.participant.link','lease.handover.record','lease.obligation.evaluate','lease.adjustment.evaluate'];
const kinds = ['signature','initial-money','possession','administration-transfer'];
export const initialState = organization => ({organization, revision:0, operations:{}, history:[], leases:{}});
const copy = x => structuredClone(x);
function contribution(r, f, kind, version) {
  const s = f?.source_authority;
  need(f?.kind === kind && f.organization === r.organization && f.target === r.target && f.lease_version === version && f.status === 'ACCEPTED' && f.reference && f.version && f.accepted_by && f.policy_revision === r.authority.policy_revision && f.current === true && !f.revoked && !f.conflict && time(f.recorded_at) <= time(r.now) && time(r.now) < time(f.fresh_until), 'EXACT_ACCEPTED_FACT_REQUIRED');
  need(s?.organization === r.organization && s.writer === f.accepted_by && s.source === f.source && s.map_revision && s.targets?.includes(r.target) && s.fact_kinds?.includes(kind) && s.current === true && !s.revoked && !s.conflict && time(r.now) >= time(s.valid_from) && time(r.now) < time(s.valid_until), 'CONTRIBUTION_SOURCE_SCOPE');
  need(r.authority.resources.includes(f.reference), 'CONTRIBUTION_ACCESS_DENIED');
}
function terms(r, p, version) {
  fields(p,['terms_ref','property_refs','mandate_ref','accepted_version','activation_rule','import_source']);
  need(p.terms_ref && p.mandate_ref && p.activation_rule, 'TERMS_AND_RULE_REQUIRED');
  references(r,[p.terms_ref,p.mandate_ref,...(p.property_refs ?? [])]);
  contribution(r,p.accepted_version,'lease-version',version);
  need(p.accepted_version.terms_digest === digest({terms_ref:p.terms_ref,property_refs:p.property_refs,mandate_ref:p.mandate_ref}), 'ACCEPTED_TERMS_MISMATCH');
  contribution(r,p.activation_rule,'activation-rule',version);
  need(Array.isArray(p.activation_rule.required_facts) && p.activation_rule.required_facts.every(k => kinds.includes(k)) && new Set(p.activation_rule.required_facts).size === p.activation_rule.required_facts.length,'INVALID_ACTIVATION_RULE');
  if(p.import_source) { fields(p.import_source,['existing_lease_ref','source_version','accepted_property','administration_mandate']); references(r,[p.import_source.existing_lease_ref]); need(p.import_source.source_version,'IMPORT_SOURCE_VERSION_REQUIRED'); contribution(r,p.import_source.accepted_property,'property',version); contribution(r,p.import_source.administration_mandate,'administration-mandate',version); }
  return {...copy(p),version,facts:[],participants:[]};
}
export function apply(state,r) {
  const ctx=begin(state,r,actions,'woia-re-lease-administration');
  need(r.evidence.fact_kind === r.action,'ACTION_FACT_KIND_MISMATCH');
  if(ctx.replay) return {state:ctx.next,result:ctx.replay};
  const p=r.payload, next=ctx.next;
  need(typeof r.target === 'string' && r.target !== '__proto__' && r.target !== 'constructor','INVALID_LEASE_ID');
  let lease=Object.hasOwn(next.leases,r.target) ? next.leases[r.target] : null;
  const writer=lease?.writer ?? 'leasing';
  need(r.authority.department === writer,'CURRENT_LEASE_WRITER_REQUIRED');
  if(!r.action.endsWith('.evaluate')) human(r);
  let result;
  if(r.action==='lease.create') {
    need(!lease,'LEASE_ALREADY_EXISTS');
    const v=terms(r,p,1);
    lease={id:r.target,writer:'leasing',status:'DRAFT',versions:[v],current_version:1};
    next.leases[r.target]=lease; result={status:'DRAFT',lease_version:1};
  } else {
    need(lease,'LEASE_NOT_FOUND');
    need(lease.status !== 'TERMINATED' || r.action === 'lease.handover.record','LEASE_TERMINATED');
    const v=lease.versions.at(-1);
    if(r.action==='lease.version'||r.action==='lease.renew') {
      need(r.action!=='lease.renew'||lease.status==='ACTIVE','RENEW_REQUIRES_ACTIVE');
      const version=terms(r,p,lease.current_version+1);
      lease.versions.push(version); lease.current_version=version.version; lease.status='DRAFT';
      result={status:'DRAFT',lease_version:version.version,prior_acceptance_reused:false};
    } else if(r.action==='lease.participant.link') {
      fields(p,['subject_ref','role','accepted_relationship']); references(r,[p.subject_ref]);
      need(p.role,'PARTICIPANT_ROLE_REQUIRED'); contribution(r,p.accepted_relationship,'lease-participant',v.version);
      need(p.accepted_relationship.subject_ref===p.subject_ref && p.accepted_relationship.role===p.role,'PARTICIPANT_ACCEPTANCE_MISMATCH');
      need(!v.participants.some(x=>x.subject_ref===p.subject_ref && x.role===p.role),'DUPLICATE_PARTICIPANT');
      v.participants.push(copy(p));result={linked:true,lease_version:v.version};
    } else if(r.action==='lease.handover.record') {
      fields(p,['fact']); need(p.fact?.kind === 'possession','PHYSICAL_HANDOVER_REQUIRED'); contribution(r,p.fact,p.fact.kind,v.version);
      need(!v.facts.some(f=>f.kind===p.fact.kind && f.version===p.fact.version),'DUPLICATE_FACT_VERSION');
      v.facts.push(copy(p.fact));
      result={recorded:p.fact.kind,writer:lease.writer,status:lease.status};
    } else if(r.action==='lease.activate') {
      fields(p,['accepted_facts']);need(lease.status==='DRAFT','ACTIVATE_REQUIRES_DRAFT'); need(Array.isArray(p.accepted_facts),'ACTIVATION_FACTS_REQUIRED'); for (const f of p.accepted_facts) { need(kinds.includes(f.kind),'UNOWNED_ACTIVATION_FACT'); contribution(r,f,f.kind,v.version); } need(new Set(p.accepted_facts.map(f=>f.kind)).size === p.accepted_facts.length,'DUPLICATE_ACTIVATION_FACT');
      contribution(r,v.accepted_version,'lease-version',v.version); contribution(r,v.activation_rule,'activation-rule',v.version);
      for(const kind of v.activation_rule.required_facts) {
        const f=p.accepted_facts.find(x=>x.kind===kind); contribution(r,f,kind,v.version);
      }
      const transfer=p.accepted_facts.find(f=>f.kind==='administration-transfer'); if(transfer) {need(transfer.from==='leasing' && transfer.to==='asset-management','INVALID_WRITER_TRANSFER'); lease.writer='asset-management';} lease.activations ??= []; lease.activations.push({lease_version:v.version,accepted_facts:copy(p.accepted_facts),accepted_version:copy(v.accepted_version),activation_rule:copy(v.activation_rule),operation_id:r.operation_id}); lease.status='ACTIVE';result={status:'ACTIVE',lease_version:v.version};
    } else if(r.action==='lease.terminate') {
      fields(p,['accepted_termination']);contribution(r,p.accepted_termination,'termination',v.version);
      lease.status='TERMINATED';result={status:'TERMINATED',deposit_released:false,vacancy_inferred:false};
    } else {
      fields(p,['accepted_rule','period_ref','obligation_ref']);
      need(lease.status==='ACTIVE','EVALUATION_REQUIRES_ACTIVE');
      references(r,[p.period_ref,p.obligation_ref]);
      contribution(r,p.accepted_rule,r.action==='lease.obligation.evaluate'?'obligation-rule':'adjustment-rule',v.version);
      need(p.accepted_rule.expression_ref && r.authority.resources.includes(p.accepted_rule.expression_ref),'EXACT_RULE_EXPRESSION_REQUIRED');
      result={status:'PROPOSED',lease_version:v.version,rule:copy(p.accepted_rule),period_ref:p.period_ref,obligation_ref:p.obligation_ref,proposal_digest:digest(p),financial_effect:false,finance_acceptance_required:true};
    }
  }
  return finish(ctx,r,result);
}
