'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getProductTypes } from './StorePreview';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

interface AddProductSectionProps {
    setShowAddProduct: (val: boolean) => void;
    onSelectType: (type: any) => void;
}

export default function AddProductSection({
    setShowAddProduct,
    onSelectType,
}: AddProductSectionProps) {
    const { t } = useTranslation();
    const productTypes = getProductTypes((key) => t(key));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowAddProduct(false)}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-bold transition-all group"
                >
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    {t('dashboard.store.actions.back')}
                </button>
                <div className="px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest">{t('dashboard.store.states.step_select_type')}</div>
            </div>

            <div className="space-y-2">
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight">{t('dashboard.store.states.add_product_title')}</h2>
                <p className="text-slate-400 font-bold">{t('dashboard.store.states.add_product_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productTypes.map((type) => (
                    <motion.button
                        key={type.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !type.comingSoon && onSelectType(type)}
                        className={cn(
                            "p-7 rounded-[32px] bg-white border border-slate-100/60 text-left flex items-center gap-6 transition-all group relative overflow-hidden",
                            type.comingSoon ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-[#5500ff]/10"
                        )}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-white/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 relative shadow-sm group-hover:shadow-md overflow-hidden",
                            type.color
                        )}>
                            {/* The "White Line" on top detayı */}
                            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                            {type.isSetyLogo ? (
                                <SetyLogo size="sm" showBackground={false} />
                            ) : type.iconUrl ? (
                                <img
                                    src={type.iconUrl}
                                    className="w-10 h-10 object-contain relative z-10 transition-transform group-hover:scale-110 duration-500"
                                    alt=""
                                />
                            ) : (
                                <type.icon className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110 duration-500" strokeWidth={2.5} />
                            )}
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h4 className="text-[17px] font-extrabold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
                                    {t(`dashboard.store.product_types.${type.id}.title`) || type.title}
                                </h4>
                                {type.comingSoon && (
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 text-slate-400">
                                        {t('dashboard.store.states.coming_soon')}
                                    </span>
                                )}
                            </div>
                            <p className="text-[14px] font-bold text-slate-400 leading-snug group-hover:text-slate-500 transition-colors">
                                {t(`dashboard.store.product_types.${type.id}.desc`) || type.description}
                            </p>
                        </div>
                        {!type.comingSoon && (
                            <div className="relative z-10 w-11 h-11 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-[#5500ff] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-sm group-hover:shadow-md">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div >
    );
}
