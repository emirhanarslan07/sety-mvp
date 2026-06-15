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

        // 1. Toplam (Tümü)
        const { data: totalData } = await supabase
            .from('orders')
            .select('amount, status')
            .eq('store_id', store.id)
            .in('status', ['completed', 'paid']);

        // 2. Bugün (Tümü, sonra JS'de ayıracağız performans için veya DB'de sorgulayabiliriz. DB query daha iyi.)
        const { data: todayData } = await supabase
            .from('orders')
            .select('amount')
            .eq('store_id', store.id)
            .in('status', ['completed', 'paid'])
            .gte('created_at', startOfToday);

        // 3. Bu Ay
        const { data: monthData } = await supabase
            .from('orders')
            .select('amount')
            .eq('store_id', store.id)
            .in('status', ['completed', 'paid'])
            .gte('created_at', startOfMonth);

        // 4. Bekleyen siparişler
        const { count: pendingCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', store.id)
            .eq('status', 'pending');

        const calculateTotal = (data: any[]) => data?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

        return NextResponse.json({
            today: {
                revenue: calculateTotal(todayData || []),
                orders: todayData?.length || 0
            },
            this_month: {
                revenue: calculateTotal(monthData || []),
                orders: monthData?.length || 0
            },
            total: {
                revenue: calculateTotal(totalData || []),
                orders: totalData?.length || 0
            },
            pending: pendingCount || 0
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
