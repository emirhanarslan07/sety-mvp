'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n';
import { Building, CreditCard, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSettingsPage() {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        default_provider: 'paddle' as 'paddle' | 'paypal' | 'bank' | 'other' | null,
        paddle_checkout_url: '',
        paypal_me_username: '',
        bank_iban: '',
        bank_account_holder: '',
        bank_transfer_instructions: '',
        other_payment_instructions: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/payment');
                const json = await res.json();
                if (json.data) {
                    setFormData({
                        default_provider: json.data.default_provider || 'paddle',
                        paddle_checkout_url: json.data.paddle_checkout_url || '',
                        paypal_me_username: json.data.paypal_me_username || '',
                        bank_iban: json.data.bank_iban || '',
                        bank_account_holder: json.data.bank_account_holder || '',
                        bank_transfer_instructions: json.data.bank_transfer_instructions || '',
                        other_payment_instructions: json.data.other_payment_instructions || ''
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Validation
        if (formData.default_provider === 'bank') {
            if (!formData.bank_iban || !formData.bank_iban.startsWith('TR') || formData.bank_iban.length < 26) {
                showToast('Geçerli bir TR IBAN giriniz (TR ile başlamalı ve 26 karakter olmalı).', 'error');
                return;
            }
        }
        if (formData.default_provider === 'paddle' && !formData.paddle_checkout_url) {
            showToast('Lütfen Paddle Checkout URL giriniz.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            showToast('Ödeme ayarları başarıyla kaydedildi.', 'success');
        } catch (err: any) {
            showToast(err.message || 'Hata oluştu.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8">Yükleniyor...</div>;
    }

    const providers = [
        { id: 'paddle', title: 'Paddle', icon: LinkIcon, desc: 'Global kart ödemeleri için ideal' },
        { id: 'paypal', title: 'PayPal', icon: CreditCard, desc: 'PayPal.Me linki ile ödeme alma' },
        { id: 'bank', title: 'Banka Havalesi', icon: Building, desc: 'TR içi havale / EFT' },
        { id: 'other', title: 'Diğer', icon: LinkIcon, desc: 'Kripto, Shopier vb. özel linkler' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ödeme Ayarları</h1>
                <p className="text-slate-500 mt-2 font-medium">Müşterilerinizin ödemelerini nasıl alacağınızı ayarlayın</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Varsayılan Ödeme Yöntemi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {providers.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleChange('default_provider', p.id)}
                                className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${formData.default_provider === p.id ? 'border-[#5500ff] bg-[#5500ff]/5' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${formData.default_provider === p.id ? 'bg-[#5500ff] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <p.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`font-bold ${formData.default_provider === p.id ? 'text-[#5500ff]' : 'text-slate-700'}`}>{p.title}</p>
                                    <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                    {formData.default_provider === 'paddle' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">Paddle Ayarları</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Product/Checkout Linki</label>
                                <input
                                    type="url"
                                    value={formData.paddle_checkout_url}
                                    onChange={e => handleChange('paddle_checkout_url', e.target.value)}
                                    placeholder="https://checkout.paddle.com/..."
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#5500ff] outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {formData.default_provider === 'paypal' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">PayPal Ayarları</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">PayPal.Me Kullanıcı Adı</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                                        paypal.me/
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.paypal_me_username}
                                        onChange={e => handleChange('paypal_me_username', e.target.value)}
                                        placeholder="username"
                                        className="flex-1 h-12 px-4 rounded-r-xl border border-slate-200 focus:border-[#5500ff] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.default_provider === 'bank' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">Banka Ayarları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">IBAN</label>
                                    <input
                                        type="text"
                                        value={formData.bank_iban}
                                        onChange={e => handleChange('bank_iban', e.target.value)}
                                        placeholder="TR00 1234 5678 ..."
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#5500ff] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Hesap Sahibi</label>
                                    <input
                                        type="text"
                                        value={formData.bank_account_holder}
                                        onChange={e => handleChange('bank_account_holder', e.target.value)}
                                        placeholder="Ad Soyad"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#5500ff] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Ek Talimatlar (İsteğe bağlı)</label>
                                <textarea
                                    value={formData.bank_transfer_instructions}
                                    onChange={e => handleChange('bank_transfer_instructions', e.target.value)}
                                    placeholder="Açıklama kısmına sipariş numarasını yazmayı unutmayın."
                                    className="w-full h-24 p-4 rounded-xl border border-slate-200 focus:border-[#5500ff] outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {formData.default_provider === 'other' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">Diğer Ödeme Ayarları</h3>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Ödeme Linki veya Talimat</label>
                                <textarea
                                    value={formData.other_payment_instructions}
                                    onChange={e => handleChange('other_payment_instructions', e.target.value)}
                                    placeholder="Örn: shopier.com/linkiniz veya Bitcoin cüzdan adresi"
                                    className="w-full h-24 p-4 rounded-xl border border-slate-200 focus:border-[#5500ff] outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#5500ff]/5 border border-[#5500ff]/10 rounded-3xl p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-[#5500ff] shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-[#5500ff]">Önemli Bilgi</h4>
                    <p className="text-[#5500ff]/80 text-sm mt-1">
                        Ürün ekleme sırasında bu ayarlar varsayılan olarak kullanılır. İsterseniz her ürün için farklı link de girebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black shadow-xl shadow-[#5500ff]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>
        </div>
    );
}
