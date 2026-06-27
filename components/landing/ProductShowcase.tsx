'use client';

import { motion } from 'framer-motion';
import { Smartphone, Laptop, CheckCircle2, DollarSign, BarChart3, Users, Zap, Calendar, GraduationCap, Globe, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';
import Image from 'next/image';

export function ProductShowcase() {
    const { t } = useTranslation();
    return (
        <section className="relative py-16 md:py-24 bg-[#f8f7ff] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-8 font-logo leading-[0.9] text-balance"
                    >
                        {t('landing.product_showcase.title')} <br />
                        <span className="text-[#5500ff]">{t('landing.product_showcase.title_accent')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-500 font-medium tracking-tight font-jakarta leading-relaxed"
                    >
                        {t('landing.product_showcase.subtitle')}
                        <br />
                        <span className="inline-block mt-4 text-[#5500ff] font-bold">{t('landing.product_showcase.trial')}</span>
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Centered Showcase Area */}
                    <div className="relative flex flex-col items-center justify-center min-h-[500px] md:min-h-[700px] py-10">

                        {/* ── Dot Grid Background ── */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: 'radial-gradient(circle, #c4b5fd 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                            opacity: 0.35,
                            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
                        }} />

                        {/* ── Outer purple glow ring ── */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
                            background: 'radial-gradient(circle, rgba(85,0,255,0.18) 0%, rgba(85,0,255,0.06) 45%, transparent 70%)',
                            filter: 'blur(40px)',
                        }} />
                        {/* ── Inner glow (tighter, brighter) ── */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full pointer-events-none" style={{
                            background: 'radial-gradient(circle, rgba(85,0,255,0.22) 0%, transparent 70%)',
                            filter: 'blur(20px)',
                        }} />

                        {/* ── Floating Card 1: Revenue (Top Left) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-[8%] -left-2 md:-left-32 z-30 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:block min-w-[200px]"
                            style={{ animation: 'floatA 4s ease-in-out infinite', rotate: '-2deg' }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#5500ff]/15 flex items-center justify-center text-[#5500ff] shrink-0">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none">{t('landing.product_showcase.cards.revenue.title')}</div>
                                    <div className="text-[20px] font-[1000] text-gray-900 leading-tight">₺42.850</div>
                                </div>
                            </div>
                            <div className="h-[4px] bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full w-[78%] bg-gradient-to-r from-[#5500ff] to-[#a855f7] rounded-full" />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] text-gray-400 font-semibold">{t('landing.product_showcase.cards.revenue.goal')}</span>
                                <span className="text-[9px] text-[#5500ff] font-black">78%</span>
                            </div>
                        </motion.div>

                        {/* ── Floating Card 2: Live Sale (Top Right) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 }}
                            className="absolute top-[10%] -right-2 md:-right-20 z-30 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:block min-w-[210px]"
                            style={{ animation: 'floatB 5s ease-in-out infinite', rotate: '1.5deg' }}
                        >
                            <div className="flex items-center gap-2.5 mb-3.5">
                                <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
                                    <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-60 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{t('landing.product_showcase.cards.live_sale.title')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/aysegul.png"
                                    width={40}
                                    height={40}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <div>
                                    <div className="text-[13px] font-[900] text-gray-900 leading-none">aysegul_fitness</div>
                                    <div className="text-[12px] font-[700] text-[#5500ff] mt-1">₺1.500 · Strateji Görüşmesi</div>
                                </div>
                            </div>
                            <div className="mt-3 text-[8.5px] text-gray-400 font-semibold">{t('landing.product_showcase.cards.live_sale.time')} · {t('landing.product_showcase.cards.live_sale.country')} 🇹🇷</div>
                        </motion.div>

                        {/* ── Floating Card 3: Customer Avatars (Bottom Left) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-[10%] -left-4 md:-left-28 z-30 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:block min-w-[200px]"
                            style={{ animation: 'floatA 6s ease-in-out infinite 1s', rotate: '2deg' }}
                        >
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-3.5">{t('landing.product_showcase.cards.customers.title')}</div>
                            <div className="flex -space-x-3 mb-3.5">
                                {[
                                    'https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=b6e3f4',
                                    'https://api.dicebear.com/7.x/micah/svg?seed=Aneka&backgroundColor=c0aede',
                                    'https://api.dicebear.com/7.x/micah/svg?seed=Leo&backgroundColor=ffd5dc',
                                    'https://api.dicebear.com/7.x/micah/svg?seed=Mia&backgroundColor=ffdfbf',
                                ].map((src, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{
                                            duration: 2 + i * 0.5,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            delay: i * 0.2
                                        }}
                                        className="relative"
                                    >
                                        <img
                                            src={src}
                                            alt="Customer"
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                                        />
                                    </motion.div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#5500ff] flex items-center justify-center shadow-sm">
                                    <span className="text-[9px] font-black text-white">2k+</span>
                                </div>
                            </div>
                            <div className="text-[16px] font-[900] text-gray-900 leading-none">{t('landing.product_showcase.cards.customers.count')}</div>
                            <div className="text-[9px] text-green-600 font-bold mt-1">{t('landing.product_showcase.cards.customers.trend')}</div>
                        </motion.div>

                        {/* ── Floating Card 4: Sparkline (Bottom Right) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.65 }}
                            className="absolute bottom-[6%] -right-2 md:-right-32 z-30 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:block min-w-[200px]"
                            style={{ animation: 'floatB 4.5s ease-in-out infinite 0.5s', rotate: '-1.5deg' }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{t('landing.product_showcase.cards.chart.title')}</div>
                                <div className="text-[12px] font-black text-green-600">↑ %34</div>
                            </div>
                            <svg width="100%" height="56" viewBox="0 0 120 44" fill="none" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polyline points="0,38 20,30 35,33 50,20 70,16 90,8 120,2" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="0,38 20,30 35,33 50,20 70,16 90,8 120,2 120,44 0,44" fill="url(#sparkGrad)" stroke="none" />
                            </svg>
                            <div className="flex justify-between mt-2">
                                <span className="text-[9px] text-gray-400 font-semibold">{t('landing.product_showcase.cards.chart.days', { returnObjects: true })[0]}</span>
                                <span className="text-[9px] text-gray-400 font-semibold">{t('landing.product_showcase.cards.chart.days', { returnObjects: true })[1]}</span>
                                <span className="text-[9px] text-gray-400 font-semibold">{t('landing.product_showcase.cards.chart.days', { returnObjects: true })[2]}</span>
                                <span className="text-[9px] text-gray-900 font-black">{t('landing.product_showcase.cards.chart.days', { returnObjects: true })[3]}</span>
                            </div>
                        </motion.div>

                        {/* ── Card 5: Link in Bio (Middle Left) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.55 }}
                            className="absolute top-[38%] -translate-y-1/2 -left-2 md:-left-40 z-30 bg-white/95 backdrop-blur-2xl px-5 py-4 rounded-[1.8rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:flex items-center gap-3.5 min-w-[210px]"
                            style={{ animation: 'floatA 5.5s ease-in-out infinite 0.8s', rotate: '-1deg' }}
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#5500ff]/10 flex items-center justify-center shrink-0">
                                <svg className="w-4.5 h-4.5 text-[#5500ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">{t('landing.product_showcase.cards.link_in_bio.title')}</div>
                                <div className="text-[14px] font-bold text-gray-900 truncate tracking-tight">sety.store/aysegul_dijital</div>
                            </div>
                            <div className="ml-auto shrink-0">
                                <svg className="w-4.5 h-4.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* ── Card 6: Payment Received (Middle Right) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="absolute top-[40%] -translate-y-1/2 -right-2 md:-right-24 z-30 bg-white/95 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden sm:block min-w-[200px]"
                            style={{ animation: 'floatB 6s ease-in-out infinite 1.2s', rotate: '2.5deg' }}
                        >
                            <div className="flex items-center gap-3 mb-3.5">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <svg className="w-4.5 h-4.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">{t('landing.product_showcase.cards.payment.title')}</span>
                            </div>
                            <div className="text-[24px] font-[1000] text-gray-900 leading-none mb-2">₺990</div>
                            <span className="text-[10px] text-slate-400 font-bold tracking-tight">{t('landing.product_showcase.cards.payment.stripe')}</span>
                        </motion.div>


                        {/* IPHONE MOCKUP — Clean Uniform Frame */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-20 w-[300px] h-[650px] rounded-[3rem]"
                            style={{
                                background: '#222222',
                                padding: '8px',
                                boxShadow: '0 60px 120px -20px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)',
                            }}
                        >
                            {/* Inner Screen */}
                            <div className="h-full w-full bg-[#FDFDFF] rounded-[2.5rem] overflow-hidden relative flex flex-col">

                                {/* Dynamic Island */}
                                <div className="absolute top-[14px] inset-x-0 flex justify-center z-50 pointer-events-none">
                                    <div style={{ width: '80px', height: '26px', background: 'black', borderRadius: '14px' }} />
                                </div>

                                {/* Storefront Content */}
                                <div className="flex-1 flex flex-col bg-[#FDFDFF] overflow-hidden pt-[56px] relative">

                                    {/* Profile Header */}
                                    <div className="px-6 pb-3 flex flex-col items-center bg-[#FDFDFF] z-20 relative">
                                        <div className="w-[62px] h-[62px] rounded-full overflow-hidden border-[3px] border-white shadow-lg mb-2.5">
                                            <Image
                                                src="/aysegul.png"
                                                width={62}
                                                height={62}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h4 className="font-bold text-[16px] text-gray-900 tracking-tighter leading-none">aysegul_dijital</h4>
                                        <p className="text-[8px] text-gray-400 font-bold tracking-wide mt-1.5 uppercase leading-none">{t('landing.product_showcase.mockup.category')}</p>
                                    </div>

                                    {/* Scrolling Products */}
                                    <div className="relative flex-1 overflow-hidden px-4 mb-[72px]">
                                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#FDFDFF] to-transparent z-10" />
                                        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#FDFDFF] to-transparent z-10" />
                                        <motion.div
                                            animate={{ y: ["0%", "-50%"] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            className="space-y-3 pt-3"
                                        >
                                            {[...Array(2)].map((_, listIdx) => (
                                                <div key={listIdx} className="space-y-3">
                                                    {(t('landing.product_showcase.mockup.items', { returnObjects: true }) as Array<{ title: string; price: string }>).map((p, i) => {
                                                        const labels = [
                                                            t('landing.product_showcase.mockup.products.digital'),
                                                            t('landing.product_showcase.mockup.products.booking'),
                                                            t('landing.product_showcase.mockup.products.course'),
                                                            t('landing.product_showcase.mockup.products.membership'),
                                                            t('landing.product_showcase.mockup.products.digital')
                                                        ];
                                                        return (
                                                            <div key={`${listIdx}-${i}`} className="bg-white px-4 py-3 rounded-[1.2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.07)] border border-gray-100/80 flex items-center justify-between gap-2">
                                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                                    <span className="text-[6.5px] font-black text-[#5500ff] tracking-wider uppercase leading-none">{labels[i]}</span>
                                                                    <span className="text-[11px] font-[900] text-gray-900 tracking-tight leading-snug truncate">{p.title}</span>
                                                                </div>
                                                                <span className="text-[11.5px] font-black text-[#5500ff] shrink-0">{p.price}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    {/* POWERED BY SETY */}
                                    <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-white via-white/95 to-transparent pt-12 pb-5 px-6 flex flex-col items-center">
                                        <div className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2 rounded-[0.9rem] shadow-lg">
                                            <SetyLogo size="sm" />
                                            <span className="text-[10px] font-black tracking-[0.16em] uppercase">{t('landing.product_showcase.mockup.badge')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
