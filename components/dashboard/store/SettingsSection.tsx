'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

interface SettingsSectionProps {
    announcement: string;
    setAnnouncement: (val: string) => void;
    showAffiliateBadge: boolean;
    setShowAffiliateBadge: (val: boolean) => void;
}

export default function SettingsSection({
    announcement,
    setAnnouncement,
    showAffiliateBadge,
    setShowAffiliateBadge,
}: SettingsSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {/* Announcement Banner */}
            <div className="space-y-4">
                <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1">
                    {t('store.sections.announcement_banner')}
                </label>
                <div className="relative">
                    <Input
                        placeholder={t('store.placeholders.announcement')}
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className="h-16 px-6 rounded-[24px] bg-slate-50/50 border-slate-100 font-bold focus:ring-[#5500ff]/10 focus:border-[#5500ff] transition-all pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200">
                        <Sparkles className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-[12px] font-medium text-slate-400 px-1">
                    {t('store.sections.announcement_desc')}
                </p>
            </div>

            {/* Affiliate Badge Toggle */}
            <div className="space-y-4">
                <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1">
                    {t('store.sections.sety_badge')}
                </label>
                <div
                    onClick={() => setShowAffiliateBadge(!showAffiliateBadge)}
                    className={cn(
                        "p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between group",
                        showAffiliateBadge
                            ? "bg-white border-[#5500ff] shadow-xl shadow-indigo-100/50"
                            : "bg-slate-50/50 border-slate-50 text-slate-400"
                    )}
                >
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                            showAffiliateBadge ? "bg-indigo-50" : "bg-white"
                        )}>
                            <SetyLogo size="sm" />
                        </div>
                        <div>
                            <h4 className={cn("text-[16px] font-black tracking-tight", showAffiliateBadge ? "text-slate-900" : "text-slate-400")}>
                                {t('store.sections.show_sety_badge')}
                            </h4>
                            <p className="text-[13px] font-bold opacity-60">
                                {t('store.sections.sety_badge_desc')}
                            </p>
                        </div>
                    </div>
                    <div className={cn(
                        "w-14 h-8 rounded-full relative transition-all duration-500",
                        showAffiliateBadge ? "bg-[#5500ff]" : "bg-slate-200"
                    )}>
                        <div className={cn(
                            "absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-500 shadow-sm",
                            showAffiliateBadge ? "left-7" : "left-1"
                        )} />
                    </div>
                </div>
            </div>
        </div>
    );
}
