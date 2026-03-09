'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useTranslation } from '@/lib/i18n/context';

export function CommissionBand() {
    const { t } = useTranslation();
    return (
        <section className="relative py-32 md:py-48 flex justify-center items-center overflow-hidden bg-background">
            <div className="w-full max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-16"
                >
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-32 text-center lg:text-left relative">
                        {/* Huge %0 with Animated Circle */}
                        <div className="relative inline-block group">
                            <svg
                                className="absolute -inset-x-28 -inset-y-20 w-[calc(100%+14rem)] h-[calc(100%+10rem)] pointer-events-none z-0"
                                viewBox="0 0 180 100"
                                fill="none"
                            >
                                {/* Max Scale Hand-drawn Purple Circle */}
                                <motion.path
                                    d="M10,50 C10,10 170,10 170,50 C170,90 10,90 15,55"
                                    stroke="#5500ff"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray="800"
                                    strokeOpacity="1"
                                    initial={{ strokeDashoffset: 800 }}
                                    whileInView={{ strokeDashoffset: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            </svg>


                            <span className="relative z-10 font-[1000] text-foreground leading-none tracking-tighter" style={{ fontSize: 'min(32vw, 260px)' }}>
                                %0
                            </span>
                        </div>

                        {/* Balanced Typography on the Right */}
                        <div className="flex flex-col justify-center relative z-10 space-y-1">
                            <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none font-logo">
                                {t('landing.commission_band.title')}
                            </h2>
                            <p className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none font-logo max-w-xl">
                                {t('landing.commission_band.subtitle')}<span className="text-[#5500ff]">{t('landing.commission_band.subtitle_accent')}</span>{t('landing.commission_band.subtitle_end')}
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12"
                    >
                        <Link href="/auth?mode=signup">
                            <Button size="xl" className="px-16 rounded-full font-black text-lg bg-[#5500ff] hover:bg-[#4400cc] shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all active:scale-95 border-none">
                                {t('landing.commission_band.button')} <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="inline-block ml-2"
                                >→</motion.span>
                            </Button>
                        </Link>

                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}


