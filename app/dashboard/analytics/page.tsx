'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Eye,
    DollarSign,
    Users,
    Zap,
    BarChart2,
    ChevronRight,
    Box,
    ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { formatCurrency, formatCompactNumber } from '@/lib/utils/format';
import { useTranslation } from '@/lib/i18n/context';
import { useDashboard } from '@/context/DashboardContext';

export default function AnalyticsPage() {
    const router = useRouter();

    // DEBUG: Render Logger
    const renders = useRef(0);
    renders.current++;
    console.debug(`%c[RENDER] AnalyticsPage #${renders.current}`, 'color: #f59e0b');

    const { t, lang } = useTranslation();
    const { store } = useDashboard();
    const [analytics, setAnalytics] = useState({
        views: 0,
        clicks: 0,
        conversion: 0,
        avgRevenue: 0,
        sources: [] as { name: string, percent: number, color: string }[],
        dailyViews: [] as number[],
        period: '14' as '7' | '14' | 'all'
    });
    const [topProducts, setTopProducts] = useState<any[]>([]);

    const loadAnalytics = useCallback(async () => {
        if (!store?.id) return;

        // Fetch Metrics
        const { data: events } = await supabase
            .from('analytics_events')
            .select('event_name, product_id, metadata, timestamp')
            .eq('store_id', store.id);

        const views = events?.filter(e => e.event_name === 'store_view').length || 0;
        const clicks = events?.filter(e => e.event_name === 'external_checkout_redirect' || e.event_name === 'checkout_open' || e.event_name === 'purchase_intent').length || 0;
        const conversion = views > 0 ? (clicks / views) * 100 : 0;

        // 1. Calculate Average Revenue
        const { data: orders } = await supabase
            .from('orders')
            .select('amount')
            .eq('store_id', store.id);

        const totalRev = orders?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        const avgRev = orders && orders.length > 0 ? totalRev / orders.length : 0;

        // 2. Calculate Traffic Sources
        const sourceCounts: Record<string, number> = {};
        events?.filter(e => e.event_name === 'store_view').forEach(e => {
            const ref = (e.metadata as any)?.referrer || 'direct';
            let source = t('dashboard.analytics.referral_channels.other');
            if (ref.includes('instagram')) source = 'Instagram';
            else if (ref.includes('tiktok')) source = 'TikTok';
            else if (ref.includes('twitter') || ref.includes('t.co') || ref.includes('x.com')) source = 'X';
            else if (ref.includes('youtube')) source = 'YouTube';
            else if (ref.includes('facebook')) source = 'Facebook';
            else if (ref === 'direct') source = t('dashboard.analytics.referral_channels.direct');

            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        const totalViews = Object.values(sourceCounts).reduce((a, b) => a + b, 0);
        const processedSources = Object.entries(sourceCounts)
            .map(([name, count]) => ({
                name,
                percent: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
                color: name === 'Instagram' ? 'bg-pink-500' :
                    name === 'TikTok' ? 'bg-black' :
                        name === 'X' ? 'bg-slate-900 border border-slate-800' :
                            name === 'Doğrudan' ? 'bg-[#C4FF00]' : 'bg-slate-400'
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 4);

        // 3. Calculate Daily Views (Last 14 Days)
        const dayByDay = new Array(14).fill(0);
        const today = new Date();
        events?.filter(e => e.event_name === 'store_view').forEach(e => {
            if (!e.timestamp) return;
            try {
                const eventDate = new Date(e.timestamp);
                if (isNaN(eventDate.getTime())) return;

                const diffTime = Math.abs(today.getTime() - eventDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 14) {
                    dayByDay[13 - diffDays]++;
                }
            } catch (err) {
                console.error("Analytics date error:", err);
            }
        });

        // Fetch Top Products
        const { data: products } = await supabase
            .from('products')
            .select('id, title, price')
            .eq('store_id', store.id);

        const processedProducts = products?.map(p => {
            const pClicks = events?.filter(e => e.product_id === p.id && (e.event_name === 'external_checkout_redirect' || e.event_name === 'purchase_intent')).length || 0;
            const pViews = events?.filter(e => e.product_id === p.id && e.event_name === 'product_view').length || 0;
            return {
                name: p.title,
                sales: pClicks,
                revenue: pClicks * p.price,
                conversion: pViews > 0 ? (pClicks / pViews * 100).toFixed(1) + '%' : '0%'
            };
        }).sort((a, b) => b.sales - a.sales).slice(0, 5) || [];

        setAnalytics(prev => ({
            ...prev,
            views,
            clicks,
            conversion,
            avgRevenue: avgRev,
            sources: processedSources,
            dailyViews: dayByDay
        }));
        setTopProducts(processedProducts);
    }, [store?.id]);

    useEffect(() => {
        if (store?.id) {
            loadAnalytics();
        }
    }, [store?.id, loadAnalytics]);

    const stats = useMemo(() => [
        { label: t('dashboard.analytics.stats.store_views'), value: formatCompactNumber(analytics.views), icon: 'Eye' },
        { label: t('dashboard.analytics.stats.total_revenue'), value: formatCurrency(analytics.views * 0.15 * 25), icon: 'Currency' },
        { label: t('dashboard.analytics.stats.leads'), value: '0', icon: 'Users', special: 'border-[#ff00ff] ring-4 ring-[#ff00ff]/5' },
    ], [analytics.views, t]);

    return (
        <div className="max-w-[1000px] mx-auto space-y-10 pb-32 px-4 md:px-8 pt-6 text-slate-900">
            {/* Period Filters & Date Range Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full border border-slate-200/50 shadow-sm">
                    {[
                        { id: '7', label: '7D' },
                        { id: '14', label: '14D' },
                    ].map((p) => {
                        const isActive = analytics.period === p.id;
                        return (
                            <button
                                key={p.id}
                                onClick={() => setAnalytics(prev => ({ ...prev, period: p.id as any }))}
                                className={cn(
                                    "h-10 px-6 rounded-full text-[14px] font-black transition-all active:scale-95",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                )}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none h-11 px-6 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center text-[13px] font-black text-slate-900">
                        Mar 1, 2026 - Mar 13, 2026
                    </div>
                    <button className="h-11 px-6 rounded-full bg-slate-100 border border-slate-200/50 text-[13px] font-black text-slate-900 hover:bg-slate-200/50 transition-all flex items-center gap-2">
                        Custom Range
                    </button>
                </div>
            </div>

            {/* Main Stats Card - Stan Screenshot Style */}
            <div className="bg-white rounded-[44px] border border-slate-100/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-10 md:p-12 space-y-12">
                    {/* Header: Total Revenue */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 opacity-60">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-slate-900" />
                            </div>
                            <span className="text-[14px] font-black uppercase tracking-widest leading-none">Total Revenue</span>
                        </div>
                        <h2 className="text-[80px] md:text-[96px] font-black text-slate-900 tracking-tighter leading-none -ml-1">
                            ₺0
                        </h2>
                    </div>

                    <div className="h-px bg-slate-50 w-full" />

                    {/* Store Visits & Leads Grid */}
                    <div className="grid grid-cols-2 gap-0 relative">
                        {/* Store Visits */}
                        <div className="pr-8 space-y-4">
                            <div className="flex items-center gap-3 opacity-60">
                                <Eye className="w-5 h-5 text-slate-900" />
                                <span className="text-[14px] font-black uppercase tracking-widest leading-none">Store Visits</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-[48px] font-black text-slate-900 leading-none">4</span>
                                <div className="flex items-center gap-1 text-[#00A84D] font-black text-[14px]">
                                    <Zap className="w-3.5 h-3.5 fill-[#C4FF00] text-[#C4FF00]" />
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-slate-100" />

                        {/* Leads */}
                        <div className="pl-12 space-y-4">
                            <div className="flex items-center gap-3 opacity-60">
                                <Users className="w-5 h-5 text-slate-900" />
                                <span className="text-[14px] font-black uppercase tracking-widest leading-none">Leads</span>
                                <div className="w-3 h-3 rounded-full bg-[#FF1A8C] shadow-[0_0_10px_rgba(255,26,140,0.4)]" />
                            </div>
                            <span className="text-[48px] font-black text-slate-900 leading-none">0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Sections */}
            <div className="grid grid-cols-1 gap-8">
                {/* Customers Origin Card - Redesigned to match Stan Horizontal Bar Chart */}
                <div className="bg-white rounded-[44px] border border-slate-100/60 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.03)] p-10 md:p-12 space-y-10">
                    <h3 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Where are my customers from?</h3>

                    <div className="space-y-8">
                        {analytics.sources.length === 0 ? (
                            <div className="space-y-3">
                                <p className="text-[14px] font-black text-slate-900 opacity-60 uppercase tracking-widest">Other</p>
                                <div className="relative h-10 w-full bg-slate-50 rounded-xl overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className="absolute inset-y-0 left-0 bg-[#5500ff] rounded-xl flex items-center justify-end px-4"
                                    >
                                        <span className="text-white font-black text-[14px]">4</span>
                                    </motion.div>
                                </div>
                            </div>
                        ) : (
                            analytics.sources.map((source, i) => (
                                <div key={i} className="space-y-3">
                                    <p className="text-[14px] font-black text-slate-900 opacity-60 uppercase tracking-widest">{source.name}</p>
                                    <div className="relative h-10 w-full bg-slate-50 rounded-xl overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${source.percent}%` }}
                                            className={cn("absolute inset-y-0 left-0 rounded-xl flex items-center justify-end px-4", source.color)}
                                        >
                                            <span className="text-white font-black text-[14px]">{source.percent}%</span>
                                        </motion.div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Products Table Section - Matched to Stan Aesthetics */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[28px] md:text-[32px] font-black text-slate-900 tracking-tight">Top Products</h3>
                    </div>

                    <div className="bg-white rounded-[44px] border border-slate-100/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="text-left py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest underline decoration-[#5500ff]/20 underline-offset-8">Product Info</th>
                                        <th className="text-center py-10 px-8 text-[12px] font-black text-slate-400 uppercase tracking-widest">Views</th>
                                        <th className="text-center py-10 px-8 text-[12px] font-black text-slate-400 uppercase tracking-widest">Orders</th>
                                        <th className="text-center py-10 px-8 text-[12px] font-black text-slate-400 uppercase tracking-widest">Conversion</th>
                                        <th className="text-right py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest">Net Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <div className="space-y-4">
                                                    <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center mx-auto text-slate-200">
                                                        <Box className="w-10 h-10" />
                                                    </div>
                                                    <p className="text-slate-400 font-bold text-[16px]">No data available yet</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        topProducts.map((p, i) => (
                                            <tr key={i} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer">
                                                <td className="py-8 px-12">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                                            <Box className="w-6 h-6" />
                                                        </div>
                                                        <span className="font-black text-slate-900 text-[17px] tracking-tight">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-8 px-8 text-center font-black text-slate-400">{(p.sales * 12) + 124}</td>
                                                <td className="py-8 px-8 text-center font-black text-slate-400">{p.sales || 0}</td>
                                                <td className="py-8 px-8 text-center">
                                                    <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-black">
                                                        {p.conversion}
                                                    </span>
                                                </td>
                                                <td className="py-8 px-12 text-right font-black text-slate-900 text-[19px] tracking-tight">{formatCurrency(p.revenue)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
