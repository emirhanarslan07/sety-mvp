'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Search,
    Check,
    Download,
    Calendar,
    Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { enUS } from 'date-fns/locale';
import { useDashboard } from '@/context/DashboardContext';

export default function SubscribersPage() {
    const router = useRouter();
    const { store } = useDashboard();
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (store?.id) {
            fetchSubscribers();
        }
    }, [store?.id]);

    const fetchSubscribers = async () => {
        if (!store?.id) return;
        try {
            setLoading(true);
            const res = await fetch(`/api/dashboard/subscribers?store_id=${store.id}`);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);
            setSubscribers(data || []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.products?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Aboneler 💌
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold">
                        E-posta toplama bloklarından gelen kişiler.
                    </p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-[28px] border border-slate-200/50 w-full md:w-auto overflow-hidden">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={'E-posta veya isim ara...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent text-[15px] font-bold focus:outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[44px] border border-slate-100/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden min-h-[600px] flex flex-col relative">
                {filteredSubscribers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-24 text-center px-4 border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50 mx-8 my-8">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 transform -rotate-6 transition-transform hover:rotate-0">
                            <Mail className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">
                            Aboneniz bulunmuyor
                        </h3>
                        <p className="text-slate-500 font-medium max-w-sm mb-10">
                            Mağazanıza e-posta toplama bloku ekleyerek hemen ilk abonenizi kazanabilirsiniz.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/store?action=add_block')}
                            className="bg-[#5500ff] text-white font-black px-10 py-5 rounded-2xl hover:bg-[#4400cc] shadow-xl shadow-[#5500ff]/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            E-posta Bloku Ekle
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="text-left py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">Abone</th>
                                    <th className="text-left py-10 px-6 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">Kaynak (Ürün)</th>
                                    <th className="text-left py-10 px-6 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">Tarih</th>
                                    <th className="text-right py-10 px-12 text-[12px] font-black text-slate-400 uppercase tracking-widest leading-none">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="group hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0">
                                        <td className="py-8 px-12 whitespace-nowrap">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-[16px] text-[#5500ff] group-hover:scale-105 transition-transform duration-500">
                                                    {sub.name?.[0]?.toUpperCase() || sub.email?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[17px] font-black text-slate-900 tracking-tight">{sub.name || 'İsimsiz'}</span>
                                                    <span className="text-[13px] font-bold text-slate-400">{sub.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Download className="w-4 h-4" />
                                                </div>
                                                <span className="text-[15px] font-bold text-slate-600">{sub.products?.title || 'Bilinmiyor'}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <Calendar className="w-4 h-4 text-slate-300" />
                                                <span className="text-[15px] font-bold text-slate-400">
                                                    {(() => {
                                                        try {
                                                            if (!sub.created_at) return 'N/A';
                                                            const dateObj = new Date(sub.created_at);
                                                            return format(dateObj, 'MMM dd, yyyy', { locale: enUS });
                                                        } catch (e) {
                                                            return 'N/A';
                                                        }
                                                    })()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-12 text-right whitespace-nowrap">
                                            <span className="px-4 py-1.5 rounded-full bg-[#E0FFEC] text-[#00A84D] text-[12px] font-black uppercase tracking-widest">
                                                Aktif
                                            </span>
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
