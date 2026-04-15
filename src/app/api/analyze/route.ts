import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { anthropic } from '@/lib/anthropic/client';
import { analysisTools } from '@/lib/anthropic/tools';
import { buildAnalysisSystemPrompt } from '@/lib/anthropic/prompts';
import type { AnalysisResult, UserPreferences } from '@/types/analysis';
import { sampleAnalysis } from '@/lib/demo/sampleAnalysis';
import OpenAI from 'openai';

export const maxDuration = 120;
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

function withFallbackSummary(base: AnalysisResult): AnalysisResult {
  return {
    ...base,
    summary:
      `${base.summary} ` +
      'Note: this result is a demo fallback because the AI provider is temporarily unavailable (billing/credits).',
  };
}

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function getAnalyzerProvider(): 'anthropic' | 'openai' {
  const raw = (process.env.ANALYZER_PROVIDER || 'anthropic').toLowerCase();
  return raw === 'openai' ? 'openai' : 'anthropic';
}

function buildOpenAIAnalysisPrompt(prefs: UserPreferences, contractText: string): string {
  return `You are ContractorIQ, an expert contract analyst for freelancers/agencies.

Freelancer context:
- Hourly rate: ${prefs.currency} ${prefs.hourly_rate}/hour
- Revision rounds: ${prefs.revision_limit}
- IP stance: ${prefs.ip_stance}
- Payment terms: ${prefs.payment_terms}
${prefs.specialization ? `- Specialization: ${prefs.specialization}` : ''}

Analyze this contract and RETURN ONLY valid JSON with this exact shape:
{
  "summary": string,
  "risk_score": number, // 0-100
  "client_name": string | null,
  "project_name": string | null,
  "contract_type": string | null,
  "scope": [{ "id": string, "task": string, "deliverable": string, "ambiguity_score": number, "ambiguity_reason"?: string, "phase"?: string }],
  "flags": [{ "id": string, "clause": string, "clause_location"?: string, "severity": "critical"|"moderate"|"minor", "category": string, "reason": string, "suggested_fix": string, "impact": string }],
  "hours": [{ "id": string, "task": string, "phase"?: string, "low": number, "mid": number, "high": number, "confidence": "high"|"medium"|"low", "assumptions": string[] }]
}

Contract:
---
${contractText.slice(0, 80000)}
---`;
}

export async function POST(request: NextRequest) {
  let stage = 'initializing analysis request';
  const supabase = await createClient();
  stage = 'loading authenticated user';
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  stage = 'reading analyze payload';
  const { analysisId, extractedText } = await request.json();
  const safeText = sanitizeInput(String(extractedText || ''));
  stage = 'loading user preferences';
  const { data: prefs } = await supabase.from('user_preferences').select('id,hourly_rate,revision_limit,ip_stance,payment_terms,currency,specialization').eq('id', user.id).single();

  stage = 'marking analysis as processing';
  await supabase.from('analyses').update({ status: 'processing' }).eq('id', analysisId);
  try {
    const fallbackPrefs = prefs || { id: user.id, hourly_rate: 100, revision_limit: 2, ip_stance: 'retain', payment_terms: 'net-30', currency: 'USD', specialization: null };
    const provider = getAnalyzerProvider();
    let result: AnalysisResult;

    if (provider === 'openai') {
      stage = 'requesting OpenAI completion';
      const completion = await getOpenAIClient().chat.completions.create({
        model: process.env.OPENAI_ANALYSIS_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'Return only valid JSON.' },
          { role: 'user', content: buildOpenAIAnalysisPrompt(fallbackPrefs, safeText) },
        ],
      });
      stage = 'parsing OpenAI JSON result';
      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error('OpenAI returned empty content');
      result = JSON.parse(raw) as AnalysisResult;
    } else {
      stage = 'requesting Anthropic completion';
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5', max_tokens: 8192, system: buildAnalysisSystemPrompt(fallbackPrefs),
        tools: analysisTools, tool_choice: { type: 'any' }, messages: [{ role: 'user', content: `Please analyze this contract:\n\n${safeText.slice(0, 80000)}` }],
      });

      stage = 'extracting Anthropic tool result';
      const toolUse = response.content.find((b) => b.type === 'tool_use');
      if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No structured result');
      result = toolUse.input as unknown as AnalysisResult;
    }

    const totals = result.hours.reduce((s, h) => ({ low: s.low + h.low, mid: s.mid + h.mid, high: s.high + h.high }), { low: 0, mid: 0, high: 0 });

    stage = 'writing analysis result to database';
    await supabase.from('analyses').update({ status: 'complete', scope_json: result.scope, flags_json: result.flags, hours_json: result.hours, summary_text: result.summary, risk_score: result.risk_score, total_hours_low: totals.low, total_hours_mid: totals.mid, total_hours_high: totals.high }).eq('id', analysisId);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unexpected runtime error';
    const lower = msg.toLowerCase();
    const isBillingIssue =
      lower.includes('credit balance is too low') ||
      lower.includes('plans & billing') ||
      lower.includes('billing') ||
      lower.includes('insufficient credits') ||
      lower.includes('insufficient_quota') ||
      lower.includes('quota');
    const details =
      e && typeof e === 'object' && 'status' in e
        ? ` (status: ${String((e as { status?: unknown }).status ?? '')})`
        : '';
    console.error('[analyze-api] failure', {
      stage,
      message: msg,
      details,
      analysisId,
      userId: user.id,
    });

    if (isBillingIssue) {
      const fallback = withFallbackSummary(sampleAnalysis);
      const totals = fallback.hours.reduce(
        (s, h) => ({ low: s.low + h.low, mid: s.mid + h.mid, high: s.high + h.high }),
        { low: 0, mid: 0, high: 0 }
      );
      await supabase
        .from('analyses')
        .update({
          status: 'complete',
          scope_json: fallback.scope,
          flags_json: fallback.flags,
          hours_json: fallback.hours,
          summary_text: fallback.summary,
          risk_score: fallback.risk_score,
          total_hours_low: totals.low,
          total_hours_mid: totals.mid,
          total_hours_high: totals.high,
          client_name: fallback.client_name ?? null,
          project_name: fallback.project_name ?? null,
        })
        .eq('id', analysisId);
      return NextResponse.json({
        success: true,
        result: fallback,
        fallback: 'anthropic_billing_unavailable',
      });
    }

    await supabase.from('analyses').update({ status: 'error' }).eq('id', analysisId);
    return NextResponse.json({ error: `Analysis failed during ${stage}: ${msg}${details}` }, { status: 500 });
  }
}
