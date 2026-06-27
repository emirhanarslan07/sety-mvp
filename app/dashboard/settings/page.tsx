'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    User,
    Lock,
    CreditCard,
    Shield,
    Wallet,
    Copy,
    Check,
    Smartphone,
    Loader2,
    Camera,
    ImageIcon,
    Instagram,
    Youtube,
    Twitter,
    Video as TiktokIcon,
    Zap,
    Trash2,
    CheckCircle2,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import PaymentSettings from '@/components/dashboard/PaymentSettings';
import { useToast } from '@/context/ToastContext';
import BillingSettings from '@/components/dashboard/settings/BillingSettings';
import Image from 'next/image';

type TabType = 'profile' | 'payments' | 'billing' | 'security';

function SettingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>(
        (searchParams.get('tab') as TabType) || 'profile'
    );

    // Profile state
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [bio, setBio] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [coverUploading, setCoverUploading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState('');

    // Social links
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
    });

    // Username check
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameSuccess, setUsernameSuccess] = useState(false);

    // Password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    // Store link copy
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            setEmail(user.email || '');

            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (profileData) {
                setFullName(profileData.full_name || '');
                setProfileImage(profileData.profile_image_url || '');
                setPaymentUrl(profileData.payment_url || '');
            }

            const { data: storeData } = await supabase
                .from('stores')
                .select('username, bio, store_logo_url, cover_image_url, is_verified, social_links')
                .eq('user_id', user.id)
                .single();

            if (storeData) {
                setUsername(storeData.username || '');
                setBio(storeData.bio || '');
                setCoverImage(storeData.cover_image_url || '');
                setIsVerified(storeData.is_verified || false);
                setSocialLinks(storeData.social_links || {
                    instagram: '', twitter: '', youtube: '', tiktok: ''
                });
                if (storeData.store_logo_url) setProfileImage(storeData.store_logo_url);
            }

            setLoading(false);
        };
        load();
    }, []);

    // Update URL tab param
    useEffect(() => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set('tab', activeTab);
        router.push(`?${params.toString()}`, { scroll: false });
    }, [activeTab]);

    // Username availability check
    useEffect(() => {
        if (!username || username.length < 3) {
            setUsernameError('');
            setUsernameSuccess(false);
            return;
        }
        const timer = setTimeout(async () => {
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
            } finally {
                setIsCheckingUsername(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');
            const fileExt = file.name.split('.').pop();
            const filePath = `profile-images/${user.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
            setProfileImage(publicUrl);
            await supabase.from('user_profiles').update({ profile_image_url: publicUrl }).eq('user_id', user.id);
            await supabase.from('stores').update({ store_logo_url: publicUrl }).eq('user_id', user.id);
            showToast('Profil fotoğrafınız güncellendi.', 'success');
        } catch (err: any) {
            showToast(`Hata: ${err.message}`, 'error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/store-assets/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
            setCoverImage(publicUrl);
            await supabase.from('stores').update({ cover_image_url: publicUrl }).eq('user_id', user.id);
            showToast('Kapak görseli güncellendi.', 'success');
        } catch (err: any) {
            showToast(`Hata: ${err.message}`, 'error');
        } finally {
            setCoverUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving('profile');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (username && usernameSuccess) {
                const { error } = await supabase.from('stores').update({ username }).eq('user_id', user.id);
                if (error) throw error;
            }

            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ full_name: fullName })
                .eq('user_id', user.id);
            if (profileError) throw profileError;

            const { error: storeError } = await supabase
                .from('stores')
                .update({ bio, is_verified: isVerified })
                .eq('user_id', user.id);
            if (storeError) throw storeError;

            showToast('Profil bilgileriniz kaydedildi. ✅', 'success');
        } catch (err: any) {
            showToast(err.message || 'Kayıt sırasında hata oluştu.', 'error');
        } finally {
            setSaving(null);
        }
    };

    const handleSaveSocials = async () => {
        setSaving('socials');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase
                .from('stores')
                .update({ social_links: socialLinks })
                .eq('user_id', user.id);
            if (error) throw error;
            showToast('Sosyal medya linkleri kaydedildi. ✅', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword !== confirmPassword) {
            showToast('Şifreler eşleşmiyor veya boş.', 'error');
            return;
        }
        setSaving('password');
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            showToast('Şifreniz güncellendi. ✅', 'success');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
        }
    };

    const handleUpdatePayment = async (newUrl: string) => {
        setSaving('payments');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase
                .from('user_profiles')
                .update({ payment_url: newUrl })
                .eq('user_id', user.id);
            if (error) throw error;
            setPaymentUrl(newUrl);
            showToast('Ödeme bağlantınız kaydedildi. ✅', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
        }
    };

    const copyStoreLink = () => {
        navigator.clipboard.writeText(`https://sety.store/${username}`);
        setCopied(true);
        showToast('Mağaza linki kopyalandı!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-[#5500ff]" />
        </div>
    );

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'payments', label: 'Ödeme Yöntemleri', icon: Wallet },
        { id: 'security', label: 'Güvenlik', icon: Shield },
    ];

    const SectionCard = ({ children }: { children: React.ReactNode }) => (
        <Card className="rounded-[32px] border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-8 md:p-10">
                {children}
            </CardContent>
        </Card>
    );

    const SaveButton = ({ sectionKey, label = 'Kaydet' }: { sectionKey: string; label?: string }) => (
        <button
            onClick={() => {
                if (sectionKey === 'profile') handleSaveProfile();
                if (sectionKey === 'socials') handleSaveSocials();
                if (sectionKey === 'password') handleUpdatePassword();
            }}
            disabled={saving === sectionKey}
            className="h-12 px-8 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[14px] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
            {saving === sectionKey ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
            ) : (
                label
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFF] pb-32">
            <div className="max-w-[860px] mx-auto px-4 md:px-6 pt-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Hesap Ayarları</h1>
                        <p className="text-slate-400 font-bold mt-2">Profil, ödeme ve güvenlik ayarlarınızı yönetin.</p>
                    </div>
                    {username && (
                        <button
                            onClick={copyStoreLink}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-100 hover:border-[#5500ff]/30 transition-all group shrink-0"
                        >
                            <span className="text-[14px] font-bold text-[#5500ff]">sety.store/{username}</span>
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#5500ff]" />}
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-10 no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-2.5 px-5 py-3 rounded-2xl text-[14px] font-black whitespace-nowrap transition-all',
                                    isActive
                                        ? 'bg-white text-[#5500ff] shadow-md shadow-slate-200/50 border border-slate-100'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/60'
                                )}
                            >
                                <Icon className={cn('w-4 h-4', isActive ? 'text-[#5500ff]' : 'text-slate-400')} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* ── Profil Fotoğrafı + Kapak */}
                        <SectionCard>
                            <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-6">Profil Görselleri</h2>
                            <div className="space-y-6">
                                {/* Profile photo */}
                                <div className="flex items-center gap-5">
                                    <div className="relative w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                                        {profileImage ? (
                                            <Image src={profileImage} alt="Profil" fill className="object-cover" sizes="80px" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-slate-300" />
                                            </div>
                                        )}
                                        {imageUploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#5500ff]" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-[15px] mb-1">Profil Fotoğrafı</p>
                                        <p className="text-[13px] font-bold text-slate-400 mb-3">JPG, PNG veya WEBP — maks. 5MB</p>
                                        <label className="cursor-pointer h-10 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[13px] inline-flex items-center gap-2 transition-all active:scale-95">
                                            <Camera className="w-4 h-4" />
                                            {imageUploading ? 'Yükleniyor...' : profileImage ? 'Değiştir' : 'Fotoğraf Seç'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} disabled={imageUploading} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* ── Temel Bilgiler */}
                        <SectionCard>
                            <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-6">Temel Bilgiler</h2>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Full name */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">Ad Soyad</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Emirhan Arslan"
                                            className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                        />
                                    </div>

                                    {/* Username */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">Kullanıcı Adı</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                placeholder="emirhan"
                                                className={cn(
                                                    'w-full h-14 px-5 pr-10 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-[15px] text-slate-900 transition-all',
                                                    usernameError ? 'border-rose-300' : usernameSuccess ? 'border-emerald-300' : 'border-transparent focus:border-[#5500ff]/30'
                                                )}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {isCheckingUsername ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                                ) : usernameSuccess ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                ) : null}
                                            </div>
                                        </div>
                                        {usernameError && <p className="text-[12px] text-rose-500 font-bold px-1">{usernameError}</p>}
                                    </div>

                                    {/* Email — readonly */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">E-posta</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full h-14 pl-11 pr-5 bg-slate-50 rounded-2xl border-2 border-transparent outline-none font-bold text-[15px] text-slate-400 opacity-70 cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-[12px] text-slate-400 font-bold px-1">Kayıtlı e-posta değiştirilemez.</p>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">Biyografi</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Kendinizi kısaca tanıtın..."
                                            rows={2}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[14px] text-slate-900 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <SaveButton sectionKey="profile" label="Profili Kaydet" />
                            </div>
                        </SectionCard>

                        {/* ── Sosyal Medya */}
                        <SectionCard>
                            <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-2">Sosyal Medya</h2>
                            <p className="text-[14px] font-bold text-slate-400 mb-6">Mağazanızda gösterilecek sosyal medya profilleri.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/@username', color: 'text-pink-500' },
                                    { id: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: 'x.com/@username', color: 'text-slate-800' },
                                    { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/@username', color: 'text-red-500' },
                                    { id: 'tiktok', label: 'TikTok', icon: TiktokIcon, placeholder: 'tiktok.com/@username', color: 'text-slate-900' },
                                ].map((social) => (
                                    <div key={social.id} className="space-y-2">
                                        <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">{social.label}</label>
                                        <div className="relative">
                                            <social.icon className={cn('absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5', social.color)} />
                                            <input
                                                type="text"
                                                value={(socialLinks as any)[social.id] || ''}
                                                onChange={(e) => setSocialLinks({ ...socialLinks, [social.id]: e.target.value })}
                                                placeholder={social.placeholder}
                                                className="w-full h-14 pl-12 pr-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[14px] text-slate-900 transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <SaveButton sectionKey="socials" label="Linkleri Kaydet" />
                            </div>
                        </SectionCard>

                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PaymentSettings
                            paymentUrl={paymentUrl}
                            setPaymentUrl={setPaymentUrl}
                            onSave={() => handleUpdatePayment(paymentUrl)}
                            saving={saving === 'payments'}
                        />
                    </div>
                )}

                {/* BILLING TAB */}
                {activeTab === 'billing' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <BillingSettings />
                    </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Şifre Değiştir */}
                        <SectionCard>
                            <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-2">Şifre Değiştir</h2>
                            <p className="text-[14px] font-bold text-slate-400 mb-6">Hesabınızı güvende tutmak için güçlü bir şifre kullanın.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">Yeni Şifre</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-14 px-5 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                        />
                                        <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">Şifre Tekrar</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={cn(
                                                'w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 outline-none font-bold text-[15px] text-slate-900 transition-all',
                                                confirmPassword && newPassword !== confirmPassword ? 'border-rose-300' : 'border-transparent focus:border-[#5500ff]/30'
                                            )}
                                        />
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-[12px] text-rose-500 font-bold px-1">Şifreler eşleşmiyor.</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8">
                                <SaveButton sectionKey="password" label="Şifreyi Güncelle" />
                            </div>
                        </SectionCard>

                        {/* 2FA */}
                        <SectionCard>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#5500ff] shrink-0">
                                        <Smartphone className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-[17px]">İki Faktörlü Doğrulama</p>
                                        <p className="text-slate-400 font-bold text-[14px]">Hesabınıza ekstra güvenlik katmanı ekleyin.</p>
                                    </div>
                                </div>
                                <button className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-black text-[14px] hover:bg-[#5500ff] transition-all active:scale-95">
                                    Etkinleştir
                                </button>
                            </div>
                        </SectionCard>

                        {/* Danger Zone */}
                        <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100">
                            <h3 className="text-[18px] font-black text-rose-700 mb-2">Tehlikeli Bölge</h3>
                            <p className="text-rose-400 font-bold text-[14px] mb-6">Hesabınızı silmek geri alınamaz bir işlemdir.</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-black text-rose-600">Hesabı Sil</p>
                                    <p className="text-rose-400 font-bold text-[13px]">Tüm verileriniz kalıcı olarak silinir.</p>
                                </div>
                                <button className="h-12 px-8 rounded-2xl bg-rose-600 text-white font-black text-[14px] hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Sil
                                </button>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#5500ff]" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
