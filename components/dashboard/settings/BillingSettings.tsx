'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle2, ShieldCheck, CreditCard, ArrowUpRight, Sparkles, Clock } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { format } from 'date-fns';

export default function BillingSettings() {
    const { profile } = useDashboard();

    return (
        <div className="space-y-8 max-w-4xl">
            {/* MAIN PLAN CARD - Clean, light & branded */}
            <Card className="rounded-3xl border border-slate-200/90 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
                        {/* Plan Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#5500FF] flex items-center justify-center shadow-lg shadow-[#5500FF]/25 shrink-0">
                                    <Zap className="w-8 h-8 text-[#C4FF00]" fill="#C4FF00" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-extrabold text-[#5500FF] uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                                        MEVCUT PLAN
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                                        Sety Pro · Lansman Deneme Sürümü
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>14 Günlük Ücretsiz Deneme Aktif</span>
                                </div>
                                <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    Başlangıç: {profile?.created_at ? format(new Date(profile.created_at), 'dd MMMM yyyy') : 'Bugün'}
                                </span>
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left lg:text-right min-w-[240px]">
                            <div className="text-4xl font-black text-slate-900 tracking-tight">
                                ₺0 <span className="text-sm font-semibold text-slate-400">/ deneme süresince</span>
                            </div>
                            <p className="text-slate-600 font-bold text-xs mt-1.5">
                                Ardından <span className="text-[#5500FF] font-extrabold">$19/ay</span> (veya ₺499/ay)
                            </p>
                            <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center lg:justify-end gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                Lansmana Özel %0 Komisyon
                            </div>
                        </div>
                    </div>

                    {/* Features & Explanation */}
                    <div className="mt-8 bg-slate-50/70 p-6 md:p-8 rounded-2xl border border-slate-150 space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span>Erken Erişim Dönemine Hoş Geldin!</span>
                                <span className="text-lg">🎉</span>
                            </h3>
                            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                                Sety Pro&apos;yu 14 gün boyunca tüm gelişmiş özellikleriyle sınırsız deneyimleyebilirsin. Mağazanı kur, ürünlerini ve 1:1 seanslarını ekle, ilk satışlarını yapmaya hemen başla.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                            {[
                                'Sınırsız Dijital Ürün, Dosya & Şablon Satışı',
                                '1:1 Seans & Otomatik Takvim Entegrasyonu',
                                'Lansmana Özel %0 Platform Komisyonu',
                                'Kişisel Vitrin & Link-in-Bio Sayfası',
                                'Detaylı Ziyaretçi & Satış Dönüşüm Analitiği',
                                'E-Posta Bülten & Müşteri Listesi Toplama',
                                'Özel Alan Adı (Custom Domain) Bağlama Desteği',
                                'Öncelikli 7/24 Doğrudan Destek Hattı'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 text-slate-800">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="text-xs font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Ödemeler ve abonelikler Polar & Stripe PCI-DSS Seviye 1 güvencesiyle korunur.</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full sm:w-auto text-xs font-bold gap-1.5"
                                onClick={() => {
                                    if (typeof window !== 'undefined') {
                                        window.open('https://polar.sh', '_blank');
                                    }
                                }}
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Ödeme Yöntemi Ekle</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* INVOICE HISTORY CARD */}
            <Card className="rounded-3xl border border-slate-200/90 shadow-sm bg-white p-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Fatura Geçmişi</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Geçmiş ödemeleriniz ve resmi faturalarınız.</p>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                        Şu anda 14 günlük ücretsiz deneme sürümündesiniz. Henüz oluşturulmuş bir fatura bulunmuyor.
                    </p>
                </div>
            </Card>
        </div>
    );
}
