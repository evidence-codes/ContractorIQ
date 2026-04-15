import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.18),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="group mb-8 inline-flex w-fit items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-md sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/40">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">ContractorIQ</p>
              <p className="text-xs text-zinc-500">Contract intelligence</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-600">
          Secure sign-in powered by email — no password to remember.
        </p>
      </div>
    </main>
  );
}
