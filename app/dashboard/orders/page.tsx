'use client';

import React, { useState, useEffect } from 'react';
import { PackageX, Filter, Loader2, ShoppingBag } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('pending');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/orders?status=${activeTab}`);
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error(err);
            showToast('Siparişler yüklenirken hata oluştu', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (orderId: string) => {
        setProcessingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            showToast('Sipariş başarıyla onaylandı ve teslim edildi! ✨', 'success');
            setIsModalOpen(false);
            
            // Optimistic update
            if (activeTab === 'pending') {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed', confirmed_at: new Date().toISOString() } : o));
            }
        } catch (err: any) {
            showToast(err.message || 'Onaylama başarısız oldu', 'error');
        } finally {
            setProcessingId(null);
            setSelectedOrder(null);
        }
    };

    const handleReject = async (orderId: string) => {
        if (!confirm('Bu siparişi reddetmek istediğinize emin misiniz?')) return;
        setProcessingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/reject`, { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            showToast('Sipariş reddedildi', 'success');
            
            // Optimistic update
            if (activeTab === 'pending') {
                setOrders(prev => prev.filter(o => o.id !== orderId));
            } else {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
            }
        } catch (err: any) {
            showToast(err.message || 'Reddetme başarısız oldu', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const tabs = [
        { id: 'pending', label: 'Bekleyen Onay' },
        { id: 'completed', label: 'Tamamlanan' },
        { id: 'all', label: 'Tümü' }
    ];

    return (
        <div className="max-w-[1300px] mx-auto p-4 md:p-8 space-y-6">
            {/* Action & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                        Sipariş Yönetimi
                    </h1>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        Mağazanızdan gelen siparişleri inceleyin ve müşterilerinize teslim edin.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F1F3F9] rounded-xl self-start sm:self-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-[#0F172A] shadow-sm"
                                    : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Content */}
            <div className="min-h-[350px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-[#5500FF]" />
                        <span className="text-[13px] font-medium">Siparişler yükleniyor...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-3"
                    >
                        <div className="w-14 h-14 bg-indigo-50 text-[#5500FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <PackageX className="w-7 h-7" />
                        </div>
                        <h3 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                            {activeTab === 'pending' ? 'Bekleyen sipariş bulunmuyor' : 'Kayıtlı sipariş bulunamadı'}
                        </h3>
                        <p className="text-[13px] text-slate-400 max-w-sm mx-auto font-medium">
                            {activeTab === 'pending' 
                                ? 'Müşterileriniz mağazanızdan ürün satın aldığında siparişler burada listelenecektir.' 
                                : 'Bu filtre kriterine uygun herhangi bir sipariş geçmişi kaydedilmemiş.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <AnimatePresence>
                            {orders.map(order => (
                                <OrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onApprove={(o) => { setSelectedOrder(o); setIsModalOpen(true); }}
                                    onReject={handleReject}
                                    isProcessing={processingId === order.id}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedOrder(null); }}
                order={selectedOrder}
                onConfirm={handleConfirm}
                isConfirming={processingId === selectedOrder?.id}
            />
        </div>
    );
}
