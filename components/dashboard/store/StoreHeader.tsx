'use client';

import React from 'react';
import { Loader2, Copy, Check, ExternalLink, Plus, Sparkles, ShoppingBag, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StoreHeaderProps {
    activeTab: 'store' | 'design';
    setActiveTab: (tab: 'store' | 'design') => void;
    onAddProduct: () => void;
    productsCount: number;
    isSavingDesign: boolean;
    handleSaveDesign: () => void;
    username: string;
    copied: boolean;
    copyToClipboard: () => void;
}

export default function StoreHeader({
    activeTab,
    setActiveTab,
    onAddProduct,
    productsCount,
    isSavingDesign,
    handleSaveDesign,
    username,
    copied,
    copyToClipboard,
}: StoreHeaderProps) {
    const storeUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/${username}`
        : `/${username}`;

    return (
        <div className="bg-white border-b border-[#E8ECF4] px-4 md:px-8 py-4 shrink-0">
            <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F1F3F9] rounded-xl self-start">
                    <button
                        onClick={() => setActiveTab('store')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all",
                            activeTab === 'store'
                                ? "bg-white text-[#0F172A] shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <ShoppingBag className={cn("w-4 h-4", activeTab === 'store' ? "text-[#5500FF]" : "text-slate-400")} />
                        <span>Ürünler</span>
                        <span className={cn(
                            "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full",
                            activeTab === 'store' ? "bg-[#5500FF]/10 text-[#5500FF]" : "bg-slate-200 text-slate-600"
                        )}>
                            {productsCount}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('design')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all",
                            activeTab === 'design'
                                ? "bg-white text-[#0F172A] shadow-sm"
                                : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <Palette className={cn("w-4 h-4", activeTab === 'design' ? "text-[#5500FF]" : "text-slate-400")} />
                        <span>Tasarım & Profil</span>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* View Live Store */}
                    <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#E8ECF4] px-3.5 py-2 rounded-xl text-[12px] font-bold shadow-sm transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mağazayı Gör</span>
                    </a>

                    {/* Copy Link */}
                    <button
                        onClick={copyToClipboard}
                        className={cn(
                            "inline-flex items-center gap-1.5 border px-3.5 py-2 rounded-xl text-[12px] font-bold shadow-sm transition-all",
                            copied
                                ? "bg-[#E0FFEC] text-[#00A84D] border-[#00A84D]/30"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-[#E8ECF4]"
                        )}
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#00A84D]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copied ? 'Kopyalandı!' : 'Linki Kopyala'}</span>
                    </button>

                    {/* Contextual Action Button */}
                    {activeTab === 'store' ? (
                        <button
                            onClick={onAddProduct}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-4 py-2 rounded-xl text-[12px] font-bold shadow-md shadow-[#5500FF]/25 hover:opacity-95 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Yeni Ürün</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveDesign}
                            disabled={isSavingDesign}
                            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-5 py-2 rounded-xl text-[12px] font-bold shadow-md shadow-[#5500FF]/25 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSavingDesign ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            <span>Kaydet</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
