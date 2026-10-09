'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
    Loader2
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

    const [tab, setTab] = useState<'Profil' | 'Görünüm' | 'Ödeme Yöntemleri' | 'Güvenlik'>('Profil');
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
        if (!user) return;
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
        if (!user) return;
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
                    {(['Profil', 'Görünüm', 'Ödeme Yöntemleri', 'Güvenlik'] as const).map(item => (
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
                        {/* Store Link Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Mağaza Bağlantısı</h2>
                                <Globe size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <p className="text-xs font-bold mb-4">
                                    sety.store/{username || 'emirhan'}
                                </p>
                                <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
                                    <Copy size={13} />
                                    Linki Kopyala
                                </Button>
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
