const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'Configured' : 'NOT CONFIGURED',
  anonKey: supabaseAnonKey ? 'Configured' : 'NOT CONFIGURED'
});

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test connection
  supabase.from('job')
    .select('id')
    .limit(1)
    .then(result => {
      console.log('Supabase Connection Test:', result);
    })
    .catch(err => {
      console.error('Supabase Connection Test Failed:', err);
    });

  module.exports = supabase;
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  process.exit(1);
}