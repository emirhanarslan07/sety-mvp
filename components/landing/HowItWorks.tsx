'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Store, Share2, Wallet, Zap, ArrowUpRight, Bell, CheckCircle2, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

export function HowItWorks() {
    const { t } = useTranslation();
    return (
        <section className="py-32 md:py-48 bg-background relative overflow-hidden" id="how-it-works">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 text-balance">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-8 leading-tight">
                        {t('landing.how_it_works.title')} <br /><span className="text-[#5500ff]">{t('landing.how_it_works.title_accent')}</span>
                    </h2>
                </div>

                {/* Bento Grid Layout */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-8 h-auto md:min-h-[640px]">

                    {/* Large Card: Step 1 - The Command Center */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 md:row-span-2 bg-white rounded-[48px] p-12 flex flex-col justify-start group border border-border/40 hover:border-primary/20 transition-all duration-500 overflow-hidden relative shadow-soft hover:shadow-premium"
                    >
                        <div className="max-w-sm relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: t('landing.how_it_works.step1.title') }} />
                            <p className="text-muted-foreground font-medium text-base leading-relaxed">
                                {t('landing.how_it_works.step1.desc')}
                            </p>
                        </div>

                        {/* Highly Realistic Dashboard Mockup */}
                        <div className="hidden md:block absolute -bottom-28 -right-16 w-[82%] aspect-[16/10] bg-white rounded-tl-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-slate-100 p-8 transform group-hover:-translate-x-12 group-hover:-translate-y-12 transition-all duration-700">
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                                <div className="flex items-center gap-4">
                                    <SetyLogo size="sm" className="w-10 h-10" />
                                    <div className="space-y-0.5">
                                        <div className="text-[12px] font-black text-[#5500ff] leading-none">{t('landing.how_it_works.step1.badge')}</div>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                            </div>

                            {/* Real Metrics - Made Smaller */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                    <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('landing.how_it_works.step1.metrics.earnings')}</div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tighter">₺4.850,00</div>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="text-[9px] font-bold text-emerald-500">↑ %14</span>
                                        <div className="w-12 h-0.5 bg-emerald-100 rounded-full overflow-hidden">
                                            <div className="w-2/3 h-full bg-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                                    <div className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{t('landing.how_it_works.step1.metrics.customers')}</div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tighter">1,240</div>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="text-[9px] font-bold text-indigo-500">↑ %22</span>
                                        <div className="w-12 h-0.5 bg-indigo-100 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-indigo-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Sales List */}
                            <div className="space-y-3">
                                <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-4 px-1">{t('landing.how_it_works.step1.metrics.activity')}</div>
                                {[
                                    { name: 'E-Ticaret Kursu', type: 'VİDEO', price: '₺490', time: 'Az önce', bg: 'bg-blue-50 text-blue-600' },
                                    { name: 'Fitness Rehberi', type: 'PDF', price: '₺190', time: '12 dk önce', bg: 'bg-orange-50 text-orange-600' },
                                    { name: 'Özel Danışmanlık', type: 'KOÇLUK', price: '₺1.500', time: '1 sa önce', bg: 'bg-emerald-50 text-emerald-600' }
                                ].map((sale, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 group/item hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-black text-[9px] shadow-sm", sale.bg)}>
                                                {sale.type}
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black text-slate-900">{sale.name}</div>
                                                <div className="text-[9px] font-bold text-slate-400">{sale.time}</div>
                                            </div>
                                        </div>
                                        <div className="text-[12px] font-black text-slate-900">{sale.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Medium Card: Step 2 - Customization */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-card backdrop-blur-xl rounded-[40px] p-10 flex flex-col justify-between group relative overflow-hidden text-foreground border border-border/40 hover:border-primary/20 transition-all duration-500 shadow-soft hover:shadow-premium"
                    >
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{t('landing.how_it_works.step2.title')}</h3>
                            <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-10">
                                {t('landing.how_it_works.step2.desc')}
                            </p>
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-xl group-hover:scale-[1.03] transition-all duration-500">
                                <div className="flex items-center gap-3">
                                    <SetyLogo size="sm" className="w-8 h-8" />
                                    <span className="text-xs font-black text-slate-900 tracking-tight">sety.store/aysegul</span>
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
                        className="bg-primary rounded-[40px] p-10 flex flex-col justify-between group relative overflow-hidden shadow-glow-primary"
                    >
                        <div className="relative z-10 text-primary-foreground">
                            <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">{t('landing.how_it_works.step3.title')}</h3>
                            <p className="text-primary-foreground/70 font-medium text-sm leading-relaxed mb-10">
                                {t('landing.how_it_works.step3.desc')}
                            </p>

                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                            <DollarSign className="w-16 h-16 text-white" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
