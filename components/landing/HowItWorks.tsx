'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Store,
    Share2,
    Wallet,
    Zap,
    ArrowUpRight,
    Bell,
    CheckCircle2,
    DollarSign,
    BarChart3,
    Lock,
    ChevronRight,
    ExternalLink,
    Plus,
    TrendingUp,
    Package,
    ShoppingBag,
    Calendar,
    Layers,
    Users,
    Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

export function HowItWorks() {
    const { t } = useTranslation();
    return (
        <section className="py-24 md:py-36 bg-white border-t border-slate-100 relative overflow-hidden" id="how-it-works">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 text-balance">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 font-sans">
                        {t('landing.how_it_works.title')} <br /><span className="text-[#5500ff]">{t('landing.how_it_works.title_accent')}</span>
                    </h2>
                </div>

                {/* Bento Grid Layout */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

                    {/* Large Card: Step 1 - The Command Center */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 bg-white rounded-[40px] md:rounded-[48px] p-6 sm:p-8 md:p-10 flex flex-col justify-between group border border-slate-100 hover:border-[#5500ff]/20 transition-all duration-500 overflow-hidden relative shadow-sm hover:shadow-xl"
                    >
                        {/* Card Header Text */}
                        <div className="max-w-xl relative z-10 mb-6">
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t('landing.how_it_works.step1.title') }} />
                            <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
                                {t('landing.how_it_works.step1.desc')}
                            </p>
                        </div>

                        {/* ── 1:1 Sety Dashboard Home Replica ── */}
                        <div className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.07)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_25px_60px_-12px_rgba(85,0,255,0.12)]">
                            {/* macOS / App Top Chrome Bar */}
                            <div className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-[11px] font-bold text-slate-500 border border-slate-200/60 max-w-[200px] truncate">
                                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">sety.store/dashboard</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-600 hidden sm:inline">Canlı Panel</span>
                                </div>
                            </div>

                            {/* Dashboard Body with Left Mini Sidebar and Main Area */}
                            <div className="flex bg-[#F8FAFC]">
                                {/* Modern Sidebar (matching ModernSidebar.tsx) */}
                                <div className="w-36 lg:w-40 bg-white border-r border-slate-200/70 p-3 hidden sm:flex flex-col justify-between shrink-0">
                                    <div className="space-y-4">
                                        {/* Logo */}
                                        <div className="flex items-center gap-2 px-1.5 py-1">
                                            <SetyLogo size="sm" className="w-6 h-6" />
                                            <span className="text-sm font-black text-slate-900 tracking-tight font-logo">Sety</span>
                                        </div>

                                        {/* Nav items */}
                                        <nav className="space-y-1">
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#5500FF] text-white text-xs font-bold shadow-xs">
                                                <svg width="14" height="14" fill="none" viewBox="0 0 16 16" className="shrink-0">
                                                    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                                <span>Genel Bakış</span>
                                            </div>
                                            {[
                                                { label: 'Mağazam', icon: Layers },
                                                { label: 'Siparişler', icon: ShoppingBag },
                                                { label: 'Randevular', icon: Calendar },
                                                { label: 'Müşteriler', icon: Users },
                                                { label: 'Analitik', icon: BarChart3 },
                                                { label: 'Ayarlar', icon: Settings },
                                            ].map((item, idx) => {
                                                const ItemIcon = item.icon;
                                                return (
                                                    <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-slate-500 text-xs font-semibold hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-default">
                                                        <ItemIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                        <span>{item.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </nav>
                                    </div>

                                    {/* Bottom creator tag */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 px-1">
                                        <div className="w-7 h-7 rounded-full bg-violet-100 text-[#5500ff] font-extrabold text-xs flex items-center justify-center border border-violet-200">
                                            N
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[11px] font-black text-slate-900 truncate leading-none">nova.studio</div>
                                            <div className="text-[9px] text-emerald-600 font-bold mt-0.5 leading-none">● Aktif</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 p-3.5 sm:p-5 space-y-3.5 min-w-0">
                                    {/* Top Breadcrumb & Actions Row */}
                                    <div className="flex items-center justify-between gap-3 pb-1.5 border-b border-slate-200/60">
                                        <div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                                <span>Panel</span>
                                                <ChevronRight className="w-2.5 h-2.5" />
                                                <span className="text-slate-600">Genel Bakış</span>
                                            </div>
                                            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight mt-0.5">
                                                Tekrar hoş geldin, nova 👋
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-2xs">
                                                <ExternalLink className="w-3 h-3 text-slate-400" />
                                                <span>Mağazayı Gör</span>
                                            </div>
                                            <div className="inline-flex items-center gap-1 rounded-lg bg-[#5500FF] text-white px-2.5 py-1 text-[11px] font-bold shadow-xs">
                                                <Plus className="w-3 h-3" />
                                                <span>Ürün Ekle</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4 KPI Cards Row */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                                        {[
                                            { label: 'Toplam Gelir', val: '₺42.850', change: '+18,2%', color: '#5500FF', pts: '0,22 15,18 30,19 45,12 60,10 75,5 90,2' },
                                            { label: 'Ziyaretler', val: '2.450', change: '+9,4%', color: '#10B981', pts: '0,20 15,16 30,18 45,10 60,12 75,6 90,3' },
                                            { label: 'Siparişler', val: '142', change: '+12,1%', color: '#F59E0B', pts: '0,24 15,20 30,16 45,14 60,8 75,5 90,2' },
                                            { label: 'Dönüşüm', val: '%5,8', change: '+0,6%', color: '#64748B', pts: '0,18 15,15 30,17 45,12 60,11 75,8 90,6' },
                                        ].map((kpi, i) => (
                                            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{kpi.label}</div>
                                                <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight">{kpi.val}</div>
                                                <div className="flex items-center justify-between mt-1.5 gap-1">
                                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                                                        <TrendingUp className="w-2.5 h-2.5" />
                                                        {kpi.change}
                                                    </span>
                                                    <svg width="36" height="14" viewBox="0 0 90 26" fill="none" className="shrink-0">
                                                        <polyline points={kpi.pts} stroke={kpi.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Split: Ürünlerim & Son Siparişler */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
                                        {/* Ürünlerim Card */}
                                        <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                                                <div>
                                                    <div className="text-xs font-black text-slate-900">Ürünlerim</div>
                                                    <div className="text-[9px] text-slate-400 font-semibold">3 aktif ürün listeleniyor</div>
                                                </div>
                                                <span className="text-[9px] font-bold text-[#5500FF] bg-[#5500FF]/10 px-2 py-0.5 rounded-md">
                                                    + Yeni Ürün
                                                </span>
                                            </div>

                                            <div className="space-y-1.5">
                                                {[
                                                    { name: 'Notion Yaşam Planlayıcı', tag: 'DİJİTAL', price: '₺290', iconBg: 'bg-emerald-50 text-emerald-600' },
                                                    { name: '1-on-1 Strateji Seansı', tag: 'KOÇLUK', price: '₺1.500', iconBg: 'bg-violet-50 text-[#5500FF]' },
                                                    { name: 'Pasif Gelir & E-Kitap', tag: 'E-KİTAP', price: '₺350', iconBg: 'bg-amber-50 text-amber-600' },
                                                ].map((prod, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70 border border-slate-100/80 gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0", prod.iconBg)}>
                                                                <Package className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">{prod.name}</div>
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{prod.tag}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-[11px] font-black text-[#5500FF] font-mono">{prod.price}</span>
                                                            {/* Active Switch */}
                                                            <div className="w-6 h-3.5 bg-emerald-500 rounded-full flex items-center justify-end px-0.5 shadow-2xs">
                                                                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Son Siparişler Card */}
                                        <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-2xs flex flex-col justify-between">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                                                <div>
                                                    <div className="text-xs font-black text-slate-900">Son Siparişler</div>
                                                    <div className="text-[9px] text-slate-400 font-semibold">Anlık gerçekleşen satışlar</div>
                                                </div>
                                                <span className="text-[9px] font-bold text-[#5500FF]">
                                                    Tümünü Gör →
                                                </span>
                                            </div>

                                            <div className="space-y-1.5">
                                                {[
                                                    { customer: 'Deniz Yılmaz', item: 'Notion Planlayıcı', amount: '₺290', time: '2 dk önce' },
                                                    { customer: 'Can Kaya', item: 'Strateji Seansı', amount: '₺1.500', time: '14 dk önce' },
                                                    { customer: 'Zeynep Aydın', item: 'E-Kitap Kılavuz', amount: '₺350', time: '1 sa önce' },
                                                ].map((ord, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/70 border border-slate-100/80 gap-2">
                                                        <div className="min-w-0">
                                                            <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">{ord.customer}</div>
                                                            <div className="text-[9px] text-slate-400 truncate">{ord.item} · {ord.time}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-[11px] font-black text-slate-900 font-mono">{ord.amount}</span>
                                                            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded-full">
                                                                Ödendi
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Step 2 & Step 3 */}
                    <div className="lg:col-span-1 flex flex-col gap-8 justify-between">
                        {/* Medium Card: Step 2 - Customization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex-1 bg-card backdrop-blur-xl rounded-[40px] p-8 md:p-10 flex flex-col justify-between group relative overflow-hidden text-foreground border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-soft hover:shadow-premium"
                        >
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t('landing.how_it_works.step2.title')}</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-10">
                                    {t('landing.how_it_works.step2.desc')}
                                </p>
                                <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-xl group-hover:scale-[1.03] transition-all duration-500">
                                    <div className="flex items-center gap-3">
                                        <SetyLogo size="sm" className="w-8 h-8" />
                                        <span className="text-xs font-bold text-slate-900 tracking-tight">sety.store/nova</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <div className="absolute -bottom-16 -right-16 opacity-10 blur-3xl w-48 h-48 bg-primary rounded-full" />
                        </motion.div>

                        {/* Medium Card: Step 3 - Global Payments */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 bg-white rounded-[40px] p-8 md:p-10 flex flex-col justify-between group relative overflow-hidden border border-slate-100 hover:border-[#5500ff]/20 transition-all duration-500 shadow-sm hover:shadow-xl"
                        >
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900">{t('landing.how_it_works.step3.title')}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">
                                    {t('landing.how_it_works.step3.desc')}
                                </p>
                            </div>
                            <div className="p-5 bg-emerald-50 border border-emerald-100/60 rounded-3xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                                        ✓
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 tracking-tight">%0 Komisyon · Anında Hesabına</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
