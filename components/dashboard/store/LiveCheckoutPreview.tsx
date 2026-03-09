'use client';

import React from 'react';

interface LiveCheckoutPreviewProps {
    data: {
        title: string;
        description: string;
        bottom_title: string;
        button_text: string;
        image_url: string;
        fields: Array<{ label: string; placeholder: string; type: string; options?: string[] }>;
    };
    brandColor?: string;
}

export default function LiveCheckoutPreview({ data, brandColor = '#5500ff' }: LiveCheckoutPreviewProps) {
    return (
        <div className="w-full bg-white flex flex-col min-h-full relative font-sans antialiased">
            {/* Top Image - Stan Style */}
            <div className="w-full h-[140px] bg-[#F8FAFC] relative shrink-0 overflow-hidden">
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
                {/* Stan-style overlay fade */}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/40 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 py-4 space-y-6">
                {/* Main Heading */}
                <div className="space-y-3.5">
                    <h1 className="text-[17px] font-[900] text-slate-900 leading-[1.15] tracking-tight">
                        {data.title || 'Get My [Template/eBook/Course] Now!'}
                    </h1>
                </div>

                {/* Description Body will be moved below */}
                {/* Form Section */}
                <div className="space-y-4 pt-1 pb-6">
                    {/* Bottom Label */}
                    {data.bottom_title && (
                        <div className="text-center">
                            <h3 className="text-[11px] font-[900] text-slate-800 tracking-wider uppercase underline decoration-[#5500ff]/10 underline-offset-[8px] decoration-2">
                                {data.bottom_title}
                            </h3>
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-2.5">
                        {data.fields.map((field, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <label className="text-[9px] font-[900] text-slate-400 ml-1 uppercase tracking-[0.15em]">
                                    {field.label}
                                </label>
                                {field.type === 'phone' ? (
                                    <div className="group w-full h-12 bg-[#F8FAFC] border-2 border-slate-100 rounded-[14px] flex items-center gap-3 px-4 transition-all focus-within:border-[#5500ff]/20 focus-within:bg-white">
                                        <div className="flex items-center gap-1.5 pr-3 border-r-2 border-slate-100/50">
                                            <span className="text-[14px]">🇹🇷</span>
                                            <span className="text-[12px] font-[900] text-slate-400">+90</span>
                                        </div>
                                        <span className="text-[13px] text-slate-300 font-[900] tracking-wide">5XX XXX XX XX</span>
                                    </div>
                                ) : field.type === 'multiple' ? (
                                    <div className="grid grid-cols-1 gap-2">
                                        {(field.options?.length ? field.options : ['Seçenek 1', 'Seçenek 2']).slice(0, 3).map((opt, i) => (
                                            <div key={i}
                                                className={`flex items-center gap-3 h-12 px-4 border-2 rounded-[14px] transition-all cursor-pointer ${i === 0 ? 'border-[#5500ff] bg-[#5500ff]/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                                                <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center shrink-0 ${i === 0 ? 'border-[#5500ff]' : 'border-slate-200'}`}>
                                                    {i === 0 && <div className="w-2 h-2 rounded-full bg-[#5500ff]" />}
                                                </div>
                                                <span className={`text-[13px] font-[900] ${i === 0 ? 'text-[#5500ff]' : 'text-slate-700'}`}>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : field.type === 'checkbox' ? (
                                    <div className="bg-[#F8FAFC] rounded-[14px] p-4 border-2 border-slate-100 mt-1 flex items-start gap-3.5 transition-all hover:bg-[#F1F5F9]">
                                        <div className="w-5 h-5 rounded-md border-[2.5px] border-slate-200 bg-white shrink-0 mt-0.5" />
                                        <p className="text-[12px] font-black text-slate-500 leading-[1.3]">{field.label || 'I agree to the terms and conditions'}</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-11 px-4 bg-[#F8FAFC] border-2 border-slate-100 rounded-[14px] flex items-center focus-within:border-[#5500ff]/20 focus-within:bg-white text-slate-300 font-[900]">
                                        <span className="text-[12px] truncate">{field.placeholder}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main Action Button */}
                    <div className="pt-2">
                        <button
                            disabled
                            style={{
                                backgroundColor: brandColor,
                                boxShadow: `0 10px 20px -5px ${brandColor}30`
                            }}
                            className="w-full h-12 rounded-[18px] text-white font-[900] text-[13px] uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all"
                        >
                            {data.button_text || 'DOWNLOAD'}
                        </button>
                    </div>

                    {/* Description Body */}
                    <div className="pt-6">
                        <div
                            className="text-[13px] font-semibold text-slate-500 leading-relaxed rich-text-preview space-y-3.5"
                            dangerouslySetInnerHTML={{
                                __html: data.description || '<p>Join my email list and never miss an update from me!</p>'
                            }}
                        />
                    </div>

                    {/* Stan-style Footer */}
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-100 shadow-sm transition-transform hover:scale-105 cursor-pointer group">
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
                            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
