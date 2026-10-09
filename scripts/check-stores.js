const fs = require('fs');
const path = require('path');

let envText = '';
try {
  envText = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
} catch (e) {
  try {
    envText = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  } catch (err) {}
}

const envVars = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    envVars[key] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data: stores, error } = await supabase.from('stores').select('id, username, user_id');
  console.log('Stores count:', stores ? stores.length : 0);
  console.log('Stores:', JSON.stringify(stores, null, 2));

  const { data: profiles } = await supabase.from('user_profiles').select('user_id, email, full_name');
  console.log('User profiles:', JSON.stringify(profiles, null, 2));
}

main();
