'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import {
  Plus,
  ExternalLink,
  Sparkles,
  Package,
  TrendingUp,
  ShoppingBag,
  ChevronRight,
  Pencil,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

// ─── Sparkline Component ───────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 84, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="shrink-0">
      <polyline points={pts} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ModernDashboardPage() {
  const router = useRouter();
  const { profile, store, user, loading: contextLoading } = useDashboard();
  const { showToast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const username = store?.username || user?.user_metadata?.username || 'emirhan';
  const storeUrl = `sety.store/${username}`;

  useEffect(() => {
    if (!store?.id) {
      if (!contextLoading) setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/dashboard/stats').then(r => r.json()).catch(() => null),
          supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*').eq('store_id', store.id).order('created_at', { ascending: false }).limit(6)
        ]);

        if (statsRes) setStats(statsRes);
        if (productsRes?.data) setProducts(productsRes.data);
        if (ordersRes?.data) setOrders(ordersRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [store?.id, contextLoading]);

  const copyStoreLink = () => {
    navigator.clipboard.writeText(`https://${storeUrl}`);
    setCopied(true);
    showToast('Mağaza linki kopyalandı! 🚀', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleProductVisibility = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;
      showToast(newStatus === 'active' ? 'Ürün vitrinde görünür yapıldı.' : 'Ürün gizlendi.', 'success');
    } catch (err: any) {
      showToast('Durum güncellenirken hata oluştu.', 'error');
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: currentStatus } : p));
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Ürün başarıyla silindi.', 'success');
    } catch (err) {
      showToast('Ürün silinirken bir hata oluştu.', 'error');
    } finally {
      setActiveMenuId(null);
    }
  };

  const totalViews = stats?.total?.views || stats?.views || 0;
  const todayViews = stats?.today?.views || 0;
  const totalSales = orders.length || stats?.total_sales || 0;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0) || stats?.total_revenue || 0;
  const conversionRate = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) + '%' : '0.0%';

  const kpis = [
    {
      label: 'Toplam Gelir',
      value: `₺${Number(totalRevenue).toLocaleString('tr-TR')}`,
      change: '+18,2%',
      color: '#5500FF',
      spark: [10, 14, 18, 22, 28, 32, 40]
    },
    {
      label: 'Mağaza Ziyaretleri',
      value: Number(totalViews).toLocaleString('tr-TR'),
      change: todayViews > 0 ? `+${todayViews} bugün` : '+9,4%',
      color: '#10B981',
      spark: [20, 25, 22, 35, 30, 42, 48]
    },
    {
      label: 'Toplam Sipariş',
      value: totalSales.toString(),
      change: totalSales > 0 ? `+12,1%` : 'İlk satışı yap',
      color: '#F59E0B',
      spark: [2, 4, 3, 6, 5, 8, 10]
    },
    {
      label: 'Dönüşüm Oranı',
      value: conversionRate,
      change: '+0,6%',
      color: '#64748B',
      spark: [15, 18, 16, 20, 19, 22, 21]
    }
  ];

  const formatType = (type: string) => {
    switch (type) {
      case 'digital_product': return 'Dijital İndirme';
      case 'coaching_call': return 'Koçluk';
      case 'video_response': return 'Video Yanıt';
      case 'lead_magnet': return 'Ücretsiz';
      default: return 'Ürün';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* ═══ TOP BREADCRUMB & HEADER ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-semibold">
            <span>Panel</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600">Genel Bakış</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Tekrar hoş geldin, {profile?.full_name?.split(' ')[0] || username}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={`https://${storeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8ECF4] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            <span>Mağazayı Gör</span>
          </a>
          <button
            onClick={() => router.push('/dashboard/store?action=add')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5500FF] hover:bg-[#4400CC] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-[#5500FF]/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Ürün Ekle</span>
          </button>
        </div>
      </div>

      {/* ═══ 4 KPI CARDS ROW ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="text-xs font-semibold text-slate-400 mb-1">{k.label}</div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{k.value}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{k.change}</span>
                </div>
              </div>
              <Sparkline data={k.spark} color={k.color} />
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN GRID: LEFT (PRODUCTS + ORDERS) & RIGHT (LIVE IPHONE PREVIEW) ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
        {/* Left Column: Products + Recent Orders */}
        <div className="space-y-6 min-w-0">
          {/* Products Section */}
          <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">Ürünlerim</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{products.length} ürün listeleniyor</p>
              </div>
              <button
                onClick={() => router.push('/dashboard/store?action=add')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5500FF] bg-[#5500FF]/10 px-3 py-1.5 rounded-xl hover:bg-[#5500FF]/15 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Ürün</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm">Henüz ürün eklenmemiş</p>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    İlk dijital ürününü veya koçluk paketini ekleyerek hemen satışa başla.
                  </p>
                </div>
              ) : (
                products.map((p) => {
                  const isVisible = p.status === 'active';
                  return (
                    <div
                      key={p.id}
                      className="p-4 md:px-5 flex items-center gap-3.5 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative">
                        {p.image_url ? (
                          <Image src={p.image_url} alt="" fill className="object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-900 truncate">{p.title}</p>
                          <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                            {formatType(p.type)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {p.subtitle || p.description || 'Açıklama eklenmedi'}
                        </p>
                      </div>

                      {/* Price Pill */}
                      <span className="text-xs sm:text-sm font-extrabold text-[#5500FF] bg-[#5500FF]/10 px-3 py-1 rounded-full shrink-0 font-mono">
                        {p.price === 0 || !p.price ? 'Ücretsiz' : `₺${Number(p.price).toLocaleString('tr-TR')}`}
                      </span>

                      {/* Switch */}
                      <div className="shrink-0">
                        <Switch
                          checked={isVisible}
                          onCheckedChange={() => toggleProductVisibility(p.id, p.status)}
                          title={isVisible ? 'Vitrinde aktif' : 'Gizli'}
                        />
                      </div>

                      {/* 3-dots Dropdown */}
                      <div className="relative shrink-0">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-0 top-8 z-30 w-36 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95">
                            <button
                              onClick={() => {
                                router.push(`/dashboard/store?edit=${p.id}`);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-400" />
                              <span>Düzenle</span>
                            </button>
                            <a
                              href={`https://${storeUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setActiveMenuId(null)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>Önizle</span>
                            </a>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              <span>Sil</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">Son Siparişler</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">En son gerçekleşen satışlar</p>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-xs font-bold text-[#5500FF] hover:text-[#4400CC] transition-colors"
              >
                Tümünü Gör →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-800 font-bold text-sm">Henüz bir sipariş yok</p>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Mağaza linkini sosyal medya biyografine ekleyerek ilk satışını hemen yakala!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-5">Müşteri</th>
                      <th className="py-3 px-5">Ürün</th>
                      <th className="py-3 px-5">Tutar</th>
                      <th className="py-3 px-5 text-right">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-slate-900">
                          {o.customer_name || o.customer_email || 'Misafir Müşteri'}
                        </td>
                        <td className="py-3.5 px-5 text-slate-600">
                          {o.product_title || 'Dijital Ürün'}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900 font-mono">
                          ₺{Number(o.amount || 0).toLocaleString('tr-TR')}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                            {o.status === 'paid' ? 'Ödendi' : o.status || 'Tamamlandı'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live iPhone Store Preview (Sticky) */}
        <div className="hidden xl:block">
          <div className="sticky top-20">
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="tracking-wider uppercase">Canlı Önizleme</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Canlı
              </span>
            </div>

            {/* iPhone Mockup Frame */}
            <div className="rounded-[3rem] bg-[#0F172A] p-3 shadow-2xl border border-slate-800">
              <div className="relative h-[620px] overflow-y-auto overflow-x-hidden rounded-[2.4rem] bg-white text-slate-900 scrollbar-none">
                {/* Dynamic Island */}
                <div className="sticky top-0 z-20 mx-auto h-6 w-28 rounded-b-2xl bg-[#0F172A]" />

                {/* Storefront inside iPhone mockup */}
                <div className="-mt-3 p-4 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative h-16 w-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-100 mb-2 mt-2">
                    {profile?.profile_image_url ? (
                      <Image src={profile.profile_image_url} alt="" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif-display text-2xl tracking-tight text-slate-900 leading-tight">
                    {profile?.full_name || store?.display_name || username}
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-[200px] line-clamp-2 mt-1">
                    {store?.bio || 'Dijital içerik üreticisi & mağaza'}
                  </p>

                  {/* Products inside phone */}
                  <div className="w-full space-y-2 mt-5 text-left">
                    {products.filter(p => p.status === 'active').length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Aktif ürün bulunmuyor
                      </div>
                    ) : (
                      products.filter(p => p.status === 'active').map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-2.5"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 relative overflow-hidden">
                            {p.image_url ? (
                              <Image src={p.image_url} alt="" fill className="object-cover" />
                            ) : (
                              <Package className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.subtitle || formatType(p.type)}</p>
                          </div>
                          <span className="text-[11px] font-black text-[#5500FF] shrink-0 font-mono">
                            {p.price === 0 ? 'Free' : `₺${p.price}`}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-8 text-[10px] font-semibold text-slate-400 pb-4">
                    Powered by <span className="text-[#5500FF] font-bold">SETY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
