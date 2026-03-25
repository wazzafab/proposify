alter table proposals
  add column if not exists client_signature_data jsonb,
  add column if not exists sender_signature_data jsonb;
