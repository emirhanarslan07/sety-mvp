'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    DollarSign,
    Download,
    HelpCircle,
    Settings as SettingsIcon,
    Plus,
    AlertCircle,
    ShoppingBag,
} from 'lucide-react';
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
        <div className="max-w-[1200px] mx-auto space-y-12 pb-32 px-4 md:px-8 pt-8">

            {/* Total Revenue Section (Stan Style) */}
            <div className="space-y-8 pt-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[15px] font-black uppercase tracking-widest">Total Revenue</span>
                        <HelpCircle className="w-4 h-4 cursor-help" />
                    </div>
                    <h2 className="text-[64px] md:text-[80px] font-black text-slate-900 tracking-tighter leading-none">
                        {formatCurrency(stats.totalRevenue)}
                    </h2>
                </div>

                {/* Revenue Chart Section */}
                <div className="h-[200px] w-full max-w-[800px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="date"
                                className="text-[12px] font-bold text-slate-300"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                                    fontWeight: 'black',
                                    padding: '12px 16px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#5500ff"
                                strokeWidth={4}
                                fill="transparent"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Payout & Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px]">
                {/* Available for Cashout Card */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-slate-400">Available for Cashout</p>
                            <h3 className="text-[42px] font-black text-slate-900 tracking-tight leading-none">
                                {formatCurrency(stats.available)}
                            </h3>
                        </div>
                        <div className="space-y-1 opacity-50">
                            <p className="text-[13px] font-bold text-slate-400">Available Soon</p>
                            <h4 className="text-[20px] font-black text-slate-900 tracking-tight leading-none leading-none">
                                {formatCurrency(stats.pending)}
                            </h4>
                            <button className="text-[12px] font-black text-[#5500ff] hover:underline underline-offset-4">View breakdown</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        disabled={stats.available <= 0}
                        className={cn(
                            "w-full h-20 rounded-[32px] font-black text-[18px] shadow-lg shadow-indigo-100/50 transition-all active:scale-95",
                            stats.available > 0 ? "bg-[#5500ff] hover:bg-[#4400cc] text-white" : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                        )}
                    >
                        <Plus className="w-6 h-6 mr-2" /> Cash Out
                    </Button>
                    <button
                        onClick={() => router.push('/dashboard/settings?tab=payout')}
                        className="w-full flex items-center justify-center gap-2 h-16 rounded-[32px] text-[16px] font-black text-[#5500ff] hover:bg-indigo-50 transition-all border border-transparent active:scale-[0.98]"
                    >
                        <SettingsIcon className="w-5 h-5" />
                        Settings
                    </button>
                </div>
            </div>

            {/* Latest Orders Section (Stan Style) */}
            <div className="space-y-10 pt-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-[28px] md:text-[32px] font-black text-slate-900 tracking-tight leading-none">Latest Orders</h2>
                    <Button variant="outline" className="h-10 px-5 rounded-2xl border-slate-200 text-slate-500 font-black text-[13px] gap-2 hover:bg-slate-50 shadow-sm">
                        <Download className="w-4 h-4" /> Download CSV
                    </Button>
                </div>

                {/* Filters (Stan Style Tags) */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {[
                        { label: 'Date & Time', active: false },
                        { label: 'Email', active: false },
                        { label: 'Product', active: false },
                        { label: 'Amount', active: false },
                        { label: 'Discount Code', active: false },
                        { label: 'Payment Method', active: false },
                        { label: 'Status', active: false },
                    ].map((filter, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-2 h-11 px-6 rounded-full bg-indigo-50/50 text-[14px] font-black text-[#5500ff] hover:bg-indigo-100 transition-all active:scale-95 border border-transparent"
                        >
                            <Plus className="w-4 h-4" />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Table Header Labels */}
                <div className="grid grid-cols-3 gap-4 px-4 py-2 opacity-60">
                    <span className="text-[14px] font-black text-slate-900">Date</span>
                    <span className="text-[14px] font-black text-slate-900">Product</span>
                    <span className="text-[14px] font-black text-slate-900 text-right">Amount</span>
                </div>

                {/* Empty State (Sety Adapted) */}
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-500 bg-white rounded-[40px] border border-slate-100/50">
                        <div className="relative mb-10 group">
                            <div className="absolute inset-0 bg-[#5500ff]/5 rounded-full blur-[40px] group-hover:blur-[60px] transition-all duration-700 scale-150" />
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <SetyLogo size="lg" className="brightness-125 opacity-20 grayscale" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-[#5500ff] rounded-full flex items-center justify-center text-white shadow-2xl">
                                        <DollarSign className="w-12 h-12" strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-[28px] font-black text-slate-900 tracking-tight leading-none mb-4">No Transactions Matching Filters</h3>
                        <p className="text-slate-400 text-[16px] font-bold leading-relaxed max-w-[320px]">
                            Update filters to find what you're looking for!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="grid grid-cols-3 gap-4 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer items-center group">
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-black text-slate-900">
                                        {format(new Date(order.created_at), 'MMM dd, HH:mm')}
                                    </span>
                                    <span className="text-[12px] font-bold text-slate-300 truncate">{order.customer_email || 'Bilinmiyor'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:text-[#5500ff] group-hover:bg-indigo-50 transition-all">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <span className="text-[15px] font-black text-slate-900 truncate">
                                        {order.products?.title || 'Dijital Ürün'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[17px] font-black text-slate-900">
                                        {formatCurrency(order.amount, order.currency)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
