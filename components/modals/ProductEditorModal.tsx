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
import SimpleBlockEditor from '@/components/dashboard/store/SimpleBlockEditor';
import { useTranslation } from '@/lib/i18n/context';

interface ProductEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType: any;
    onSuccess: () => void;
    isLandingPage?: boolean;
    editingProduct?: any;
}

type Tab = 'checkout_page' | 'product' | 'options';

export default function ProductEditorModal({
    isOpen,
    onClose,
    productType,
    onSuccess,
    isLandingPage = false,
    editingProduct = null
}: ProductEditorModalProps) {
    const { t } = useTranslation();
    const [wizardStep, setWizardStep] = useState(2);
    const [checkoutDataState, setCheckoutDataState] = useState<any>(editingProduct || null);
    const { showToast } = useToast();
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
        title: editingProduct?.title || '',
        subtitle: editingProduct?.subtitle || '',
        price: editingProduct?.price?.toString() || '',
        currency: editingProduct?.currency || 'TRY',
        thumbnail_style: editingProduct?.thumbnail_style || 'callout',
        button_text: editingProduct?.button_text || 'Hemen Al',
        image_url: editingProduct?.image_url || '',
        image_zoom: editingProduct?.image_zoom || 1,
        external_checkout_url: editingProduct?.external_checkout_url || '',
        checkout_provider: editingProduct?.checkout_provider || 'manual',
        icon_id: editingProduct?.icon_id || 'mail',
        // Options tab fields
        status: editingProduct?.status || 'active',
        discount_code: editingProduct?.discount_code || '',
        discount_percent: editingProduct?.discount_percent?.toString() || '',
        has_stock_limit: editingProduct?.quantity_limit_enabled || false,
        stock_limit: editingProduct?.quantity_limit?.toString() || '',
        description: editingProduct?.description || '',
        visibility: editingProduct?.visibility || (isLandingPage ? 'hidden' : 'public'),
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
                status: formData.status || 'active',
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

            let error;
            if (editingProduct?.id) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(finalData)
                    .eq('id', editingProduct.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([finalData]);
                error = insertError;
            }

            if (error) throw error;

            setIsSuccess(true);
            showToast(editingProduct ? 'Ürün güncellendi! ✨' : 'Ürün başarıyla yayınlandı! ✨', 'success');

            await new Promise(resolve => setTimeout(resolve, 1500));
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
            <header className="h-[80px] border-b border-slate-100/50 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 z-10">
                <div className="flex-1 max-w-2xl mx-auto px-4 md:px-12 flex items-center justify-between relative">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-10 mx-10"></div>
                    
                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className="w-8 h-8 rounded-full bg-[#5500ff] text-white flex items-center justify-center shadow-lg"><Check className="w-4 h-4"/></div>
                        <span className="text-[11px] font-black text-[#5500ff] tracking-tight uppercase">1. Tip</span>
                    </div>

                    <div className={cn("absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-[#5500ff] transition-all duration-500 -z-10", 
                        wizardStep === 2 ? "w-[33%]" : wizardStep === 3 ? "w-[66%]" : wizardStep === 4 ? "w-full" : "w-0"
                    )}></div>

                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500", 
                            wizardStep >= 2 ? "bg-[#5500ff] text-white shadow-lg" : "bg-slate-100 text-slate-400")}>
                            {wizardStep > 2 ? <Check className="w-4 h-4"/> : "2"}
                        </div>
                        <span className={cn("text-[11px] font-black tracking-tight uppercase", wizardStep >= 2 ? "text-[#5500ff]" : "text-slate-400")}>2. Ürün</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500", 
                            wizardStep >= 3 ? "bg-[#5500ff] text-white shadow-lg" : "bg-slate-100 text-slate-400")}>
                            {wizardStep > 3 ? <Check className="w-4 h-4"/> : "3"}
                        </div>
                        <span className={cn("text-[11px] font-black tracking-tight uppercase", wizardStep >= 3 ? "text-[#5500ff]" : "text-slate-400")}>3. Ayarlar</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500", 
                            wizardStep >= 4 ? "bg-[#5500ff] text-white shadow-lg" : "bg-slate-100 text-slate-400")}>
                            4
                        </div>
                        <span className={cn("text-[11px] font-black tracking-tight uppercase", wizardStep >= 4 ? "text-[#5500ff]" : "text-slate-400")}>4. Yayınla</span>
                    </div>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </header>

            <main className="flex-1 flex overflow-hidden bg-[#FDFDFF] relative">
                {wizardStep === 2 && (
                    <div className="flex-1 flex overflow-hidden relative">
                        <div className="absolute bottom-6 right-6 lg:right-[640px] z-50 pointer-events-none hidden md:block">
                            <div className="bg-[#5500ff] text-white px-5 py-3 rounded-2xl text-[14px] font-black shadow-2xl shadow-indigo-500/30 animate-bounce flex items-center gap-2">
                                Doldurup &apos;İleri&apos; butonuna basarak ilerleyin <ChevronRight className="w-4 h-4"/>
                            </div>
                        </div>
                        {productType?.id === 'digital_product' ? (
                            <DigitalProductEditor
                                productType={productType}
                                initialData={checkoutDataState || editingProduct}
                                onClose={onClose}
                                onSave={(data) => { setCheckoutDataState(data); setWizardStep(3); }}
                                isSaving={false} isSuccess={false}
                            />
                        ) : productType?.id === 'coaching_call' ? (
                            <CoachingEditor
                                productType={productType}
                                initialData={checkoutDataState || editingProduct}
                                onClose={onClose}
                                onSave={(data) => { setCheckoutDataState(data); setWizardStep(3); }}
                                isSaving={false} isSuccess={false}
                            />
                        ) : productType?.id === 'video_response' || productType?.id === 'custom_product' ? (
                            <VideoResponseEditor
                                productType={productType}
                                initialData={checkoutDataState || editingProduct}
                                onClose={onClose}
                                onSave={(data) => { setCheckoutDataState(data); setWizardStep(3); }}
                                isSaving={false} isSuccess={false}
                            />
                        ) : productType?.id === 'text_block' || productType?.id === 'social_block' ? (
                            <SimpleBlockEditor
                                productType={productType}
                                initialData={checkoutDataState || editingProduct}
                                onClose={onClose}
                                onSave={(data) => { setCheckoutDataState(data); setWizardStep(3); }}
                                isSaving={false} isSuccess={false}
                            />
                        ) : (
                            <CheckoutEditor
                                productType={productType}
                                initialData={checkoutDataState || editingProduct}
                                onClose={onClose}
                                onSave={(data) => { setCheckoutDataState(data); setWizardStep(3); }}
                                isSaving={false} isSuccess={false}
                            />
                        )}
                    </div>
                )}

                {wizardStep === 3 && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-[#FDFDFF]">
                        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                            <div className="max-w-[640px] mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-right-8 duration-500">
                                
                                <div className="space-y-4">
                                    <h2 className="text-[32px] font-black text-slate-900 tracking-tight">Görünüm ve Ayarlar</h2>
                                    <p className="text-[16px] font-bold text-slate-500">Ürününüzün mağazada nasıl görüneceğini ve erişim ayarlarını belirleyin.</p>
                                </div>

                                <section className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5500ff] flex items-center justify-center"><Layout className="w-5 h-5"/></div>
                                        <h4 className="text-[18px] font-black text-slate-900">{t('dashboard.store.editors.general.style_selection')}</h4>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'button', label: t('dashboard.store.editors.general.style_button'), icon: MousePointer2 },
                                            { id: 'callout', label: t('dashboard.store.editors.general.style_callout'), icon: MessageSquare },
                                            { id: 'preview', label: t('dashboard.store.editors.general.style_preview'), icon: Eye }
                                        ].map((style) => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateData('thumbnail_style', style.id)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center py-6 rounded-2xl border-2 transition-all gap-3 bg-white",
                                                    formData.thumbnail_style === style.id
                                                        ? "border-[#5500ff] text-[#5500ff] shadow-lg shadow-indigo-500/10"
                                                        : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                                    formData.thumbnail_style === style.id ? "bg-[#5500ff] text-white" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <style.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[13px] font-black">{style.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5500ff] flex items-center justify-center"><Eye className="w-5 h-5"/></div>
                                        <h4 className="text-[18px] font-black text-slate-900">{t('dashboard.store.editors.general.visibility')}</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <label className={cn(
                                            "flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                            formData.visibility === 'public' ? "border-[#5500ff] bg-indigo-50/30" : "border-slate-100 hover:border-slate-200 bg-white"
                                        )}>
                                            <input type="radio" checked={formData.visibility === 'public'} onChange={() => updateData('visibility', 'public')} className="sr-only" />
                                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4", formData.visibility === 'public' ? "border-[#5500ff]" : "border-slate-300")}>
                                                {formData.visibility === 'public' && <div className="w-3 h-3 rounded-full bg-[#5500ff]" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-[15px] font-black text-slate-900">{t('dashboard.store.editors.general.public')}</span>
                                                <span className="block text-[13px] font-bold text-slate-500 mt-1">{t('dashboard.store.editors.general.public_desc')}</span>
                                            </div>
                                        </label>
                                        <label className={cn(
                                            "flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all",
                                            formData.visibility === 'hidden' ? "border-[#5500ff] bg-indigo-50/30" : "border-slate-100 hover:border-slate-200 bg-white"
                                        )}>
                                            <input type="radio" checked={formData.visibility === 'hidden'} onChange={() => updateData('visibility', 'hidden')} className="sr-only" />
                                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4", formData.visibility === 'hidden' ? "border-[#5500ff]" : "border-slate-300")}>
                                                {formData.visibility === 'hidden' && <div className="w-3 h-3 rounded-full bg-[#5500ff]" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className="block text-[15px] font-black text-slate-900">{t('dashboard.store.editors.general.hidden')}</span>
                                                <span className="block text-[13px] font-bold text-slate-500 mt-1">{t('dashboard.store.editors.general.hidden_desc')}</span>
                                            </div>
                                        </label>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 bg-white p-6 shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                            <div className="max-w-[640px] mx-auto flex items-center justify-between">
                                <button onClick={() => setWizardStep(2)} className="h-14 px-8 rounded-2xl text-[15px] font-black text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <ChevronLeft className="w-5 h-5"/> Geri
                                </button>
                                <button onClick={() => setWizardStep(4)} className="h-14 px-10 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white text-[15px] font-black shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 active:scale-95">
                                    İleri: Yayınla <ChevronRight className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {wizardStep === 4 && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                        <div className="flex-1 overflow-y-auto px-4 py-12 flex flex-col items-center justify-center">
                            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="w-20 h-20 bg-[#C4FF00] rounded-full mx-auto flex items-center justify-center shadow-xl shadow-[#C4FF00]/20 mb-6">
                                    <Sparkles className="w-10 h-10 text-[#5500ff]"/>
                                </div>
                                <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-none mb-3">Neredeyse Hazır! 🚀</h2>
                                <p className="text-[18px] font-bold text-slate-500">Ürününüz son haliyle vitrinde böyle görünecek.</p>
                            </div>

                            <div className="w-full max-w-[340px] h-[640px] bg-[#111111] rounded-[3rem] p-2 border border-slate-200 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700 delay-100">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50 pointer-events-none"></div>
                                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden overflow-y-auto custom-scrollbar relative">
                                    <LiveCardPreview 
                                        data={{
                                            ...formData,
                                            ...checkoutDataState, 
                                            title: checkoutDataState?.title || formData.title || 'Başlık',
                                            price: checkoutDataState?.price !== undefined ? checkoutDataState.price : (parseFloat(formData.price) || 0),
                                            type: productType.id
                                        }} 
                                        icon={productType.icon}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 bg-white p-6 shrink-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                            <div className="max-w-[640px] mx-auto flex items-center justify-between">
                                <button onClick={() => setWizardStep(3)} disabled={loading || isSuccess} className="h-14 px-8 rounded-2xl text-[15px] font-black text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2">
                                    <ChevronLeft className="w-5 h-5"/> Geri
                                </button>
                                <Button 
                                    onClick={() => handleSubmit(checkoutDataState)}
                                    disabled={loading || isSuccess}
                                    className="h-16 px-12 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white text-[18px] font-black shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 active:scale-95"
                                >
                                    {isSuccess ? (
                                        <><Check className="w-6 h-6 text-[#C4FF00]" /> {editingProduct ? 'Güncellendi!' : 'Yayında! 🎉'}</>
                                    ) : loading ? (
                                        <><Loader2 className="w-6 h-6 animate-spin" /> Kaydediliyor...</>
                                    ) : (
                                        <>🚀 {editingProduct ? 'Değişiklikleri Kaydet' : 'Şimdi Yayınla'}</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
