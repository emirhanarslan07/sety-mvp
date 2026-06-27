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
    // Dev'de localhost, production'da gerçek domain kullan
    const storeUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${username}`
        : `/${username}`;

    return (
        <div className="pt-8 pb-6 px-4 md:px-8 shrink-0 sticky top-0 z-30 bg-[#FDFDFF] w-full">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 tracking-tight leading-none">
                        Mağaza Yönetimi 🛍️
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        Ürünlerinizi ve mağaza tasarımınızı buradan yönetin.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-12 px-6 rounded-full border-2 border-[#5500ff]/20 text-[#5500ff] font-black text-[14px] flex items-center gap-2 hover:bg-[#5500ff] hover:text-white transition-all duration-200 active:scale-95"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Mağazayı Görüntüle
                    </a>
                    <button
                        onClick={copyToClipboard}
                        className={cn(
                            "h-12 px-6 rounded-full font-black text-[14px] flex items-center gap-2 transition-all duration-200 active:scale-95 border-2",
                            copied
                                ? "bg-[#E0FFEC] text-[#00A84D] border-[#00A84D]/20"
                                : "border-slate-200 text-slate-500 hover:border-[#5500ff]/20 hover:text-[#5500ff]"
                        )}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Kopyalandı!" : "Linki Kopyala"}
                    </button>

                    {/* Desktop Save Button */}
                    <Button
                        onClick={handleSaveDesign}
                        disabled={isSavingDesign}
                        className="h-12 px-8 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[14px] flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSavingDesign ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        Kaydet
                    </Button>
                </div>
            </div>
        </div>
    );
}
