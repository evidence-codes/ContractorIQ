import './globals.css';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
