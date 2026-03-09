'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="max-w-[1200px] mx-auto px-8 py-16 space-y-16 animate-in fade-in duration-500">
            {/* Greeting Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-[300px] rounded-2xl" />
                <Skeleton className="h-8 w-[240px] rounded-2xl" />
            </div>

            {/* Stats/Action Cards Skeleton */}
            <div className="space-y-6 max-w-[520px]">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-full bg-white rounded-[40px] p-10 flex items-center justify-between border border-slate-100 shadow-sm"
                    >
                        <div className="flex-1 space-y-4 pr-6">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-[200px] rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full rounded-full" />
                            <Skeleton className="h-4 w-3/4 rounded-full" />
                        </div>
                        <Skeleton className="w-24 h-24 rounded-[32px] shrink-0" />
                    </div>
                ))}
            </div>

            {/* Bottom Section Skeleton (Potential) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-[40px]" />
                ))}
            </div>
        </div>
    );
}
