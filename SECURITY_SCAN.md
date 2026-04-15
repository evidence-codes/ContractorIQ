# SECURITY_SCAN

> Date: 2026-04-15

## Executive Summary
Authentication and route guards are in place, storage access is scoped by per-user folder policies, and API errors now return stage-level diagnostics. Current accepted risk centers on runtime storage transport reliability and fallback behavior when provider billing is unavailable.

| Severity | Status | Finding | Remediation |
|---|---|---|---|
| 🟠 High | ✅ Resolved | Generic 500 errors hid root causes in upload/analyze pipeline | Added stage-aware error messages and structured server logs |
| 🟡 Warning | ✅ Resolved | Avatar used static identity marker (`U`) | Avatar now uses provider metadata and exposes sign-out controls |
| 🟡 Warning | ⚠️ Accepted Risk | Storage API intermittently throws fetch failures in local runtime | Implemented fallback path; continue analysis without blocking on signed URL |
| ℹ️ Info | ✅ Resolved | AI provider lock-in | Added env-controlled provider switch (`anthropic` / `openai`) |

## Security Architecture Snapshot
- Auth: Supabase session-based auth with middleware route protection.
- Authorization: User-scoped DB queries (`user_id = auth.uid()` patterns).
- Storage: bucket `contracts`, per-user folder policies.
- Secrets: provider keys remain server-side in env; no key values documented.
