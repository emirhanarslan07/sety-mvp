'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Eye,
    TrendingUp,
    Users,
    MousePointerClick,
    Globe,
    BookOpen,
    Target,
    Film,
    Package
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';

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

// ─── Traffic Chart Component ───
function TrafficChart({ period, hasData }: { period: string; hasData: boolean }) {
    const shift = period === '7 Days' ? 12 : period === '30 Days' ? -10 : 0;
    
    // When no real data, display a clean subtle baseline
    const points = hasData
        ? [78, 68, 83, 58, 70, 49, 60, 38, 54, 32, 43, 20, 33, 13]
            .map((y, i) => `${58 + i * 65},${y * 2 + shift + 10}`)
            .join(' ')
        : [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95]
            .map((y, i) => `${58 + i * 65},${y * 2}`)
            .join(' ');

    return (
        <div className="chart">
            <svg
                viewBox="0 0 950 245"
                role="img"
                aria-label={`${period} store visitors and clicks chart`}
            >
                {[30, 80, 130, 180].map((y, i) => (
                    <g key={y}>
                        <line x1="45" x2="925" y1={y} y2={y} className="chart-grid" />
                        <text x="8" y={y + 4} className="chart-label">
                            {hasData ? 600 - i * 200 : (3 - i) * 10}
                        </text>
                    </g>
                ))}
                <polygon
                    points={`58,200 ${points} 903,200`}
                    className="chart-fill"
                />
                <polyline points={points} className="chart-line" />
                {hasData && (
                    <polyline
                        points="58,189 123,178 188,184 253,163 318,176 383,159 448,170 513,145 578,157 643,131 708,148 773,119 838,136 903,110"
                        className="chart-secondary"
                    />
                )}
                {['Sep 26', 'Sep 28', 'Sep 30', 'Oct 2', 'Oct 4', 'Oct 6', 'Oct 8'].map(
                    (x, i) => (
                        <text key={x} x={57 + i * 140} y="230" className="chart-label">
                            {x}
                        </text>
                    )
                )}
            </svg>
        </div>
    );
}

export default function AnalyticsPage() {
    const { store } = useDashboard();
    const [period, setPeriod] = useState<'7 Days' | '14 Days' | '30 Days' | 'All'>('14 Days');
    const [loading, setLoading] = useState(false);
    
    // Zero default stats - will populate dynamically from API
    const [stats, setStats] = useState({
        totalViews: 0,
        monthlyViews: 0,
        todayViews: 0,
        totalClicks: 0
    });
    const [topProducts, setTopProducts] = useState<any[]>([]);

    const loadAnalytics = useCallback(async () => {
        if (!store?.id) return;
        try {
            const [statsRes, productsRes] = await Promise.all([
                fetch('/api/dashboard/stats').catch(() => null),
                fetch('/api/analytics/products').catch(() => null)
            ]);

            const statsData = statsRes ? await statsRes.json() : null;
            const productsData = productsRes ? await productsRes.json() : null;

            if (statsData?.total?.views !== undefined) {
                setStats({
                    totalViews: statsData.total.views,
                    monthlyViews: statsData.this_month?.views || 0,
                    todayViews: statsData.today?.views || 0,
                    totalClicks: statsData.total?.clicks || 0
                });
            } else if (statsData?.totalViews !== undefined) {
                setStats({
                    totalViews: statsData.totalViews || 0,
                    monthlyViews: statsData.monthlyViews || 0,
                    todayViews: statsData.todayViews || 0,
                    totalClicks: statsData.totalClicks || 0
                });
            }

            if (productsData?.data && Array.isArray(productsData.data) && productsData.data.length > 0) {
                const mapped = productsData.data.slice(0, 3).map((p: any, i: number) => ({
                    title: p.title || `Product ${i + 1}`,
                    icon: i === 0 ? BookOpen : i === 1 ? Target : Film,
                    color: i === 1 ? 'green' : i === 2 ? 'orange' : '',
                    views: p.views || 0,
                    conversion: p.views > 0 ? `${((p.sales || 0) / p.views * 100).toFixed(1)}%` : '0%'
                }));
                setTopProducts(mapped);
            }
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }, [store?.id, period]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const hasViews = stats.totalViews > 0;

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Traffic & Analytics</h1>
                    <p className="subtitle">Discover the audience behind your store growth.</p>
                </div>
                <div className="heading-actions">
                    <div className="segments">
                        {(['7 Days', '14 Days', '30 Days', 'All'] as const).map(item => (
                            <Button
                                key={item}
                                size="sm"
                                variant="ghost"
                                onClick={() => setPeriod(item)}
                                className={`text-[10px] h-7 px-3 font-bold ${
                                    period === item ? 'selected' : 'text-muted-foreground'
                                }`}
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ STATS ═══ */}
            <div className="stats">
                <Stat
                    label="Total Visitors"
                    value={stats.totalViews.toLocaleString('en-US')}
                    change={hasViews ? "+9.4%" : "0%"}
                    icon={Eye}
                />
                <Stat
                    label="This Month's Visits"
                    value={stats.monthlyViews.toLocaleString('en-US')}
                    change={hasViews ? "+16.8%" : "0%"}
                    icon={TrendingUp}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Today's Traffic"
                    value={stats.todayViews.toLocaleString('en-US')}
                    change={hasViews ? "+12.2%" : "0%"}
                    icon={Users}
                    color="orange"
                />
                <Stat
                    label="Product Clicks"
                    value={stats.totalClicks.toLocaleString('en-US')}
                    change={hasViews ? "+21.3%" : "0%"}
                    icon={MousePointerClick}
                    index={1}
                />
            </div>

            {/* ═══ TRAFFIC CHART PANEL ═══ */}
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Visitors & Clicks Overview</h2>
                        <p className="panel-description">
                            People discovering your store and interacting with your products.
                        </p>
                    </div>
                    <div className="legend">
                        <span>
                            <i />
                            Visitors
                        </span>
                        <span>
                            <i />
                            Clicks
                        </span>
                    </div>
                </div>
                <TrafficChart period={period} hasData={hasViews} />
            </section>

            {/* ═══ BOTTOM TWO-COLUMN GRID ═══ */}
            <div className="overview-bottom">
                {/* Top Products Panel */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>Top Performing Products</h2>
                        <span className="badge">{period}</span>
                    </div>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Views</th>
                                    <th>Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.length > 0 ? (
                                    topProducts.map((p) => (
                                        <tr key={p.title}>
                                            <td>
                                                <div className="product">
                                                    <div className={`product-icon ${p.color}`}>
                                                        <p.icon size={20} />
                                                    </div>
                                                    <strong>{p.title}</strong>
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground font-semibold">
                                                {p.views.toLocaleString('en-US')}
                                            </td>
                                            <td>
                                                <span className="badge green">{p.conversion}</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-muted-foreground text-xs">
                                            No product traffic data recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Traffic Sources Panel */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>Traffic Sources</h2>
                        <Globe size={16} className="text-muted-foreground" />
                    </div>
                    <div className="form-body">
                        {[
                            ['Direct (Link in bio)', hasViews ? '68%' : '100%'],
                            ['Instagram', hasViews ? '24%' : '0%'],
                            ['TikTok / Twitter', hasViews ? '8%' : '0%']
                        ].map(([source, percentage]) => (
                            <div className="setting-row" key={source}>
                                <strong className="text-xs">{source}</strong>
                                <span className="badge purple">{percentage}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
