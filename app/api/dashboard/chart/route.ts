import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '7');

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

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: orders, error } = await supabase
            .from('orders')
            .select('amount, created_at')
            .eq('store_id', store.id)
            .in('status', ['completed', 'paid'])
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        // Group by date
        const grouped: Record<string, { revenue: number; orders: number }> = {};
        
        // Initialize all dates in range with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            grouped[dateStr] = { revenue: 0, orders: 0 };
        }

        (orders || []).forEach(order => {
            const dateStr = order.created_at.split('T')[0];
            if (grouped[dateStr]) {
                grouped[dateStr].revenue += Number(order.amount) || 0;
                grouped[dateStr].orders += 1;
            }
        });

        // Convert to array and sort by date ascending
        const chartData = Object.keys(grouped).map(date => ({
            date,
            revenue: grouped[date].revenue,
            orders: grouped[date].orders
        })).sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({ data: chartData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
