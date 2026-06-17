'use client';

import React from 'react';

import Image from 'next/image';
interface DigitalProductPreviewProps {
    data: {
        title: string;
        description: string;
        bottom_title: string;
        button_text: string;
        image_url: string;
        price: number;
        discount_price?: number;
        payment_plan_enabled?: boolean;
        payment_plan_installments?: string;
        discount_code_enabled?: boolean;
        discount_code?: string;
        discount_percent?: string;
        quantity_limit_enabled?: boolean;
        quantity_limit?: string;
        fields: Array<{ label: string; placeholder: string; type: string; options?: string[] }>;
    };
    brandColor?: string;
}

export default function DigitalProductPreview({ data, brandColor = '#5500ff' }: DigitalProductPreviewProps) {
    const [showCouponInput, setShowCouponInput] = React.useState(false);
    const hasDiscount = data.discount_price && data.discount_price > 0 && data.discount_price < data.price;
    const displayPrice = hasDiscount ? data.discount_price! : data.price;

    return (
        <div className="w-full bg-white flex flex-col min-h-full relative font-sans antialiased">
            {/* Quantity Limit Badge */}
            {data.quantity_limit_enabled && data.quantity_limit && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full shadow-sm flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 tracking-tight uppercase">{'dashboard.store.preview.limited_stock'}: {data.quantity_limit} {'dashboard.store.preview.units'}</span>
                    </div>
                </div>
            )}

            {/* Top Image - Stan Style */}
            <div className="w-full h-[180px] bg-[#F8FAFC] relative shrink-0 overflow-hidden">
                {data.image_url ? (
                    <Image src={data.image_url} alt="" className="w-full h-full object-cover"  width={800} height={800}  />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                        <div className="w-14 h-14 rounded-[1.8rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-100">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{'dashboard.store.preview.no_image_selected'}</p>
                    </div>
                )}
                {/* Stan-style overlay fade */}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white via-white/40 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 py-4 space-y-6">

                {/* Title & Price Header */}
                <div className="space-y-4">
                    <h1 className="text-[20px] font-[900] text-slate-900 leading-[1.15] tracking-tight">
                        {data.title || 'Get My [Template/eBook/Course] Now!'}
                    </h1>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <span
                                style={{ color: brandColor }}
                                className="text-[28px] font-[900] leading-none tracking-tight"
                            >
                                {data.price === 0 ? 'FREE' : `$${displayPrice.toFixed(2)}`}
                            </span>
                            {hasDiscount && (
                                <span className="text-[15px] text-slate-300 font-bold line-through mt-1 tracking-tight">${data.price.toFixed(2)}</span>
                            )}
                        </div>

                        {/* Payment Plan Info */}
                        {data.payment_plan_enabled && data.payment_plan_installments && (
                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                {'dashboard.store.preview.or'} <span className="text-slate-900">{data.payment_plan_installments} {'dashboard.store.preview.installments'}</span> {'dashboard.store.preview.selection_with'}
                                <span className="text-[#5500ff]"> ${((displayPrice) / parseInt(data.payment_plan_installments)).toFixed(2)} / {'dashboard.store.preview.per_month'}</span>
                            </p>
                        )}

                        {hasDiscount && (
                            <div className="flex pt-1">
                                <span className="text-[8px] font-black text-white px-2 py-0.5 rounded-full bg-[#FF3B30] uppercase tracking-[0.1em] shadow-lg shadow-rose-500/10">
                                    SAVE %{Math.round((1 - data.discount_price! / data.price) * 100)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Body will be moved below */}
                {/* Form Section */}
                <div className="space-y-5 pt-1 pb-10">
                    {/* Bottom Label */}
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
                                {field.type === 'phone' ? (
                                    <div className="group w-full h-12 bg-[#F8FAFC] border-2 border-slate-100 rounded-[14px] flex items-center gap-3 px-4 transition-all">
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
                                                className={`flex items-center gap-3 h-12 px-4 border-2 rounded-[14px] transition-all cursor-pointer ${i === 0 ? 'border-[#5500ff] bg-[#5500ff]/5' : 'border-slate-100 bg-white'}`}>
                                                <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center shrink-0 ${i === 0 ? 'border-[#5500ff]' : 'border-slate-200'}`}>
                                                    {i === 0 && <div className="w-2 h-2 rounded-full bg-[#5500ff]" />}
                                                </div>
                                                <span className={`text-[13px] font-[900] ${i === 0 ? 'text-[#5500ff]' : 'text-slate-700'}`}>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : field.type === 'checkbox' ? (
                                    <div className="bg-[#F8FAFC] rounded-[14px] p-4 border-2 border-slate-100 mt-1 flex items-start gap-3.5 transition-all">
                                        <div className="w-5 h-5 rounded-md border-[2.5px] border-slate-200 bg-white shrink-0 mt-0.5" />
                                        <p className="text-[12px] font-black text-slate-500 leading-[1.3]">{field.label || 'I agree to the terms and conditions'}</p>
                                    </div>
                                ) : (
                                    <div className="w-full h-12 px-4 bg-[#F8FAFC] border-2 border-slate-100 rounded-[14px] flex items-center text-slate-300 font-[900]">
                                        <span className="text-[13px] truncate">{field.placeholder}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Discount Code Section */}
                    {data.discount_code_enabled && (
                        <div className="space-y-3 py-1 animate-in fade-in slide-in-from-top-1 duration-300">
                            {!showCouponInput ? (
                                <button
                                    onClick={() => setShowCouponInput(true)}
                                    className="text-[11px] font-black text-[#5500ff] uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {'dashboard.store.preview.have_coupon'}
                                </button>
                            ) : (
                                <div className="flex gap-2 animate-in zoom-in-95 duration-200">
                                    <input
                                        type="text"
                                        placeholder={'dashboard.store.preview.coupon_placeholder'}
                                        className="flex-1 h-11 px-4 bg-[#F8FAFC] border-2 border-[#5500ff]/20 rounded-xl text-[12px] font-black focus:border-[#5500ff] outline-none tracking-widest uppercase"
                                    />
                                    <button className="h-11 px-5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                        {'dashboard.store.preview.apply'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Purchase Button */}
                    <div className="pt-2">
                        <button
                            disabled
                            style={{
                                backgroundColor: brandColor,
                                boxShadow: `0 10px 20px -5px ${brandColor}30`
                            }}
                            className="w-full h-14 rounded-[18px] text-white font-[900] text-[14px] uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all"
                        >
                            {data.button_text || 'PURCHASE'}
                        </button>
                    </div>

                    {/* Description Body */}
                    <div className="pt-8">
                        <div
                            className="text-[13px] font-semibold text-slate-500 leading-relaxed rich-text-preview space-y-3.5"
                            dangerouslySetInnerHTML={{
                                __html: data.description || '<p>This guide is for you if you’re looking to:</p><ul><li>Achieve your Dream</li><li>Find Meaning in Your Work</li><li>Be Happy</li></ul>'
                            }}
                        />
                    </div>

                    {/* Stan-style Footer */}
                    <div className="flex flex-col items-center gap-6 py-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-100 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                            <div className="w-5 h-5 rounded-full bg-[#5500ff] flex items-center justify-center shadow-lg shadow-[#5500ff]/20">
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{'dashboard.store.preview.built_with'}</span>
                                <span className="text-[11px] text-slate-900 font-[900] tracking-tight">Sety Store</span>
                            </div>
                        </div>

                        {/* Secured Payment Indicator */}
                        <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-0.5">{'dashboard.store.preview.secure_checkout'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
