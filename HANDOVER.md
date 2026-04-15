# HANDOVER

## 1. Project Overview
ContractorIQ analyzes freelance/agency contracts and provides structured risk/scope/hour output with negotiation tooling.

## 2. Published URLs
| Environment | URL |
|---|---|
| Local dev | `http://localhost:3002` (or next free port) |

## 3. Core Runtime Paths
- `/` marketing/landing
- `/login`, `/signup` auth entry
- `/dashboard` analysis history
- `/analyze` upload + analyze
- `/analysis/[id]` detail workspace
- `/settings` preferences

## 4. AI Provider Control
- `ANALYZER_PROVIDER=anthropic|openai`
- Anthropic path uses tool-call extraction.
- OpenAI path uses JSON response mode with `OPENAI_ANALYSIS_MODEL` (default `gpt-4o-mini`).

## 5. Data Layer
- `public.user_preferences`
- `public.analyses`
- `public.chat_messages`
- Storage bucket: `contracts` (private, per-user folder policies)

## 6. Current Operational Notes
- Upload route now degrades gracefully if storage fetch fails; analysis still proceeds.
- Analyze route now falls back to demo sample output when provider billing is unavailable.
- Profile avatar shows real user metadata and exposes sign out.

## 7. Required Setup Checklist
1. Add env keys from `.env.example`.
2. Apply SQL migration in `supabase/migrations/001_initial.sql`.
3. Ensure storage bucket/policies exist.
4. Configure chosen analyzer provider credentials.
