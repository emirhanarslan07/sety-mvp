'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { 
    TrendingUp, 
    Users, 
    Calendar,
    Package,
    Zap,
    MousePointerClick,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';

export default function AnalyticsPage() {
    const { store } = useDashboard();
    const [period, setPeriod] = useState<'7' | '14' | '30' | 'all'>('14');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        monthlyViews: 0,
        todayViews: 0,
        totalClicks: 0,
        totalSubscribers: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);

    const loadAnalytics = useCallback(async () => {
        if (!store?.id) return;
        setLoading(true);

        try {
            const [statsRes, chartRes, productsRes, subscribersRes] = await Promise.all([
                fetch('/api/dashboard/stats'),
                fetch(`/api/dashboard/chart?days=${period === 'all' ? 365 : period}`),
                fetch('/api/analytics/products'),
                fetch(`/api/dashboard/subscribers?store_id=${store.id}`)
            ]);

            const statsData = await statsRes.json();
            const chartDataJson = await chartRes.json();
            const productsData = await productsRes.json();
            const subscribersData = await subscribersRes.json();

            if (chartDataJson.data) {
                const formattedChartData = chartDataJson.data.map((item: any) => {
                    const date = new Date(item.date);
                    return {
                        date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
                        views: item.views,
                        clicks: item.clicks,
                    };
                });
                setChartData(formattedChartData);
            }

            setStats({
                totalViews: statsData.total?.views || 0,
                monthlyViews: statsData.this_month?.views || 0,
                todayViews: statsData.today?.views || 0,
                totalClicks: statsData.total?.clicks || 0,
                totalSubscribers: Array.isArray(subscribersData) ? subscribersData.length : 0
            });

            if (productsData.data) {
                setTopProducts(productsData.data);
            }

        } catch (error) {
            console.error('Analytics error:', error);
        } finally {
            setLoading(false);
        }
    }, [store?.id, period]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const metrics = [
        { 
            label: 'Toplam Ziyaretçi', 
            value: stats.totalViews.toLocaleString(), 
            subValue: 'Tüm Zamanlar',
            icon: Eye, 
            color: 'text-[#5500ff]', 
            bg: 'bg-violet-50',
        },
        { 
            label: 'Bu Ay Ziyaretçi', 
            value: stats.monthlyViews.toLocaleString(), 
            subValue: 'Bu Ay',
            icon: Calendar, 
            color: 'text-indigo-600', 
            bg: 'bg-indigo-50',
        },
        { 
            label: 'Toplam Tıklanma', 
            value: stats.totalClicks.toLocaleString(), 
            subValue: 'Tüm Ürünlerde',
            icon: MousePointerClick, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
        },
        { 
            label: 'Toplam Abone', 
            value: stats.totalSubscribers.toLocaleString(), 
            subValue: 'E-posta Listesi',
            icon: Users, 
            color: 'text-pink-600', 
            bg: 'bg-pink-50',
        },
        { 
            label: 'Performans', 
            value: 'Aktif', 
            subValue: 'Mağaza Durumu',
            icon: Zap, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
        }
    ];

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Analitikler 📈
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        Mağazanızın performansı ve tıklanma analizleri.
                    </p>
                </div>

                {/* Period Selector */}
                <div className="bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-1 self-start md:self-auto">
                    {[
                        { id: '7', label: '7 Gün' },
                        { id: '14', label: '14 Gün' },
                        { id: '30', label: '30 Gün' },
                        { id: 'all', label: 'Tümü' }
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPeriod(p.id as any)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[14px] font-black transition-all",
                                period === p.id 
                                    ? "bg-gradient-to-r from-[#5500ff] to-[#6C47FF] text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", metric.bg, metric.color)}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                            <h3 className="text-[28px] font-black text-slate-900 tracking-tight">{metric.value}</h3>
                            <p className="text-[12px] font-bold text-slate-400 mt-2">{metric.subValue}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ziyaretçi Grafiği */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Tıklanma ve Ziyaretçi Grafiği</h2>
                        <p className="text-slate-400 font-bold">Mağaza görüntülenmeleri ve ürün tıklanmaları</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 border border-violet-100">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#5500ff]" />
                            <span className="text-[13px] font-black text-slate-700 uppercase">Ziyaretçi</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="text-[13px] font-black text-slate-700 uppercase">Tıklanma</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded-[32px]" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5500ff" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#5500ff" stopOpacity={0.02}/>
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                                        padding: '16px 20px',
                                        backgroundColor: '#1e1b4b',
                                        color: '#ffffff'
                                    }}
                                    itemStyle={{ fontWeight: 800, color: '#e2e8f0' }}
                                    labelStyle={{ fontWeight: 700, color: '#a5b4fc', marginBottom: 4 }}
                                    cursor={{ stroke: '#5500ff', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="views" 
                                    name="Ziyaretçi"
                                    stroke="#5500ff" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorViews)"
                                    dot={{ r: 3, fill: '#5500ff', stroke: '#fff', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#5500ff', stroke: '#c4b5fd', strokeWidth: 3 }}
                                />
                                <Area 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="clicks" 
                                    name="Tıklanma"
                                    stroke="#3b82f6" 
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                    dot={{ r: 3, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#bfdbfe', strokeWidth: 3 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight">En Çok Tıklanan Ürünler</h2>
                    <Package className="w-6 h-6 text-slate-300" />
                </div>

                <div className="space-y-6">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-3xl" />)
                    ) : topProducts.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-lg font-black text-slate-800 tracking-tight">Henüz tıklanan ürün yok</p>
                        </div>
                    ) : (
                        topProducts.map((product, i) => {
                            const rankBg = i === 0 ? 'bg-amber-50' : i === 1 ? 'bg-slate-100' : i === 2 ? 'bg-orange-50' : 'bg-indigo-50';
                            const rankText = i === 0 ? 'text-amber-600' : i === 1 ? 'text-slate-500' : i === 2 ? 'text-orange-600' : 'text-indigo-600';
                            const rankBorder = i === 0 ? 'ring-1 ring-amber-200' : i === 1 ? 'ring-1 ring-slate-200' : i === 2 ? 'ring-1 ring-orange-200' : '';
                            const maxClicks = topProducts[0]?.sales || 1;
                            const barWidth = Math.max(((product.sales / maxClicks) * 100), 8);
                            return (
                            <div key={i} className={cn(
                                "flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 border border-transparent hover:border-slate-100 hover:translate-x-1 cursor-default",
                                i % 2 === 1 ? 'bg-slate-50/50' : 'hover:bg-slate-50/80'
                            )}>
                                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <div className={cn("absolute inset-0", rankBg)} style={{ width: `${barWidth}%` }} />
                                    <div className={cn("absolute inset-0", rankBg, "opacity-30")} />
                                    <span className={cn("relative font-black text-lg", rankText, rankBorder, "w-full h-full flex items-center justify-center rounded-2xl")}>
                                        {i + 1}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 line-clamp-1">{product.title}</h4>
                                    <p className="text-sm font-bold text-slate-400">Fiyat: {formatCurrency(product.price, product.currency)}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-emerald-600">{product.sales} Tıklanma</div>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
