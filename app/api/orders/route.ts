import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const statusParam = searchParams.get('status') || 'all';

        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get store
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        let query = supabase
            .from('orders')
            .select(`
                *,
                product:products ( id, title, type, price, currency )
            `)
            .eq('store_id', store.id)
            .order('created_at', { ascending: false });

        if (statusParam !== 'all') {
            query = query.eq('status', statusParam);
        }

        const { data: orders, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Format to match UI expectations
        const formattedOrders = orders?.map((o: any) => ({
            id: o.id,
            order_number: o.order_number || `SETY-${o.id.split('-')[0].toUpperCase()}`,
            product: {
                id: o.product?.id,
                name: o.product?.title,
                type: o.product?.type,
                price: o.amount || o.product?.price,
                currency: o.currency || o.product?.currency || 'TRY'
            },
            customer: {
                email: o.customer_email || 'unknown@email.com',
                name: o.customer_name,
                telegram_chat_id: o.customer_telegram_chat_id
            },
            status: o.status,
            payment_provider: o.payment_provider || 'manual',
            payment_link_type: o.payment_link_type || 'default',
            created_at: o.created_at,
            confirmed_at: o.confirmed_at,
            download_token: o.download_token_id
        })) || [];

        return NextResponse.json({ orders: formattedOrders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
