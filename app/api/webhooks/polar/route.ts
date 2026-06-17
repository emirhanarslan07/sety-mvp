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
    console.log("Subscription created:", payload);
    const subscriptionId = payload.data.id;
    const customerId = payload.data.customerId;
    const status = payload.data.status;
    const currentPeriodEnd = payload.data.currentPeriodEnd;

    // We can map customer external ID or email back to our users
    // For now, assume customerId is what we store
    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: status,
        polar_subscription_id: subscriptionId,
        polar_customer_id: customerId,
        trial_ends_at: currentPeriodEnd
      })
      .eq('polar_customer_id', customerId);
  },
  onSubscriptionUpdated: async (payload) => {
    console.log("Subscription updated:", payload);
    const subscriptionId = payload.data.id;
    const status = payload.data.status;
    const currentPeriodEnd = payload.data.currentPeriodEnd;

    await supabaseAdmin
      .from('user_profiles')
      .update({
        subscription_status: status,
        trial_ends_at: currentPeriodEnd
      })
      .eq('polar_subscription_id', subscriptionId);
  },
  onSubscriptionActive: async (payload) => {
      console.log("Subscription active:", payload);
  },
  onSubscriptionCanceled: async (payload) => {
      console.log("Subscription canceled:", payload);
      const subscriptionId = payload.data.id;

      await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_status: 'canceled',
        })
        .eq('polar_subscription_id', subscriptionId);
  }
});
