import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get store
        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const updates = await req.json();

        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: 'Invalid payload, expected array' }, { status: 400 });
        }

        // Supabase does not have a built-in bulk update via single query efficiently in JS client without RPC.
        // We will do Promise.all for updates. Since it's < 100 items usually, it's fine.
        const promises = updates.map((item: any) => 
            supabase
                .from('products')
                .update({ sort_order: item.sort_order })
                .eq('id', item.id)
                .eq('store_id', store.id) // Ensure security
        );

        await Promise.all(promises);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
