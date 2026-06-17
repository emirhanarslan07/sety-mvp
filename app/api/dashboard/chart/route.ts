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

        const { data: analytics, error } = await supabase
            .from('store_analytics')
            .select('event_type, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        // Group by date
        const grouped: Record<string, { views: number; clicks: number }> = {};
        
        // Initialize all dates in range with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            grouped[dateStr] = { views: 0, clicks: 0 };
        }

        (analytics || []).forEach(item => {
            const dateStr = item.created_at.split('T')[0];
            if (grouped[dateStr]) {
                if (item.event_type === 'store_view') {
                    grouped[dateStr].views += 1;
                } else if (item.event_type === 'product_click') {
                    grouped[dateStr].clicks += 1;
                }
            }
        });

        // Convert to array and sort by date ascending
        const chartData = Object.keys(grouped).map(date => ({
            date,
            views: grouped[date].views,
            clicks: grouped[date].clicks
        })).sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json({ data: chartData });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
