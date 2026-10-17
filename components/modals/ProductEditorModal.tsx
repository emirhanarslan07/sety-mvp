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
    product?: any;
    defaultType?: any;
}

const CURRENCIES = [
    { value: 'USD', label: '$ USD — US Dollar' },
    { value: 'EUR', label: '€ EUR — Euro' },
    { value: 'GBP', label: '£ GBP — British Pound' },
    { value: 'TRY', label: '₺ TRY — Turkish Lira' },
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
    editingProduct: passedEditingProduct = null,
    product = null,
    defaultType = null,
}: ProductEditorModalProps) {
    const { showToast } = useToast();
    const editingProduct = passedEditingProduct || product;
    const resolvedProductType = initialProductType || defaultType;

    // Determine starting step: if productType already given (edit flow), skip step 1
    const [step, setStep] = useState<1 | 2>(resolvedProductType || editingProduct ? 2 : 1);
    const [selectedType, setSelectedType] = useState<any>(resolvedProductType || null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    // Form state
    const [title, setTitle] = useState(editingProduct?.title || '');
    const [description, setDescription] = useState(editingProduct?.description || '');
    const [price, setPrice] = useState(editingProduct?.price?.toString() || '');
    const [currency, setCurrency] = useState(editingProduct?.currency || 'USD');
    const [checkoutUrl, setCheckoutUrl] = useState(editingProduct?.external_checkout_url || '');
    const [imageUrl, setImageUrl] = useState(editingProduct?.image_url || '');

    // Coaching / Consultation specific state
    const [coachingOnline, setCoachingOnline] = useState(editingProduct?.coaching_config?.allow_online ?? true);
    const [coachingInPerson, setCoachingInPerson] = useState(editingProduct?.coaching_config?.allow_in_person ?? false);
    const [coachingLocation, setCoachingLocation] = useState(editingProduct?.coaching_config?.location_address || '');
    const [coachingDuration, setCoachingDuration] = useState<number>(editingProduct?.coaching_config?.duration_minutes || 60);
    const [coachingHidePrice, setCoachingHidePrice] = useState(editingProduct?.coaching_config?.hide_price ?? false);
    const [coachingPaymentMode, setCoachingPaymentMode] = useState<'request_only' | 'pay_now'>(editingProduct?.coaching_config?.payment_mode || 'request_only');

    useEffect(() => {
        if (editingProduct && !selectedType) {
            const types = getProductTypes((k) => k);
            const found = types.find((t) => t.id === editingProduct.type);
            setSelectedType(found || types[0]);
        }
        if (editingProduct?.coaching_config) {
            setCoachingOnline(editingProduct.coaching_config.allow_online ?? true);
            setCoachingInPerson(editingProduct.coaching_config.allow_in_person ?? false);
            setCoachingLocation(editingProduct.coaching_config.location_address || '');
            setCoachingDuration(editingProduct.coaching_config.duration_minutes || 60);
            setCoachingHidePrice(editingProduct.coaching_config.hide_price ?? false);
            setCoachingPaymentMode(editingProduct.coaching_config.payment_mode || 'request_only');
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
                setCurrency('USD');
                setCheckoutUrl('');
                setImageUrl('');
                setCoachingOnline(true);
                setCoachingInPerson(false);
                setCoachingLocation('');
                setCoachingDuration(60);
                setCoachingHidePrice(false);
                setCoachingPaymentMode('request_only');
            }
        }
    }, [isOpen]);

    const productTypes = getProductTypes((key) => {
        const map: Record<string, string> = {
            'dashboard.store.product_types.digital_product.title': 'Digital Product',
            'dashboard.store.product_types.digital_product.desc': 'PDFs, e-books, templates, videos, courses — any digital file or content',
            'dashboard.store.product_types.coaching_call.title': '1:1 Coaching & Consultation',
            'dashboard.store.product_types.coaching_call.desc': 'Paid 1-on-1 calls, strategy sessions, or consulting',
            'dashboard.store.product_types.external_link.title': 'Direct Link',
            'dashboard.store.product_types.external_link.desc': 'Redirect to any URL — free resource, community, or affiliate link',
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
            if (!user) throw new Error('Session not found');
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/product-thumbnails/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
            setImageUrl(publicUrl);
            showToast('Image uploaded successfully.', 'success');
        } catch (err: any) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async () => {
        const isCoachingType = selectedType?.id === 'coaching_call';

        if (!title.trim()) {
            showToast('Please enter a product title.', 'error');
            return;
        }

        if (isCoachingType) {
            if (!coachingOnline && !coachingInPerson) {
                showToast('Please select at least one format (Online or In-person).', 'error');
                return;
            }
            if (coachingInPerson && !coachingLocation.trim()) {
                showToast('Please enter the location address for in-person sessions.', 'error');
                return;
            }
            if (coachingPaymentMode === 'pay_now' && !checkoutUrl.trim()) {
                showToast('Please enter your checkout payment link.', 'error');
                return;
            }
        } else if (!isLinkType && !checkoutUrl.trim()) {
            showToast('Please enter a checkout or download URL.', 'error');
            return;
        }

        if (isLinkType && !checkoutUrl.trim()) {
            showToast('Please enter a target URL.', 'error');
            return;
        }

        setLoading(true);
        setIsSuccess(false);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Session not found');

            const { data: storeData } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            if (!storeData) throw new Error('Store not found');

            const coachingConfig = isCoachingType ? {
                allow_online: coachingOnline,
                allow_in_person: coachingInPerson,
                location_address: coachingLocation.trim(),
                duration_minutes: coachingDuration,
                hide_price: coachingHidePrice,
                payment_mode: coachingPaymentMode,
            } : null;

            const payload: any = {
                user_id: user.id,
                store_id: storeData.id,
                title: title.trim(),
                description: description.trim(),
                price: coachingHidePrice ? 0 : (parseFloat(price) || 0),
                currency,
                type: selectedType?.id || 'digital_product',
                external_checkout_url: checkoutUrl.trim(),
                image_url: imageUrl,
                status: 'active',
                visibility: isLandingPage ? 'hidden' : 'public',
                thumbnail_style: 'callout',
                button_text: isCoachingType ? 'Book Session' : isLinkType ? 'Open Link' : 'Buy Now',
                coaching_config: coachingConfig,
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
            showToast(editingProduct ? 'Product updated! ✨' : 'Product published! ✨', 'success');
            await new Promise((r) => setTimeout(r, 800));
            onSuccess();
            onClose();
        } catch (err: any) {
            showToast(err.message || 'An error occurred.', 'error');
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
                            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
                                {step === 1
                                    ? 'Select Product Type'
                                    : editingProduct
                                        ? 'Edit Product'
                                        : selectedType?.id === 'digital_product'
                                            ? '📦 Digital Product'
                                            : selectedType?.id === 'coaching_call'
                                                ? '🎯 Coaching & Consultation'
                                                : '🔗 Link'
                                }
                            </h2>
                            {step === 2 && (
                                <p className="text-[13px] font-bold text-slate-400 mt-0.5">
                                    {isLinkType
                                        ? 'Enter title and destination URL.'
                                        : 'Fill in details and set your checkout link.'}
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
                                        <h4 className="text-[17px] font-bold text-slate-900 mb-1">{type.title}</h4>
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
                                <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                    Cover Image <span className="text-slate-300 font-bold normal-case tracking-normal">(optional)</span>
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
                                        <label className="cursor-pointer h-12 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[13px] flex items-center gap-2 transition-all active:scale-95">
                                            <Upload className="w-4 h-4" />
                                            {imageUploading ? 'Uploading...' : imageUrl ? 'Upload Custom Image' : 'Select Image'}
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
                                <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                    {isLinkType ? 'Link Title' : 'Product Title'} <span className="text-[#5500ff]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={isLinkType ? 'e.g. My Community' : selectedType?.id === 'coaching_call' ? 'e.g. 1-Hour Strategy Session' : 'e.g. 30-Day Growth Guide'}
                                    className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                    Description <span className="text-slate-300 font-bold normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what buyers or clients will get..."
                                    rows={3}
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all resize-none"
                                />
                            </div>

                            {/* COACHING CALL SPECIFIC FIELDS */}
                            {selectedType?.id === 'coaching_call' ? (
                                <div className="space-y-6 pt-2">
                                    {/* 1. Session Format */}
                                    <div className="space-y-3 p-5 rounded-2xl bg-indigo-50/50 border border-[#5500ff]/15">
                                        <label className="block text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                                            Session Format <span className="text-[#5500ff]">*</span>
                                        </label>
                                        <p className="text-[12px] text-slate-500 font-medium">
                                            Choose how you conduct this session.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                            <label className={cn(
                                                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white select-none",
                                                coachingOnline ? "border-[#5500ff] bg-indigo-50/30 text-[#5500ff]" : "border-slate-200 text-slate-700 hover:border-slate-300"
                                            )}>
                                                <input
                                                    type="checkbox"
                                                    checked={coachingOnline}
                                                    onChange={(e) => setCoachingOnline(e.target.checked)}
                                                    className="w-4 h-4 accent-[#5500ff] rounded"
                                                />
                                                <div>
                                                    <span className="text-[14px] font-bold block text-slate-900">🌐 Online Meeting</span>
                                                    <span className="text-[11px] text-slate-400 font-medium">Google Meet / Zoom</span>
                                                </div>
                                            </label>

                                            <label className={cn(
                                                "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all bg-white select-none",
                                                coachingInPerson ? "border-[#5500ff] bg-indigo-50/30 text-[#5500ff]" : "border-slate-200 text-slate-700 hover:border-slate-300"
                                            )}>
                                                <input
                                                    type="checkbox"
                                                    checked={coachingInPerson}
                                                    onChange={(e) => setCoachingInPerson(e.target.checked)}
                                                    className="w-4 h-4 accent-[#5500ff] rounded"
                                                />
                                                <div>
                                                    <span className="text-[14px] font-bold block text-slate-900">📍 In-Person Meeting</span>
                                                    <span className="text-[11px] text-slate-400 font-medium">Office / Studio</span>
                                                </div>
                                            </label>
                                        </div>

                                        {coachingInPerson && (
                                            <div className="mt-3 space-y-1.5 animate-in fade-in">
                                                <label className="block text-[12px] font-bold text-slate-700">
                                                    Office / Meeting Address <span className="text-[#5500ff]">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={coachingLocation}
                                                    onChange={(e) => setCoachingLocation(e.target.value)}
                                                    placeholder="e.g. 123 Main St, New York"
                                                    className="w-full h-12 px-4 bg-white rounded-xl border-2 border-slate-200 focus:border-[#5500ff] outline-none font-bold text-[14px] text-slate-900 transition-all placeholder:text-slate-400"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Session Duration */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                            Session Duration
                                        </label>
                                        <div className="grid grid-cols-4 gap-2.5">
                                            {[30, 45, 60, 90].map((mins) => (
                                                <button
                                                    type="button"
                                                    key={mins}
                                                    onClick={() => setCoachingDuration(mins)}
                                                    className={cn(
                                                        "h-12 rounded-xl font-bold text-[14px] border-2 transition-all",
                                                        coachingDuration === mins
                                                            ? "bg-[#5500ff] text-white border-[#5500ff] shadow-md shadow-indigo-500/20"
                                                            : "bg-slate-50 text-slate-700 border-transparent hover:border-slate-200"
                                                    )}
                                                >
                                                    {mins} min
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3. Pricing & Currency */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                                    Session Fee
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    disabled={coachingHidePrice}
                                                    value={coachingHidePrice ? '' : price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    placeholder={coachingHidePrice ? 'Hidden' : '99'}
                                                    className="w-full h-14 px-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all disabled:opacity-40"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                                    Currency
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

                                        {/* Hide Price Toggle */}
                                        <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={coachingHidePrice}
                                                onChange={(e) => setCoachingHidePrice(e.target.checked)}
                                                className="w-4 h-4 accent-[#5500ff] rounded"
                                            />
                                            <div className="flex-1">
                                                <span className="text-[13px] font-bold text-slate-900 block">Custom Quote / Free Initial Consultation</span>
                                                <span className="text-[11px] text-slate-400 font-medium">Hides price on store and displays &quot;Free Consultation / Request Quote&quot;.</span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* 4. Payment Flow */}
                                    <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
                                        <label className="block text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                                            Booking & Payment Mode
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCoachingPaymentMode('request_only')}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 text-left transition-all",
                                                    coachingPaymentMode === 'request_only'
                                                        ? "bg-white border-[#5500ff] shadow-md shadow-indigo-500/10 text-slate-900"
                                                        : "bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300"
                                                )}
                                            >
                                                <div className="text-[14px] font-black text-slate-900 mb-1 flex items-center gap-2">
                                                    <span>📋 Booking Request Only</span>
                                                    {coachingPaymentMode === 'request_only' && <span className="w-2 h-2 rounded-full bg-[#5500ff]" />}
                                                </div>
                                                <p className="text-[12px] text-slate-500 leading-snug">
                                                    Collect requests first. Clients submit details and booking appears in your appointments.
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setCoachingPaymentMode('pay_now')}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 text-left transition-all",
                                                    coachingPaymentMode === 'pay_now'
                                                        ? "bg-white border-[#5500ff] shadow-md shadow-indigo-500/10 text-slate-900"
                                                        : "bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300"
                                                )}
                                            >
                                                <div className="text-[14px] font-black text-slate-900 mb-1 flex items-center gap-2">
                                                    <span>💳 Direct Checkout</span>
                                                    {coachingPaymentMode === 'pay_now' && <span className="w-2 h-2 rounded-full bg-[#5500ff]" />}
                                                </div>
                                                <p className="text-[12px] text-slate-500 leading-snug">
                                                    Clients are directed to your checkout URL to pay when they book.
                                                </p>
                                            </button>
                                        </div>

                                        {coachingPaymentMode === 'pay_now' && (
                                            <div className="mt-3 space-y-1.5 animate-in fade-in">
                                                <label className="block text-[12px] font-bold text-slate-700">
                                                    Checkout Link <span className="text-[#5500ff]">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="url"
                                                        value={checkoutUrl}
                                                        onChange={(e) => setCheckoutUrl(e.target.value)}
                                                        placeholder="https://polar.sh/..."
                                                        className="w-full h-12 pl-11 pr-4 bg-white rounded-xl border-2 border-slate-200 focus:border-[#5500ff] outline-none font-bold text-[14px] text-slate-900 transition-all placeholder:text-slate-400"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Standard Price + Currency */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                                Price {!isLinkType && <span className="text-[#5500ff]">*</span>}
                                                {isLinkType && <span className="text-slate-300 font-bold normal-case tracking-normal">(optional)</span>}
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
                                            <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                                Currency
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
                                        <label className="block text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                                            {isLinkType ? 'Target URL' : 'Checkout Link'} <span className="text-[#5500ff]">*</span>
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
                                                    Customers clicking &quot;Buy&quot; will be redirected to this checkout link.
                                                    <strong className="text-slate-700 block mt-1">You can connect Polar, Stripe, Lemon Squeezy, or your custom checkout.</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-4">
                        <button
                            onClick={onClose}
                            className="h-13 px-8 rounded-2xl text-[15px] font-bold text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || isSuccess || imageUploading}
                            className="flex-1 h-14 max-w-[280px] rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-bold text-[16px] shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
                        >
                            {isSuccess ? (
                                <><Check className="w-5 h-5 text-[#C4FF00]" /> {editingProduct ? 'Updated!' : 'Live! 🎉'}</>
                            ) : loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                            ) : (
                                editingProduct ? 'Save Changes' : '🚀 Publish'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
