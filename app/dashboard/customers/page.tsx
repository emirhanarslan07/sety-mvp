'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    ShoppingBag,
    Download,
    Star,
    Loader2,
    UserCheck,
    Zap,
    Activity,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import { useDashboard } from '@/context/DashboardContext';

export default function CustomersPage() {
    const router = useRouter();
    const { store } = useDashboard();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (store?.id) {
            fetchCustomers();
        }
    }, [store?.id]);

    const fetchCustomers = async () => {
        if (!store?.id) return;
        try {
            setLoading(true);

            // Fetch customers with their items
            const { data, error } = await supabase
                .from('customers')
                .select(`
                    *,
                    orders(amount)
                `)
                .eq('store_id', store.id);

            if (error) throw error;

            // Process data for the table
            const processedCustomers = (data || []).map(customer => ({
                ...customer,
                orderCount: customer.orders?.length || 0,
                totalSpent: (customer.orders || []).reduce((sum: number, order: any) => sum + (order.amount || 0), 0)
            }));

            setCustomers(processedCustomers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filterPills = [
        { label: 'Name', icon: '+' },
        { label: 'Email', icon: '+' },
        { label: 'Since', icon: '+' },
        { label: 'Purchases', icon: '+' },
        { label: 'Spent', icon: '+' },
        { label: 'Product', icon: '+' },
        { label: 'Active Subscription', icon: '+' },
        { label: 'Tag', icon: '+' },
    ];

    if (loading) {
        return (
            <div className="p-8 space-y-6 max-w-[1400px] mx-auto w-full">
                <div className="flex justify-between items-center mb-10">
                    <Skeleton className="h-10 w-48 rounded-2xl" />
                    <Skeleton className="h-12 w-40 rounded-2xl" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-[32px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-6">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5500ff] transition-colors" />
                        <input
                            type="text"
                            placeholder="Müşterilerde ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[14px] focus:outline-none focus:ring-4 focus:ring-[#5500ff]/5 focus:border-[#5500ff]/20 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <Button
                        className="h-11 px-6 bg-[#5500ff] hover:bg-[#4400cc] text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_10px_20px_-5px_rgba(85,0,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Users className="w-4.5 h-4.5" />
                        Kişi Ekle
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { label: 'İsim', icon: '+' },
                    { label: 'E-posta', icon: '+' },
                    { label: 'Kayıt Tarihi', icon: '+' },
                    { label: 'Siparişler', icon: '+' },
                    { label: 'Harcama', icon: '+' },
                    { label: 'Ürün', icon: '+' },
                    { label: 'Aktif Abonelik', icon: '+' },
                    { label: 'Etiket', icon: '+' },
                ].map((filter, index) => (
                    <button
                        key={index}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[13px] font-semibold rounded-lg transition-all flex items-center gap-2 border border-slate-200/50">
                        <span className="text-slate-300 font-bold">{filter.icon}</span>
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative">
                {filteredCustomers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-4xl mx-auto w-full">

                        {/* Clean High-Fidelity Illustration */}
                        <div className="relative mb-12 w-full max-w-[500px] h-[300px] flex items-center justify-center mx-auto scale-90 md:scale-105">

                            {/* Card 1: Revenue Card (Background Layer) */}
                            <div className="absolute -top-10 right-8 w-44 bg-white rounded-[24px] border border-slate-100 shadow-xl p-6 translate-x-4 rotate-[8deg] z-10 animate-in slide-in-from-right-10 duration-1000">
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] font-bold text-slate-400">Toplam Gelir</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">$896.07</p>
                                    <div className="pt-3">
                                        <svg viewBox="0 0 100 30" className="w-full h-10 overflow-visible">
                                            <path d="M0,25 Q15,22 30,24 T60,12 T90,6" fill="none" stroke="#5500ff" strokeWidth="3" strokeLinecap="round" />
                                            <path d="M0,25 Q15,22 30,24 T60,12 T90,6 L90,30 L0,30 Z" fill="url(#violet-gradient-clean)" opacity="0.1" />
                                            <defs>
                                                <linearGradient id="violet-gradient-clean" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#5500ff" />
                                                    <stop offset="100%" stopColor="#5500ff" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Sales Notification (Main Focus) */}
                            <div className="absolute top-8 left-2 w-[320px] bg-white rounded-[28px] border border-slate-100 shadow-2xl p-7 -translate-x-4 z-20 transition-transform hover:scale-105 duration-500">
                                <div className="flex items-center gap-5 mb-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#5500ff] flex items-center justify-center shadow-lg shadow-indigo-100">
                                        <Zap className="w-7 h-7 text-[#C4FF00]" fill="#C4FF00" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">Bir müşteri az önce</p>
                                        <p className="text-[13px] font-black text-[#5500ff] uppercase tracking-tighter leading-tight">ürün satın aldı!</p>
                                    </div>
                                </div>
                                <div className="flex items-center -space-x-3">
                                    {[
                                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
                                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
                                    ].map((url, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-50 overflow-hidden shadow-sm flex items-center justify-center">
                                            <img src={url} alt="Customer" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 3: Rating Badge (Front Subtle Detail) */}
                            <div className="absolute bottom-20 right-12 bg-[#FFD700] rounded-xl shadow-lg px-4 py-2 flex items-center gap-2 rotate-[-6deg] z-30 border-2 border-white">
                                <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                                <span className="text-[15px] font-black text-slate-900">5.0</span>
                            </div>
                        </div>

                        {/* Ultra-Clean Call to Action */}
                        <div className="space-y-6 relative z-50">
                            <h3 className="text-[32px] md:text-[36px] font-black text-slate-900 tracking-tighter leading-none">
                                İlk müşterinizi kazanın
                            </h3>
                            <button
                                onClick={() => router.push('/dashboard/store?tab=store&action=add')}
                                className="inline-flex items-center gap-2 text-[#5500ff] text-[18px] font-bold hover:gap-4 transition-all duration-300 group"
                            >
                                Mağazanızı paylaşın ve satışa başlayın
                                <span className="text-xl">→</span>
                            </button>
                            <p className="text-slate-400 text-sm font-medium pt-4 opacity-80">
                                Veya müşteri listenizi nasıl büyüteceğinizi{' '}
                                <span className="text-[#5500ff] font-bold cursor-pointer hover:underline underline-offset-4 decoration-primary/20">buradan</span> öğrenin
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/30">
                                    <th className="text-left py-4 px-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">İsim</th>
                                    <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">E-posta</th>
                                    <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kayıt Tarihi</th>
                                    <th className="text-center py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sipariş</th>
                                    <th className="text-right py-4 px-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Harcama</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer border-b border-slate-50/50 last:border-0">
                                        <td className="py-5 px-10 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-[13px] text-slate-500 group-hover:bg-[#5500ff]/10 group-hover:text-[#5500ff] transition-all">
                                                    {customer.name?.[0]?.toUpperCase() || 'C'}
                                                </div>
                                                <span className="text-[14px] font-bold text-slate-900 group-hover:text-[#5500ff] transition-colors">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 whitespace-nowrap">
                                            <span className="text-[14px] font-medium text-slate-400">{customer.email}</span>
                                        </td>
                                        <td className="py-6 px-6 whitespace-nowrap">
                                            <span className="text-[14px] font-medium text-slate-400">
                                                {(() => {
                                                    try {
                                                        if (!customer.created_at) return 'N/A';
                                                        const dateObj = new Date(customer.created_at);
                                                        if (isNaN(dateObj.getTime())) return 'N/A';
                                                        return format(dateObj, 'MMM dd, yyyy', { locale: enUS });
                                                    } catch (e) {
                                                        return 'N/A';
                                                    }
                                                })()}
                                            </span>
                                        </td>
                                        <td className="py-6 px-6 text-center whitespace-nowrap">
                                            <span className="text-[14px] font-bold text-slate-900">{customer.orderCount}</span>
                                        </td>
                                        <td className="py-6 px-10 text-right whitespace-nowrap font-black text-slate-900 text-[15px]">
                                            {formatCurrency(customer.totalSpent)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
