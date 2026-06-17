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

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // 1. Toplam (Tümü) Ziyaretçi
        const { count: totalViews } = await supabase
            .from('store_analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'store_view');

        // 2. Bugün Ziyaretçi
        const { count: todayViews } = await supabase
            .from('store_analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'store_view')
            .gte('created_at', startOfToday);

        // 3. Bu Ay Ziyaretçi
        const { count: monthViews } = await supabase
            .from('store_analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'store_view')
            .gte('created_at', startOfMonth);

        // 4. Toplam Tıklanma (product_click)
        const { count: totalClicks } = await supabase
            .from('store_analytics')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'product_click');

        return NextResponse.json({
            today: {
                views: todayViews || 0,
            },
            this_month: {
                views: monthViews || 0,
            },
            total: {
                views: totalViews || 0,
                clicks: totalClicks || 0
            }
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
