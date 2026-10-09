'use client';

import React, { useState, useEffect } from 'react';
import {
    CalendarDays,
    Users,
    Check,
    Video,
    TrendingUp,
    Search,
    MessageCircle,
    MapPin,
    Globe,
    Phone,
    Mail,
    Plus,
    Loader2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import { updateAppointmentStatusAction } from '@/app/actions/appointment';
import ProductEditorModal from '@/components/modals/ProductEditorModal';

// ─── Stat Card ───
function Stat({
    label,
    value,
    change,
    icon: Icon,
    color = '',
    index = 0
}: {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color?: string;
    index?: number;
}) {
    return (
        <div className="stat">
            <div className="stat-top">
                <span>{label}</span>
                <span className={`stat-icon ${color}`}>
                    <Icon size={15} />
                </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-bottom">
                <span className="trend">
                    <TrendingUp size={11} />
                    {change}
                </span>
                <span>geçen aya göre</span>
            </div>
            <svg viewBox="0 0 70 35" className="sparkline" aria-hidden="true">
                <polyline
                    points={
                        index % 2
                            ? '1,30 12,24 23,28 34,12 46,18 57,8 69,2'
                            : '1,30 12,20 23,25 34,10 46,16 57,5 69,1'
                    }
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

// ─── Sample Demo Appointments ───
const SAMPLE_APPOINTMENTS = [
    {
        id: 'sample-apt-1',
        name: 'Mert Demir',
        initials: 'MD',
        email: 'mert.demir@example.com',
        phone: '0555 123 4567',
        service: '1:1 Strateji Görüşmesi',
        date: '12 Ekim, Pazartesi',
        time: '14:00 – 14:45',
        type: 'online' as const,
        price: '₺1.490',
        priceRaw: 1490,
        status: 'new' as const
    },
    {
        id: 'sample-apt-2',
        name: 'Deniz Aksoy',
        initials: 'DA',
        email: 'deniz.aksoy@example.com',
        phone: '0532 987 6543',
        service: 'Klinik Değerlendirme & Seans',
        date: '13 Ekim, Salı',
        time: '11:00 – 11:45',
        type: 'in_person' as const,
        location: 'Açıkgöz Plaza K:3 D:12',
        price: '₺1.850',
        priceRaw: 1850,
        status: 'confirmed' as const
    },
    {
        id: 'sample-apt-3',
        name: 'Selin Yılmaz',
        initials: 'SY',
        email: 'selin.yilmaz@example.com',
        phone: '0544 555 6677',
        service: '1:1 Strateji Görüşmesi',
        date: '14 Ekim, Çarşamba',
        time: '15:00 – 15:45',
        type: 'online' as const,
        price: '₺1.490',
        priceRaw: 1490,
        status: 'completed' as const
    }
];

export default function AppointmentsPage() {
    const { store } = useDashboard();
    const { showToast } = useToast();

    const [tab, setTab] = useState<'Yeni Talepler' | 'Onaylananlar' | 'Tamamlanan' | 'Tümü'>('Yeni Talepler');
    const [query, setQuery] = useState('');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (store?.id) {
            fetchAppointments();
        } else {
            setAppointments(SAMPLE_APPOINTMENTS);
            setLoading(false);
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
                    product:products (
                        id,
                        title,
                        type
                    )
                `)
                .eq('store_id', store?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const parsed: any[] = [];
            (data || []).forEach((row: any) => {
                let meta: any = null;
                try {
                    meta = typeof row.notes === 'string' ? JSON.parse(row.notes) : row.notes;
                } catch {
                    meta = null;
                }

                const isApt =
                    meta?.is_appointment ||
                    row.product?.type === 'coaching_call' ||
                    row.payment_link_type === 'appointment';

                if (isApt) {
                    const statusVal =
                        meta?.appointment_status ||
                        (row.status === 'paid' ? 'confirmed' : 'new');
                    const name = row.customer_name || 'Danışan';
                    const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0].toUpperCase())
                        .join('') || 'D';

                    parsed.push({
                        id: row.id,
                        rawId: row.id,
                        name,
                        initials,
                        email: row.customer_email || '—',
                        phone: meta?.phone || 'Belirtilmedi',
                        service: row.product?.title || 'Danışmanlık Seansı',
                        date: meta?.preferred_date || new Date(row.created_at).toLocaleDateString('tr-TR'),
                        time: meta?.time_slot || 'Gündüz',
                        type: meta?.session_type || 'online',
                        location: meta?.location,
                        price: `₺${Number(row.amount || 0).toLocaleString('tr-TR')}`,
                        priceRaw: Number(row.amount || 0),
                        status: statusVal
                    });
                }
            });

            if (parsed.length > 0) {
                setAppointments(parsed);
            } else {
                setAppointments(SAMPLE_APPOINTMENTS);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setAppointments(SAMPLE_APPOINTMENTS);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (apt: any) => {
        if (!apt.rawId) {
            // Local fallback
            setAppointments(prev =>
                prev.map(a => (a.id === apt.id ? { ...a, status: 'confirmed' } : a))
            );
            showToast('Örnek randevu onaylandı ✨', 'success');
            return;
        }

        setActionLoadingId(apt.id);
        try {
            const res = await updateAppointmentStatusAction(apt.rawId, 'confirmed');
            if (!res.success) throw new Error(res.error);
            showToast('Randevu onaylandı! 🚀', 'success');
            setAppointments(prev =>
                prev.map(a => (a.id === apt.id ? { ...a, status: 'confirmed' } : a))
            );
        } catch (err: any) {
            showToast(err.message || 'Onaylanamadı', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter appointments
    const visible = appointments.filter(a => {
        const matchesQuery =
            `${a.name} ${a.service} ${a.email} ${a.phone}`
                .toLocaleLowerCase('tr')
                .includes(query.toLocaleLowerCase('tr'));

        const matchesTab =
            tab === 'Tümü' ||
            (tab === 'Yeni Talepler' && a.status === 'new') ||
            (tab === 'Onaylananlar' && a.status === 'confirmed') ||
            (tab === 'Tamamlanan' && a.status === 'completed');

        return matchesTab && matchesQuery;
    });

    // Counts
    const totalCount = appointments.length;
    const newCount = appointments.filter(a => a.status === 'new').length;
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Randevular & Danışmanlık</h1>
                    <p className="subtitle">Bilgini paylaş, anlamlı bağlantılar kur.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Plus size={14} />
                        Yeni Seans Hizmeti
                    </Button>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Toplam Talep"
                    value={totalCount.toString()}
                    change="+8 talep"
                    icon={CalendarDays}
                />
                <Stat
                    label="Bekleyen / Yeni"
                    value={newCount.toString()}
                    change={newCount > 0 ? `${newCount} yeni talep` : 'Bekleyen yok'}
                    icon={Users}
                    color="orange"
                    index={1}
                />
                <Stat
                    label="Onaylanan"
                    value={confirmedCount.toString()}
                    change="Bu hafta"
                    icon={Check}
                />
                <Stat
                    label="Tamamlanan"
                    value={completedCount.toString()}
                    change="+5 seans"
                    icon={Video}
                    color="green"
                    index={1}
                />
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['Yeni Talepler', 'Onaylananlar', 'Tamamlanan', 'Tümü'] as const).map(item => (
                        <Button
                            key={item}
                            size="sm"
                            variant="ghost"
                            onClick={() => setTab(item)}
                            className={`text-[10px] h-7 px-3 font-bold ${
                                tab === item ? 'selected' : 'text-muted-foreground'
                            }`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>

                <label className="search">
                    <Search size={14} />
                    <input
                        placeholder="Danışan ara..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* ═══ APPOINTMENTS PANEL ═══ */}
            <section className="panel">
                <div className="panel-header">
                    <h2>{tab}</h2>
                    <span className="badge purple">
                        {visible.length} seans randevusu
                    </span>
                </div>

                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                        <span className="text-xs font-semibold">Randevular yükleniyor...</span>
                    </div>
                ) : visible.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Danışan</th>
                                    <th>Seans Tarihi</th>
                                    <th>Saat & Mod</th>
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                    <th className="text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(a => (
                                    <tr key={a.id}>
                                        <td>
                                            <div className="product">
                                                <div className="avatar">{a.initials}</div>
                                                <div>
                                                    <strong>{a.name}</strong>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {a.service}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{a.date}</td>
                                        <td>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-muted-foreground">{a.time}</span>
                                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                    {a.type === 'in_person' ? (
                                                        <>
                                                            <MapPin size={10} className="text-emerald-600" />
                                                            {a.location || 'Yüz yüze'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe size={10} className="text-indigo-600" />
                                                            Online (Meet / Zoom)
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="price">{a.price}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    a.status === 'confirmed' || a.status === 'completed'
                                                        ? 'green'
                                                        : 'orange'
                                                }`}
                                            >
                                                <span
                                                    className={
                                                        a.status === 'confirmed' || a.status === 'completed'
                                                            ? 'live-dot'
                                                            : ''
                                                    }
                                                />
                                                {a.status === 'confirmed'
                                                    ? 'Onaylandı'
                                                    : a.status === 'completed'
                                                    ? 'Tamamlandı'
                                                    : 'Yeni talep'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {a.phone && a.phone !== 'Belirtilmedi' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs text-emerald-600 hover:bg-emerald-50 px-2"
                                                        onClick={() => {
                                                            const clean = a.phone.replace(/\D/g, '');
                                                            window.open(`https://wa.me/90${clean.startsWith('0') ? clean.slice(1) : clean}`, '_blank');
                                                        }}
                                                        title="WhatsApp ile yaz"
                                                    >
                                                        <MessageCircle size={13} className="mr-1" />
                                                        WhatsApp
                                                    </Button>
                                                )}
                                                <Button
                                                    variant={a.status === 'confirmed' ? 'secondary' : 'outline'}
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    disabled={a.status === 'confirmed' || actionLoadingId === a.id}
                                                    onClick={() => handleConfirm(a)}
                                                >
                                                    <Check size={12} className="mr-1" />
                                                    {a.status === 'confirmed' ? 'Onaylandı' : 'Onayla'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty">
                        <div className="product-icon mx-auto mb-4">
                            <CalendarDays size={24} />
                        </div>
                        <h2>Bu görünümde randevu bulunmuyor</h2>
                        <p>Diğer randevularınızı Tümü sekmesinde görebilirsiniz.</p>
                    </div>
                )}
            </section>

            {/* Product / Service Editor Modal */}
            {isAddModalOpen && (
                <ProductEditorModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    defaultType="coaching_call"
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        showToast('Yeni seans hizmeti başarıyla oluşturuldu! 🚀', 'success');
                        fetchAppointments();
                    }}
                />
            )}
        </>
    );
}
