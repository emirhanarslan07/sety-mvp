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
            setCustomers([]);
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
                    const name = c.name || c.email?.split('@')[0] || 'Customer';
                    const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0].toUpperCase())
                        .join('') || 'C';

                    const ordersList = c.orders || [];
                    const totalSpent = ordersList.reduce(
                        (sum: number, o: any) => sum + (Number(o.amount) || 0),
                        0
                    );
                    const lastOrderDate = ordersList.length > 0
                        ? new Date(ordersList[ordersList.length - 1].created_at).toLocaleDateString('en-US', {
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
                setCustomers([]);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        const rows = [
            ['Customer Name', 'Email', 'Order Count', 'Total Spent', 'Last Purchase'],
            ...visibleCustomers.map(c => [
                c.name,
                c.email,
                c.orderCount,
                `$${c.totalSpent}`,
                c.lastOrder
            ])
        ];
        const csvContent =
            '\uFEFF' + rows.map(r => r.map(col => `"${col}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sety-customers-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Customer list exported as CSV 📊', 'success');
    };

    const visibleCustomers = customers.filter(c =>
        `${c.name} ${c.email}`.toLowerCase().includes(query.toLowerCase())
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
                    <h1>Customers</h1>
                    <p className="subtitle">Connect with the people who love what you create.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        className="text-xs h-9 gap-1.5"
                        onClick={downloadCSV}
                    >
                        <ArrowDownToLine size={14} />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Total Customers"
                    value={totalCount.toString()}
                    change={totalCount > 0 ? "+14.3%" : "0%"}
                    icon={Users}
                />
                <Stat
                    label="New Customers"
                    value={totalCount > 0 ? Math.max(1, Math.round(totalCount * 0.3)).toString() : '0'}
                    change={totalCount > 0 ? "This month" : "0%"}
                    icon={Users}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Repeat Buyers"
                    value={repeatCount.toString()}
                    change={totalCount > 0 ? "+8.2%" : "0%"}
                    icon={ShoppingBag}
                    color="orange"
                />
                <Stat
                    label="Revenue per Customer"
                    value={`$${Number(avgPerCustomer).toLocaleString('en-US')}`}
                    change={totalCount > 0 ? "+6.4%" : "0%"}
                    icon={Wallet}
                    index={1}
                />
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <h2 className="flex items-center">
                    Customer List
                    <span className="badge purple ml-2">{visibleCustomers.length}</span>
                </h2>

                <label className="search">
                    <Search size={14} />
                    <input
                        placeholder="Search customer or email..."
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
                        <span className="text-xs font-semibold">Loading customers...</span>
                    </div>
                ) : visibleCustomers.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Last Purchase</th>
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
                                            ${Number(c.totalSpent).toLocaleString('en-US')}
                                        </td>
                                        <td className="text-muted-foreground">{c.lastOrder}</td>
                                        <td className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground"
                                                title="Customer details"
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
                        <h2>No customers yet</h2>
                        <p>When people purchase your products or book sessions, they will appear here.</p>
                    </div>
                )}
            </section>
        </>
    );
}
