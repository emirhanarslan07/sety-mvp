import posthog from 'posthog-js';
import { supabase } from '@/lib/supabase/client';

export type AnalyticsEvent =
    | 'page_view'
    | 'waitlist_submit'
    | 'signup'
    | 'email_confirmed'
    | 'onboarding_start'
    | 'onboarding_complete'
    | 'calc_start'
    | 'calc_complete'
    | 'upgrade_click'
    | 'referral_click'
    | 'store_view'
    | 'product_click'
    | 'checkout_open'
    | 'checkout_complete'
    | 'external_checkout_redirect'
    | 'product_create'
    | 'product_update';

interface EventProperties {
    [key: string]: any;
}

export async function trackEvent(
    eventName: AnalyticsEvent,
    properties: EventProperties = {},
    storeId?: string
) {
    try {
        // Get current user if authenticated
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Send to PostHog
        if (typeof window !== 'undefined') {
            posthog.capture(eventName, {
                ...properties,
                store_id: storeId,
                timestamp: new Date().toISOString(),
            });
        }

        // Also log to Supabase for redundancy
        await supabase.from('analytics_events').insert({
            user_id: user?.id || null,
            store_id: storeId || properties.store_id || null, // Capture from both param and props
            event_name: eventName,
            metadata: properties,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

// Convenience functions for common events
export const analytics = {
    pageView: (page: string, referrer?: string) =>
        trackEvent('page_view', { page, referrer }),

    waitlistSubmit: (email: string) =>
        trackEvent('waitlist_submit', { email }),

    signup: (method: string = 'email') =>
        trackEvent('signup', { method }),

    emailConfirmed: () =>
        trackEvent('email_confirmed', {}),

    onboardingStart: () =>
        trackEvent('onboarding_start', {}),

    onboardingComplete: (data: {
        niche: string;
        platform: string;
        followers: number;
        engagement: number;
    }) => trackEvent('onboarding_complete', data),

    calcStart: (tool: string) =>
        trackEvent('calc_start', { tool }),

    calcComplete: (tool: string, result: any) =>
        trackEvent('calc_complete', { tool, result }),

    upgradeClick: (feature: string) =>
        trackEvent('upgrade_click', { feature }),

    referralClick: (source: string) =>
        trackEvent('referral_click', { source }),

    productCreate: (type: string, price: number, storeId?: string) =>
        trackEvent('product_create', { type, price }, storeId),

    productUpdate: (type: string, productId: string, storeId?: string) =>
        trackEvent('product_update', { type, product_id: productId }, storeId),
};
