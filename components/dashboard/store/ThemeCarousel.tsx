'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

// ─── Theme data exported for use across the app ───────────────────────────────
export const THEME_TEMPLATES = [
    {
        id: 'arctic-glass',
        name: 'Arctic Glass',
        description: 'Modern, şeffaf ve premium cam tasarımı',
        color: '#5500ff',
        buttonBg: '#5500ff',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit',
        previewBg: 'from-slate-100 to-blue-50',
        accentColor: '#5500ff',
    },
    {
        id: 'midnight-neon',
        name: 'Midnight Neon',
        description: 'Karanlık mod ve parlayan neon detaylar',
        color: '#C4FF00',
        buttonBg: '#C4FF00',
        buttonText: '#000000',
        buttonStyle: 'rounded',
        font: 'Outfit',
        previewBg: 'from-[#0A0B10] to-[#111827]',
        accentColor: '#C4FF00',
    },
    {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        description: 'Zarif serif fontlar ve altın dokunuşlar',
        color: '#FBBF24',
        buttonBg: '#0F172A',
        buttonText: '#FBBF24',
        buttonStyle: 'sharp',
        font: 'Playfair',
        previewBg: 'from-[#0A0B10] to-[#1a1208]',
        accentColor: '#FBBF24',
    },
    {
        id: 'soft-clay',
        name: 'Soft Clay',
        description: '3D yumuşak hatlar ve modern derinlik',
        color: '#6366F1',
        buttonBg: '#6366F1',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit',
        previewBg: 'from-[#F0F2F5] to-[#E8EBF0]',
        accentColor: '#6366F1',
    },
    {
        id: 'sunset-pastel',
        name: 'Sunset Pastel',
        description: 'Eğlenceli, yumuşak ve estetik renkler',
        color: '#FF1A8C',
        buttonBg: '#FF1A8C',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Playfair',
        previewBg: 'from-[#FF3B8E] to-[#ff6eb5]',
        accentColor: '#FF1A8C',
    },
    {
        id: 'dreamy-mesh',
        name: 'Dreamy Mesh',
        description: 'Yumuşak ve sanatsal renk geçişleri',
        color: '#8B5CF6',
        buttonBg: '#8B5CF6',
        buttonText: '#ffffff',
        buttonStyle: 'rounded',
        font: 'Outfit',
        previewBg: 'from-[#f0ebff] to-[#e8d5ff]',
        accentColor: '#8B5CF6',
    },
    {
        id: 'cyber-future',
        name: 'Cyber Future',
        description: 'Gelecekten gelen grid ve teknobay tarz',
        color: '#06B6D4',
        buttonBg: '#06B6D4',
        buttonText: '#000000',
        buttonStyle: 'sharp',
        font: 'Outfit',
        previewBg: 'from-[#020617] to-[#0c1a2e]',
        accentColor: '#06B6D4',
    },
    {
        id: 'neo-brutalist',
        name: 'Neo Brutalist',
        description: 'Cesur ve dikkat çekici, keskin kontrastlar',
        color: '#000000',
        buttonBg: '#FACC15',
        buttonText: '#000000',
        buttonStyle: 'sharp',
        font: 'Plus Jakarta',
        previewBg: 'from-[#FACC15] to-[#fde047]',
        accentColor: '#000000',
    },
];

// ─── Mini card preview ────────────────────────────────────────────────────────
function ThemeCardPreview({ theme }: { theme: typeof THEME_TEMPLATES[0] }) {
    const isDark = ['midnight-neon', 'luxury-gold', 'cyber-future'].includes(theme.id);
    const isNeo = theme.id === 'neo-brutalist';

    return (
        <div className={cn(
            'w-full h-full bg-gradient-to-br flex flex-col items-center justify-start pt-5 px-4 gap-3 overflow-hidden',
            theme.previewBg
        )}>
            {/* Avatar placeholder */}
            <div className={cn(
                'w-10 h-10 rounded-full flex-shrink-0 border-2',
                isDark ? 'bg-white/10 border-white/20' : isNeo ? 'bg-black border-2 border-black shadow-[3px_3px_0_black]' : 'bg-white/60 border-white/80'
            )}>
                <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className={cn(
                        'w-5 h-5 rounded-full',
                        isDark ? 'bg-white/20' : isNeo ? 'bg-yellow-400' : 'bg-slate-300'
                    )} />
                </div>
            </div>

            {/* Name bar */}
            <div className={cn(
                'h-2.5 w-20 rounded-full',
                isDark ? 'bg-white/20' : isNeo ? 'bg-black' : 'bg-slate-300/60'
            )} />

            {/* Product card 1 */}
            <div className={cn(
                'w-full rounded-xl p-2 flex items-center gap-2',
                isDark ? 'bg-white/8 border border-white/10' : isNeo ? 'bg-white border-2 border-black shadow-[2px_2px_0_black]' : 'bg-white/70 border border-white/60'
            )}>
                <div className={cn(
                    'w-8 h-8 rounded-lg flex-shrink-0',
                    isDark ? 'bg-white/10' : 'bg-slate-200/60'
                )} />
                <div className="flex-1 space-y-1">
                    <div className={cn('h-2 w-16 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300/60')} />
                    <div className={cn('h-1.5 w-10 rounded-full', isDark ? 'bg-white/10' : 'bg-slate-200/40')} />
                </div>
                <div
                    className={cn('h-6 w-12 rounded-md flex-shrink-0 text-[7px] font-black flex items-center justify-center',
                        theme.id === 'neo-brutalist' ? 'rounded-none border-2 border-black shadow-[1px_1px_0_black]' :
                        theme.buttonStyle === 'sharp' ? 'rounded-sm' : theme.buttonStyle === 'semi' ? 'rounded-lg' : 'rounded-full'
                    )}
                    style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
                >
                    Al
                </div>
            </div>

            {/* Product card 2 */}
            <div className={cn(
                'w-full rounded-xl p-2 flex items-center gap-2',
                isDark ? 'bg-white/8 border border-white/10' : isNeo ? 'bg-white border-2 border-black shadow-[2px_2px_0_black]' : 'bg-white/70 border border-white/60'
            )}>
                <div className={cn(
                    'w-8 h-8 rounded-lg flex-shrink-0',
                    isDark ? 'bg-white/10' : 'bg-slate-200/60'
                )} />
                <div className="flex-1 space-y-1">
                    <div className={cn('h-2 w-12 rounded-full', isDark ? 'bg-white/20' : 'bg-slate-300/60')} />
                    <div className={cn('h-1.5 w-8 rounded-full', isDark ? 'bg-white/10' : 'bg-slate-200/40')} />
                </div>
                <div
                    className={cn('h-6 w-12 rounded-md flex-shrink-0 text-[7px] font-black flex items-center justify-center',
                        theme.id === 'neo-brutalist' ? 'rounded-none border-2 border-black shadow-[1px_1px_0_black]' :
                        theme.buttonStyle === 'sharp' ? 'rounded-sm' : theme.buttonStyle === 'semi' ? 'rounded-lg' : 'rounded-full'
                    )}
                    style={{ backgroundColor: theme.buttonBg, color: theme.buttonText }}
                >
                    Al
                </div>
            </div>
        </div>
    );
}

// ─── Main exported component ─────────────────────────────────────────────────
export interface ThemeCarouselProps {
    selectedTheme: string;
    onSelectTheme: (theme: any) => void;
}

export default function ThemeCarousel({ selectedTheme, onSelectTheme }: ThemeCarouselProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {THEME_TEMPLATES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                    <button
                        key={theme.id}
                        onClick={() => onSelectTheme(theme)}
                        className={cn(
                            'group relative flex flex-col rounded-[24px] overflow-hidden border-2 transition-all duration-300 active:scale-[0.97] text-left',
                            isSelected
                                ? 'border-[#5500ff] shadow-[0_0_0_4px_rgba(85,0,255,0.12)] shadow-lg'
                                : 'border-slate-100 hover:border-[#5500ff]/30 hover:shadow-md'
                        )}
                    >
                        {/* Preview area */}
                        <div className="h-[120px] w-full relative overflow-hidden">
                            <ThemeCardPreview theme={theme} />

                            {/* Selected checkmark */}
                            {isSelected && (
                                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#5500ff] flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-200">
                                    <Check className="w-4 h-4 text-white stroke-[3px]" />
                                </div>
                            )}

                            {/* Hover overlay */}
                            {!isSelected && (
                                <div className="absolute inset-0 bg-[#5500ff]/0 group-hover:bg-[#5500ff]/5 transition-colors duration-300" />
                            )}
                        </div>

                        {/* Theme info */}
                        <div className={cn(
                            'px-4 py-3 border-t transition-colors duration-300',
                            isSelected ? 'bg-indigo-50/50 border-[#5500ff]/10' : 'bg-white border-slate-100 group-hover:bg-slate-50/50'
                        )}>
                            <h4 className={cn(
                                'text-[13px] font-black tracking-tight truncate transition-colors',
                                isSelected ? 'text-[#5500ff]' : 'text-slate-900'
                            )}>
                                {theme.name}
                            </h4>
                            <p className="text-[11px] font-bold text-slate-400 leading-snug mt-0.5 line-clamp-1">
                                {theme.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
