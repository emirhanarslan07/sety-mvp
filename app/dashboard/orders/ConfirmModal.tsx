'use client';

import React from 'react';
import { X, Loader2, CheckCircle2, Mail, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onConfirm: (orderId: string) => void;
    isConfirming: boolean;
}

export function ConfirmModal({ isOpen, onClose, order, onConfirm, isConfirming }: ConfirmModalProps) {
    if (!isOpen || !order) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8 z-10"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-5">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Siparişi Onayla</h2>
                        <p className="text-sm font-bold text-slate-400 mt-2">Bu siparişi onayladığınızda müşteriye teslimat otomatik olarak yapılacaktır.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sipariş No</p>
                                    <p className="font-black text-slate-800">{order.order_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tutar</p>
                                    <p className="font-black text-slate-800">{order.product?.price} {order.product?.currency}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pt-4 border-t border-slate-200/60">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ürün</p>
                                    <p className="font-bold text-slate-700">{order.product?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Müşteri</p>
                                    <p className="font-bold text-slate-700">{order.customer?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-black text-slate-900">Teslimat Özeti:</p>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                <Mail className="w-4 h-4 text-[#5500ff]" />
                                E-posta ile {order.product?.type === 'digital_product' ? 'indirme linki' : 'bilgilendirme'} gönderilecek
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                                <Send className="w-4 h-4 text-[#0088cc]" />
                                Telegram bildirimi gönderilecek (varsa)
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                disabled={isConfirming}
                                className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={() => onConfirm(order.id)}
                                disabled={isConfirming}
                                className="flex-[2] h-12 rounded-xl bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {isConfirming ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Onaylanıyor...</>
                                ) : (
                                    <>Onayla ve Gönder</>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
