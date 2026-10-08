'use server';

import { supabaseAdmin } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface AppointmentData {
    profileUserId: string;
    profileId: string; // store_id
    productId: string;
    productTitle: string;
    productPrice: number;
    currency: string;
    creatorName?: string;
    creatorEmail?: string;
    fullName: string;
    phone: string;
    email: string;
    sessionType: 'online' | 'in_person';
    locationAddress?: string;
    preferredDate: string;
    timeSlot: string;
    clientNote?: string;
    paymentMode?: 'request_only' | 'pay_now';
}

export async function createAppointmentRequestAction(data: AppointmentData) {
    try {
        const {
            profileUserId,
            profileId,
            productId,
            productTitle,
            productPrice,
            currency,
            creatorName,
            creatorEmail,
            fullName,
            phone,
            email,
            sessionType,
            locationAddress,
            preferredDate,
            timeSlot,
            clientNote,
            paymentMode = 'request_only',
        } = data;

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPhone = phone.trim();

        // 1. Upsert Customer with Phone number
        let customerId: string | null = null;
        const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('email', normalizedEmail)
            .eq('store_id', profileId)
            .maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
            // Update phone and name if provided
            await supabaseAdmin
                .from('customers')
                .update({
                    name: fullName.trim(),
                    phone: normalizedPhone,
                })
                .eq('id', customerId);
        } else {
            const { data: newCustomer, error: customerError } = await supabaseAdmin
                .from('customers')
                .insert([{
                    user_id: profileUserId,
                    store_id: profileId,
                    email: normalizedEmail,
                    name: fullName.trim(),
                    phone: normalizedPhone,
                }])
                .select('id')
                .single();

            if (!customerError && newCustomer) {
                customerId = newCustomer.id;
            }
        }

        // 2. Structured Appointment metadata in order notes
        const appointmentMeta = {
            is_appointment: true,
            session_type: sessionType,
            location: locationAddress || null,
            preferred_date: preferredDate,
            time_slot: timeSlot,
            phone: normalizedPhone,
            client_note: clientNote?.trim() || null,
            appointment_status: 'new', // 'new' | 'confirmed' | 'completed' | 'cancelled'
            payment_mode: paymentMode,
        };

        const orderNumber = `APT-${Date.now().toString(36).toUpperCase()}`;

        // 3. Create Order record
        const { data: orderData, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([{
                user_id: profileUserId,
                store_id: profileId,
                product_id: productId,
                customer_id: customerId,
                customer_email: normalizedEmail,
                customer_name: fullName.trim(),
                amount: productPrice || 0,
                currency: currency || 'TRY',
                status: 'pending',
                order_number: orderNumber,
                payment_provider: paymentMode === 'pay_now' ? 'shopier' : 'request_only',
                payment_link_type: 'appointment',
                notes: JSON.stringify(appointmentMeta),
            }])
            .select('id')
            .single();

        if (orderError) {
            console.error('Order creation error for appointment:', orderError);
            throw new Error(orderError.message);
        }

        // 4. Analytics event
        await supabaseAdmin.from('analytics_events').insert([{
            user_id: profileUserId,
            store_id: profileId,
            event_name: 'appointment_requested',
            product_id: productId,
            metadata: {
                fullName,
                phone: normalizedPhone,
                email: normalizedEmail,
                sessionType,
                preferredDate,
                timeSlot,
                price: productPrice,
            },
        }]);

        // 5. Telegram Notification if creator connected Telegram
        try {
            const { data: telegramSettings } = await supabaseAdmin
                .from('store_telegram_settings')
                .select('*')
                .eq('store_id', profileId)
                .maybeSingle();

            if (telegramSettings && telegramSettings.bot_token && telegramSettings.chat_id) {
                const sessionLabel = sessionType === 'online' ? '🌐 Online Seans' : `📍 Yüz Yüze Seans (${locationAddress || 'Klinik'})`;
                const cleanPhone = normalizedPhone.replace(/\D/g, '');
                const cleanWithCountry = cleanPhone.startsWith('90') ? cleanPhone : cleanPhone.startsWith('0') ? '9' + cleanPhone : '90' + cleanPhone;
                const encodedMsg = encodeURIComponent(`Merhaba ${fullName}, Sety üzerinden ilettiğiniz "${productTitle}" randevu talebinizi aldım. Randevu detaylarını netleştirmek için yazıyorum.`);
                const waUrl = `https://wa.me/${cleanWithCountry}?text=${encodedMsg}`;

                const text = `🔔 *Yeni Seans Talebi!*\n\n` +
                    `👤 *Danışan:* ${fullName}\n` +
                    `📞 *Telefon:* ${normalizedPhone}\n` +
                    `✉️ *E-posta:* ${normalizedEmail}\n` +
                    `🎯 *Hizmet:* ${productTitle}\n` +
                    `🧭 *Tür:* ${sessionLabel}\n` +
                    `📅 *Tarih Tercihi:* ${preferredDate}\n` +
                    `⏰ *Zaman Dilimi:* ${timeSlot}\n` +
                    (clientNote ? `💬 *Not:* ${clientNote}\n\n` : '\n') +
                    `📲 [WhatsApp'tan Hemen Yaz](${waUrl})`;

                await fetch(`https://api.telegram.org/bot${telegramSettings.bot_token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: telegramSettings.chat_id,
                        text,
                        parse_mode: 'Markdown',
                    }),
                });
            }
        } catch (tgErr) {
            console.error('Telegram notification error:', tgErr);
        }

        // 6. Email notification to creator via Resend
        if (resend && creatorEmail) {
            try {
                const sessionLabel = sessionType === 'online' ? 'Online Seans (Google Meet / Zoom)' : `Yüz Yüze Seans (${locationAddress || 'Klinik'})`;
                await resend.emails.send({
                    from: 'Sety Randevu <onboarding@resend.dev>',
                    to: creatorEmail,
                    subject: `Yeni Seans Talebi: ${fullName} — ${productTitle}`,
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #111827;">
                            <div style="background: #5500FF; border-radius: 16px; padding: 24px; color: #ffffff; margin-bottom: 24px;">
                                <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800;">Yeni Bir Seans Talebiniz Var! 🚀</h1>
                                <p style="margin: 0; opacity: 0.9; font-size: 15px;">${fullName} danışmanlık randevusu için talep oluşturdu.</p>
                            </div>
                            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Hizmet:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${productTitle}</td></tr>
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Görüşme Türü:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${sessionLabel}</td></tr>
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tercih Edilen Tarih:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${preferredDate}</td></tr>
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Zaman Aralığı:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${timeSlot}</td></tr>
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Danışan Telefon:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;"><a href="tel:${normalizedPhone}" style="color: #5500FF;">${normalizedPhone}</a></td></tr>
                                    <tr><td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Danışan E-posta:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">${normalizedEmail}</td></tr>
                                </table>
                                ${clientNote ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;"><strong style="font-size: 13px; color: #4b5563;">Danışan Notu:</strong><p style="margin: 6px 0 0 0; font-size: 14px; color: #111827; font-style: italic;">"${clientNote}"</p></div>` : ''}
                            </div>
                            <div style="text-align: center;">
                                <a href="https://sety.store/dashboard/appointments" style="display: inline-block; background: #5500FF; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 12px; font-size: 15px;">Panelde Görüntüle ve Onayla →</a>
                            </div>
                        </div>
                    `,
                });
            } catch (mailErr) {
                console.error('Email send error:', mailErr);
            }
        }

        return {
            success: true,
            orderId: orderData?.id,
            orderNumber,
        };
    } catch (err: any) {
        console.error('createAppointmentRequestAction error:', err);
        return {
            success: false,
            error: err.message || 'Randevu talebi oluşturulurken bir hata oluştu',
        };
    }
}

export async function updateAppointmentStatusAction(orderId: string, newStatus: 'new' | 'confirmed' | 'completed' | 'cancelled') {
    try {
        const { data: order, error: fetchError } = await supabaseAdmin
            .from('orders')
            .select('notes, status')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) throw new Error('Randevu kaydı bulunamadı');

        let meta: any = {};
        try {
            meta = typeof order.notes === 'string' ? JSON.parse(order.notes) : order.notes || {};
        } catch {
            meta = {};
        }

        meta.appointment_status = newStatus;
        const mappedOrderStatus = newStatus === 'cancelled' ? 'cancelled' : newStatus === 'completed' ? 'paid' : 'pending';

        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                notes: JSON.stringify(meta),
                status: mappedOrderStatus,
                confirmed_at: newStatus === 'confirmed' ? new Date().toISOString() : undefined,
            })
            .eq('id', orderId);

        if (updateError) throw updateError;

        return { success: true };
    } catch (err: any) {
        console.error('updateAppointmentStatusAction error:', err);
        return { success: false, error: err.message };
    }
}
