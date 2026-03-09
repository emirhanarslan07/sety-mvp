'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Activity,
    Users,
    ShoppingBag,
    DollarSign,
    Zap,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsSection() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        weeklyUsers: 0,
        totalRevenue: 0,
        storeViews: 0,
        activeCarts: 0, // Mocked for now as we don't have carts table yet
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Users
                const { count: userCount } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true });

                // 2. Weekly Users
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const { count: weeklyCount } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true })
                    .gt('created_at', weekAgo.toISOString());

                // 3. Total Revenue
                const { data: orders } = await supabase
                    .from('orders')
                    .select('amount')
                    .eq('status', 'paid');

                const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.amount), 0) || 0;

                // 4. Store Views
                const { count: viewCount } = await supabase
                    .from('analytics_events')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_name', 'store_view');

                setStats({
                    totalUsers: userCount || 0,
                    weeklyUsers: weeklyCount || 0,
                    totalRevenue: totalRevenue,
                    storeViews: viewCount || 0,
                    activeCarts: Math.floor((viewCount || 0) * 0.15), // Mocked conversion
                    loading: false
                });
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const MetricCard = ({ title, value, subValue, trend, isPositive, icon: Icon }: any) => (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-4">
                    <div className="p-4 rounded-3xl bg-slate-50 text-slate-400 group-hover:bg-[#5500ff] group-hover:text-white transition-all duration-500">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {stats.loading ? <Loader2 className="w-8 h-8 animate-spin text-slate-200" /> : value}
                        </h3>
                        {subValue && <p className="text-xs text-slate-400 font-bold mt-1">{subValue}</p>}
                    </div>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1.5 font-black text-xs px-3 py-1.5 rounded-xl border transition-all",
                        isPositive
                            ? "text-emerald-500 bg-emerald-50 border-emerald-100"
                            : "text-rose-500 bg-rose-50 border-rose-100"
                    )}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {trend}
                    </div>
                )}
            </div>

            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <Icon className="w-32 h-32 transform -rotate-12" />
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Analizleri</h1>
                    <p className="text-slate-400 font-medium">Platformun büyüme, etkileşim ve gelir performansını buradan analiz edebilirsin.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-100 px-6 font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Canlı Akış
                    </Button>
                    <Button className="h-12 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] px-6 font-bold text-white shadow-lg shadow-indigo-500/25">
                        Rapor Al
                    </Button>
                </div>
            </div>

            {/* In-depth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <MetricCard
                    title="Toplam Kullanıcı"
                    value={stats.totalUsers.toLocaleString()}
                    subValue={`Haftalık: +${stats.weeklyUsers}`}
                    trend={`${Math.round((stats.weeklyUsers / (stats.totalUsers || 1)) * 100)}%`}
                    isPositive={true}
                    icon={Users}
                />
                <MetricCard
                    title="Toplam Mağaza Ziyareti"
                    value={stats.storeViews.toLocaleString()}
                    subValue="Benzersiz ziyaretçiler"
                    trend="Canlı"
                    isPositive={true}
                    icon={Zap}
                />
                <MetricCard
                    title="Toplam Gelir"
                    value={`₺${stats.totalRevenue.toLocaleString()}`}
                    subValue="Başarılı işlemler"
                    trend="-%"
                    isPositive={true}
                    icon={DollarSign}
                />
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-6">
                        <BarChart3 className="w-10 h-10 text-indigo-200" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Büyüme Grafiği</h4>
                    <p className="text-slate-400 font-semibold max-w-xs mx-auto">Sistem verileri veritabanı analiz motoru üzerinden hesaplanıyor...</p>
                    <div className="mt-8 flex items-end gap-2 h-32">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="w-4 bg-slate-100 rounded-full hover:bg-[#5500ff] transition-all cursor-help" style={{ height: `${Math.random() * 80 + 20}%` }} />
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center mb-6">
                        <Activity className="w-10 h-10 text-emerald-200" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">Etkileşim Analizi</h4>
                    <p className="text-slate-400 font-semibold max-w-xs mx-auto">Kullanıcıların site üzerindeki davranışları canlı olarak işlenmektedir.</p>
                    <div className="mt-8 w-full max-w-[280px] h-4 bg-slate-50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 transition-all duration-1000"
                            style={{ width: stats.loading ? '10%' : '75%', boxShadow: '0 0 15px rgba(52,211,153,0.5)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
