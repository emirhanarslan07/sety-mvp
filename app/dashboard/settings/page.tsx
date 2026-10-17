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

    const [tab, setTab] = useState<'Profile' | 'Appearance' | 'Payment Methods' | 'Subscription' | 'Security'>('Profile');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile state
    const [name, setName] = useState('Creator');
    const [username, setUsername] = useState('creator');
    const [email, setEmail] = useState('creator@sety.store');
    const [bio, setBio] = useState('Digital creator & coach.');
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [notif, setNotif] = useState(true);

    // Appearance state
    const [selectedTheme, setSelectedTheme] = useState('Purple');
    const [storeTitle, setStoreTitle] = useState('Creator');

    // Payment state
    const [iban, setIban] = useState('');

    // Security state
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (profile || store) {
            setName(profile?.full_name || store?.display_name || 'Creator');
            setUsername(store?.username || 'creator');
            setEmail(profile?.email || user?.email || 'creator@sety.store');
            setBio(store?.bio || 'Digital creator & coach.');
            setPhoto(profile?.profile_image_url || store?.store_logo_url || null);
            setStoreTitle(store?.display_name || profile?.full_name || 'Creator');
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
            showToast('Profile photo updated! 📸', 'success');
        } catch (err: any) {
            console.error('Photo upload error:', err);
            showToast('Failed to upload photo.', 'error');
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) {
            showToast('Profile saved! ✨ (Preview mode)', 'success');
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
            showToast('Profile information saved! ✨', 'success');
        } catch (err: any) {
            console.error('Save profile error:', err);
            showToast(err.message || 'Failed to save profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSavePayment = async () => {
        if (!user) {
            showToast('Payment settings saved! 💳', 'success');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ payment_url: iban })
                .eq('user_id', user.id);
            if (error) throw error;
            showToast('Payment settings saved! 💳', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to save payment settings.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }
        if (!user) {
            showToast('Password updated! 🔒 (Preview mode)', 'success');
            setNewPassword('');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            showToast('Password updated successfully! 🔒', 'success');
            setNewPassword('');
        } catch (err: any) {
            showToast(err.message || 'Failed to update password.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`https://sety.store/${username}`);
        showToast('Store link copied! 🚀', 'success');
    };

    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(s => s[0].toUpperCase())
        .join('') || 'CR';

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Account & Store Settings</h1>
                    <p className="subtitle">Make your store uniquely yours.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        onClick={() => {
                            if (tab === 'Profile') handleSaveProfile();
                            else if (tab === 'Payment Methods') handleSavePayment();
                            else if (tab === 'Security') handleUpdatePassword();
                            else showToast('Changes saved! ✨', 'success');
                        }}
                        disabled={saving}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Check size={14} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* ═══ TOOLBAR TABS ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['Profile', 'Appearance', 'Payment Methods', 'Subscription', 'Security'] as const).map(item => (
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
            {tab === 'Profile' ? (
                <div className="settings-grid">
                    <div>
                        {/* Profile Image Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Profile Photos</h2>
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
                                    <strong className="text-xs">Profile Photo</strong>
                                    <p className="panel-description mb-3">
                                        JPG, PNG or WEBP · Max 5 MB
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <label className="cursor-pointer gap-1.5">
                                            {photoUploading ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : (
                                                <Camera size={13} />
                                            )}
                                            {photoUploading ? 'Uploading...' : 'Select Photo'}
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
                                <h2>Basic Information</h2>
                                <span className="badge green">Profile active</span>
                            </div>
                            <div className="form-body">
                                <div className="fields">
                                    <label className="field">
                                        FULL NAME
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Your Full Name"
                                        />
                                    </label>
                                    <label className="field">
                                        USERNAME
                                        <input
                                            value={username}
                                            disabled
                                            className="opacity-75"
                                        />
                                    </label>
                                    <label className="field">
                                        EMAIL
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="opacity-75"
                                        />
                                        <span className="text-[9px] text-muted-foreground">
                                            Registered email cannot be modified for security reasons.
                                        </span>
                                    </label>
                                    <label className="field">
                                        BIO
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            placeholder="Introduce yourself to your clients and audience..."
                                        />
                                    </label>
                                </div>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="text-xs gap-1.5"
                                >
                                    <Check size={14} />
                                    {saving ? 'Saving...' : 'Save Profile'}
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
                                        <span>LIVE STOREFRONT</span>
                                    </div>
                                    <div className="text-xs font-black text-slate-900 truncate">
                                        sety.store/{username || 'creator'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Button variant="outline" size="sm" onClick={copyLink} className="h-7 px-2.5 text-[11px] gap-1 bg-white hover:bg-slate-50 font-bold border-slate-200 shadow-2xs">
                                        <Copy size={11} />
                                        <span>Copy</span>
                                    </Button>
                                    <Button size="sm" asChild className="h-7 px-2.5 text-[11px] bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold shadow-2xs">
                                        <a href={`https://sety.store/${username || 'creator'}`} target="_blank" rel="noopener noreferrer">
                                            <span>Visit Store</span>
                                            <ArrowUpRight size={11} className="ml-0.5" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Notification Preferences */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Notification Preferences</h2>
                                <Mail size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-xs">Order notifications</strong>
                                        <p>Get notified on new sales and booking requests.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`toggle ${notif ? '' : 'off'}`}
                                        onClick={() => setNotif(!notif)}
                                        aria-label="Order notifications"
                                    />
                                </div>
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-xs">Weekly summary</strong>
                                        <p>Weekly growth updates for your store.</p>
                                    </div>
                                    <span className="badge green">Active</span>
                                </div>
                            </div>
                        </section>

                        {/* Security Info Card */}
                        <section className="panel">
                            <div className="form-body">
                                <ShieldCheck className="text-[#10B981] mb-3" size={26} />
                                <h2>Your account is protected</h2>
                                <p className="subtitle text-xs">
                                    You can update your login password and manage credentials under the Security tab.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                /* ═══ OTHER TABS (Appearance, Payment Methods, Security, Subscription) ═══ */
                <section className="panel">
                    <div className="panel-header">
                        <h2>{tab}</h2>
                        {tab === 'Appearance' ? (
                            <Palette className="text-[#5500FF]" size={17} />
                        ) : tab === 'Subscription' ? (
                            <Zap className="text-[#5500FF]" size={17} fill="#C4FF00" />
                        ) : tab === 'Security' ? (
                            <ShieldCheck className="text-[#5500FF]" size={17} />
                        ) : (
                            <CreditCard className="text-[#5500FF]" size={17} />
                        )}
                    </div>

                    <div className="form-body max-w-2xl">
                        {tab === 'Appearance' ? (
                            <>
                                <h2>Storefront Theme</h2>
                                <div className="color-options">
                                    {['Purple (Classic Sety)', 'Emerald Green (Natural)', 'Warm Amber (Warm)'].map(
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
                                    STOREFRONT TITLE
                                    <input
                                        value={storeTitle}
                                        onChange={e => setStoreTitle(e.target.value)}
                                        placeholder="Storefront Header Title"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    onClick={() =>
                                        showToast('Appearance settings saved! 🎨', 'success')
                                    }
                                >
                                    <Check size={14} />
                                    Save Appearance
                                </Button>
                            </>
                        ) : tab === 'Payment Methods' ? (
                            <>
                                <div className="setting-row">
                                    <div>
                                        <strong className="text-sm">Bank Wire / Direct Transfer</strong>
                                        <p>Receive sales and consultation payouts directly to your account.</p>
                                    </div>
                                    <span className="badge green">Active</span>
                                </div>
                                <div className="setting-row mt-3">
                                    <div>
                                        <strong className="text-sm">Polar / Global Card Checkout</strong>
                                        <p>Secure global card processing (0% launch commission).</p>
                                    </div>
                                    <span className="badge green">Active</span>
                                </div>
                                <label className="field mt-5">
                                    IBAN OR PAYMENT URL
                                    <input
                                        value={iban}
                                        onChange={e => setIban(e.target.value)}
                                        placeholder="IBAN or payment link..."
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    disabled={saving}
                                    onClick={handleSavePayment}
                                >
                                    <Check size={14} />
                                    {saving ? 'Saving...' : 'Save Payment Info'}
                                </Button>
                            </>
                        ) : tab === 'Subscription' ? (
                            <>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#5500FF]/5 via-purple-50/50 to-transparent border border-purple-100">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5500FF] text-white text-[10px] font-black uppercase tracking-wider mb-2">
                                                <Zap size={11} fill="#C4FF00" stroke="#C4FF00" />
                                                FOUNDER PLAN
                                            </span>
                                             <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                                Launch Special · Sety Pro Trial
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                All Sety Pro features and 0% commission are included in your 14-day free trial during launch.
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-slate-900">$0</span>
                                            <span className="text-xs text-slate-400 font-bold"> / 14-day trial</span>
                                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">● Active Trial</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 pt-5 border-t border-purple-100/70 text-xs text-slate-700">
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> Unlimited digital products
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> 1:1 Coaching & calendar scheduling
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> Custom sety.store/{username || 'creator'} link
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Check size={14} className="text-emerald-500 shrink-0" /> Email lead capture & customer list
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-4">
                                    <p className="text-xs text-slate-500">
                                        To view your billing history and subscription details, visit the billing page.
                                    </p>
                                    <Button variant="outline" size="sm" asChild className="text-xs gap-1.5 shrink-0">
                                        <Link href="/dashboard/billing">
                                            <span>View Billing</span>
                                            <ArrowUpRight size={13} />
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <label className="field">
                                    NEW PASSWORD
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    disabled={saving}
                                    onClick={handleUpdatePassword}
                                >
                                    <ShieldCheck size={14} />
                                    {saving ? 'Updating...' : 'Update Password'}
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
