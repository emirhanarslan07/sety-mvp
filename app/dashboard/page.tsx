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
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [chartDays, setChartDays] = useState(7);
    const [loading, setLoading] = useState(true);
    const [paymentSettings, setPaymentSettings] = useState<any>(null);

    useEffect(() => {
        if (!store?.id) {
            setLoading(false);
            return;
        }

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [statsRes, chartRes, ordersRes] = await Promise.all([
                    fetch('/api/dashboard/stats'),
                    fetch(`/api/dashboard/chart?days=${chartDays}`),
                    fetch('/api/dashboard/recent-orders?limit=5')
                ]);

                const statsData = await statsRes.json();
                const chartJson = await chartRes.json();
                const ordersData = await ordersRes.json();
                
                // Fetch payment settings to check Paddle status
                const paymentRes = await fetch('/api/settings/payment');
                const paymentData = await paymentRes.json();
                setPaymentSettings(paymentData.data);

                setStats(statsData);
                setChartData(chartJson.data || []);
                setRecentOrders(ordersData.data || []);

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
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                        {payload[0].payload.orders} sipariş
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

            {/* Paddle Connection Status */}
            <div className={cn(
                "flex items-center justify-between p-4 px-6 rounded-[24px] border transition-all",
                paymentSettings?.default_provider === 'paddle' 
                    ? "bg-emerald-50 border-emerald-100/50" 
                    : "bg-amber-50 border-amber-100/50"
            )}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        paymentSettings?.default_provider === 'paddle' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className={cn(
                            "font-black text-[15px]",
                            paymentSettings?.default_provider === 'paddle' ? "text-emerald-900" : "text-amber-900"
                        )}>
                            Paddle Entegrasyon Durumu
                        </h4>
                        <p className={cn(
                            "text-[13px] font-bold",
                            paymentSettings?.default_provider === 'paddle' ? "text-emerald-600" : "text-amber-600"
                        )}>
                            {paymentSettings?.default_provider === 'paddle' 
                                ? "Aktif: Global ödemeler Sety altyapısıyla alınıyor." 
                                : "Pasif: Ödemeler şu an manuel veya diğer yöntemlerle alınıyor."}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => router.push('/dashboard/settings/payment')}
                    className={cn(
                        "px-6 h-10 rounded-xl font-black text-[13px] transition-all",
                        paymentSettings?.default_provider === 'paddle'
                            ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                            : "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200"
                    )}
                >
                    {paymentSettings?.default_provider === 'paddle' ? "Ayarları Yönet" : "Aktifleştir"}
                </button>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: 'Bugün', value: stats?.today?.revenue, sub: `${stats?.today?.orders} satış`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Bu Ay', value: stats?.this_month?.revenue, sub: `${stats?.this_month?.orders} satış`, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Toplam Kazanç', value: stats?.total?.revenue, sub: `${stats?.total?.orders} satış`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Bekleyen Onay', value: stats?.pending, sub: 'sipariş', icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-slate-200 transition-all duration-200">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-[22px] md:text-[24px] font-black text-slate-900 leading-none">
                            {i === 3 ? stat.value : formatCurrency(stat.value || 0)}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => window.open(`/${store?.username}`, '_blank')} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#5500ff]/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 text-left group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <ExternalLink className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">Mağazamı Gör</span>
                </button>
                <button onClick={() => router.push('/dashboard/store?action=add')} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#5500ff]/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 text-left group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Plus className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">Ürün Ekle</span>
                </button>
                <button onClick={() => router.push('/dashboard/orders')} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#5500ff]/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 text-left group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Package className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">Siparişler</span>
                </button>
                <button onClick={() => router.push('/dashboard/settings')} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-[#5500ff]/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 text-left group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Settings className="w-5 h-5 text-slate-600 group-hover:text-[#5500ff]" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-slate-900">Ayarlar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Satış Grafiği</h3>
                            <p className="text-[13px] font-bold text-slate-400">Zaman içindeki gelir tablonuz</p>
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
                                    tickFormatter={(val) => `₺${val}`}
                                    dx={-10}
                                />
                                <Tooltip content={renderCustomTooltip} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
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

                {/* Recent Orders List */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Son Siparişler</h3>
                        <button 
                            onClick={() => router.push('/dashboard/orders')}
                            className="text-[13px] font-black text-[#5500ff] hover:text-[#4400cc] transition-colors"
                        >
                            Tümünü Gör →
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-800">Henüz sipariş yok</p>
                                    <p className="text-sm font-medium text-slate-500 mt-1 px-4">İlk siparişiniz geldiğinde burada görünecek.</p>
                                </div>
                            </div>
                        ) : (
                            recentOrders.map((order, i) => (
                                <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => router.push('/dashboard/orders')}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full",
                                                order.status === 'pending' ? 'bg-amber-400' : 
                                                order.status === 'completed' || order.status === 'paid' ? 'bg-emerald-400' : 'bg-slate-300'
                                            )} />
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{order.order_number}</span>
                                        </div>
                                        <span className="text-[15px] font-black text-slate-900">
                                            {formatCurrency(order.amount, order.currency)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mt-1">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[15px] font-black text-slate-900 truncate">
                                                {order.product_name}
                                            </p>
                                            <p className="text-[12px] font-bold text-slate-400 truncate mt-0.5">
                                                {order.customer_email}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 mt-2">
                                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: tr })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
