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
    Package,
    Target,
    Link2,
    ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';

interface ProductListSectionProps {
    products: any[];
    onAddProduct: () => void;
    onEditProduct: (product: any) => void;
    activeActionMenu: string | null;
    setActiveActionMenu: (val: string | null) => void;
    handleToggleStatus: (item: any) => void;
    handleDeleteProduct: (id: string) => void;
}

function getProductTypeBadge(type: string) {
    switch (type) {
        case 'digital_product':
            return { label: 'Dijital Ürün', color: '#5500FF', bg: 'rgba(85,0,255,0.08)' };
        case 'coaching_call':
            return { label: 'Danışmanlık', color: '#10B981', bg: 'rgba(16,185,129,0.08)' };
        case 'external_link':
            return { label: 'Bağlantı', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' };
        default:
            return { label: 'Dijital', color: '#64748B', bg: 'rgba(100,116,139,0.08)' };
    }
}

export default function ProductListSection({
    products,
    onAddProduct,
    onEditProduct,
    activeActionMenu,
    setActiveActionMenu,
    handleToggleStatus,
    handleDeleteProduct,
}: ProductListSectionProps) {
    const activeCount = products.filter(p => p.status === 'active').length;

    return (
        <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Card Header */}
            <div className="p-5 md:px-6 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                    <h2 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                        Ürün Listesi
                    </h2>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                        {activeCount} / {products.length} ürün vitrinde aktif görünür
                    </p>
                </div>

                <button
                    onClick={onAddProduct}
                    className="inline-flex items-center gap-1.5 bg-[#F8F9FE] hover:bg-[#F0F2FA] text-slate-700 border border-[#E8ECF4] px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-colors"
                >
                    <Plus className="w-3.5 h-3.5 text-[#5500FF]" />
                    <span>Ürün Ekle</span>
                </button>
            </div>

            {/* List */}
            {products.length === 0 ? (
                <div className="p-12 md:p-16 text-center space-y-4">
                    <div className="w-14 h-14 bg-indigo-50 text-[#5500FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        <Package className="w-7 h-7" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-[#0F172A] text-[16px] tracking-tight">
                            Henüz ürün eklemediniz
                        </h3>
                        <p className="text-slate-400 text-[13px] max-w-sm mx-auto mt-1 font-medium">
                            E-kitap, koçluk seansı veya dijital şablonunuzu ekleyerek mağazanızı aktifleştirin.
                        </p>
                    </div>
                    <button
                        onClick={onAddProduct}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-lg shadow-[#5500FF]/25 hover:opacity-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>İlk Ürününü Ekle</span>
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    <AnimatePresence>
                        {products.map((item) => {
                            const badge = getProductTypeBadge(item.type);
                            const isActive = item.status === 'active';

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 md:px-6 flex items-center gap-3.5 hover:bg-[#FAFBFF] transition-colors group relative"
                                >
                                    {/* Drag Grip Icon */}
                                    <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0 hidden sm:block">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    {/* Product Thumbnail */}
                                    <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>

                                    {/* Title and Badge */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-[14px] text-[#0F172A] truncate">
                                                {item.title}
                                            </h3>
                                            <span
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider"
                                                style={{ color: badge.color, backgroundColor: badge.bg }}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-slate-400 truncate mt-0.5 font-medium">
                                            {item.subtitle || item.description || 'Açıklama belirtilmemiş'}
                                        </p>
                                    </div>

                                    {/* Price Pill */}
                                    <span className="text-[13px] font-extrabold text-[#5500FF] bg-[#5500FF]/10 px-3 py-1 rounded-full shrink-0 font-mono">
                                        {item.price === 0 || !item.price ? 'Ücretsiz' : formatCurrency(item.price, item.currency || 'TRY')}
                                    </span>

                                    {/* iOS Style Toggle Switch for Visibility */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(item)}
                                        title={isActive ? 'Vitrinde aktif (Tıkla ve gizle)' : 'Gizli (Tıkla ve yayınla)'}
                                        className={cn(
                                            "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 relative focus:outline-none",
                                            isActive ? "bg-[#5500FF]" : "bg-slate-200"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out",
                                                isActive ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>

                                    {/* 3-Dot Action Menu */}
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                                            }}
                                            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>

                                        {activeActionMenu === item.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setActiveActionMenu(null)}
                                                />
                                                <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-[#E8ECF4] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                                                    <button
                                                        onClick={() => {
                                                            onEditProduct(item);
                                                            setActiveActionMenu(null);
                                                        }}
                                                        className="w-full px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FE] hover:text-[#5500FF] flex items-center gap-2.5 transition-colors"
                                                    >
                                                        <PenLine className="w-3.5 h-3.5" /> Düzenle
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleToggleStatus(item);
                                                            setActiveActionMenu(null);
                                                        }}
                                                        className="w-full px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FE] flex items-center gap-2.5 transition-colors"
                                                    >
                                                        {isActive ? (
                                                            <><EyeOff className="w-3.5 h-3.5" /> Gizle</>
                                                        ) : (
                                                            <><Eye className="w-3.5 h-3.5 text-emerald-600" /> Vitrinde Göster</>
                                                        )}
                                                    </button>
                                                    <div className="h-px bg-slate-100 my-1" />
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteProduct(item.id);
                                                            setActiveActionMenu(null);
                                                        }}
                                                        className="w-full px-3.5 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Sil
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
