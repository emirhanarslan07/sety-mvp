'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { analytics } from '@/lib/analytics/tracker';
import { Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { ALL_COUNTRIES } from '@/lib/constants/countries';

// Step Components
import { Step1Info } from '@/components/auth/Step1Info';
import { Step2Goals } from '@/components/auth/Step2Goals';
import { Step3Pricing } from '@/components/auth/Step3Pricing';
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
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordDirty, setIsPasswordDirty] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [step, setStep] = useState(1);
    const [founderStats, setFounderStats] = useState({ founder_count: 0, is_full: false });
    const [selectedPlan, setSelectedPlan] = useState<'founder' | 'pro'>('founder');
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(ALL_COUNTRIES[1]); // Default to TR

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
                setUsernameError('Bu kullanıcı adı zaten alınmış.');
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

            if (data) setEmailError('Bu e-posta adresi zaten kullanılıyor!');
            else setEmailError('');
            setIsCheckingEmail(false);
        };

        const timer = setTimeout(checkEmail, 500);
        return () => clearTimeout(timer);
    }, [email, isLogin, isForgotPassword]);

    // Founder Stats
    useEffect(() => {
        const fetchFounderStats = async () => {
            const { data } = await supabase.rpc('get_founder_stats');
            if (data && data[0]) {
                const stats = data[0];
                setFounderStats(stats);
                setSelectedPlan(stats.is_full ? 'pro' : 'founder');
            }
        };
        fetchFounderStats();
    }, []);

    // Redirect to dashboard on success
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => router.push('/dashboard'), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isLogin) {
            if (step === 1) {
                if (usernameError || !isUsernameAvailable || emailError || isCheckingEmail || isCheckingUsername) return;
                setStep(2);
                window.scrollTo(0, 0);
            } else if (step === 2) {
                if (!selectedGoal) {
                    showToast('Lütfen bir hedef seçin.', 'info');
                    return;
                }
                setStep(3);
                window.scrollTo(0, 0);
            } else if (step === 3) {
                await performSignUp();
            } else if (step === 4) {
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

                if (!profileByUsername) throw new Error('Kullanıcı adı veya e-posta hatalı.');
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
            setError(err.message || 'Bir hata oluştu');
            showToast(err.message || 'Giriş yapılamadı.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const performSignUp = async () => {
        try {
            setLoading(true);
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        username: username,
                        phone: `${selectedCountry.code}${phone}`,
                        plan_type: selectedPlan,
                        goal: selectedGoal
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;
            setStep(4);
            window.scrollTo(0, 0);
            showToast('Doğrulama kodu gönderildi.', 'success');
        } catch (err: any) {
            setError(err.message || 'Kayıt sırasında bir hata oluştu.');
            showToast(err.message || 'Kayıt başarısız.', 'error');
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
                setIsSuccess(true);
                await analytics.signup('email');
                showToast('Hoş geldiniz!', 'success');
            }
        } catch (err: any) {
            setError(err.message || 'Doğrulama kodu hatalı.');
            showToast(err.message || 'Hatalı kod.', 'error');
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
            showToast('Sıfırlama bağlantısı gönderildi.', 'success');
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
            showToast(err.message || 'E-posta gönderilemedi.', 'error');
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
                        <h1 className="text-3xl font-black text-slate-900">Hesabınız Hazır!</h1>
                        <p className="text-slate-500 font-medium">Hoş geldin, <span className="text-[#5500ff]">@{username}</span></p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-[400px] flex flex-col items-center">
                {isLogin || isForgotPassword ? (
                    <Link href="/" className="mb-8 flex items-center gap-2">
                        <SetyLogo size="md" />
                        <span className="text-[28px] font-bold tracking-tight text-slate-950 font-logo">Sety</span>
                    </Link>
                ) : (
                    <div className="w-full flex flex-col items-center mb-8 space-y-4">
                        {/* Shorter, sleeker progress bar */}
                        <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#5500ff]"
                                initial={{ width: "25%" }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                                Hey {username ? `@${username}` : '@Username'} 👋
                            </h2>
                            <p className="text-lg text-slate-500 font-medium opacity-90">Let&apos;s monetize your following!</p>
                        </div>
                    </div>
                )}

                {(isForgotPassword || isLogin) && (
                    <div className="text-center mb-6 w-full">
                        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                            {isForgotPassword ? "Şifreni mi unuttun?" : isLogin ? "Tekrar hoş geldin 👋" : ""}
                        </h1>
                    </div>
                )}

                {isForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="w-full space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 z-10" />
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" className="pl-12 h-[52px] rounded-xl border-slate-200" required />
                        </div>
                        <Button type="submit" disabled={loading || resetSent} className="w-full h-[54px] rounded-full bg-[#5500ff] hover:bg-[#4400cc]">{loading ? '...' : 'Gönder'}</Button>
                        <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-sm text-slate-500 font-bold hover:text-slate-900">Geri Dön</button>
                    </form>
                ) : (
                    <form onSubmit={handleAuth} className="w-full">
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <LoginForm {...{ email, setEmail, password, setPassword, showPassword, setShowPassword, loading, error, handleAuth, setIsForgotPassword }} />
                            ) : step === 1 ? (
                                <Step1Info {...{ username, setUsername, usernameError, isCheckingUsername, isUsernameAvailable, fullName, setFullName, email, setEmail, emailError, isCheckingEmail, phone, setPhone, password, setPassword, showPassword, setShowPassword, isPasswordDirty, setIsPasswordDirty, countries: ALL_COUNTRIES, selectedCountry, setSelectedCountry, setError }} />
                            ) : step === 2 ? (
                                <Step2Goals selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />
                            ) : step === 3 ? (
                                <Step3Pricing selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} founderStats={founderStats} />
                            ) : (
                                <Step4Verify {...{ email, verificationCode, setVerificationCode, handleVerifyOtp, loading, error }} />
                            )}
                        </AnimatePresence>

                        {!isLogin && step < 4 && (
                            <div className="mt-8 flex flex-col gap-4">
                                <Button type="submit" className="w-full h-[54px] rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-bold">
                                    {step === 3 ? (loading ? 'Hesap Oluşturuluyor...' : 'Onayla ve Devam Et') : 'Devam Et'}
                                </Button>
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-slate-400 font-bold hover:text-slate-900">Geri Dön</button>
                                )}
                            </div>
                        )}

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[14px] text-slate-500 font-bold">
                                {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
                                <span className="text-[#5500ff]"> {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}</span>
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
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <AuthContent />
        </Suspense>
    );
}
