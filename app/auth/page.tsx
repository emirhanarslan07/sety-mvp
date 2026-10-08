'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { motion } from 'framer-motion';

export default function AuthPage() {
    const router = useRouter();

    useEffect(() => {
        // We've switched to PKCE flow, so this bridge page is no longer needed.
        // Redirect to home so the user can click login again.
        router.replace('/');
    }, [router]);

    return (
        <div className="flex min-h-screen bg-white items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <SetyLogo size="lg" className="animate-pulse" />
                </motion.div>
                <p className="text-slate-400 font-medium text-sm">Yönlendiriliyorsunuz...</p>
            </div>
        </div>
    );
}
