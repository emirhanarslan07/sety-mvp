'use client';

import { useState } from 'react';
import {
    X,
    Upload,
    Link as LinkIcon,
    DollarSign,
    Type,
    AlignLeft,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/context';

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
        if (externalCheckoutUrl && !externalCheckoutUrl.startsWith('https://')) {
            setError('Ödeme linki https:// ile başlamalıdır.');
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
                        type: productType.title.toLowerCase().replace(/\s+/g, '_'),
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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-[550px] bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", productType.color)}>
                            <productType.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 tracking-tight leading-none">
                                {t('store.add_product')} {productType.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">Mağazanda anında yayınlanacak.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Section 1: Temel Bilgiler */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-[11px] font-bold flex items-center justify-center text-slate-500">1</span>
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Temel Bilgiler</h4>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-slate-600 ml-1">Ürün Başlığı</label>
                            <Input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: Masterclass Video Seti"
                                className="h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-[#5500ff]/10 focus-visible:border-[#5500ff] font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-slate-600 ml-1">Açıklama</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ürününüz hakkında kısa bir bilgi..."
                                className="min-h-[100px] rounded-xl border-slate-200 bg-white focus-visible:ring-[#5500ff]/10 focus-visible:border-[#5500ff] font-medium resize-none text-sm leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Section 2: Fiyat & Ödeme */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-[11px] font-bold flex items-center justify-center text-slate-500">2</span>
                            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Fiyat & Ödeme</h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-slate-600 ml-1">Fiyat</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-[#5500ff]/10 focus-visible:border-[#5500ff] font-semibold text-sm"
                                    />
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="h-11 w-24 rounded-xl border border-slate-200 bg-white focus:border-[#5500ff] focus:outline-none px-3 font-semibold text-xs"
                                    >
                                        <option value="TRY">TRY</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-slate-600 ml-1">Ödeme Sağlayıcı</label>
                                <select
                                    value={checkoutProvider}
                                    onChange={(e) => setCheckoutProvider(e.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white focus:border-[#5500ff] focus:outline-none px-4 font-semibold text-xs"
                                >
                                    <option value="manual">Sety Manual</option>
                                    <option value="shopier">Shopier</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="iyzico">iyzico</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-slate-600 ml-1">Ödeme Sayfası Linki</label>
                            <Input
                                required={checkoutProvider !== 'manual'}
                                value={externalCheckoutUrl}
                                onChange={(e) => setExternalCheckoutUrl(e.target.value)}
                                placeholder="https://..."
                                className="h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-[#5500ff]/10 focus-visible:border-[#5500ff] font-medium text-sm"
                            />
                            <p className="text-[11px] text-slate-400 font-medium ml-1">Kendi ödeme altyapınızın (Shopier vb.) linkini yapıştırın.</p>
                        </div>
                    </div>

                    {error && <p className="text-rose-500 text-[13px] font-medium text-center">{error}</p>}

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl text-slate-500 font-semibold"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] h-12 rounded-xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-semibold shadow-sm shadow-[#5500ff]/10 border-none transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('store.add_product')}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
