'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Wallet,
    Eye,
    ShoppingBag,
    MousePointerClick,
    TrendingUp,
    CalendarDays,
    ChevronDown,
    ArrowUpRight,
    MoreHorizontal,
    BookOpen,
    Target,
    Film,
    Video,
    Package
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';

// ─── Stat Card Component (Exact beautiful-page-design) ───
function Stat({
    label,
    value,
    change,
    icon: Icon,
    color = '',
    index = 0
}: {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color?: string;
    index?: number;
}) {
    return (
        <div className="stat">
            <div className="stat-top">
                <span>{label}</span>
                <span className={`stat-icon ${color}`}>
                    <Icon size={15} />
                </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-bottom">
                <span className="trend">
                    <TrendingUp size={11} />
                    {change}
                </span>
                <span>geçen aya göre</span>
            </div>
            <svg viewBox="0 0 70 35" className="sparkline" aria-hidden="true">
                <polyline
                    points={
                        index % 2
                            ? '1,30 12,24 23,28 34,12 46,18 57,8 69,2'
                            : '1,30 12,20 23,25 34,10 46,16 57,5 69,1'
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

// ─── Fallback Showcase Data (If store is new / has 0 items) ───
const SAMPLE_PRODUCTS = [
    {
        id: 'sample-1',
        title: 'Instagram Büyüme Rehberi',
        subtitle: '64 sayfalık PDF e-kitap',
        type: 'digital_product',
        typeLabel: 'Dijital İndirme',
        price: 249,
        currency: 'TRY',
        icon: BookOpen,
        color: '',
        status: 'active'
    },
    {
        id: 'sample-2',
        title: '1:1 Strateji Görüşmesi',
        subtitle: '45 dk birebir koçluk',
        type: 'coaching_call',
        typeLabel: 'Koçluk',
        price: 1490,
        currency: 'TRY',
        icon: Target,
        color: 'green',
        status: 'active'
    },
    {
        id: 'sample-3',
        title: 'Reels Şablon Paketi',
        subtitle: '30 adet Canva şablonu',
        type: 'digital_product',
        typeLabel: 'Dijital İndirme',
        price: 399,
        currency: 'TRY',
        icon: Film,
        color: 'orange',
        status: 'active'
    },
    {
        id: 'sample-4',
        title: 'YouTube Kanalım',
        subtitle: 'Haftalık yeni videolar',
        type: 'external_link',
        typeLabel: 'Link',
        price: 0,
        currency: 'TRY',
        icon: Video,
        color: '',
        status: 'hidden'
    },
];

const SAMPLE_ORDERS = [
    {
        id: '#SY-1042',
        name: 'Zeynep Kaya',
        initials: 'ZK',
        product: 'Instagram Büyüme Rehberi',
        price: '₺249',
        status: 'Ödendi'
    },
    {
        id: '#SY-1041',
        name: 'Mert Demir',
        initials: 'MD',
        product: '1:1 Strateji Görüşmesi',
        price: '₺1.490',
        status: 'Bekliyor'
    },
    {
        id: '#SY-1040',
        name: 'Elif Yıldız',
        initials: 'EY',
        product: 'Reels Şablon Paketi',
        price: '₺399',
        status: 'Ödendi'
    },
    {
        id: '#SY-1039',
        name: 'Can Aydın',
        initials: 'CA',
        product: 'Instagram Büyüme Rehberi',
        price: '₺249',
        status: 'Ödendi'
    },
    {
        id: '#SY-1038',
        name: 'Deniz Aksoy',
        initials: 'DA',
        product: '1:1 Strateji Görüşmesi',
        price: '₺1.490',
        status: 'Bekliyor'
    },
];

export default function DashboardOverviewPage() {
    const { profile, store, user, loading: contextLoading } = useDashboard();
    const { showToast } = useToast();

    const [stats, setStats] = useState<any>(null);
    const [dbProducts, setDbProducts] = useState<any[]>([]);
    const [dbOrders, setDbOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dynamic Turkish Date
    const todayFormatted = useMemo(() => {
        const d = new Date();
        return d.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).toUpperCase();
    }, []);

    // Fetch real stats, products, orders from Supabase
    useEffect(() => {
        if (!store?.id) {
            if (!contextLoading) setLoading(false);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                const [statsRes, productsRes, ordersRes] = await Promise.all([
                    fetch('/api/dashboard/stats').then(r => r.json()).catch(() => null),
                    supabase
                        .from('products')
                        .select('*')
                        .eq('store_id', store.id)
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('orders')
                        .select('*')
                        .eq('store_id', store.id)
                        .order('created_at', { ascending: false })
                        .limit(5)
                ]);

                if (statsRes) setStats(statsRes);
                if (productsRes?.data) setDbProducts(productsRes.data);
                if (ordersRes?.data) setDbOrders(ordersRes.data);
            } catch (err) {
                console.error('Error loading overview data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [store?.id, contextLoading]);

    // First name extraction
    const fullName = profile?.full_name || store?.display_name || user?.user_metadata?.full_name || 'Emirhan';
    const firstName = fullName.split(' ')[0] || 'Emirhan';

    // Combine or fallback products
    const displayProducts = dbProducts.length > 0 ? dbProducts.map((p, i) => {
        let IconComp: any = Package;
        let color = '';
        if (p.type === 'coaching_call' || p.type === 'danışmanlık') {
            IconComp = Target;
            color = 'green';
        } else if (p.type === 'digital_product' || p.type === 'collect_emails') {
            IconComp = i % 2 === 0 ? BookOpen : Film;
            color = i % 2 === 0 ? '' : 'orange';
        } else if (p.type === 'external_link') {
            IconComp = Video;
        }

        const typeLabel = p.type === 'coaching_call' ? 'Koçluk' :
            p.type === 'external_link' ? 'Link' :
            p.type === 'collect_emails' ? 'E-posta' : 'Dijital İndirme';

        return {
            id: p.id,
            title: p.title,
            subtitle: p.subtitle || p.description || 'Hazır dijital ürün',
            type: p.type,
            typeLabel,
            price: p.price,
            currency: p.currency || 'TRY',
            icon: IconComp,
            color,
            status: p.status || 'active'
        };
    }) : SAMPLE_PRODUCTS;

    // Combine or fallback orders
    const displayOrders = dbOrders.length > 0 ? dbOrders.map(o => {
        const initials = (o.customer_name || 'Müşteri')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p: string) => p[0].toUpperCase())
            .join('') || 'M';

        return {
            id: o.order_number || `#SY-${o.id.slice(0, 4)}`,
            name: o.customer_name || 'Müşteri',
            initials,
            product: o.notes ? (JSON.parse(o.notes)?.session_type ? 'Danışmanlık Seansı' : 'Dijital Ürün') : 'Dijital Ürün',
            price: `₺${o.amount || 0}`,
            status: o.status === 'paid' || o.status === 'completed' ? 'Ödendi' : 'Bekliyor'
        };
    }) : SAMPLE_ORDERS;

    // Toggle product visibility
    const handleToggleStatus = async (product: any) => {
        const newStatus = product.status === 'active' ? 'hidden' : 'active';

        // If local sample
        if (product.id.startsWith('sample-')) {
            showToast(`${product.title} durumu "${newStatus === 'active' ? 'Yayında' : 'Taslak'}" olarak güncellendi.`, 'info');
            return;
        }

        // If real DB product
        try {
            setDbProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
            const { error } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', product.id);

            if (error) throw error;
            showToast(`${product.title} "${newStatus === 'active' ? 'Yayında' : 'Taslak'}" yapıldı.`, 'success');
        } catch (err: any) {
            console.error('Toggle status error:', err);
            showToast('Ürün durumu güncellenemedi.', 'error');
        }
    };

    // Calculate real stats or fallback
    const totalRevText = stats?.totalRevenue ? `₺${stats.totalRevenue.toLocaleString('tr-TR')}` : '₺48.320';
    const totalViewsText = stats?.totalViews ? stats.totalViews.toLocaleString('tr-TR') : '12.847';
    const totalSalesText = stats?.totalSales ? String(stats.totalSales) : '214';
    const convRateText = stats?.conversionRate ? `%${stats.conversionRate}` : '%4,8';

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <p className="eyebrow">{todayFormatted}</p>
                    <h1>Tekrar hoş geldin, {firstName}</h1>
                    <p className="subtitle">
                        Mağazanda her şey yolunda. İşte bugün öne çıkanlar.
                    </p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        className="date-control flex items-center gap-1.5"
                        onClick={() => showToast('Görüntülenen dönem: 1–30 Ekim 2026', 'info')}
                    >
                        <CalendarDays size={14} />
                        <span>Bu ay</span>
                        <ChevronDown size={13} />
                    </Button>
                </div>
            </div>

            {/* ═══ STATS GRID ═══ */}
            <div className="stats">
                <Stat
                    label="Toplam Gelir"
                    value={totalRevText}
                    change="+18,2%"
                    icon={Wallet}
                    index={0}
                />
                <Stat
                    label="Mağaza Görüntülenme"
                    value={totalViewsText}
                    change="+9,4%"
                    icon={Eye}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Toplam Satış"
                    value={totalSalesText}
                    change="+12,1%"
                    icon={ShoppingBag}
                    color="orange"
                    index={0}
                />
                <Stat
                    label="Dönüşüm Oranı"
                    value={convRateText}
                    change="+0,6%"
                    icon={MousePointerClick}
                    index={1}
                />
            </div>

            {/* ═══ PANEL: ÜRÜNLERİM ═══ */}
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Ürünlerim</h2>
                        <p className="panel-description">
                            Fikirlerin, ürünlerin ve sunduğun her şey.
                        </p>
                    </div>
                    <div className="panel-actions">
                        <span className="text-[10px] text-muted-foreground">
                            {displayProducts.length} ürün
                        </span>
                        <Link href="/dashboard/store" className="quiet-link">
                            Tümünü gör <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Ürün adı</th>
                                <th>Ürün tipi</th>
                                <th>Fiyat</th>
                                <th>Durum</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {displayProducts.map((p) => {
                                const IconComp = p.icon;
                                const isOnline = p.status === 'active';
                                const formattedPrice = p.price === 0 ? 'Ücretsiz' : `₺${p.price.toLocaleString('tr-TR')}`;

                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="product">
                                                <div className={`product-icon ${p.color}`}>
                                                    <IconComp size={21} />
                                                </div>
                                                <div>
                                                    <strong>{p.title}</strong>
                                                    <p>{p.subtitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge">{p.typeLabel}</span>
                                        </td>
                                        <td>
                                            <span className="badge purple">{formattedPrice}</span>
                                        </td>
                                        <td>
                                            <div className="row-actions">
                                                <span
                                                    onClick={() => handleToggleStatus(p)}
                                                    className={`toggle ${isOnline ? '' : 'off'}`}
                                                    role="switch"
                                                    aria-checked={isOnline}
                                                    title={isOnline ? 'Yayında (Tıkla ve Gizle)' : 'Taslak (Tıkla ve Yayınla)'}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-slate-900"
                                                title="Ürün detayları"
                                                onClick={() =>
                                                    showToast(`${p.title} · ${formattedPrice}`, 'info')
                                                }
                                            >
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ═══ OVERVIEW BOTTOM (2-COL) ═══ */}
            <div className="overview-bottom">
                {/* Son Siparişler */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>Son Siparişler</h2>
                        <Link href="/dashboard/orders" className="quiet-link">
                            Tümünü gör <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sipariş</th>
                                    <th>Müşteri</th>
                                    <th>Ürün</th>
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayOrders.slice(0, 3).map((o) => (
                                    <tr key={o.id}>
                                        <td className="text-muted-foreground font-mono">{o.id}</td>
                                        <td>
                                            <div className="product">
                                                <div className="avatar h-7 w-7 text-[10px]">
                                                    {o.initials}
                                                </div>
                                                <strong>{o.name}</strong>
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground">{o.product}</td>
                                        <td className="price">{o.price}</td>
                                        <td>
                                            <span className={`badge ${o.status === 'Ödendi' ? 'green' : 'orange'}`}>
                                                {o.status === 'Ödendi' && <span className="live-dot" />}
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Son Hareketler */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>Son Hareketler</h2>
                        <span className="badge green">Bugün</span>
                    </div>

                    <div className="activity">
                        <div className="activity-item">
                            <span className="activity-icon">
                                <ShoppingBag size={15} />
                            </span>
                            <div>
                                <p>Yeni bir satış yaptın!</p>
                                <small>Zeynep Kaya · Instagram Büyüme Rehberi</small>
                                <small>12 dakika önce</small>
                            </div>
                        </div>

                        <div className="activity-item">
                            <span className="activity-icon text-[#5500FF] bg-[#5500FF]/10">
                                <CalendarDays size={15} />
                            </span>
                            <div>
                                <p>Yeni bir görüşme talebi</p>
                                <small>Mert Demir · 1:1 Strateji Görüşmesi</small>
                                <small>1 saat önce</small>
                            </div>
                        </div>

                        <div className="activity-item">
                            <span className="activity-icon">
                                <TrendingUp size={15} />
                            </span>
                            <div>
                                <p>Bu ay hedeflerini geride bıraktın</p>
                                <small>Harika gidiyorsun, böyle devam!</small>
                                <small>2 saat önce</small>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
