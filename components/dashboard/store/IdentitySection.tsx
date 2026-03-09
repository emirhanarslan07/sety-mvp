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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Logo & Cover Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="space-y-4">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.logo_profile')}
                    </label>
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-xl shadow-slate-200/50 flex items-center justify-center overflow-hidden relative">
                            {storeLogo ? (
                                <Image
                                    src={storeLogo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            ) : (
                                <User className="w-10 h-10 text-slate-200" />
                            )}
                            {logoUploading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-[#5500ff] animate-spin" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border border-slate-100 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all text-slate-600 hover:text-[#5500ff]">
                            <ImageIcon className="w-5 h-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                    </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-4">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.cover_image')}
                    </label>
                    <div className="relative h-32 rounded-[32px] bg-slate-50 border-4 border-white shadow-xl shadow-slate-200/50 overflow-hidden group">
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
                                <ImageIcon className="w-8 h-8 text-slate-200" />
                            </div>
                        )}
                        {coverUploading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-[#5500ff] animate-spin" />
                            </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-all cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.display_name')}
                    </label>
                    <div className="relative group">
                        <PremiumInput
                            placeholder={t('store.placeholders.display_name')}
                            value={displayName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white border border-slate-100 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all z-10"
                            onClick={() => setIsVerified(!isVerified)}>
                            <Zap className={cn("w-3.5 h-3.5", isVerified ? "text-[#C4FF00] fill-[#C4FF00]" : "text-slate-200")} />
                            <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">
                                {t('store.sections.verified_badge')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                        {t('store.sections.bio')}
                    </label>
                    <Textarea
                        placeholder={t('store.placeholders.bio')}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[56px] h-14 px-6 py-4 rounded-[20px] bg-slate-50/50 border-2 border-slate-100/50 font-bold placeholder:text-slate-400 placeholder:font-medium focus-visible:ring-0 focus-visible:border-[#5500ff]/60 focus-visible:bg-white transition-all resize-none shadow-none outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
