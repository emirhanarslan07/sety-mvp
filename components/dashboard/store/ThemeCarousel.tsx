'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

import { useTranslation } from '@/lib/i18n/context';

// Visual Architecture Thumbnails for Themes
const ThemeThumbnail = ({ themeId, color }: { themeId: string; color: string }) => {
    switch (themeId) {
        case 'arctic-glass':
            return (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                    <div className="w-16 h-8 rounded-full bg-white/30 border border-white/40 shadow-xl backdrop-blur-md" />
                </div>
            );
        case 'midnight-neon':
            return (
                <div className="w-full h-full bg-[#0A0C14] relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,255,0,0.1),transparent_70%)]" />
                    <div className="w-16 h-8 rounded-full border-2 border-[#C4FF00] shadow-[0_0_15px_rgba(196,255,0,0.4)]" />
                </div>
            );
        case 'sunset-pastel':
            return (
                <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-pink-500 relative flex items-center justify-center">
                    <div className="w-16 h-8 rounded-2xl bg-white/80 shadow-md" />
                </div>
            );
        case 'dreamy-mesh':
            return (
                <div className="w-full h-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 relative flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#fff,transparent)]" />
                    <div className="w-16 h-8 rounded-full bg-white/40 backdrop-blur-md shadow-lg" />
                </div>
            );
        case 'neo-brutalist':
            return (
                <div className="w-full h-full bg-yellow-400 relative flex items-center justify-center border-b-4 border-black">
                    <div className="w-16 h-8 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                </div>
            );
        case 'luxury-gold':
            return (
                <div className="w-full h-full bg-[#0F172A] relative flex items-center justify-center">
                    <div className="w-16 h-8 rounded-sm border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                </div>
            );
        case 'soft-clay':
            return (
                <div className="w-full h-full bg-[#F0F2F5] relative flex items-center justify-center">
                    <div className="w-16 h-8 rounded-2xl bg-[#F0F2F5] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]" />
                </div>
            );
        case 'cyber-future':
            return (
                <div className="w-full h-full bg-[#020617] relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div className="w-16 h-8 rounded-sm border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20" />
                </div>
            );
        default:
            return (
                <div className="w-full h-full bg-slate-50 relative flex items-center justify-center">
                    <div className="w-16 h-8 rounded-full" style={{ backgroundColor: color }} />
                </div>
            );
    }
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
}

export default function ThemeCarousel({ selectedTheme, onSelectTheme }: ThemeCarouselProps) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar -mx-2 px-2">
            {THEME_TEMPLATES.map((theme) => {
                const isActive = selectedTheme === theme.id;
                const themeKey = theme.id.replace(/-/g, '_');
                return (
                    <motion.button
                        key={theme.id}
                        whileHover={{ y: -6 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectTheme(theme)}
                        className={cn(
                            "flex-shrink-0 w-[200px] group relative text-left transition-all",
                            "rounded-[32px] overflow-hidden border-2 bg-white",
                            isActive ? "border-[#5500ff] shadow-2xl shadow-indigo-100" : "border-slate-100 hover:border-slate-200"
                        )}
                    >
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <ThemeThumbnail themeId={theme.id} color={theme.color} />
                            {isActive && (
                                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#5500ff] flex items-center justify-center text-white shadow-lg z-20">
                                    <CheckCircle2 className="w-4.5 h-4.5" />
                                </div>
                            )}
                        </div>

                        <div className="p-5 space-y-1">
                            <h4 className="text-[14px] font-black tracking-tight text-slate-900">{theme.name}</h4>
                            <p className="text-[11px] font-bold text-slate-400 leading-tight">
                                {t(`store.design.themes.${themeKey}`) || theme.description}
                            </p>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
