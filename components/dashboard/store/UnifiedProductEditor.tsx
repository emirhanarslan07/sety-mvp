import React, { useState } from 'react';
import { Upload, Image as ImageLucide, Link2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { EditorSection } from './checkout/EditorSection';
import ImageSelectorModal from './ImageSelectorModal';
import { DescriptionEditor } from './checkout/DescriptionEditor';

interface UnifiedProductEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

export default function UnifiedProductEditor({
    productType,
    onClose,
    onSave,
    initialData = null
}: UnifiedProductEditorProps) {
    const { t } = useTranslation();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        currency: initialData?.currency || 'TRY',
        external_checkout_url: initialData?.external_checkout_url || '',
        image_url: initialData?.image_url || ''
    });

    const updateData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isLinkType = productType.id === 'external_link';

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFDFF]">
            <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                <div className="max-w-[800px] mx-auto space-y-12 pb-24 animate-in fade-in duration-500">
                    
                    <div className="space-y-4">
                        <h2 className="text-[32px] font-black text-slate-900 tracking-tight">
                            {productType.title} Detayları
                        </h2>
                        <p className="text-[16px] font-bold text-slate-500">
                            {productType.description}
                        </p>
                    </div>

                    <EditorSection number={1} title="Görsel (Opsiyonel)">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100/60 shadow-xl shadow-slate-200/20 flex flex-col sm:flex-row items-center gap-8 group transition-all">
                            <div className="relative w-32 h-32 rounded-[24px] overflow-hidden bg-slate-50 border-2 border-slate-50 shadow-inner group-hover:scale-[1.02] transition-transform flex-shrink-0">
                                {formData.image_url ? (
                                    <Image
                                        src={formData.image_url}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                        <ImageLucide className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => setIsImageModalOpen(true)}
                                        className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                        <Upload className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4 text-center sm:text-left">
                                <div className="space-y-1">
                                    <h4 className="text-[16px] font-black text-slate-900 tracking-tight">Görsel Yükle</h4>
                                    <p className="text-[13px] text-slate-400 font-bold">Ürününüzü öne çıkaracak bir görsel seçin.</p>
                                </div>
                                <button
                                    onClick={() => setIsImageModalOpen(true)}
                                    className="h-12 px-6 rounded-xl border-2 border-[#5500ff]/10 text-[#5500ff] font-black text-[13px] hover:bg-[#5500ff] hover:text-white transition-all active:scale-95"
                                >
                                    Görsel Seç
                                </button>
                            </div>
                        </div>
                    </EditorSection>

                    <EditorSection number={2} title="Temel Bilgiler">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-8">
                            <PremiumInput
                                label={isLinkType ? "Bağlantı Başlığı *" : "Ürün Adı *"}
                                value={formData.title}
                                onChange={(e) => updateData('title', e.target.value)}
                                placeholder={isLinkType ? "Örn: Telegram Grubum" : "Örn: 1 Aylık Diyet Planı"}
                            />

                            <div className="space-y-3">
                                <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                                    Açıklama (Opsiyonel)
                                </label>
                                <DescriptionEditor
                                    value={formData.description}
                                    onChange={(val) => updateData('description', val)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PremiumInput
                                    label={isLinkType ? "Fiyat (Opsiyonel)" : "Fiyat *"}
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => updateData('price', e.target.value)}
                                    placeholder="0"
                                />
                                
                                <div className="space-y-3">
                                    <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                                        Para Birimi
                                    </label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => updateData('currency', e.target.value)}
                                        className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent focus:border-[#5500ff]/20 rounded-2xl outline-none font-bold text-[15px] text-slate-900 transition-all appearance-none"
                                    >
                                        <option value="TRY">₺ (TRY) - Türk Lirası</option>
                                        <option value="USD">$ (USD) - Amerikan Doları</option>
                                        <option value="EUR">€ (EUR) - Euro</option>
                                        <option value="GBP">£ (GBP) - İngiliz Sterlini</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </EditorSection>

                    <EditorSection number={3} title={isLinkType ? "Yönlendirme URL'si" : "Ödeme Linki"}>
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-6">
                            <PremiumInput
                                label="URL *"
                                icon={<Link2 className="w-5 h-5 text-slate-400" />}
                                value={formData.external_checkout_url}
                                onChange={(e) => updateData('external_checkout_url', e.target.value)}
                                placeholder="https://"
                            />
                            {!isLinkType && (
                                <p className="text-[13px] text-slate-400 font-bold px-2">
                                    Müşterileriniz ürünü satın almak için bu linke yönlendirilecek (Örn: Iyzico, Shopier, Stripe, Calendly veya WhatsApp linki).
                                </p>
                            )}
                        </div>
                    </EditorSection>

                </div>
            </div>

            <div className="border-t border-slate-100 bg-white p-6 shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="max-w-[800px] mx-auto flex items-center justify-between">
                    <button 
                        onClick={onClose} 
                        className="h-14 px-8 rounded-2xl text-[15px] font-black text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        İptal
                    </button>
                    <button 
                        onClick={() => onSave(formData)} 
                        className="h-14 px-10 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white text-[15px] font-black shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        Devam Et
                    </button>
                </div>
            </div>

            <ImageSelectorModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSelect={(url) => updateData('image_url', url)}
            />
        </div>
    );
}
