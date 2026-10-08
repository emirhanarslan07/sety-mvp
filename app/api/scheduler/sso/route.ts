import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // MVP SSO Token Generation (1 minute validity)
        // In production, this should be signed using jose or jsonwebtoken with a shared secret
        const payload = {
            userId: session.user.id,
            email: session.user.email,
            exp: Date.now() + 60000 // 60 seconds from now
        };
        
        // Base64 encode the payload to act as a placeholder JWT
        const token = Buffer.from(JSON.stringify(payload)).toString('base64');

        const SCHEDULER_URL = process.env.NEXT_PUBLIC_SCHEDULER_URL || 'https://scheduler.sety.store';
        const redirectUrl = `${SCHEDULER_URL}?sso_token=${token}`;

        return NextResponse.json({ success: true, redirectUrl });
    } catch (error: any) {
        console.error("SSO Token error:", error);
        return NextResponse.json({ error: error.message || 'Failed to generate SSO token' }, { status: 500 });
    }
}
