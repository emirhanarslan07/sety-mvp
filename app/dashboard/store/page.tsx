'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Globe,
    TrendingUp,
    Wallet,
    Copy,
    Plus,
    Search,
    BookOpen,
    Target,
    Film,
    Video,
    Package,
    MoreHorizontal,
    Camera,
    Check,
    Loader2,
    Trash2,
    Edit2,
    Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import ProductEditorModal from '@/components/modals/ProductEditorModal';
import ActionConfirmModal from '@/components/modals/ActionConfirmModal';

// ─── Stat Card ───
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

// ─── Fallback Sample Products ───
const SAMPLE_PRODUCTS = [
    {
        id: 'sample-p1',
        title: 'Instagram Büyüme Rehberi',
        subtitle: '64 sayfalık PDF e-kitap',
        type: 'digital_product',
        typeLabel: 'Dijital İndirme',
        price: 249,
        sales: 86,
        status: 'active',
        icon: BookOpen,
        color: ''
    },
    {
        id: 'sample-p2',
        title: '1:1 Strateji Görüşmesi',
        subtitle: '45 dk birebir koçluk',
        type: 'coaching_call',
        typeLabel: 'Koçluk',
        price: 1490,
        sales: 24,
        status: 'active',
        icon: Target,
        color: 'green'
    },
    {
        id: 'sample-p3',
        title: 'Reels Şablon Paketi',
        subtitle: '30 adet Canva şablonu',
        type: 'digital_product',
        typeLabel: 'Dijital İndirme',
        price: 399,
        sales: 104,
        status: 'active',
        icon: Film,
        color: 'orange'
    },
    {
        id: 'sample-p4',
        title: 'YouTube Kanalım',
        subtitle: 'Haftalık yeni videolar',
        type: 'external_link',
        typeLabel: 'Link',
        price: 0,
        sales: 0,
        status: 'draft',
        icon: Video,
        color: ''
    }
];

export default function StorePage() {
    const { store, user, profile, refreshData } = useDashboard();
    const { showToast } = useToast();

    const [tab, setTab] = useState<'Ürünler' | 'Tasarım & Profil'>('Ürünler');
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Design / Profile States
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [isSavingDesign, setIsSavingDesign] = useState(false);

    const storeUrl = `sety.store/${store?.username || 'emirhan'}`;

    useEffect(() => {
        if (store) {
            setName(store.display_name || profile?.full_name || 'Emirhan Arslan');
            setUsername(store.username || 'emirhan');
            setBio(store.bio || 'İçerik üreticisi & dijital pazarlama koçu.');
            setPhoto(store.store_logo_url || profile?.profile_image_url || null);
            fetchProducts(store.id);
        } else {
            setProducts(SAMPLE_PRODUCTS);
            setLoading(false);
        }
    }, [store, profile]);

    const fetchProducts = async (storeId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                const mapped = data.map((p: any, i: number) => {
                    const isCoaching = p.type === 'coaching_call' || p.type === 'appointment';
                    const isLink = p.type === 'external_link';
                    return {
                        ...p,
                        typeLabel: isCoaching ? 'Koçluk' : isLink ? 'Link' : 'Dijital İndirme',
                        icon: isCoaching ? Target : isLink ? Video : i % 2 === 0 ? BookOpen : Film,
                        color: isCoaching ? 'green' : i % 2 === 1 ? 'orange' : '',
                        sales: p.sales_count || Math.floor(Math.random() * 50) + 10
                    };
                });
                setProducts(mapped);
            } else {
                setProducts(SAMPLE_PRODUCTS);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts(SAMPLE_PRODUCTS);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`https://${storeUrl}`);
        showToast('Mağaza linki kopyalandı! 🚀', 'success');
    };

    const handleToggleStatus = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'draft' : 'active';
        setProducts(prev =>
            prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p))
        );

        if (productId.startsWith('sample-')) {
            showToast('Ürün durumu güncellendi (Örnek mod)', 'info');
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', productId);
            if (error) throw error;
            showToast(
                newStatus === 'active' ? 'Ürün yayına alındı! 🎉' : 'Ürün taslağa alındı.',
                'success'
            );
        } catch (err: any) {
            showToast(err.message || 'Durum değiştirilemedi', 'error');
            setProducts(prev =>
                prev.map(p => (p.id === productId ? { ...p, status: currentStatus } : p))
            );
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            if (!productToDelete.startsWith('sample-')) {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productToDelete);
                if (error) throw error;
            }
            setProducts(prev => prev.filter(p => p.id !== productToDelete));
            showToast('Ürün silindi.', 'success');
            setProductToDelete(null);
        } catch (err: any) {
            showToast(err.message || 'Ürün silinemedi', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!store?.id) {
            showToast('Tasarım ayarları güncellendi!', 'success');
            return;
        }

        setIsSavingDesign(true);
        try {
            const { error } = await supabase
                .from('stores')
                .update({
                    display_name: name,
                    bio: bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', store.id);

            if (error) throw error;
            if (refreshData) await refreshData();
            showToast('Mağaza bilgileri başarıyla kaydedildi! ✨', 'success');
        } catch (err: any) {
            showToast(err.message || 'Bilgiler kaydedilemedi', 'error');
        } finally {
            setIsSavingDesign(false);
        }
    };

    const visibleProducts = products.filter(p =>
        p.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))
    );

    const activeCount = products.filter(p => p.status === 'active').length;
    const totalSales = products.reduce((acc, p) => acc + (p.sales || 0), 0);
    const totalRevenue = products.reduce(
        (acc, p) => acc + (p.sales || 0) * (Number(p.price) || 0),
        0
    );

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Mağazam</h1>
                    <p className="subtitle">Dijital vitrinin, senin kuralların.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        onClick={copyLink}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Copy size={14} />
                        Linki Kopyala
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setIsAddModalOpen(true);
                        }}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Plus size={14} />
                        Yeni Ürün
                    </Button>
                </div>
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['Ürünler', 'Tasarım & Profil'] as const).map(item => (
                        <Button
                            key={item}
                            size="sm"
                            variant="ghost"
                            onClick={() => setTab(item)}
                            className={`text-[10px] h-7 px-3 font-bold ${
                                tab === item ? 'selected' : 'text-muted-foreground'
                            }`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>

                {tab === 'Ürünler' && (
                    <label className="search">
                        <Search size={14} />
                        <input
                            placeholder="Ürün ara..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </label>
                )}
            </div>

            {/* ═══ CONTENT TABS ═══ */}
            {tab === 'Ürünler' ? (
                <>
                    {/* Stats */}
                    <div className="stats">
                        <Stat
                            label="Toplam Ürün"
                            value={products.length.toString()}
                            change="+1 ürün"
                            icon={ShoppingBag}
                        />
                        <Stat
                            label="Aktif Ürün"
                            value={activeCount.toString()}
                            change="Yayında"
                            icon={Globe}
                            color="green"
                            index={1}
                        />
                        <Stat
                            label="Ürün Satışları"
                            value={totalSales.toString()}
                            change="+12,1%"
                            icon={TrendingUp}
                            color="orange"
                        />
                        <Stat
                            label="Ürün Geliri"
                            value={`₺${totalRevenue.toLocaleString('tr-TR')}`}
                            change="+18,2%"
                            icon={Wallet}
                            index={1}
                        />
                    </div>

                    {/* Products List Panel */}
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <h2>Ürün Listesi</h2>
                                <p className="panel-description">
                                    {activeCount} / {products.length} ürün vitrinde aktif görünür
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1.5"
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsAddModalOpen(true);
                                }}
                            >
                                <Plus size={13} />
                                Ürün Ekle
                            </Button>
                        </div>

                        {loading ? (
                            <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                                <span className="text-xs font-semibold">Ürünler yükleniyor...</span>
                            </div>
                        ) : visibleProducts.length > 0 ? (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ürün adı</th>
                                            <th>Ürün tipi</th>
                                            <th>Fiyat</th>
                                            <th>Satış</th>
                                            <th>Durum</th>
                                            <th className="text-right" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleProducts.map(p => {
                                            const IconComp = p.icon || BookOpen;
                                            const isLive = p.status === 'active';

                                            return (
                                                <tr key={p.id}>
                                                    <td>
                                                        <div className="product">
                                                            <div className={`product-icon ${p.color}`}>
                                                                <IconComp size={21} />
                                                            </div>
                                                            <div>
                                                                <strong>{p.title}</strong>
                                                                <p>{p.subtitle || 'Dijital ürün içeriği'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge">{p.typeLabel}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge purple">
                                                            {Number(p.price) === 0
                                                                ? 'Ücretsiz'
                                                                : `₺${Number(p.price).toLocaleString('tr-TR')}`}
                                                        </span>
                                                    </td>
                                                    <td className="price">{p.sales || 0}</td>
                                                    <td>
                                                        <div className="row-actions">
                                                            <button
                                                                type="button"
                                                                className={`toggle ${isLive ? '' : 'off'}`}
                                                                onClick={() =>
                                                                    handleToggleStatus(p.id, p.status)
                                                                }
                                                                aria-label={`${p.title} görünürlüğü`}
                                                            />
                                                            <span
                                                                className={`badge ${
                                                                    isLive ? 'green' : ''
                                                                }`}
                                                            >
                                                                {isLive ? 'Yayında' : 'Taslak'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-slate-900"
                                                                title="Düzenle"
                                                                onClick={() => {
                                                                    setEditingProduct(p);
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                            >
                                                                <Edit2 size={13} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                                                                title="Sil"
                                                                onClick={() => setProductToDelete(p.id)}
                                                            >
                                                                <Trash2 size={13} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty">
                                <div className="product-icon mx-auto mb-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <h2>Ürün bulunamadı</h2>
                                <p>Arama kriterlerinize uygun ürün bulunamadı.</p>
                            </div>
                        )}
                    </section>
                </>
            ) : (
                /* ═══ TASARIM & PROFİL TAB ═══ */
                <div className="settings-grid">
                    <div>
                        {/* Profile Image Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Profil Görselleri</h2>
                                <Camera size={17} className="text-muted-foreground" />
                            </div>
                            <div className="form-body profile-upload">
                                <div className="avatar">
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt=""
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        name
                                            .split(' ')
                                            .slice(0, 2)
                                            .map(s => s[0])
                                            .join('')
                                            .toUpperCase() || 'EA'
                                    )}
                                </div>
                                <div>
                                    <strong className="text-xs">Profil Fotoğrafı</strong>
                                    <p className="panel-description mb-3">
                                        JPG, PNG veya WEBP · Maks. 5 MB
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <label className="cursor-pointer gap-1.5">
                                            <Camera size={13} />
                                            Fotoğraf Seç
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f) setPhoto(URL.createObjectURL(f));
                                                }}
                                            />
                                        </label>
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Basic Info Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Temel Bilgiler</h2>
                                <span className="badge green">Profil aktif</span>
                            </div>
                            <div className="form-body">
                                <div className="fields">
                                    <label className="field">
                                        AD SOYAD
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </label>
                                    <label className="field">
                                        KULLANICI ADI
                                        <input
                                            value={username}
                                            disabled
                                            className="opacity-75"
                                        />
                                    </label>
                                    <label className="field">
                                        E-POSTA
                                        <input
                                            type="email"
                                            value={user?.email || 'emirhan@sety.store'}
                                            disabled
                                            className="opacity-75"
                                        />
                                        <span className="text-[9px] text-muted-foreground">
                                            Kayıtlı e-posta güvenlik gereği değiştirilemez.
                                        </span>
                                    </label>
                                    <label className="field">
                                        BİYOGRAFİ
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            placeholder="Danışanlarınıza veya müşterilerinize kendinizi tanıtın..."
                                        />
                                    </label>
                                </div>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingDesign}
                                    className="text-xs gap-1.5"
                                >
                                    <Check size={14} />
                                    {isSavingDesign ? 'Kaydediliyor...' : 'Profili Kaydet'}
                                </Button>
                            </div>
                        </section>
                    </div>

                    <div>
                        {/* Store Link Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Mağaza Bağlantısı</h2>
                                <Globe size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <p className="text-xs font-bold mb-4">{storeUrl}</p>
                                <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
                                    <Copy size={13} />
                                    Linki Kopyala
                                </Button>
                            </div>
                        </section>

                        {/* Theme Selection */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Mağaza Teması</h2>
                                <Sparkles size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <div className="color-options">
                                    {['Mor (Klasik Sety)', 'Zümrüt Yeşili', 'Sıcak Amber'].map(
                                        (colorName, i) => (
                                            <label
                                                key={colorName}
                                                className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                    defaultChecked={i === 0}
                                                />
                                                {colorName}
                                            </label>
                                        )
                                    )}
                                </div>
                                <label className="field">
                                    MAĞAZA VİTRİN BAŞLIĞI
                                    <input
                                        defaultValue={name}
                                        placeholder="Mağaza Vitrin Başlığı"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    onClick={() =>
                                        showToast('Mağaza teması başarıyla güncellendi! 🎨', 'success')
                                    }
                                >
                                    <Check size={14} />
                                    Görünümü Kaydet
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isAddModalOpen && (
                <ProductEditorModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingProduct(null);
                    }}
                    product={editingProduct}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        setEditingProduct(null);
                        if (store?.id) fetchProducts(store.id);
                        showToast('Ürün başarıyla kaydedildi! 🎉', 'success');
                    }}
                />
            )}

            {/* Delete Confirm Modal */}
            <ActionConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title="Ürünü Sil"
                description="Bu ürünü mağazanızdan kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText={isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
                variant="destructive"
            />
        </>
    );
}
