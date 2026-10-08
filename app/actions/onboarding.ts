'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    if (!username || username.trim() === '') return false;
    
    // Clean username (only lowercase alphanumeric and dashes)
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    // If it was modified during cleaning (meaning it had invalid chars) or is too short
    if (cleanUsername !== username || cleanUsername.length < 3) {
        return false;
    }

    // Reserved keywords
    const reserved = ['admin', 'sety', 'api', 'auth', 'dashboard', 'store', 'support', 'help', 'login', 'signup', 'register'];
    if (reserved.includes(cleanUsername)) {
        return false;
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('stores')
            .select('id')
            .eq('username', cleanUsername)
            .maybeSingle();

        if (error) {
            console.error('Error checking username:', error);
            return false;
        }

        // Available if no data is returned
        return !data;
    } catch (error) {
        console.error('Exception in checkUsernameAvailability:', error);
        return false;
    }
}

export async function completeOnboardingAction(
    userId: string,
    profileId: string,
    storeId: string,
    username: string,
    niche: string
) {
    if (!userId || !profileId || !storeId || !username) {
        return { success: false, error: 'Missing required fields' };
    }

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    try {
        // 1. Double check availability
        const isAvailable = await checkUsernameAvailability(cleanUsername);
        if (!isAvailable) {
            // It might be their OWN store (in case of a retry)
            const { data: ownStore } = await supabaseAdmin
                .from('stores')
                .select('id')
                .eq('username', cleanUsername)
                .eq('id', storeId)
                .maybeSingle();
                
            if (!ownStore) {
                return { success: false, error: 'Username is already taken or invalid' };
            }
        }

        // 2. Update store
        const { error: storeError } = await supabaseAdmin
            .from('stores')
            .update({ 
                username: cleanUsername,
                niche: niche || null
            })
            .eq('id', storeId)
            .eq('user_id', userId);

        if (storeError) {
            console.error('Error updating store:', storeError);
            return { success: false, error: 'Failed to update store information' };
        }

        // 3. Update user_profiles to onboarding_completed: true
        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .update({ onboarding_completed: true })
            .eq('id', profileId)
            .eq('user_id', userId);

        if (profileError) {
            console.error('Error updating profile:', profileError);
            return { success: false, error: 'Failed to complete onboarding status' };
        }

        revalidatePath('/dashboard', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Exception in completeOnboardingAction:', error);
        return { success: false, error: error.message || 'An unexpected error occurred' };
    }
}
