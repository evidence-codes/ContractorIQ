# HANDOVER_NOTES

## Key Implementation Notes (2026-04-15)
- Upload API (`/api/upload`) includes stage-aware diagnostics and service-role fallback retry for storage upload.
- Upload API supports degraded mode when storage is unreachable (analysis still continues).
- Analyze API (`/api/analyze`) supports dual providers and provider switch via env.
- Analyze API includes billing fallback to `sampleAnalysis` with persisted `complete` status.
- Client store carries `analysisNotice` so fallback runs are visibly marked in UI.
- Header avatar now consumes Supabase user metadata (`avatar_url`, `picture`, name/email).

## Files with Most Recent Architectural Impact
- `src/app/api/upload/route.ts`
- `src/app/api/analyze/route.ts`
- `src/components/upload/UploadZone.tsx`
- `src/components/analysis/AnalysisDashboard.tsx`
- `src/store/analysisStore.ts`
- `src/components/shared/UserAvatar.tsx`
- `src/components/layout/Header.tsx`

## Env-driven Feature Flags
- `ANALYZER_PROVIDER`
- `OPENAI_ANALYSIS_MODEL`
- `NEXT_PUBLIC_SHOW_GOOGLE_OAUTH`
- `NEXT_PUBLIC_DEMO_MODE`
