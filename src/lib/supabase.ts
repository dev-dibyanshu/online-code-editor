import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CodeFile {
  id: string;
  user_id: string;
  file_name: string;
  language: 'cpp' | 'python' | 'javascript';
  code: string;
  created_at: string;
  updated_at: string;
}
