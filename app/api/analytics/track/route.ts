import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, product_id, event_type } = body;

        if (!username || !event_type) {
            return NextResponse.json({ error: 'Missing username or event_type' }, { status: 400 });
        }

        if (event_type !== 'store_view' && event_type !== 'product_click') {
            return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 });
        }

        const supabase = createRouteHandlerClient({ cookies });

        // 1. Resolve username to user_id (store owner)
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('user_id')
            .eq('username', username)
            .single();

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // 2. Insert into store_analytics
        const insertData: any = {
            user_id: store.user_id,
            event_type: event_type
        };

        if (product_id) {
            insertData.product_id = product_id;
        }

        const { error: insertError } = await supabase
            .from('store_analytics')
            .insert(insertData);

        if (insertError) {
            console.error('Error inserting analytics:', insertError);
            return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Analytics track error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
