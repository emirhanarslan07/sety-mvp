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

        // Fetch products
        const { data: products, error } = await supabase
            .from('products')
            .select('id, title, price, currency')
            .eq('store_id', store.id)
            .eq('status', 'active');

        if (error) throw error;

        // Fetch clicks
        const { data: clicks, error: clicksError } = await supabase
            .from('store_analytics')
            .select('product_id')
            .eq('user_id', user.id)
            .eq('event_type', 'product_click');

        if (clicksError) throw clicksError;

        // Count clicks per product
        const clickCounts: Record<string, number> = {};
        (clicks || []).forEach(click => {
            if (click.product_id) {
                clickCounts[click.product_id] = (clickCounts[click.product_id] || 0) + 1;
            }
        });

        // Aggregate data
        const aggregatedProducts = (products || []).map(product => {
            const sales = clickCounts[product.id] || 0; // Using 'sales' field name for clicks to keep frontend intact
            const revenue = 0; // No revenue tracking

            return {
                id: product.id,
                title: product.title,
                price: product.price,
                currency: product.currency,
                sales,
                revenue
            };
        });

        // Sort by clicks descending
        aggregatedProducts.sort((a, b) => b.sales - a.sales);

        // Take top 50
        const topProducts = aggregatedProducts.slice(0, 50);

        return NextResponse.json({ data: topProducts });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
