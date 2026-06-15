export const dynamic = 'force-dynamic';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const store_id = searchParams.get('store_id');

        if (!store_id) {
            return NextResponse.json({ error: 'Store ID required' }, { status: 400 });
        }

        // Fetch subscribers with their associated product title
        const { data, error } = await supabase
            .from('subscribers')
            .select(`
                *,
                products (
                    title
                )
            `)
            .eq('store_id', store_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
