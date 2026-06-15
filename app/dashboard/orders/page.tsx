'use client';

import React, { useState, useEffect } from 'react';
import { PackageX, Filter, Loader2 } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Siparişler 📦
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        Müşteri siparişlerinizi yönetin ve onaylayın.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl w-full md:w-auto border border-slate-200/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#5500ff]" />
                        <span className="font-bold">Yükleniyor...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50"
                    >
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                            <PackageX className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Henüz sipariş yok</h3>
                        <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">
                            {activeTab === 'pending' 
                                ? 'Şu anda onayınızı bekleyen yeni bir sipariş bulunmuyor.' 
                                : 'Bu filtreye uygun sipariş kaydı bulunamadı.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
