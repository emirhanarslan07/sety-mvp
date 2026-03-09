'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Lock,
    CreditCard,
    Camera,
    Shield,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Zap,
    Bell,
    Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import PaymentSettings from '@/components/dashboard/PaymentSettings';

export default function SettingsPage() {
    const router = useRouter();
    const { lang } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<'account' | 'security' | 'plan' | 'payments'>('account');
    const [imageUploading, setImageUploading] = useState(false);
    const [paymentConfig, setPaymentConfig] = useState<any>(null);

    // Form States
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Feedback States
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameSuccess, setUsernameSuccess] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }

            setEmail(user.email || '');

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('full_name, profile_image_url, payment_config')
                .eq('user_id', user.id)
                .single();

            if (profile) {
                setFullName(profile.full_name || '');
                setProfileImage(profile.profile_image_url || '');
                setPaymentConfig(profile.payment_config || {});
            }

            const { data: store } = await supabase
                .from('stores')
                .select('username')
                .eq('user_id', user.id)
                .single();

            if (store) {
                setUsername(store.username || '');
            }

            setLoading(false);
        };
        loadInitialData();
    }, [router]);

    const showStatus = (type: 'success' | 'error', message: string) => {
        setStatus({ type, message });
        setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `profile-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setProfileImage(publicUrl);

            await supabase.from('user_profiles').update({
                profile_image_url: publicUrl
            }).eq('user_id', user.id);

            showStatus('success', 'Profil fotoğrafınız güncellendi.');
        } catch (err: any) {
            showStatus('error', `Hata: ${err.message}`);
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setProfileImage('');
            await supabase.from('user_profiles').update({
                profile_image_url: ''
            }).eq('user_id', user.id);

            showStatus('success', 'Profil fotoğrafı başarıyla kaldırıldı.');
        } catch (err: any) {
            showStatus('error', 'Fotoğraf kaldırılırken bir hata oluştu.');
        }
    };

    // Debounced username check
    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setUsernameError('');
                setUsernameSuccess(false);
                return;
            }

            setIsCheckingUsername(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const { data } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('username', username)
                    .neq('user_id', user?.id)
                    .maybeSingle();

                if (data) {
                    setUsernameError('Bu kullanıcı adı zaten alınmış.');
                    setUsernameSuccess(false);
                } else {
                    setUsernameError('');
                    setUsernameSuccess(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        const timer = setTimeout(checkUsername, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (username) {
                const { data: existingStore } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('username', username)
                    .neq('user_id', user.id)
                    .maybeSingle();

                if (existingStore) {
                    throw new Error('Bu kullanıcı adı zaten alınmış.');
                }
            }

            const { error: storeError } = await supabase
                .from('stores')
                .update({ username })
                .eq('user_id', user.id);

            if (storeError) throw storeError;

            showStatus('success', 'Profil bilgileriniz başarıyla kaydedildi.');
        } catch (err: any) {
            showStatus('error', err.message || 'Güncelleme sırasında hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword !== confirmPassword) {
            showStatus('error', 'Şifreler eşleşmiyor veya boş.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            showStatus('success', 'Şifreniz güncellendi.');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            showStatus('error', err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePayment = async (config: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('user_profiles')
                .update({ payment_config: config })
                .eq('user_id', user.id);

            if (error) throw error;
            setPaymentConfig(config);
            showStatus('success', 'Ödeme ayarlarınız başarıyla kaydedildi.');
        } catch (err: any) {
            showStatus('error', err.message || 'Ödeme ayarları kaydedilirken hata oluştu.');
        }
    };

    if (loading) return null;

    return (
        <div className="max-w-[1240px] mx-auto p-4 md:p-10">
            {/* Notification Toast */}
            <AnimatePresence>
                {status.type && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className={cn(
                            "fixed top-24 right-8 z-[100] flex items-center gap-4 rounded-[24px] p-5 border shadow-2xl backdrop-blur-xl min-w-[320px]",
                            status.type === 'success'
                                ? "bg-emerald-500/90 border-emerald-400 text-white"
                                : "bg-rose-500/90 border-rose-400 text-white"
                        )}
                    >
                        <div className="flex-shrink-0 bg-white/20 p-2 rounded-xl">
                            {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-sm tracking-tight">{status.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dashboard Content */}
            <div className="pt-8 flex flex-col lg:flex-row gap-12">
                {/* Settings Sidebar */}
                <aside className="lg:w-72 space-y-2">
                    {[
                        { id: 'account', label: 'Hesap Bilgileri', icon: User },
                        { id: 'security', label: 'Güvenlik', icon: Shield },
                        { id: 'payments', label: 'Ödemeler', icon: Wallet },
                        { id: 'plan', label: 'Üyelik Planı', icon: CreditCard },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id as any)}
                            className={cn(
                                "w-full flex items-center gap-4 px-6 py-4 rounded-[20px] text-[15px] font-bold transition-all group",
                                activeSection === item.id
                                    ? "bg-black text-white shadow-xl shadow-slate-900/10"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}>
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform",
                                activeSection === item.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {item.label}
                        </button>
                    ))}
                </aside>

                <div className="flex-1 space-y-10 px-1">
                    {/* Account Section */}
                    {activeSection === 'account' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profil Bilgileri</h2>
                                    <p className="text-slate-400 font-medium italic opacity-80">Mağazanda görünecek herkese açık bilgileri güncelle.</p>
                                </div>

                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-slate-50">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-[36px] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-[#5500ff] overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                            {profileImage ? (
                                                <img src={profileImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                fullName?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || 'S'
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[36px] flex items-center justify-center pointer-events-none">
                                            <Camera className="w-8 h-8 text-white/70" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-[19px] font-black text-slate-900 tracking-tight">Profil Fotoğrafı</h3>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => document.getElementById('profile-photo-upload')?.click()}
                                                disabled={imageUploading}
                                                className="h-10 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-all active:scale-95"
                                            >
                                                {imageUploading ? 'Yükleniyor...' : 'Görüntüyü Değiştir'}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-10 px-5 rounded-xl text-rose-500 hover:bg-rose-50 font-bold text-xs transition-all active:scale-95 flex gap-2 items-center"
                                                onClick={handleRemoveImage}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Kaldır
                                            </Button>
                                        </div>
                                        <input
                                            type="file"
                                            id="profile-photo-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <PremiumInput
                                        label="Ad Soyad"
                                        placeholder="Adınız Soyadınız"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        icon={<User className="w-5 h-5" />}
                                    />
                                    <PremiumInput
                                        label="E-posta"
                                        type="email"
                                        value={email}
                                        disabled
                                        icon={<Lock className="w-5 h-5 text-slate-300" />}
                                        helperText="E-posta adresi değiştirilemez."
                                    />
                                    <div className="md:col-span-2">
                                        <PremiumInput
                                            label="Kullanıcı Adı"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                            error={usernameError}
                                            success={usernameSuccess && !isCheckingUsername}
                                            helperText={isCheckingUsername ? "Kontrol ediliyor..." : "Mağaza adresiniz: sety.store/" + (username || "kullaniciadi")}
                                            placeholder="kullaniciadi"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={saving}
                                        className="h-16 px-12 rounded-2xl bg-[#5500ff] hover:bg-[#4a00df] text-white font-black shadow-2xl shadow-indigo-200 border-none transition-all active:scale-95 flex gap-3 text-sm tracking-tight"
                                    >
                                        {saving ? 'Güncelleniyor...' : 'Profil Ayarlarını Kaydet'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Güvenlik Ayarları</h2>
                                    <p className="text-slate-400 font-medium italic opacity-80">Hesabının güvenliğini şifreni güncelleyerek sağla.</p>
                                </div>

                                <div className="space-y-8">
                                    <PremiumInput
                                        label="Yeni Şifre"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        icon={<Lock className="w-5 h-5" />}
                                    />
                                    <PremiumInput
                                        label="Yeni Şifre (Tekrar)"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        error={newPassword && confirmPassword && newPassword !== confirmPassword ? "Şifreler eşleşmiyor" : ""}
                                        icon={<Lock className="w-5 h-5" />}
                                    />
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <Button
                                        onClick={handleUpdatePassword}
                                        disabled={saving}
                                        className="h-16 px-12 rounded-2xl bg-black text-white hover:bg-slate-900 font-black shadow-2xl shadow-slate-900/10 border-none transition-all active:scale-95 flex gap-3 text-sm tracking-tight"
                                    >
                                        {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Plan Section */}
                    {activeSection === 'plan' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <Card className="border-none bg-black text-white rounded-[40px] p-10 md:p-14 space-y-12 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center shrink-0">
                                                <Zap className="w-8 h-8 text-primary" fill="currentColor" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Mevcut Planın</p>
                                                <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic">Sety Pro</h2>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-slate-400 font-bold italic opacity-80">Sonraki ödeme: {format(new Date(), 'dd MMMM yyyy', { locale: lang === 'tr' ? tr : enUS })}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-5xl font-black text-white tracking-tighter leading-none mb-2 italic">₺99<span className="text-2xl text-slate-400">/ay</span></div>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Tüm özellikler açık</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 pt-4">
                                    <Button className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-slate-100 font-black text-[15px] shadow-xl transition-all active:scale-95">
                                        Planı Yönet
                                    </Button>
                                    <Button variant="ghost" className="h-16 px-10 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 font-black text-[15px] transition-all">
                                        İptal Et
                                    </Button>
                                </div>

                                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                            </Card>

                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 md:p-12 space-y-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Fatura Geçmişi</h3>
                                <div className="text-center py-12">
                                    <p className="text-slate-400 font-bold italic opacity-60">Henüz fatura bulunmuyor.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payments Section */}
                    {activeSection === 'payments' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <PaymentSettings
                                initialConfig={paymentConfig}
                                onSave={handleUpdatePayment}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
