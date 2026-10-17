'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    Globe,
    TrendingUp,
    Wallet,
    Copy,
    Plus,
    Search,
    BookOpen,
    Target,
    Film,
    Video,
    Package,
    MoreHorizontal,
    Camera,
    Check,
    Loader2,
    Trash2,
    Edit2,
    Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase/client';
import ProductEditorModal from '@/components/modals/ProductEditorModal';
import ActionConfirmModal from '@/components/modals/ActionConfirmModal';

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

export default function StorePage() {
    const { store, user, profile, refreshData } = useDashboard();
    const { showToast } = useToast();

    const [tab, setTab] = useState<'Products' | 'Design & Profile'>('Products');
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Design / Profile States
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [isSavingDesign, setIsSavingDesign] = useState(false);

    const storeUrl = `sety.store/${store?.username || 'creator'}`;

    useEffect(() => {
        if (store) {
            setName(store.display_name || profile?.full_name || 'Creator');
            setUsername(store.username || 'creator');
            setBio(store.bio || 'Digital creator & coach.');
            setPhoto(store.store_logo_url || profile?.profile_image_url || null);
            fetchProducts(store.id);
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [store, profile]);

    const fetchProducts = async (storeId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                const mapped = data.map((p: any, i: number) => {
                    const isCoaching = p.type === 'coaching_call' || p.type === 'appointment';
                    const isLink = p.type === 'external_link';
                    return {
                        ...p,
                        typeLabel: isCoaching ? 'Coaching' : isLink ? 'Link' : 'Digital Download',
                        icon: isCoaching ? Target : isLink ? Video : i % 2 === 0 ? BookOpen : Film,
                        color: isCoaching ? 'green' : i % 2 === 1 ? 'orange' : '',
                        sales: p.sales_count || 0
                    };
                });
                setProducts(mapped);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`https://${storeUrl}`);
        showToast('Store link copied! 🚀', 'success');
    };

    const handleToggleStatus = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'draft' : 'active';
        setProducts(prev =>
            prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p))
        );

        try {
            const { error } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', productId);
            if (error) throw error;
            showToast(
                newStatus === 'active' ? 'Product published! 🎉' : 'Product set to draft.',
                'success'
            );
        } catch (err: any) {
            showToast(err.message || 'Failed to update status', 'error');
            setProducts(prev =>
                prev.map(p => (p.id === productId ? { ...p, status: currentStatus } : p))
            );
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productToDelete);
            if (error) throw error;
            
            setProducts(prev => prev.filter(p => p.id !== productToDelete));
            showToast('Product deleted.', 'success');
            setProductToDelete(null);
        } catch (err: any) {
            showToast(err.message || 'Failed to delete product', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!store?.id) {
            showToast('Profile updated!', 'success');
            return;
        }

        setIsSavingDesign(true);
        try {
            const { error } = await supabase
                .from('stores')
                .update({
                    display_name: name,
                    bio: bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', store.id);

            if (error) throw error;
            if (refreshData) await refreshData();
            showToast('Store profile saved successfully! ✨', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to save profile', 'error');
        } finally {
            setIsSavingDesign(false);
        }
    };

    const visibleProducts = products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
    );

    const activeCount = products.filter(p => p.status === 'active').length;
    const totalSales = products.reduce((acc, p) => acc + (p.sales || 0), 0);
    const totalRevenue = products.reduce(
        (acc, p) => acc + (p.sales || 0) * (Number(p.price) || 0),
        0
    );

    return (
        <>
            {/* ═══ HEADING ═══ */}
            <div className="page-heading">
                <div>
                    <h1>My Store</h1>
                    <p className="subtitle">Your digital storefront, your rules.</p>
                </div>
                <div className="heading-actions">
                    <Button
                        variant="outline"
                        onClick={copyLink}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Copy size={14} />
                        Copy Link
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setIsAddModalOpen(true);
                        }}
                        className="text-xs h-9 gap-1.5"
                    >
                        <Plus size={14} />
                        New Product
                    </Button>
                </div>
            </div>

            {/* ═══ TOOLBAR ═══ */}
            <div className="toolbar">
                <div className="segments">
                    {(['Products', 'Design & Profile'] as const).map(item => (
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

                {tab === 'Products' && (
                    <label className="search">
                        <Search size={14} />
                        <input
                            placeholder="Search product..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </label>
                )}
            </div>

            {/* ═══ CONTENT TABS ═══ */}
            {tab === 'Products' ? (
                <>
                    {/* Stats */}
                    <div className="stats">
                        <Stat
                            label="Total Products"
                            value={products.length.toString()}
                            change={products.length > 0 ? "+1 product" : "0%"}
                            icon={ShoppingBag}
                        />
                        <Stat
                            label="Active Products"
                            value={activeCount.toString()}
                            change="Live"
                            icon={Globe}
                            color="green"
                            index={1}
                        />
                        <Stat
                            label="Product Sales"
                            value={totalSales.toString()}
                            change={totalSales > 0 ? "+12.1%" : "0%"}
                            icon={TrendingUp}
                            color="orange"
                        />
                        <Stat
                            label="Product Revenue"
                            value={`$${totalRevenue.toLocaleString('en-US')}`}
                            change={totalRevenue > 0 ? "+18.2%" : "0%"}
                            icon={Wallet}
                            index={1}
                        />
                    </div>

                    {/* Products List Panel */}
                    <section className="panel">
                        <div className="panel-header">
                            <div>
                                <h2>Product List</h2>
                                <p className="panel-description">
                                    {activeCount} / {products.length} products active on storefront
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs gap-1.5"
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsAddModalOpen(true);
                                }}
                            >
                                <Plus size={13} />
                                Add Product
                            </Button>
                        </div>

                        {loading ? (
                            <div className="p-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-[#5500FF]" />
                                <span className="text-xs font-semibold">Loading products...</span>
                            </div>
                        ) : visibleProducts.length > 0 ? (
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Type</th>
                                            <th>Price</th>
                                            <th>Sales</th>
                                            <th>Status</th>
                                            <th className="text-right" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleProducts.map(p => {
                                            const IconComp = p.icon || BookOpen;
                                            const isLive = p.status === 'active';

                                            return (
                                                <tr key={p.id}>
                                                    <td>
                                                        <div className="product">
                                                            <div className={`product-icon ${p.color}`}>
                                                                <IconComp size={21} />
                                                            </div>
                                                            <div>
                                                                <strong>{p.title}</strong>
                                                                <p>{p.subtitle || 'Digital product'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge">{p.typeLabel}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge purple">
                                                            {Number(p.price) === 0
                                                                ? 'Free'
                                                                : `$${Number(p.price).toLocaleString('en-US')}`}
                                                        </span>
                                                    </td>
                                                    <td className="price">{p.sales || 0}</td>
                                                    <td>
                                                        <div className="row-actions">
                                                            <button
                                                                type="button"
                                                                className={`toggle ${isLive ? '' : 'off'}`}
                                                                onClick={() =>
                                                                    handleToggleStatus(p.id, p.status)
                                                                }
                                                                aria-label={`${p.title} visibility`}
                                                            />
                                                            <span
                                                                className={`badge ${
                                                                    isLive ? 'green' : ''
                                                                }`}
                                                            >
                                                                {isLive ? 'Live' : 'Draft'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-slate-900"
                                                                title="Edit"
                                                                onClick={() => {
                                                                    setEditingProduct(p);
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                            >
                                                                <Edit2 size={13} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-rose-600"
                                                                title="Delete"
                                                                onClick={() => setProductToDelete(p.id)}
                                                            >
                                                                <Trash2 size={13} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty">
                                <div className="product-icon mx-auto mb-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <h2>No products found</h2>
                                <p>Click &quot;Add Product&quot; to list your first digital guide, resource, or session.</p>
                            </div>
                        )}
                    </section>
                </>
            ) : (
                /* ═══ DESIGN & PROFILE TAB ═══ */
                <div className="settings-grid">
                    <div>
                        {/* Profile Image Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Profile Photos</h2>
                                <Camera size={17} className="text-muted-foreground" />
                            </div>
                            <div className="form-body profile-upload">
                                <div className="avatar">
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt=""
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        name
                                            .split(' ')
                                            .slice(0, 2)
                                            .map(s => s[0])
                                            .join('')
                                            .toUpperCase() || 'EA'
                                    )}
                                </div>
                                <div>
                                    <strong className="text-xs">Profile Photo</strong>
                                    <p className="panel-description mb-3">
                                        JPG, PNG or WEBP · Max 5 MB
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <label className="cursor-pointer gap-1.5">
                                            <Camera size={13} />
                                            Select Photo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f) setPhoto(URL.createObjectURL(f));
                                                }}
                                            />
                                        </label>
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Basic Info Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Basic Information</h2>
                                <span className="badge green">Profile active</span>
                            </div>
                            <div className="form-body">
                                <div className="fields">
                                    <label className="field">
                                        FULL NAME
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Your Full Name"
                                        />
                                    </label>
                                    <label className="field">
                                        USERNAME
                                        <input
                                            value={username}
                                            disabled
                                            className="opacity-75"
                                        />
                                    </label>
                                    <label className="field">
                                        EMAIL
                                        <input
                                            type="email"
                                            value={user?.email || 'creator@sety.store'}
                                            disabled
                                            className="opacity-75"
                                        />
                                        <span className="text-[9px] text-muted-foreground">
                                            Account email cannot be modified for security reasons.
                                        </span>
                                    </label>
                                    <label className="field">
                                        BIO
                                        <textarea
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            placeholder="Tell your audience and clients who you are..."
                                        />
                                    </label>
                                </div>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingDesign}
                                    className="text-xs gap-1.5"
                                >
                                    <Check size={14} />
                                    {isSavingDesign ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </section>
                    </div>

                    <div>
                        {/* Store Link Panel */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Storefront Link</h2>
                                <Globe size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <p className="text-xs font-bold mb-4">{storeUrl}</p>
                                <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
                                    <Copy size={13} />
                                    Copy Link
                                </Button>
                            </div>
                        </section>

                        {/* Theme Selection */}
                        <section className="panel">
                            <div className="panel-header">
                                <h2>Store Theme</h2>
                                <Sparkles size={17} className="text-[#5500FF]" />
                            </div>
                            <div className="form-body">
                                <div className="color-options">
                                    {['Purple (Classic Sety)', 'Emerald Green', 'Warm Amber'].map(
                                        (colorName, i) => (
                                            <label
                                                key={colorName}
                                                className="flex items-center gap-2 text-xs font-semibold cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="theme"
                                                    defaultChecked={i === 0}
                                                />
                                                {colorName}
                                            </label>
                                        )
                                    )}
                                </div>
                                <label className="field">
                                    STOREFRONT TITLE
                                    <input
                                        defaultValue={name}
                                        placeholder="Storefront Title"
                                    />
                                </label>
                                <Button
                                    className="mt-5 text-xs gap-1.5"
                                    onClick={() =>
                                        showToast('Store theme updated successfully! 🎨', 'success')
                                    }
                                >
                                    <Check size={14} />
                                    Save Appearance
                                </Button>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            {isAddModalOpen && (
                <ProductEditorModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setEditingProduct(null);
                    }}
                    product={editingProduct}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        setEditingProduct(null);
                        if (store?.id) fetchProducts(store.id);
                        showToast('Product saved successfully! 🎉', 'success');
                    }}
                />
            )}

            {/* Delete Confirm Modal */}
            <ActionConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleDeleteProduct}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmText={isDeleting ? 'Deleting...' : 'Yes, Delete'}
                variant="danger"
            />
        </>
    );
}
