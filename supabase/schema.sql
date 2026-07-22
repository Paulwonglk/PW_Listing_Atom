-- PW Listing Atom — Milestone 1 schema
-- Run this in the Supabase SQL editor for your project.

-- ── Teams & Agents ──────────────────────────────────────────────
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_agent_id uuid, -- set after first agent is created
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key references auth.users(id) on delete cascade,
  team_id uuid references teams(id) on delete set null,
  name text not null,
  email text not null,
  role text not null default 'agent', -- 'owner' | 'agent'
  created_at timestamptz not null default now()
);

-- ── Listings ────────────────────────────────────────────────────
create table listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  project_name text,
  address text not null,
  postal_code text,
  district text,
  developer text,
  property_type text, -- 'EC' | 'Condo' | 'HDB' | 'Landed'
  tenure text,
  top_year int,
  bedrooms int,
  bathrooms int,
  floor_area_sqft numeric,
  floor_level text,
  facing text,
  price numeric,
  psf numeric generated always as (
    case when floor_area_sqft > 0 then round(price / floor_area_sqft, 2) else null end
  ) stored,
  nearby_mrt text,
  nearby_schools text,
  nearby_shopping text,
  nearby_amenities text,
  status text not null default 'active', -- 'active' | 'under_offer' | 'sold' | 'withdrawn'
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  type text not null, -- 'photo' | 'video' | 'floorplan' | 'brochure'
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table listing_notes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index idx_listings_agent on listings(agent_id);
create index idx_listing_media_listing on listing_media(listing_id);
create index idx_listing_notes_listing on listing_notes(listing_id);

-- ── updated_at trigger ──────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_listings_updated_at
before update on listings
for each row execute function set_updated_at();

-- ── Row-Level Security ──────────────────────────────────────────
-- Scoped by team from day one, even for a solo agent, so adding
-- teammates later never requires a data-model change.

alter table agents enable row level security;
alter table listings enable row level security;
alter table listing_media enable row level security;
alter table listing_notes enable row level security;

create policy "agents see their own row"
  on agents for select using (id = auth.uid());

create policy "agents see team listings"
  on listings for select using (
    agent_id = auth.uid()
    or agent_id in (
      select id from agents where team_id = (select team_id from agents where id = auth.uid())
    )
  );

create policy "agents manage their own listings"
  on listings for insert with check (agent_id = auth.uid());

create policy "agents update their own listings"
  on listings for update using (agent_id = auth.uid());

create policy "agents delete their own listings"
  on listings for delete using (agent_id = auth.uid());

create policy "media follows listing visibility"
  on listing_media for select using (
    listing_id in (select id from listings)
  );

create policy "agents manage media on their listings"
  on listing_media for insert with check (
    listing_id in (select id from listings where agent_id = auth.uid())
  );

create policy "notes follow listing visibility"
  on listing_notes for select using (
    listing_id in (select id from listings)
  );

create policy "agents add notes to visible listings"
  on listing_notes for insert with check (agent_id = auth.uid());
