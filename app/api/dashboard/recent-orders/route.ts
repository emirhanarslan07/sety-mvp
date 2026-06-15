import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '5');

        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                product:products(title, type, currency, price)
            `)
            .eq('store_id', store.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        // format to generic structure
        const formatted = orders.map((o: any) => ({
            id: o.id,
            order_number: o.order_number || `SETY-${o.id.substring(0,6).toUpperCase()}`,
            amount: o.amount || o.product?.price,
            currency: o.currency || o.product?.currency || 'USD',
            status: o.status,
            created_at: o.created_at,
            customer_email: o.customer_email || 'unknown@email.com',
            product_name: o.product?.title || 'Bilinmeyen Ürün'
        }));

        return NextResponse.json({ data: formatted });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
