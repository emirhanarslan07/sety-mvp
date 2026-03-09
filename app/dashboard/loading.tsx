'use client';

import React from 'react';

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-8 p-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-4">
                <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl border border-gray-100"></div>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-64 bg-gray-100 rounded-2xl border border-gray-100"></div>
                    <div className="h-96 bg-gray-100 rounded-2xl border border-gray-100"></div>
                </div>
                <div className="space-y-6">
                    <div className="h-[500px] bg-gray-100 rounded-2xl border border-gray-100"></div>
                </div>
            </div>
        </div>
    );
}
