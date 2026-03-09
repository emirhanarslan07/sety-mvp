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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {/* Color Palette */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest opacity-60">
                        {t('store.sections.color_palette')}
                    </label>
                </div>
                <div className="flex flex-wrap gap-4 p-1">
                    {BRAND_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                                "w-10 h-10 rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-95 shadow-sm border-2 border-transparent",
                                selectedColor === color ? "border-slate-200 ring-4 ring-slate-100" : "hover:shadow-md"
                            )}
                            style={{ backgroundColor: color }}
                        >
                            {selectedColor === color && (
                                <Check className={cn("w-5 h-5", color === '#C4FF00' || color === '#FFD600' || color === '#00E5FF' ? "text-slate-900" : "text-white")} />
                            )}
                        </button>
                    ))}
                    {/* Custom Color Picker Placeholder */}
                    <button className="w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#5500ff]/30 hover:text-[#5500ff] transition-all">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Font Selection */}
                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.font_selection')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {FONTS.map((font) => (
                            <button
                                key={font.id}
                                onClick={() => setSelectedFont(font.id)}
                                className={cn(
                                    "px-5 py-4 rounded-[20px] border-2 text-[14px] font-bold transition-all text-left",
                                    selectedFont === font.id
                                        ? "bg-white border-[#5500ff]/60 text-[#5500ff] shadow-lg shadow-[#5500ff]/5"
                                        : "bg-slate-50/50 border-slate-100/50 text-slate-500 hover:border-slate-200 hover:bg-white"
                                )}
                            >
                                <span style={{ fontFamily: font.id }}>{font.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Button Styles */}
                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.button_styles')}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {BUTTON_STYLES.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setButtonStyle(style.id)}
                                className={cn(
                                    "flex items-center justify-between px-6 py-4 rounded-[20px] border-2 transition-all",
                                    buttonStyle === style.id
                                        ? "bg-white border-[#5500ff]/60 shadow-lg shadow-[#5500ff]/5"
                                        : "bg-slate-50/50 border-slate-100/50 hover:border-slate-200 hover:bg-white"
                                )}
                            >
                                <span className={cn("text-[14px] font-bold", buttonStyle === style.id ? "text-[#5500ff]" : "text-slate-500")}>
                                    {t(`store.design.button_styles.${style.id}`)}
                                </span>
                                <div className={cn("w-20 h-5 bg-slate-100 border border-slate-200", style.radius, buttonStyle === style.id ? "bg-[#5500ff] border-[#5500ff]" : "")} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Can keep for other components if needed, or remove if unused elsewhere
