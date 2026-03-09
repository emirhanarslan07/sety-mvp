'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    ShoppingBag,
    Wallet,
    BarChart3,
    Heart,
    User,
    Settings,
    LogOut,
    Zap,
    Bell,
    Copy,
    Check,
    ExternalLink,
    Plus,
    Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n/context';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useTranslation();
    const { user, profile, store, loading: contextLoading } = useDashboard();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map((n: any) => ({ ...n, read: true })));
    };

    const menuItems = [
        { label: t('dashboard.menu.home'), icon: Home, href: '/dashboard' },
        { label: t('dashboard.menu.my_store'), icon: ShoppingBag, href: '/dashboard/store' },
        { label: t('dashboard.menu.income'), icon: Wallet, href: '/dashboard/income' },
        { label: t('dashboard.menu.analytics'), icon: BarChart3, href: '/dashboard/analytics' },
        { label: t('dashboard.menu.customers'), icon: Heart, href: '/dashboard/customers' },
    ];

    const mobileMenuItems = [
        { label: t('dashboard.menu.home'), icon: Home, href: '/dashboard' },
        { label: t('dashboard.menu.my_store'), icon: ShoppingBag, href: '/dashboard/store' },
        { label: t('dashboard.menu.income'), icon: Wallet, href: '/dashboard/income' },
        { label: t('dashboard.menu.analytics'), icon: BarChart3, href: '/dashboard/analytics' },
        { label: t('dashboard.menu.customers'), icon: Heart, href: '/dashboard/customers' },
    ];

    useEffect(() => {
        if (!contextLoading && !user) {
            router.push('/auth');
            return;
        }

        if (store?.id) {
            const loadNotifications = async () => {
                const [ordersRes, customersRes] = await Promise.all([
                    supabase.from('orders')
                        .select('id, amount, created_at, products(title), customers(name)')
                        .eq('store_id', store.id)
                        .order('created_at', { ascending: false })
                        .limit(5),
                    supabase.from('customers')
                        .select('id, name, email, created_at')
                        .eq('store_id', store.id)
                        .order('created_at', { ascending: false })
                        .limit(3)
                ]);

                const recentOrders = ordersRes.data || [];
                const recentCustomers = customersRes.data || [];
                const notifs: any[] = [];

                recentOrders.forEach((order: any) => {
                    const minutesAgo = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
                    const timeStr = minutesAgo < 60
                        ? `${minutesAgo} ${t('dashboard.notifications.minute_ago')}`
                        : minutesAgo < 1440
                            ? `${Math.floor(minutesAgo / 60)} ${t('dashboard.notifications.hour_ago')}`
                            : `${Math.floor(minutesAgo / 1440)} ${t('dashboard.notifications.day_ago')}`;

                    notifs.push({
                        id: `order-${order.id}`,
                        type: 'sale',
                        title: t('dashboard.notifications.sale_title'),
                        message: `${order.products?.title || t('dashboard.notifications.product_fallback')} — ₺${order.amount}`,
                        time: timeStr,
                        read: minutesAgo > 1440,
                        icon: Wallet,
                        iconColor: 'text-emerald-500',
                        bgColor: 'bg-emerald-50'
                    });
                });

                recentCustomers.forEach((cust: any) => {
                    const minutesAgo = Math.floor((Date.now() - new Date(cust.created_at).getTime()) / 60000);
                    const timeStr = minutesAgo < 60
                        ? `${minutesAgo} ${t('dashboard.notifications.minute_ago')}`
                        : minutesAgo < 1440
                            ? `${Math.floor(minutesAgo / 60)} ${t('dashboard.notifications.hour_ago')}`
                            : `${Math.floor(minutesAgo / 1440)} ${t('dashboard.notifications.day_ago')}`;

                    notifs.push({
                        id: `cust-${cust.id}`,
                        type: 'user',
                        title: t('dashboard.notifications.customer_title'),
                        message: `${cust.name || cust.email} ${t('dashboard.notifications.registered')}`,
                        time: timeStr,
                        read: minutesAgo > 1440,
                        icon: Heart,
                        iconColor: 'text-blue-500',
                        bgColor: 'bg-blue-50'
                    });
                });

                setNotifications(notifs.sort((a, b) => {
                    const parseTime = (timeStr: string) => {
                        const num = parseInt(timeStr);
                        if (timeStr.includes(t('dashboard.notifications.minute_ago'))) return num;
                        if (timeStr.includes(t('dashboard.notifications.hour_ago'))) return num * 60;
                        return num * 1440;
                    };
                    return parseTime(a.time) - parseTime(b.time);
                }));
            };
            loadNotifications();
        }
    }, [contextLoading, user, store, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();
    const storeUrl = `sety.store/${store?.username || user?.username || ''}`;

    const copyStoreLink = () => {
        navigator.clipboard.writeText(`https://${storeUrl}`);
        setCopied(true);
        showToast(t('dashboard.toast.store_link_copied'), 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (contextLoading) {
        return (
            <div className="flex min-h-screen bg-white items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SetyLogo size="lg" className="animate-pulse" />
                    </motion.div>
                    <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute inset-y-0 bg-[#5500ff] rounded-full"
                            initial={{ width: "30%", left: "-30%" }}
                            animate={{ left: "100%" }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar (Stan Style) */}
            <aside className="fixed inset-y-0 left-0 w-[240px] bg-[#F4F7FF] hidden lg:flex flex-col z-50 border-r border-slate-100/50">
                {/* Logo & Notifications Section */}
                <div className="p-6 pt-8 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-[#5500ff] flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            <Zap className="w-5 h-5 text-[#C4FF00]" fill="#C4FF00" strokeWidth={2.5} />
                        </div>
                        <span className="text-[22px] font-black tracking-tight text-slate-900 font-logo">Sety</span>
                    </Link>

                    {/* Notifications Button in Sidebar */}
                    <button className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-indigo-100 hover:bg-slate-50 transition-all text-slate-400 relative">
                        <Bell className="w-4.5 h-4.5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#5500ff] rounded-full border-2 border-white" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] transition-all group relative group",
                                    isActive
                                        ? "bg-white text-[#1a202c] font-semibold shadow-[0_4px_12px_rgba(85,0,255,0.06)]"
                                        : "text-slate-500 font-semibold hover:text-[#1a202c] hover:bg-white/60"
                                )}>
                                <item.icon className={cn(
                                    "w-5 h-5 transition-all shrink-0",
                                    isActive ? "text-[#5500ff]" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-3 space-y-1 mt-auto pb-8">
                    {/* Trial Status Badge */}
                    {profile?.trial_ends_at && profile?.subscription_status === 'trialing' && (
                        <div className="mb-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 rounded-md bg-[#5500ff]/10">
                                    <Zap className="w-3 h-3 text-[#5500ff]" />
                                </div>
                                <span className="text-[12px] font-black text-slate-900 uppercase tracking-wider">{t('dashboard.sidebar.plan_status')}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[13px] font-bold">
                                    <span className="text-slate-500">{t('dashboard.sidebar.free_trial')}</span>
                                    <span className="text-[#5500ff]">
                                        {Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {t('dashboard.sidebar.days_remaining')}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[#5500ff]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(0, Math.min(100, (Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) / 30) * 100))}%` }}
                                    />
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/settings?tab=billing')}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-[12px] font-black hover:bg-slate-800 transition-all mt-1"
                                >
                                    {t('dashboard.sidebar.upgrade')}
                                </button>
                            </div>
                        </div>
                    )}

                    <Link
                        href="/dashboard/settings"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all",
                            pathname === '/dashboard/settings'
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        )}
                    >
                        <Settings className="w-5 h-5" />
                        {t('dashboard.menu.settings')}
                    </Link>


                    {/* Profile Section with Popover */}
                    <div className="pt-2 px-1 relative">
                        <AnimatePresence>
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                                        className="absolute bottom-full left-0 mb-4 w-[280px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden p-6"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="relative w-14 h-14 rounded-2xl bg-slate-50 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                                {profile?.profile_image_url ? (
                                                    <Image src={profile.profile_image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <User className="w-8 h-8 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[16px] font-black text-slate-900 truncate leading-tight">
                                                    {store?.username || 'setyuser'}
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-400 mt-0.5 break-all">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            {user?.email === 'hello@sety.store' && (
                                                <button
                                                    onClick={() => {
                                                        router.push('/admin');
                                                        setShowUserMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Shield className="w-4 h-4 text-white" />
                                                    </div>
                                                    Yönetici Paneli
                                                </button>
                                            )}
                                            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                                                    <Plus className="w-4 h-4 text-slate-500" />
                                                </div>
                                                {t('dashboard.sidebar.add_account')}
                                            </button>
                                            <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-bold text-slate-600 hover:bg-slate-50 transition-all group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                                                    <div className="text-[14px]">?</div>
                                                </div>
                                                {t('dashboard.sidebar.get_help')}
                                            </button>
                                        </div>

                                        <div className="h-px bg-slate-100 my-4" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl text-[15px] font-black text-red-500 hover:bg-red-50 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white">
                                                <LogOut className="w-4 h-4 text-red-500" />
                                            </div>
                                            {t('dashboard.menu.logout')}
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        <div
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-2xl group cursor-pointer transition-all hover:bg-white/60",
                                showUserMenu && "bg-white shadow-sm"
                            )}
                        >
                            <div className="relative w-10 h-10 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                                {profile?.profile_image_url ? (
                                    <Image src={profile.profile_image_url} alt="" fill className="object-cover" sizes="40px" />
                                ) : (
                                    <User className="w-6 h-6 text-indigo-400 opacity-50" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                    {store?.username || user?.username || 'setyuser'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-[240px] flex flex-col min-h-screen font-sans">
                {/* Fixed Top Header (Ev) */}
                <header className="h-[80px] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100/50 sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <h2 className="text-[24px] font-black text-slate-900 tracking-tight">
                            {pathname === '/dashboard' ? t('dashboard.menu.home') :
                                pathname.includes('/store') ? t('dashboard.menu.my_store') :
                                    pathname.includes('/income') ? t('dashboard.menu.income') :
                                        pathname.includes('/analytics') ? t('dashboard.menu.analytics') :
                                            pathname.includes('/customers') ? t('dashboard.menu.customers') :
                                                pathname.includes('/settings') ? t('dashboard.menu.settings') : 'Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={copyStoreLink}
                            className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all group"
                        >
                            <span className="text-[15px] font-bold text-[#5500ff]">
                                sety.store/{store?.username || user?.username || ''}
                            </span>
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="w-3.5 h-3.5 text-[#5500ff] transition-colors" />
                            )}
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <div className="flex-1 bg-[#FDFDFF] pb-24 lg:pb-0">
                    {children}
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="fixed bottom-0 inset-x-0 h-[80px] bg-white border-t border-slate-100 flex lg:hidden items-center justify-around px-4 z-50 pb-safe">
                    {mobileMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 transition-all px-3",
                                    isActive ? "text-[#5500ff]" : "text-slate-400"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", isActive && "animate-in zoom-in duration-300")} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
    );
}
