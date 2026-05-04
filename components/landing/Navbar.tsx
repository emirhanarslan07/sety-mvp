'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

export function Navbar() {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    return (
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
            <header
                className="w-full max-w-6xl transition-all duration-500 ease-in-out pointer-events-auto flex items-center justify-between px-6 py-5 bg-transparent border border-transparent rounded-none"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <SetyLogo size="md" className="group-hover:scale-110 transition-transform" />
                    <span translate="no" className="notranslate text-[26px] font-bold tracking-tight text-foreground font-logo">
                        Sety
                    </span>
                </Link>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth?mode=login">
                        <Button variant="ghost" className="font-bold text-[15px] px-6 h-12 hover:bg-slate-100/80 transition-all">
                            {t('landing.nav.login')}
                        </Button>
                    </Link>
                    <Link href="/auth?mode=signup">
                        <Button className="h-12 text-[15px] font-black px-8 bg-[#5500ff] hover:bg-[#4400cc] text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            {t('landing.nav.signup')}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-3 pointer-events-auto">
                    <button
                        className="p-2 text-foreground transition-transform active:scale-95"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-4 right-4 md:hidden pointer-events-auto"
                    >
                        <div className="bg-background/95 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] p-6 shadow-premium flex flex-col gap-3">
                            <Link href="/auth?mode=login" className="w-full">
                                <Button variant="ghost" className="w-full justify-center h-16 text-xl font-bold rounded-2xl">
                                    {t('landing.nav.login')}
                                </Button>
                            </Link>
                            <Link href="/auth?mode=signup" className="w-full">
                                <Button className="w-full justify-center h-16 text-xl font-black bg-[#5500ff] hover:bg-[#4400cc] text-white rounded-2xl">
                                    {t('landing.nav.signup')}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


