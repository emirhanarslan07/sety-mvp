'use client';

import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    Plus,
    Zap,
    Share2,
    Link as LinkIcon
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

    if (!store && !loading) {
        router.push('/onboarding');
        return null;
    }

    return (
        <div className="max-w-[1200px] mx-auto px-8 py-16 space-y-16">
            {/* Greeting Section */}
            <div className="space-y-3">
                <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-tight font-plus-jakarta transition-all">
                    {t('dashboard.greeting')} {profile?.full_name?.split(' ')[0] || '...'} 👋
                </h1>
                <p className="text-[26px] font-black text-primary tracking-tighter leading-tight font-plus-jakarta">
                    {t('dashboard.subtitle')}
                </p>
            </div>

            {/* Stan-style Action Cards */}
            <div className="space-y-6 max-w-[520px]">
                {/* Theme Selector Card */}
                <button
                    onClick={() => router.push('/dashboard/store?tab=design')}
                    className="w-full bg-white rounded-[32px] p-8 flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2 pr-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] font-black text-slate-900 tracking-tight">{t('dashboard.cards.theme.title')}</span>
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[14px] text-slate-400 font-bold leading-relaxed opacity-80">
                            {t('dashboard.cards.theme.desc')}
                        </p>
                    </div>
                    <div className="w-24 h-24 rounded-[28px] bg-slate-50/50 flex items-center justify-center p-3 group-hover:bg-primary/5 transition-colors shrink-0">
                        <div className="w-full h-full rounded-xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-1.5 p-2">
                            <div className="w-full h-2.5 bg-primary/20 rounded-full" />
                            <div className="w-3/4 h-1.5 bg-slate-100 rounded-full" />
                            <div className="w-1/2 h-1.5 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                </button>

                {/* Add Product Card */}
                <button
                    onClick={() => router.push('/dashboard/store?tab=store&action=add')}
                    className="w-full bg-white rounded-[32px] p-8 flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2 pr-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] font-black text-slate-900 tracking-tight">{t('dashboard.cards.products.title')}</span>
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[14px] text-slate-400 font-bold leading-relaxed opacity-80">
                            {t('dashboard.cards.products.desc')}
                        </p>
                    </div>
                    <div className="w-24 h-24 rounded-[28px] bg-slate-50/50 flex items-center justify-center p-3 group-hover:bg-primary/5 transition-colors shrink-0">
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-6 bg-white rounded-[10px] border border-slate-100 shadow-sm flex items-center px-2">
                                <Plus className="w-3 h-3 text-primary stroke-[3px]" />
                            </div>
                            <div className="h-6 bg-white rounded-[10px] border border-slate-100 shadow-sm" />
                        </div>
                    </div>
                </button>

                {/* Share Store Card */}
                <button
                    onClick={() => {
                        const url = `sety.store/${store?.username}`;
                        navigator.clipboard.writeText(`https://${url}`);
                        showToast(t('dashboard.toast.store_link_copied'), 'success');
                    }}
                    className="w-full bg-white rounded-[32px] p-8 flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex-1 space-y-2 pr-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-[19px] font-black text-slate-900 tracking-tight">{t('dashboard.cards.share.title')}</span>
                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[14px] text-slate-400 font-bold leading-relaxed opacity-80">
                            {t('dashboard.cards.share.desc', { url: `sety.store/${store?.username}` })}
                        </p>
                    </div>
                    <div className="w-24 h-24 rounded-[28px] bg-slate-50/50 flex items-center justify-center p-3 group-hover:bg-primary/5 transition-colors shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Share2 className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </button>

            </div>
        </div>
    );
}
