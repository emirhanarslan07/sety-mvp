'use client';

import React from 'react';
import { Sparkles, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoreHeaderProps {
    isSavingDesign: boolean;
    handleSaveDesign: () => void;
    username: string;
    copied: boolean;
    copyToClipboard: () => void;
}

export default function StoreHeader({
    isSavingDesign,
    handleSaveDesign,
    username,
    copied,
    copyToClipboard,
}: StoreHeaderProps) {
    return (
        <div className="pt-8 pb-6 px-4 md:px-8 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-30 bg-[#FDFDFF]">
            <div className="space-y-1">
                <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 tracking-tight leading-none">
                    Mağaza Yönetimi 🛍️
                </h1>
                <p className="text-slate-500 mt-2 font-bold">
                    Ürünlerinizi ve mağaza tasarımınızı buradan yönetin.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-14 px-8 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[15px] flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-95"
                >
                    <ExternalLink className="w-4 h-4" />
                    Mağazayı Ziyaret Et
                </a>
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "h-14 px-8 rounded-full font-black text-[15px] flex items-center gap-2 transition-all duration-200 active:scale-95",
                        copied ? "bg-[#E0FFEC] text-[#00A84D]" : "bg-[#5500ff]/10 text-[#5500ff] hover:bg-[#5500ff]/20"
                    )}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Kopyalandı!" : "Linki Kopyala"}
                </button>
            </div>

            {/* Desktop Save Button (Mobile will use sticky footer later) */}
            <div className="hidden md:flex items-center gap-3">
                <Button
                    onClick={handleSaveDesign}
                    disabled={isSavingDesign}
                    className="h-14 px-10 rounded-[20px] bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[15px] flex items-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSavingDesign ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5" />
                    )}
                    Değişiklikleri Kaydet
                </Button>
            </div>
        </div>
    );
}
