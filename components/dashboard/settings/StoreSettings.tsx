'use client';

import React, { useState } from 'react';
import { Globe, Search, Image as ImageIcon, Check, ChevronDown } from 'lucide-react';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';

interface StoreSettingsProps {
    store: any;
    onSave: (data: any) => Promise<void>;
}

export default function StoreSettings({ store, onSave }: StoreSettingsProps) {
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: store?.name || '',
        seo_title: store?.seo_title || '',
        seo_description: store?.seo_description || '',
        language: store?.language || 'tr',
        currency: store?.currency || 'TRY'
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* SEO Preview Section */}
            <div className="space-y-6">
                <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Google Önizlemesi</h3>
                <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-2">
                    <p className="text-[#1a0dab] text-[20px] font-medium hover:underline cursor-pointer">
                        {formData.seo_title || formData.name || 'Mağaza Başlığı'}
                    </p>
                    <p className="text-[#006621] text-[14px]">
                        sety.store/{store?.username || 'kullaniciadi'}
                    </p>
                    <p className="text-[#545454] text-[14px] line-clamp-2">
                        {formData.seo_description || 'Mağazanız için bir açıklama girin. Bu metin arama sonuçlarında görünecektir.'}
                    </p>
                </div>
            </div>

            {/* General Settings */}
            <div className="rounded-[32px] md:rounded-[44px] bg-white border border-slate-100/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-6 md:p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <PremiumInput
                        label={'SEO Başlığı'}
                        value={formData.seo_title}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                        placeholder="Örn: Emirhan Arslan | Dijital Ürünler"
                        icon={<Search className="w-5 h-5" />}
                    />
                    <PremiumInput
                        label="Mağaza Adı"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Örn: Emirhan'ın Mağazası"
                        icon={<Globe className="w-5 h-5" />}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[14px] font-black text-slate-400 uppercase tracking-widest px-1">
                        {'SEO Açıklaması (Meta Description)'}
                    </label>
                    <textarea
                        value={formData.seo_description}
                        onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                        className="w-full min-h-[120px] p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-[#5500ff] focus:bg-white outline-none transition-all font-bold text-slate-900 resize-none"
                        placeholder="Mağazanız hakkında kısa bir açıklama yazın..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[14px] font-black text-slate-400 uppercase tracking-widest px-1">
                            {'Mağaza Dili'}
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full h-14 pl-6 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#5500ff] focus:bg-white outline-none appearance-none transition-all font-black text-slate-900 cursor-pointer"
                            >
                                <option value="tr">Türkçe (TR)</option>
                                <option value="en">English (EN)</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-[#5500ff] transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[14px] font-black text-slate-400 uppercase tracking-widest px-1">
                            {'Para Birimi'}
                        </label>
                        <div className="relative group">
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full h-14 pl-6 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#5500ff] focus:bg-white outline-none appearance-none transition-all font-black text-slate-900 cursor-pointer"
                            >
                                <option value="TRY">Türk Lirası (₺)</option>
                                <option value="USD">Amerikan Doları ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">İngiliz Sterlini (£)</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:text-[#5500ff] transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-16 px-12 rounded-2xl bg-[#5500ff] text-white font-black text-[16px] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
}
