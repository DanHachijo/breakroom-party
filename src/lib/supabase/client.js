import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

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