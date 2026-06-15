import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
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

        // Fetch products and their completed/paid orders
        const { data: products, error } = await supabase
            .from('products')
            .select(`
                id, 
                title, 
                price, 
                currency,
                orders (
                    amount,
                    status
                )
            `)
            .eq('store_id', store.id)
            .eq('status', 'active');

        if (error) throw error;

        // Aggregate data
        const aggregatedProducts = (products || []).map(product => {
            const validOrders = (product.orders as any[] || []).filter(o => 
                o.status === 'completed' || o.status === 'paid'
            );
            
            const sales = validOrders.length;
            const revenue = validOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

            return {
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency,
                sales,
                revenue
            };
        });

        // Sort by sales descending
        aggregatedProducts.sort((a, b) => b.sales - a.sales);

        // Take top 10
        const topProducts = aggregatedProducts.slice(0, 10);

        return NextResponse.json({ data: topProducts });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
