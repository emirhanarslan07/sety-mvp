'use client';

import { useState } from 'react';
import {
    X,
    Upload,
    Link as LinkIcon,
    DollarSign,
    Type,
    AlignLeft,
    Loader2,
    Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/context';
import { PremiumInput } from '@/components/ui/PremiumInput';

interface CreateProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType: any;
    onSuccess: () => void;
}

export default function CreateProductModal({ isOpen, onClose, productType, onSuccess }: CreateProductModalProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [externalCheckoutUrl, setExternalCheckoutUrl] = useState('');
    const [checkoutProvider, setCheckoutProvider] = useState('manual');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic Validation
        if (checkoutProvider !== 'manual' && externalCheckoutUrl && !externalCheckoutUrl.startsWith('https://')) {
            setError(t('dashboard.store.errors.https_required') || 'URL must start with https://');
            setLoading(false);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error(t('common.error'));

            // Fetch the current user's store
            const { data: storeData } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!storeData) throw new Error('Store not found. Please complete onboarding.');

            const { error: insertError } = await supabase
                .from('products')
                .insert([
                    {
                        user_id: user.id,
                        store_id: storeData.id,
                        title,
                        description,
                        price: parseFloat(price) || 0,
                        currency,
                        type: productType.id,
                        external_checkout_url: externalCheckoutUrl,
                        checkout_provider: checkoutProvider,
                        status: 'active'
                    }
                ]);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setPrice('');
            setExternalCheckoutUrl('');
        } catch (err: any) {
            setError(err.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[600px] bg-white rounded-[44px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] overflow-hidden max-h-[92vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-10">
                    <div className="flex items-center gap-5">
                        <div className={cn("w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg", productType.color)}>
                            <productType.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">
                                {t(`dashboard.store.product_types.${productType.id}.title`) || productType.title}
                            </h3>
                            <p className="text-[13px] text-slate-400 font-bold mt-2 uppercase tracking-widest opacity-70">
                                {t('dashboard.store.states.add_product_subtitle') || "Saniyeler içinde mağazana ekle"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-full transition-all text-slate-300 hover:text-slate-900 active:scale-90">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-12">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Section 1: Temel Bilgiler */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white text-[14px] font-black flex items-center justify-center">1</div>
                                <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">{t('dashboard.store.sections.basic_info') || 'Temel Bilgiler'}</h4>
                            </div>

                            <div className="space-y-8">
                                <PremiumInput
                                    label={t('dashboard.store.sections.product_title') || "Ürün Başlığı"}
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t('dashboard.store.placeholders.product_title_example') || "Örn: Masterclass Video Seti"}
                                    icon={<Type className="w-5 h-5" />}
                                />

                                <div className="space-y-3">
                                    <label className="text-[14px] font-black text-slate-900/40 uppercase tracking-[0.1em] ml-1">{t('dashboard.store.sections.description') || "Açıklama"}</label>
                                    <div className="relative group">
                                        <div className="absolute left-6 top-5 text-slate-400 group-focus-within:text-[#5500ff] transition-colors">
                                            <AlignLeft className="w-5 h-5" />
                                        </div>
                                        <Textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder={t('dashboard.store.placeholders.product_desc') || "Ürününüz hakkında kısa bir bilgi..."}
                                            className="min-h-[120px] pl-16 pr-6 py-5 rounded-[28px] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#5500ff] transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-bold resize-none shadow-none outline-none ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Fiyat & Ödeme */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white text-[14px] font-black flex items-center justify-center">2</div>
                                <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">{t('dashboard.store.sections.price_payment') || 'Fiyat & Ödeme'}</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[14px] font-black text-slate-900/40 uppercase tracking-[0.1em] ml-1">{t('dashboard.store.sections.price') || "Fiyat"}</label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1 group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5500ff] transition-colors">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <Input
                                                type="number"
                                                required
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="h-16 pl-16 pr-6 rounded-[24px] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#5500ff] transition-all font-black text-slate-900 placeholder:text-slate-300 shadow-none outline-none ring-0"
                                            />
                                        </div>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="h-16 w-28 rounded-[24px] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#5500ff] focus:outline-none px-4 font-black text-slate-900 transition-all cursor-pointer"
                                        >
                                            <option value="TRY">TRY</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[14px] font-black text-slate-900/40 uppercase tracking-[0.1em] ml-1">{t('dashboard.store.sections.checkout_provider') || "Ödeme Sağlayıcı"}</label>
                                    <select
                                        value={checkoutProvider}
                                        onChange={(e) => setCheckoutProvider(e.target.value)}
                                        className="h-16 w-full rounded-[24px] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-[#5500ff] focus:outline-none px-6 font-black text-slate-900 transition-all cursor-pointer"
                                    >
                                        <option value="manual">Sety Manual (%0 Fee)</option>
                                        <option value="shopier">Shopier</option>
                                        <option value="stripe">Stripe</option>
                                        <option value="iyzico">iyzico</option>
                                    </select>
                                </div>
                            </div>

                            <PremiumInput
                                label={checkoutProvider === 'manual' ? (t('dashboard.store.sections.manual_payment_info') || "Ödeme Detayları (IBAN, USDT vb.)") : (t('dashboard.store.sections.checkout_link') || "Ödeme Sayfası Linki")}
                                required
                                value={externalCheckoutUrl}
                                onChange={(e) => setExternalCheckoutUrl(e.target.value)}
                                placeholder={checkoutProvider === 'manual' ? (t('dashboard.store.placeholders.payment_info') || "Örn: IBAN: TR00... veya USDT (TRC20): ...") : "https://..."}
                                icon={<LinkIcon className="w-5 h-5" />}
                                helperText={checkoutProvider === 'manual' 
                                    ? (t('dashboard.store.sections.manual_payment_desc') || "Müşterileriniz ödeme yapmak için bu bilgileri görecektir.")
                                    : (t('dashboard.store.sections.checkout_link_desc') || "Kendi ödeme altyapınızın (Shopier vb.) linkini yapıştırın.")}
                            />
                        </div>

                        {error && (
                            <div className="p-5 rounded-[24px] bg-rose-50 border-2 border-rose-100 text-rose-500 text-[14px] font-bold text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:flex-1 h-18 py-5 rounded-[28px] text-slate-400 font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:flex-[2] h-20 rounded-[32px] bg-slate-900 hover:bg-[#5500ff] text-white font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        {t('dashboard.store.actions.create_product') || "Ürünü Oluştur"}
                                        <Rocket className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
