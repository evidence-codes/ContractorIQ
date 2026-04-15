# RESTORE_GUIDE

> Updated: 2026-04-15

## Quick Reference
| Scenario | Method |
|---|---|
| Bad UI/auth regression | Revert recent commits in app routes/components |
| Upload/analyze API break | Restore `src/app/api/upload/route.ts` and `src/app/api/analyze/route.ts` from known-good commit |
| Supabase schema/storage mismatch | Re-run SQL from `supabase/migrations/001_initial.sql` |

## Method 1 — Code Revert
```bash
git log --oneline -- src/app/api/upload/route.ts src/app/api/analyze/route.ts
git checkout <known-good-commit> -- src/app/api/upload/route.ts src/app/api/analyze/route.ts
pnpm build
```

## Method 2 — Schema/Storage Restore
1. Re-run table and trigger definitions from migration.
2. Recreate bucket `contracts` and storage policies.
3. Validate with one signed-in upload and one `/api/analyze` run.

## Verification
- `/api/upload` returns 200 for valid PDF/DOCX.
- `/api/analyze` returns `success: true` (provider or fallback path).
- `/analysis/[id]` renders tabs and metrics.
