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
    Music,
    ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { getProductTypes } from './StorePreview';


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
    const productTypes = getProductTypes((key) => key);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[28px] md:text-[32px] font-black text-slate-900 tracking-tight leading-none">
                    Ürünlerim
                </h3>
                <Button
                    onClick={() => setShowAddProduct(true)}
                    className="h-12 w-12 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white transition-all shadow-lg shadow-indigo-100 flex items-center justify-center p-0"
                >
                    <Plus className="w-6 h-6 stroke-[3px]" />
                </Button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {products.map((item, index) => {
                        const typeInfo = productTypes.find(t => t.id === item.type) || productTypes[1];
                        const isActive = item.status === 'active';

                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className={cn(
                                    "p-6 rounded-[32px] bg-white border border-slate-100/60 flex items-center gap-6 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500",
                                    !isActive && "opacity-70"
                                )}
                            >
                                {/* Drag Handle */}
                                <div className="text-slate-200 group-hover:text-slate-400 transition-colors cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-6 h-6" />
                                </div>

                                {/* Icon / Image */}
                                <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex-shrink-0 overflow-hidden relative border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
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

                                {/* Details */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <h4 className="text-[17px] md:text-[19px] font-black text-slate-900 truncate tracking-tight leading-tight">{item.title}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[14px] font-black text-[#5500ff]">
                                            {item.price === 0 ? 'ÜCRETSİZ' : formatCurrency(item.price, item.currency)}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Toggle (Stan Style Tags) */}
                                <div className="hidden md:flex items-center gap-3">
                                    {isActive ? (
                                        <span className="px-5 py-2.5 rounded-full bg-[#E0FFEC] text-[#00A84D] text-[13px] font-black tracking-tight">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-400 text-[13px] font-black tracking-tight">
                                            Taslak
                                        </span>
                                    )}
                                </div>

                                {/* Action Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveActionMenu(activeActionMenu === item.id ? null : item.id)}
                                        className="w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-transparent active:scale-90"
                                    >
                                        <MoreHorizontal className="w-6 h-6" />
                                    </button>

                                    {activeActionMenu === item.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setActiveActionMenu(null)}
                                            />
                                            <div className="absolute right-0 top-14 w-52 bg-white rounded-[28px] shadow-[0_20px_60px_rgba(85,0,255,0.12)] border border-[#5500ff]/5 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                <button className="w-full px-5 py-3.5 text-[15px] font-black text-indigo-950 hover:bg-slate-50 flex items-center gap-4 transition-colors">
                                                    <PenLine className="w-5 h-5 text-slate-400" /> Düzenle
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleToggleStatus(item);
                                                        setActiveActionMenu(null);
                                                    }}
                                                    className="w-full px-5 py-3.5 text-[15px] font-black text-indigo-950 hover:bg-slate-50 flex items-center gap-4 transition-colors"
                                                >
                                                    {isActive ? (
                                                        <><EyeOff className="w-5 h-5 text-slate-400" /> Arşivle</>
                                                    ) : (
                                                        <><Eye className="w-5 h-5 text-slate-400" /> Yayınla</>
                                                    )}
                                                </button>
                                                <div className="h-px bg-slate-50 my-2 mx-4" />
                                                <button
                                                    onClick={() => {
                                                        handleDeleteProduct(item.id);
                                                        setActiveActionMenu(null);
                                                    }}
                                                    className="w-full px-5 py-3.5 text-[15px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-4 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" /> Sil
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {products.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center px-6 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative w-48 h-48 mb-10">
                            <div className="absolute inset-0 bg-[#5500ff]/5 rounded-full blur-3xl animate-pulse" />
                            <div className="relative w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-24 h-24 text-slate-100 stroke-[1.5px] group-hover:scale-110 group-hover:text-indigo-100 transition-all duration-700" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-50">
                                    <Plus className="w-8 h-8 text-[#5500ff] stroke-[3px]" />
                                </div>
                            </div>
                        </div>

                        <h4 className="text-[28px] font-black text-slate-900 mb-4 tracking-tight leading-none">Henüz ürün yok</h4>
                        <p className="text-slate-400 text-[17px] font-bold leading-relaxed max-w-[320px] mb-12">İlk ürününüzü oluşturarak satış yapmaya başlayın.</p>

                        <Button
                            onClick={() => setShowAddProduct(true)}
                            className="h-16 px-12 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white text-[17px] font-black shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                        >
                            İlk Ürününü Ekle
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
