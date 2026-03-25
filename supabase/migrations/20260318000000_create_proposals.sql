create table proposals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  agency_name text,
  agency_website text,
  agency_email text,
  sender_name text,
  sender_title text,

  client_name text,
  client_company text,
  client_role text,
  client_email text,
  client_phone text,

  proposal_title text,
  proposal_date text,

  intro_letter text,
  about_who text,
  about_philosophy text,
  about_why_us jsonb default '[]'::jsonb,

  service_groups jsonb default '[]'::jsonb,
  pricing_items jsonb default '[]'::jsonb,
  terms jsonb default '[]'::jsonb,
  currency text default 'R',

  next_steps jsonb default '[]'::jsonb,
  client_signature_name text,
  client_signature_role text,
  client_signature_company text,
  sender_signature_name text,
  sender_signature_title text,
  sender_signature_company text,
  footer_tagline text
);

alter table proposals enable row level security;

create policy "Allow all operations"
  on proposals for all
  using (true)
  with check (true);
