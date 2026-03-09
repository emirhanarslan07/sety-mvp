'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Users,
    ShoppingBag,
    DollarSign,
    BarChart3,
    Store,
    ArrowUpRight,
    TrendingUp,
    UserPlus,
    Activity,
    Search,
    Filter,
    Zap,
    MoreHorizontal,
    LayoutDashboard,
    Settings,
    Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/ui/SetyLogo';

// Section Components
import OverviewSection from '@/components/admin/sections/OverviewSection';
import StoresSection from '@/components/admin/sections/StoresSection';
import UsersSection from '@/components/admin/sections/UsersSection';
import AnalyticsSection from '@/components/admin/sections/AnalyticsSection';
import SecuritySection from '@/components/admin/sections/SecuritySection';
import SettingsSection from '@/components/admin/sections/SettingsSection';

export default function AdminDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [metrics, setMetrics] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);

    useEffect(() => {
        const checkAdminAndLoad = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('user_id', user.id)
                .single();

            const isOwner = user.email === 'hello@sety.store';

            if (!isOwner && (!profile || profile.role !== 'admin')) {
                router.push('/dashboard');
                return;
            }

            setIsAdmin(true);

            // Fetch Live Counts directly (Real-time data)
            const [usersRes, storesRes, productsRes] = await Promise.all([
                supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
                supabase.from('stores').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true })
            ]);

            setMetrics({
                total_users: usersRes.count || 0,
                total_stores: storesRes.count || 0,
                total_products: productsRes.count || 0,
                active_trials: 0
            });

            // Fetch Recent Users
            const { data: userData } = await supabase
                .from('user_profiles')
                .select('*, stores(username)')
                .order('created_at', { ascending: false })
                .limit(5);
            setRecentUsers(userData || []);

            // Fetch Top Stores
            const { data: storeData } = await supabase
                .from('stores')
                .select('*, user_profiles(full_name, profile_image_url)')
                .limit(5);
            setStores(storeData || []);

            setLoading(false);
        };

        checkAdminAndLoad();

        // 30 seconds polling to keep data fresh
        const interval = setInterval(checkAdminAndLoad, 30000);
        return () => clearInterval(interval);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <OverviewSection metrics={metrics} recentUsers={recentUsers} stores={stores} />;
            case 'stores': return <StoresSection />;
            case 'users': return <UsersSection />;
            case 'analytics': return <AnalyticsSection />;
            case 'security': return <SecuritySection />;
            case 'settings': return <SettingsSection />;
            default: return <OverviewSection metrics={metrics} recentUsers={recentUsers} stores={stores} />;
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside className="w-[280px] bg-[#F4F7FF] flex flex-col z-50 border-r border-slate-100/50 sticky top-0 h-screen p-8 transition-all duration-500">
                <div
                    onClick={() => setActiveSection('overview')}
                    className="flex items-center gap-3.5 mb-14 px-2 cursor-pointer group active:scale-95 transition-all"
                >
                    <div className="w-10 h-10 rounded-[14px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-all duration-300">
                        <Zap className="w-5.5 h-5.5 text-[#C4FF00]" fill="#C4FF00" strokeWidth={2.5} />
                    </div>
                    <span className="text-[20px] font-black tracking-tight text-slate-900 font-logo group-hover:translate-x-0.5 transition-transform">Sety Admin</span>
                </div>

                <nav className="flex-1 space-y-1.5">
                    {[
                        { id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard },
                        { id: 'stores', label: 'Mağazalar', icon: Store },
                        { id: 'users', label: 'Kullanıcılar', icon: Users },
                        { id: 'analytics', label: 'Analizler', icon: BarChart3 },
                        { id: 'security', label: 'Güvenlik', icon: Shield },
                        { id: 'settings', label: 'Ayarlar', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-[15px] font-bold transition-all group",
                                activeSection === item.id
                                    ? "bg-white text-slate-950 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                                    : "text-slate-500 hover:text-slate-950 hover:bg-white/60"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5.5 h-5.5 transition-colors",
                                activeSection === item.id ? "text-[#5500ff]" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-slate-100/50 space-y-6">
                    <div className="flex items-center gap-4 px-3 group cursor-pointer active:scale-95 transition-all">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-[#5500ff] shadow-sm transform group-hover:-rotate-3 transition-transform">
                            A
                        </div>
                        <div className="min-w-0">
                            <p className="text-[15px] font-black text-slate-900 leading-tight truncate">Admin</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 truncate">hello@sety.store</p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full h-14 bg-white hover:bg-slate-900 hover:text-white rounded-2xl font-black text-[14px] text-slate-950 shadow-sm border border-slate-200/50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        Panele Dön
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-14 bg-[#F8FAFF] min-h-screen overflow-y-auto">
                {/* Global Refresh Button */}
                <div className="fixed bottom-10 right-10 z-[100]">
                    <Button
                        onClick={() => {
                            setLoading(true);
                            router.refresh(); // This will trigger the checkAdminAndLoad in useEffect
                        }}
                        className="h-16 w-16 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-black transition-all flex items-center justify-center group active:scale-90"
                    >
                        <Activity className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                    </Button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {renderSection()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
