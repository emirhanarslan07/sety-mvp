'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }
            setEmail(user.email || '');
            setLoading(false);
        };
        loadUser();
    }, [router]);

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            // Update user metadata (name)
            const { error } = await supabase.auth.updateUser({
                data: { name },
            });
            if (error) throw error;
            showToast('Profil başarıyla güncellendi! ✨', 'success');
        } catch (err: any) {
            showToast('Profil güncellenirken hata oluştu: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            showToast('Şifreler eşleşmiyor', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('Şifre en az 6 karakter olmalıdır', 'error');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
            showToast('Şifre başarıyla güncellendi! 🔐', 'success');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            showToast('Şifre güncellenirken hata oluştu: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            return;
        }

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            // Delete user profile
            await supabase.from('user_profiles').delete().eq('user_id', user.id);

            // Sign out
            await fetch('/api/auth/signout', { method: 'POST' });
            window.location.href = '/';
        } catch (err: any) {
            showToast('Hesap silinirken hata oluştu: ' + err.message, 'error');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-4xl">⏳</div>
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <Link href="/dashboard">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Sety
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm">
                                ← Dashboard
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto max-w-2xl px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Settings</h1>

                {/* Profile Settings */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email (readonly)
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full rounded-lg border-2 border-gray-300 bg-gray-100 px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Name (optional)
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        <Button onClick={handleUpdateProfile} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Password Update */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Update Password</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="rounded-2xl border-2 border-gray-300 px-4 py-2 focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        <Button onClick={handleUpdatePassword} disabled={saving || !newPassword}>
                            {saving ? 'Updating...' : 'Update Password'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Audience Data */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Audience Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-gray-600">
                            Update your audience data to recalculate your revenue projections.
                        </p>
                        <Link href="/onboarding">
                            <Button variant="outline">Update Audience Data</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-gray-600">
                            Once you delete your account, there is no going back. Please be
                            certain.
                        </p>
                        {!showDeleteConfirm ? (
                            <Button
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete My Account
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <p className="font-semibold text-red-600">
                                    Are you absolutely sure?
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="destructive" onClick={handleDeleteAccount}>
                                        Yes, Delete Forever
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
