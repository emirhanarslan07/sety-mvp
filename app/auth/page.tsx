'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SetyLogo } from '@/components/sety/brand';
import { motion } from 'framer-motion';

function AuthRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const mode = searchParams.get('mode');
        const auth = mode === 'register' || mode === 'signup' ? 'signup' : 'login';
        router.replace(`/?auth=${auth}`);
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen bg-white items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <SetyLogo />
                </motion.div>
                <p className="text-slate-400 font-medium text-sm">Yönlendiriliyorsunuz...</p>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen bg-white items-center justify-center" />}>
            <AuthRedirect />
        </Suspense>
    );
}
