import { createClient } from '@supabase/supabase-js';

export const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl?.includes('supabase.com/dashboard')) {
        console.warn('CRITICAL: Your Supabase URL looks like a dashboard URL. Please use the "Project URL" found in Settings -> API (e.g., https://xyz.supabase.co)');
    }

    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
};
