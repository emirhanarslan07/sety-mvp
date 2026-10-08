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
        <section id="pricing" className="py-24 sm:py-32 md:py-40 bg-[#0F0F0F] relative overflow-hidden text-center selection:bg-[#7C3AED]/30 selection:text-white">
            {/* Subtle purple gradient background effect (#1a0533 → #0F0F0F) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a0533] via-[#0F0F0F] to-[#0F0F0F] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7C3AED]/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center">
                {/* 1. Rozet/Badge: ⚡ Lansmana Özel (mor, rounded-full, küçük) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] text-xs font-semibold mb-6 shadow-sm"
                >
                    <span>⚡ Lansmana Özel</span>
                </motion.div>

                {/* 2. Büyük Başlık (font-extrabold, beyaz): "Lansman döneminde tamamen ücretsiz." */}
                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#F5F5F5] tracking-tight leading-[1.1] mb-6 max-w-3xl font-sans"
                >
                    Lansman döneminde tamamen ücretsiz.
                </motion.h2>

                {/* 3. Alt Başlık (zinc-400 rengi #A1A1AA) */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-[#A1A1AA] text-lg sm:text-xl font-normal leading-relaxed max-w-xl mb-10"
                >
                    Komisyon yok. Aylık ücret yok. Kurulum ücreti yok.<br className="hidden sm:inline" /> Sadece mağazanı kur, sat.
                </motion.p>

                {/* 4. Tek bir CTA butonu (mor, büyük, tam genişlik veya ortalanmış): "Şimdi Başla — Kredi kartı gerekmez" */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="w-full sm:w-auto"
                >
                    <button
                        onClick={handleCTA}
                        className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl sm:rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F5F5F5] font-bold text-base sm:text-lg shadow-xl shadow-[#7C3AED]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                    >
                        Şimdi Başla — Kredi kartı gerekmez
                    </button>
                </motion.div>

                {/* 5. Altında 3 küçük ikon + metin (yatay sıra, zinc-500 rengi #71717A) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-zinc-500 text-sm font-medium"
                >
                    <div className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#7C3AED]" strokeWidth={2.5} />
                        <span>2 dakikada kurulum</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#7C3AED]" strokeWidth={2.5} />
                        <span>Sınırsız ürün</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#7C3AED]" strokeWidth={2.5} />
                        <span>%0 komisyon</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
