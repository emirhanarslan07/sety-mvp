'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { name: 'Current', value: 0 },
    { name: 'Month 1', value: 1247 },
    { name: 'Month 3', value: 3741 },
    { name: 'Month 6', value: 7482 },
];

export function ExampleProjection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                            See What&apos;s Possible
                        </h2>
                        <p className="text-lg text-gray-600">
                            Real projection for a creator with 5,000 followers
                        </p>
                    </div>

                    <Card className="overflow-hidden border-2 border-purple-200">
                        <CardContent className="p-8">
                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Left: Input Data */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-700">
                                        Creator Profile
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Followers:</span>
                                            <span className="font-semibold text-gray-900">
                                                5,000
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Engagement:</span>
                                            <span className="font-semibold text-gray-900">3.5%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Product Type:</span>
                                            <span className="font-semibold text-gray-900">
                                                Digital Course
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-semibold text-gray-900">$47</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Projection Results */}
                                <div className="rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-6 text-white">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        Revenue Projection
                                    </h3>
                                    <div className="mb-6">
                                        <div className="text-sm opacity-90">
                                            Estimated Monthly Revenue
                                        </div>
                                        <div className="text-5xl font-bold">$1,247</div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="opacity-90">Active Audience:</span>
                                            <span className="font-semibold">175</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-90">Expected Sales:</span>
                                            <span className="font-semibold">26/month</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="mt-8">
                                <h4 className="mb-4 text-center text-sm font-semibold text-gray-700">
                                    Revenue Growth Projection
                                </h4>
                                {mounted ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={chartData}>
                                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                            <YAxis stroke="#6b7280" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                }}
                                                formatter={(value) => `$${value}`}
                                            />
                                            <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                                            <defs>
                                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#9333ea" />
                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-[200px] items-center justify-center text-gray-400">
                                        Loading chart...
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    ⚡ This calculation took{' '}
                                    <span className="font-semibold text-purple-600">
                                        60 seconds
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

