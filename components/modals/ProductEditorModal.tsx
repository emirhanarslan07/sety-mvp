'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import {
    X,
    ChevronLeft,
    Loader2,
    Check,
    Package,
    Target,
    Link2,
    Upload,
    Image as ImageLucide,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getProductTypes } from '@/components/dashboard/store/StorePreview';

interface ProductEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType?: any;
    onSuccess: () => void;
    isLandingPage?: boolean;
    editingProduct?: any;
}

const CURRENCIES = [
    { value: 'TRY', label: '₺ TRY — Türk Lirası' },
    { value: 'USD', label: '$ USD — Amerikan Doları' },
    { value: 'EUR', label: '€ EUR — Euro' },
    { value: 'GBP', label: '£ GBP — İngiliz Sterlini' },
];

const DEFAULT_COVERS: Record<string, string[]> = {
    digital_product: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2629&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop',
    ],
    coaching_call: [
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2574&auto=format&fit=crop',
    ],
    external_link: [
        'https://images.unsplash.com/photo-1512758684065-94ed158f5612?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=2673&auto=format&fit=crop',
    ]
};

export default function ProductEditorModal({
    isOpen,
    onClose,
    productType: initialProductType,
    onSuccess,
    isLandingPage = false,
    editingProduct = null,
}: ProductEditorModalProps) {
    const { showToast } = useToast();

    // Determine starting step: if productType already given (edit flow), skip step 1
    const [step, setStep] = useState<1 | 2>(initialProductType || editingProduct ? 2 : 1);
    const [selectedType, setSelectedType] = useState<any>(initialProductType || null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState(editingProduct?.title || '');
    const [description, setDescription] = useState(editingProduct?.description || '');
    const [price, setPrice] = useState(editingProduct?.price?.toString() || '');
    const [currency, setCurrency] = useState(editingProduct?.currency || 'TRY');
    const [checkoutUrl, setCheckoutUrl] = useState(editingProduct?.external_checkout_url || '');
    const [imageUrl, setImageUrl] = useState(editingProduct?.image_url || '');

    useEffect(() => {
        if (editingProduct && !selectedType) {
            const types = getProductTypes((k) => k);
            const found = types.find((t) => t.id === editingProduct.type);
            setSelectedType(found || types[0]);
        }
    }, [editingProduct]);

    // Set default cover image when opening new product step 2
    useEffect(() => {
        if (step === 2 && !editingProduct && selectedType && !imageUrl) {
            const defaults = DEFAULT_COVERS[selectedType.id] || DEFAULT_COVERS['digital_product'];
            setImageUrl(defaults[0]);
        }
    }, [step, selectedType, editingProduct]);

    // Reset when closed
    useEffect(() => {
        if (!isOpen) {
            setStep(initialProductType || editingProduct ? 2 : 1);
            setSelectedType(initialProductType || null);
            setIsSuccess(false);
            if (!editingProduct) {
                setTitle('');
                setDescription('');
                setPrice('');
                setCurrency('TRY');
                setCheckoutUrl('');
                setImageUrl('');
            }
        }
    }, [isOpen]);

    const productTypes = getProductTypes((key) => {
        const map: Record<string, string> = {
            'dashboard.store.product_types.digital_product.title': 'Dijital Ürün',
            'dashboard.store.product_types.digital_product.desc': 'PDF, e-kitap, şablon, video, kurs — her türlü dijital dosya veya içerik',
            'dashboard.store.product_types.coaching_call.title': 'Koçluk / Görüşme',
            'dashboard.store.product_types.coaching_call.desc': 'Birebir ücretli görüşme veya koçluk seansı',
            'dashboard.store.product_types.external_link.title': 'Link',
            'dashboard.store.product_types.external_link.desc': 'Herhangi bir URL\'ye yönlendirme — ücretsiz veya ücretli',
        };
        return map[key] || key;
    });

    const isLinkType = selectedType?.id === 'external_link';

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/product-thumbnails/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
            setImageUrl(publicUrl);
            showToast('Görsel yüklendi.', 'success');
        } catch (err: any) {
            showToast(`Hata: ${err.message}`, 'error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            showToast('Lütfen bir başlık girin.', 'error');
            return;
        }
        if (!isLinkType && !checkoutUrl.trim()) {
            showToast('Lütfen ödeme/yönlendirme linkini girin.', 'error');
            return;
        }
        if (isLinkType && !checkoutUrl.trim()) {
            showToast('Lütfen bir URL girin.', 'error');
            return;
        }

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

            const payload = {
                user_id: user.id,
                store_id: storeData.id,
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price) || 0,
                currency,
                type: selectedType?.id || 'digital_product',
                external_checkout_url: checkoutUrl.trim(),
                image_url: imageUrl,
                status: 'active',
                visibility: isLandingPage ? 'hidden' : 'public',
                thumbnail_style: 'callout',
                button_text: 'Hemen Al',
            };

            let error;
            if (editingProduct?.id) {
                const { error: e } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
                error = e;
            } else {
                const { error: e } = await supabase.from('products').insert([payload]);
                error = e;
            }
            if (error) throw error;

            setIsSuccess(true);
            showToast(editingProduct ? 'Ürün güncellendi! ✨' : 'Ürün yayınlandı! ✨', 'success');
            await new Promise((r) => setTimeout(r, 800));
            onSuccess();
            onClose();
        } catch (err: any) {
            showToast(err.message || 'Bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-6 shrink-0">
                    <div className="flex items-center gap-4">
                        {step === 2 && !editingProduct && (
                            <button
                                onClick={() => { setStep(1); setSelectedType(null); }}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all text-slate-600"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-[22px] font-black text-slate-900 tracking-tight">
                                {step === 1
                                    ? 'Ürün Tipi Seç'
                                    : editingProduct
                                        ? 'Ürünü Düzenle'
                                        : selectedType?.id === 'digital_product'
                                            ? '📦 Dijital Ürün'
                                            : selectedType?.id === 'coaching_call'
                                                ? '🎯 Koçluk / Görüşme'
                                                : '🔗 Link'
                                }
                            </h2>
                            {step === 2 && (
                                <p className="text-[13px] font-bold text-slate-400 mt-0.5">
                                    {isLinkType
                                        ? 'URL ve başlık girin.'
                                        : 'Bilgileri doldurun, ödeme linkini girin.'}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Step Indicator */}
                {!editingProduct && (
                    <div className="flex items-center gap-2 px-8 pb-6 shrink-0">
                        <div className={cn("h-1.5 rounded-full flex-1 transition-all", step >= 1 ? "bg-[#5500ff]" : "bg-slate-100")} />
                        <div className={cn("h-1.5 rounded-full flex-1 transition-all", step >= 2 ? "bg-[#5500ff]" : "bg-slate-100")} />
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">

                    {/* STEP 1: Type Selection */}
                    {step === 1 && (
                        <div className="px-8 pb-8 grid gap-4">
                            {productTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => { setSelectedType(type); setStep(2); }}
                                    className="w-full flex items-center gap-6 p-6 rounded-[28px] bg-slate-50 hover:bg-indigo-50/60 border-2 border-transparent hover:border-[#5500ff]/10 transition-all text-left group active:scale-[0.99]"
                                >
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                                        type.color
                                    )}>
                                        <type.icon className="w-8 h-8" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[17px] font-black text-slate-900 mb-1">{type.title}</h4>
                                        <p className="text-[13px] font-bold text-slate-400 leading-snug">{type.description}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-[#5500ff] group-hover:bg-[#5500ff] flex items-center justify-center transition-all shrink-0">
                                        <ChevronLeft className="w-4 h-4 rotate-180 text-slate-300 group-hover:text-white transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: Form */}
                    {step === 2 && (
                        <div className="px-8 pb-8 space-y-6">

                            {/* Image Upload & Gallery */}
                            <div className="space-y-3">
                                <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                    Kapak Görseli <span className="text-slate-300 font-bold normal-case tracking-normal">(opsiyonel)</span>
                                </label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-[20px] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative">
                                            {imageUrl ? (
                                                <Image src={imageUrl} alt="" fill className="object-cover" sizes="80px" />
                                            ) : (
                                                <ImageLucide className="w-8 h-8 text-slate-300" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer h-12 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-[13px] flex items-center gap-2 transition-all active:scale-95">
                                            <Upload className="w-4 h-4" />
                                            {imageUploading ? 'Yükleniyor...' : imageUrl ? 'Özel Görsel Yükle' : 'Görsel Seç'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={imageUploading} />
                                        </label>
                                    </div>
                                    
                                    {/* Default covers gallery */}
                                    {selectedType && (
                                        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                            {(DEFAULT_COVERS[selectedType.id] || DEFAULT_COVERS['digital_product']).map((cover, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setImageUrl(cover)}
                                                    className={cn(
                                                        "relative w-16 h-16 rounded-[14px] overflow-hidden shrink-0 transition-all border-2",
                                                        imageUrl === cover ? "border-[#5500ff] shadow-md shadow-indigo-500/20" : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-300"
                                                    )}
                                                >
                                                    <Image src={cover} alt="" fill className="object-cover" sizes="64px" />
                                                    {imageUrl === cover && (
                                                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#5500ff] rounded-full flex items-center justify-center z-10 shadow-sm">
                                                            <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                    {isLinkType ? 'Bağlantı Başlığı' : 'Ürün Adı'} <span className="text-[#5500ff]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={isLinkType ? 'örn: Telegram Grubum' : selectedType?.id === 'coaching_call' ? 'örn: 1 Saatlik Danışmanlık' : 'örn: 30 Günlük Beslenme Planı'}
                                    className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                    Açıklama <span className="text-slate-300 font-bold normal-case tracking-normal">(opsiyonel)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ürününüzü kısaca açıklayın..."
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all resize-none"
                                />
                            </div>

                            {/* Price + Currency */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                        Fiyat {!isLinkType && <span className="text-[#5500ff]">*</span>}
                                        {isLinkType && <span className="text-slate-300 font-bold normal-case tracking-normal">(opsiyonel)</span>}
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0"
                                        className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                        Para Birimi
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[14px] text-slate-900 transition-all appearance-none cursor-pointer"
                                    >
                                        {CURRENCIES.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Checkout / Link URL */}
                            <div className="space-y-2">
                                <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                                    {isLinkType ? 'Yönlendirme URL\'si' : 'Ödeme Linki'} <span className="text-[#5500ff]">*</span>
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="url"
                                        value={checkoutUrl}
                                        onChange={(e) => setCheckoutUrl(e.target.value)}
                                        placeholder="https://"
                                        className="w-full h-14 pl-12 pr-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                    />
                                </div>
                                {!isLinkType && (
                                    <div className="mt-3 flex items-start gap-3 p-4 rounded-xl bg-slate-100/50 border border-slate-200/50">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                                            <Link2 className="w-4 h-4 text-[#5500ff]" />
                                        </div>
                                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                            Müşterileriniz satın al dediklerinde bu linke yönlendirilecek.
                                            <strong className="text-slate-700 block mt-1">Iyzico, Shopier, Stripe, Calendly veya WhatsApp linki ekleyebilirsiniz.</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-4">
                        <button
                            onClick={onClose}
                            className="h-13 px-8 rounded-2xl text-[15px] font-black text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || isSuccess || imageUploading}
                            className="flex-1 h-14 max-w-[280px] rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[16px] shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
                        >
                            {isSuccess ? (
                                <><Check className="w-5 h-5 text-[#C4FF00]" /> {editingProduct ? 'Güncellendi!' : 'Yayında! 🎉'}</>
                            ) : loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Kaydediliyor...</>
                            ) : (
                                editingProduct ? 'Değişiklikleri Kaydet' : '🚀 Yayınla'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
