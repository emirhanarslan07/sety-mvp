import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function generateRandomToken(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get store
        const { data: store } = await supabase
            .from('stores')
            .select('id, username')
            .eq('user_id', user.id)
            .single();

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        // Get order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, product:products(type)')
            .eq('id', id)
            .eq('store_id', store.id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.status === 'completed') {
            return NextResponse.json({ error: 'Order already completed' }, { status: 400 });
        }

        let downloadTokenId = null;
        let downloadUrl = null;

        // If digital product, generate download token
        if (order.product?.type === 'digital_product') {
            const token = generateRandomToken();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days valid

            const { data: tokenData, error: tokenError } = await supabase
                .from('download_tokens')
                .insert({
                    order_id: id,
                    token,
                    expires_at: expiresAt.toISOString(),
                    max_uses: 3
                })
                .select('id')
                .single();

            if (tokenError) {
                console.error('Error generating token:', tokenError);
            } else if (tokenData) {
                downloadTokenId = tokenData.id;
                downloadUrl = `https://sety.store/download/${token}`; // Example
            }
        }

        // Update order status
        const updatePayload: any = {
            status: 'completed',
            confirmed_at: new Date().toISOString()
        };
        
        if (downloadTokenId) {
            updatePayload.download_token_id = downloadTokenId;
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update(updatePayload)
            .eq('id', id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // TODO: Send Email & Telegram Notification
        // e.g. await sendEmail(...)
        // await sendTelegram(...)

        return NextResponse.json({ success: true, order: { ...order, status: 'completed' }, download_url: downloadUrl });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
