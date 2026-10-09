'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Grid2X2,
    Store,
    ShoppingBag,
    CalendarDays,
    Users,
    BarChart2,
    Settings,
    Zap,
    Copy,
    ArrowUpRight,
    ChevronsUpDown,
    ChevronRight,
    Bell,
    ExternalLink,
    Plus,
    Menu,
    X,
    Loader2,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { OnboardingScreen } from '@/components/dashboard/OnboardingScreen';
import './dashboard.css';

const navigation = [
    { to: '/dashboard', label: 'Genel Bakış', icon: Grid2X2 },
    { to: '/dashboard/store', label: 'Mağazam', icon: Store },
    { to: '/dashboard/orders', label: 'Siparişler', icon: ShoppingBag },
    { to: '/dashboard/appointments', label: 'Randevular', icon: CalendarDays },
    { to: '/dashboard/customers', label: 'Müşteriler', icon: Users },
    { to: '/dashboard/analytics', label: 'Analitik', icon: BarChart2 },
    { to: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
] as const;

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, profile, store, loading: contextLoading, refreshData } = useDashboard();
    const { showToast } = useToast();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [orderCount, setOrderCount] = useState<number>(3);

    // New product modal state
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState('digital_product');
    const [newPrice, setNewPrice] = useState('249');
    const [newDesc, setNewDesc] = useState('');
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);

    const username = store?.username || user?.user_metadata?.username || 'emirhan';
    const storeUrl = `sety.store/${username}`;

    // Get active menu label
    const activeItem = navigation.find(n => {
        if (n.to === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(n.to);
    });
    const activeLabel = activeItem?.label || 'Panel';

    // Note: Guest users can preview the dashboard layout without forced redirects.


    // Fetch orders count
    useEffect(() => {
        if (store?.id) {
            supabase
                .from('orders')
                .select('id', { count: 'exact', head: true })
                .eq('store_id', store.id)
                .then(({ count }) => {
                    if (count && count > 0) setOrderCount(count);
                })
                .catch(() => {});
        }
    }, [store?.id]);

    const copyLink = () => {
        navigator.clipboard.writeText(`https://${storeUrl}`);
        setCopied(true);
        showToast('Mağaza linki kopyalandı! 🚀', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setIsCreatingProduct(true);
        try {
            if (store?.id && user?.id) {
                const { error } = await supabase.from('products').insert([{
                    store_id: store.id,
                    user_id: user.id,
                    title: newTitle.trim(),
                    type: newType,
                    price: parseFloat(newPrice) || 0,
                    currency: 'TRY',
                    subtitle: newDesc.trim() || undefined,
                    status: 'active'
                }]);

                if (error) throw error;
            }

            showToast('Ürün başarıyla mağazanıza eklendi! 🎉', 'success');
            setNewTitle('');
            setNewDesc('');
            setNewPrice('249');
            setAddOpen(false);
            if (refreshData) refreshData();
        } catch (err: any) {
            console.error('Error creating product:', err);
            showToast(err.message || 'Ürün eklenirken bir hata oluştu.', 'error');
        } finally {
            setIsCreatingProduct(false);
        }
    };

    if (contextLoading) {
        return (
            <div className="flex min-h-screen bg-white items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-6">
                    <SetyLogo size="lg" className="animate-pulse" />
                    <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="absolute inset-y-0 bg-[#5500ff] rounded-full animate-pulse w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (profile && profile.onboarding_completed === false) {
        return <OnboardingScreen profile={profile} refreshData={refreshData} />;
    }

    // User initials & display name
    const displayName = profile?.full_name || store?.display_name || user?.user_metadata?.full_name || 'Emirhan Arslan';
    const userEmail = profile?.email || user?.email || 'emirhan@sety.store';
    const initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p: string) => p[0].toUpperCase())
        .join('') || 'EA';

    return (
        <div className="sety-shell">
            {/* ═══ SIDEBAR ═══ */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div className="brand">
                    <span className="brand-mark">
                        <Zap size={23} fill="currentColor" />
                    </span>
                    <span>sety</span>
                    <span className="beta">BETA</span>
                </div>

                {/* Store Link Chip */}
                <div className="store-link">
                    <span className="live-dot" />
                    <span className="store-link-text">{storeUrl}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-auto text-slate-400 hover:text-slate-900"
                        title="Mağaza linkini kopyala"
                        onClick={copyLink}
                    >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="nav">
                    <div className="nav-label">Çalışma alanı</div>
                    {navigation.map((n) => {
                        const isActive = n.to === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(n.to);
                        return (
                            <Link
                                key={n.to}
                                href={n.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <n.icon />
                                <span>{n.label}</span>
                                {n.label === 'Siparişler' && orderCount > 0 && (
                                    <span className="nav-count">{orderCount}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom (Founder Plan + Account) */}
                <div className="sidebar-bottom">
                    <div className="plan">
                        <div className="plan-title">
                            <span>Founder Planı</span>
                            <span className="text-[#5500FF]">9 / 14 gün</span>
                        </div>
                        <div className="plan-track">
                            <span style={{ width: '68%' }} />
                        </div>
                        <p>
                            Hayallerin için daha fazla alan.<br />
                            Satışlarından komisyon alınmaz.
                        </p>
                        <Link href="/dashboard/settings">
                            Planı keşfet <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <Link href="/dashboard/settings" className="account">
                        <div className="avatar">
                            {profile?.profile_image_url ? (
                                <img
                                    src={profile.profile_image_url}
                                    alt=""
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                        <div>
                            <strong>{displayName}</strong>
                            <p>{userEmail}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-7 w-7 text-slate-400"
                            title="Hesap ayarları"
                        >
                            <ChevronsUpDown size={14} />
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Backdrop for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ═══ MAIN & TOPBAR ═══ */}
            <main className="main">
                <header className="topbar">
                    <div className="flex items-center gap-3">
                        <Button
                            className="menu-mobile"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Menüyü aç"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                        <div className="breadcrumb">
                            Panel <ChevronRight size={12} />
                            <span>{activeLabel}</span>
                        </div>
                    </div>

                    <div className="top-actions">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="notification text-slate-500 hover:text-slate-900"
                            title="Bildirimler"
                            onClick={() => showToast('Yeni bildiriminiz bulunmuyor.', 'info')}
                        >
                            <Bell size={18} />
                        </Button>

                        <span className="h-5 border-l border-slate-200" />

                        <Button variant="outline" className="view-store text-xs" asChild>
                            <a
                                href={`https://${storeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink size={13} className="mr-1.5" />
                                Mağazayı Gör
                            </a>
                        </Button>

                        <Button
                            onClick={() => setAddOpen(true)}
                            className="text-xs bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold rounded-xl"
                        >
                            <Plus size={14} className="mr-1.5" />
                            Ürün Ekle
                        </Button>
                    </div>
                </header>

                <div className="content">
                    {children}

                    <footer className="footer-note">
                        <span>© 2026 Sety · Üret, paylaş, kazan.</span>
                        <span className="flex items-center gap-2">
                            <span className="live-dot" />
                            Tüm sistemler çalışıyor <span className="ml-2">· Canlı veriler</span>
                        </span>
                    </footer>
                </div>
            </main>

            {/* ═══ MODAL: Yeni Ürün Ekle ═══ */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Yeni Ürün Ekle
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Mağazana yeni bir dijital ürün veya danışmanlık hizmeti ekle.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateProduct} className="flex flex-col gap-4 mt-2">
                        <label className="field">
                            ÜRÜN ADI
                            <input
                                placeholder="Örn: 1:1 Strateji Görüşmesi veya E-Kitap"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                            />
                        </label>

                        <div className="fields mb-0">
                            <label className="field">
                                ÜRÜN TİPİ
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                >
                                    <option value="digital_product">Dijital İndirme</option>
                                    <option value="coaching_call">Koçluk & Danışmanlık</option>
                                    <option value="external_link">Direkt Link</option>
                                </select>
                            </label>

                            <label className="field">
                                FİYAT (₺)
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="249"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <label className="field">
                            AÇIKLAMA
                            <textarea
                                placeholder="Ürün açıklaması veya seans detayları..."
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                            />
                        </label>

                        <Button
                            type="submit"
                            disabled={isCreatingProduct}
                            className="h-11 bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold rounded-xl mt-2 flex items-center justify-center gap-2"
                        >
                            {isCreatingProduct ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus size={16} />
                            )}
                            <span>Ürün Ekle</span>
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardProvider>
    );
}
