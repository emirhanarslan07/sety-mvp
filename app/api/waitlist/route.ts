import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = body?.email;
        const feature = body?.feature || body?.source || 'landing_page';

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();

        // Check if already in waitlist
        const { data: existing } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ success: true, message: 'Already subscribed' });
        }

        const { error } = await supabase
            .from('waitlist')
            .insert({ email: cleanEmail, feature });

        if (error) {
            console.error('Waitlist insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Successfully joined waitlist' });
    } catch (err: any) {
        console.error('Waitlist API error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
