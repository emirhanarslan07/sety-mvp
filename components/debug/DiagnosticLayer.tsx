'use client';

import React, { useEffect, useRef } from 'react';

export default function DiagnosticLayer() {
    const renders = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        console.log('%c[DIAGNOSTIC] Root Layer Mounted', 'color: #5500ff; font-weight: bold;');

        // 1. HMR Monitoring
        if (typeof window !== 'undefined' && (window as any).module?.hot) {
            console.log('[DIAGNOSTIC] HMR Enabled');
            (window as any).module.hot.addStatusHandler((status: string) => {
                console.log(`%c[HMR] Status: ${status}`, 'color: #f59e0b; font-weight: bold;');
            });
        }

        // 2. Memory Monitoring
        const memoryInterval = setInterval(() => {
            const perf = (performance as any).memory;
            if (perf) {
                const used = Math.round(perf.usedJSHeapSize / 1024 / 1024);
                const total = Math.round(perf.totalJSHeapSize / 1024 / 1024);
                const limit = Math.round(perf.jsHeapSizeLimit / 1024 / 1024);

                if (used > limit * 0.8) {
                    console.warn(`%c[MEMORY] High Usage: ${used}MB / ${limit}MB`, 'color: #ef4444; font-weight: bold;');
                } else {
                    // Log occasionally to avoid console noise
                    if (renders.current % 10 === 0) {
                        console.debug(`[MEMORY] ${used}MB used`);
                    }
                }
            }
        }, 5000);

        return () => {
            clearInterval(memoryInterval);
            console.log('%c[DIAGNOSTIC] Root Layer Unmounted (Full Reload?)', 'color: #ef4444; font-weight: bold;');
        };
    }, []);

    renders.current++;
    const now = Date.now();
    const diff = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (diff < 100 && renders.current > 1) {
        console.warn(`%c[PERF] Rapid Root Render Detected! (${diff}ms)`, 'color: #f59e0b; font-weight: bold;');
    }

    return null;
}
