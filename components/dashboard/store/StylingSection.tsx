'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

interface StylingSectionProps {
    selectedColor: string;
    setSelectedColor: (val: string) => void;
    selectedFont: string;
    setSelectedFont: (val: string) => void;
    buttonStyle: string;
    setButtonStyle: (val: string) => void;
}

const BRAND_COLORS = [
    '#5500ff', // Sety Violet
    '#C4FF00', // Neon Lime
    '#FF1A8C', // Hot Pink
    '#00E5FF', // Electric Cyan
    '#FFD600', // Solar Yellow
    '#8B5CF6', // Soft Purple
    '#0EA5E9', // Sky Blue
    '#F97316', // Bright Orange
    '#10B981', // Emerald
    '#000000', // Pitch Black
    '#6366f1', // Indigo
];

const FONTS = [
    { id: 'Inter', name: 'Inter' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Poppins', name: 'Poppins' },
    { id: 'Outfit', name: 'Outfit' },
    { id: 'Space Mono', name: 'Space Mono' },
    { id: 'Playfair', name: 'Playfair' },
];

const BUTTON_STYLES = [
    { id: 'rounded', radius: 'rounded-full' },
    { id: 'semi', radius: 'rounded-2xl' },
    { id: 'sharp', radius: 'rounded-[5px]' },
];

export default function StylingSection({
    selectedColor,
    setSelectedColor,
    selectedFont,
    setSelectedFont,
    buttonStyle,
    setButtonStyle,
}: StylingSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 pb-8">
            {/* 1. Color Palette */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {t('dashboard.store.sections.color_palette')}
                    </label>
                </div>
                <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-4 md:gap-5">
                    {BRAND_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                                "w-11 h-11 md:w-12 md:h-12 rounded-full transition-all duration-500 flex items-center justify-center hover:scale-110 active:scale-90 border-2 border-white shadow-sm",
                                selectedColor === color
                                    ? "ring-4 ring-slate-100 shadow-xl scale-110"
                                    : "hover:shadow-md opacity-80 hover:opacity-100"
                            )}
                            style={{ backgroundColor: color }}
                        >
                            {selectedColor === color && (
                                <Check className={cn("w-5 h-5", color === '#C4FF00' || color === '#FFD600' || color === '#00E5FF' ? "text-slate-900" : "text-white")} />
                            )}
                        </button>
                    ))}
                    <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#5500ff]/30 hover:text-[#5500ff] transition-all active:scale-95">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 2. Font Selection */}
            <div className="space-y-6">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                    {t('dashboard.store.sections.font_selection')}
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {FONTS.map((font) => (
                        <button
                            key={font.id}
                            onClick={() => setSelectedFont(font.id)}
                            className={cn(
                                "px-4 py-6 md:py-8 rounded-[24px] md:rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-1",
                                selectedFont === font.id
                                    ? "bg-white border-[#5500ff] text-[#5500ff] shadow-xl shadow-indigo-100/50"
                                    : "bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-100"
                            )}
                        >
                            <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Preview</span>
                            <span className="text-[16px] md:text-[18px] font-black" style={{ fontFamily: font.id }}>{font.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Button Styles */}
            <div className="space-y-6">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                    {t('dashboard.store.sections.button_styles')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BUTTON_STYLES.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setButtonStyle(style.id)}
                            className={cn(
                                "flex items-center justify-between sm:flex-col sm:justify-center gap-4 px-6 md:px-8 py-5 md:py-8 rounded-[24px] md:rounded-[32px] border-2 transition-all duration-500 group",
                                buttonStyle === style.id
                                    ? "bg-white border-[#5500ff] shadow-xl shadow-indigo-100/50"
                                    : "bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-100"
                            )}
                        >
                            <span className={cn("text-[14px] md:text-[15px] font-black tracking-tight", buttonStyle === style.id ? "text-[#5500ff]" : "text-slate-400")}>
                                {t(`dashboard.store.design.button_styles.${style.id}`)}
                            </span>
                            <div className={cn(
                                "w-16 md:w-20 h-6 md:h-7 bg-slate-200 transition-all duration-500",
                                style.radius,
                                buttonStyle === style.id ? "bg-[#5500ff] shadow-lg shadow-indigo-200" : "group-hover:bg-slate-300"
                            )} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Can keep for other components if needed, or remove if unused elsewhere
