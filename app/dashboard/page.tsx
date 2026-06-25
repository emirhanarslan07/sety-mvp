'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { formatCurrency } from '@/lib/utils/format';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, Calendar, DollarSign, ExternalLink, Zap, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function DashboardPage() {
    const router = useRouter();
    const { profile, store, loading: contextLoading } = useDashboard();
    
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [popularProducts, setPopularProducts] = useState<any[]>([]);
    const [chartDays, setChartDays] = useState(7);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!store?.id) {
            setLoading(false);
            return;
        }

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [statsRes, chartRes, productsRes] = await Promise.all([
                    fetch('/api/dashboard/stats'),
                    fetch(`/api/dashboard/chart?days=${chartDays}`),
                    fetch('/api/analytics/products')
                ]);

                const statsData = await statsRes.json();
                const chartJson = await chartRes.json();
                const productsData = await productsRes.json();
                
                setStats(statsData);
                setChartData(chartJson.data || []);
                setPopularProducts((productsData.data || []).slice(0, 5));

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [store?.id, chartDays]);

    if (contextLoading || loading) return <DashboardSkeleton />;

    const renderCustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                    <p className="text-sm font-bold text-slate-400 mb-1">{label}</p>
                    <p className="text-lg font-black text-white">
                        {payload[0].payload.views || 0} Ziyaretçi
                    </p>
                    <p className="text-xs font-bold text-emerald-400 mt-1">
                        {payload[0].payload.clicks || 0} Ürün Tıklanması
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Genel Bakış 📊
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        Hoş geldin, {profile?.full_name?.split(' ')[0] || 'Satıcı'} 👋 Bugün harika görünüyorsun.
                    </p>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Bugün', value: stats?.today?.views, sub: 'ziyaretçi', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Bu Ay', value: stats?.this_month?.views, sub: 'ziyaretçi', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Toplam Ziyaretçi', value: stats?.total?.views, sub: 'tüm zamanlar', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Ürün Tıklanma', value: stats?.total?.clicks, sub: 'toplam tıklanma', icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl rounded-[28px] p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-[22px] md:text-[24px] font-black text-slate-900 leading-none">
                            {stat.value || 0}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => window.open(`/${store?.username}`, '_blank')} className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-left group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                        <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-[15px] text-slate-700 group-hover:text-slate-900">Mağazamı Gör</span>
                </button>
                <button onClick={() => router.push('/dashboard/store?action=add')} className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-left group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                        <Plus className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-[15px] text-slate-700 group-hover:text-slate-900">Ürün Ekle</span>
                </button>
                <button onClick={() => router.push('/dashboard/orders')} className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-left group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                        <Package className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-[15px] text-slate-700 group-hover:text-slate-900">Siparişler</span>
                </button>
                <button onClick={() => router.push('/dashboard/settings')} className="flex items-center gap-4 p-5 bg-white/60 backdrop-blur-md rounded-[24px] border border-white shadow-sm hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 text-left group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                        <Settings className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-[15px] text-slate-700 group-hover:text-slate-900">Ayarlar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Mağaza Ziyaretçi Trendi</h3>
                            <p className="text-[13px] font-bold text-slate-400">Zaman içindeki mağaza ziyaretleriniz</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl w-fit">
                            {[7, 30, 90, 365].map(days => (
                                <button
                                    key={days}
                                    onClick={() => setChartDays(days)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                                        chartDays === days 
                                            ? "bg-white text-slate-900 shadow-sm" 
                                            : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {days === 365 ? '1 Yıl' : `${days} Gün`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5500ff" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#5500ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    tickFormatter={(val) => {
                                        const d = new Date(val);
                                        return chartDays > 30 
                                            ? d.toLocaleDateString('tr-TR', { month: 'short' })
                                            : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
                                    }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                    tickFormatter={(val) => val.toString()}
                                    dx={-10}
                                />
                                <Tooltip content={renderCustomTooltip} />
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    stroke="#5500ff" 
                                    strokeWidth={3} 
                                    fill="url(#dashGradient)"
                                    dot={{ fill: '#5500ff', strokeWidth: 3, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 8, fill: '#5500ff', stroke: '#fff', strokeWidth: 3 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popular Products List */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Popüler Ürünler</h3>
                        <button 
                            onClick={() => router.push('/dashboard/analytics')}
                            className="text-[13px] font-black text-[#5500ff] hover:text-[#4400cc] transition-colors"
                        >
                            Analitikleri Gör →
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {popularProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-800">Henüz tıklanma yok</p>
                                    <p className="text-sm font-medium text-slate-500 mt-1 px-4">Ürünleriniz tıklandıkça burada görünecek.</p>
                                </div>
                            </div>
                        ) : (
                            popularProducts.map((product, i) => (
                                <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => router.push('/dashboard/analytics')}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[15px] font-black text-slate-900 truncate">
                                                {product.title}
                                            </span>
                                        </div>
                                        <span className="text-[15px] font-black text-emerald-600">
                                            {product.sales} tık
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mt-1">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[12px] font-bold text-slate-400 truncate mt-0.5">
                                                Fiyat: {formatCurrency(product.price, product.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
