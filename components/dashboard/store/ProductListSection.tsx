'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    GripVertical,
    MoreHorizontal,
    PenLine,
    Eye,
    EyeOff,
    Trash2,
    Mail,
    Download,
    Video,
    Sparkles,
    Heart,
    Gift,
    Book,
    Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { getProductTypes } from './StorePreview';
import { useTranslation } from '@/lib/i18n/context';

interface ProductListSectionProps {
    products: any[];
    setShowAddProduct: (val: boolean) => void;
    activeActionMenu: string | null;
    setActiveActionMenu: (val: string | null) => void;
    handleToggleStatus: (item: any) => void;
    handleDeleteProduct: (id: string) => void;
}

export default function ProductListSection({
    products,
    setShowAddProduct,
    activeActionMenu,
    setActiveActionMenu,
    handleToggleStatus,
    handleDeleteProduct,
}: ProductListSectionProps) {
    const { t } = useTranslation();
    const productTypes = getProductTypes((key) => t(key));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-[0.2em] opacity-60">
                    {t('store.sections.my_products')}
                </h3>
                <Button
                    onClick={() => setShowAddProduct(true)}
                    className="h-10 px-6 rounded-full bg-slate-900 hover:bg-black text-white text-[12px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    {t('store.actions.add_new')}
                </Button>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {products.map((item, index) => {
                        const typeInfo = productTypes.find(t => t.id === item.type) || productTypes[1];
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "p-4 rounded-[24px] bg-white border border-slate-100/60 flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500",
                                    item.status === 'draft' && "opacity-60 grayscale-[0.5]"
                                )}
                            >
                                <div className="p-2 cursor-grab active:cursor-grabbing text-slate-200 hover:text-slate-400 transition-colors">
                                    <GripVertical className="w-5 h-5" />
                                </div>

                                <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex-shrink-0 overflow-hidden relative group-hover:scale-105 transition-transform duration-500 border border-slate-100 flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={cn("w-full h-full flex items-center justify-center", typeInfo.color)}>
                                            {item.icon_id ? (() => {
                                                const iconMap: Record<string, any> = {
                                                    mail: Mail,
                                                    download: Download,
                                                    video: Video,
                                                    sparkles: Sparkles,
                                                    heart: Heart,
                                                    gift: Gift,
                                                    book: Book,
                                                    music: Music
                                                };
                                                const IconComponent = iconMap[item.icon_id as string] || typeInfo.icon;
                                                return <IconComponent className="w-6 h-6" strokeWidth={1.5} />;
                                            })() : (
                                                <typeInfo.icon className="w-6 h-6" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-[15px] font-bold text-slate-900 truncate tracking-tight">{item.title}</h4>
                                        {item.status === 'draft' && (
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                                                {t('store.states.draft')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[13px] font-bold text-[#5500ff]">
                                            {item.price === 0 ? t('store.preview.free_button').toUpperCase() : formatCurrency(item.price, item.currency)}
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className="text-[12px] font-medium text-slate-400">
                                            {t('store.states.sales_count', { count: 0 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setActiveActionMenu(activeActionMenu === item.id ? null : item.id)}
                                        className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent hover:border-slate-100"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {activeActionMenu === item.id && (
                                        <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl shadow-indigo-200/50 border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <button className="w-full px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                                <PenLine className="w-4 h-4" /> {t('store.actions.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(item)}
                                                className="w-full px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                            >
                                                {item.status === 'active' ? (
                                                    <><EyeOff className="w-4 h-4" /> {t('store.actions.archive')}</>
                                                ) : (
                                                    <><Eye className="w-4 h-4" /> {t('store.actions.publish')}</>
                                                )}
                                            </button>
                                            <div className="h-px bg-slate-50 my-1 mx-2" />
                                            <button
                                                onClick={() => handleDeleteProduct(item.id)}
                                                className="w-full px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> {t('store.actions.delete')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {products.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4 bg-slate-50/30 rounded-[32px] border-2 border-dashed border-slate-100/50">
                        <div className="w-20 h-20 rounded-full bg-white shadow-xl shadow-slate-200/30 flex items-center justify-center mb-6 border border-slate-100">
                            <Plus className="w-8 h-8 text-slate-200" />
                        </div>
                        <h4 className="text-[18px] font-bold text-slate-900 mb-2">{t('store.states.no_products')}</h4>
                        <p className="text-slate-400 text-[14px] font-medium max-w-xs mx-auto mb-8">{t('store.states.no_products_desc')}</p>
                        <Button
                            onClick={() => setShowAddProduct(true)}
                            className="h-14 px-10 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-xl shadow-indigo-100/40 active:scale-[0.98] transition-all"
                        >
                            {t('store.states.add_first_product')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
