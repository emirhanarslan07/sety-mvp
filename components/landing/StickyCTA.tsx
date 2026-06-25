'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

export function StickyCTA() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 800px (roughly past Hero)
            if (window.scrollY > 800) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 md:bottom-6 left-0 right-0 z-[100] px-4 md:px-6 pointer-events-none"
                >
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-2 md:p-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-2 md:gap-4">
                            <div className="pl-2 md:pl-4">
                                <p className="text-[9px] md:text-[10px] font-black text-[#5500ff] uppercase tracking-widest leading-none mb-1">{t('landing.sticky_cta.label')}</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900 leading-none">{t('landing.sticky_cta.subtitle')}</p>
                            </div>
                            <Link href="/auth?mode=signup" className="flex-none">
                                <Button className="w-auto px-4 md:px-6 rounded-2xl h-10 md:h-12 bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-xs md:text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                                    {t('landing.sticky_cta.button')} <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="inline-block ml-1"
                                    >→</motion.span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
