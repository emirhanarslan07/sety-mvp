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
            value: stats.totalViews.toLocaleString('tr-TR'), 
            subValue: 'Tüm zamanlar',
            icon: Eye, 
            color: '#5500FF', 
            bg: 'rgba(85,0,255,0.08)',
        },
        { 
            label: 'Bu Ayki Ziyaretler', 
            value: stats.monthlyViews.toLocaleString('tr-TR'), 
            subValue: 'Son 30 gün',
            icon: TrendingUp, 
            color: '#10B981', 
            bg: 'rgba(16,185,129,0.08)',
        },
        { 
            label: 'Bugünkü Trafik', 
            value: stats.todayViews.toLocaleString('tr-TR'), 
            subValue: 'Bugün',
            icon: Users, 
            color: '#F59E0B', 
            bg: 'rgba(245,158,11,0.08)',
        },
        { 
            label: 'Ürün Tıklanmaları', 
            value: stats.totalClicks.toLocaleString('tr-TR'), 
            subValue: 'Toplam etkileşim',
            icon: MousePointerClick, 
            color: '#6366F1', 
            bg: 'rgba(99,102,241,0.08)',
        },
    ];

    return (
        <div className="max-w-[1300px] mx-auto p-4 md:p-8 space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                        Trafik & Analitik
                    </h1>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        Mağazanızın ziyaretçi sayıları, tıklama oranları ve ürün etkileşimleri.
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-1 p-1 bg-[#F1F3F9] rounded-xl self-start sm:self-auto">
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
                                "px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all",
                                period === p.id 
                                    ? "bg-white text-[#0F172A] shadow-sm" 
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {metrics.map((metric, i) => (
                    <div 
                        key={i} 
                        className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#5500FF]/30 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-semibold text-slate-400">
                                {metric.label}
                            </span>
                            <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: metric.bg, color: metric.color }}
                            >
                                <metric.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[22px] md:text-[26px] font-extrabold text-[#0F172A] tracking-tight mb-1">
                            {metric.value}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400">
                            {metric.subValue}
                        </p>
                    </div>
                ))}
            </div>

            {/* Ziyaretçi & Tıklanma Grafiği */}
            <div className="bg-white rounded-2xl border border-[#E8ECF4] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                            Ziyaretçi & Tıklanma Grafiği
                        </h2>
                        <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                            Seçilen zaman aralığındaki günlük mağaza görüntülenmeleri ve ürün tıklanmaları.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#5500FF]" />
                            <span>Ziyaretçi</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                            <span>Tıklanma</span>
                        </div>
                    </div>
                </div>

                <div className="h-[320px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-[#F8F9FE] animate-pulse rounded-xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5500FF" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#5500FF" stopOpacity={0.0}/>
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECF4" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                                    dy={8}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '12px', 
                                        border: '1px solid #E8ECF4', 
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                        padding: '10px 14px',
                                        backgroundColor: '#ffffff',
                                        color: '#0F172A'
                                    }}
                                    itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                                    labelStyle={{ fontWeight: 800, color: '#0F172A', marginBottom: 4, fontSize: '13px' }}
                                    cursor={{ stroke: '#5500FF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    name="Ziyaretçi"
                                    stroke="#5500FF" 
                                    strokeWidth={2.5}
                                    fillOpacity={1} 
                                    fill="url(#colorViews)"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="clicks" 
                                    name="Tıklanma"
                                    stroke="#10B981" 
                                    strokeWidth={2.5}
                                    fillOpacity={1} 
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top Products Section */}
            <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-5 md:px-6 border-b border-[#F1F5F9] flex items-center justify-between">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                            En Çok İlgi Gören Ürünler
                        </h2>
                        <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                            Ziyaretçilerinizin vitrinde en çok tıkladığı ve satın aldığı ürünler.
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-14 bg-[#FAFBFF] animate-pulse" />)
                    ) : topProducts.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4 space-y-2">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-1">
                                <Package className="w-6 h-6" />
                            </div>
                            <p className="text-[14px] font-bold text-slate-800">Henüz tıklama verisi oluşmadı</p>
                            <p className="text-[12px] text-slate-400 max-w-xs font-medium">Ziyaretçiler ürünlerinizi inceledikçe sıralama burada güncellenecektir.</p>
                        </div>
                    ) : (
                        topProducts.map((product, i) => (
                            <div key={i} className="p-4 md:px-6 flex items-center gap-4 hover:bg-[#FAFBFF] transition-colors">
                                <span className="w-7 h-7 rounded-lg bg-[#F1F3F9] font-mono font-extrabold text-[12px] text-slate-600 flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-[14px] text-[#0F172A] truncate">{product.title}</h4>
                                    <p className="text-[12px] text-slate-400 font-medium">Fiyat: {formatCurrency(product.price, product.currency)}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[13px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-mono">
                                        {product.sales} Tıklanma
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
