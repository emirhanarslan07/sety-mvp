'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import { analytics } from '@/lib/analytics/tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    OnboardingData,
    PLATFORMS,
    COUNTRIES,
    PRODUCT_TYPES,
} from '@/lib/types/onboarding';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Check, Target, Users, Zap } from 'lucide-react';
import { SetyLogo } from '@/components/ui/SetyLogo';

export default function OnboardingPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<OnboardingData>({
        niche: '',
        platform: '',
        followers: 0,
        engagementRate: 0,
        country: 'Türkiye',
        productType: '',
        productPrice: 0,
        monthlyGoal: null,
    });

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
            } else {
                await analytics.onboardingStart();
            }
        };
        checkAuth();
    }, [router]);

    const updateFormData = (field: keyof OnboardingData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            // 1. Update/Create User Profile
            const { error: profileError } = await supabase.from('user_profiles').upsert({
                user_id: user.id,
                email: user.email!,
                plan_type: 'founder', // Beta aşamasında founder olarak başlatıyoruz
                subscription_status: 'trialing',
                trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                is_active: true,
                onboarding_completed: true,
            });

            if (profileError) throw profileError;

            // 2. Create Store
            const defaultUsername = user.email!.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);

            const { error: storeError } = await supabase.from('stores').insert({
                user_id: user.id,
                username: defaultUsername,
                niche: formData.niche,
                platform: formData.platform,
                followers: formData.followers,
                engagement_rate: formData.engagementRate,
                monthly_goal: formData.monthlyGoal,
            });

            if (storeError) throw storeError;

            // 3. Create initial product
            if (formData.productPrice > 0) {
                const { data: storeData } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (storeData) {
                    await supabase.from('products').insert({
                        store_id: storeData.id,
                        user_id: user.id,
                        title: `${formData.niche} Rehberi`,
                        price: formData.productPrice,
                        type: formData.productType,
                        status: 'active'
                    });
                }
            }

            await analytics.onboardingComplete({
                niche: formData.niche,
                platform: formData.platform,
                followers: formData.followers,
                engagement: formData.engagementRate
            });
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Error saving onboarding:', err);
            showToast('Hata oluştu. Lütfen tekrar deneyin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isStepValid = () => {
        if (step === 1) return formData.niche && formData.platform;
        if (step === 2) return formData.followers > 0 && formData.engagementRate > 0 && formData.country;
        if (step === 3) return formData.productType && formData.productPrice > 0;
        return false;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 font-sans">
            <div className="max-w-[600px] mx-auto">

                {/* Logo & Close */}
                <div className="flex justify-center mb-10">
                    <SetyLogo size="md" />
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-500",
                                s <= step ? "bg-[#5500ff]" : "bg-slate-200"
                            )}
                        />
                    ))}
                </div>

                {/* Step Titles */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
                        {step === 1 ? 'Temellerle Başlayalım' :
                            step === 2 ? 'Kitle ve Ülke' :
                                'İlk Ürününü Belirle'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {step === 1 ? 'Hangi alanda içerik ürettiğinizi seçin.' :
                            step === 2 ? 'Ne kadar büyük bir kitleye hitap ediyorsunuz?' :
                                'Mağazanda satacağın ilk ürünü taslak olarak hazırlayalım.'}
                    </p>
                </div>

                <Card className="border-none shadow-soft-lg rounded-[32px] overflow-hidden bg-white">
                    <CardContent className="p-8 md:p-10">
                        {/* Step 1: Basics */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Nişin Nedir?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.niche}
                                        onChange={(e) => updateFormData('niche', e.target.value)}
                                        placeholder="Örn: Fitness, Pazarlama, Fotoğrafçılık"
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Ana Platformun
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PLATFORMS.map((platform) => (
                                            <button
                                                key={platform}
                                                onClick={() => updateFormData('platform', platform)}
                                                className={cn(
                                                    "h-14 rounded-2xl border-2 text-[15px] font-semibold transition-all flex items-center justify-center",
                                                    formData.platform === platform
                                                        ? "border-[#5500ff] bg-[#5500ff]/5 text-[#5500ff]"
                                                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                                )}
                                            >
                                                {platform}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Audience */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Takipçi Sayısı
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            value={formData.followers || ''}
                                            onChange={(e) => updateFormData('followers', parseInt(e.target.value) || 0)}
                                            placeholder="5000"
                                            className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Etkileşim Oranı (%)
                                    </label>
                                    <div className="relative">
                                        <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.engagementRate || ''}
                                            onChange={(e) => updateFormData('engagementRate', parseFloat(e.target.value) || 0)}
                                            placeholder="3.5"
                                            className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    <p className="text-[13px] text-slate-400 font-medium ml-1">Genellikle %2-5 arasıdır.</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Hedef Kitle Ülkesi
                                    </label>
                                    <select
                                        value={formData.country}
                                        onChange={(e) => updateFormData('country', e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none appearance-none"
                                    >
                                        {COUNTRIES.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Product */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-3">
                                    <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                        Ürün Tipi
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {PRODUCT_TYPES.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => updateFormData('productType', type.value)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                                                    formData.productType === type.value
                                                        ? "border-[#5500ff] bg-[#5500ff]/5 text-[#5500ff]"
                                                        : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                                                )}
                                            >
                                                <span className="text-2xl">{type.icon}</span>
                                                <span className="text-[13px] font-bold uppercase tracking-tight">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                            Ürün Fiyatı ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.productPrice || ''}
                                            onChange={(e) => updateFormData('productPrice', parseFloat(e.target.value) || 0)}
                                            placeholder="47"
                                            className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[15px] font-bold text-slate-900 uppercase tracking-wider ml-1">
                                            Gelir Hedefi ($)
                                        </label>
                                        <div className="relative">
                                            <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="number"
                                                value={formData.monthlyGoal || ''}
                                                onChange={(e) => updateFormData('monthlyGoal', e.target.value ? parseFloat(e.target.value) : null)}
                                                placeholder="3000"
                                                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 text-[16px] font-medium transition-all focus:border-[#5500ff] focus:bg-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center gap-4 mt-12 pt-6 border-t border-slate-50">
                            {step > 1 && (
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="h-14 px-8 rounded-2xl text-slate-400 font-semibold hover:bg-slate-50"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Geri
                                </Button>
                            )}

                            <Button
                                onClick={step === 3 ? handleSubmit : handleNext}
                                disabled={!isStepValid() || loading}
                                className={cn(
                                    "flex-1 h-14 rounded-2xl font-bold text-lg shadow-lg transition-all",
                                    isStepValid()
                                        ? "bg-[#5500ff] hover:bg-[#4400cc] text-white shadow-[#5500ff]/20"
                                        : "bg-slate-100 text-slate-400 shadow-none"
                                )}
                            >
                                {loading ? 'Kaydediliyor...' :
                                    step === 3 ? 'Kurulumu Tamamla' : 'Devam Et'}
                                {step < 3 && !loading && <ChevronRight className="w-5 h-5 ml-2" />}
                                {step === 3 && !loading && <Check className="w-5 h-5 ml-2" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center mt-10 text-[13px] font-medium text-slate-400">
                    Sety MVP • Profesyonel dijital mağaza çözümü
                </p>
            </div>
        </div>
    );
}
