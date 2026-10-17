'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Check,
    CreditCard,
    CircleDollarSign,
    Download,
    TrendingUp,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    ExternalLink
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useDashboard } from '@/context/DashboardContext';
import { ConfirmModal } from './ConfirmModal';

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

export default function OrdersPage() {
    const { showToast } = useToast();
    const { store } = useDashboard();
    const [tab, setTab] = useState<'All' | 'Pending Approval' | 'Completed'>('All');
    const [query, setQuery] = useState('');
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [store?.id]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders?status=all');
            const data = await res.json();
            if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
                // Map API orders to table format
                const mapped = data.orders.map((o: any) => {
                    const name = o.customer_name || 'Customer';
                    const initials = name
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((p: string) => p[0].toUpperCase())
                        .join('') || 'C';
                    
                    const isPending = o.status === 'pending' || o.status === 'awaiting_payment';
                    const isCompleted = o.status === 'completed' || o.status === 'paid';

                    return {
                        id: o.order_number ? `#${o.order_number}` : `#SY-${o.id.slice(0, 6)}`,
                        rawId: o.id,
                        name,
                        initials,
                        email: o.customer_email || '—',
                        product: o.product?.title || o.notes || 'Digital Product',
                        price: `$${Number(o.amount || 0).toLocaleString('en-US')}`,
                        priceRaw: Number(o.amount || 0),
                        status: isPending ? 'Pending' : isCompleted ? 'Paid' : o.status,
                        date: new Date(o.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        rawOrder: o
                    };
                });
                setOrders(mapped);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error(err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (orderId: string) => {
        setProcessingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            showToast('Order confirmed and delivered successfully! ✨', 'success');
            setIsModalOpen(false);
            setOrders(prev =>
                prev.map(o => (o.rawId === orderId ? { ...o, status: 'Paid' } : o))
            );
        } catch (err: any) {
            showToast(err.message || 'Failed to confirm order', 'error');
        } finally {
            setProcessingId(null);
            setSelectedOrder(null);
        }
    };

    const handleReject = async (orderId: string) => {
        if (!confirm('Are you sure you want to decline this order?')) return;
        setProcessingId(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}/reject`, { method: 'POST' });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            showToast('Order declined', 'success');
            setOrders(prev => prev.filter(o => o.rawId !== orderId));
        } catch (err: any) {
            showToast(err.message || 'Failed to decline order', 'error');
        } finally {
            setProcessingId(null);
        }
    };

    // Filtered orders
    const visibleOrders = orders.filter(o => {
        const matchesTab =
            tab === 'All' ||
            (tab === 'Pending Approval' ? o.status === 'Pending' : o.status === 'Paid');
        const matchesQuery =
            `${o.name} ${o.id} ${o.product} ${o.email}`
                .toLowerCase()
                .includes(query.toLowerCase());
        return matchesTab && matchesQuery;
    });

    // CSV Download
    const downloadCSV = () => {
        const rows = [
            ['Order ID', 'Customer', 'Email', 'Product', 'Amount', 'Status', 'Date'],
            ...visibleOrders.map(o => [
                o.id,
                o.name,
                o.email,
                o.product,
                o.price,
                o.status,
                o.date
            ])
        ];
        const csvContent =
            '\uFEFF' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sety-orders-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Orders list exported as CSV 📊', 'success');
    };

    // Calculate dynamic stats
    const totalCount = orders.length;
    const completedCount = orders.filter(o => o.status === 'Paid').length;
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.priceRaw || 0), 0);
    const avgOrder = totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : '0';

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Orders</h1>
                    <p className="subtitle">Every order is a new milestone in your creator journey.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        className="text-xs h-9 gap-1.5"
                        onClick={downloadCSV}
                    >
                        <Download size={14} />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Total Orders"
                    value={totalCount.toString()}
                    change={totalCount > 0 ? "+12.1%" : "0%"}
                    icon={ShoppingBag}
                />
                <Stat
                    label="Completed"
                    value={completedCount.toString()}
                    change={totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%'}
                    icon={Check}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Pending Approval"
                    value={pendingCount.toString()}
                    change={pendingCount > 0 ? `${pendingCount} new` : 'None pending'}
                    icon={CreditCard}
                    color="orange"
                />
                <Stat
                    label="Average Order"
                    value={`$${Number(avgOrder).toLocaleString('en-US')}`}
                    change={totalCount > 0 ? "+5.2%" : "0%"}
                    icon={CircleDollarSign}
                    index={1}
                />
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['All', 'Pending Approval', 'Completed'] as const).map(item => (
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
                        placeholder="Search customer or order..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </label>
            </div>

            {/* ═══ ORDERS TABLE PANEL ═══ */}
            <section className="panel">
                <div className="panel-header">
                    <h2>Orders List</h2>
                    <span className="badge">
                        {visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'} listed
                    </span>
                </div>

                {isLoading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                        <span className="text-xs font-semibold">Loading orders...</span>
                    </div>
                ) : visibleOrders.length > 0 ? (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map(o => (
                                    <tr key={o.id}>
                                        <td className="font-semibold text-muted-foreground">
                                            {o.id}
                                        </td>
                                        <td>
                                            <div className="product">
                                                <div className="avatar h-7 w-7 text-[10px]">
                                                    {o.initials}
                                                </div>
                                                <div>
                                                    <strong>{o.name}</strong>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {o.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground max-w-[200px] truncate">
                                            {o.product}
                                        </td>
                                        <td className="price">{o.price}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    o.status === 'Paid' ? 'green' : 'orange'
                                                }`}
                                            >
                                                {o.status === 'Paid' && <span className="live-dot" />}
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="text-muted-foreground text-xs">{o.date}</td>
                                        <td className="text-right">
                                            {o.status === 'Pending' && o.rawId ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                                        disabled={processingId === o.rawId}
                                                        onClick={() => {
                                                            setSelectedOrder(o.rawOrder);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <Check size={12} className="mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 text-xs text-rose-600 hover:bg-rose-50"
                                                        disabled={processingId === o.rawId}
                                                        onClick={() => handleReject(o.rawId)}
                                                    >
                                                        <X size={12} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    Completed
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty">
                        <div className="product-icon mx-auto mb-4">
                            <ShoppingBag size={24} />
                        </div>
                        <h2>No orders found</h2>
                        <p>No orders received yet or none match your search criteria.</p>
                    </div>
                )}

                {/* Footer Pagination */}
                <div className="panel-header border-t border-border">
                    <span className="text-[10px] text-muted-foreground">
                        Showing {visibleOrders.length} {visibleOrders.length === 1 ? 'order' : 'orders'}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={13} />
                        </Button>
                        <Button size="sm" className="h-7 text-xs px-2.5">
                            1
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled
                            aria-label="Next page"
                        >
                            <ChevronRight size={13} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onConfirm={handleConfirm}
                isConfirming={processingId === selectedOrder?.id}
            />
        </>
    );
}
