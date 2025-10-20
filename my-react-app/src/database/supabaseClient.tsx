import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Crea una sola instancia y expórtala directamente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testConnection = async () => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1); // usa 'users' en minúscula
    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Key:", supabaseAnonKey ? "OK" : "MISSING");
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
};