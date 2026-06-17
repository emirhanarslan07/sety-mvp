'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Download,
    HelpCircle,
    Eye,
    MousePointerClick,
    Activity,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils/format';
import { tr } from 'date-fns/locale';
import { useDashboard } from '@/context/DashboardContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function PerformancePage() {
    const router = useRouter();

    const { user, store } = useDashboard();
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalViews: 0,
        todayViews: 0,
        totalClicks: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPerformanceData = useCallback(async () => {
        if (!user?.id || !store?.id) return;
        setLoading(true);

        try {
            const [analyticsRes, statsRes, chartRes] = await Promise.all([
                supabase
                    .from('store_analytics')
                    .select('*, products(title)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50),
                fetch('/api/dashboard/stats').then(res => res.json()),
                fetch('/api/dashboard/chart?days=14').then(res => res.json())
            ]);

            setEvents(analyticsRes.data || []);
            
            setStats({
                totalViews: statsRes.total?.views || 0,
                todayViews: statsRes.today?.views || 0,
                totalClicks: statsRes.total?.clicks || 0
            });
            
            if (chartRes.data) {
                const formattedChartData = chartRes.data.map((item: any) => {
                    const date = new Date(item.date);
                    return {
                        date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
                        views: item.views,
                        clicks: item.clicks,
                    };
                });
                setChartData(formattedChartData);
            }

        } catch (error) {
            console.error("Error loading performance data:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, store?.id]);

    useEffect(() => {
        loadPerformanceData();
    }, [loadPerformanceData]);

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 space-y-10">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Performans Raporu 🚀
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        Mağazanızın ziyaretçi ve tıklanma metriklerini takip edin.
                    </p>
                </div>
            </div>

            {/* Stats Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                        <Eye className="w-5 h-5 text-[#5500ff]" />
                        <span className="text-[13px] font-black uppercase tracking-widest">Toplam Ziyaretçi</span>
                    </div>
                    <h2 className="text-[40px] font-black text-slate-900 leading-none">
                        {stats.totalViews}
                    </h2>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                        <Eye className="w-5 h-5 text-amber-500" />
                        <span className="text-[13px] font-black uppercase tracking-widest">Bugün Ziyaretçi</span>
                    </div>
                    <h2 className="text-[40px] font-black text-slate-900 leading-none">
                        {stats.todayViews}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                        <MousePointerClick className="w-5 h-5 text-emerald-500" />
                        <span className="text-[13px] font-black uppercase tracking-widest">Toplam Ürün Tıklanması</span>
                    </div>
                    <h2 className="text-[40px] font-black text-slate-900 leading-none">
                        {stats.totalClicks}
                    </h2>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Ziyaretçi Trendi (14 Gün)</h3>
                </div>
                <div className="h-[250px] w-full">
                    {loading ? (
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis
                                    dataKey="date"
                                    className="text-[12px] font-bold text-slate-400"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        fontWeight: 'black',
                                        padding: '12px 16px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    name="Ziyaretçi"
                                    stroke="#5500ff"
                                    strokeWidth={4}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Latest Interactions */}
            <div className="space-y-10 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-[28px] md:text-[32px] font-black text-slate-900 tracking-tight leading-none">Son Etkileşimler</h2>
                    <Button variant="outline" className="h-10 px-5 rounded-2xl border-slate-200 text-slate-500 font-black text-[13px] gap-2 hover:bg-slate-50 shadow-sm">
                        <Download className="w-4 h-4" /> CSV İndir
                    </Button>
                </div>

                {/* Table Header Labels */}
                <div className="grid grid-cols-3 gap-4 px-4 py-2 opacity-60">
                    <span className="text-[14px] font-black text-slate-900">Zaman</span>
                    <span className="text-[14px] font-black text-slate-900">Etkileşim</span>
                    <span className="text-[14px] font-black text-slate-900 text-right">Detay</span>
                </div>

                {/* Empty State */}
                {events.length === 0 && !loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center px-4 border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                            <Activity className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Veri Yok</h3>
                        <p className="text-slate-500 font-medium max-w-[320px]">
                            Henüz mağazanız ziyaret edilmedi.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loading && [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[32px]" />)}
                        
                        {!loading && events.map((event) => (
                            <div key={event.id} className="grid grid-cols-3 gap-4 p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all items-center group">
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-black text-slate-900">
                                        {format(new Date(event.created_at), 'MMM dd, HH:mm')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                                        event.event_type === 'store_view' 
                                            ? "bg-violet-50 text-[#5500ff]" 
                                            : "bg-emerald-50 text-emerald-500"
                                    )}>
                                        {event.event_type === 'store_view' ? <Eye className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                                    </div>
                                    <span className="text-[15px] font-black text-slate-900 truncate">
                                        {event.event_type === 'store_view' ? 'Mağaza Ziyareti' : 'Ürün Tıklaması'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[15px] font-bold text-slate-500">
                                        {event.event_type === 'product_click' 
                                            ? event.products?.title || 'Bilinmeyen Ürün'
                                            : 'Ana Sayfa'
                                        }
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
