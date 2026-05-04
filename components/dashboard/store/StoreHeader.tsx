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

import { useTranslation } from '@/lib/i18n/context';

export default function StoreHeader({
    isSavingDesign,
    handleSaveDesign,
    username,
    copied,
    copyToClipboard,
}: StoreHeaderProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 pt-4 md:pt-0">
            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 md:h-12 px-4 md:px-6 rounded-full bg-slate-100 text-slate-900 font-extrabold text-[13px] md:text-[14px] flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95 shrink-0 shadow-sm"
                >
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {t('dashboard.store.header.visit_store')}
                </a>
                <button
                    onClick={copyToClipboard}
                    className={cn(
                        "h-10 md:h-12 px-4 md:px-6 rounded-full font-extrabold text-[13px] md:text-[14px] flex items-center gap-2 transition-all active:scale-95 shrink-0 shadow-sm",
                        copied ? "bg-[#E0FFEC] text-[#00A84D]" : "bg-white border border-slate-100 text-slate-900 hover:bg-slate-50"
                    )}
                >
                    {copied ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    {copied ? t('dashboard.store.header.copy_link') + "!" : t('dashboard.store.header.copy_link')}
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
                    {t('dashboard.store.header.save_changes')}
                </Button>
            </div>
        </div>
    );
}
