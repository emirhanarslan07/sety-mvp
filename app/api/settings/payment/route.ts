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

        // Get store id
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const { data, error } = await supabase
            .from('store_payment_settings')
            .select('*')
            .eq('store_id', store.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is not found
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data: data || null });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get store id
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const updateData = {
            store_id: store.id,
            default_provider: body.default_provider,
            paddle_checkout_url: body.paddle_checkout_url,
            paypal_me_username: body.paypal_me_username,
            bank_iban: body.bank_iban,
            bank_account_holder: body.bank_account_holder,
            bank_transfer_instructions: body.bank_transfer_instructions,
            other_payment_instructions: body.other_payment_instructions,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('store_payment_settings')
            .upsert(updateData);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
