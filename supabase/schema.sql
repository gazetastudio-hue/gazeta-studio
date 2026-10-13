-- GAZETA STUDIO — Supabase (ejecutar en SQL Editor). Activa RLS y NO expongas service_role en el frontend.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(), type text not null check (type in ('newsletter','professional')),
  email text not null, name text, phone text, project_type text, message text, page text,
  consent_at timestamptz not null default now(), created_at timestamptz not null default now());
create unique index if not exists leads_newsletter_email on public.leads (lower(email)) where type='newsletter';

create table if not exists public.works (
  id text primary key, title text not null, collection_id text not null, format_cm text not null,
  price_cents int not null check (price_cents>0), edition_total int not null check (edition_total>0),
  edition_sold int not null default 0 check (edition_sold>=0), printumo_file_id text, image_url text,
  status text not null default 'draft' check (status in ('draft','live','closed')), created_at timestamptz default now(),
  constraint edition_not_oversold check (edition_sold <= edition_total));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), stripe_session_id text unique not null, email text,
  items jsonb not null, total_cents int not null, status text not null default 'pending'
  check (status in ('pending','paid','in_production','shipped','delivered','refunded','failed')),
  edition_numbers jsonb, printumo_order_id text, tracking text, shipping jsonb, created_at timestamptz default now(), updated_at timestamptz default now());

-- Reserva atómica de número de serie: devuelve el nº asignado o null si se agotó. Evita sobreventa con doble clic / webhooks duplicados.
create or replace function public.reserve_edition(p_work text) returns int language plpgsql as $$
declare n int; begin
  update public.works set edition_sold = edition_sold + 1 where id=p_work and edition_sold < edition_total returning edition_sold into n;
  return n; end $$;

alter table public.leads enable row level security;
alter table public.works enable row level security;
alter table public.orders enable row level security;
-- Sin políticas públicas: solo el backend (service_role, en Vercel Functions) lee/escribe. La web pública nunca accede directo a estas tablas.
