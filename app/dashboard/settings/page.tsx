'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    Wallet,
    Copy,
    Check,
    Smartphone,
    MapPin,
    BarChart3,
    MoreHorizontal,
    ExternalLink,
    Plug,
    Calendar,
    Video,
    Instagram,
    Search
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
import { useToast } from '@/context/ToastContext';
import { IntegrationCard, IntegrationRequestCard } from '@/components/dashboard/settings/IntegrationCard';
import { ZapierLogoSVG, ZoomLogoSVG, InstagramLogoSVG, GoogleCalendarLogoSVG } from '@/components/dashboard/settings/IntegrationLogos';
import BillingSettings from '@/components/dashboard/settings/BillingSettings';

type TabType = 'profile' | 'integrations' | 'billing' | 'payments' | 'notifications' | 'security';

const INTEGRATIONS = [
    {
        id: 'google-calendar',
        name: 'Google Calendar',
        subtitle: 'Our Built-in Calendar Product',
        description: "Stop paying for boring calendar scheduling tools and instead use Sety's built-in calendar feature to keep everything under one roof.",
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        isComingSoon: true,
    },
    {
        id: 'zoom',
        name: 'Zoom',
        subtitle: 'Meet with Customers on Zoom',
        description: 'Integrate Zoom with your Sety account to simplify the scheduling process and automatically send Zoom meeting links to customers who book a time on your calendar.',
        icon: <ZoomLogoSVG />,
        isComingSoon: true,
    },
    {
        id: 'zapier',
        name: 'Zapier',
        subtitle: 'Connect Sety With 3rd Party Tools',
        description: "Have a favorite tool that you'd like to connect to Sety? Use Zapier to remove the manual work and automate your processes.",
        icon: <ZapierLogoSVG />,
        isComingSoon: false,
    },
    {
        id: 'instagram',
        name: 'Instagram',
        subtitle: 'Send Automated Replies',
        description: 'Connect your Instagram account to automatically reply to Instagram messages and comments!',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
        isComingSoon: true,
    }
];

export default function SettingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { lang, t } = useTranslation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'profile');
    const [imageUploading, setImageUploading] = useState(false);
    const [paymentConfig, setPaymentConfig] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    // Form States
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [phone, setPhone] = useState('');

    // Password States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Analytics States
    const [fbPixelId, setFbPixelId] = useState('');
    const [gaId, setGaId] = useState('');
    const [tiktokPixelId, setTiktokPixelId] = useState('');
    const [pinterestTagId, setPinterestTagId] = useState('');

    // Address States
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    // Username Checking
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameSuccess, setUsernameSuccess] = useState(false);

    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            // if (!user) {
            //     router.push('/auth');
            //     return;
            // }

            if (user) {
                setEmail(user.email || '');

                const { data: profileData } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                    setFullName(profileData.full_name || '');
                    setProfileImage(profileData.profile_image_url || '');
                    setPaymentConfig(profileData.payment_config || {});
                    setPhone(profileData.phone || '');

                    // Check if 24 hours have passed since account creation
                    const createdAt = new Date(profileData.created_at);
                    const now = new Date();
                    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
                    
                    const hasPayments = profileData.payment_config?.stripe?.connected || 
                                       profileData.payment_config?.manual?.enabled;

                    if (hoursSinceCreation > 24 && !hasPayments) {
                        setShowWarning(true);
                    }
                }

                const { data: store } = await supabase
                    .from('stores')
                    .select('username')
                    .eq('user_id', user.id)
                    .single();

                if (store) {
                    setUsername(store.username || '');
                }
            }

            setLoading(false);
        };
        loadInitialData();
    }, [router]);

    // Update URL when tab changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', activeTab);
        router.push(`?${params.toString()}`, { scroll: false });
    }, [activeTab, router, searchParams]);

    const copyStoreLink = () => {
        const url = `sety.store/${username}`;
        navigator.clipboard.writeText(`https://${url}`);
        setCopied(true);
        showToast(t('dashboard.toast.store_link_copied'), 'success');
        setTimeout(() => setCopied(false), 2000);
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

            showToast('Profil fotoğrafınız güncellendi.', 'success');
        } catch (err: any) {
            showToast(`Hata: ${err.message}`, 'error');
        } finally {
            setImageUploading(false);
        }
    };

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
        setSaving('profile');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (username && usernameSuccess) {
                const { error: storeError } = await supabase
                    .from('stores')
                    .update({ username })
                    .eq('user_id', user.id);
                if (storeError) throw storeError;
            }

            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({ 
                    full_name: fullName,
                    // phone: phone // Only if column exists
                })
                .eq('user_id', user.id);
            if (profileError) throw profileError;

            showToast('Profil bilgileriniz başarıyla kaydedildi.', 'success');
        } catch (err: any) {
            showToast(err.message || 'Güncelleme sırasında hata oluştu.', 'error');
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
            showToast('Şifreniz güncellendi.', 'success');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setSaving(null);
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
            showToast('Ödeme ayarlarınız başarıyla kaydedildi.', 'success');
        } catch (err: any) {
            showToast(err.message || 'Ödeme ayarları kaydedilirken hata oluştu.', 'error');
        }
    };

    if (loading) return null;

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'integrations', label: 'Integrations', icon: Plug },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'payments', label: 'Payments', icon: Wallet },
        { id: 'notifications', label: 'Email Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFF] pb-32">
            {/* Header with Title and Link */}
            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">My Account Settings</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={copyStoreLink}
                            className="flex items-center gap-2 group cursor-pointer"
                        >
                            <span className="text-[16px] font-bold text-[#5500ff] border-b-2 border-transparent group-hover:border-[#5500ff] transition-all">
                                sety.store/{username || 'username'}
                            </span>
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#5500ff]" />}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar mb-12">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-4 rounded-2xl text-[14px] font-black whitespace-nowrap transition-all border-2",
                                    isActive
                                        ? "bg-white border-indigo-100 text-[#5500ff] shadow-[0_12px_24px_rgba(85,0,255,0.06)] scale-[1.02]"
                                        : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <tab.icon className={cn("w-5 h-5", isActive ? "text-[#5500ff]" : "text-slate-400")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Warning Bar */}
                {showWarning && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#5500ff] text-white p-6 rounded-[32px] mb-12 flex items-center gap-4 shadow-xl shadow-indigo-200"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        <p className="font-bold text-[15px] leading-tight">
                            Heads up, customers can't purchase from you yet! Please set up your Payments to start selling.
                        </p>
                    </motion.div>
                )}

                {/* Main Content Area */}
                <div className="space-y-12">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Section: My Profile */}
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                        <div className="space-y-1">
                                            <h2 className="text-[24px] font-black text-slate-900 tracking-tight">My Profile</h2>
                                            <p className="text-slate-400 font-bold text-[15px]">Update your public profile information.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <PremiumInput
                                            label="Name"
                                            placeholder="Emirhan Arslan"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            icon={<User className="w-5 h-5" />}
                                        />
                                        <PremiumInput
                                            label="Username"
                                            placeholder="emirhan00777"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                            error={usernameError}
                                            success={usernameSuccess && !isCheckingUsername}
                                            helperText={isCheckingUsername ? "Checking..." : undefined}
                                        />
                                        <PremiumInput
                                            label="Email"
                                            placeholder="emirhanarslan0571@gmail.com"
                                            value={email}
                                            disabled
                                            icon={<Lock className="w-5 h-5 opacity-30" />}
                                            helperText="Registered email cannot be changed."
                                        />
                                        <PremiumInput
                                            label="Phone Number"
                                            placeholder="0531 352 05 71"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            innerPrefix="+90"
                                        />
                                    </div>

                                    <div className="mt-12 flex">
                                        <button 
                                            onClick={handleUpdateProfile}
                                            disabled={saving === 'profile'}
                                            className="h-14 px-12 rounded-2xl bg-[#F0F4FF] text-slate-500 font-black text-[15px] hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {saving === 'profile' ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section: Password */}
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight mb-10">Password</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <PremiumInput
                                            label="Current Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                        <PremiumInput
                                            label="New Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <PremiumInput
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            error={newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords don't match" : ""}
                                        />
                                    </div>

                                    <div className="mt-10 flex">
                                        <button 
                                            onClick={handleUpdatePassword}
                                            disabled={saving === 'password'}
                                            className="h-14 px-12 rounded-2xl bg-[#F0F4FF] text-slate-500 font-black text-[15px] hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {saving === 'password' ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section: Analytics */}
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                        <div>
                                            <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Analytics</h2>
                                            <p className="text-slate-400 font-bold text-[15px] mt-1">Want to include your Facebook/Google Pixel?</p>
                                        </div>
                                        <button className="h-12 px-6 rounded-2xl bg-indigo-50 text-[#5500ff] font-black text-[14px] hover:bg-indigo-100 transition-all active:scale-95">
                                            Upgrade Now ✨
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 opacity-50 pointer-events-none">
                                        <PremiumInput label="Facebook Pixel Id" placeholder="Ex: 123456789" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} />
                                        <PremiumInput label="Google Analytics Id" placeholder="Ex: G-XXXXXXXXXX" value={gaId} onChange={(e) => setGaId(e.target.value)} />
                                        <PremiumInput label="Tiktok Pixel Id" placeholder="Ex: XXXXXXXXXXXXXXXXXXXX" value={tiktokPixelId} onChange={(e) => setTiktokPixelId(e.target.value)} />
                                        <PremiumInput label="Pinterest Claim Tag Id" placeholder="Ex: XXXXXXXXXXXXXXXXXXXX" value={pinterestTagId} onChange={(e) => setPinterestTagId(e.target.value)} />
                                    </div>

                                    <div className="mt-12 flex">
                                        <button className="h-14 px-12 rounded-2xl bg-[#F0F4FF] text-slate-400 font-black text-[15px] cursor-not-allowed">
                                            Update
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section: Address */}
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight mb-10">Address</h2>
                                    
                                    <div className="space-y-10">
                                        <PremiumInput 
                                            label="Street Address" 
                                            placeholder="Start typing your address..." 
                                            value={address.street} 
                                            onChange={(e) => setAddress({...address, street: e.target.value})}
                                            icon={<MapPin className="w-5 h-5" />}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <PremiumInput label="City" placeholder="City" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                                            <PremiumInput label="State/Province" placeholder="State/Province" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
                                            <PremiumInput label="Postal Code" placeholder="Postal Code" value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
                                            <PremiumInput label="Country" placeholder="Country" value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="mt-12 flex">
                                        <button className="h-14 px-12 rounded-2xl bg-[#F0F4FF] text-slate-500 font-black text-[15px] hover:bg-slate-200 transition-all active:scale-95">
                                            Update
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section: Other */}
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                                <CardContent className="p-10 md:p-14">
                                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight mb-8">Other</h2>
                                    
                                    <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900">Stan Store Referral Banner</p>
                                            <p className="text-slate-400 font-bold text-[14px]">Upgrade to Creator Pro to hide the Stan Store Referral Banner.</p>
                                        </div>
                                        <div className="w-14 h-8 rounded-full bg-slate-200 relative p-1 cursor-not-allowed">
                                            <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === 'payments' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <PaymentSettings
                                initialConfig={paymentConfig}
                                onSave={handleUpdatePayment}
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
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white">
                                <CardContent className="p-10 md:p-14 space-y-10">
                                    <div>
                                        <h2 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">Security Settings</h2>
                                        <p className="text-slate-400 font-bold text-lg opacity-80">Manage your account security and authentication.</p>
                                    </div>

                                    <div className="space-y-8 pb-12 border-b border-slate-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#5500ff]">
                                                    <Smartphone className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg">Two-Factor Authentication</p>
                                                    <p className="text-slate-400 font-bold">Add an extra layer of security to your account.</p>
                                                </div>
                                            </div>
                                            <button className="h-12 px-8 rounded-full bg-slate-900 text-white font-black text-[14px] hover:bg-[#5500ff] transition-all">
                                                Enable
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[20px] font-black text-slate-900 mb-6">Danger Zone</h3>
                                        <div className="p-8 rounded-[32px] bg-rose-50 border border-rose-100 flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-rose-600">Delete Account</p>
                                                <p className="text-rose-400 font-bold text-[14px]">Permanently remove your account and all data.</p>
                                            </div>
                                            <button className="h-12 px-8 rounded-full bg-rose-600 text-white font-black text-[14px] hover:bg-rose-700 transition-all">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* INTEGRATIONS TAB */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight mb-2 italic uppercase">Integrations</h1>
                                <p className="text-slate-400 font-bold text-lg max-w-2xl opacity-80 leading-relaxed">
                                    Connect your favorite tools to automate your workflow and focus on what you do best.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {INTEGRATIONS.map((integration) => (
                                    <IntegrationCard
                                        key={integration.id}
                                        {...integration}
                                        onConnect={(id) => {
                                            if (id === 'zapier') {
                                                showToast('Zapier integration is being prepared!', 'info');
                                            } else {
                                                showToast(`${integration.name} integration is coming soon!`, 'info');
                                            }
                                        }}
                                    />
                                ))}
                                <IntegrationRequestCard />
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-in zoom-in duration-500">
                            <div className="w-32 h-32 rounded-[48px] bg-white shadow-2xl flex items-center justify-center text-[#5500ff]">
                                <MoreHorizontal className="w-12 h-12" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-[32px] font-black text-slate-900 mb-2">Coming Soon</h2>
                                <p className="text-slate-400 font-bold text-lg max-w-sm mx-auto">
                                    We're working hard to bring this feature to life. Stay tuned!
                                </p>
                            </div>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className="h-14 px-12 rounded-2xl bg-slate-900 text-white font-black hover:bg-[#5500ff] transition-all"
                            >
                                Back to Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
