'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Search,
    Zap,
    Check,
    Plus
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { enUS } from 'date-fns/locale';
import { useTranslation } from '@/lib/i18n/context';
import { useDashboard } from '@/context/DashboardContext';

export default function CustomersPage() {
    const { t } = useTranslation();
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
        <div className="max-w-[1200px] mx-auto space-y-10 pb-32 px-4 md:px-8 pt-8 text-slate-900">
            {/* Premium Header & ActionsSection */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-[28px] border border-slate-200/50 w-full md:w-auto overflow-hidden">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('dashboard.customers.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent text-[15px] font-bold focus:outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <button className="h-16 px-10 bg-slate-900 text-white rounded-[28px] font-black text-[15px] flex items-center gap-3 shadow-[0_20px_40px_rgba(15,23,42,0.15)] hover:bg-[#5500ff] transition-all hover:scale-[1.02] active:scale-95 group">
                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t('dashboard.customers.actions.add_contact')}
                </button>
            </div>

            {/* Premium Filter Pills */}
            <div className="flex flex-wrap gap-2.5">
                {[
                    { key: 'name', label: t('dashboard.customers.filters.name') },
                    { key: 'email', label: t('dashboard.customers.filters.email') },
                    { key: 'joined', label: t('dashboard.customers.filters.joined') },
                    { key: 'orders', label: t('dashboard.customers.filters.orders') },
                    { key: 'spent', label: t('dashboard.customers.filters.spent') },
                ].map((filter, index) => (
                    <button
                        key={index}
                        className="h-11 px-6 bg-white border border-slate-100/80 text-slate-500 text-[14px] font-black rounded-full transition-all flex items-center gap-2.5 hover:border-slate-300 hover:text-slate-900 shadow-sm active:scale-95">
                        <Plus className="w-4 h-4 text-slate-300" />
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[44px] border border-slate-100/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden min-h-[600px] flex flex-col items-center justify-center relative">
                {filteredCustomers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center max-w-2xl mx-auto w-full">
                        {/* Premium Clean Empty State Illustration */}
                        <div className="relative mb-16">
                            <div className="absolute inset-0 bg-[#5500ff]/5 rounded-full blur-[80px] scale-150" />
                            <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 flex items-center justify-center relative z-10">
                                <Users className="w-12 h-12 text-[#5500ff] stroke-[2.5px]" />
                                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#E0FFEC] border-4 border-white shadow-lg flex items-center justify-center">
                                    <Check className="w-5 h-5 text-[#00A84D] stroke-[3px]" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-[32px] md:text-[40px] font-black text-slate-900 tracking-tight leading-none">
                                {t('dashboard.customers.empty_title')}
                            </h3>
                            <button
                                onClick={() => router.push('/dashboard/store?tab=store&action=add')}
                                className="group inline-flex items-center gap-4 text-[#5500ff] text-[20px] font-black hover:gap-6 transition-all duration-300"
                            >
                                {t('dashboard.customers.empty_cta')}
                                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <p className="text-slate-400 text-[16px] font-bold pt-8 leading-relaxed opacity-80">
                                {t('dashboard.customers.empty_footer')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('dashboard.customers.filters.name')}</th>
                                    <th className="text-left py-10 px-6 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('dashboard.customers.filters.email')}</th>
                                    <th className="text-left py-10 px-6 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('dashboard.customers.filters.joined')}</th>
                                    <th className="text-center py-10 px-6 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('dashboard.customers.filters.orders')}</th>
                                    <th className="text-right py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('dashboard.customers.filters.spent')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0">
                                        <td className="py-8 px-12 whitespace-nowrap">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-[16px] text-[#5500ff] group-hover:scale-105 transition-transform duration-500">
                                                    {customer.name?.[0]?.toUpperCase() || 'C'}
                                                </div>
                                                <span className="text-[17px] font-black text-slate-900 tracking-tight">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-6 whitespace-nowrap">
                                            <span className="text-[15px] font-bold text-slate-400">{customer.email}</span>
                                        </td>
                                        <td className="py-8 px-6 whitespace-nowrap">
                                            <span className="text-[15px] font-bold text-slate-400">
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
                                        <td className="py-8 px-6 text-center whitespace-nowrap">
                                            <span className="text-[16px] font-black text-slate-900">{customer.orderCount}</span>
                                        </td>
                                        <td className="py-8 px-12 text-right whitespace-nowrap font-black text-slate-900 text-[19px] tracking-tight">
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
