import React, { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp, Tag, Calendar, Package } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

interface PricingData {
    price: string;
    discount_price: string;
    payment_plan_enabled: boolean;
    payment_plan_installments: string;
    discount_code_enabled: boolean;
    discount_code: string;
    discount_percent: string;
    quantity_limit_enabled: boolean;
    quantity_limit: string;
}

interface PricingSectionProps {
    data: PricingData;
    onChange: (field: keyof PricingData, value: any) => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={`w-12 h-7 rounded-full relative transition-all duration-300 shrink-0 ${on ? 'bg-[#5500ff]' : 'bg-slate-200'}`}
        >
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 shadow-sm transition-all duration-300 ${on ? 'left-6' : 'left-1'}`} />
        </button>
    );
}

export function PricingSection({ data, onChange }: PricingSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-8 transition-all hover:shadow-2xl hover:shadow-slate-200/30">

            {/* Price & Discount Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        {t('dashboard.store.editors.pricing.price_label')}
                    </label>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[15px] font-black text-slate-400">$</div>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => onChange('price', e.target.value)}
                            placeholder="9.99"
                            min="0"
                            step="0.01"
                            className={`w-full h-14 pl-10 pr-5 bg-slate-50 border rounded-2xl text-[16px] font-black text-slate-800 focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300 ${parseFloat(data.price) > 0 && parseFloat(data.price) < 0.5
                                    ? 'border-rose-300 bg-rose-50/30'
                                    : 'border-slate-100'
                                }`}
                        />
                    </div>
                    <p className={`text-[11px] font-medium ml-1 transition-colors ${parseFloat(data.price) > 0 && parseFloat(data.price) < 0.5
                            ? 'text-rose-500'
                            : 'text-slate-400'
                        }`}>
                        {parseFloat(data.price) > 0 && parseFloat(data.price) < 0.5
                            ? t('dashboard.store.editors.pricing.min_price_error')
                            : t('dashboard.store.editors.pricing.price_hint')}
                    </p>
                </div>

                {/* Discount Price */}
                <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1">
                        {t('dashboard.store.editors.pricing.discount_price_label')}
                    </label>
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[15px] font-black text-slate-300">$</div>
                        <input
                            type="number"
                            value={data.discount_price}
                            onChange={(e) => onChange('discount_price', e.target.value)}
                            placeholder="5.00"
                            min="0"
                            step="0.01"
                            className={`w-full h-14 pl-10 pr-5 bg-slate-50 border rounded-2xl text-[16px] font-black text-slate-800 focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff] outline-none transition-all placeholder:text-slate-300 ${parseFloat(data.discount_price) > 0 && parseFloat(data.discount_price) >= parseFloat(data.price)
                                    ? 'border-rose-300 bg-rose-50/30'
                                    : 'border-slate-100'
                                }`}
                        />
                    </div>
                    <p className={`text-[11px] font-medium ml-1 transition-colors ${parseFloat(data.discount_price) >= parseFloat(data.price) && parseFloat(data.price) > 0
                            ? 'text-rose-500'
                            : 'text-slate-400'
                        }`}>
                        {parseFloat(data.discount_price) >= parseFloat(data.price) && parseFloat(data.price) > 0
                            ? t('dashboard.store.editors.pricing.discount_price_error')
                            : t('dashboard.store.editors.pricing.discount_price_hint')}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Payment Plan */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-slate-800">{t('dashboard.store.editors.pricing.payment_plan_title')}</p>
                            <p className="text-[12px] text-slate-400 font-medium">{t('dashboard.store.editors.pricing.payment_plan_desc')}</p>
                        </div>
                    </div>
                    <Toggle on={data.payment_plan_enabled} onToggle={() => onChange('payment_plan_enabled', !data.payment_plan_enabled)} />
                </div>
                {data.payment_plan_enabled && (
                    <div className="ml-12 animate-in slide-in-from-top-2 duration-200">
                        <div className="relative">
                            <input
                                type="number"
                                value={data.payment_plan_installments}
                                onChange={(e) => onChange('payment_plan_installments', e.target.value)}
                                placeholder="3"
                                min="2"
                                max="12"
                                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 focus:ring-4 focus:ring-violet-500/5 focus:border-violet-400 outline-none transition-all placeholder:text-slate-300"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 font-bold">{t('dashboard.store.editors.pricing.installments_label')}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Discount Code */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Tag className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-slate-800">{t('dashboard.store.editors.pricing.discount_code_title')}</p>
                            <p className="text-[12px] text-slate-400 font-medium">{t('dashboard.store.editors.pricing.discount_code_desc')}</p>
                        </div>
                    </div>
                    <Toggle on={data.discount_code_enabled} onToggle={() => onChange('discount_code_enabled', !data.discount_code_enabled)} />
                </div>
                {data.discount_code_enabled && (
                    <div className="ml-12 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                        <input
                            type="text"
                            value={data.discount_code}
                            onChange={(e) => onChange('discount_code', e.target.value.toUpperCase())}
                            placeholder={t('dashboard.store.editors.pricing.discount_code_placeholder')}
                            className="h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all placeholder:text-slate-300 tracking-widest uppercase"
                        />
                        <div className="relative">
                            <input
                                type="number"
                                value={data.discount_percent}
                                onChange={(e) => onChange('discount_percent', e.target.value)}
                                placeholder="20"
                                min="1"
                                max="100"
                                className="w-full h-12 px-5 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 outline-none transition-all placeholder:text-slate-300"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 font-bold">%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Quantity Limit */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                            <Package className="w-4 h-4 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-slate-800">{t('dashboard.store.editors.pricing.quantity_limit_title')}</p>
                            <p className="text-[12px] text-slate-400 font-medium">{t('dashboard.store.editors.pricing.quantity_limit_desc')}</p>
                        </div>
                    </div>
                    <Toggle on={data.quantity_limit_enabled} onToggle={() => onChange('quantity_limit_enabled', !data.quantity_limit_enabled)} />
                </div>
                {data.quantity_limit_enabled && (
                    <div className="ml-12 animate-in slide-in-from-top-2 duration-200">
                        <div className="relative">
                            <input
                                type="number"
                                value={data.quantity_limit}
                                onChange={(e) => onChange('quantity_limit', e.target.value)}
                                placeholder={t('dashboard.store.editors.pricing.quantity_limit_placeholder')}
                                min="1"
                                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold text-slate-800 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all placeholder:text-slate-300"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 font-bold">{t('dashboard.store.editors.pricing.quantity_unit')}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
