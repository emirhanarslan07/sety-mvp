'use client';

import { useState } from 'react';
import {
    X,
    Lock,
    CreditCard,
    CheckCircle2,
    Loader2,
    ChevronRight,
    ShieldCheck,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/context/ToastContext';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    sellerId: string;
    storeId: string;
}

export default function CheckoutModal({ isOpen, onClose, product, sellerId, storeId }: CheckoutModalProps) {
    const { showToast } = useToast();
    const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePurchase = async () => {
        setLoading(true);
        try {
            // 1. Ensure customer exists or create one
            let customerId;
            const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('store_id', storeId)
                .eq('email', email.toLowerCase())
                .maybeSingle();

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                const { data: newCustomer, error: custError } = await supabase
                    .from('customers')
                    .insert([{
                        user_id: sellerId,
                        store_id: storeId,
                        name,
                        email: email.toLowerCase()
                    }])
                    .select()
                    .single();
                if (custError) throw custError;
                customerId = newCustomer.id;
            }

            // 2. Create order
            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: sellerId,
                    store_id: storeId,
                    product_id: product.id,
                    customer_id: customerId,
                    amount: product.price,
                    status: 'paid'
                }]);

            if (orderError) throw orderError;

            // Track Successful Purchase / Checkout Complete
            await supabase.from('analytics_events').insert([{
                user_id: sellerId,
                store_id: storeId,
                event_name: 'checkout_complete',
                product_id: product.id,
                visitor_id: localStorage.getItem('s_vid'),
                metadata: { amount: product.price, customer_email: email }
            }]);

            setStep('success');
        } catch (err) {
            console.error(err);
            showToast('Satın alma işlemi başarısız oldu.', 'error');
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
                className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 z-10">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 'info' && (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[#5500ff] font-black text-xs uppercase tracking-widest">
                                        <Globe className="w-4 h-4" /> Güvenli Ödeme
                                    </div>
                                    <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
                                        {product.title}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[24px] font-black text-slate-900">
                                            {product.price === 0 ? 'ÜCRETSİZ' : formatCurrency(product.price)}
                                        </span>
                                        <span className="text-slate-400 font-bold ml-1">KDV Dahil</span>
                                    </div>
                                </div>

                                <form onSubmit={handleNext} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                                        <Input
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-slate-900 focus:ring-2 focus:ring-[#5500ff]/5 focus:border-[#5500ff]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-black text-slate-500 uppercase tracking-wider ml-1">E-Posta</label>
                                        <Input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-slate-900 focus:ring-2 focus:ring-[#5500ff]/5 focus:border-[#5500ff]"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full h-16 rounded-[24px] bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[18px] mt-6 shadow-xl shadow-indigo-100 border-none transition-all active:scale-95 flex items-center justify-center gap-2">
                                        Ödemeye Geç <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </form>

                                <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-40">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                                </div>
                            </motion.div>
                        )}

                        {step === 'payment' && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Ödeme Simülasyonu</h2>
                                    <p className="text-slate-500 font-bold text-[20px]">{product.price === 0 ? '0.00' : formatCurrency(product.price)}</p>
                                </div>

                                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> Güvenli İşlem
                                        </span>
                                        <Lock className="w-4 h-4 text-slate-300" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                                            <CreditCard className="text-[#5500ff] w-6 h-6" />
                                            <span className="font-black text-slate-900 tracking-[0.3em] text-[15px]">•••• •••• •••• 4242</span>
                                            <div className="absolute top-0 right-0 h-full w-1.5 bg-[#5500ff]" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 text-center font-bold text-slate-400 text-sm">MM / YY</div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 text-center font-bold text-slate-400 text-sm">CVC</div>
                                        </div>
                                    </div>

                                    <p className="text-[12px] text-slate-400 text-center font-medium leading-relaxed italic">
                                        Bu bir simülasyon aşamasıdır. Herhangi bir kart bilgisi girmenize gerek yoktur. Sety üzerinde işlem güvenliği en üst düzeydedir.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handlePurchase}
                                        disabled={loading}
                                        className="w-full h-16 rounded-[24px] bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[18px] shadow-xl shadow-indigo-100 border-none transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Siparişi Tamamla'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setStep('info')}
                                        className="w-full h-12 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest"
                                    >
                                        Geri Dön
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8 py-6"
                            >
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 shadow-inner group">
                                    <CheckCircle2 className="w-12 h-12 transition-transform duration-700 group-hover:rotate-[360deg]" strokeWidth={3} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-[32px] font-black text-slate-900 tracking-tight">Harika! 🎉</h2>
                                    <p className="text-slate-500 font-medium px-4 text-[16px] leading-relaxed">
                                        Ödeme başarıyla alındı. {product.external_link ? 'Şimdi içeriğe erişebilirsiniz.' : 'İçerik bilgileri e-posta adresinize gönderilecektir.'}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    {product.external_link && (
                                        <Button
                                            onClick={() => window.location.href = product.external_link}
                                            className="w-full h-16 rounded-[24px] bg-slate-900 hover:bg-slate-800 text-white font-black text-[18px] shadow-lg"
                                        >
                                            İçeriği Gör
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        className="w-full h-14 rounded-2xl text-slate-400 font-bold text-sm uppercase tracking-widest hover:bg-slate-50"
                                    >
                                        Mağazaya Dön
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
