'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';
import { useRouter } from 'next/navigation';

export function LaunchPricing() {
    const { openModal } = useAuthModal();
    const router = useRouter();

    const handleCTA = () => {
        if (openModal) {
            openModal('signup');
        } else {
            router.push('/auth');
        }
    };

    return (
        <section id="pricing" className="py-24 sm:py-32 md:py-36 bg-white relative overflow-hidden text-center border-t border-slate-100">
            {/* Subtle soft ambient glow on white canvas */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#5500FF]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
                {/* 1. Rozet/Badge: ⚡ Lansmana Özel */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5500FF]/10 border border-[#5500FF]/20 text-[#5500FF] text-xs font-bold mb-6 shadow-sm"
                >
                    <span>⚡ Lansmana Özel</span>
                </motion.div>

                {/* 2. Büyük Başlık: "Lansman döneminde tamamen ücretsiz." */}
                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-3xl font-sans"
                >
                    Lansman döneminde tamamen ücretsiz.
                </motion.h2>

                {/* 3. Alt Başlık */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mb-10"
                >
                    Komisyon yok. Aylık ücret yok. Kurulum ücreti yok.<br className="hidden sm:inline" /> Sadece mağazanı kur, sat.
                </motion.p>

                {/* 4. Tek bir CTA butonu */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="w-full sm:w-auto"
                >
                    <button
                        onClick={handleCTA}
                        className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl sm:rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#5500FF]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                    >
                        Şimdi Başla — Kredi kartı gerekmez
                    </button>
                </motion.div>

                {/* 5. 3 ikonlu avantaj maddesi */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-500 text-sm font-semibold"
                >
                    <div className="inline-flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>2 dakikada kurulum</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>Sınırsız ürün</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span>%0 komisyon</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
