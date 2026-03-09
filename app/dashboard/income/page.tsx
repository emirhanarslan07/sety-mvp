'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    DollarSign,
    ArrowDownLeft,
    Download,
    Search,
    ChevronRight,
    Filter,
    Zap,
    Copy,
    Check,
    HelpCircle,
    Settings as SettingsIcon,
    Plus,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useDashboard } from '@/context/DashboardContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Dummy data for the chart
const chartData = [
    { date: 'Feb 01', revenue: 0 },
    { date: 'Feb 04', revenue: 0 },
    { date: 'Feb 07', revenue: 0 },
    { date: 'Feb 10', revenue: 0 },
    { date: 'Feb 13', revenue: 0 },
    { date: 'Feb 16', revenue: 0 },
    { date: 'Feb 19', revenue: 0 },
    { date: 'Feb 22', revenue: 0 },
    { date: 'Feb 25', revenue: 0 },
    { date: 'Feb 28', revenue: 0 },
];

export default function IncomePage() {
    const router = useRouter();

    // DEBUG: Render Logger
    const renders = useRef(0);
    renders.current++;
    console.debug(`%c[RENDER] IncomePage #${renders.current}`, 'color: #10b981');

    const { t, lang } = useTranslation();
    const { store } = useDashboard();
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        available: 0,
        pending: 0,
        lastPayout: 0
    });
    const [copied, setCopied] = useState(false);

    const loadIncomeData = useCallback(async () => {
        if (!store?.id) return;

        const { data: ordersData } = await supabase
            .from('orders')
            .select('*, products(title)')
            .eq('store_id', store.id)
            .order('created_at', { ascending: false });

        const allOrders = ordersData || [];
        setOrders(allOrders);

        const totalRevenue = allOrders.reduce((acc, o) => acc + (parseFloat(o.amount) || 0), 0);
        setStats({
            totalRevenue,
            available: 0,
            pending: 0,
            lastPayout: totalRevenue
        });
    }, [store?.id]);

    // Derive chart data from orders
    const dynamicChartData = useMemo(() => {
        if (orders.length === 0) return chartData;

        const groups: { [key: string]: number } = {};
        const last10Days = Array.from({ length: 10 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (9 - i));
            return format(d, 'MMM dd');
        });

        last10Days.forEach(day => groups[day] = 0);

        orders.forEach(order => {
            if (!order.created_at) return;
            try {
                const dateObj = new Date(order.created_at);
                if (isNaN(dateObj.getTime())) return;

                const day = format(dateObj, 'MMM dd');
                if (groups[day] !== undefined) {
                    groups[day] += parseFloat(order.amount) || 0;
                }
            } catch (e) {
                console.error("Date formatting error:", e);
            }
        });

        return Object.entries(groups).map(([date, revenue]) => ({ date, revenue }));
    }, [orders]);

    useEffect(() => {
        if (store?.id) {
            loadIncomeData();
        }
    }, [store?.id, loadIncomeData]);

    const copyStoreUrl = () => {
        if (!store?.username) return;
        const url = `sety.store/${store.username}`;
        navigator.clipboard.writeText(`https://${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-4 md:px-6 pt-8">

            {/* Top Grid: Revenue Chart + Payout Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Revenue & Chart Section */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="space-y-1 relative z-10 mb-8">
                        <div className="flex items-center gap-2">
                            <p className="text-[14px] font-bold text-slate-400">Toplam Gelir</p>
                            <HelpCircle className="w-4 h-4 text-slate-300 cursor-help" />
                        </div>
                        <h2 className="text-[56px] font-black text-slate-900 tracking-tighter leading-none">
                            {formatCurrency(stats.totalRevenue)}
                        </h2>
                    </div>

                    {/* Revenue Chart */}
                    <div className="h-[240px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5500ff" stopOpacity={0.08} />
                                        <stop offset="95%" stopColor="#5500ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    className="text-[11px] font-bold text-slate-300"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '20px',
                                        border: 'none',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#5500ff"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                </div>

                {/* Payout Card (Cash Out) */}
                <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-slate-400">Çekilebilir Tutar</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                                {formatCurrency(stats.available)}
                            </h3>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[12px] font-bold text-slate-400">Yakında Çekilebilir</p>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none opacity-60">
                                {formatCurrency(stats.pending)}
                            </h4>
                            <button className="text-[11px] font-black text-[#5500ff] hover:underline transition-all">Detayları gör</button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-12">
                        <Button className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-black text-[15px] cursor-not-allowed group">
                            <Plus className="w-5 h-5 mr-1" /> Para Çek
                        </Button>
                        <button className="w-full flex items-center justify-center gap-2 py-4 text-[14px] font-black text-slate-400 hover:text-slate-900 transition-all">
                            <SettingsIcon className="w-4.5 h-4.5 opacity-50" />
                            Ayarlar
                        </button>
                    </div>
                </div>
            </div>

            {/* Latest Orders Section (Sety Adapted) */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Son Siparişler</h2>
                    <Button variant="outline" className="h-10 px-5 rounded-xl border-slate-100 text-slate-600 font-bold text-[13px] gap-2 hover:bg-slate-50">
                        <Download className="w-4 h-4" /> CSV Olarak İndir
                    </Button>
                </div>

                {/* Filters (Adapted Professional UI) */}
                <div className="flex flex-wrap items-center gap-3 px-2">
                    {[
                        { label: 'Tarih & Saat', active: false },
                        { label: 'E-posta', active: false },
                        { label: 'Ürün', active: false },
                        { label: 'Tutar', active: false },
                        { label: 'İndirim Kodu', active: false },
                        { label: 'Ödeme Metodu', active: false },
                        { label: 'Durum', active: false },
                    ].map((filter, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-2 h-10 px-5 rounded-full border border-slate-100 bg-slate-50/50 text-[13px] font-bold text-slate-400 hover:border-[#5500ff]/20 hover:text-slate-900 transition-all active:scale-95"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Table or Empty State */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[40px] group-hover:blur-[60px] transition-all duration-700" />
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* Custom Sety Mascot (Simplified SVG) */}
                                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#5500ff] animate-pulse">
                                    <path fill="currentColor" d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 72c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" opacity=".2" />
                                    <circle cx="35" cy="45" r="5" fill="currentColor" />
                                    <circle cx="65" cy="45" r="5" fill="currentColor" />
                                    <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M35 65c5 5 25 5 30 0" fill="none" />
                                    <path fill="currentColor" d="M45 25h10v10H45z" className="animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <path fill="currentColor" d="M55 15h5v5h-5z" />
                                </svg>
                                <div className="absolute -top-4 -right-2 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm rotate-12">
                                    <DollarSign className="w-4 h-4 text-[#5500ff]" />
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-[14px] font-bold uppercase tracking-widest mb-10 opacity-60">Henüz siparişin yok</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar -mx-2">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="py-4 px-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest">Tarih</th>
                                    <th className="py-4 px-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest">E-posta</th>
                                    <th className="py-4 px-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest">Ürün</th>
                                    <th className="py-4 px-4 text-[12px] font-bold text-slate-300 uppercase tracking-widest text-right">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="py-6 px-4">
                                            <span className="text-[14px] font-bold text-slate-600">
                                                {(() => {
                                                    try {
                                                        if (!order.created_at) return 'N/A';
                                                        const dateObj = new Date(order.created_at);
                                                        if (isNaN(dateObj.getTime())) return 'N/A';
                                                        return format(dateObj, 'dd MMM yyyy, HH:mm', { locale: lang === 'tr' ? tr : enUS });
                                                    } catch (e) {
                                                        return 'N/A';
                                                    }
                                                })()}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-[14px] font-medium text-slate-400">{order.customer_email || 'Bilinmiyor'}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#5500ff] transition-colors">
                                                    {order.products?.title || 'Dijital Ürün'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <span className="text-[15px] font-black text-slate-900">
                                                {formatCurrency(order.amount, order.currency)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
