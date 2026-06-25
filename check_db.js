const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://mkvmujibiwpobhszyeeg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rdm11amliaXdwb2Joc3p5ZWVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk5MTQ5MSwiZXhwIjoyMDg2NTY3NDkxfQ.h5Ro2CviGKc4AJQ0F8qS5BpTW4M_Op3h5EbWCJpbiJE'
);

async function run() {
  const { data, error } = await supabase.from('user_profiles').select('user_id, plan_type, subscription_status, polar_subscription_id, polar_customer_id');
  if (error) console.error('Error:', error);
  else console.log('User Profiles:', JSON.stringify(data, null, 2));
  process.exit(0);
}
run();
