'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthModal } from '@/context/AuthModalContext';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import { SetyLogo } from '@/components/sety/brand';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, ArrowUpRight, ShieldCheck } from 'lucide-react';

export function AuthModal() {
    const { isOpen, mode, closeModal, openModal } = useAuthModal();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const isLogin = mode === 'login';

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
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
        } catch (err: any) {
            showToast(err.message || 'An error occurred during Google sign-in.', 'error');
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

                if (signInError) {
                    setError('Invalid email or password.');
                    setLoading(false);
                } else {
                    closeModal();
                    window.location.href = '/dashboard';
                }
            } else {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            full_name: name.trim() || undefined,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (signUpError) {
                    setError(signUpError.message);
                    setLoading(false);
                } else {
                    showToast('Account created! You can now sign in.', 'success');
                    openModal('login');
                    setLoading(false);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="max-w-[390px] w-[calc(100vw-32px)] p-6 sm:p-7 bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden font-sans">
                <DialogTitle className="sr-only">
                    {isLogin ? 'Sign In to Sety' : 'Create your Sety Store'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {isLogin ? 'Sign in to your creator store' : 'Create your free store'}
                </DialogDescription>

                <div className="flex flex-col items-center text-center">
                    {/* Brand */}
                    <div className="mb-4">
                        <SetyLogo compact />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5500FF] mb-1">
                        {isLogin ? 'WELCOME BACK' : 'YOUR NEXT CHAPTER, SETY'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                        {isLogin ? 'Sign in to your store' : 'Claim your digital space'}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mb-5 max-w-[280px]">
                        {isLogin
                            ? 'Manage your sales, orders, and consultations.'
                            : 'Turn your knowledge, sessions, and guides into income.'}
                    </p>

                    {/* Minimal Official Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full h-11 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-3 my-4">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">or with email</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="w-full space-y-3">
                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full name"
                                    required
                                    className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                autoComplete="email"
                                className="w-full h-10 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password (min. 6 characters)"
                                required
                                minLength={6}
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                className="w-full h-10 px-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-semibold px-1 text-left">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In to Store' : 'Create Free Store'}</span>
                                    <ArrowUpRight size={14} />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center gap-1">
                            <ShieldCheck size={13} className="text-emerald-500" /> No credit card required
                        </span>
                        <span>·</span>
                        <span>0% commission</span>
                    </div>

                    {/* Switch mode */}
                    <div className="mt-4 pt-3 border-t border-slate-100 w-full">
                        <p className="text-xs text-slate-500 font-medium">
                            {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    openModal(isLogin ? 'signup' : 'login');
                                }}
                                className="text-[#5500FF] font-bold hover:underline ml-1"
                            >
                                {isLogin ? 'Sign Up Free' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
