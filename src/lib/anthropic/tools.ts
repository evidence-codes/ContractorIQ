import type Anthropic from '@anthropic-ai/sdk';

export const analysisTools: Anthropic.Tool[] = [{
  name: 'analyze_contract',
  description: 'Extract and analyze all aspects of a freelance contract or project brief.',
  input_schema: { type: 'object' as const, properties: { summary: { type: 'string' }, risk_score: { type: 'number' }, scope: { type: 'array', items: { type: 'object' } }, flags: { type: 'array', items: { type: 'object' } }, hours: { type: 'array', items: { type: 'object' } } }, required: ['summary', 'risk_score', 'scope', 'flags', 'hours'] }
}];

export const counterProposalTools: Anthropic.Tool[] = [{
  name: 'generate_counter_proposal',
  description: 'Generate professional counter-proposal language for flagged risky clauses.',
  input_schema: { type: 'object' as const, properties: { cover_note: { type: 'string' }, clauses: { type: 'array', items: { type: 'object' } } }, required: ['cover_note', 'clauses'] }
}];
