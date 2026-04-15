import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 px-4 py-8 md:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
