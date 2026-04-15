import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/anthropic/client';
import { counterProposalTools } from '@/lib/anthropic/tools';
import { buildCounterProposalSystemPrompt } from '@/lib/anthropic/prompts';
import type { CounterProposalResult, RiskFlag } from '@/types/analysis';

export const maxDuration = 60;
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { analysisId, selectedFlagIds } = await request.json();
  const { data: analysis } = await supabase.from('analyses').select('flags_json,summary_text').eq('id', analysisId).eq('user_id', user.id).single();
  if (!analysis) return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
  const { data: prefs } = await supabase.from('user_preferences').select('id,hourly_rate,revision_limit,ip_stance,payment_terms,currency,specialization').eq('id', user.id).single();
  const flags = (analysis.flags_json || []) as RiskFlag[];
  const selected = selectedFlagIds?.length ? flags.filter((f) => selectedFlagIds.includes(f.id)) : flags.filter((f) => f.severity !== 'minor');
  const fallbackPrefs = prefs || { id: user.id, hourly_rate: 100, revision_limit: 2, ip_stance: 'retain', payment_terms: 'net-30', currency: 'USD', specialization: null };
  const response = await anthropic.messages.create({ model: 'claude-sonnet-4-5', max_tokens: 4096, system: buildCounterProposalSystemPrompt(fallbackPrefs), tools: counterProposalTools, tool_choice: { type: 'any' }, messages: [{ role: 'user', content: `Generate counter-proposal:\n${JSON.stringify(selected)}` }] });
  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  const result = toolUse.input as unknown as CounterProposalResult;
  await supabase.from('analyses').update({ counter_json: result.clauses, counter_text: JSON.stringify(result) }).eq('id', analysisId);
  return NextResponse.json({ result });
}
