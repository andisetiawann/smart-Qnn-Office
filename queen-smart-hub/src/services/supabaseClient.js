import { createClient } from '@supabase/supabase-js';

// Pastikan Anda menambahkan URL dan ANON KEY ini ke dalam file .env.local Anda
// VITE_SUPABASE_URL=https://xxxx.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJhbG...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);