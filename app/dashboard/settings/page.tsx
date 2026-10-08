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
    Palette
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

type TabType = 'profile' | 'appearance' | 'payments' | 'billing' | 'security';

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
    const [theme, setTheme] = useState('sety');

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
                if (storeData.social_links?._theme) {
                    setTheme(storeData.social_links._theme);
                }
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
                .update({ social_links: { ...socialLinks, _theme: theme } })
                .eq('user_id', user.id);
            if (error) throw error;
            showToast('Sosyal medya linkleri kaydedildi. ✅', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
        }
    };

    const handleSaveAppearance = async () => {
        setSaving('appearance');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase
                .from('stores')
                .update({ social_links: { ...socialLinks, _theme: theme } })
                .eq('user_id', user.id);
            if (error) throw error;
            showToast('Görünüm ayarları kaydedildi. ✅', 'success');
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
        { id: 'appearance', label: 'Görünüm', icon: Palette },
        { id: 'payments', label: 'Ödeme Yöntemleri', icon: Wallet },
        { id: 'security', label: 'Güvenlik', icon: Shield },
    ];

    const SectionCard = ({ children }: { children: React.ReactNode }) => (
        <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 md:p-8 space-y-6 overflow-hidden">
            {children}
        </div>
    );

    const SaveButton = ({ sectionKey, label = 'Kaydet' }: { sectionKey: string; label?: string }) => (
        <button
            onClick={() => {
                if (sectionKey === 'profile') handleSaveProfile();
                if (sectionKey === 'socials') handleSaveSocials();
                if (sectionKey === 'appearance') handleSaveAppearance();
                if (sectionKey === 'password') handleUpdatePassword();
            }}
            disabled={saving === sectionKey}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-6 py-2.5 rounded-xl font-bold text-[13px] shadow-md shadow-[#5500FF]/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
        >
            {saving === sectionKey ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
            ) : (
                label
            )}
        </button>
    );
    const themeColors: Record<string, { bg: string, text: string, card: string }> = {
        sety: { bg: 'bg-[#F8FAFF]', text: 'text-[#5500ff]', card: 'bg-white' },
        night: { bg: 'bg-slate-950', text: 'text-white', card: 'bg-slate-900' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', card: 'bg-white' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', card: 'bg-white' },
    };

    const activeTheme = themeColors[theme] || themeColors['sety'];

    const MobileMockup = () => (
        <div className="w-[300px] h-[600px] bg-white rounded-[38px] border-[8px] border-slate-900 shadow-xl relative overflow-hidden flex flex-col shrink-0">
            {/* Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[20px] bg-slate-900 rounded-b-[12px] z-20"></div>
            
            <div className={cn("flex-1 overflow-y-auto no-scrollbar pb-10 transition-colors duration-500", activeTheme.bg)}>
                {/* Cover Image */}
                <div className="h-24 w-full bg-slate-200 relative">
                    {coverImage && <Image src={coverImage} alt="Cover" fill className="object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="px-5 pb-6 -mt-8 relative z-10 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-md">
                        {profileImage ? (
                            <Image src={profileImage} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                        )}
                    </div>
                    
                    <h2 className={cn("mt-2.5 text-[15px] font-bold transition-colors duration-500", theme === 'night' ? 'text-white' : 'text-slate-900')}>
                        {fullName || 'Mağaza Adı'}
                    </h2>
                    <p className={cn("mt-1 text-[11px] font-medium opacity-80 leading-relaxed transition-colors duration-500", theme === 'night' ? 'text-slate-300' : 'text-slate-500')}>
                        {bio || 'Kendinizi kısa bir biyografi ile tanıtın.'}
                    </p>
                    
                    {/* Socials */}
                    <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                        {socialLinks.instagram && <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-sm", activeTheme.card)}><Instagram className="w-3.5 h-3.5 text-pink-600" /></div>}
                        {socialLinks.twitter && <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-sm", activeTheme.card)}><Twitter className="w-3.5 h-3.5 text-slate-800" /></div>}
                        {socialLinks.youtube && <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-sm", activeTheme.card)}><Youtube className="w-3.5 h-3.5 text-red-600" /></div>}
                        {socialLinks.tiktok && <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shadow-sm", activeTheme.card)}><TiktokIcon className="w-3.5 h-3.5 text-slate-900" /></div>}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                        Hesap ve Mağaza Ayarları
                    </h1>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        Profil bilgilerinizi, ödeme yöntemlerinizi ve hesap güvenliğinizi yapılandırın.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 p-1 bg-[#F1F3F9] rounded-xl self-start sm:self-auto">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all',
                                    isActive
                                        ? 'bg-white text-[#0F172A] shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900'
                                )}
                            >
                                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-[#5500FF]' : 'text-slate-400')} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div>

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex-1 space-y-8 min-w-0">
                            {/* ── Profil Fotoğrafı + Kapak */}
                            <SectionCard>
                                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-6">Profil Görselleri</h2>
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
                                            <p className="font-bold text-slate-900 text-[15px] mb-1">Profil Fotoğrafı</p>
                                            <p className="text-[13px] font-bold text-slate-400 mb-3">JPG, PNG veya WEBP — maks. 5MB</p>
                                            <label className="cursor-pointer h-10 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] inline-flex items-center gap-2 transition-all active:scale-95">
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
                                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-6">Temel Bilgiler</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Full name */}
                                        <div className="space-y-2">
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">Ad Soyad</label>
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
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">Kullanıcı Adı</label>
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
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">E-posta</label>
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
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">Biyografi</label>
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

                            {/* ── Sosyal Medya (Premium) */}
                            <SectionCard>
                                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-2">Sosyal Medya</h2>
                                <p className="text-[14px] font-bold text-slate-400 mb-8">Mağazanızda gösterilecek sosyal medya profilleri. Hayranlarınızın sizi bulmasına yardımcı olun.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@kullaniciadi', color: 'text-pink-600', bg: 'bg-pink-50', hover: 'hover:border-pink-200', focus: 'focus-within:border-pink-300 focus-within:ring-pink-100', prefix: 'instagram.com/' },
                                        { id: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: '@kullaniciadi', color: 'text-slate-800', bg: 'bg-slate-100', hover: 'hover:border-slate-300', focus: 'focus-within:border-slate-400 focus-within:ring-slate-200', prefix: 'x.com/' },
                                        { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: '@kanaladi', color: 'text-red-600', bg: 'bg-red-50', hover: 'hover:border-red-200', focus: 'focus-within:border-red-300 focus-within:ring-red-100', prefix: 'youtube.com/' },
                                        { id: 'tiktok', label: 'TikTok', icon: TiktokIcon, placeholder: '@kullaniciadi', color: 'text-slate-900', bg: 'bg-slate-100', hover: 'hover:border-slate-300', focus: 'focus-within:border-slate-400 focus-within:ring-slate-200', prefix: 'tiktok.com/@' },
                                    ].map((social) => {
                                        const value = (socialLinks as any)[social.id] || '';
                                        const hasValue = value.length > 0;
                                        
                                        return (
                                            <div 
                                                key={social.id} 
                                                className={cn(
                                                    "group flex flex-col p-5 rounded-[24px] border-2 transition-all duration-300 bg-white",
                                                    hasValue ? "border-slate-200 shadow-sm" : "border-slate-100",
                                                    social.hover,
                                                    social.focus,
                                                    "focus-within:ring-4 focus-within:shadow-md"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-focus-within:scale-110", social.bg, social.color)}>
                                                        <social.icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-[14px] font-bold text-slate-800">{social.label}</label>
                                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Bağlantı Ekle</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="relative flex items-center h-12 bg-slate-50/80 rounded-xl overflow-hidden group-focus-within:bg-white transition-colors border border-transparent group-focus-within:border-slate-200">
                                                    <div className="flex items-center justify-center pl-4 pr-1 text-[13px] font-bold text-slate-400 select-none">
                                                        {social.prefix}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={value.replace(social.prefix, '').replace('https://', '')}
                                                        onChange={(e) => {
                                                            let val = e.target.value.replace('https://', '').replace('http://', '');
                                                            if (val.startsWith(social.prefix)) val = val.replace(social.prefix, '');
                                                            if (val.startsWith('@') && social.id !== 'tiktok') val = val.replace('@', '');
                                                            setSocialLinks({ ...socialLinks, [social.id]: val });
                                                        }}
                                                        placeholder={social.placeholder}
                                                        className="w-full h-full bg-transparent border-none outline-none font-bold text-[14px] text-slate-900 placeholder:text-slate-300 px-2"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[13px] font-medium text-slate-500">Değişikliklerin canlıya yansıması için kaydedin.</p>
                                    <SaveButton sectionKey="socials" label="Linkleri Kaydet" />
                                </div>
                            </SectionCard>
                        </div>

                        {/* Mobile Preview Column */}
                        <div className="hidden lg:block w-[320px] shrink-0">
                            <div className="sticky top-24">
                                <MobileMockup />
                            </div>
                        </div>
                    </div>
                )}

                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex-1 space-y-8 min-w-0">
                            <SectionCard>
                                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-2">Tema Seçimi</h2>
                                <p className="text-[14px] font-bold text-slate-400 mb-6">Mağazanızın görünümünü markanıza uygun hale getirin.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: 'sety', label: 'Sety (Varsayılan)', color: 'bg-[#5500ff]' },
                                        { id: 'night', label: 'Gece Modu', color: 'bg-slate-900' },
                                        { id: 'rose', label: 'Gül Kurusu', color: 'bg-rose-500' },
                                        { id: 'emerald', label: 'Zümrüt', color: 'bg-emerald-500' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={cn(
                                                "p-5 rounded-[24px] border-2 flex items-center gap-4 transition-all text-left",
                                                theme === t.id ? "border-[#5500ff] bg-[#5500ff]/5 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50"
                                            )}
                                        >
                                            <div className={cn("w-8 h-8 rounded-full flex-shrink-0 shadow-sm", t.color)} />
                                            <span className="font-bold text-[15px] text-slate-700">{t.label}</span>
                                            {theme === t.id && <CheckCircle2 className="w-5 h-5 text-[#5500ff] ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[13px] font-medium text-slate-500">Müşterileriniz temanızı hemen görecek.</p>
                                    <SaveButton sectionKey="appearance" label="Görünümü Kaydet" />
                                </div>
                            </SectionCard>
                        </div>
                        
                        {/* Mobile Preview Column */}
                        <div className="hidden lg:block w-[320px] shrink-0">
                            <div className="sticky top-24">
                                <MobileMockup />
                            </div>
                        </div>
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
                            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight mb-2">Şifre Değiştir</h2>
                            <p className="text-[14px] font-bold text-slate-400 mb-6">Hesabınızı güvende tutmak için güçlü bir şifre kullanın.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">Yeni Şifre</label>
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
                                    <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">Şifre Tekrar</label>
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


                        {/* Danger Zone */}
                        <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100">
                            <h3 className="text-[18px] font-bold text-rose-700 mb-2">Tehlikeli Bölge</h3>
                            <p className="text-rose-400 font-bold text-[14px] mb-6">Hesabınızı silmek geri alınamaz bir işlemdir.</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-rose-600">Hesabı Sil</p>
                                    <p className="text-rose-400 font-bold text-[13px]">Tüm verileriniz kalıcı olarak silinir.</p>
                                </div>
                                <button className="h-12 px-8 rounded-2xl bg-rose-600 text-white font-bold text-[14px] hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2">
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
