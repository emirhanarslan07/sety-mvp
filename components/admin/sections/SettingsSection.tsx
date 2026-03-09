'use client';

import React, { useState } from 'react';
import {
    Settings,
    Save,
    Trash2,
    AlertTriangle,
    Shield,
    Mail,
    Bell,
    Database,
    Loader2,
    CheckCircle2,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';

export default function SettingsSection() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleResetEverything = async () => {
        const normalizedInput = confirmText.trim().toUpperCase();

        if (normalizedInput !== 'SIFIRLA' && normalizedInput !== 'SİFİRLA') {
            showToast('Lütfen onaylamak için SIFIRLA yazın.', 'error');
            return;
        }

        setLoading(true);
        try {
            // Call the real SQL RPC we just created
            const { error: rpcError, data } = await supabase.rpc('admin_reset_platform_data');

            if (rpcError) {
                throw rpcError;
            }

            showToast('Platform verileri başarıyla sıfırlandı.', 'success');

            // Refresh the page to update stats across the dashboard
            setTimeout(() => {
                window.location.href = '/admin'; // Force a full reload to reset state
            }, 1000);

            setShowResetConfirm(false);
            setConfirmText('');
        } catch (error: any) {
            // Better error message for the user
            const errMsg = error.message || error.details || 'Bilinmeyen bir hata oluştu.';
            showToast(`Hata: ${errMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Yönetim Ayarları</h1>
                <p className="text-slate-400 font-medium">Platform ayarlarını, bildirimleri ve veri yönetimi işlemlerini buradan yapabilirsin.</p>
            </div>

            <div className="space-y-8">
                {/* General Settings Card */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Genel Platform Ayarları</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform Başlığı</label>
                            <input
                                type="text"
                                defaultValue="Sety"
                                className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-800 focus:outline-none focus:border-primary/30 transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[13px] font-black text-slate-400 uppercase tracking-widest ml-1">İletişim E-postası</label>
                            <input
                                type="email"
                                defaultValue="hello@sety.store"
                                className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold text-slate-800 focus:outline-none focus:border-primary/30 transition-all shadow-sm focus:shadow-md"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="h-14 rounded-2xl bg-slate-900 hover:bg-black px-8 font-bold text-white shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center gap-2">
                            <Save className="w-5 h-5" />
                            Değişiklikleri Kaydet
                        </Button>
                    </div>
                </div>

                {/* Notifications Card */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Admin Bildirimleri</h3>
                    </div>

                    <div className="space-y-6">
                        {[
                            { id: 'new_user', label: 'Yeni kullanıcı kaydı bildirimi', desc: 'Yeni bir üye katıldığında e-posta al.' },
                            { id: 'new_store', label: 'Yeni mağaza açılış bildirimi', desc: 'Bir kullanıcı mağaza kurduğunda haberdar ol.' },
                            { id: 'system_alert', label: 'Sistem kritik hata uyarıları', desc: 'Kritik sunucu ve DB hatalarını anlık bildir.' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800">{item.label}</p>
                                    <p className="text-xs text-slate-400 font-semibold">{item.desc}</p>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer border shadow-sm inner-shadow">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dangerous Zone (Reset Feature) */}
                <div className="bg-rose-50/30 p-10 rounded-[3rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-rose-900">Tehlikeli Bölge</h3>
                            <p className="text-xs font-bold text-rose-500/70 uppercase tracking-widest mt-0.5">Yalnızca Geliştirme Amaçlı</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <p className="text-rose-950/60 font-semibold max-w-2xl leading-relaxed">
                            Aşağıdaki işlem platformdaki tüm test verilerini (admin olmayan kullanıcılar, mağazalar ve ürünler) kalıcı olarak siler. Bu işlem geri alınamaz.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={() => setShowResetConfirm(true)}
                            className="h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 px-8 font-black text-white shadow-xl shadow-rose-200 transition-all flex items-center gap-3 border-none ring-offset-emerald-50 active:scale-95"
                        >
                            <AlertTriangle className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                            Platformdaki Tüm Verileri Sıfırla
                        </Button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-1000 rotate-12">
                        <Database className="w-48 h-48 text-rose-500" />
                    </div>
                </div>
            </div>

            {/* Custom Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 transition-all duration-500">
                    <div className="bg-white w-full max-w-[480px] rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 relative overflow-hidden">
                        <button
                            onClick={() => setShowResetConfirm(false)}
                            className="absolute right-8 top-8 p-3 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all active:scale-90"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-20 h-20 rounded-[2.5rem] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 mx-auto shadow-rose-100 shadow-lg">
                            <AlertTriangle className="w-10 h-10" />
                        </div>

                        <div className="text-center space-y-4 mb-10">
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Emin misiniz?</h4>
                            <p className="text-slate-400 font-semibold leading-relaxed">
                                Bu işlem tüm kullanıcıları, mağazaları ve ürünleri silecek. Devam etmek için aşağıdaki kutucuğa <span className="text-rose-500 font-black">SIFIRLA</span> yazın.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <input
                                type="text"
                                placeholder="SIFIRLA yazın..."
                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-8 font-black text-center text-rose-500 text-lg focus:outline-none focus:border-rose-200 transition-all font-mono"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            />

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    onClick={() => setShowResetConfirm(false)}
                                    variant="outline"
                                    className="flex-1 h-16 rounded-[2rem] font-black border-slate-100 text-slate-500 hover:bg-slate-50"
                                >
                                    İptal Et
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        handleResetEverything();
                                    }}
                                    disabled={loading || (confirmText.trim().toUpperCase() !== 'SIFIRLA' && confirmText.trim().toUpperCase() !== 'SİFİRLA')}
                                    className="flex-1 h-16 rounded-[2rem] font-black bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-none group"
                                >
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                                            Onayla
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-rose-50/50 rounded-full blur-[80px]" />
                    </div>
                </div>
            )}
        </div>
    );
}
