'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, Store, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';
import { useAuthModal } from '@/context/AuthModalContext';
import { supabase } from '@/lib/supabase/client';

const getAvatarColor = (char: string) => {
    if (!char) return 'bg-slate-500';
    const charCode = char.toUpperCase().charCodeAt(0);
    if (charCode >= 65 && charCode <= 69) return 'bg-purple-500'; // A-E
    if (charCode >= 70 && charCode <= 74) return 'bg-blue-500'; // F-J
    if (charCode >= 75 && charCode <= 79) return 'bg-emerald-500'; // K-O
    if (charCode >= 80 && charCode <= 84) return 'bg-orange-500'; // P-T
    if (charCode >= 85 && charCode <= 90) return 'bg-pink-500'; // U-Z
    return 'bg-slate-500'; // Default
};

export function Navbar() {
    const { t } = useTranslation();
    const { openModal } = useAuthModal();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                const { data } = await supabase.from('user_profiles').select('*').eq('user_id', session.user.id).single();
                setProfile(data);
            }
            setLoading(false);
        };
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setUser(session.user);
                supabase.from('user_profiles').select('*').eq('user_id', session.user.id).single().then(({data}) => setProfile(data));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowUserMenu(false);
    };

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

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {!loading && (
                        user ? (
                            <div className="flex items-center gap-3 relative">
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="font-semibold text-[#5500ff] bg-[#5500ff]/5 text-[15px] px-6 h-12 hover:bg-[#5500ff]/10 transition-all rounded-full shadow-sm flex items-center gap-2 border border-[#5500ff]/10">
                                        <Store className="w-4 h-4" />
                                        Mağazam
                                    </Button>
                                </Link>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className={`relative w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-md overflow-hidden hover:scale-105 transition-transform text-white font-bold text-lg ${!profile?.profile_image_url ? getAvatarColor(user?.email?.[0] || '?') : ''}`}
                                    >
                                        {profile?.profile_image_url ? (
                                            <Image src={profile.profile_image_url} alt="" fill className="object-cover" />
                                        ) : (
                                            user?.email?.[0]?.toUpperCase() || <User className="w-5 h-5 text-white" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 flex flex-col gap-1"
                                            >
                                                <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                                                    <Store className="w-4 h-4 text-slate-400" />
                                                    Mağazam
                                                </Link>
                                                <Link href="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                                                    <Settings className="w-4 h-4 text-slate-400" />
                                                    Ayarlar
                                                </Link>
                                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Çıkış Yap
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Button onClick={() => openModal('login')} variant="ghost" className="font-bold text-[15px] px-6 h-12 hover:bg-slate-100/80 transition-all bg-white rounded-full">
                                    {t('landing.nav.login')}
                                </Button>
                                <Button onClick={() => openModal('signup')} className="h-12 text-[15px] font-black px-8 bg-[#5500ff] hover:bg-[#4400cc] text-white rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                    {t('landing.nav.signup')}
                                </Button>
                            </>
                        )
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-3 pointer-events-auto">
                    <button
                        className="p-2 text-foreground transition-transform active:scale-95 bg-white rounded-full shadow-sm"
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
                        className="absolute top-24 left-4 right-4 md:hidden pointer-events-auto z-50"
                    >
                        <div className="bg-background/95 backdrop-blur-2xl border border-border/40 rounded-[2.5rem] p-6 shadow-premium flex flex-col gap-3">
                            {!loading && (
                                user ? (
                                    <>
                                        <Link href="/dashboard" className="w-full">
                                            <Button variant="ghost" className="w-full justify-center h-16 text-xl font-semibold text-[#5500ff] bg-[#5500ff]/5 rounded-2xl flex items-center gap-2 border border-[#5500ff]/10">
                                                <Store className="w-5 h-5" />
                                                Mağazam
                                            </Button>
                                        </Link>
                                        <Button onClick={handleLogout} variant="ghost" className="w-full justify-center h-16 text-xl font-bold rounded-2xl text-red-500 hover:bg-red-50">
                                            Çıkış Yap
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => { setIsMobileMenuOpen(false); openModal('login'); }} variant="ghost" className="w-full justify-center h-16 text-xl font-bold rounded-2xl">
                                            {t('landing.nav.login')}
                                        </Button>
                                        <Button onClick={() => { setIsMobileMenuOpen(false); openModal('signup'); }} className="w-full justify-center h-16 text-xl font-black bg-[#5500ff] hover:bg-[#4400cc] text-white rounded-2xl">
                                            {t('landing.nav.signup')}
                                        </Button>
                                    </>
                                )
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


