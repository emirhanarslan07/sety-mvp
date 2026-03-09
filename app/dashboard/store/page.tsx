'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ShoppingBag,
    Box,
    PenLine,
    Sparkles,
    ArrowLeft,
    Loader2,
    Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n/context';

// Modular Components
import StoreHeader from '@/components/dashboard/store/StoreHeader';
import StorePreview from '@/components/dashboard/store/StorePreview';
import ThemeCarousel from '@/components/dashboard/store/ThemeCarousel';
import StylingSection from '@/components/dashboard/store/StylingSection';
import ProductListSection from '@/components/dashboard/store/ProductListSection';
import AddProductSection from '@/components/dashboard/store/AddProductSection';
import AddLandingPageSection from '@/components/dashboard/store/AddLandingPageSection';
import PagesSection from '@/components/dashboard/store/PagesSection';

// Modals
import ProductEditorModal from '@/components/modals/ProductEditorModal';
import ActionConfirmModal from '@/components/modals/ActionConfirmModal';

function StorePageContent() {
    const router = useRouter();
    const { showToast } = useToast();
    const { t } = useTranslation();

    // DEBUG: Render Logger
    const renders = React.useRef(0);
    renders.current++;
    console.debug(`%c[RENDER] StorePageContent #${renders.current}`, 'color: #3b82f6');

    const searchParams = useSearchParams();
    const { user, profile, store, loading: contextLoading, refreshData } = useDashboard();

    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [activeTab, setActiveTab] = useState<'store' | 'landing' | 'design'>('store');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<any>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAddLandingPage, setShowAddLandingPage] = useState(false);

    // Landing Pages State (Dummy for now as in original)
    const [landingPages, setLandingPages] = useState<any[]>([
        { id: 'main', title: t('dashboard.store.modals.edit_page.main_page_title'), slug: '', status: 'active', isDefault: true }
    ]);
    const [isPageEditModalOpen, setIsPageEditModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<any>(null);

    // Design States
    const [selectedColor, setSelectedColor] = useState('#5500ff');
    const [selectedTheme, setSelectedTheme] = useState('minimal');
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [buttonStyle, setButtonStyle] = useState('rounded');
    const [storeLogo, setStoreLogo] = useState<string | null>(null);
    const [socialLinks, setSocialLinks] = useState({
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
    });
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState('');
    const [showAffiliateBadge, setShowAffiliateBadge] = useState(true);

    const [isSavingDesign, setIsSavingDesign] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);
    const [coverUploading, setCoverUploading] = useState(false);

    // Initialize state from context
    useEffect(() => {
        if (store) {
            setDisplayName(store.display_name || profile?.full_name || '');
            setBio(store.bio || '');
            setSelectedTheme(store.theme_id || 'minimal');
            setSelectedColor(store.brand_color || '#5500ff');
            setSelectedFont(store.font_family || 'Inter');
            setButtonStyle(store.button_style || 'rounded');
            setStoreLogo(store.store_logo_url);
            setCoverImage(store.cover_image_url);
            setAnnouncement(store.announcement_text || '');
            setShowAffiliateBadge(store.show_affiliate_badge ?? true);
            setIsVerified(store.is_verified || false);
            setSocialLinks(store.social_links || {
                instagram: '',
                twitter: '',
                youtube: '',
                tiktok: '',
            });
            fetchProducts(store.id);
        }
    }, [store, profile]);

    // Handle URL Params
    useEffect(() => {
        if (!searchParams) return;
        const tab = searchParams.get('tab');
        if (tab === 'store' || tab === 'landing' || tab === 'design') {
            setActiveTab(tab as any);
        }
        const action = searchParams.get('action');
        if (action === 'add') {
            setShowAddProduct(true);
        }
    }, [searchParams]);

    const fetchProducts = async (storeId: string) => {
        try {
            setLoadingProducts(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setLogoUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/store-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setStoreLogo(publicUrl);
        } catch (error) {
            console.error('Logo upload error:', error);
            showToast(t('dashboard.store.states.logo_error'), 'error');
        } finally {
            setLogoUploading(false);
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setCoverUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/store-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setCoverImage(publicUrl);
        } catch (error) {
            console.error('Cover upload error:', error);
            showToast(t('dashboard.store.states.cover_error'), 'error');
        } finally {
            setCoverUploading(false);
        }
    };

    const handleSaveDesign = async (dataOverride?: any) => {
        if (!user || !store) return;
        setIsSavingDesign(true);
        try {
            const updateData = dataOverride || {
                display_name: displayName,
                bio: bio,
                store_logo_url: storeLogo,
                cover_image_url: coverImage,
                theme_id: selectedTheme,
                brand_color: selectedColor,
                font_family: selectedFont,
                button_style: buttonStyle,
                announcement_text: announcement,
                show_affiliate_badge: showAffiliateBadge,
                social_links: socialLinks,
                is_verified: isVerified,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('stores')
                .update(updateData)
                .eq('id', store.id);

            if (error) throw error;

            await refreshData();
        } catch (error) {
            console.error('Save design error:', error);
        } finally {
            setIsSavingDesign(false);
        }
    };

    const handleResetDesign = () => {
        if (!store) return;
        setDisplayName(store.display_name || profile?.full_name || '');
        setBio(store.bio || '');
        setSelectedTheme(store.theme_id || 'minimal');
        setSelectedColor(store.brand_color || '#5500ff');
        setSelectedFont(store.font_family || 'Inter');
        setButtonStyle(store.button_style || 'rounded');
        setStoreLogo(store.store_logo_url);
        setCoverImage(store.cover_image_url);
        setAnnouncement(store.announcement_text || '');
        setShowAffiliateBadge(store.show_affiliate_badge ?? true);
        setIsVerified(store.is_verified || false);
        setSocialLinks(store.social_links || {
            instagram: '',
            twitter: '',
            youtube: '',
            tiktok: '',
        });
    };

    const handleDeleteProduct = (productId: string) => {
        setProductToDelete(productId);
        setIsConfirmOpen(true);
        setActiveActionMenu(null);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productToDelete);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== productToDelete));
            setIsConfirmOpen(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };

    const handleToggleStatus = async (item: any) => {
        const newStatus = item.status === 'active' ? 'draft' : 'active';
        try {
            const { error } = await supabase
                .from('products')
                .update({ status: newStatus })
                .eq('id', item.id);

            if (error) throw error;
            setProducts(products.map(p => p.id === item.id ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setActiveActionMenu(null);
        }
    };

    const copyToClipboard = () => {
        if (!store?.username) return;
        const url = `${window.location.origin}/${store.username}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast(t('dashboard.toast.store_link_copied'), 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const savePageChanges = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;

        setLandingPages(landingPages.map(p =>
            p.id === selectedPage.id ? { ...p, title, slug } : p
        ));
        setIsPageEditModalOpen(false);
    };

    if (contextLoading || (loadingProducts && products.length === 0)) {
        return (
            <div className="max-w-[1200px] mx-auto p-4 md:p-10 space-y-10">
                <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <Skeleton className="h-40 w-full rounded-3xl" />
                        <Skeleton className="h-[400px] w-full rounded-3xl" />
                    </div>
                    <div className="lg:col-span-4">
                        <Skeleton className="h-[600px] w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (showAddProduct) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-8">
                {selectedType ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#5500ff]" />
                        <p className="font-bold">{t('dashboard.store.states.loading_editor')}</p>
                        <ProductEditorModal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedType(null);
                            }}
                            productType={selectedType}
                            onSuccess={() => {
                                if (store) fetchProducts(store.id);
                                setShowAddProduct(false);
                                setSelectedType(null);
                                setIsModalOpen(false);
                            }}
                        />
                    </div>
                ) : (
                    <AddProductSection
                        setShowAddProduct={setShowAddProduct}
                        onSelectType={(type) => {
                            setSelectedType(type);
                            setIsModalOpen(true);
                        }}
                    />
                )}
            </div>
        );
    }

    if (showAddLandingPage) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-8">
                {selectedType ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#5500ff]" />
                        <p className="font-bold">{t('dashboard.store.states.loading_editor')}</p>
                        <ProductEditorModal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedType(null);
                            }}
                            productType={selectedType}
                            isLandingPage={true}
                            onSuccess={() => {
                                if (store) fetchProducts(store.id);
                                setShowAddLandingPage(false);
                                setSelectedType(null);
                                setIsModalOpen(false);
                            }}
                        />
                    </div>
                ) : (
                    <AddLandingPageSection
                        onBack={() => setShowAddLandingPage(false)}
                        onSelectType={(type) => {
                            setSelectedType(type);
                            setIsModalOpen(true);
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-0 pb-24">
            {/* Header Area */}
            <StoreHeader
                username={store?.username || 'user'}
                copied={copied}
                copyToClipboard={copyToClipboard}
                handleSaveDesign={handleSaveDesign}
                isSavingDesign={isSavingDesign}
            />

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 space-y-12">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100/60 rounded-[22px] w-fit border border-slate-200/50">
                        {[
                            { id: 'store', label: t('dashboard.store.tabs.products'), icon: ShoppingBag },
                            { id: 'design', label: t('dashboard.store.tabs.design'), icon: PenLine },
                            { id: 'landing', label: t('dashboard.store.tabs.pages'), icon: Box },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2.5 px-6 py-3 rounded-[18px] text-[14px] font-black transition-all",
                                    activeTab === tab.id
                                        ? "bg-white text-[#5500ff] shadow-sm border border-[#5500ff]/10"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-12 min-h-[500px]">
                        {activeTab === 'store' && (
                            <ProductListSection
                                products={products}
                                setShowAddProduct={setShowAddProduct}
                                activeActionMenu={activeActionMenu}
                                setActiveActionMenu={setActiveActionMenu}
                                handleToggleStatus={handleToggleStatus}
                                handleDeleteProduct={handleDeleteProduct}
                            />
                        )}

                        {activeTab === 'design' && (
                            <div className="space-y-20 pb-20 relative">
                                {/* 1. Theme Selection */}
                                <section className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">{t('dashboard.store.sections.theme_selection')}</h3>
                                    </div>
                                    <ThemeCarousel
                                        selectedTheme={selectedTheme}
                                        onSelectTheme={(theme) => {
                                            setSelectedTheme(theme.id);
                                            setSelectedColor(theme.color);
                                            setSelectedFont(theme.font);
                                            setButtonStyle(theme.buttonStyle);
                                        }}
                                    />
                                </section>

                                {/* 2. Appearance Tuning */}
                                <section className="space-y-8">
                                    {/* Section title removed per user request */}
                                    <div className="bg-white p-8 rounded-[40px] border border-slate-100/50 shadow-sm transition-all hover:shadow-md">
                                        <StylingSection
                                            selectedColor={selectedColor}
                                            setSelectedColor={setSelectedColor}
                                            selectedFont={selectedFont}
                                            setSelectedFont={setSelectedFont}
                                            buttonStyle={buttonStyle}
                                            setButtonStyle={setButtonStyle}
                                        />
                                    </div>
                                </section>

                                {/* Footer Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleResetDesign}
                                        className="h-14 px-8 rounded-2xl font-black text-[15px] text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        {t('dashboard.store.actions.cancel')}
                                    </button>
                                    <button
                                        onClick={() => handleSaveDesign()}
                                        disabled={isSavingDesign}
                                        className={cn(
                                            "h-14 px-10 rounded-2xl font-black text-[15px] transition-all active:scale-95 shadow-xl shadow-indigo-100/50",
                                            "bg-[#5500ff] text-white hover:bg-[#4400cc] disabled:opacity-50"
                                        )}
                                    >
                                        {t('dashboard.store.actions.save')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'landing' && (
                            <PagesSection
                                landingPages={[
                                    { id: 'main', title: t('dashboard.store.modals.edit_page.main_page_title'), slug: '', status: 'active', isDefault: true },
                                    ...products.filter(p => p.visibility === 'hidden').map(p => ({
                                        id: p.id,
                                        title: p.title,
                                        slug: p.slug || p.id.split('-')[0],
                                        status: p.status,
                                        isDefault: false
                                    }))
                                ]}
                                onAddPage={() => setShowAddLandingPage(true)}
                                handleEditPage={(page) => {
                                    setSelectedPage(page);
                                    setIsPageEditModalOpen(true);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar Preview */}
                <div className="hidden lg:block lg:col-span-4 sticky top-8">
                    <StorePreview
                        profile={profile}
                        products={products}
                        designProps={{
                            theme: selectedTheme,
                            color: selectedColor,
                            font: selectedFont,
                            buttonStyle: buttonStyle,
                            logo: storeLogo,
                            socialLinks: socialLinks,
                            displayName: displayName,
                            bio: bio,
                            isVerified: isVerified,
                            coverImage: coverImage,
                            announcement: announcement,
                            showAffiliateBadge: showAffiliateBadge
                        }}
                    />
                </div>
            </div>

            {/* Modals */}
            <ActionConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={t('dashboard.store.modals.delete_product.title')}
                description={t('dashboard.store.modals.delete_product.desc')}
                confirmText={t('dashboard.store.modals.delete_product.confirm')}
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Page Edit Modal */}
            {isPageEditModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsPageEditModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden p-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-slate-900">{t('dashboard.store.modals.edit_page.title')}</h3>
                                <p className="text-slate-500 font-medium">{t('dashboard.store.modals.edit_page.desc')}</p>
                            </div>

                            <form onSubmit={savePageChanges} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('dashboard.store.modals.edit_page.label_title')}</label>
                                    <input
                                        name="title"
                                        defaultValue={selectedPage?.title}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                        placeholder={t('dashboard.store.modals.edit_page.placeholder_title')}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">{t('dashboard.store.modals.edit_page.label_slug')}</label>
                                    <div className="flex items-center gap-2 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20">
                                        <span className="text-slate-400 font-bold">sety.store/{store?.username}/</span>
                                        <input
                                            name="slug"
                                            defaultValue={selectedPage?.slug}
                                            disabled={selectedPage?.isDefault}
                                            className="flex-1 bg-transparent border-none outline-none font-bold text-slate-900 disabled:opacity-50"
                                            placeholder={t('dashboard.store.modals.edit_page.placeholder_slug')}
                                        />
                                    </div>
                                    {selectedPage?.isDefault && <p className="text-[11px] text-slate-400 font-medium">{t('dashboard.store.modals.edit_page.default_page_desc')}</p>}
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsPageEditModalOpen(false)}
                                        className="flex-1 h-14 rounded-2xl font-bold border border-slate-100"
                                    >
                                        {t('dashboard.store.actions.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 h-14 rounded-2xl font-bold bg-[#5500ff] text-white hover:bg-[#4400cc]"
                                    >
                                        {t('dashboard.store.actions.save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MyStorePage() {
    return (
        <Suspense fallback={
            <div className="max-w-[1400px] mx-auto p-10 space-y-10">
                <Skeleton className="h-20 w-full rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <Skeleton className="h-40 w-full rounded-3xl" />
                        <Skeleton className="h-[400px] w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        }>
            <StorePageContent />
        </Suspense>
    );
}
