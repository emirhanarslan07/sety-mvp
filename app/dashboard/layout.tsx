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
    Filter,
    Clock,
    Smile,
    Mail,
    Send,
    Users,
    HelpCircle,
    Sparkles,
    Link2,
    Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n/context';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import ModernSidebar from '@/components/dashboard/ModernSidebar';
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
    const { user, profile, store, loading: contextLoading, refreshData } = useDashboard();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map((n: any) => ({ ...n, read: true })));
    };

    const menuItems = [
        { label: t('dashboard.menu.home'), icon: Home, href: '/dashboard' },
        { label: t('dashboard.menu.performance'), icon: Wallet, href: '/dashboard/performance' },
        { label: t('dashboard.menu.my_store'), icon: Layers, href: '/dashboard/store' },
        { label: 'Planlayıcı', icon: Send, href: '/dashboard/scheduler' },
        { label: t('dashboard.menu.analytics'), icon: BarChart3, href: '/dashboard/analytics' },
        { label: t('dashboard.menu.customers'), icon: Users, href: '/dashboard/customers' },
    ];

    const mobileMenuItems = [
        { label: 'Panel', icon: Home, href: '/dashboard' },
        { label: 'Mağazam', icon: Layers, href: '/dashboard/store' },
        { label: 'Siparişler', icon: ShoppingBag, href: '/dashboard/orders' },
        { label: 'Analitik', icon: BarChart3, href: '/dashboard/analytics' },
        { label: 'Daha Fazla', icon: Plus, onClick: () => setShowMobileMenu(true) },
    ];

    useEffect(() => {
        if (!contextLoading && !user) {
            router.push('/');
            return;
        }
    }, [contextLoading, user, store, router]);


    const handleLogout = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        window.location.href = '/';
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

    if (profile && profile.onboarding_completed === false) {
        return <OnboardingScreen profile={profile} refreshData={refreshData} />;
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FE]">
            <ModernSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen font-inter min-w-0">
                {/* Modern Sleek Top Header */}
                <header className="h-[64px] bg-white border-b border-[#E8ECF4] flex items-center justify-between px-6 lg:px-8 shrink-0 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                            {pathname === '/dashboard' ? 'Genel Bakış' :
                                pathname.includes('/performance') ? 'Performans' :
                                pathname.includes('/store') ? 'Mağazam' :
                                pathname.includes('/analytics') ? 'Analitik' :
                                pathname.includes('/customers') ? 'Müşteriler' :
                                pathname.includes('/orders') ? 'Siparişler' :
                                pathname.includes('/settings') ? 'Ayarlar' : 'Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Store Link Chip */}
                        <div className="flex items-center gap-1.5 bg-[#F8F9FE] border border-[#E8ECF4] rounded-full px-3 py-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            <span className="text-[12px] font-bold text-[#5500FF] font-mono">
                                sety.store/{store?.username || 'emirhan'}
                            </span>
                            <button
                                onClick={copyStoreLink}
                                className="text-slate-400 hover:text-[#5500FF] ml-1 p-0.5 transition-colors"
                                title="Kopyala"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                                href={`https://sety.store/${store?.username || 'emirhan'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-[#5500FF] p-0.5 transition-colors"
                                title="Mağazayı Aç"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        {/* Add product quick button */}
                        <Link
                            href="/dashboard/store?action=add"
                            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold shadow-md shadow-[#5500FF]/20 hover:opacity-95 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ürün Ekle</span>
                        </Link>
                    </div>
                </header>

                {/* Content Container */}
                <div className="flex-1 bg-[#F8F9FE] pb-24 lg:pb-8">
                    {children}
                </div>


                {/* Mobile Bottom Nav (Stan Style Refined) */}
                <nav className="fixed bottom-0 inset-x-0 h-[85px] bg-white border-t border-slate-100 flex lg:hidden items-center justify-around px-2 z-[70] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                    {mobileMenuItems.map((item, idx) => {
                        const isActive = pathname === item.href && !('onClick' in item);
                        const Icon = item.icon;

                        if ('onClick' in item) {
                            return (
                                <button
                                    key={idx}
                                    onClick={item.onClick}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 transition-all px-3 py-2 rounded-2xl",
                                        showMobileMenu ? "text-[#5500ff] bg-indigo-50" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <Icon className={cn("w-6 h-6", showMobileMenu && "rotate-45")} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href || idx}
                                href={item.href || '#'}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 transition-all px-3 py-2 rounded-2xl",
                                    isActive ? "text-[#5500ff] bg-indigo-50/50" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Icon className={cn("w-6 h-6", isActive && "animate-in zoom-in duration-300")} />
                                <span className="text-[9px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile "More" Menu Overlay (Stan-ify Premium) */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 bg-[#F4F7FF] z-[100] flex flex-col lg:hidden"
                        >
                            {/* Header */}
                            <div className="p-6 pt-12 flex items-center justify-between">
                                <h2 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">{t('dashboard.menu.more')}</h2>
                                <button
                                    onClick={() => setShowMobileMenu(false)}
                                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-xl shadow-slate-200/50 active:scale-90 transition-transform"
                                >
                                    <Plus className="w-7 h-7 rotate-45" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-12 custom-scrollbar pb-32">
                                {/* Tools Grid - Stan Style */}
                                <div className="grid grid-cols-3 gap-y-10 gap-x-4">
                                    {[
                                        { label: t('dashboard.menu.customers'), icon: Heart, href: '/dashboard/customers' },
                                        { label: t('dashboard.menu.settings'), icon: Settings, href: '/dashboard/settings' },
                                    ].map((item, i) => (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            onClick={() => setShowMobileMenu(false)}
                                            className="flex flex-col items-center gap-3 transition-active active:scale-95"
                                        >
                                            <div className="w-20 h-20 rounded-[24px] bg-white shadow-[0_4px_25px_rgba(85,0,255,0.06)] flex items-center justify-center text-indigo-900 border border-slate-50">
                                                <item.icon className="w-9 h-9" strokeWidth={1.5} />
                                            </div>
                                            <span className="text-[12px] font-bold text-indigo-900 text-center leading-tight tracking-tight">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Accounts Sections */}
                                <div className="space-y-10">
                                    {/* Accounts Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-[18px] font-bold text-indigo-900 px-2 tracking-tight opacity-40 uppercase text-[12px]">Accounts</h3>
                                        <div className="space-y-3">
                                            {/* Current User Profile Card */}
                                            <div className="w-full flex items-center gap-4 p-6 rounded-[32px] bg-white shadow-sm border border-transparent">

                                                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                                                    {profile?.profile_image_url ? (
                                                        <Image src={profile.profile_image_url} alt="" fill className="object-cover" />
                                                    ) : (
                                                        <User className="w-7 h-7 text-indigo-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[16px] font-bold text-indigo-900 truncate leading-tight">{store?.username || 'setyuser'}</p>
                                                        {profile?.plan_type === 'pro' && (
                                                            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-bold uppercase tracking-wider shadow-sm shrink-0">PRO</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[12px] font-bold text-slate-400 truncate mt-1">{user?.email}</p>
                                                </div>
                                            </div>

                                            <button className="w-full flex items-center gap-4 p-5 rounded-[28px] bg-white shadow-sm transition-all active:scale-[0.98]">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="text-[16px] font-bold text-indigo-900">{t('dashboard.sidebar.add_account')}</span>
                                            </button>

                                            <button className="w-full flex items-center gap-4 p-5 rounded-[28px] bg-white shadow-sm transition-all active:scale-[0.98]">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <HelpCircle className="w-5 h-5" />
                                                </div>
                                                <span className="text-[16px] font-bold text-indigo-900">{t('dashboard.sidebar.get_help')}</span>
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 p-5 rounded-[28px] bg-red-50/20 text-red-500 mt-6 border border-red-100/50 active:scale-[0.98] transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                    <LogOut className="w-5 h-5" />
                                                </div>
                                                <span className="text-[17px] font-bold tracking-tight">{t('dashboard.menu.logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
