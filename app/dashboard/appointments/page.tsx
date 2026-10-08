'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    CheckCircle2,
    XCircle,
    MessageCircle,
    ChevronRight,
    Loader2,
    Filter,
    Plus,
    Copy,
    Check,
    Search,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import { updateAppointmentStatusAction } from '@/app/actions/appointment';
import ProductEditorModal from '@/components/modals/ProductEditorModal';

interface AppointmentRecord {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    payment_provider: string;
    product?: {
        id: string;
        title: string;
        type: string;
        coaching_config?: any;
    };
    meta: {
        is_appointment: boolean;
        session_type: 'online' | 'in_person';
        location?: string;
        preferred_date: string;
        time_slot: string;
        phone: string;
        client_note?: string;
        appointment_status: 'new' | 'confirmed' | 'completed' | 'cancelled';
        payment_mode?: string;
    };
}

export default function AppointmentsPage() {
    const { store, user, profile } = useDashboard();
    const { showToast } = useToast();

    const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'confirmed' | 'completed'>('new');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (store?.id) {
            fetchAppointments();
        }
    }, [store?.id]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    order_number,
                    customer_name,
                    customer_email,
                    amount,
                    currency,
                    status,
                    created_at,
                    notes,
                    payment_provider,
                    product:products (
                        id,
                        title,
                        type,
                        coaching_config
                    )
                `)
                .eq('store_id', store.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Filter for appointment orders (notes contain appointment meta)
            const parsedList: AppointmentRecord[] = [];

            (data || []).forEach((row: any) => {
                let meta: any = null;
                try {
                    meta = typeof row.notes === 'string' ? JSON.parse(row.notes) : row.notes;
                } catch {
                    meta = null;
                }

                // Either marked as appointment or product type is coaching_call
                const isApt = meta?.is_appointment || row.product?.type === 'coaching_call' || row.payment_link_type === 'appointment';

                if (isApt) {
                    const statusVal = meta?.appointment_status || (row.status === 'paid' ? 'confirmed' : 'new');
                    parsedList.push({
                        ...row,
                        product: Array.isArray(row.product) ? row.product[0] : row.product,
                        meta: {
                            is_appointment: true,
                            session_type: meta?.session_type || 'online',
                            location: meta?.location,
                            preferred_date: meta?.preferred_date || 'Belirtilmedi',
                            time_slot: meta?.time_slot || 'Gündüz',
                            phone: meta?.phone || 'Belirtilmedi',
                            client_note: meta?.client_note,
                            appointment_status: statusVal,
                            payment_mode: meta?.payment_mode || (row.payment_provider === 'shopier' ? 'pay_now' : 'request_only'),
                        },
                    });
                }
            });

            setAppointments(parsedList);
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            showToast('Randevular yüklenirken hata oluştu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: 'new' | 'confirmed' | 'completed' | 'cancelled') => {
        setActionLoadingId(orderId);
        try {
            const res = await updateAppointmentStatusAction(orderId, newStatus);
            if (!res.success) throw new Error(res.error);

            showToast(
                newStatus === 'confirmed' ? 'Randevu onaylandı! 🚀' :
                newStatus === 'completed' ? 'Randevu tamamlandı olarak işaretlendi. ✨' :
                newStatus === 'cancelled' ? 'Randevu iptal edildi.' : 'Durum güncellendi.',
                'success'
            );

            // Optimistic state update
            setAppointments((prev) =>
                prev.map((apt) =>
                    apt.id === orderId
                        ? {
                            ...apt,
                            status: newStatus === 'cancelled' ? 'cancelled' : newStatus === 'completed' ? 'paid' : 'pending',
                            meta: { ...apt.meta, appointment_status: newStatus },
                        }
                        : apt
                )
            );
        } catch (err: any) {
            showToast(err.message || 'Durum güncellenemedi', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const getWhatsAppUrl = (apt: AppointmentRecord) => {
        const rawPhone = apt.meta.phone.replace(/\D/g, '');
        if (!rawPhone) return '#';
        const formattedPhone = rawPhone.startsWith('90') ? rawPhone : rawPhone.startsWith('0') ? '9' + rawPhone : '90' + rawPhone;
        const serviceTitle = apt.product?.title || 'Danışmanlık';
        const clientName = apt.customer_name || 'Danışan';
        const dateInfo = `${apt.meta.preferred_date} (${apt.meta.time_slot})`;

        const text = `Merhaba ${clientName}, Sety üzerinden ilettiğiniz "${serviceTitle}" randevu talebinizi aldım. ${dateInfo} aralığında görüşme saatimizi netleştirmek için yazıyorum.`;
        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    };

    const copyStoreLink = () => {
        const url = `https://sety.store/${store?.username || user?.user_metadata?.username || ''}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Mağaza linki kopyalandı! 🚀', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    // Filter appointments
    const filteredAppointments = appointments.filter((apt) => {
        const statusMatch =
            activeTab === 'all'
                ? true
                : activeTab === 'new'
                    ? apt.meta.appointment_status === 'new'
                    : activeTab === 'confirmed'
                        ? apt.meta.appointment_status === 'confirmed'
                        : apt.meta.appointment_status === 'completed';

        if (!statusMatch) return false;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = apt.customer_name?.toLowerCase().includes(q);
            const emailMatch = apt.customer_email?.toLowerCase().includes(q);
            const phoneMatch = apt.meta.phone?.includes(q);
            const serviceMatch = apt.product?.title?.toLowerCase().includes(q);
            return nameMatch || emailMatch || phoneMatch || serviceMatch;
        }

        return true;
    });

    // Counts
    const counts = {
        all: appointments.length,
        new: appointments.filter((a) => a.meta.appointment_status === 'new').length,
        confirmed: appointments.filter((a) => a.meta.appointment_status === 'confirmed').length,
        completed: appointments.filter((a) => a.meta.appointment_status === 'completed').length,
    };

    return (
        <div className="max-w-[1240px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

            {/* TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] sm:text-[24px] font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Calendar className="w-6 h-6 text-[#5500FF]" />
                        <span>Randevular & Danışmanlık</span>
                    </h1>
                    <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium mt-1">
                        Danışanlarınızdan gelen seans taleplerini yönetin, tek tıkla WhatsApp üzerinden iletişime geçin.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={copyStoreLink}
                        className="h-11 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[13px] flex items-center gap-2 transition-all shadow-sm active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                        <span>{copied ? 'Kopyalandı' : 'Mağaza Linki'}</span>
                    </button>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-11 px-5 rounded-xl bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-[13px] flex items-center gap-2 transition-all shadow-md shadow-[#5500FF]/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Yeni Seans Hizmeti Ekle</span>
                    </button>
                </div>
            </div>

            {/* KPI STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Toplam Talep
                    </span>
                    <span className="text-[24px] sm:text-[28px] font-black text-slate-900 leading-tight">
                        {counts.all}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                        Bekleyen / Yeni
                    </span>
                    <span className="text-[24px] sm:text-[28px] font-black text-amber-900 leading-tight">
                        {counts.new}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5500FF] block mb-1">
                        Onaylanan
                    </span>
                    <span className="text-[24px] sm:text-[28px] font-black text-indigo-950 leading-tight">
                        {counts.confirmed}
                    </span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                        Tamamlanan
                    </span>
                    <span className="text-[24px] sm:text-[28px] font-black text-emerald-900 leading-tight">
                        {counts.completed}
                    </span>
                </div>
            </div>

            {/* CONTROLS: TABS & SEARCH */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2",
                            activeTab === 'new'
                                ? "bg-amber-500 text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <span>Yeni Talepler</span>
                        {counts.new > 0 && (
                            <span className={cn(
                                "px-1.5 py-0.5 rounded-full text-[10px] font-black",
                                activeTab === 'new' ? "bg-white text-amber-600" : "bg-amber-100 text-amber-800"
                            )}>
                                {counts.new}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('confirmed')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2",
                            activeTab === 'confirmed'
                                ? "bg-[#5500FF] text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <span>Onaylananlar</span>
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-[10px] font-black",
                            activeTab === 'confirmed' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        )}>
                            {counts.confirmed}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('completed')}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2",
                            activeTab === 'completed'
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <span>Tamamlanan</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('all')}
                        className={cn(
                            "px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all",
                            activeTab === 'all'
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        <span>Tümü ({counts.all})</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Danışan veya telefon ara..."
                        className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-900 outline-none focus:border-[#5500FF] transition-all"
                    />
                </div>
            </div>

            {/* APPOINTMENT LIST */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-[#5500FF]" />
                    <span className="text-[14px] font-bold">Talepler yükleniyor...</span>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="py-16 px-6 text-center rounded-3xl bg-white border border-slate-200/80 shadow-sm max-w-lg mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 text-[#5500FF] flex items-center justify-center mx-auto">
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-[17px] font-black text-slate-900">
                            {activeTab === 'new' ? 'Bekleyen Yeni Talep Yok' : 'Kayıt Bulunamadı'}
                        </h3>
                        <p className="text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">
                            {activeTab === 'new'
                                ? 'Şu anda onay bekleyen yeni bir seans talebiniz bulunmuyor. Mağaza linkinizi Instagram bionuzda paylaşarak danışan toplamaya başlayabilirsiniz.'
                                : 'Arama kriterlerinize uygun randevu talebi bulunamadı.'}
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                        <button
                            onClick={copyStoreLink}
                            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Mağaza Linkimi Kopyala</span>
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-indigo-50 text-[#5500FF] hover:bg-indigo-100 font-bold text-[13px] transition-all"
                        >
                            + Seans Hizmeti Ekle
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3.5">
                    {filteredAppointments.map((apt) => {
                        const isActionLoading = actionLoadingId === apt.id;
                        const isOnline = apt.meta.session_type === 'online';
                        const waUrl = getWhatsAppUrl(apt);

                        return (
                            <div
                                key={apt.id}
                                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                            >
                                {/* Left Side: Client Info & Meeting Details */}
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {/* Status Badge */}
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider",
                                            apt.meta.appointment_status === 'new' && "bg-amber-100 text-amber-800",
                                            apt.meta.appointment_status === 'confirmed' && "bg-indigo-100 text-[#5500FF]",
                                            apt.meta.appointment_status === 'completed' && "bg-emerald-100 text-emerald-800",
                                            apt.meta.appointment_status === 'cancelled' && "bg-slate-100 text-slate-500"
                                        )}>
                                            {apt.meta.appointment_status === 'new' ? '🟡 Yeni Talep' :
                                             apt.meta.appointment_status === 'confirmed' ? '🟢 Onaylandı' :
                                             apt.meta.appointment_status === 'completed' ? '✓ Tamamlandı' : 'İptal'}
                                        </span>

                                        {/* Session Type Pill */}
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1",
                                            isOnline ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                        )}>
                                            {isOnline ? '🌐 Online Seans' : '📍 Yüz Yüze'}
                                        </span>

                                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                                            #{apt.order_number}
                                        </span>

                                        <span className="text-[11px] text-slate-400 font-medium">
                                            • {new Date(apt.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Client Name & Product */}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[18px] font-extrabold text-slate-900 leading-snug">
                                                {apt.customer_name}
                                            </h3>
                                            <span className="text-[14px] text-slate-400 font-medium">
                                                — {apt.product?.title || 'Danışmanlık Hizmeti'}
                                            </span>
                                        </div>

                                        {/* Preferred DateTime */}
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-[13px] text-slate-600 font-medium">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                                <Calendar className="w-4 h-4 text-[#5500FF]" />
                                                <span>{apt.meta.preferred_date}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 font-semibold">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span>{apt.meta.time_slot}</span>
                                            </div>

                                            {!isOnline && apt.meta.location && (
                                                <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100 font-semibold text-xs">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span>{apt.meta.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Contact row */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                                        <a
                                            href={`tel:${apt.meta.phone}`}
                                            className="flex items-center gap-1 hover:text-[#5500FF] transition-colors"
                                        >
                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{apt.meta.phone}</span>
                                        </a>

                                        <a
                                            href={`mailto:${apt.customer_email}`}
                                            className="flex items-center gap-1 hover:text-[#5500FF] transition-colors"
                                        >
                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{apt.customer_email}</span>
                                        </a>

                                        {apt.amount > 0 && (
                                            <span className="font-bold text-slate-800">
                                                Ücret: {formatCurrency(apt.amount, apt.currency)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Client Note */}
                                    {apt.meta.client_note && (
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[12px] text-slate-600 font-medium italic">
                                            <span className="font-bold text-slate-700 not-italic mr-1.5">Danışan Notu:</span>
                                            &ldquo;{apt.meta.client_note}&rdquo;
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Actions (WhatsApp, Confirm, Complete) */}
                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                                    {/* Direct WhatsApp Button */}
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                                    >
                                        <MessageCircle className="w-4 h-4 fill-white" />
                                        <span>WhatsApp&apos;tan Yaz</span>
                                    </a>

                                    {/* Status Controls */}
                                    <div className="flex items-center gap-1.5">
                                        {apt.meta.appointment_status === 'new' && (
                                            <>
                                                <button
                                                    disabled={isActionLoading}
                                                    onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                                    className="h-10 px-3.5 rounded-xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center gap-1.5"
                                                >
                                                    {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    <span>Onayla</span>
                                                </button>
                                                <button
                                                    disabled={isActionLoading}
                                                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                                    className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-bold transition-all disabled:opacity-60"
                                                >
                                                    İptal
                                                </button>
                                            </>
                                        )}

                                        {apt.meta.appointment_status === 'confirmed' && (
                                            <>
                                                <button
                                                    disabled={isActionLoading}
                                                    onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                                    className="h-10 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-60 flex items-center gap-1.5"
                                                >
                                                    {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                    <span>Tamamlandı</span>
                                                </button>
                                                <button
                                                    disabled={isActionLoading}
                                                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                                    className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-bold transition-all disabled:opacity-60"
                                                >
                                                    İptal
                                                </button>
                                            </>
                                        )}

                                        {apt.meta.appointment_status === 'completed' && (
                                            <button
                                                disabled={isActionLoading}
                                                onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                                                className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all disabled:opacity-60"
                                            >
                                                Tekrar Aç
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal for adding coaching / consultation service */}
            <ProductEditorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                productType={{ id: 'coaching_call' }}
                onSuccess={() => {
                    fetchAppointments();
                }}
            />

        </div>
    );
}
