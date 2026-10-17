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
                <span>vs last month</span>
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

export default function AppointmentsPage() {
    const { store } = useDashboard();
    const { showToast } = useToast();

    const [tab, setTab] = useState<'New Requests' | 'Confirmed' | 'Completed' | 'All'>('New Requests');
    const [query, setQuery] = useState('');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (store?.id) {
            fetchAppointments();
        } else {
            setAppointments([]);
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
                    const name = row.customer_name || 'Client';
                    const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0].toUpperCase())
                        .join('') || 'C';

                    parsed.push({
                        id: row.id,
                        rawId: row.id,
                        name,
                        initials,
                        email: row.customer_email || '—',
                        phone: meta?.phone || 'Not provided',
                        service: row.product?.title || 'Coaching Session',
                        date: meta?.preferred_date || new Date(row.created_at).toLocaleDateString('en-US'),
                        time: meta?.time_slot || 'Daytime',
                        type: meta?.session_type || 'online',
                        location: meta?.location,
                        price: `$${Number(row.amount || 0).toLocaleString('en-US')}`,
                        priceRaw: Number(row.amount || 0),
                        status: statusVal
                    });
                }
            });

            setAppointments(parsed);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (apt: any) => {
        if (!apt.rawId) return;

        setActionLoadingId(apt.id);
        try {
            const res = await updateAppointmentStatusAction(apt.rawId, 'confirmed');
            if (!res.success) throw new Error(res.error);
            showToast('Appointment confirmed! 🚀', 'success');
            setAppointments(prev =>
                prev.map(a => (a.id === apt.id ? { ...a, status: 'confirmed' } : a))
            );
        } catch (err: any) {
            showToast(err.message || 'Failed to confirm', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter appointments
    const visible = appointments.filter(a => {
        const matchesQuery =
            `${a.name} ${a.service} ${a.email} ${a.phone}`
                .toLowerCase()
                .includes(query.toLowerCase());

        const matchesTab =
            tab === 'All' ||
            (tab === 'New Requests' && a.status === 'new') ||
            (tab === 'Confirmed' && a.status === 'confirmed') ||
            (tab === 'Completed' && a.status === 'completed');

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
                    <h1>Appointments & Coaching</h1>
                    <p className="subtitle">Share your expertise and build 1:1 client relationships.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Plus size={14} />
                        New Coaching Service
                    </Button>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Total Requests"
                    value={totalCount.toString()}
                    change={totalCount > 0 ? "+8 requests" : "0%"}
                    icon={CalendarDays}
                />
                <Stat
                    label="Pending / New"
                    value={newCount.toString()}
                    change={newCount > 0 ? `${newCount} new` : 'None pending'}
                    icon={Users}
                    color="orange"
                    index={1}
                />
                <Stat
                    label="Confirmed"
                    value={confirmedCount.toString()}
                    change={confirmedCount > 0 ? "This week" : "0%"}
                    icon={Check}
                />
                <Stat
                    label="Completed"
                    value={completedCount.toString()}
                    change={completedCount > 0 ? `${completedCount} sessions` : "0%"}
                    icon={Video}
                    color="green"
                    index={1}
                />
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['New Requests', 'Confirmed', 'Completed', 'All'] as const).map(item => (
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
                        placeholder="Search client..."
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
                        {visible.length} {visible.length === 1 ? 'session' : 'sessions'}
                    </span>
                </div>

                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                        <span className="text-xs font-semibold">Loading appointments...</span>
                    </div>
                ) : visible.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Date</th>
                                    <th>Time & Mode</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
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
                                                            {a.location || 'In-person'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe size={10} className="text-indigo-600" />
                                                            Online (Google Meet / Zoom)
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
                                                    ? 'Confirmed'
                                                    : a.status === 'completed'
                                                    ? 'Completed'
                                                    : 'New Request'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {a.phone && a.phone !== 'Not provided' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs text-emerald-600 hover:bg-emerald-50 px-2"
                                                        onClick={() => {
                                                            const clean = a.phone.replace(/\D/g, '');
                                                            window.open(`https://wa.me/${clean}`, '_blank');
                                                        }}
                                                        title="Message on WhatsApp"
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
                                                    {a.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
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
                        <h2>No appointments found</h2>
                        <p>When clients book coaching sessions with you, they will appear here.</p>
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
                        showToast('New coaching session created successfully! 🚀', 'success');
                        fetchAppointments();
                    }}
                />
            )}
        </>
    );
}
