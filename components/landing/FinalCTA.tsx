'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Sparkles, Zap } from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';

export function FinalCTA() {
    const { openModal } = useAuthModal();
    
    return (
        <section className="py-24 md:py-40 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 text-center overflow-hidden border border-slate-800 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)]"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
                        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#5500ff20_0%,transparent_50%)]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-[11px] font-black uppercase tracking-widest mb-10"
                        >
                            <Sparkles className="w-4 h-4 text-[#5500ff]" />
                            KENDİ GELECEĞİNİ İNŞA ET
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-8xl font-[1000] tracking-tighter text-white leading-[0.9] mb-12 font-logo"
                        >
                            İşini Yarın Değil, <br />
                            <span className="text-[#5500ff] drop-shadow-[0_0_30px_rgba(85,0,255,0.4)]">Bugün</span> Başlat
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400 text-lg md:text-2xl font-bold leading-relaxed max-w-2xl mx-auto mb-16"
                        >
                            Teknik karmaşayı bize bırak, sen sadece ne paylaşacağına odaklan.
                            5 dakika içinde dünyanın her yerinden ödeme almaya başla.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Button onClick={() => openModal('signup')} size="xl" className="group relative bg-[#5500ff] hover:bg-[#4400cc] text-white px-16 h-20 rounded-full font-black text-xl shadow-[0_20px_40px_rgba(85,0,255,0.3)] transition-all hover:scale-105 active:scale-95 border-none">
                                Hemen Ücretsiz Başla
                                <div className="absolute inset-x-0 h-1 bottom-0 bg-white/20 blur-sm group-hover:bg-white/30 transition-colors" />
                            </Button>

                            <div className="flex flex-col items-start gap-1 text-left sm:ml-4">
                                <div className="flex items-center gap-2 text-white/60 font-black text-sm uppercase tracking-wider">
                                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                                    Kredi Kartı Gerekmez
                                </div>
                                <div className="flex items-center gap-2 text-white/60 font-black text-sm uppercase tracking-wider">
                                    <Zap className="w-5 h-5 text-[#5500ff]" />
                                    Anında Kurulum
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
