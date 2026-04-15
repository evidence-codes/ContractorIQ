'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  MessageSquare,
  ScanSearch,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AnalysisPreviewMock } from '@/components/landing/AnalysisPreviewMock';

gsap.registerPlugin(ScrollTrigger);

const faq = [
  {
    q: 'What file types can I upload?',
    a: 'PDF and DOCX contracts or statements of work, up to 10MB. Text is analyzed on the server; your file is not displayed publicly.',
  },
  {
    q: 'What does the interactive demo show?',
    a: 'A full sample analysis: clause-level risks, extracted scope, hour bands, counter-proposal language, and the same tabbed workspace you get after a real upload — no account required.',
  },
  {
    q: 'How is this different from “asking ChatGPT”?',
    a: 'ContractorIQ is structured for contracts: consistent severity scoring, scope tables, hour estimates, and export-oriented counter-proposals, plus preferences so outputs match how you usually negotiate.',
  },
  {
    q: 'Do I need a credit card to try it?',
    a: 'No. Create a free account to run your own documents, or open the live demo instantly from this page.',
  },
];

const spring = { type: 'spring' as const, stiffness: 380, damping: 28 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.06 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: spring },
};

const productCards = [
  {
    title: 'Risks',
    body: 'Clause-level flags with severity, impact, and suggested language you can send back.',
    icon: Shield,
  },
  {
    title: 'Scope',
    body: 'Deliverables and obligations pulled into a scannable list so “small tweaks” do not hide scope creep.',
    icon: ListChecks,
  },
  {
    title: 'Hours',
    body: 'Low / mid / high hour bands plus an illustrative value range from your rate.',
    icon: Clock,
  },
  {
    title: 'Counter-proposal',
    body: 'Professional replacement clauses aligned with your preferences, ready to export.',
    icon: FileText,
  },
];

const howSteps = [
  {
    step: '01',
    title: 'Upload your agreement',
    body: 'Drop a PDF or DOCX (up to 10MB). We fingerprint the file so repeat uploads can return cached results instantly.',
  },
  {
    step: '02',
    title: 'Review structured output',
    body: 'Scope items, risk flags with severity, hour estimates, and a project summary appear in a single dashboard.',
  },
  {
    step: '03',
    title: 'Export and negotiate',
    body: 'Generate counter-proposal language, tune it in context, and send stronger terms without rewriting from scratch.',
  },
];

export function HomeLanding() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('.anim-hero-badge', { opacity: 0, y: -14, duration: 0.5 })
        .from('.anim-hero-title', { opacity: 0, y: 32, duration: 0.7 }, '-=0.28')
        .from('.anim-hero-sub', { opacity: 0, y: 22, duration: 0.55 }, '-=0.48')
        .from('.anim-hero-cta', { opacity: 0, y: 18, duration: 0.5, stagger: 0.09 }, '-=0.38')
        .from('.anim-hero-foot', { opacity: 0, duration: 0.45 }, '-=0.32');
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>('.anim-section-title');
      blocks.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: -28,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      gsap.from('.anim-how-card', {
        opacity: 0,
        y: 36,
        duration: 0.7,
        stagger: 0.14,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#how',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.how-step-num', {
        opacity: 0,
        scale: 0.92,
        duration: 0.55,
        stagger: 0.12,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: '#how',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      gsap.from('.anim-demo-chrome', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#demo', start: 'top 85%', toggleActions: 'play none none none' },
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      gsap.from('.anim-footer-row', {
        opacity: 0,
        y: 12,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: 'footer.landing-footer', start: 'top 95%', toggleActions: 'play none none none' },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-zinc-950 text-zinc-100">
      <motion.header
        className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={spring}>
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/30">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              ContractorIQ
            </Link>
          </motion.div>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            {['Product', 'How it works', 'Demo', 'FAQ'].map((label, i) => (
              <motion.a
                key={label}
                href={['#product', '#how', '#demo', '#faq'][i]}
                className="transition hover:text-white"
                whileHover={{ y: -1 }}
                transition={spring}
              >
                {label}
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.span className="hidden sm:inline" whileHover={{ scale: 1.03 }} transition={spring}>
              <Link href="/login" className="text-sm text-zinc-400 transition hover:text-white">
                Log in
              </Link>
            </motion.span>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link
                href="/analyze?demo=1"
                className="rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/5 sm:px-4"
              >
                Live demo
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={spring}>
              <Link
                href="/signup"
                className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:px-4"
              >
                Start free
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main>
        <section className="relative overflow-hidden">
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.22),transparent)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-20 md:pb-28">
            <p className="anim-hero-badge inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-200">
              AI contract intelligence
            </p>
            <h1 className="anim-hero-title mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl md:leading-[1.05]">
              Stop getting burned by vague contracts.
            </h1>
            <p className="anim-hero-sub mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Upload a PDF or DOCX. ContractorIQ extracts scope, scores risky clauses, estimates hours with value
              ranges, and drafts negotiation-ready counter-proposals — in one structured workspace.
            </p>
            <div className="anim-hero-cta mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={spring} className="w-full sm:w-auto">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:w-auto"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={spring} className="w-full sm:w-auto">
                <Link
                  href="/analyze?demo=1"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
                >
                  <ScanSearch className="h-4 w-4 text-emerald-400" />
                  Open interactive demo
                </Link>
              </motion.div>
            </div>
            <p className="anim-hero-foot mt-6 text-xs text-zinc-600">No credit card · Sample demo runs without an account</p>
          </div>
        </section>

        <section id="product" className="border-t border-white/5 bg-zinc-950 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              className="max-w-2xl"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
            >
              <motion.h2
                className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
                variants={fadeUp}
                custom={0}
              >
                Everything in one analysis
              </motion.h2>
              <motion.p
                className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base"
                variants={fadeUp}
                custom={1}
              >
                Instead of bouncing between highlighters, spreadsheets, and chat threads, you get a single review surface
                designed for how agencies and independents actually negotiate.
              </motion.p>
            </motion.div>
            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {productCards.map(({ title, body, icon: Icon }, i) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 transition-colors hover:border-emerald-500/25 hover:bg-zinc-900/70"
                >
                  <motion.div variants={cardHover} initial="rest" whileHover="hover" className="h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-16"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h3 className="anim-section-title text-lg font-semibold text-white">What the workspace looks like</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  After analysis completes, you land on a tabbed dashboard: risks first, then scope, hours, and
                  counter-proposal. The layout below mirrors the live app (sample numbers for illustration).
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                  {['Severity-ranked contract flags', 'Scrollable scope and assumptions', 'Chat grounded in your analysis (signed-in)'].map(
                    (line, idx) => (
                      <motion.li
                        key={line}
                        className="flex gap-2"
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08, duration: 0.45 }}
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {line}
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnalysisPreviewMock />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="how" className="border-t border-white/5 bg-zinc-900/30 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="anim-section-title text-2xl font-semibold tracking-tight text-white md:text-3xl">How it works</h2>
            <motion.p
              className="mt-3 max-w-2xl text-sm text-zinc-400 md:text-base"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Three straightforward steps from file drop to negotiation-ready output. Real analyses run on your account;
              the demo uses a curated sample so visitors can explore the full UI.
            </motion.p>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {howSteps.map((item) => (
                <motion.li
                  key={item.step}
                  className="anim-how-card rounded-2xl border border-white/10 bg-zinc-950/60 p-6 pb-8 shadow-lg shadow-black/20"
                  whileHover={{ borderColor: 'rgba(16, 185, 129, 0.35)', transition: { duration: 0.2 } }}
                  transition={spring}
                >
                  <span className="how-step-num block text-4xl font-bold leading-none tabular-nums text-emerald-500/35">
                    {item.step}
                  </span>
                  <h3 className="mt-8 text-lg font-semibold leading-snug text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="demo" className="border-t border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
            >
              <div>
                <h2 className="anim-section-title text-2xl font-semibold tracking-tight text-white md:text-3xl">See the real demo UI</h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-400 md:text-base">
                  The embedded view below is the same{' '}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-emerald-200">/analyze?demo=1</code>{' '}
                  experience your prospects can try: full tabs, metrics, and sample counter-proposal — scroll inside the
                  frame to explore.
                </p>
              </div>
              <motion.div whileHover={{ x: 4 }} transition={spring}>
                <Link
                  href="/analyze?demo=1"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Open demo full screen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <div className="anim-demo-chrome mt-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40 ring-1 ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950/95 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
                <span className="ml-2 flex-1 truncate rounded-lg bg-zinc-900 px-3 py-1.5 text-center font-mono text-[11px] text-zinc-500">
                  /analyze?demo=1
                </span>
              </div>
              <iframe
                title="ContractorIQ interactive demo"
                src="/analyze?demo=1"
                className="h-[min(720px,75vh)] w-full border-0 bg-zinc-950"
                loading="lazy"
              />
            </div>

            <motion.div
              className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
            >
              <motion.div className="order-2 lg:order-1" variants={fadeUp} custom={0}>
                <motion.div
                  className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/5"
                  whileHover={{ scale: 1.01 }}
                  transition={spring}
                >
                  <Image
                    src="/landing/preferences.png"
                    alt="ContractorIQ preferences: hourly rate, currency, IP stance, payment terms, and specialization."
                    width={1024}
                    height={484}
                    className="h-auto w-full object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                </motion.div>
              </motion.div>
              <motion.div className="order-1 lg:order-2" variants={fadeUp} custom={1}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  Preferences
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                  Tune the AI to how you negotiate
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
                  Hourly rate and currency drive value bands on the hours tab. IP stance, payment terms, and revision limits
                  steer counter-proposal tone. Specialization keeps examples grounded in your industry — the same screen
                  you use after sign-up.
                </p>
                <motion.div className="mt-6" whileHover={{ x: 4 }} transition={spring}>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Create an account to save preferences
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section
          className="border-t border-white/5 bg-zinc-900/20 py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center text-sm text-zinc-500">
              Built for <span className="text-zinc-300">independent consultants</span>,{' '}
              <span className="text-zinc-300">studios</span>, and <span className="text-zinc-300">product teams</span> who
              negotiate scope before shipping code — not generic “legal advice”; software to read the paper faster.
            </p>
          </div>
        </motion.section>

        <section id="faq" className="border-t border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <motion.h2
              className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently asked questions
            </motion.h2>
            <motion.div
              className="mt-10 space-y-3"
              role="list"
              aria-label="Frequently asked questions"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.08 }}
            >
              {faq.map((item, i) => (
                <motion.div
                  key={item.q}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.14)' }}
                  className="rounded-2xl border border-white/10 bg-zinc-900/40 px-5 py-4"
                  transition={spring}
                  role="listitem"
                >
                  <p className="font-medium text-white">{item.q}</p>
                  <p className="mt-2 pl-6 text-sm leading-relaxed text-zinc-500">{item.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <motion.section
          className="border-t border-white/5 pb-20 pt-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-zinc-900/80 to-zinc-950 px-6 py-12 text-center md:px-12 md:py-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_50%)]" />
              <div className="relative">
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Ready to read the next contract with confidence?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400 md:text-base">
                  Try the live demo in seconds, or create a free account to run your own files and save preferences.
                </p>
                <motion.div
                  className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.div variants={fadeUp} custom={0} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} transition={spring}>
                    <Link
                      href="/analyze?demo=1"
                      className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
                    >
                      Continue demo
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={1} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} transition={spring}>
                    <Link
                      href="/signup"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 sm:w-auto"
                    >
                      Create free account
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="landing-footer border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
          <div className="anim-footer-row flex items-center gap-2 font-medium text-zinc-400">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            ContractorIQ
          </div>
          <div className="anim-footer-row flex flex-wrap items-center justify-center gap-6">
            <motion.span whileHover={{ y: -2, color: '#fff' }} transition={spring}>
              <Link href="/login">Log in</Link>
            </motion.span>
            <motion.span whileHover={{ y: -2, color: '#fff' }} transition={spring}>
              <Link href="/signup">Sign up</Link>
            </motion.span>
            <motion.span whileHover={{ y: -2, color: '#fff' }} transition={spring}>
              <Link href="/analyze?demo=1">Demo</Link>
            </motion.span>
          </div>
          <p className="anim-footer-row text-xs text-zinc-600">© {new Date().getFullYear()} ContractorIQ</p>
        </div>
      </footer>
    </div>
  );
}
