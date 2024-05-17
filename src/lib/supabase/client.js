import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// let supabaseUrl, supabaseKey;
// if (typeof window === 'undefined') {
//   // Running in Node.js environment (server-side)
//   // Use process.env directly
//   supabaseUrl = process.env.SUPABASE_URL;
//   supabaseKey = process.env.SUPABASE_KEY;
// } else {
//   // Running in browser environment
//   // Access environment variables from import.meta.env (Vite) or process.env (Webpack)
//   supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//   supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// }

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function get() {
  const { data, error } = await supabase
    .from('buzz_host')
    .select('*');
  if (error) {
    return {
      status: 500,
      body: { error: 'Failed to fetch data' }
    };
  }

  return {
    status: 200,
    body: { data }
  };
}