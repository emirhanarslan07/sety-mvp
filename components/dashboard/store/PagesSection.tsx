'use client';

import React from 'react';
import { Plus, Check, PenLine, ExternalLink, Trash2, Rocket, ArrowRight, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/context';

interface PagesSectionProps {
    landingPages: any[];
    handleEditPage: (page: any) => void;
    onAddPage: () => void;
}

export default function PagesSection({
    landingPages,
    handleEditPage,
    onAddPage,
}: PagesSectionProps) {
    const { t } = useTranslation();
    const hasLandingPages = landingPages.length > 1;

    if (!hasLandingPages) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50 relative">
                <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5500ff] relative mb-8">
                    <Rocket className="w-10 h-10" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                    </div>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-tight">
                        Henüz Sayfa Yok
                    </h2>
                    <p className="text-slate-400 font-bold text-lg leading-relaxed">
                        Mağazanız için ilk satış sayfasını oluşturun.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddPage}
                    className="h-16 px-12 rounded-2xl bg-[#5500ff] text-white text-[17px] font-black flex items-center gap-4 shadow-xl shadow-[#5500ff]/20 hover:bg-[#4400cc] transition-all group mt-8"
                >
                    Yeni Sayfa Oluştur
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h3 className="text-[28px] md:text-[32px] font-black text-slate-900 tracking-tight leading-none">
                        Satış Sayfaları
                    </h3>
                </div>
                <Button
                    onClick={onAddPage}
                    className="h-12 w-12 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white transition-all shadow-lg shadow-indigo-100 flex items-center justify-center p-0"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {landingPages.map((page) => {
                    const isMain = page.id === 'main';
                    return (
                        <div
                            key={page.id}
                            className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-white border border-slate-100/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex items-center gap-6 group hover:shadow-lg transition-all duration-500"
                        >
                            {/* Page Icon */}
                            <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500 text-[#5500ff]">
                                {isMain ? (
                                    <Rocket className="w-8 h-8" strokeWidth={1.5} />
                                ) : (
                                    <Layout className="w-8 h-8" strokeWidth={1.5} />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-[17px] md:text-[19px] font-black text-slate-900 truncate tracking-tight leading-tight">
                                        {isMain ? 'Ana Sayfa' : page.title}
                                    </h4>
                                    {page.isDefault && (
                                        <span className="px-3 py-1 rounded-full bg-[#E0FFEC] text-[#00A84D] text-[11px] font-black tracking-tight">
                                            VARSAYILAN
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 font-bold text-[14px]">sety.store/kullanici{page.slug ? '/' + page.slug : ''}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditPage(page)}
                                    className="w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent active:scale-90"
                                >
                                    <PenLine className="w-6 h-6" />
                                </button>
                                <button className="w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent active:scale-90">
                                    <ExternalLink className="w-6 h-6" />
                                </button>
                                {!page.isDefault && (
                                    <button className="w-12 h-12 rounded-full hover:bg-rose-50 flex items-center justify-center text-rose-300 hover:text-rose-500 transition-all border border-transparent active:scale-90">
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
