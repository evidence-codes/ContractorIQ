# ContractorIQ

AI-powered contract analysis workspace for freelancers and agencies.

## What is ContractorIQ?
ContractorIQ ingests a PDF/DOCX contract, extracts scope, flags risky clauses, estimates delivery hours, and drafts counter-proposal language in one workflow. It supports authenticated production use and a public interactive demo path. The app uses Supabase for auth/data/storage and can run analysis through either Anthropic or OpenAI via env-controlled provider switching.

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.3 | App router UI + API routes |
| React | 19.2.4 | Component rendering |
| Tailwind CSS | 4.x | Styling system |
| Framer Motion | 12.38.0 | UI animations |
| GSAP | 3.15.0 | Scroll and hero animations |
| Zustand | 5.0.12 | Analysis upload/result state |

### Backend & Infrastructure
| Technology | Version | Purpose |
|---|---|---|
| Supabase Auth | managed | Magic link + OAuth sessions |
| Supabase Postgres | managed | Analyses, chat, preferences |
| Supabase Storage | managed | Contract file storage |
| Anthropic SDK | 0.88.0 | Claude analysis provider |
| OpenAI SDK | 6.34.0 | GPT-4o-mini analysis provider |

### Testing & Tooling
| Technology | Version | Purpose |
|---|---|---|
| TypeScript | 5.x | Type safety |
| ESLint | 9.x | Linting |
| pnpm | 10.x | Package manager |

## Key Features
- Upload + analyze flow on `/analyze` with status and robust error diagnostics.
- Public demo mode on `/analyze?demo=1` without auth.
- Analyzer provider switch via env: Anthropic or OpenAI.
- Dashboard/history + analysis detail route.
- Preferences screen that affects pricing/negotiation behavior.
- Avatar menu showing signed-in user name/email and sign-out.

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side privileged key for fallback storage upload |
| `NEXT_PUBLIC_APP_URL` | App origin used for auth redirects |
| `NEXT_PUBLIC_DEMO_MODE` | Demo-mode feature toggle |
| `NEXT_PUBLIC_SHOW_GOOGLE_OAUTH` | Show/hide Google OAuth button in auth UI |
| `ANTHROPIC_API_KEY` | Claude provider key |
| `OPENAI_API_KEY` | OpenAI provider key |
| `ANALYZER_PROVIDER` | `anthropic` or `openai` |
| `OPENAI_ANALYSIS_MODEL` | OpenAI model id (default `gpt-4o-mini`) |

## Getting Started
```bash
pnpm install
pnpm dev
```

## Notes
- Apply DB and storage setup from `supabase/migrations/001_initial.sql` before first upload.
- If AI billing is unavailable, analysis returns a demo fallback result and surfaces an in-UI notice.
