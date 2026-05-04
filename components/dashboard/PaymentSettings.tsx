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
    Lock,
    ArrowRight
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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-[#5500ff]/5 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-[#5500ff]" />
                    </div>
                    <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
                        Connect Payment Methods
                    </h2>
                </div>
                <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-2xl opacity-80">
                    Connect your preferred payment gateway to receive payments from anywhere in the world. We don&apos;t take any commission, payments go directly to your account.
                </p>
            </div>

            {/* Provider Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PROVIDERS.map((p) => {
                    const isActive = selectedProvider === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setSelectedProvider(p.id)}
                            className={cn(
                                "p-8 rounded-[40px] border-2 transition-all text-left flex flex-col gap-6 group relative overflow-hidden active:scale-95",
                                isActive
                                    ? "bg-white border-[#5500ff] shadow-[0_20px_40px_rgba(85,0,255,0.1)]"
                                    : "bg-white border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-slate-200 hover:shadow-xl"
                            )}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{p.icon}</span>
                                {isActive && (
                                    <div className="w-8 h-8 rounded-full bg-[#5500ff] flex items-center justify-center shadow-lg">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="relative z-10 space-y-1">
                                <h4 className="text-[20px] font-black text-slate-900 tracking-tight uppercase">{p.name}</h4>
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">{p.region}</p>
                            </div>
                            {isActive && (
                                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[#5500ff]/5 rounded-full blur-3xl" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Configuration Form */}
            <AnimatePresence mode="wait">
                {selectedProvider && provider && (
                    <motion.div
                        key={selectedProvider}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] p-10 md:p-14 space-y-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-50 pb-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[32px] flex items-center justify-center text-4xl shadow-2xl border border-white" style={{ backgroundColor: provider.color + '15' }}>
                                    {provider.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[24px] font-black text-slate-900 tracking-tight">{provider.name} Configuration</h3>
                                    <p className="text-slate-400 font-bold text-base">Enter your API credentials to complete the setup.</p>
                                </div>
                            </div>
                            <button className="h-14 px-8 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm tracking-tight flex items-center gap-3 transition-all border border-slate-100 active:scale-95">
                                <ExternalLink className="w-4 h-4" />
                                Setup Guide
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
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

                        <div className="pt-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-4 bg-[#F8FAFF] px-8 py-5 rounded-[32px] border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-500 italic max-w-xs leading-tight">Your credentials are encrypted end-to-end and stored securely.</span>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="h-20 px-14 rounded-[32px] bg-slate-900 hover:bg-[#5500ff] text-white font-black text-[18px] shadow-2xl transition-all active:scale-95 disabled:opacity-50 min-w-[280px] flex items-center justify-center gap-4"
                            >
                                {saving ? 'Connecting...' : 'Save Connection'}
                                {!saving && <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
