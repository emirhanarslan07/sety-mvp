'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
const supabase = createClientComponentClient();
import { analytics } from '@/lib/analytics/tracker';
import { Check, Mail } from 'lucide-react';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { PremiumInput } from '@/components/ui/PremiumInput';

import { Step4Verify } from '@/components/auth/Step4Verify';
import { LoginForm } from '@/components/auth/LoginForm';

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const mode = searchParams.get('mode');
    const [isLogin, setIsLogin] = useState(mode === 'login');

    useEffect(() => {
        if (mode === 'login') setIsLogin(true);
        else if (mode === 'signup') setIsLogin(false);
    }, [mode]);

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordDirty, setIsPasswordDirty] = useState(false);
    
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    
    const [emailError, setEmailError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    
    const [step, setStep] = useState(1);
    const [verificationCode, setVerificationCode] = useState('');

    // Username Check
    useEffect(() => {
        const checkUsername = async () => {
            if (!username || isLogin || username.length < 3) {
                setUsernameError('');
                setIsUsernameAvailable(false);
                return;
            }

            setIsCheckingUsername(true);
            const { data } = await supabase
                .from('stores')
                .select('username')
                .eq('username', username.toLowerCase())
                .maybeSingle();

            if (data) {
                setUsernameError('Username is already taken.');
                setIsUsernameAvailable(false);
            } else {
                setUsernameError('');
                setIsUsernameAvailable(true);
            }
            setIsCheckingUsername(false);
        };

        const timer = setTimeout(checkUsername, 500);
        return () => clearTimeout(timer);
    }, [username, isLogin]);

    // Email Check
    useEffect(() => {
        const checkEmail = async () => {
            if (!email || isLogin || isForgotPassword || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setEmailError('');
                return;
            }

            setIsCheckingEmail(true);
            const { data } = await supabase
                .from('user_profiles')
                .select('email')
                .eq('email', email.toLowerCase())
                .maybeSingle();

            if (data) setEmailError('This email is already in use!');
            else setEmailError('');
            setIsCheckingEmail(false);
        };

        const timer = setTimeout(checkEmail, 500);
        return () => clearTimeout(timer);
    }, [email, isLogin, isForgotPassword]);

    // Redirect to dashboard on success
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => router.push('/dashboard'), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            showToast(err.message || 'Failed to login with Google.', 'error');
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isLogin) {
            if (step === 1) {
                if (usernameError || !isUsernameAvailable || emailError || isCheckingEmail || isCheckingUsername) return;
                await performSignUp();
            } else if (step === 2) {
                await handleVerifyOtp();
            }
            return;
        }

        setLoading(true);
        try {
            let loginEmail = email;
            if (!email.includes('@')) {
                const { data: profileByUsername } = await supabase
                    .from('stores')
                    .select('user_id, user_profiles:user_id(email)')
                    .eq('username', email.toLowerCase())
                    .maybeSingle();

                if (!profileByUsername) throw new Error('Incorrect username or email.');
                const profileData = Array.isArray(profileByUsername.user_profiles) ? profileByUsername.user_profiles[0] : profileByUsername.user_profiles;
                loginEmail = profileData?.email || '';
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password,
            });

            if (signInError) throw signInError;
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            showToast(err.message || 'Failed to login.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const performSignUp = async () => {
        try {
            setLoading(true);
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        plan_type: 'founder'
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;

            // If session exists, it means email confirmation is disabled in Supabase
            if (data?.session) {
                // Initialize Profile and Store immediately
                const { error: profileError } = await supabase.from('user_profiles').upsert({
                    user_id: data.user!.id,
                    email: data.user!.email!,
                    plan_type: 'founder',
                    subscription_status: 'trialing',
                    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true,
                    onboarding_completed: true,
                });
                if (profileError) console.error('Profile init error:', profileError);

                const { error: storeError } = await supabase.from('stores').insert({
                    user_id: data.user!.id,
                    username: username.toLowerCase() || `user${Math.floor(Math.random() * 10000)}`,
                    niche: 'Digital Store',
                    platform: 'Instagram',
                });
                if (storeError) console.error('Store init error:', storeError);

                setIsSuccess(true);
                await analytics.signup('email');
                showToast('Welcome!', 'success');
            } else {
                // Email confirmation is enabled, show OTP screen
                setStep(2);
                window.scrollTo(0, 0);
                showToast('Verification code sent.', 'success');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup.');
            showToast(err.message || 'Signup failed.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: verificationCode,
                type: 'signup'
            });

            if (verifyError) throw verifyError;

            if (data.user) {
                // Initialize Profile and Store immediately to bypass onboarding
                const { error: profileError } = await supabase.from('user_profiles').upsert({
                    user_id: data.user.id,
                    email: data.user.email!,
                    plan_type: 'founder',
                    subscription_status: 'trialing',
                    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_active: true,
                    onboarding_completed: true,
                });

                if (profileError) console.error('Profile init error:', profileError);

                const { error: storeError } = await supabase.from('stores').insert({
                    user_id: data.user.id,
                    username: username.toLowerCase() || `user${Math.floor(Math.random() * 10000)}`,
                    niche: 'Digital Store',
                    platform: 'Instagram',
                });

                if (storeError) console.error('Store init error:', storeError);

                setIsSuccess(true);
                await analytics.signup('email');
                showToast('Welcome!', 'success');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid verification code.');
            showToast(err.message || 'Invalid code.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth?type=recovery`,
            });
            if (resetError) throw resetError;
            setResetSent(true);
            showToast('Reset link sent.', 'success');
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
            showToast(err.message || 'Failed to send email.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8"
                >
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <Check className="w-12 h-12" strokeWidth={3} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900">Account Created!</h1>
                        <p className="text-slate-500 font-medium">Welcome, <span className="text-[#5500ff]">@{username}</span></p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FF] flex flex-col items-center justify-center px-6 py-10 overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '12s' }} />
            <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-pink-400/15 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />

            <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <Link href="/" className="mb-8 flex items-center gap-2 transition-transform hover:scale-105">
                    <SetyLogo size="md" />
                    <span className="text-[28px] font-bold tracking-tight text-slate-950 font-logo">Sety</span>
                </Link>

                <div className="text-center mb-8 w-full">
                    <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                        {isForgotPassword ? "Forgot password?" : isLogin ? "Welcome back 👋" : "Create your account"}
                    </h1>
                </div>

                {isForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="w-full space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 z-10" />
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="pl-12 h-[52px] rounded-xl border-slate-200" required />
                        </div>
                        <Button type="submit" disabled={loading || resetSent} className="relative w-full h-[54px] rounded-full bg-gradient-to-r from-[#5500ff] to-[#6C47FF] hover:from-[#4400cc] hover:to-[#5500ff] text-white font-black text-[17px] shadow-[0_10px_30px_-10px_rgba(85,0,255,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] border-none overflow-hidden group">
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? '...' : 'Send'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        </Button>
                        <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-sm text-slate-500 font-bold hover:text-slate-900">Go Back</button>
                    </form>
                ) : (
                    <form onSubmit={handleAuth} className="w-full">
                        {/* Google OAuth Button */}
                        {step === 1 && (
                            <div className="mb-6 space-y-6">
                                <Button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    variant="outline"
                                    className="w-full h-[54px] rounded-full bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-3 shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                        </g>
                                    </svg>
                                    Continue with Google
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-400">or</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <LoginForm {...{ email, setEmail, password, setPassword, showPassword, setShowPassword, loading, error, handleAuth, setIsForgotPassword }} />
                            ) : step === 1 ? (
                                <motion.div
                                    key="signup-step-1"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4 w-full"
                                >
                                    <PremiumInput
                                        value={username}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                                            setError('');
                                        }}
                                        placeholder="username"
                                        error={usernameError}
                                        success={isUsernameAvailable && !isCheckingUsername}
                                        innerPrefix="sety.store/"
                                        helperText={isCheckingUsername ? "Checking..." : ""}
                                    />
                                    <PremiumInput
                                        type="email"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="Email"
                                        error={emailError}
                                        helperText={isCheckingEmail ? "Checking..." : ""}
                                    />
                                    <PremiumInput
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setPassword(e.target.value);
                                            setError('');
                                            if (!isPasswordDirty) setIsPasswordDirty(true);
                                        }}
                                        placeholder="Password (min 6 characters)"
                                        error={isPasswordDirty && password.length < 6 ? "Must be at least 6 characters long." : ""}
                                    />
                                </motion.div>
                            ) : (
                                <Step4Verify {...{ email, verificationCode, setVerificationCode, handleVerifyOtp, loading, error }} />
                            )}
                        </AnimatePresence>

                        {!isLogin && (
                            <div className="mt-6 flex flex-col gap-4">
                                <Button type="submit" className="relative w-full h-[54px] rounded-full bg-gradient-to-r from-[#5500ff] to-[#6C47FF] hover:from-[#4400cc] hover:to-[#5500ff] text-white font-black text-[17px] shadow-[0_10px_30px_-10px_rgba(85,0,255,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] border-none overflow-hidden group">
                                    <span className="relative z-10 flex items-center gap-2">
                                        {step === 1 ? (loading ? 'Creating Account...' : 'Create Account') : (loading ? 'Verifying...' : 'Verify Email')}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                </Button>
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-400 font-bold hover:text-slate-900">Go Back</button>
                                )}
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[14px] text-slate-500 font-bold">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <span className="text-[#5500ff]"> {isLogin ? 'Sign Up' : 'Sign In'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
