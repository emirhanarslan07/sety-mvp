'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ChevronRight,
    Plus,
    Zap,
    AlertCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default function DashboardPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const { profile, store, loading } = useDashboard();
    const { showToast } = useToast();

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-16 space-y-8 md:space-y-16 pb-32">
            {/* Warning Banner (Stan Style) */}
            {(() => {
                if (!profile) return null;
                const createdAt = new Date(profile.created_at);
                const now = new Date();
                const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
                const hasPayments = profile.payment_config?.stripe?.connected || profile.payment_config?.manual?.enabled;
                
                if (diffInHours < 24 || hasPayments) return null;

                return (
                    <div className="w-full bg-[#FFFBEB] border border-amber-100 rounded-3xl p-4 md:p-6 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-[15px] font-black text-slate-900 leading-tight">{t('dashboard.payout_warning')}</p>
                            <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
                                {t('dashboard.payout_warning_desc')}
                            </p>
                            <button
                                onClick={() => router.push('/dashboard/settings')}
                                className="text-[13px] font-black text-amber-600 underline underline-offset-4 mt-2 block"
                            >
                                {t('dashboard.payout_setup')}
                            </button>
                        </div>
                    </div>
                );
            })()}

            {/* Premium Greeting Section */}
            <div className="space-y-3 px-2">
                <h1 className="text-[32px] md:text-[48px] font-black text-[#5500ff] tracking-tight leading-[1.1] font-plus-jakarta">
                    {t('dashboard.greeting')}, {profile?.full_name?.split(' ')[0] || '...'} 👋
                </h1>
                <p className="text-[20px] md:text-[24px] font-black text-slate-800 tracking-tight leading-tight font-plus-jakarta">
                    {t('dashboard.subtitle')}
                </p>
            </div>

            {/* Dashboard Action Cards */}
            <div className="space-y-4 max-w-[640px]">
                {/* Market Your Products Card */}
                <button
                    onClick={() => router.push('/dashboard/analytics')}
                    className="w-full bg-white rounded-[28px] p-6 md:p-7 flex items-center justify-between gap-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(85,0,255,0.06)] hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] md:text-[21px] font-black text-slate-900 tracking-tight leading-tight">{t('dashboard.actions.market_products')}</span>
                            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-[15px] text-slate-400 font-bold leading-relaxed max-w-[280px]">
                            {t('dashboard.actions.market_products_desc')}
                        </p>
                    </div>

                    <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
                        <div className="absolute inset-0 bg-[#FFF2E5] rounded-[24px]" />
                        <div className="relative w-full h-full p-2">
                            <Image
                                src="/images/dashboard/market_products.png"
                                alt=""
                                fill
                                className="object-cover rounded-[18px]"
                            />
                        </div>
                    </div>
                </button>

                {/* Add a Product Card */}
                <button
                    onClick={() => router.push('/dashboard/store?tab=store&action=add')}
                    className="w-full bg-white rounded-[28px] p-6 md:p-7 flex items-center justify-between gap-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(85,0,255,0.06)] hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] md:text-[21px] font-black text-slate-900 tracking-tight leading-tight">{t('dashboard.actions.add_product')}</span>
                            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-[15px] text-slate-400 font-bold leading-relaxed max-w-[280px]">
                            {t('dashboard.actions.add_product_desc')}
                        </p>
                    </div>

                    <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
                        <div className="absolute inset-0 bg-[#E6F4FF] rounded-[24px]" />
                        <div className="relative w-full h-full p-2">
                            <Image
                                src="/images/dashboard/add_product.png"
                                alt=""
                                fill
                                className="object-cover rounded-[18px]"
                            />
                        </div>
                    </div>
                </button>

                {/* Ask Sety Card */}
                <button
                    onClick={() => router.push('/dashboard/ai')}
                    className="w-full bg-white rounded-[28px] p-6 md:p-7 flex items-center justify-between gap-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(85,0,255,0.06)] hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] md:text-[21px] font-black text-slate-900 tracking-tight leading-tight">{t('dashboard.actions.ask_sety')}</span>
                            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-[15px] text-slate-400 font-bold leading-relaxed max-w-[280px]">
                            {t('dashboard.actions.ask_sety_desc')}
                        </p>
                    </div>

                    <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0">
                        <div className="absolute inset-0 bg-white rounded-[24px]" />
                        <div className="relative w-full h-full">
                            <Image
                                src="/images/dashboard/ask_sety.png"
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
