import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        // Auth Note: Extract store_id from session/headers as per your auth logic
        const store_id = searchParams.get('store_id') || req.headers.get('x-store-id');

        if (!store_id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: settings, error } = await supabaseAdmin
            .from('store_telegram_settings')
            .select('*')
            .eq('store_id', store_id)
            .maybeSingle();

        if (error) throw error;

        if (!settings) {
            return NextResponse.json({
                is_active: false,
                bot_name: null,
                bot_username: null,
                bot_token_masked: "",
                welcome_message: true,
                seller_notifications: true,
                customer_notifications: true
            });
        }

        // Requirement: Mask bot_token: show only first 10 chars + "..."
        const bot_token_masked = settings.bot_token 
            ? settings.bot_token.substring(0, 10) + "..." 
            : "";

        return NextResponse.json({
            is_active: settings.is_active,
            bot_name: settings.bot_name || "Bot",
            bot_username: settings.bot_username,
            bot_token_masked,
            welcome_message: settings.welcome_message ?? true,
            seller_notifications: settings.seller_notifications ?? true,
            customer_notifications: settings.customer_notifications ?? true
        });

    } catch (error: any) {
        console.error('Settings GET error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { store_id: bodyStoreId, ...updates } = body;
        
        // Auth Note: Extract store_id from session/headers
        const store_id = bodyStoreId || req.headers.get('x-store-id');

        if (!store_id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('store_telegram_settings')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('store_id', store_id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Settings PATCH error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
