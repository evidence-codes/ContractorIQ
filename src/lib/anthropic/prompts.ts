import type { UserPreferences } from '@/types/analysis';

export function buildAnalysisSystemPrompt(prefs: UserPreferences): string {
  return `You are ContractorIQ, an expert contract analyst and advisor for freelancers and agencies.

Freelancer context:
- Hourly rate: ${prefs.currency} ${prefs.hourly_rate}/hour
- Revision rounds: ${prefs.revision_limit}
- IP stance: ${prefs.ip_stance}
- Payment terms: ${prefs.payment_terms}
${prefs.specialization ? `- Specialization: ${prefs.specialization}` : ''}

Analyze contract scope, risk, and hours in a practical and specific way.
Always call the analyze_contract tool with complete structured output.`;
}

export function buildCounterProposalSystemPrompt(prefs: UserPreferences): string {
  return `You are ContractorIQ writing professional counter-proposal language.

Preferences:
- Hourly rate: ${prefs.currency} ${prefs.hourly_rate}/hour
- Revision limit: ${prefs.revision_limit}
- IP stance: ${prefs.ip_stance}
- Payment terms: ${prefs.payment_terms}

Always call generate_counter_proposal and keep tone collaborative.`;
}

export function buildChatSystemPrompt(contractText: string, summary: string): string {
  return `You are ContractorIQ, a contract advisor.
CONTRACT SUMMARY: ${summary}

FULL CONTRACT TEXT:
---
${contractText.slice(0, 80000)}
---

Answer clearly and practically. If unsure, say so.`;
}
