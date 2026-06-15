'use client';

import React from 'react';
import { Package, Calendar, User, CreditCard, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OrderCardProps {
    order: any;
    onApprove: (order: any) => void;
    onReject: (orderId: string) => void;
    isProcessing: boolean;
}

export function OrderCard({ order, onApprove, onReject, isProcessing }: OrderCardProps) {
    const isPending = order.status === 'pending';
    const isCompleted = order.status === 'completed';
    const isCancelled = order.status === 'cancelled';

    const getStatusConfig = () => {
        if (isPending) return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Bekliyor', dot: 'bg-amber-500' };
        if (isCompleted) return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Tamamlandı', dot: 'bg-emerald-500' };
        if (isCancelled) return { color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Reddedildi', dot: 'bg-rose-500' };
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: order.status, dot: 'bg-slate-500' };
    };

    const statusConfig = getStatusConfig();
    const formattedDate = new Date(order.created_at).toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-slate-100/60 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all"
        >
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#5500ff]/5 text-[#5500ff] flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">{order.order_number}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border", statusConfig.color)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
                                {statusConfig.label}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-1">{order.product?.name || 'Bilinmeyen Ürün'}</p>
                    </div>
                </div>
                
                <div className="flex items-center sm:items-start sm:flex-col sm:text-right justify-between sm:justify-start gap-1">
                    <span className="text-2xl font-black text-slate-900">{order.product?.price} {order.product?.currency}</span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" /> 
                        {order.payment_provider || 'Bilinmeyen'} {order.payment_link_type === 'override' ? '(özel)' : ''}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="truncate">{order.customer?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <span>{formattedDate}</span>
                </div>
            </div>

            {isPending && (
                <div className="flex items-center gap-3 mt-6">
                    <button
                        onClick={() => onApprove(order)}
                        disabled={isProcessing}
                        className="flex-1 h-12 rounded-xl bg-[#5500ff] text-white font-black shadow-lg shadow-[#5500ff]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Onayla ve Teslim Et
                    </button>
                    <button
                        onClick={() => onReject(order.id)}
                        disabled={isProcessing}
                        className="h-12 px-6 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Reddet</span>
                    </button>
                </div>
            )}
            
            {isCompleted && (
                <div className="mt-6 flex justify-between items-center text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Teslim edildi
                    </div>
                    {order.confirmed_at && (
                        <span className="text-emerald-500/80 text-xs">{new Date(order.confirmed_at).toLocaleDateString('tr-TR')}</span>
                    )}
                </div>
            )}
            
            {isCancelled && (
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <XCircle className="w-5 h-5" />
                    Sipariş reddedildi
                </div>
            )}
        </motion.div>
    );
}
