'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SlidersHorizontal, Save, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20';
const labelClass = 'text-sm font-medium text-zinc-200';
const hintClass = 'mt-1 text-xs leading-relaxed text-zinc-500';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<'ok' | 'error' | 'neutral'>('neutral');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hourly_rate: 100,
    revision_limit: 2,
    ip_stance: 'retain',
    payment_terms: 'net-30',
    currency: 'USD',
    specialization: '',
  });

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      const { data } = await supabase
        .from('user_preferences')
        .select('hourly_rate,revision_limit,ip_stance,payment_terms,currency,specialization')
        .eq('id', user.id)
        .single();
      if (data) {
        setForm({
          hourly_rate: data.hourly_rate,
          revision_limit: data.revision_limit,
          ip_stance: data.ip_stance,
          payment_terms: data.payment_terms,
          currency: data.currency,
          specialization: data.specialization || '',
        });
      }
    };
    void load();
  }, [router, supabase]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/25">
          <SlidersHorizontal className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Preferences</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            These values tune how ContractorIQ estimates project value, frames negotiation advice, and drafts
            counter-proposals. They are stored on your account and never shared with other users.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5 px-5 py-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-100">What this affects</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-400">
              <li>Hourly rate and currency feed the hours tab and value range on completed analyses.</li>
              <li>IP stance, payment terms, and revision limits guide counter-proposal language.</li>
              <li>Specialization helps the model ground examples in your domain.</li>
            </ul>
          </div>
        </div>
      </div>

      <form
        className="space-y-10"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setStatus('Saving…');
          setStatusTone('neutral');
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            setStatus('You need to be signed in to save preferences.');
            setStatusTone('error');
            setSaving(false);
            return;
          }
          const { error } = await supabase.from('user_preferences').update(form).eq('id', user.id);
          if (error) {
            setStatus(error.message);
            setStatusTone('error');
          } else {
            setStatus('Preferences saved.');
            setStatusTone('ok');
          }
          setSaving(false);
        }}
      >
        <section className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Rates & currency</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="hourly_rate">
                Default hourly rate
              </label>
              <p className={hintClass}>Used when converting estimated hours into a dollar range on the analysis view.</p>
              <input
                id="hourly_rate"
                className={cn(inputClass, 'mt-3')}
                type="number"
                min={1}
                value={form.hourly_rate}
                onChange={(e) => setForm((prev) => ({ ...prev, hourly_rate: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="currency">
                Currency
              </label>
              <p className={hintClass}>Three-letter code (e.g. USD, EUR, GBP).</p>
              <input
                id="currency"
                className={cn(inputClass, 'mt-3 uppercase')}
                value={form.currency}
                maxLength={8}
                onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value.toUpperCase() }))}
              />
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Contract posture</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ip_stance">
                Intellectual property
              </label>
              <p className={hintClass}>What you usually want to push for when IP clauses appear.</p>
              <select
                id="ip_stance"
                className={cn(inputClass, 'mt-3')}
                value={form.ip_stance}
                onChange={(e) => setForm((prev) => ({ ...prev, ip_stance: e.target.value }))}
              >
                <option value="retain">Retain — keep IP with you</option>
                <option value="transfer-ok">Transfer OK — client may own deliverables</option>
                <option value="negotiate">Negotiate — case by case</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="payment_terms">
                Preferred payment terms
              </label>
              <p className={hintClass}>Referenced in counter-proposals and payment-related risk notes.</p>
              <select
                id="payment_terms"
                className={cn(inputClass, 'mt-3')}
                value={form.payment_terms}
                onChange={(e) => setForm((prev) => ({ ...prev, payment_terms: e.target.value }))}
              >
                <option value="net-7">Net-7</option>
                <option value="net-14">Net-14</option>
                <option value="net-30">Net-30</option>
                <option value="net-60">Net-60</option>
                <option value="on-delivery">On delivery</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="revision_limit">
              Revision rounds included
            </label>
            <p className={hintClass}>Typical number of feedback rounds you include before change fees (1–10).</p>
            <input
              id="revision_limit"
              className={cn(inputClass, 'mt-3 max-w-xs')}
              type="number"
              min={1}
              max={10}
              value={form.revision_limit}
              onChange={(e) => setForm((prev) => ({ ...prev, revision_limit: Number(e.target.value) }))}
            />
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white">Domain context</h2>
          <div>
            <label className={labelClass} htmlFor="specialization">
              Specialization (optional)
            </label>
            <p className={hintClass}>Short phrase such as “healthcare APIs” or “retail e‑commerce” — improves relevance of examples.</p>
            <input
              id="specialization"
              className={cn(inputClass, 'mt-3')}
              value={form.specialization}
              onChange={(e) => setForm((prev) => ({ ...prev, specialization: e.target.value }))}
              placeholder="e.g. B2B SaaS integrations"
            />
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save preferences'}
          </button>
          {status && (
            <p
              className={cn(
                'text-sm',
                statusTone === 'ok' && 'text-emerald-400',
                statusTone === 'error' && 'text-rose-400',
                statusTone === 'neutral' && 'text-zinc-400'
              )}
            >
              {status}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
