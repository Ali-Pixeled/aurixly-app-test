import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection
supabase.from('users').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });