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

        // Fetch all orders for the funnel
        const { data: orders, error } = await supabase
            .from('orders')
            .select('status')
            .eq('store_id', store.id);

        if (error) throw error;

        const total = orders?.length || 0;
        
        if (total === 0) {
            return NextResponse.json({ 
                data: {
                    total: 0,
                    completed: 0,
                    pending: 0,
                    rejected: 0,
                    conversionRate: 0
                } 
            });
        }

        const completed = orders.filter(o => o.status === 'completed' || o.status === 'paid').length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const rejected = orders.filter(o => o.status === 'rejected' || o.status === 'cancelled').length;
        const conversionRate = (completed / total) * 100;

        return NextResponse.json({ 
            data: {
                total,
                completed,
                pending,
                rejected,
                conversionRate
            } 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
