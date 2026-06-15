'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ShoppingBag,
    PenLine,
    ArrowLeft,
    Loader2,
    Check,
    Palette,
    Layout,
    Copy,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { useDashboard } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n/context';

// Modular Components
import StoreHeader from '@/components/dashboard/store/StoreHeader';
import StorePreview from '@/components/dashboard/store/StorePreview';
import ThemeCarousel, { THEME_TEMPLATES } from '@/components/dashboard/store/ThemeCarousel';
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
    const [selectedTheme, setSelectedTheme] = useState('minimal');
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
            const activeThemeData = THEME_TEMPLATES.find(t => t.id === selectedTheme);
            
            // Ignore click events passed automatically by React onClick
            const isEvent = dataOverride && (dataOverride.target || dataOverride.nativeEvent);
            const updateData = (dataOverride && !isEvent) ? dataOverride : {
                display_name: displayName,
                bio: bio,
                store_logo_url: storeLogo,
                cover_image_url: coverImage,
                theme_id: selectedTheme,
                brand_color: activeThemeData?.color || '#5500ff',
                font_family: activeThemeData?.font || 'Inter',
                button_style: activeThemeData?.buttonStyle || 'rounded',
                announcement_text: announcement,
                show_affiliate_badge: showAffiliateBadge,
                social_links: socialLinks,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('stores')
                .update(updateData)
                .eq('id', store.id);

            if (error) throw error;

            await refreshData();
            showToast('Değişiklikler başarıyla kaydedildi! 🎉', 'success');
        } catch (error: any) {
            console.error('Save design error:', error);
            showToast(error.message || 'Değişiklikler kaydedilirken bir hata oluştu.', 'error');
        } finally {
            setIsSavingDesign(false);
        }
    };

    const handleResetDesign = () => {
        if (!store) return;
        setDisplayName(store.display_name || profile?.full_name || '');
        setBio(store.bio || '');
        setSelectedTheme(store.theme_id || 'minimal');
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
        <div className="flex-1 flex flex-col h-full bg-[#FDFDFF] overflow-hidden">
            {/* Header Area */}
            <StoreHeader
                username={store?.username || 'user'}
                copied={copied}
                copyToClipboard={copyToClipboard}
                handleSaveDesign={handleSaveDesign}
                isSavingDesign={isSavingDesign}
            />

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                <div className="max-w-[1400px] mx-auto pb-24">

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 space-y-12">
                    {/* Sticky Navigation Tabs (Mobile Optimized) */}
                    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl -mx-4 px-4 py-4 md:static md:bg-transparent md:p-0 md:m-0 border-b border-slate-100 md:border-none">
                        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/50 md:bg-slate-100/80 rounded-[28px] max-w-fit shadow-sm border border-slate-200/50">
                            {[
                                { id: 'store', label: t('dashboard.store.tabs.products'), icon: ShoppingBag },
                                { id: 'design', label: t('dashboard.store.tabs.design'), icon: Palette },
                                { id: 'landing', label: t('dashboard.store.tabs.pages'), icon: Layout },
                            ].map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id as any);
                                            // Scroll to top when switching tabs on mobile
                                            if (window.innerWidth < 768) {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-[22px] text-[13px] md:text-[15px] font-black transition-all active:scale-95 whitespace-nowrap",
                                            isActive
                                                ? "bg-white text-[#5500ff] shadow-md shadow-slate-200/50"
                                                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                                        )}
                                    >
                                        <Icon className={cn("w-4 md:w-4.5 h-4 md:h-4.5", isActive ? "text-[#5500ff]" : "text-slate-400")} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content with Entrance Animations */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-12 min-h-[500px]"
                        >
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
                                <div className="space-y-16 pb-20 relative">
                                    {/* 1. Theme Selection */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('dashboard.store.sections.theme_selection')}</h3>
                                        </div>
                                        <ThemeCarousel
                                            selectedTheme={selectedTheme}
                                            onSelectTheme={(theme) => {
                                                setSelectedTheme(theme.id);
                                                // Also auto-save the theme's default design values
                                                // so the public store renders correctly
                                                handleSaveDesign({
                                                    display_name: displayName,
                                                    bio: bio,
                                                    store_logo_url: storeLogo,
                                                    cover_image_url: coverImage,
                                                    theme_id: theme.id,
                                                    brand_color: theme.color,
                                                    font_family: theme.font || 'Inter',
                                                    button_style: theme.buttonStyle || 'rounded',
                                                    announcement_text: announcement,
                                                    show_affiliate_badge: showAffiliateBadge,
                                                    social_links: socialLinks,
                                                    updated_at: new Date().toISOString()
                                                });
                                            }}
                                        />
                                    </section>
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
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Sidebar Preview */}
                <div className="hidden lg:block lg:col-span-4 sticky top-8 max-w-[340px] ml-auto w-full">
                    <StorePreview
                        profile={profile}
                        products={products}
                        designProps={{
                            theme: selectedTheme,
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

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-6 inset-x-4 z-50 animate-in fade-in slide-in-from-bottom-10 h-20">
                <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-3">
                    <button
                        onClick={copyToClipboard}
                        title={t('dashboard.store.header.copy_link')}
                        className={cn(
                            "w-14 h-14 rounded-[24px] flex items-center justify-center transition-all active:scale-90",
                            copied ? "bg-[#E0FFEC] text-[#00A84D]" : "bg-slate-100 text-slate-500"
                        )}
                    >
                        {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={handleSaveDesign}
                        disabled={isSavingDesign}
                        className="flex-1 h-14 rounded-[24px] bg-[#5500ff] text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50"
                    >
                        {isSavingDesign ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        {t('dashboard.store.header.save_changes')}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <ActionConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    setIsConfirmOpen(false);
                    setProductToDelete(null);
                }}
                onConfirm={() => productToDelete && handleDeleteProduct(productToDelete)}
                title="Ürünü Sil"
                description="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
                isLoading={isDeleting}
                variant="danger"
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
        </div>
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
