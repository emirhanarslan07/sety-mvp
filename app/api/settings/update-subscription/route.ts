import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { planType = 'pro', status = 'active' } = body;

        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Initialize Supabase Admin with Service Role Key to bypass RLS policies
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Perform the update
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({
                plan_type: planType,
                subscription_status: status,
                plan_status: 'active'
            })
            .eq('user_id', user.id)
            .select('*')
            .single();

        if (updateError) {
            console.error('Database update error in update-subscription route:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: updatedProfile });
    } catch (err: any) {
        console.error('Update subscription error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
