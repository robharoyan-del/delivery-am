-- ============================================================
-- Run this in your Supabase project:
-- Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1. Create a private storage bucket for KYC documents
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

-- 2. Allow authenticated users to upload only into their own folder
create policy "Users can upload their own KYC docs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'kyc-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow authenticated users to read only their own files
create policy "Users can read their own KYC docs"
on storage.objects for select
to authenticated
using (
  bucket_id = 'kyc-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow authenticated users to replace their own files
create policy "Users can update their own KYC docs"
on storage.objects for update
to authenticated
using (
  bucket_id = 'kyc-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- Optional: Enable phone auth in your Supabase dashboard
-- Authentication → Providers → Phone → Enable
-- (Required for the SMS OTP verification in Settings → Phone)
-- ============================================================


-- ============================================================
-- PARCELS TABLE
-- Run this in Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.parcels (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  country       text not null,
  shop          text not null,
  ship_method   text not null,
  tracking      text,
  price         numeric(12,2),
  currency      text not null default 'USD',
  description   text,
  status        text not null default 'registered',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Only the owner can see/edit their parcels
alter table public.parcels enable row level security;

create policy "Users can view own parcels"
  on public.parcels for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own parcels"
  on public.parcels for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own parcels"
  on public.parcels for update
  to authenticated
  using (user_id = auth.uid());

create policy "Users can delete own parcels"
  on public.parcels for delete
  to authenticated
  using (user_id = auth.uid());

-- Auto-update updated_at on every change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger parcels_updated_at
  before update on public.parcels
  for each row execute procedure public.set_updated_at();


-- ============================================================
-- TRANSACTIONS TABLE
-- Run this in Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          text not null check (type in ('payment', 'refund', 'charge', 'topup')),
  amount        numeric(12,2) not null,
  currency      text not null default 'AMD',
  status        text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  description   text,
  reference     text,
  parcel_id     uuid references public.parcels(id) on delete set null,
  created_at    timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on public.transactions for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own transactions"
  on public.transactions for insert
  to authenticated
  with check (user_id = auth.uid());
