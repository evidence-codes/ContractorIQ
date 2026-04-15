-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User preferences
create table public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  hourly_rate numeric(10,2) default 100.00,
  revision_limit int default 2,
  ip_stance text default 'retain' check (ip_stance in ('retain', 'transfer-ok', 'negotiate')),
  payment_terms text default 'net-30',
  currency text default 'USD',
  specialization text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contract analyses
create table public.analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_hash text not null,
  file_size int,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'error')),
  scope_json jsonb,
  flags_json jsonb,
  hours_json jsonb,
  summary_text text,
  counter_json jsonb,
  counter_text text,
  client_name text,
  project_name text,
  total_hours_low numeric(8,2),
  total_hours_mid numeric(8,2),
  total_hours_high numeric(8,2),
  risk_score int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat messages
create table public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analyses(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.user_preferences enable row level security;
alter table public.analyses enable row level security;
alter table public.chat_messages enable row level security;

create policy "Users manage own preferences" on public.user_preferences for all using (id = auth.uid());
create policy "Users manage own analyses" on public.analyses for all using (user_id = auth.uid());
create policy "Users manage own chat messages" on public.chat_messages for all using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_preferences (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_analyses_updated_at before update on public.analyses for each row execute procedure public.update_updated_at();

insert into storage.buckets (id, name, public) values ('contracts', 'contracts', false);

create policy "Users upload to own folder" on storage.objects for insert with check (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users read own files" on storage.objects for select using (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own files" on storage.objects for delete using (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);
