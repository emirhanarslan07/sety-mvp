'use client';

import React from 'react';
import {
    Users,
    ShoppingBag,
    BarChart3,
    TrendingUp,
    UserPlus,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OverviewSectionProps {
    metrics: any;
    recentUsers: any[];
    stores: any[];
}

export default function OverviewSection({ metrics, recentUsers, stores }: OverviewSectionProps) {
    const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-4 rounded-2xl", color)}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Özeti</h1>
                    <p className="text-slate-400 font-medium">Sety platformunun genel performansını buradan takip edebilirsin.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm text-slate-500 text-sm font-bold">
                        <Activity className="w-4 h-4 text-green-500" />
                        Sistem Durumu: Normal
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard
                    title="Top. Kullanıcı"
                    value={metrics?.total_users || 0}
                    icon={Users}
                    trend="+12%"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Aktif Mağaza"
                    value={metrics?.total_stores || 0}
                    icon={ShoppingBag}
                    trend="+8%"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Deneme Sürümü"
                    value={metrics?.active_trials || 0}
                    icon={TrendingUp}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Top. Ürün"
                    value={metrics?.total_products || 0}
                    icon={BarChart3}
                    trend="+24%"
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Stores Table */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <h3 className="text-xl font-black text-slate-900">Aktif Mağazalar</h3>
                        <Button variant="ghost" className="text-primary text-sm font-black hover:bg-primary/5 rounded-xl px-4">Tümünü Gör</Button>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mağaza</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sahibi</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stores.map((store) => (
                                    <tr key={store.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-white transition-colors">
                                                    {store.username?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">@{store.username}</p>
                                                    <p className="text-xs text-slate-400">sety.store/{store.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-semibold text-slate-600">{store.user_profiles?.full_name || 'İsimsiz'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">Aktif</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Users List */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-8">Yeni Üyeler</h3>
                    <div className="flex-1 space-y-6">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                                        {user.profile_image_url ? (
                                            <img src={user.profile_image_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <UserPlus className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 leading-tight">{user.full_name || 'Yeni Kullanıcı'}</p>
                                        <p className="text-xs text-slate-400 font-medium">@{user.stores?.[0]?.username || 'magaza-yok'}</p>
                                    </div>
                                </div>
                                <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all active:scale-90">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-8 rounded-2xl font-bold text-slate-400 border-dashed border-2 hover:text-primary h-14 transition-all">
                        Tüm Kullanıcılar
                    </Button>
                </div>
            </div>
        </div>
    );
}
