'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import Image from 'next/image';
import {
    X,
    Upload,
    Image as ImageIcon,
    Type,
    DollarSign,
    Layout,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Check,
    MousePointer2,
    MessageSquare,
    Eye,
    ArrowLeft,
    Copy,
    Settings,
    CreditCard,
    ShoppingBag,
    Mail,
    Download,
    Video,
    Sparkles,
    Heart,
    Gift,
    Book,
    Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import LiveCardPreview from '@/components/dashboard/LiveCardPreview';
import { PRODUCT_THUMBNAIL_TEMPLATES } from '@/lib/constants/templates';
import CheckoutEditor from '@/components/dashboard/store/CheckoutEditor';
import DigitalProductEditor from '@/components/dashboard/store/DigitalProductEditor';
import CoachingEditor from '@/components/dashboard/store/CoachingEditor';
import VideoResponseEditor from '@/components/dashboard/store/VideoResponseEditor';

interface ProductEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType: any;
    onSuccess: () => void;
    isLandingPage?: boolean;
}

type Tab = 'checkout_page' | 'product' | 'options';

export default function ProductEditorModal({
    isOpen,
    onClose,
    productType,
    onSuccess,
    isLandingPage = false
}: ProductEditorModalProps) {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('checkout_page');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('stores').select('username').eq('user_id', user.id).single();
                if (data) setUsername(data.username);
            }
        };
        getProfile();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        price: '',
        currency: 'TRY',
        thumbnail_style: 'callout',
        button_text: 'Hemen Al',
        image_url: '',
        image_zoom: 1,
        external_checkout_url: '',
        checkout_provider: 'manual',
        icon_id: 'mail',
        // Options tab fields
        status: 'active',
        discount_code: '',
        discount_percent: '',
        has_stock_limit: false,
        stock_limit: '',
        description: '',
        visibility: isLandingPage ? 'hidden' : 'public',
    });

    const updateData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/product-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            updateData('image_url', publicUrl);
            showToast('Görsel yüklendi.', 'success');
        } catch (err: any) {
            showToast(`Görsel yüklenirken hata oluştu: ${err.message}`, 'error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (checkoutData?: any) => {
        if (imageUploading) return;
        setLoading(true);
        setIsSuccess(false);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            const { data: storeData } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!storeData) throw new Error('Mağaza bulunamadı');

            const title = checkoutData?.title || formData.title;
            if (!title) {
                throw new Error('Lütfen bir başlık girin.');
            }

            const finalData = {
                user_id: user.id,
                store_id: storeData.id,
                title: checkoutData?.title || formData.title,
                subtitle: checkoutData?.bottom_title || formData.subtitle,
                description: checkoutData?.description || formData.description,
                price: checkoutData?.price !== undefined ? checkoutData.price : (parseFloat(formData.price) || 0),
                discount_price: checkoutData?.discount_price || 0,
                currency: formData.currency,
                type: productType.id,
                thumbnail_style: formData.thumbnail_style,
                button_text: checkoutData?.button_text || formData.button_text,
                image_url: checkoutData?.image_url || formData.image_url,
                image_zoom: formData.image_zoom,
                external_checkout_url: formData.external_checkout_url,
                checkout_provider: formData.checkout_provider,
                icon_id: formData.icon_id,
                status: 'active',
                visibility: formData.visibility,
                // Digital product & fields
                fields: checkoutData?.fields || [],
                file_url: checkoutData?.digital_file_url || '',
                redirect_url: checkoutData?.redirect_url || '',
                payment_plan_enabled: checkoutData?.payment_plan_enabled || false,
                payment_plan_installments: parseInt(checkoutData?.payment_plan_installments) || 0,
                discount_code_enabled: checkoutData?.discount_code_enabled || false,
                discount_code: checkoutData?.discount_code || '',
                discount_percent: parseInt(checkoutData?.discount_percent) || 0,
                quantity_limit_enabled: checkoutData?.quantity_limit_enabled || false,
                quantity_limit: parseInt(checkoutData?.quantity_limit) || 0,
                coaching_config: checkoutData?.availability || null,
                extra_options: checkoutData?.extra_options || checkoutData?.options || null,
            };

            const { error: insertError } = await supabase
                .from('products')
                .insert([finalData]);

            if (insertError) {
                throw insertError;
            }

            setIsSuccess(true);
            showToast('Ürün başarıyla yayınlandı! ✨', 'success');

            // Keep the loading state for 2 seconds so the user sees the success
            // then close and refresh
            await new Promise(resolve => setTimeout(resolve, 2000));

            onSuccess();
            onClose();
        } catch (err: any) {
            setIsSuccess(false);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 left-0 z-[40] bg-white flex flex-col animate-in fade-in duration-500 overflow-hidden shadow-2xl lg:pl-[240px]">
            {/* Top Navigation Bar */}
            <header className="h-[80px] border-b border-slate-100/50 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <span className="text-slate-400">Mağazam</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-[#5500ff]">
                            {isLandingPage ? 'Açılış Sayfası Oluştur' : 'Yeni Ürün Ekle'}
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[12px] font-bold text-slate-500">sety.store/{username}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-300 cursor-pointer hover:text-[#5500ff] transition-colors" />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden bg-[#FDFDFF]">
                {activeTab === 'checkout_page' ? (
                    productType?.id === 'digital_product' ? (
                        <DigitalProductEditor
                            productType={productType}
                            onClose={onClose}
                            onSave={handleSubmit}
                            isSaving={loading}
                            isSuccess={isSuccess}
                        />
                    ) : productType?.id === 'coaching_call' ? (
                        <CoachingEditor
                            productType={productType}
                            onClose={onClose}
                            onSave={handleSubmit}
                            isSaving={loading}
                            isSuccess={isSuccess}
                        />
                    ) : productType?.id === 'video_response' || productType?.id === 'custom_product' ? (
                        <VideoResponseEditor
                            productType={productType}
                            onClose={onClose}
                            onSave={handleSubmit}
                            isSaving={loading}
                            isSuccess={isSuccess}
                        />
                    ) : (
                        <CheckoutEditor
                            productType={productType}
                            onClose={onClose}
                            onSave={handleSubmit}
                            isSaving={loading}
                            isSuccess={isSuccess}
                        />
                    )
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Side: Form Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                            <div className="max-w-[640px] mx-auto space-y-12 pb-20">
                                {/* Tab Navigation (Stan Style) */}
                                <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-full w-fit border border-slate-100">
                                    {[
                                        { id: 'checkout_page', label: 'Ödeme Sayfası', icon: ShoppingBag },
                                        { id: 'product', label: 'Mağaza Ürünü', icon: ImageIcon },
                                        { id: 'options', label: 'Seçenekler', icon: Settings }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as Tab)}
                                            className={cn(
                                                "flex items-center gap-2.5 px-6 py-3 rounded-full text-[14px] font-black tracking-tight transition-all",
                                                activeTab === tab.id
                                                    ? "bg-white text-[#5500ff] shadow-md border border-[#5500ff]/10"
                                                    : "text-slate-400 hover:text-slate-700 hover:bg-white/50"
                                            )}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'product' && (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                                                <h4 className="text-[17px] font-bold text-slate-900">Kart stilini seçin</h4>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { id: 'button', label: 'Buton', icon: MousePointer2 },
                                                    { id: 'callout', label: 'Callout', icon: MessageSquare },
                                                    { id: 'preview', label: 'Önizleme', icon: Eye }
                                                ].map((style) => (
                                                    <button
                                                        key={style.id}
                                                        onClick={() => updateData('thumbnail_style', style.id)}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center py-8 rounded-3xl border-2 transition-all gap-3 bg-white",
                                                            formData.thumbnail_style === style.id
                                                                ? "border-[#5500ff] text-[#5500ff] shadow-xl shadow-blue-500/5"
                                                                : "border-slate-100 text-slate-400 hover:border-slate-200"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                                            formData.thumbnail_style === style.id ? "bg-[#5500ff] text-white" : "bg-slate-50"
                                                        )}>
                                                            <style.icon className="w-6 h-6" />
                                                        </div>
                                                        <span className="text-[14px] font-black">{style.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                                                <h4 className="text-[17px] font-bold text-slate-900">Görsel ve İkon</h4>
                                            </div>
                                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-8">
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-28 h-28 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group cursor-pointer"
                                                >
                                                    {formData.image_url ? (
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={formData.image_url}
                                                                alt="Thumbnail"
                                                                fill
                                                                className="object-cover"
                                                                sizes="112px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <ImageIcon className="w-8 h-8 text-slate-300" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    {[
                                                        { id: 'mail', icon: Mail },
                                                        { id: 'download', icon: Download },
                                                        { id: 'video', icon: Video },
                                                        { id: 'sparkles', icon: Sparkles },
                                                        { id: 'book', icon: Book },
                                                        { id: 'music', icon: Music },
                                                    ].map((item) => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => updateData('icon_id', item.id)}
                                                            className={cn(
                                                                "w-10 h-10 rounded-xl border-2 inline-flex items-center justify-center mr-2 mb-2 transition-all",
                                                                formData.icon_id === item.id ? "border-[#5500ff] bg-indigo-50 text-[#5500ff]" : "border-slate-50 text-slate-300"
                                                            )}
                                                        >
                                                            <item.icon className="w-5 h-5" />
                                                        </button>
                                                    ))}
                                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'options' && (
                                    <div className="space-y-12 animate-in fade-in duration-500">
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                                                <h4 className="text-[17px] font-bold text-slate-900">Görünürlük ve Durum</h4>
                                            </div>
                                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[16px] font-black text-slate-900">Ürün Aktif</p>
                                                        <p className="text-[13px] text-slate-400 font-bold">Mağazanızda yayına alınsın.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => updateData('status', formData.status === 'active' ? 'draft' : 'active')}
                                                        className={cn(
                                                            "w-14 h-8 rounded-full relative transition-all duration-300",
                                                            formData.status === 'active' ? "bg-[#5500ff]" : "bg-slate-200"
                                                        )}
                                                    >
                                                        <div className={cn("w-6 h-6 rounded-full bg-white absolute top-1 transition-all", formData.status === 'active' ? "left-7" : "left-1")} />
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                                    <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-900 transition-colors">Vazgeç</button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading || isSuccess}
                                        className={cn(
                                            "h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black hover:bg-[#4400cc] shadow-xl shadow-blue-500/10 transition-all",
                                            (loading || isSuccess) && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isSuccess ? (
                                            <div className="flex items-center gap-2">
                                                <Check className="w-5 h-5 text-[#C4FF00]" />
                                                Yayınlandı ✨
                                            </div>
                                        ) : loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            'Kaydet ve Yayınla ✨'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Floating Preview */}
                        <div className="hidden lg:flex w-[480px] border-l border-slate-100 flex-col items-center justify-center p-12 bg-[#F8FAFC]">
                            <div className="w-full max-w-[320px] space-y-10 group">
                                <div className="text-center space-y-3">
                                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Kart Önizlemesi</h3>
                                    <p className="text-[14px] text-slate-400 font-bold tracking-tight">Mağaza ana sayfasında böyle görünecek.</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -inset-10 bg-[#5500ff]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-8">
                                        <LiveCardPreview
                                            data={{
                                                ...formData,
                                                price: parseFloat(formData.price) || 0,
                                                type: productType.id
                                            }}
                                            icon={productType.icon}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
