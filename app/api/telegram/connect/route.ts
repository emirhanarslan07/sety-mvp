import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, error: "Token gerekli" }, { status: 400 });
        }

        // 1. Validate token with Telegram getMe API
        const telegramRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const botData = await telegramRes.json();

        if (!botData.ok) {
            return NextResponse.json({ success: false, error: "Geçersiz token" }, { status: 400 });
        }

        const botName = botData.result.first_name;
        const botUsername = botData.result.username;

        // 2. Identify the store owner (Mocking session for now - replace with actual session logic)
        // In a real scenario, you'd get the user from cookies/headers and fetch their store_id
        // For this task, we assume the authentication is handled by the middleware/context
        // and we fetch the store_id associated with the authenticated user.
        
        // This is a placeholder for session-based store_id retrieval
        // const { data: { user } } = await supabase.auth.getUser(); 
        // const { data: store } = await supabaseAdmin.from('stores').select('id').eq('user_id', user.id).single();
        // const store_id = store.id;
        
        // Since I cannot access the actual session helper without proper library setup,
        // I will use a placeholder comment. The user should ensure store_id is available.
        const store_id = req.headers.get('x-store-id'); // Example way to get it if passed by middleware

        if (!store_id) {
            return NextResponse.json({ success: false, error: "Yetkisiz erişim veya mağaza bulunamadı" }, { status: 401 });
        }

        // 3. Upsert to store_telegram_settings
        const { error } = await supabaseAdmin
            .from('store_telegram_settings')
            .upsert({
                store_id,
                bot_token: token,
                bot_username: botUsername,
                is_active: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'store_id' });

        if (error) throw error;

        // 4. Set webhook automatically
        const webhookUrl = "https://sety.store/api/telegram/webhook";
        await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);

        // 5. Return success response (Security: Never return the token)
        return NextResponse.json({ 
            success: true, 
            bot_name: botName, 
            bot_username: botUsername 
        });

    } catch (error: any) {
        console.error('Telegram Connect Error:', error);
        return NextResponse.json({ success: false, error: "Bağlantı sırasında bir hata oluştu" }, { status: 500 });
    }
}
