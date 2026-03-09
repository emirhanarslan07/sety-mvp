'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils/format';
import { ShieldCheck } from 'lucide-react';

interface LiveCoachingPreviewProps {
    data: {
        title: string;
        description: string;
        bottom_title: string;
        button_text: string;
        image_url: string;
        price: number;
        fields: Array<{ label: string; placeholder: string; type: string; options?: string[] }>;
    };
    brandColor?: string;
}

export default function LiveCoachingPreview({ data, brandColor = '#5500ff' }: LiveCoachingPreviewProps) {
    return (
        <div className="w-full bg-white flex flex-col min-h-full relative font-sans antialiased">
            {/* Top Image */}
            <div className="w-full h-[180px] bg-[#F8FAFC] relative shrink-0 overflow-hidden">
                {data.image_url ? (
                    <img src={data.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                        <div className="w-14 h-14 rounded-[1.8rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-100">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Görsel Seçilmedi</p>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/40 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 py-4 space-y-6">
                {/* Title and Price */}
                <div className="space-y-4">
                    <h1 className="text-[20px] font-[900] text-slate-900 leading-[1.15] tracking-tight">
                        {data.title || 'Benimle bire bir görüşme ayarlayın'}
                    </h1>
                    <p className="text-[28px] font-[900] leading-none tracking-tight" style={{ color: brandColor }}>
                        {data.price === 0 ? 'FREE' : `$${data.price.toFixed(2)}`}
                    </p>
                </div>

                {/* Main Form/CTA Area */}
                <div className="space-y-5 pt-1 pb-10">
                    {/* Subtitle / CTA Area */}
                    {data.bottom_title && (
                        <div className="text-center">
                            <h3 className="text-[11px] font-[900] text-slate-800 tracking-wider uppercase underline decoration-[#5500ff]/10 underline-offset-[8px] decoration-2">
                                {data.bottom_title}
                            </h3>
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-3.5">
                        {data.fields.map((field, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <label className="text-[9px] font-[900] text-slate-400 ml-1 uppercase tracking-[0.15em]">
                                    {field.label}
                                </label>
                                <div className="w-full h-12 px-4 bg-[#F8FAFC] border-2 border-slate-100 rounded-[14px] flex items-center text-slate-300 font-[900]">
                                    <span className="text-[13px] truncate">{field.placeholder}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                        <button
                            disabled
                            style={{
                                backgroundColor: brandColor,
                                boxShadow: `0 10px 20px -5px ${brandColor}30`
                            }}
                            className="w-full h-14 rounded-[18px] text-white font-[900] text-[14px] uppercase tracking-[0.15em] shadow-lg flex items-center justify-center gap-2 group"
                        >
                            {data.button_text || 'BOOK A CALL'}
                        </button>
                    </div>

                    {/* Description Section (Moved below button like in digital products) */}
                    <div className="pt-6">
                        <div
                            className="text-[13px] font-semibold text-slate-500 leading-relaxed rich-text-preview space-y-3.5"
                            dangerouslySetInnerHTML={{
                                __html: data.description || `
                                <p>Buradayım, hedeflerinize ulaşmanıza yardımcı olmak için.</p>
                                <p>Bu bire bir görüntülü görüşmede size bizzat şu konularda yardımcı olacağım:</p>
                                <ul>
                                    <li>Size durumunuza özel tavsiyelerde bulunacağım.</li>
                                    <li>Hedeflerinize ulaşmak için bir plan oluşturun.</li>
                                    <li>Tüm sorularınızı yanıtlamanıza yardımcı olacağım.</li>
                                </ul>
                                `
                            }}
                        />
                    </div>

                    {/* Stan-style Footer */}
                    <div className="flex flex-col items-center gap-6 py-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-100 shadow-sm opacity-60">
                            <div className="w-5 h-5 rounded-full bg-[#5500ff] flex items-center justify-center shadow-lg shadow-[#5500ff]/20">
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Built with</span>
                                <span className="text-[11px] text-slate-900 font-[900] tracking-tight">Sety Store</span>
                            </div>
                        </div>

                        {/* Secured Payment Indicator */}
                        <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5 whitespace-nowrap">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
