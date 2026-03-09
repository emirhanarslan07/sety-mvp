'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Shield,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function UsersSection() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('user_profiles')
                .select('*, stores(username)')
                .order('created_at', { ascending: false });

            setUsers(data || []);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Platform Üyeleri</h1>
                    <p className="text-slate-400 font-medium">Sety kütüphanesine katılan tüm üyeler ve mağaza sahiplerini buradan yönetebilirsin.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="İsim veya e-posta ara..."
                            className="bg-white border border-slate-100 shadow-sm rounded-2xl pl-12 pr-6 h-12 w-80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Kullanıcı Bilgisi</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Rol</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Mağaza</th>
                                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Katılım Tarihi</th>
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-bold text-lg">Hiç üye bulunamadı.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                                                    {user.profile_image_url ? (
                                                        <img src={user.profile_image_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-tight truncate">{user.full_name || 'Yeni Kullanıcı'}</p>
                                                    <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1 truncate">
                                                        <Mail className="w-3 h-3 text-slate-300" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest",
                                                user.role === 'admin'
                                                    ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            )}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                                {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            {user.stores && user.stores.length > 0 ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 font-bold text-[12px] border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all active:scale-95 cursor-pointer">
                                                    <span className="text-[#5500ff]">@{user.stores[0].username}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-7 text-center">
                                            <div className="inline-flex items-center gap-2 text-slate-400 font-bold text-[13px]">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                {format(new Date(user.created_at), 'd MMM yyyy', { locale: tr })}
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
                    <p>Toplam {filteredUsers.length} üye listeleniyor</p>
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
