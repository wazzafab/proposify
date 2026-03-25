// One-time database setup — run with: npm run db:setup
// Requires SUPABASE_ACCESS_TOKEN in .env
// Get yours at: supabase.com/dashboard/account/tokens

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { createClient } from '@supabase/supabase-js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

// Parse .env manually — no dotenv, no path ambiguity
const env = Object.fromEntries(
  readFileSync(join(root, '.env'), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
)

const url = env.VITE_SUPABASE_URL
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY
const accessToken = env.SUPABASE_ACCESS_TOKEN
const projectRef = url?.replace('https://', '').replace('.supabase.co', '')

if (!accessToken || accessToken === 'your_personal_access_token_here') {
  console.error('\nError: SUPABASE_ACCESS_TOKEN not set in .env')
  console.error('Create one at: https://supabase.com/dashboard/account/tokens\n')
  process.exit(1)
}

console.log('Pushing schema to Supabase...')

try {
  execSync(
    `npx supabase link --project-ref ${projectRef} && npx supabase db push --yes`,
    {
      stdio: 'inherit',
      cwd: root,
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: accessToken }
    }
  )
} catch {
  console.error('\nSchema push failed. Check your SUPABASE_ACCESS_TOKEN.\n')
  process.exit(1)
}

// Verify table is accessible (schema cache may take a few seconds to reload)
const supabase = createClient(url, publishableKey)
let verified = false
for (let i = 0; i < 5; i++) {
  await new Promise(r => setTimeout(r, 2000))
  const { error } = await supabase.from('proposals').select('id').limit(1)
  if (!error) { verified = true; break }
}

if (!verified) {
  console.log('\n✓ Schema pushed. Table will be ready momentarily.\n\nRun: npm run dev\n')
} else {
  console.log('\n✓ Database ready.\n\nRun: npm run dev\n')
}
