import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramRequest(method: string, body: any) {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return res.json();
}

export async function POST(req: Request) {
    try {
        const update = await req.json();
        console.log('Telegram update:', update);

        // Handle /start command
        if (update.message) {
            const { text, chat } = update.message;
            const chatId = chat.id;

            if (text?.startsWith('/start')) {
                const storeId = text.split(' ')[1];
                if (storeId) {
                    // Save mapping: chat_id to store_id
                    await supabaseAdmin
                        .from('store_telegram_settings')
                        .upsert({ 
                            store_id: storeId, 
                            chat_id: chatId.toString(),
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'store_id' });

                    // Fetch store name
                    const { data: store } = await supabaseAdmin
                        .from('stores')
                        .select('name')
                        .eq('id', storeId)
                        .single();

                    const storeName = store?.name || 'Mağazamız';

                    await sendTelegramRequest('sendMessage', {
                        chat_id: chatId,
                        text: `👋 ${storeName} mağazasına hoş geldiniz!\n\nNeler arıyorsunuz?`,
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '📦 Ürünleri Gör', callback_data: 'products' }],
                                [{ text: 'ℹ️ Hakkında', callback_data: 'about' }]
                            ]
                        }
                    });
                }
            }
        } 
        
        // Handle Button Clicks
        else if (update.callback_query) {
            const { data, message } = update.callback_query;
            const chatId = message.chat.id;
            const messageId = message.message_id;

            // Identify the store for this user/chat
            const { data: settings } = await supabaseAdmin
                .from('store_telegram_settings')
                .select('store_id')
                .eq('chat_id', chatId.toString())
                .maybeSingle();

            const storeId = settings?.store_id;

            if (!storeId) {
                await sendTelegramRequest('sendMessage', {
                    chat_id: chatId,
                    text: '⚠️ Mağaza bağlantısı bulunamadı. Lütfen mağaza linki üzerinden tekrar giriş yapın.'
                });
                return NextResponse.json({ status: 'ok' });
            }

            // Show Product List
            if (data === 'products' || data === 'back') {
                const { data: products } = await supabaseAdmin
                    .from('products')
                    .select('id, title, price, currency')
                    .eq('store_id', storeId)
                    .order('created_at', { ascending: false });

                const keyboard = products?.map(p => ([{
                    text: `${p.title} - ${p.price} ${p.currency || 'TRY'}`,
                    callback_data: `product_${p.id}`
                }])) || [];

                await sendTelegramRequest('editMessageText', {
                    chat_id: chatId,
                    message_id: messageId,
                    text: '🎯 Lütfen bir ürün seçin:',
                    reply_markup: { inline_keyboard: keyboard }
                });
            } 
            
            // Show Product Details
            else if (data.startsWith('product_')) {
                const productId = data.replace('product_', '');
                const { data: product } = await supabaseAdmin
                    .from('products')
                    .select('*, stores(slug)')
                    .eq('id', productId)
                    .single();

                if (product) {
                    const storeSlug = (product.stores as any)?.slug;
                    const buyUrl = `https://sety.store/@${storeSlug}/${product.slug}`;

                    const text = `*${product.title}*\n\n💰 Fiyat: ${product.price} ${product.currency || 'TRY'}\n\n${product.description || ''}`;

                    await sendTelegramRequest('editMessageText', {
                        chat_id: chatId,
                        message_id: messageId,
                        text: text,
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🛒 Satın Al 🔗', url: buyUrl }],
                                [{ text: '🔙 Geri', callback_data: 'products' }]
                            ]
                        }
                    });
                }
            }
            
            // Answer callback query to remove loading state
            await sendTelegramRequest('answerCallbackQuery', {
                callback_query_id: update.callback_query.id
            });
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Telegram Webhook Error:', error);
        // Always return 200/ok to avoid Telegram retries on temporary errors
        return NextResponse.json({ status: 'ok' });
    }
}
