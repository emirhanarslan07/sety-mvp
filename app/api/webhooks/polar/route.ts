import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET || "dummy_secret",
  onPayload: async (payload) => {
    // Top level handler
  },
  onSubscriptionCreated: async (payload) => {
    console.log("Subscription created:", JSON.stringify(payload, null, 2));
    const subscriptionId = payload.data.id;
    const customerId = payload.data.customerId;
    const status = payload.data.status;
    const currentPeriodEnd = payload.data.currentPeriodEnd;
    
    // We expect userId to be passed via checkout metadata
    // Cast to any to bypass strict type checking if metadata isn't explicitly typed
    const userId = (payload.data as any).metadata?.userId;

    if (!userId) {
      console.error("Missing userId in subscription metadata");
      return;
    }

    const planType = status === 'active' || status === 'trialing' ? 'pro' : 'founder';

    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: status,
        polar_subscription_id: subscriptionId,
        polar_customer_id: customerId,
        trial_ends_at: currentPeriodEnd,
        plan_type: planType
      })
      .eq('user_id', userId);
  },
  onSubscriptionUpdated: async (payload) => {
    console.log("Subscription updated:", JSON.stringify(payload, null, 2));
    const subscriptionId = payload.data.id;
    const status = payload.data.status;
    const currentPeriodEnd = payload.data.currentPeriodEnd;

    const planType = status === 'active' || status === 'trialing' ? 'pro' : 'founder';

    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: status,
        trial_ends_at: currentPeriodEnd,
        plan_type: planType
      })
      .eq('polar_subscription_id', subscriptionId);
  },
  onSubscriptionActive: async (payload) => {
      console.log("Subscription active:", JSON.stringify(payload, null, 2));
      const subscriptionId = payload.data.id;
      
      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: 'active',
          plan_type: 'pro'
        })
        .eq('polar_subscription_id', subscriptionId);
  },
  onSubscriptionCanceled: async (payload) => {
      console.log("Subscription canceled:", JSON.stringify(payload, null, 2));
      const subscriptionId = payload.data.id;

      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: 'canceled',
          plan_type: 'founder'
        })
        .eq('polar_subscription_id', subscriptionId);
  }
});
