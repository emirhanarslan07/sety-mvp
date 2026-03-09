'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    Store,
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    ShoppingBag,
    DollarSign,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function StoresSection() {
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('stores')
                .select('*, user_profiles(full_name, email, profile_image_url)')
                .order('created_at', { ascending: false });

            setStores(data || []);
            setLoading(false);
        };
        fetchStores();
    }, []);

    const filteredStores = stores.filter(store =>
        store.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.user_profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Mağazalar</h1>
                    <p className="text-slate-400 font-medium">Platformdaki tüm aktif mağazaları buradan yönetebilirsin.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Mağaza veya kullanıcı ara..."
                            className="bg-white border border-slate-100 shadow-sm rounded-2xl pl-12 pr-6 h-12 w-80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-100 px-6 font-bold flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrele
                    </Button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Mağaza Bilgisi</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Sahibi</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Ürünler</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Oluşturma</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-10 py-10">
                                            <div className="h-8 bg-slate-50 rounded-xl w-3/4 mx-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredStores.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center">
                                                <Store className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold text-lg">Hiç mağaza bulunamadı.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStores.map((store) => (
                                    <tr key={store.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-400 group-hover:bg-white transition-all text-lg group-hover:scale-110">
                                                    {store.username?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-logo text-lg font-black text-slate-900 leading-tight">@{store.username}</p>
                                                    <a
                                                        href={`https://sety.store/${store.username}`}
                                                        target="_blank"
                                                        className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-1 opacity-60 hover:opacity-100 transition-opacity"
                                                    >
                                                        sety.store/{store.username}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                                    {store.user_profiles?.profile_image_url ? (
                                                        <img src={store.user_profiles.profile_image_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400">
                                                            {store.user_profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-[14px] leading-tight">{store.user_profiles?.full_name || 'İsimsiz'}</p>
                                                    <p className="text-[11px] text-slate-400 font-bold">{store.user_profiles?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 font-black text-[11px]">
                                                <ShoppingBag className="w-3 h-3" />
                                                -
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <div className="inline-flex items-center gap-2 text-slate-400 font-bold text-[13px]">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(store.created_at), 'd MMM yyyy', { locale: tr })}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <button className="p-2.5 rounded-2xl hover:bg-white text-slate-400 hover:text-primary transition-all active:scale-90 border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center text-sm font-bold text-slate-500">
                    <p>Toplam {filteredStores.length} mağaza listeleniyor</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl" disabled><ChevronLeft className="w-5 h-5" /></Button>
                        <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-slate-100 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 bg-white">1</Button>
                        <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl" disabled><ChevronRight className="w-5 h-5" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
