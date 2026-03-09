'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useRef } from 'react';

export function PHProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

        if (posthogKey && posthogHost) {
            posthog.init(posthogKey, {
                api_host: posthogHost,
                capture_pageview: true,
                capture_pageleave: true,
                autocapture: false,
            });
            initialized.current = true;
        }
    }, []);

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
