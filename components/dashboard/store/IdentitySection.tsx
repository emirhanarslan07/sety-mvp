'use client';

import React from 'react';
import { ImageIcon, User, Loader2, Zap } from 'lucide-react';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Logo & Cover Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                        Profil Fotoğrafı
                    </label>
                    <div className="relative group w-fit">
                        <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative transition-transform duration-300 group-hover:scale-[1.02]">
                            {storeLogo ? (
                                <Image
                                    src={storeLogo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            ) : (
                                <User className="w-12 h-12 text-slate-300" />
                            )}
                            {logoUploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-7 h-7 text-[#5500FF] animate-spin" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-95 transition-all text-slate-700 hover:text-[#5500FF] z-20">
                            <ImageIcon className="w-5 h-5" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400">Önerilen: 500x500 kare veya dairesel görsel</p>
                </div>

                {/* Cover Upload */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                        Kapak Görseli (Opsiyonel)
                    </label>
                    <div className="relative h-32 rounded-3xl bg-slate-50 border-4 border-white shadow-md overflow-hidden group transition-transform duration-300 hover:scale-[1.01]">
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                                <ImageIcon className="w-7 h-7" />
                                <span className="text-[11px] font-medium">Kapak görseli yüklemek için tıkla</span>
                            </div>
                        )}
                        {coverUploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="w-7 h-7 text-[#5500FF] animate-spin" />
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
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                        Görünen İsim
                    </label>
                    <div className="relative group">
                        <PremiumInput
                            placeholder="Örn: Emirhan Yılmaz"
                            value={displayName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                        />
                        <div
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-all z-10 shadow-sm"
                            onClick={() => setIsVerified(!isVerified)}
                            title="Doğrulanmış Rozeti"
                        >
                            <Zap className={cn("w-3.5 h-3.5 transition-all", isVerified ? "text-[#5500FF] fill-[#C4FF00]" : "text-slate-300")} />
                            <span className={cn("text-[10px] font-bold uppercase tracking-tight", isVerified ? "text-slate-900" : "text-slate-400")}>
                                {isVerified ? 'Onaylı' : 'Rozet Ekle'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                        Biyografi & Açıklama
                    </label>
                    <div className="relative">
                        <Textarea
                            placeholder="Kendini ve sunduğun içerikleri kısaca tanıt..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="min-h-[64px] h-14 px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-semibold text-sm placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#5500FF]/20 focus-visible:border-[#5500FF] focus-visible:bg-white transition-all resize-none shadow-none outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
