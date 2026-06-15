import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

async function sendTelegramRequest(token: string, method: string, body: any) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return res.json();
    } catch (error) {
        console.error(`Telegram API error (${method}):`, error);
        return { ok: false, error };
    }
}

export async function POST(req: Request) {
    try {
        const {
            store_id,
            product_name,
            price,
            customer_email,
            download_link,
            order_id,
            customer_chat_id
        } = await req.json();

        if (!store_id) {
            return NextResponse.json({ error: 'store_id is required' }, { status: 400 });
        }

        // 1. Find store_telegram_settings
        const { data: settings, error: settingsError } = await supabaseAdmin
            .from('store_telegram_settings')
            .select('*')
            .eq('store_id', store_id)
            .maybeSingle();

        // 2. If not found or not active
        if (settingsError || !settings || !settings.bot_token || !settings.is_active) {
            return NextResponse.json({ 
                seller_notified: false, 
                customer_notified: false,
                error: "Bot not connected or inactive" 
            }, { status: 200 }); // Status 200 to avoid breaking checkout flow
        }

        const botToken = settings.bot_token;
        let sellerNotified = false;
        let customerNotified = false;

        // 3. Seller Notification
        if (settings.chat_id && settings.seller_notifications) {
            const dateStr = new Date().toLocaleString('tr-TR');
            const sellerMessage = `🎉 *Yeni satış!* \n\n🛒 Ürün: ${product_name}\n💰 Tutar: $${price}\n👤 Müşteri: ${customer_email}\n📅 Tarih: ${dateStr}\n🆔 Sipariş: #${order_id}`;
            
            const res = await sendTelegramRequest(botToken, 'sendMessage', {
                chat_id: settings.chat_id,
                text: sellerMessage,
                parse_mode: 'Markdown'
            });
            
            if (res.ok) sellerNotified = true;
        }

        // 4. Customer Notification
        if (customer_chat_id && settings.customer_notifications) {
            const customerMessage = `✅ *Siparişiniz onaylandı!* \n\n🛒 ${product_name}\n💰 Tutar: $${price}\n📥 İndirin: ${download_link}\n🆔 Sipariş #${order_id}\n\nTeşekkürler! 🙏`;
            
            const res = await sendTelegramRequest(botToken, 'sendMessage', {
                chat_id: customer_chat_id,
                text: customerMessage,
                parse_mode: 'Markdown'
            });

            if (res.ok) customerNotified = true;
        }

        return NextResponse.json({ 
            seller_notified: sellerNotified, 
            customer_notified: customerNotified 
        });

    } catch (error: any) {
        console.error('Send Notification Error:', error);
        return NextResponse.json({ 
            seller_notified: false, 
            customer_notified: false, 
            error: error.message 
        }, { status: 500 });
    }
}
