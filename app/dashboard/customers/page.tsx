'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    Wallet,
    TrendingUp,
    Search,
    ArrowDownToLine,
    MoreHorizontal,
    Loader2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';

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

// ─── Sample Customers (Showcase fallback) ───
const SAMPLE_CUSTOMERS = [
    {
        id: 'cust-1',
        name: 'Zeynep Kaya',
        initials: 'ZK',
        email: 'zeynep.kaya@example.com',
        orderCount: 3,
        totalSpent: 897,
        lastOrder: '9 Eki'
    },
    {
        id: 'cust-2',
        name: 'Mert Demir',
        initials: 'MD',
        email: 'mert.demir@example.com',
        orderCount: 1,
        totalSpent: 1490,
        lastOrder: '9 Eki'
    },
    {
        id: 'cust-3',
        name: 'Elif Yıldız',
        initials: 'EY',
        email: 'elif.yildiz@example.com',
        orderCount: 2,
        totalSpent: 648,
        lastOrder: '8 Eki'
    },
    {
        id: 'cust-4',
        name: 'Can Aydın',
        initials: 'CA',
        email: 'can.aydin@example.com',
        orderCount: 1,
        totalSpent: 249,
        lastOrder: '8 Eki'
    },
    {
        id: 'cust-5',
        name: 'Deniz Aksoy',
        initials: 'DA',
        email: 'deniz.aksoy@example.com',
        orderCount: 2,
        totalSpent: 1739,
        lastOrder: '8 Eki'
    }
];

export default function CustomersPage() {
    const { store } = useDashboard();
    const { showToast } = useToast();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (store?.id) {
            fetchCustomers();
        } else {
            setCustomers(SAMPLE_CUSTOMERS);
            setLoading(false);
        }
    }, [store?.id]);

    const fetchCustomers = async () => {
        if (!store?.id) return;
        setLoading(true);
        try {
            // Fetch customers with their orders
            const { data, error } = await supabase
                .from('customers')
                .select(`
                    *,
                    orders(amount, created_at)
                `)
                .eq('store_id', store.id);

            if (error) throw error;

            if (data && data.length > 0) {
                const processed = data.map((c: any) => {
                    const name = c.name || c.email?.split('@')[0] || 'Müşteri';
                    const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0].toUpperCase())
                        .join('') || 'M';

                    const ordersList = c.orders || [];
                    const totalSpent = ordersList.reduce(
                        (sum: number, o: any) => sum + (Number(o.amount) || 0),
                        0
                    );
                    const lastOrderDate = ordersList.length > 0
                        ? new Date(ordersList[ordersList.length - 1].created_at).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short'
                          })
                        : '—';

                    return {
                        id: c.id,
                        name,
                        initials,
                        email: c.email || '—',
                        orderCount: ordersList.length,
                        totalSpent,
                        lastOrder: lastOrderDate
                    };
                });
                setCustomers(processed);
            } else {
                setCustomers(SAMPLE_CUSTOMERS);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers(SAMPLE_CUSTOMERS);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        const rows = [
            ['Müşteri Adı', 'E-posta', 'Sipariş Sayısı', 'Toplam Harcama', 'Son Alışveriş'],
            ...visibleCustomers.map(c => [
                c.name,
                c.email,
                c.orderCount,
                `₺${c.totalSpent}`,
                c.lastOrder
            ])
        ];
        const csvContent =
            '\uFEFF' + rows.map(r => r.map(col => `"${col}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sety-musteriler-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Müşteri listesi dışa aktarıldı 📊', 'success');
    };

    const visibleCustomers = customers.filter(c =>
        `${c.name} ${c.email}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))
    );

    // Dynamic stats
    const totalCount = customers.length;
    const repeatCount = customers.filter(c => c.orderCount > 1).length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const avgPerCustomer = totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : '0';

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Müşteriler</h1>
                    <p className="subtitle">Ürettiklerini seven insanlarla tanış.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        className="text-xs h-9 gap-1.5"
                        onClick={downloadCSV}
                    >
                        <ArrowDownToLine size={14} />
                        Dışa Aktar
                    </Button>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Toplam Müşteri"
                    value={totalCount.toString()}
                    change="+14,3%"
                    icon={Users}
                />
                <Stat
                    label="Yeni Müşteriler"
                    value={Math.max(1, Math.round(totalCount * 0.3)).toString()}
                    change="Bu ay"
                    icon={Users}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Tekrar Alışveriş"
                    value={repeatCount.toString()}
                    change="+8,2%"
                    icon={ShoppingBag}
                    color="orange"
                />
                <Stat
                    label="Müşteri Başına Gelir"
                    value={`₺${Number(avgPerCustomer).toLocaleString('tr-TR')}`}
                    change="+6,4%"
                    icon={Wallet}
                    index={1}
                />
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <h2 className="flex items-center">
                    Müşteri Listesi
                    <span className="badge purple ml-2">{visibleCustomers.length}</span>
                </h2>

                <label className="search">
                    <Search size={14} />
                    <input
                        placeholder="Müşteri veya e-posta ara..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* ═══ CUSTOMERS TABLE PANEL ═══ */}
            <section className="panel">
                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                        <span className="text-xs font-semibold">Müşteriler yükleniyor...</span>
                    </div>
                ) : visibleCustomers.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Müşteri</th>
                                    <th>E-posta</th>
                                    <th>Sipariş</th>
                                    <th>Toplam Harcama</th>
                                    <th>Son Alışveriş</th>
                                    <th className="text-right" />
                                </tr>
                            </thead>
                            <tbody>
                                {visibleCustomers.map(c => (
                                    <tr key={c.id}>
                                        <td>
                                            <div className="product">
                                                <div className="avatar">{c.initials}</div>
                                                <strong>{c.name}</strong>
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground">{c.email}</td>
                                        <td className="font-semibold">{c.orderCount}</td>
                                        <td className="price">
                                            ₺{Number(c.totalSpent).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="text-muted-foreground">{c.lastOrder}</td>
                                        <td className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground"
                                                title="Müşteri bilgileri"
                                                onClick={() =>
                                                    showToast(`${c.name} · ${c.email}`, 'info')
                                                }
                                            >
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty">
                        <div className="product-icon mx-auto mb-4">
                            <Users size={24} />
                        </div>
                        <h2>Müşteri bulunamadı</h2>
                        <p>Arama kriterinizle eşleşen müşteri kaydı bulunamadı.</p>
                    </div>
                )}
            </section>
        </>
    );
}
