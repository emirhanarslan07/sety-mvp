import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Paddle webhook signature verification would require the @paddle/paddle-node-sdk or crypto verification.
// We can implement a clean verification helper if the PADDLE_WEBHOOK_SECRET is set.
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { event_type, data } = body;

        console.log('Received Paddle Webhook:', { event_type, subscriptionId: data?.id });

        // Extract custom data passed during checkout
        const customData = data?.custom_data || {};
        const userId = customData.userId || customData.user_id;

        if (!userId) {
            console.warn('Webhook received but no userId found in custom data:', customData);
            return NextResponse.json({ received: true, message: 'No userId in custom data' });
        }

        // Initialize Supabase Admin client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Handle subscription active events
        const activeEvents = ['subscription.created', 'subscription.activated', 'subscription.updated'];
        
        if (activeEvents.includes(event_type)) {
            const status = data?.status; // 'active', 'trialing', etc.
            
            // Check if status represents a paid/active subscription
            if (status === 'active') {
                const { error } = await supabaseAdmin
                    .from('user_profiles')
                    .update({
                        plan_type: 'pro',
                        subscription_status: 'active',
                        plan_status: 'active'
                    })
                    .eq('user_id', userId);

                if (error) {
                    console.error('Error updating profile status from webhook:', error);
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                
                console.log(`Successfully updated user ${userId} to Sety Pro via webhook`);
            } else if (status === 'canceled' || status === 'past_due') {
                // Handle cancellation / payment failure
                const { error } = await supabaseAdmin
                    .from('user_profiles')
                    .update({
                        plan_type: 'founder', // Revert to basic/founder
                        subscription_status: status,
                        plan_status: status
                    })
                    .eq('user_id', userId);

                if (error) {
                    console.error('Error downgrading profile from webhook:', error);
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
                
                console.log(`Successfully updated user ${userId} status to ${status} via webhook`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Paddle Webhook processing failed:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
