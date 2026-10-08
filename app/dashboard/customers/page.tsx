'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Search,
    ShoppingBag,
    Mail,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { tr } from 'date-fns/locale';
import { useDashboard } from '@/context/DashboardContext';

export default function CustomersPage() {
    const router = useRouter();
    const { store, loading: contextLoading } = useDashboard();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (store?.id) {
            fetchCustomers();
        } else if (!contextLoading && !store) {
            setLoading(false);
        }
    }, [store?.id, contextLoading]);

    const fetchCustomers = async () => {
        if (!store?.id) return;
        try {
            setLoading(true);

            // Fetch customers with their orders
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

    if (loading) {
        return (
            <div className="p-4 md:p-8 space-y-6 max-w-[1300px] mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-44 rounded-xl" />
                    <Skeleton className="h-10 w-64 rounded-xl" />
                </div>
                <div className="bg-white rounded-2xl border border-[#E8ECF4] p-6 space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1300px] mx-auto p-4 md:p-8 space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
                        Müşteri Listesi
                    </h1>
                    <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        Mağazanızdan sipariş veren ve içeriklerinize kayıt olan alıcılar.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Müşteri veya e-posta ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#E8ECF4] text-[13px] font-semibold text-slate-900 focus:outline-none focus:border-[#5500FF] transition-colors"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#F1F3F9] text-[#0F172A] rounded-xl text-[12px] font-bold shrink-0">
                        <Users className="w-3.5 h-3.5 text-[#5500FF]" />
                        <span>{customers.length} Müşteri</span>
                    </div>
                </div>
            </div>

            {/* Customers Table / Card Container */}
            <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                {filteredCustomers.length === 0 ? (
                    <div className="p-12 md:p-16 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-14 h-14 bg-indigo-50 text-[#5500FF] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-[16px] font-extrabold text-[#0F172A] tracking-tight">
                            Henüz kayıtlı müşteri yok
                        </h3>
                        <p className="text-[13px] text-slate-400 font-medium max-w-sm mx-auto">
                            {searchQuery ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Mağazanız üzerinden ilk satışınızı gerçekleştirdiğinizde müşterileriniz burada otomatik listelenecektir.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => router.push('/dashboard/store')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5500FF] to-[#7B2FFF] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-lg shadow-[#5500FF]/25 hover:opacity-95 transition-all mt-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Ürünleri Görüntüle</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#F1F5F9] bg-[#FAFBFF]">
                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                        Müşteri
                                    </th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                        E-posta
                                    </th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                        Kayıt Tarihi
                                    </th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-center">
                                        Sipariş Sayısı
                                    </th>
                                    <th className="py-3 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-right">
                                        Toplam Harcama
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCustomers.map((customer) => {
                                    const initial = (customer.name?.[0] || customer.email?.[0] || 'M').toUpperCase();
                                    const formattedDate = customer.created_at
                                        ? new Date(customer.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : '—';

                                    return (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-[#FAFBFF] transition-colors group cursor-default"
                                        >
                                            <td className="py-3.5 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-[#5500FF]/10 text-[#5500FF] font-bold text-[13px] flex items-center justify-center shrink-0">
                                                        {initial}
                                                    </div>
                                                    <span className="font-bold text-[13px] text-[#0F172A]">
                                                        {customer.name || 'İsimsiz Müşteri'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6 whitespace-nowrap text-[13px] font-medium text-slate-500">
                                                {customer.email || '—'}
                                            </td>
                                            <td className="py-3.5 px-6 whitespace-nowrap text-[12px] font-medium text-slate-400">
                                                {formattedDate}
                                            </td>
                                            <td className="py-3.5 px-6 whitespace-nowrap text-center">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] font-mono">
                                                    {customer.orderCount}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 whitespace-nowrap text-right font-extrabold text-[14px] text-[#0F172A] font-mono">
                                                ₺{Number(customer.totalSpent || 0).toLocaleString('tr-TR')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
