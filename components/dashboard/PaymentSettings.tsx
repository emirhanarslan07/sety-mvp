'use client';

import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Globe,
    Shield,
    Zap,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    ChevronDown,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const PROVIDERS = [
    {
        id: 'iyzico',
        name: 'Iyzico',
        region: 'Türkiye',
        icon: '🇹🇷',
        color: '#00AFF0',
        fields: [
            { id: 'apiKey', label: 'API Key', placeholder: 'sandbox-vG...' },
            { id: 'secretKey', label: 'Secret Key', placeholder: 'sandbox-...' }
        ]
    },
    {
        id: 'paytr',
        name: 'PayTR',
        region: 'Türkiye',
        icon: '🇹🇷',
        color: '#FF4C00',
        fields: [
            { id: 'merchantId', label: 'Merchant ID', placeholder: '123456' },
            { id: 'merchantKey', label: 'Merchant Key', placeholder: 'key...' },
            { id: 'merchantSalt', label: 'Merchant Salt', placeholder: 'salt...' }
        ]
    },
    {
        id: 'stripe',
        name: 'Stripe',
        region: 'Global',
        icon: '🌎',
        color: '#635BFF',
        fields: [
            { id: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_...' },
            { id: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...' }
        ]
    },
    {
        id: 'lemon_squeezy',
        name: 'Lemon Squeezy',
        region: 'Global',
        icon: '🍋',
        color: '#FFC233',
        fields: [
            { id: 'apiKey', label: 'API Key', placeholder: 'api_...' },
            { id: 'storeId', label: 'Store ID', placeholder: '12345' }
        ]
    }
];

interface PaymentSettingsProps {
    initialConfig: any;
    onSave: (config: any) => Promise<void>;
}

export default function PaymentSettings({ initialConfig, onSave }: PaymentSettingsProps) {
    const [selectedProvider, setSelectedProvider] = useState<string | null>(initialConfig?.provider || null);
    const [formData, setFormData] = useState<any>(initialConfig?.credentials || {});
    const [saving, setSaving] = useState(false);

    const provider = PROVIDERS.find(p => p.id === selectedProvider);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({
                provider: selectedProvider,
                credentials: formData,
                updated_at: new Date().toISOString()
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-primary" />
                    Ödeme Yöntemlerini Bağla
                </h2>
                <p className="text-slate-400 font-medium italic opacity-80 max-w-2xl">
                    Dünyanın her yerinden veya yerel ödeme almak için tercih ettiğiniz ödeme geçidini bağlayın. Biz komisyon almıyoruz, ödemeler doğrudan sizin hesabınıza yatar.
                </p>
            </div>

            {/* Provider Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PROVIDERS.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p.id)}
                        className={cn(
                            "p-6 rounded-[28px] border-2 transition-all text-left flex flex-col gap-4 group relative overflow-hidden",
                            selectedProvider === p.id
                                ? "bg-white border-primary shadow-xl shadow-primary/10"
                                : "bg-slate-50/50 border-transparent hover:border-slate-200"
                        )}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-3xl">{p.icon}</span>
                            {selectedProvider === p.id && (
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            )}
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-black text-slate-900">{p.name}</h4>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{p.region}</p>
                        </div>
                        {selectedProvider === p.id && (
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-primary/5 rounded-full blur-2xl" />
                        )}
                    </button>
                ))}
            </div>

            {/* Configuration Form */}
            <AnimatePresence mode="wait">
                {selectedProvider && provider && (
                    <motion.div
                        key={selectedProvider}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[22px] flex items-center justify-center text-3xl shadow-lg border border-slate-50" style={{ backgroundColor: provider.color + '10' }}>
                                    {provider.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{provider.name} Yapılandırması</h3>
                                    <p className="text-sm font-bold text-slate-400">Gerekli API bilgilerini girerek bağlantıyı tamamlayın.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="rounded-xl text-slate-400 hover:text-primary gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Rehber
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {provider.fields.map((field) => (
                                <PremiumInput
                                    key={field.id}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    type="password"
                                    value={formData[field.id] || ''}
                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                    icon={<Lock className="w-5 h-5" />}
                                />
                            ))}
                        </div>

                        <div className="pt-8 flex items-center justify-between border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Shield className="w-5 h-5" />
                                <span className="text-xs font-bold italic">Bilgileriniz uçtan uca şifrelenir ve güvenle saklanır.</span>
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black shadow-xl transition-all active:scale-95"
                            >
                                {saving ? 'Kaydediliyor...' : 'Bağlantıyı Kaydet'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
