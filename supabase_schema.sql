-- Proposify: Run this in your Supabase SQL Editor

create table proposals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text default 'draft',           -- 'draft' | 'sent' | 'approved'
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Agency / Sender
  agency_name text,
  agency_website text,
  agency_email text,
  sender_name text,
  sender_title text,

  -- Client
  client_name text,
  client_company text,
  client_role text,
  client_email text,
  client_phone text,

  -- Proposal meta
  proposal_title text,
  proposal_date text,

  -- Content
  intro_letter text,
  about_who text,
  about_philosophy text,
  about_why_us jsonb default '[]'::jsonb,

  -- Services grouped: [{category, category_description, services:[{name,description}]}]
  service_groups jsonb default '[]'::jsonb,

  -- Pricing: [{service_name, description, amount, frequency}]
  pricing_items jsonb default '[]'::jsonb,

  -- Terms: [{title, body}]
  terms jsonb default '[]'::jsonb,

  -- Next steps + signatures
  next_steps jsonb default '[]'::jsonb,
  client_signature_name text,
  client_signature_role text,
  client_signature_company text,
  sender_signature_name text,
  sender_signature_title text,
  sender_signature_company text,
  footer_tagline text
);

-- RLS Policies
alter table proposals enable row level security;

-- Public can read proposals by slug (for shareable links)
create policy "Public read by slug"
  on proposals for select
  using (true);

-- All operations allowed (add auth later)
create policy "Allow all for now"
  on proposals for all
  using (true)
  with check (true);
