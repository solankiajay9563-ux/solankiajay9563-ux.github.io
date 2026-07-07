/*
  CONFIG — your Supabase connection details.

  Go to your Supabase project → Settings → API, and copy:
    - "Project URL"        → paste into SUPABASE_URL below
    - "anon public" key    → paste into SUPABASE_ANON_KEY below

  This file gets committed to GitHub and served publicly, same as
  every other file here — that's expected and fine. The "anon" key
  is specifically designed by Supabase to be public-facing; it's not
  a secret like a database password or a GitHub personal access token.
  Your actual protection comes from the Row Level Security policies
  you set up in the SQL editor (the "public read/write" policies) —
  those, not key secrecy, are what control who can do what.
*/

const SUPABASE_URL = 'https://pwmrhjkqzytclshxkbrz.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_D3Jfe_FvGMS1I_1dR27e1g_6PbV3Hso';
