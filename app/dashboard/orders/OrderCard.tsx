'use client';

import React from 'react';
import { Package, Calendar, User, CreditCard, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
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
        if (isPending) return { color: 'bg-amber-50 text-amber-700 border-amber-200/60', label: 'Onay Bekliyor', dot: 'bg-amber-500' };
        if (isCompleted) return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', label: 'Tamamlandı', dot: 'bg-emerald-500' };
        if (isCancelled) return { color: 'bg-rose-50 text-rose-700 border-rose-200/60', label: 'Reddedildi', dot: 'bg-rose-500' };
        return { color: 'bg-slate-50 text-slate-700 border-slate-200/60', label: order.status, dot: 'bg-slate-500' };
    };

    const statusConfig = getStatusConfig();
    const formattedDate = new Date(order.created_at).toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const price = order.product?.price || order.amount || 0;
    const currency = order.product?.currency || 'TRY';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8ECF4] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#5500FF]/30 transition-all flex flex-col justify-between"
        >
            <div>
                {/* Header: Order Number + Status + Price */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#5500FF]/10 text-[#5500FF] flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-[14px] font-bold text-[#0F172A] tracking-tight">
                                    {order.order_number || `#${order.id?.slice(0, 8)}`}
                                </h3>
                                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border", statusConfig.color)}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
                                    {statusConfig.label}
                                </span>
                            </div>
                            <p className="text-[13px] font-semibold text-slate-700 mt-0.5 truncate">
                                {order.product?.name || order.product_title || 'Sety Dijital Ürün'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                        <span className="text-[17px] font-extrabold text-[#0F172A] tracking-tight font-mono">
                            ₺{Number(price).toLocaleString('tr-TR')}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-3.5 border-y border-[#F1F5F9] my-2">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{order.customer?.email || order.customer_email || 'Misafir Müşteri'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 sm:justify-end">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Actions / Status state */}
            {isPending && (
                <div className="flex items-center gap-2.5 mt-4 pt-1">
                    <button
                        onClick={() => onApprove(order)}
                        disabled={isProcessing}
                        className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white font-bold text-[12px] shadow-md shadow-[#5500FF]/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Onayla ve Teslim Et</span>
                    </button>
                    <button
                        onClick={() => onReject(order.id)}
                        disabled={isProcessing}
                        className="h-10 px-4 rounded-xl border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold text-[12px] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                        <XCircle className="w-4 h-4" />
                        <span>Reddet</span>
                    </button>
                </div>
            )}
            
            {isCompleted && (
                <div className="mt-4 flex justify-between items-center text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200/50">
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Başarıyla Teslim Edildi</span>
                    </div>
                    {order.confirmed_at && (
                        <span className="text-emerald-600/70 text-[11px]">
                            {new Date(order.confirmed_at).toLocaleDateString('tr-TR')}
                        </span>
                    )}
                </div>
            )}
            
            {isCancelled && (
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-xl border border-rose-200/50">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Sipariş Reddedildi</span>
                </div>
            )}
        </motion.div>
    );
}
