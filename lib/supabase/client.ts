import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

// Use the same client to avoid "Multiple GoTrueClient instances detected" warnings
export const supabasePublic = supabase;
