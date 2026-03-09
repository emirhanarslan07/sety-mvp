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
    Box
} from 'lucide-react';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Card, CardContent } from '@/components/ui/card';
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
        <div className="max-w-[1400px] mx-auto space-y-12 pb-20 px-4 md:px-10 pt-8">
            {/* Period Filters - Stan Style Pills */}
            <div className="flex flex-wrap items-center gap-3">
                {[
                    { id: '7', label: t('dashboard.analytics.periods.last_7_days') },
                    { id: '14', label: t('dashboard.analytics.periods.last_14_days') },
                    { id: 'range', label: t('dashboard.analytics.periods.date_range') },
                    { id: 'custom', label: t('dashboard.analytics.periods.custom_range') },
                ].map((p) => (
                    <Button
                        key={p.id}
                        variant="ghost"
                        onClick={() => p.id !== 'range' && p.id !== 'custom' && setAnalytics(prev => ({ ...prev, period: p.id as any }))}
                        className={cn(
                            "h-11 px-8 rounded-full text-[14px] font-black tracking-tight transition-all border whitespace-nowrap",
                            (analytics.period === p.id || p.id === '14')
                                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-900"
                        )}
                    >
                        {p.label}
                    </Button>
                ))}
            </div>

            {/* Stats Grid - Premium Flat Design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className={cn(
                        "bg-white rounded-[32px] p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 group border border-slate-100",
                        stat.special
                    )}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center">
                                {stat.icon === 'Eye' ? <Eye className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" /> :
                                    stat.icon === 'Currency' ? <span className="text-[18px] font-black text-slate-400 group-hover:text-primary leading-none transition-colors">$</span> :
                                        <Users className="w-5 h-5 text-slate-400 group-hover:text-[#ff00ff] transition-colors" />}
                            </div>
                            <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-none font-plus-jakarta">{stat.label}</span>
                        </div>
                        <h3 className="text-7xl font-black tracking-tighter text-slate-900 font-plus-jakarta group-hover:scale-[1.02] transition-transform origin-left">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Middle Section: Customer Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 min-h-[440px] flex flex-col relative overflow-hidden group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">{t('dashboard.analytics.customers_origin.title')}</h3>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <Zap className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-sm">
                            <span className="text-4xl">🌍</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 text-[17px] font-black tracking-tight">{t('dashboard.analytics.customers_origin.empty_title')}</p>
                            <p className="text-slate-400 text-sm font-medium">{t('dashboard.analytics.customers_origin.empty_desc')}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 min-h-[440px] flex flex-col relative overflow-hidden group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">{t('dashboard.analytics.referral_channels.title')}</h3>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-sm">
                            <span className="text-4xl">📈</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-900 text-[17px] font-black tracking-tight">{t('dashboard.analytics.referral_channels.empty_title')}</p>
                            <p className="text-slate-400 text-sm font-medium">{t('dashboard.analytics.referral_channels.empty_desc')}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top Products Table Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[22px] font-black text-slate-900 tracking-tight">{t('dashboard.analytics.top_products.title')}</h3>
                    <Button variant="ghost" className="text-primary font-black text-sm gap-2 hover:bg-primary/5 rounded-full px-6 uppercase tracking-widest">
                        {t('dashboard.analytics.top_products.full_report')} <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
                    <div className="overflow-x-auto scrollbar-hide flex-1">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100/50">
                                    <th className="text-left py-8 px-12 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.analytics.top_products.table.product_info')}</th>
                                    <th className="text-center py-8 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.analytics.top_products.table.views')}</th>
                                    <th className="text-center py-8 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.analytics.top_products.table.orders')}</th>
                                    <th className="text-center py-8 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.analytics.top_products.table.conversion')}</th>
                                    <th className="text-right py-8 px-12 text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.analytics.top_products.table.net_revenue')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-10">
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/40 transition-colors duration-500 scale-150" />
                                                    <div className="w-28 h-28 relative z-10 animate-bounce transition-all duration-1000">
                                                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                                                            <circle cx="50" cy="50" r="45" fill="#5500ff" />
                                                            <circle cx="35" cy="40" r="5" fill="white" />
                                                            <circle cx="65" cy="40" r="5" fill="white" />
                                                            <path d="M 30 65 Q 50 80 70 65" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
                                                            <path d="M 45 20 L 55 20 L 52 10 Z" fill="#C4FF00" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[20px] font-black text-slate-900 tracking-tight font-plus-jakarta">{t('dashboard.analytics.top_products.empty_title')}</p>
                                                    <p className="text-slate-400 text-[15px] font-medium max-w-[300px] mx-auto">{t('dashboard.analytics.top_products.empty_desc')}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    topProducts.map((p, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-50/50 last:border-0">
                                            <td className="py-8 px-12">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                                                        <Box className="w-6 h-6" />
                                                    </div>
                                                    <span className="font-black text-slate-900 text-[16px] tracking-tight">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-8 px-8 text-center font-bold text-slate-600">{(p.sales * 12) + 124}</td>
                                            <td className="py-8 px-8 text-center font-bold text-slate-600">{p.sales || 0}</td>
                                            <td className="py-8 px-8 text-center">
                                                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-black">
                                                    {p.conversion}
                                                </span>
                                            </td>
                                            <td className="py-8 px-12 text-right font-black text-slate-900 text-[17px] tracking-tight">{formatCurrency(p.revenue)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
