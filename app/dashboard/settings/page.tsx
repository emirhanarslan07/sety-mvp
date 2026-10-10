'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Camera,
    Check,
    Copy,
    Globe,
    Mail,
    Palette,
    ShieldCheck,
    CreditCard,
    Loader2,
    ArrowUpRight,
    Zap,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';

function SettingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { store, user, profile, refreshData } = useDashboard();
    const { showToast } = useToast();

    const [tab, setTab] = useState<'Profil' | 'Görünüm' | 'Ödeme Yöntemleri' | 'Abonelik' | 'Güvenlik'>('Profil');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile state
    const [name, setName] = useState('Emirhan Arslan');
    const [username, setUsername] = useState('emirhan');
    const [email, setEmail] = useState('emirhan@sety.store');
    const [bio, setBio] = useState('İçerik üreticisi & dijital pazarlama koçu.');
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [notif, setNotif] = useState(true);

    // Appearance state
    const [selectedTheme, setSelectedTheme] = useState('Mor');
    const [storeTitle, setStoreTitle] = useState('Emirhan Arslan');

    // Payment state
    const [iban, setIban] = useState('TR00 0000 0000 0000 0000 00');

    // Security state
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (profile || store) {
            setName(profile?.full_name || store?.display_name || 'Emirhan Arslan');
            setUsername(store?.username || 'emirhan');
            setEmail(profile?.email || user?.email || 'emirhan@sety.store');
            setBio(store?.bio || 'İçerik üreticisi & dijital pazarlama koçu.');
            setPhoto(profile?.profile_image_url || store?.store_logo_url || null);
            setStoreTitle(store?.display_name || profile?.full_name || 'Emirhan Arslan');
            if (profile?.payment_url) {
                setIban(profile.payment_url);
            }
        }
    }, [profile, store, user]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setPhotoUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `profile-images/${user.id}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl }
            } = supabase.storage.from('products').getPublicUrl(filePath);

            setPhoto(publicUrl);
            await supabase
                .from('user_profiles')
                .update({ profile_image_url: publicUrl })
                .eq('user_id', user.id);
            await supabase
                .from('stores')
                .update({ store_logo_url: publicUrl })
                .eq('user_id', user.id);

            if (refreshData) await refreshData();
            showToast('Profil fotoğrafı güncellendi! 📸', 'success');
        } catch (err: any) {
            console.error('Photo upload error:', err);
            showToast('Fotoğraf yüklenirken bir hata oluştu.', 'error');
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) {
            showToast('Profil bilgileri kaydedildi! ✨ (Önizleme modu)', 'success');
            return;
        }
        setSaving(true);
        try {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ full_name: name })
                .eq('user_id', user.id);
            if (profileError) throw profileError;

            if (store?.id) {
                const { error: storeError } = await supabase
                    .from('stores')
                    .update({
                        display_name: name,
                        bio
                    })
                    .eq('id', store.id);
                if (storeError) throw storeError;
            }

            if (refreshData) await refreshData();
            showToast('Profil bilgileri başarıyla kaydedildi! ✨', 'success');
        } catch (err: any) {
            console.error('Save profile error:', err);
            showToast(err.message || 'Profil kaydedilemedi.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePayment = async () => {
        if (!user) {
            showToast('Ödeme ve banka bilgileri başarıyla kaydedildi! 💳', 'success');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ payment_url: iban })
                .eq('user_id', user.id);
            if (error) throw error;
            showToast('Ödeme bilgileri başarıyla kaydedildi! 💳', 'success');
        } catch (err: any) {
            showToast(err.message || 'Ödeme bilgileri kaydedilemedi.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            showToast('Şifre en az 6 karakter olmalıdır.', 'error');
            return;
        }
        if (!user) {
            showToast('Şifreniz başarıyla güncellendi! 🔒 (Önizleme modu)', 'success');
            setNewPassword('');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            showToast('Şifreniz başarıyla güncellendi! 🔒', 'success');
            setNewPassword('');
        } catch (err: any) {
            showToast(err.message || 'Şifre güncellenemedi.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`https://sety.store/${username}`);
        showToast('Mağaza bağlantısı kopyalandı! 🚀', 'success');
    };

    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(s => s[0].toUpperCase())
        .join('') || 'EA';

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Hesap ve Mağaza Ayarları</h1>
                    <p className="subtitle">Mağazana kendi imzanı at.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        onClick={() => {
                            if (tab === 'Profil') handleSaveProfile();
                            else if (tab === 'Ödeme Yöntemleri') handleSavePayment();
                            else if (tab === 'Güvenlik') handleUpdatePassword();
                            else showToast('Değişiklikler kaydedildi! ✨', 'success');
                        }}
                        disabled={saving}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Check size={14} />
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                </div>
            </div>

            {/* ═══ TOOLBAR TABS ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['Profil', 'Görünüm', 'Ödeme Yöntemleri', 'Abonelik', 'Güvenlik'] as const).map(item => (
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
            </div>

            {/* ═══ TAB CONTENT ═══ */}
            {tab === 'Profil' ? (
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
                                        initials
                                    )}
                                </div>
                                <div>
                                    <strong className="text-xs">Profil Fotoğrafı</strong>
                                    <p className="panel-description mb-3">
                                        JPG, PNG veya WEBP · Maks. 5 MB
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <label className="cursor-pointer gap-1.5">
                                            {photoUploading ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Camera size={13} />
                                            )}
                                            {photoUploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoUpload}
                                                disabled={photoUploading}
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
                                            value={email}
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
                                            placeholder="Danışanlarınıza ve kitlenize kendinizi anlatın..."
                                        />
                                    </label>
                                </div>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="text-xs gap-1.5"
                                >
                                    <Check size={14} />
                                    {saving ? 'Kaydediliyor...' : 'Profili Kaydet'}
                                </Button>
                            </div>
                        </section>
                    </div>

                    <div>
                        {/* Store Link Sleek Banner */}
                        <section className="panel !p-4 bg-gradient-to-br from-violet-50/70 to-purple-50/40 border border-violet-100/90 rounded-2xl mb-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#5500FF] uppercase tracking-wider mb-0.5">
                                        <Globe size={12} />
                                        <span>CANLI MAĞAZAN</span>
                                    </div>
                                    <div className="text-xs font-black text-slate-900 truncate">
                                        sety.store/{username || 'emirhan'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Button variant="outline" size="sm" onClick={copyLink} className="h-7 px-2.5 text-[11px] gap-1 bg-white hover:bg-slate-50 font-bold border-slate-200 shadow-2xs">
                                        <Copy size={11} />
                                        <span>Kopyala</span>
                                    </Button>
                                    <Button size="sm" asChild className="h-7 px-2.5 text-[11px] bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold shadow-2xs">
                                        <a href={`https://sety.store/${username || 'emirhan'}`} target="_blank" rel="noopener noreferrer">
                                            <span>Vitrine Git</span>
                                            <ArrowUpRight size={11} className="ml-0.5" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Notification Preferences */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Bildirim Tercihleri</h2>
                                <Mail size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-xs">Sipariş bildirimleri</strong>
                                        <p>Yeni satışlarından ve randevu taleplerinden haberdar ol.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`toggle ${notif ? '' : 'off'}`}
                                        onClick={() => setNotif(!notif)}
                                        aria-label="Sipariş bildirimleri"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-xs">Haftalık özet</strong>
                                        <p>Mağazan için haftalık büyüme raporu.</p>
                                    </div>
                                    <span className="badge green">Aktif</span>
                                </div>
                            </div>
                        </section>

                        {/* Security Info Card */}
                        <section className="panel">
                            <div className="form-body">
                                <ShieldCheck className="text-[#10B981] mb-3" size={26} />
                                <h2>Hesabın güvende</h2>
                                <p className="subtitle text-xs">
                                    Hesap şifreni ve oturum güvenliğini Güvenlik sekmesinden dilediğin zaman güncelleyebilirsin.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                /* ═══ OTHER TABS (Görünüm, Ödeme Yöntemleri, Güvenlik) ═══ */
                <section className="panel">
                    <div className="panel-header">
                        <h2>{tab}</h2>
                        {tab === 'Görünüm' ? (
                            <Palette className="text-[#5500FF]" size={17} />
                        ) : tab === 'Abonelik' ? (
                            <Zap className="text-[#5500FF]" size={17} fill="#C4FF00" />
                        ) : tab === 'Güvenlik' ? (
                            <ShieldCheck className="text-[#5500FF]" size={17} />
                        ) : (
                            <CreditCard className="text-[#5500FF]" size={17} />
                        )}
                    </div>

                    <div className="form-body max-w-2xl">
                        {tab === 'Görünüm' ? (
                            <>
                                <h2>Mağaza Teması</h2>
                                <div className="color-options">
                                    {['Mor (Klasik Sety)', 'Yeşil (Doğal)', 'Turuncu (Sıcak)'].map(
                                        (themeName, i) => (
                                            <label
                                                key={themeName}
                                                className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                    defaultChecked={i === 0}
                                                    onChange={() => setSelectedTheme(themeName)}
                                                />
                                                {themeName}
                                            </label>
                                        )
                                    )}
                                </div>
                                <label className="field">
                                    MAĞAZA BAŞLIĞI
                                    <input
                                        value={storeTitle}
                                        onChange={e => setStoreTitle(e.target.value)}
                                        placeholder="Mağaza Vitrin Başlığı"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    onClick={() =>
                                        showToast('Görünüm tercihleri başarıyla kaydedildi! 🎨', 'success')
                                    }
                                >
                                    <Check size={14} />
                                    Görünümü Kaydet
                                </Button>
                            </>
                        ) : tab === 'Ödeme Yöntemleri' ? (
                            <>
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-sm">Banka Havalesi / FAST</strong>
                                        <p>Satış ve seans ödemelerini doğrudan banka hesabına al.</p>
                                    </div>
                                    <span className="badge green">Aktif</span>
                                </div>
                                <div className="setting-row mt-3">
                                    <div>
                                        <strong className="text-sm">Shopier / Kart Altyapısı</strong>
                                        <p>Kredi ve banka kartı ile güvenli tahsilat (%0 lansman komisyonu).</p>
                                    </div>
                                    <span className="badge green">Aktif</span>
                                </div>
                                <label className="field mt-5">
                                    IBAN VEYA SHOPİER ÖDEME LİNKİ
                                    <input
                                        value={iban}
                                        onChange={e => setIban(e.target.value)}
                                        placeholder="TR00 0000 0000 0000 0000 00 veya https://shopier.com/..."
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    disabled={saving}
                                    onClick={handleSavePayment}
                                >
                                    <Check size={14} />
                                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                                </Button>
                            </>
                        ) : tab === 'Abonelik' ? (
                            <>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#5500FF]/5 via-purple-50/50 to-transparent border border-purple-100">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5500FF] text-white text-[10px] font-black uppercase tracking-wider mb-2">
                                                <Zap size={11} fill="#C4FF00" stroke="#C4FF00" />
                                                FOUNDER PLAN
                                            </span>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                Lansman Özel · %0 Komisyon
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                Lansman süresince tüm Sety Pro özellikleri ve %0 komisyon avantajı hesabınıza tanımlıdır.
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-slate-900">₺0</span>
                                            <span className="text-xs text-slate-400 font-bold"> / ömür boyu</span>
                                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Aktif Abonelik</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 pt-5 border-t border-purple-100/70 text-xs text-slate-700">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> Sınırsız dijital ürün satışı
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> 1:1 Seans & takvim entegrasyonu
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> Özel sety.store/{username || 'emirhan'} linki
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> E-posta toplama & müşteri listesi
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-4">
                                    <p className="text-xs text-slate-500">
                                        Polar & Shopier faturalandırma geçmişinizi görmek için fatura sayfasına geçin.
                                    </p>
                                    <Button variant="outline" size="sm" asChild className="text-xs gap-1.5 shrink-0">
                                        <Link href="/dashboard/billing">
                                            <span>Faturaları İncele</span>
                                            <ArrowUpRight size={13} />
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="field">
                                    YENİ ŞİFRE
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="En az 6 karakter"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    disabled={saving}
                                    onClick={handleUpdatePassword}
                                >
                                    <ShieldCheck size={14} />
                                    {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                </Button>
                            </>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}

export default function SettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="p-12 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                </div>
            }
        >
            <SettingsContent />
        </Suspense>
    );
}
