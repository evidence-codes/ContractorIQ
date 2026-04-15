'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const suggestions = [
  'What is the worst clause in this contract?',
  'Am I responsible if the project fails?',
  'What happens if the client stops responding?',
];

export function ContractChat({ analysisId, isDemo = false }: { analysisId?: string; isDemo?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!analysisId || isDemo) return;
      setHistoryLoading(true);
      const res = await fetch(`/api/chat?analysisId=${encodeURIComponent(analysisId)}`);
      const json = (await res.json()) as { messages?: Array<{ role: 'user' | 'assistant'; content: string }> };
      if (res.ok && json.messages) {
        setMessages(json.messages.map((m) => ({ role: m.role, content: m.content })));
      }
      setHistoryLoading(false);
    };
    void loadHistory();
  }, [analysisId, isDemo]);

  const send = async (text: string) => {
    if (!analysisId || !text.trim() || isDemo) return;
    const nextMessages: Message[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId,
        contractText: '',
        messages: nextMessages,
      }),
    });
    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const parts = chunk.split('\n\n').filter(Boolean);
      for (const part of parts) {
        if (!part.startsWith('data: ')) continue;
        const payload = part.slice(6);
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload) as { text?: string };
          if (parsed.text) {
            setMessages((prev) => {
              const cloned = [...prev];
              const last = cloned[cloned.length - 1];
              cloned[cloned.length - 1] = {
                role: 'assistant',
                content: `${last?.content || ''}${parsed.text}`,
              };
              return cloned;
            });
          }
        } catch {
          // ignore
        }
      }
    }
    setLoading(false);
  };

  if (isDemo) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
        <p className="font-medium text-white">Contract Q&amp;A</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          In the full product, you can ask follow-up questions about your upload and get streaming answers grounded in
          your contract text. Create a free account to use chat on your own analyses.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400"
            >
              {s}
            </span>
          ))}
        </div>
        <Link
          href="/signup"
          className="mt-4 inline-flex rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Create free account
        </Link>
      </div>
    );
  }

  if (!analysisId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 text-sm text-zinc-400">
        Open a saved analysis from your dashboard to use contract Q&amp;A on a real upload.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
      <p className="mb-3 font-medium text-white">Contract Q&amp;A</p>
      <div className="mb-3 max-h-72 space-y-3 overflow-y-auto pr-1">
        {historyLoading && <p className="text-xs text-zinc-500">Loading history…</p>}
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`inline-block max-w-[90%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-100'
              }`}
            >
              {m.content || '…'}
            </span>
          </div>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/10"
            onClick={() => send(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          className="flex-1 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this contract…"
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
