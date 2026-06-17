'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Instagram, Share2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/format';

import Image from 'next/image';
interface StoryCardGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    profile: any;
}

export default function StoryCardGenerator({ isOpen, onClose, product, profile }: StoryCardGeneratorProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                width: 1080,
                height: 1920,
            });
            const link = document.createElement('a');
            link.download = `sety-share-${product.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Ops! Story görseli oluşturulamadı:', err);
        } finally {
            setGenerating(false);
        }
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 text-center space-y-2">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-2">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-[24px] font-black text-slate-900 tracking-tight">Harika Bir Alım! 👋</h3>
                            <p className="text-[15px] text-slate-500 font-bold">
                                Bunu Instagram&apos;da paylaşarak {profile.full_name || profile.username}&apos;a destek olabilirsin.
                            </p>
                        </div>

                        {/* Preview Area (Standardized Instagram Story Ratio) */}
                        <div className="px-8 flex justify-center py-4">
                            <div className="relative w-full aspect-[9/16] max-h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                                {/* The Actual Card to Image (Hidden or Preview) */}
                                <div
                                    ref={cardRef}
                                    className="absolute inset-0 bg-gradient-to-br from-[#5500ff] via-[#5500ff] to-[#C4FF00] p-12 flex flex-col items-center justify-between text-white"
                                    style={{ width: '1080px', height: '1920px', transform: 'scale(0.208)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}
                                >
                                    {/* Brand Top */}
                                    <div className="flex items-center gap-4 opacity-80">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#5500ff] font-black text-3xl">S</div>
                                        <span className="text-4xl font-black tracking-tighter">Sety Store</span>
                                    </div>

                                    {/* Center Content */}
                                    <div className="w-full flex flex-col items-center space-y-12">
                                        <div className="w-[700px] h-[700px] rounded-[100px] bg-white p-4 shadow-3xl overflow-hidden">
                                            {product.image_url ? (
                                                <Image src={product.image_url} className="w-full h-full object-cover rounded-[80px]" alt="" width={800} height={800} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                    <Sparkles className="w-64 h-64 text-[#5500ff]" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center space-y-6">
                                            <h1 className="text-7xl font-black tracking-tight px-10 leading-tight italic">
                                                BU ÜRÜNÜ YENİ ALDIM! 🚀
                                            </h1>
                                            <div className="h-2 w-32 bg-white/30 rounded-full mx-auto" />
                                            <p className="text-4xl font-bold opacity-90 uppercase tracking-widest">
                                                {product.title}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="w-full flex flex-col items-center space-y-8">
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-10 py-6 rounded-[40px] flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white/20 flex items-center justify-center">
                                                {profile.profile_image_url ? (
                                                    <Image src={profile.profile_image_url} alt="" width={800} height={800} />
                                                ) : (
                                                    <span className="text-2xl font-black">{profile.username[0].toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-2xl opacity-60 font-black uppercase tracking-widest">Creator</p>
                                                <p className="text-4xl font-black">@{profile.username}</p>
                                            </div>
                                        </div>

                                        <div className="text-3xl font-black bg-white text-[#5500ff] px-12 py-5 rounded-full shadow-2xl animate-pulse uppercase tracking-[0.2em]">
                                            SETY.STORE/{profile.username}
                                        </div>
                                    </div>
                                </div>

                                {/* Live Mockup Preview (What user sees in modal) */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#5500ff] via-[#5500ff] to-[#C4FF00] p-6 flex flex-col items-center justify-between text-white scale-100">
                                    <div className="flex items-center gap-2 opacity-80">
                                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#5500ff] font-black text-[10px]">S</div>
                                        <span className="text-sm font-black tracking-tighter">Sety Store</span>
                                    </div>

                                    <div className="w-full flex flex-col items-center space-y-4">
                                        <div className="w-40 h-40 rounded-[40px] bg-white p-1 shadow-2xl overflow-hidden">
                                            {product.image_url ? (
                                                <Image src={product.image_url} className="w-full h-full object-cover rounded-[35px]" alt="" width={800} height={800} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                                    <Sparkles className="w-12 h-12 text-[#5500ff]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-lg font-black italic">YENİ ALINDI! 🚀</p>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{product.title}</p>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col items-center gap-3">
                                        <div className="text-[10px] font-black bg-white text-[#5500ff] px-4 py-2 rounded-full uppercase tracking-widest">sety.store/{profile.username}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-8 pt-6 flex flex-col gap-3">
                            <Button
                                onClick={handleDownload}
                                disabled={generating}
                                className="w-full h-16 rounded-[24px] bg-[#5500ff] hover:bg-blue-700 text-white font-black text-lg shadow-xl flex items-center justify-center gap-3"
                            >
                                {generating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                                {generating ? 'Görsel Hazırlanıyor...' : 'Story Kartını İndir'}
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="w-full h-14 rounded-[20px] text-slate-400 font-bold hover:bg-slate-50"
                            >
                                Kapat
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
