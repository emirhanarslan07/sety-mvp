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
    Package,
    Loader2
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

// ─── Traffic Chart Component ───
function TrafficChart({ period }: { period: string }) {
    const shift = period === '7 Gün' ? 12 : period === '30 Gün' ? -10 : 0;
    const points = [78, 68, 83, 58, 70, 49, 60, 38, 54, 32, 43, 20, 33, 13]
        .map((y, i) => `${58 + i * 65},${y * 2 + shift + 10}`)
        .join(' ');

    return (
        <div className="chart">
            <svg
                viewBox="0 0 950 245"
                role="img"
                aria-label={`${period} mağaza ziyaretçi ve tıklama grafiği`}
            >
                {[30, 80, 130, 180].map((y, i) => (
                    <g key={y}>
                        <line x1="45" x2="925" y1={y} y2={y} className="chart-grid" />
                        <text x="8" y={y + 4} className="chart-label">
                            {600 - i * 200}
                        </text>
                    </g>
                ))}
                <polygon
                    points={`58,200 ${points} 903,200`}
                    className="chart-fill"
                />
                <polyline points={points} className="chart-line" />
                <polyline
                    points="58,189 123,178 188,184 253,163 318,176 383,159 448,170 513,145 578,157 643,131 708,148 773,119 838,136 903,110"
                    className="chart-secondary"
                />
                {['26 Eyl', '28 Eyl', '30 Eyl', '2 Eki', '4 Eki', '6 Eki', '8 Eki'].map(
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
    const [period, setPeriod] = useState<'7 Gün' | '14 Gün' | '30 Gün' | 'Tümü'>('14 Gün');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalViews: 12847,
        monthlyViews: 3246,
        todayViews: 184,
        totalClicks: 2418
    });
    const [topProducts, setTopProducts] = useState<any[]>([
        {
            title: 'Instagram Büyüme Rehberi',
            icon: BookOpen,
            color: '',
            views: 1248,
            conversion: '%6,9'
        },
        {
            title: '1:1 Strateji Görüşmesi',
            icon: Target,
            color: 'green',
            views: 786,
            conversion: '%3,1'
        },
        {
            title: 'Reels Şablon Paketi',
            icon: Film,
            color: 'orange',
            views: 642,
            conversion: '%16,2'
        }
    ]);

    const loadAnalytics = useCallback(async () => {
        if (!store?.id) return;
        try {
            const daysParam =
                period === '7 Gün' ? 7 : period === '30 Gün' ? 30 : period === 'Tümü' ? 365 : 14;
            const [statsRes, productsRes] = await Promise.all([
                fetch('/api/dashboard/stats'),
                fetch('/api/analytics/products')
            ]);

            const statsData = await statsRes.json();
            const productsData = await productsRes.json();

            if (statsData?.total?.views !== undefined && statsData.total.views > 0) {
                setStats({
                    totalViews: statsData.total.views,
                    monthlyViews: statsData.this_month?.views || Math.round(statsData.total.views * 0.4),
                    todayViews: statsData.today?.views || Math.round(statsData.total.views * 0.05),
                    totalClicks: statsData.total?.clicks || Math.round(statsData.total.views * 0.2)
                });
            }

            if (productsData?.data && Array.isArray(productsData.data) && productsData.data.length > 0) {
                const mapped = productsData.data.slice(0, 3).map((p: any, i: number) => ({
                    title: p.title || `Ürün ${i + 1}`,
                    icon: i === 0 ? BookOpen : i === 1 ? Target : Film,
                    color: i === 1 ? 'green' : i === 2 ? 'orange' : '',
                    views: p.views || (1200 - i * 300),
                    conversion: p.views > 0 ? `%${((p.sales || 1) / p.views * 100).toFixed(1)}` : '%5,0'
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

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>Trafik & Analitik</h1>
                    <p className="subtitle">Sayıların ardındaki hikayeyi keşfet.</p>
                </div>
                <div className="heading-actions">
                    <div className="segments">
                        {(['7 Gün', '14 Gün', '30 Gün', 'Tümü'] as const).map(item => (
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
                    label="Toplam Ziyaretçi"
                    value={stats.totalViews.toLocaleString('tr-TR')}
                    change="+9,4%"
                    icon={Eye}
                />
                <Stat
                    label="Bu Ayki Ziyaretler"
                    value={stats.monthlyViews.toLocaleString('tr-TR')}
                    change="+16,8%"
                    icon={TrendingUp}
                    color="green"
                    index={1}
                />
                <Stat
                    label="Bugünkü Trafik"
                    value={stats.todayViews.toLocaleString('tr-TR')}
                    change="+12,2%"
                    icon={Users}
                    color="orange"
                />
                <Stat
                    label="Ürün Tıklanmaları"
                    value={stats.totalClicks.toLocaleString('tr-TR')}
                    change="+21,3%"
                    icon={MousePointerClick}
                    index={1}
                />
            </div>

            {/* ═══ TRAFFIC CHART PANEL ═══ */}
            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h2>Ziyaretçi & Tıklanma Grafiği</h2>
                        <p className="panel-description">
                            Mağazanı keşfedenler ve ürünlerinle etkileşime geçenler.
                        </p>
                    </div>
                    <div className="legend">
                        <span>
                            <i />
                            Ziyaretçi
                        </span>
                        <span>
                            <i />
                            Tıklanma
                        </span>
                    </div>
                </div>
                <TrafficChart period={period} />
            </section>

            {/* ═══ BOTTOM TWO-COLUMN GRID ═══ */}
            <div className="overview-bottom">
                {/* Top Products Panel */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>En Çok İlgi Gören Ürünler</h2>
                        <span className="badge">{period}</span>
                    </div>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Ürün</th>
                                    <th>Görüntülenme</th>
                                    <th>Dönüşüm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, i) => (
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
                                            {p.views.toLocaleString('tr-TR')}
                                        </td>
                                        <td>
                                            <span className="badge green">{p.conversion}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Traffic Sources Panel */}
                <section className="panel">
                    <div className="panel-header">
                        <h2>Trafik Kaynakları</h2>
                        <Globe size={16} className="text-muted-foreground" />
                    </div>
                    <div className="form-body">
                        {[
                            ['Instagram', '%62'],
                            ['Doğrudan (Link in bio)', '%24'],
                            ['YouTube', '%14']
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
