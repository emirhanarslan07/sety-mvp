'use server';

import { supabaseAdmin } from '@/lib/supabase/server';

export async function processCheckoutAction(params: {
    profileUserId: string;
    profileId: string;
    email: string;
    name: string;
    productId: string;
    productPrice: number;
    isCoaching: boolean;
}) {
    try {
        const { profileUserId, profileId, email, name, productId, productPrice, isCoaching } = params;

        // 1. Capture/Update Customer (Bypass RLS using supabaseAdmin)
        let customerId = null;
        const { data: existingCustomer } = await supabaseAdmin
            .from('customers')
            .select('id')
            .eq('email', email.toLowerCase())
            .eq('store_id', profileId)
            .maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            const { data: newCustomer, error: customerError } = await supabaseAdmin
                .from('customers')
                .insert([{
                    user_id: profileUserId,
                    store_id: profileId,
                    email: email.toLowerCase(),
                    name: name || 'Müşteri'
                }])
                .select('id')
                .single();
            
            if (customerError) {
                console.error('Customer insert error (Admin):', customerError);
            } else if (newCustomer) {
                customerId = newCustomer.id;
            }
        }

        // 2. Create Order (Bypass RLS)
        const { error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([{
                user_id: profileUserId,
                store_id: profileId,
                product_id: productId,
                customer_id: customerId,
                customer_email: email.toLowerCase(),
                customer_name: name || 'Müşteri',
                amount: productPrice || 0,
                status: productPrice === 0 ? 'paid' : 'pending'
            }]);

        if (orderError) {
            console.error('Order creation error (Admin):', orderError);
        }

        // 3. Track Analytics (Bypass RLS)
        await supabaseAdmin.from('analytics_events').insert([{
            user_id: profileUserId,
            store_id: profileId,
            event_name: isCoaching ? 'appointment_booked' : 'purchase_complete',
            product_id: productId,
            metadata: {
                email: email.toLowerCase(),
                name,
                price: productPrice,
                order_status: productPrice === 0 ? 'paid' : 'pending'
            }
        }]);

        return { success: true };
    } catch (err: any) {
        console.error('processCheckoutAction error:', err);
        return { success: false, error: err.message };
    }
}
