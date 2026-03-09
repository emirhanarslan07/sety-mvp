'use client';

import React from 'react';
import { Plus, Check, PenLine, ExternalLink, Trash2, Rocket, ArrowRight } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="w-24 h-24 rounded-[40px] bg-[#5500ff]/5 flex items-center justify-center text-[#5500ff] relative">
                    <Rocket className="w-10 h-10" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                    </div>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-tight">
                        {t('store.pages.empty_title')}
                    </h2>
                    <p className="text-slate-400 font-bold text-lg leading-relaxed">
                        {t('store.pages.empty_desc')}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddPage}
                    className="h-20 px-12 rounded-[32px] bg-slate-900 text-white text-[18px] font-black flex items-center gap-4 shadow-2xl shadow-slate-900/20 hover:bg-[#5500ff] transition-all group"
                >
                    {t('store.actions.create')}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight">
                        {t('store.pages.title')}
                    </h3>
                    <p className="text-slate-400 font-bold text-[14px]">
                        {t('store.pages.desc')}
                    </p>
                </div>
                <Button
                    onClick={onAddPage}
                    className="h-12 px-6 rounded-full bg-slate-900 text-white text-[13px] font-black flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    {t('store.actions.add_new')}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {landingPages.map((page) => (
                    <div
                        key={page.id}
                        className="p-6 rounded-[32px] bg-white border border-slate-100/50 flex items-center justify-between group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-[#5500ff]">
                                {page.id === 'main' ? (
                                    <Rocket className="w-7 h-7" />
                                ) : (
                                    <Plus className="w-7 h-7" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-[17px] font-black text-slate-900">
                                        {page.id === 'main' ? t('store.modals.edit_page.main_page_title') : page.title}
                                    </h4>
                                    {page.isDefault && (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1.5">
                                            <Check className="w-3 h-3" /> {t('store.pages.default_badge')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 font-bold text-[13px]">sety.store/kullanici{page.slug ? '/' + page.slug : ''}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleEditPage(page)}
                                className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent hover:border-slate-100"
                            >
                                <PenLine className="w-5 h-5" />
                            </button>
                            <button className="w-11 h-11 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent hover:border-slate-100">
                                <ExternalLink className="w-5 h-5" />
                            </button>
                            {!page.isDefault && (
                                <button className="w-11 h-11 rounded-full hover:bg-rose-50 flex items-center justify-center text-rose-300 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
