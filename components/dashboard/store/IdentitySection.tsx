'use client';

import React from 'react';
import { ImageIcon, User, Loader2, Zap } from 'lucide-react';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';

interface IdentitySectionProps {
    displayName: string;
    setDisplayName: (val: string) => void;
    bio: string;
    setBio: (val: string) => void;
    isVerified: boolean;
    setIsVerified: (val: boolean) => void;
    storeLogo: string | null;
    handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    logoUploading: boolean;
    coverImage: string | null;
    handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    coverUploading: boolean;
}

export default function IdentitySection({
    displayName,
    setDisplayName,
    bio,
    setBio,
    isVerified,
    setIsVerified,
    storeLogo,
    handleLogoUpload,
    logoUploading,
    coverImage,
    handleCoverUpload,
    coverUploading,
}: IdentitySectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Logo & Cover Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Logo Upload */}
                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                        {t('dashboard.store.sections.logo_profile')}
                    </label>
                    <div className="relative group w-fit">
                        <div className="w-36 h-36 rounded-full bg-slate-50 border-[6px] border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02]">
                            {storeLogo ? (
                                <Image
                                    src={storeLogo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    sizes="144px"
                                />
                            ) : (
                                <User className="w-12 h-12 text-slate-200" />
                            )}
                            {logoUploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-[#5500ff] animate-spin" />
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-white border border-slate-100 shadow-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-90 transition-all text-slate-900 hover:text-[#5500ff] z-20">
                            <ImageIcon className="w-6 h-6" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                    </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                        {t('dashboard.store.sections.cover_image')}
                    </label>
                    <div className="relative h-36 rounded-[44px] bg-slate-50 border-[6px] border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] overflow-hidden group transition-transform duration-500 hover:scale-[1.01]">
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-slate-200" />
                            </div>
                        )}
                        {coverUploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#5500ff] animate-spin" />
                            </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-all cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                        {t('dashboard.store.sections.display_name')}
                    </label>
                    <div className="relative group">
                        <PremiumInput
                            placeholder={t('dashboard.store.placeholders.display_name')}
                            value={displayName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-white border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all z-10 shadow-sm"
                            onClick={() => setIsVerified(!isVerified)}>
                            <Zap className={cn("w-4 h-4 transition-all duration-500", isVerified ? "text-[#C4FF00] fill-[#C4FF00] drop-shadow-[0_0_8px_rgba(196,255,0,0.5)]" : "text-slate-200")} />
                            <span className={cn("text-[11px] font-black uppercase tracking-tight transition-colors", isVerified ? "text-slate-900" : "text-slate-400")}>
                                {t('dashboard.store.sections.verified_badge')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                        {t('dashboard.store.sections.bio')}
                    </label>
                    <div className="relative">
                        <Textarea
                            placeholder={t('dashboard.store.placeholders.bio')}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="min-h-[64px] h-16 px-8 py-5 rounded-[32px] bg-slate-50 border-2 border-slate-100/60 font-black text-[15px] placeholder:text-slate-400 placeholder:font-bold focus-visible:ring-4 focus-visible:ring-[#5500ff]/5 focus-visible:border-[#5500ff] focus-visible:bg-white transition-all resize-none shadow-none outline-none scrollbar-hide"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
