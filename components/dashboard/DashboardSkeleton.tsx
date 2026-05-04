'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-16 space-y-10 md:space-y-16 animate-in fade-in duration-500">
            {/* Greeting Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-[300px] rounded-2xl" />
                <Skeleton className="h-8 w-[240px] rounded-2xl" />
            </div>

            {/* Stats/Action Cards Skeleton */}
            <div className="space-y-6 max-w-[560px]">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-full bg-white rounded-[32px] p-5 md:p-8 flex items-center gap-6 border border-slate-100 shadow-sm"
                    >
                        <Skeleton className="w-20 h-20 md:w-28 md:h-28 rounded-[24px] shrink-0" />
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-6 w-3/4 rounded-full" />
                            <Skeleton className="h-4 w-full rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section Skeleton (Potential) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-[32px]" />
                ))}
            </div>
        </div>
    );
}
