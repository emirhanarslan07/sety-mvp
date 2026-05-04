'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, ChevronLeft, ChevronRight, User, Instagram, Youtube, Zap } from 'lucide-react';

import { useTranslation } from '@/lib/i18n/context';

// Mini Store Preview to show actual theme aesthetics
const MiniStorePreview = ({ themeId, color, font, buttonStyle }: { themeId: string; color: string; font: string; buttonStyle: string }) => {
    const fontStyles = {
        'Inter': 'font-inter',
        'Plus Jakarta': 'font-plus_jakarta',
        'Outfit': 'font-outfit',
        'Space Mono': 'font-space_mono',
        'Playfair': 'font-playfair',
        'Montserrat': 'font-montserrat',
    }[font] || 'font-sans';

    const buttonRadius = {
        'rounded': 'rounded-full',
        'semi': 'rounded-2xl',
        'sharp': 'rounded-sm'
    }[buttonStyle] || 'rounded-full';

    // Simulated data for the preview
    const previewData = {
        name: themeId === 'luxury-gold' ? 'Isabella Smith' : themeId === 'arctic-glass' ? 'Yuna Parker' : themeId === 'sunset-pastel' ? 'Nora Hayes' : themeId === 'midnight-neon' ? 'Ethan Walker' : 'Joanna Kelly',
        bio: themeId === 'luxury-gold' ? 'Helping you win on social media.' : 'Digital products & strategy.',
        avatar: {
            'arctic-glass': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            'midnight-neon': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            'luxury-gold': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            'sunset-pastel': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
            'cyber-future': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        }[themeId] || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
        productImg: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=100'
    };

    const isLight = !['midnight-neon', 'luxury-gold', 'cyber-future'].includes(themeId);

    return (
        <div className={cn(
            "w-full h-full relative overflow-hidden flex flex-col items-center pt-10 px-5 transition-all duration-500",
            themeId === 'midnight-neon' || themeId === 'luxury-gold' || themeId === 'cyber-future' ? "bg-[#0A0B10]" :
                themeId === 'arctic-glass' ? "bg-[#F4F7FF]" :
                    themeId === 'sunset-pastel' ? "bg-[#FF3B8E]" :
                        themeId === 'dreamy-mesh' ? "bg-[#f8f7ff]" :
                            themeId === 'soft-clay' ? "bg-[#F0F2F5]" :
                                themeId === 'neo-brutalist' ? "bg-[#FACC15]" : "bg-white"
        )}>
            {/* Theme Background Enhancements (Stan-level fidelity) */}
            {themeId === 'sunset-pastel' && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B8E] via-[#FF5DA2] to-[#FF3B8E]" />
            )}
            {themeId === 'dreamy-mesh' && (
                <div className="absolute inset-0 bg-[#f8f7ff] overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-blue-400/20 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-purple-400/20 blur-[100px] rounded-full" />
                </div>
            )}
            {themeId === 'midnight-neon' && (
                <div className="absolute inset-0 bg-[#0A0B10]">
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#C4FF00]/10 to-transparent" />
                </div>
            )}

            {/* Profile Section (Custom for some themes) */}
            <div className={cn(
                "flex flex-col items-center w-full z-10",
                themeId === 'sunset-pastel' ? "flex-row items-center gap-4 px-2" : ""
            )}>
                <div className={cn(
                    "relative w-24 h-24 rounded-full border-[3px] border-white/50 shadow-2xl overflow-hidden shrink-0 transition-all duration-500",
                    themeId === 'neo-brutalist' ? "rounded-2xl border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" :
                        themeId === 'soft-clay' ? "rounded-[32px] bg-[#F0F2F5] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] border-transparent" : "",
                    themeId === 'sunset-pastel' ? "w-28 h-28 rounded-3xl border-transparent shadow-2xl" : ""
                )}>
                    <img src={previewData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>

                <div className={cn(
                    "mt-5 text-center w-full px-2",
                    themeId === 'sunset-pastel' ? "mt-0 text-left flex-1" : ""
                )}>
                    <h4 className={cn(
                        "text-[20px] font-black tracking-tight leading-none",
                        isLight && themeId !== 'sunset-pastel' ? "text-slate-900" : "text-white",
                        fontStyles
                    )}>
                        {previewData.name}
                    </h4>
                    <p className={cn(
                        "text-[12px] mt-2 font-medium leading-snug max-w-[200px] mx-auto",
                        themeId === 'sunset-pastel' ? "mx-0 pr-4 text-white" : 
                        isLight ? "text-slate-500" : "text-white/70"
                    )}>
                        {previewData.bio}
                    </p>
                </div>
            </div>

            {/* Social Icons (Refined to match Stan) */}
            <div className={cn(
                "flex gap-3 mt-6 z-10",
                themeId === 'sunset-pastel' ? "self-start pl-2" : ""
            )}>
                {[Instagram, Youtube, Zap].map((Icon, i) => (
                    <div key={i} className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                        themeId === 'sunset-pastel' ? "text-white border-none bg-white/10" :
                        themeId === 'midnight-neon' || themeId === 'cyber-future' ? "bg-white/5 border border-white/10" : "bg-white shadow-sm border border-slate-100"
                    )}>
                        <Icon className={cn("w-4 h-4", themeId === 'sunset-pastel' ? "text-white" : isLight ? "text-slate-400" : "text-slate-300")} />
                    </div>
                ))}
            </div>

            {/* Product Cards (Rich fidelity like Stan Store) */}
            <div className="w-full mt-6 space-y-3 z-10 px-1">
                {[1, 2].map(i => {
                    if (i === 2 && !['sunset-pastel', 'luxury-gold'].includes(themeId)) return null;
                    return (
                        <div
                            key={i}
                            className={cn(
                                "group p-2.5 w-full flex flex-col gap-2 border transition-all duration-500",
                                themeId === 'neo-brutalist' ? "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl" :
                                    themeId === 'soft-clay' ? "bg-[#F0F2F5] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] border-transparent rounded-[24px]" :
                                        themeId === 'arctic-glass' ? "bg-white/60 border-white/40 backdrop-blur-md rounded-3xl" :
                                            themeId === 'sunset-pastel' ? "bg-white border-transparent rounded-[24px] shadow-sm" :
                                                themeId === 'midnight-neon' ? "bg-white/10 border-white/10 rounded-3xl" : "bg-white border-slate-100 shadow-sm rounded-3xl"
                            )}
                        >
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                                    <img src={i === 1 ? previewData.productImg : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=100'} alt="Product" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-1 text-left">
                                    <h5 className={cn(
                                        "text-[11px] font-black tracking-tight",
                                        isLight ? "text-slate-900" : "text-white"
                                    )}>
                                        {i === 1 ? 'Free Ebook Guide' : '1:1 Coaching'}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-[#5500ff]">{i === 1 ? '$0' : '$100'}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className={cn("text-[9px] font-bold opacity-40", isLight ? "text-slate-500" : "text-slate-400")}>5.0 ⭐</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "h-9 w-full flex items-center justify-center gap-2 text-[10px] font-black transition-all shadow-md group-hover:scale-[1.02]",
                                    buttonRadius,
                                    themeId === 'sunset-pastel' ? "bg-white text-pink-600 shadow-sm" : "text-white"
                                )}
                                style={themeId !== 'sunset-pastel' ? { backgroundColor: color } : {}}
                            >
                                {themeId === 'sunset-pastel' ? 'Join Now' : 'Get it now'} <ChevronRight className="w-3 h-3" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Elements (Optionally for some themes) */}
            {themeId === 'neo-brutalist' && (
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#5500ff] border-2 border-black -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
    );
};

export const THEME_TEMPLATES = [
    {
        id: 'arctic-glass',
        name: 'Arctic Glass',
        description: 'Modern, şeffaf ve premium cam tasarımı.',
        color: '#5500ff',
        buttonBg: '#5500ff',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit'
    },
    {
        id: 'midnight-neon',
        name: 'Midnight Neon',
        description: 'Karanlık mod ve parlayan neon detaylar.',
        color: '#C4FF00',
        buttonBg: '#C4FF00',
        buttonText: '#000000',
        buttonStyle: 'rounded',
        font: 'Outfit'
    },
    {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        description: 'Zarif serif fontlar ve altın dokunuşlar.',
        color: '#FBBF24',
        buttonBg: '#0F172A',
        buttonText: '#FBBF24',
        buttonStyle: 'sharp',
        font: 'Playfair'
    },
    {
        id: 'soft-clay',
        name: 'Soft Clay',
        description: '3D yumuşak hatlar ve modern derinlik.',
        color: '#6366F1',
        buttonBg: '#6366F1',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit'
    },
    {
        id: 'cyber-future',
        name: 'Cyber Future',
        description: 'Gelecekten gelen grid ve teknobay tarz.',
        color: '#06B6D4',
        buttonBg: '#06B6D4',
        buttonText: '#000000',
        buttonStyle: 'sharp',
        font: 'Outfit'
    },
    {
        id: 'sunset-pastel',
        name: 'Sunset Pastel',
        description: 'Eğlenceli, yumuşak ve estetik renkler.',
        color: '#FF1A8C',
        buttonBg: '#FF1A8C',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Playfair'
    },
    {
        id: 'dreamy-mesh',
        name: 'Dreamy Mesh',
        description: 'Yumuşak ve sanatsal renk geçişleri.',
        color: '#8B5CF6',
        buttonBg: '#8B5CF6',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit'
    },
    {
        id: 'neo-brutalist',
        name: 'Neo Brutalist',
        description: 'Keskin çizgiler ve cesur kontrastlar.',
        color: '#000000',
        buttonBg: '#FACC15',
        buttonText: '#000000',
        buttonStyle: 'sharp',
        font: 'Plus Jakarta'
    }
];

interface ThemeCarouselProps {
    selectedTheme: string;
    onSelectTheme: (theme: any) => void;
    activeProps?: {
        color: string;
        font: string;
        buttonStyle: string;
    }
}

export default function ThemeCarousel({ selectedTheme, onSelectTheme, activeProps }: ThemeCarouselProps) {
    const { t } = useTranslation();

    const currentThemeIndex = THEME_TEMPLATES.findIndex(t => t.id === selectedTheme);
    const currentTheme = THEME_TEMPLATES[currentThemeIndex] || THEME_TEMPLATES[0];

    const scrollNext = () => {
        const nextIndex = (currentThemeIndex + 1) % THEME_TEMPLATES.length;
        onSelectTheme(THEME_TEMPLATES[nextIndex]);
    };

    const scrollPrev = () => {
        const prevIndex = (currentThemeIndex - 1 + THEME_TEMPLATES.length) % THEME_TEMPLATES.length;
        onSelectTheme(THEME_TEMPLATES[prevIndex]);
    };

    return (
        <div className="space-y-12 py-10">
            {/* The Stan Store UI Centered Carousel */}
            <div className="relative h-[440px] md:h-[560px] flex items-center justify-center overflow-visible px-4">
                <div className="relative w-full max-w-[260px] md:max-w-[300px] h-full flex items-center justify-center">
                    <AnimatePresence mode='popLayout'>
                        {THEME_TEMPLATES.map((theme, index) => {
                            const isActive = selectedTheme === theme.id;
                            const distance = index - currentThemeIndex;
                            const absDistance = Math.abs(distance);

                            // Only show current and neighbors for better performance and clean look
                            if (absDistance > 2 && absDistance < THEME_TEMPLATES.length - 2) return null;

                            // Handle wrap around distance for small arrays
                            let position = distance;
                            if (distance > THEME_TEMPLATES.length / 2) position -= THEME_TEMPLATES.length;
                            if (distance < -THEME_TEMPLATES.length / 2) position += THEME_TEMPLATES.length;

                            const isVisible = Math.abs(position) <= 2;
                            if (!isVisible) return null;

                            return (
                                <motion.button
                                    key={theme.id}
                                    initial={false}
                                    animate={{
                                        x: typeof window !== 'undefined' && window.innerWidth < 768 ? position * 110 : position * 140,
                                        scale: isActive ? 1.05 : 0.82 - (Math.abs(position) * 0.1),
                                        zIndex: 50 - Math.abs(position) * 10,
                                        opacity: 1 - (Math.abs(position) * 0.35),
                                        rotateY: position * 15,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                        mass: 0.8
                                    }}
                                    onClick={() => onSelectTheme(theme)}
                                    className={cn(
                                        "absolute w-full h-[380px] md:h-[520px] rounded-[32px] md:rounded-[48px] overflow-hidden border-2 bg-white flex flex-col shadow-2xl transition-colors duration-500",
                                        isActive ? "border-[#5500ff] shadow-[#5500ff]/20" : "border-slate-100"
                                    )}
                                    style={{
                                        perspective: "1000px"
                                    }}
                                >
                                    <div className="flex-1 relative overflow-hidden">
                                        <MiniStorePreview
                                            themeId={theme.id}
                                            color={isActive && activeProps ? activeProps.color : theme.color}
                                            font={isActive && activeProps ? activeProps.font : theme.font}
                                            buttonStyle={isActive && activeProps ? activeProps.buttonStyle : theme.buttonStyle}
                                        />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Theme Navigator (< Name >) */}
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-14">
                    <button
                        onClick={scrollPrev}
                        className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-90 shadow-sm"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="text-center space-y-1 min-w-[200px]">
                        <h4 className="text-[26px] font-black tracking-tight text-slate-900">
                            {t(`dashboard.store.design.themes.${currentTheme.id}`)}
                        </h4>
                        <p className="text-[14px] font-bold text-slate-400 tracking-wider uppercase opacity-60">
                            {t(`dashboard.store.editors.general.style_preview`)}
                        </p>
                    </div>

                    <button
                        onClick={scrollNext}
                        className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-90 shadow-sm"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
}
