# database.md

> Export date: 2026-04-15
> Source: `supabase/migrations/001_initial.sql`

## Auth / Identity
### `auth.users`
Managed by Supabase Auth.

### `public.user_preferences`
| Column | Type |
|---|---|
| id | uuid (pk, fk auth.users.id) |
| hourly_rate | numeric(10,2) |
| revision_limit | int |
| ip_stance | text |
| payment_terms | text |
| currency | text |
| specialization | text nullable |
| created_at | timestamptz |
| updated_at | timestamptz |

## Core Business
### `public.analyses`
| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| file_name | text |
| file_url | text |
| file_hash | text |
| file_size | int nullable |
| status | text |
| scope_json | jsonb nullable |
| flags_json | jsonb nullable |
| hours_json | jsonb nullable |
| summary_text | text nullable |
| counter_json | jsonb nullable |
| counter_text | text nullable |
| client_name | text nullable |
| project_name | text nullable |
| total_hours_low | numeric(8,2) nullable |
| total_hours_mid | numeric(8,2) nullable |
| total_hours_high | numeric(8,2) nullable |
| risk_score | int nullable |
| created_at | timestamptz |
| updated_at | timestamptz |

### `public.chat_messages`
| Column | Type |
|---|---|
| id | uuid |
| analysis_id | uuid |
| user_id | uuid |
| role | text (`user`/`assistant`) |
| content | text |
| created_at | timestamptz |

## Storage
- Bucket: `contracts` (private)
- Object key convention: `<user_id>/<file_hash>-<file_name>`
