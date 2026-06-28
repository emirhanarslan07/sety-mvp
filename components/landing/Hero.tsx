'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthModal } from '@/context/AuthModalContext';

export function Hero() {
    const { openModal } = useAuthModal();
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-indigo-50 py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                            ✨ Beta Phase - Free Access
                        </div>

                        {/* Headline */}
                        <h1 className="mb-6">
                            Launch Your Digital Store in 2 Minutes,
                            <br />
                            <span className="gradient-text">
                                Start Selling Now.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mb-10 text-lg text-gray-600">
                            Sell your digital products, coaching services, and subscriptions from a single hub with Sety. Focus on creating, we&apos;ll handle the rest.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                            <Button size="lg" className="w-full sm:w-auto" onClick={() => openModal('signup')}>
                                Get My Projection →
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                See Example
                            </Button>
                        </div>

                        {/* Trust Badge */}
                        <p className="mt-8 text-sm text-gray-500">
                            Trusted by 100+ creators • No credit card required
                        </p>
                    </div>

                    {/* Right: Floating iPhone Mockup */}
                    <div className="relative hidden lg:block">
                        <div className="relative mx-auto w-[300px] transform transition-transform hover:scale-105">
                            {/* iPhone Frame */}
                            <div className="overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-white shadow-soft-lg">
                                {/* Screen Content */}
                                <div className="h-[600px] bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                                    {/* Mock Dashboard */}
                                    <div className="mb-4 rounded-xl bg-white p-4 shadow-soft">
                                        <div className="mb-2 text-xs font-semibold text-gray-500">Monthly Revenue</div>
                                        <div className="text-3xl font-bold text-gray-900">$1,247</div>
                                    </div>

                                    {/* Mock Product Cards */}
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="rounded-xl bg-white p-4 shadow-soft">
                                                <div className="mb-2 h-3 w-24 rounded bg-gray-200"></div>
                                                <div className="h-2 w-16 rounded bg-gray-100"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -right-4 top-20 animate-pulse rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-soft-lg">
                                +$500/mo
                            </div>
                            <div className="absolute -left-4 bottom-32 animate-pulse rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-soft-lg">
                                26 sales
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute left-0 top-0 -z-10 h-full w-full">
                <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-indigo-200 opacity-20 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-200 opacity-20 blur-3xl" />
            </div>
        </section>
    );
}
