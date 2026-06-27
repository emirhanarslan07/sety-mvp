'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuthModal } from '@/context/AuthModalContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Button } from '@/components/ui/button';

export function AuthModal() {
    const { isOpen, mode, closeModal, openModal } = useAuthModal();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const isLogin = mode === 'login';

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            showToast(error.message, 'error');
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isLogin) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError('Geçersiz e-posta veya şifre.');
                setLoading(false);
            } else {
                closeModal();
                window.location.href = '/dashboard';
            }
        } else {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
            } else {
                showToast('Kayıt başarılı! Lütfen e-postanızı doğrulayın.', 'success');
                openModal('login');
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-3xl border-slate-100/50 shadow-2xl">
                <DialogTitle className="sr-only">Authentication</DialogTitle>
                <div className="p-8 sm:p-10 flex flex-col items-center">
                    <div className="mb-8">
                        <SetyLogo size="lg" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-2 text-center tracking-tight">
                        {isLogin ? 'Mağazana Giriş Yap' : 'Hemen Başla'}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm text-center mb-8">
                        {isLogin ? "Kaldığın yerden devam et ve satışları yönet." : "Birkaç saniyede mağazanı oluştur ve satışa başla."}
                    </p>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full h-[54px] rounded-full bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[16px] shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                        <FcGoogle className="w-5 h-5" />
                        Google ile devam et
                    </button>

                    <div className="w-full flex items-center gap-4 my-6">
                        <div className="h-px bg-slate-100 flex-1"></div>
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">veya</span>
                        <div className="h-px bg-slate-100 flex-1"></div>
                    </div>

                    <form onSubmit={handleAuth} className="w-full">
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            loading={loading}
                            error={error}
                            handleAuth={handleAuth}
                            setIsForgotPassword={setIsForgotPassword}
                        />
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[14px] font-medium text-slate-500">
                            {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    openModal(isLogin ? 'signup' : 'login');
                                }}
                                className="text-[#5500ff] font-bold hover:underline"
                            >
                                {isLogin ? 'Ücretsiz Hesap Aç' : 'Giriş Yap'}
                            </button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
