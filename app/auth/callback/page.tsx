'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Check if user has completed onboarding
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (profile) {
                    router.push('/dashboard');
                } else {
                    router.push('/onboarding');
                }
            } else {
                router.push('/auth');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 text-4xl">⏳</div>
                <p className="text-gray-600">Verifying your email...</p>
            </div>
        </div>
    );
}
