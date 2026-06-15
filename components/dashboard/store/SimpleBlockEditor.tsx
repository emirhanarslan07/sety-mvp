'use client';

import React, { useState } from 'react';
import { Type, Share2, Check, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';

interface SimpleBlockEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    isSaving?: boolean;
    isSuccess?: boolean;
    initialData?: any;
}

export default function SimpleBlockEditor({
    productType,
    onClose,
    onSave,
    isSaving = false,
    isSuccess = false,
    initialData = null
}: SimpleBlockEditorProps) {
    const isText = productType.id === 'text_block';
    const isLeadMagnet = productType.id === 'lead_magnet';

    const [formData, setFormData] = useState({
        title: initialData?.title || (isText ? 'Başlık Buraya' : isLeadMagnet ? 'Ücretsiz Rehber İndir' : 'Sosyal Medya'),
        subtitle: initialData?.subtitle || (isText ? 'Açıklama metni buraya gelecek.' : isLeadMagnet ? 'E-postanıza PDF olarak gönderelim.' : 'Beni takip edin!'),
        button_text: initialData?.button_text || (isText ? '' : isLeadMagnet ? 'İndir' : 'Takip Et'),
        digital_file_url: initialData?.file_url || '',
        price: initialData?.price || 0,
        type: productType.id,
    });

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFDFF]">
            <div className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar">
                <div className="max-w-[640px] mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                        <div className={cn(
                            "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-xl",
                            productType.color
                        )}>
                            <productType.icon className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isText ? 'Metin Bloğu Düzenle' : isLeadMagnet ? 'E-posta Toplama Düzenle' : 'Sosyal Medya Bloğu Düzenle'}
                        </h2>
                        <p className="text-slate-400 font-bold">
                            {isText ? 'Mağazanızda öne çıkarmak istediğiniz bir mesaj veya duyuru yazın.' : isLeadMagnet ? 'Ziyaretçilerinizden e-posta toplamak için hediye bir dosya sunun.' : 'Sosyal medya hesaplarınıza yönlendiren şık bir blok oluşturun.'}
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
                        <PremiumInput
                            label={isText ? "Başlık" : isLeadMagnet ? "Başlık" : "Görünen Ad"}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder={isText ? "Duyuru!" : isLeadMagnet ? "Ücretsiz Rehber" : "Instagram"}
                        />

                        <PremiumInput
                            label={isText ? "Açıklama" : "Mesaj"}
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            placeholder={isText ? "Yeni ürünümüz yayında..." : "Beni buralarda da bulabilirsiniz."}
                        />

                        {!isText && (
                            <PremiumInput
                                label="Buton Metni"
                                value={formData.button_text}
                                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                placeholder={isLeadMagnet ? "İndir" : "Takip Et"}
                            />
                        )}

                        {isLeadMagnet && (
                            <PremiumInput
                                label="Hediye Dosya Linki (PDF vs.)"
                                value={formData.digital_file_url}
                                onChange={(e) => setFormData({ ...formData, digital_file_url: e.target.value })}
                                placeholder="https://drive.google.com/..."
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-12 border-t border-slate-100">
                        <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-900 transition-colors">Vazgeç</button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || isSuccess}
                            className={cn(
                                "h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black hover:bg-[#4400cc] shadow-xl shadow-indigo-100 transition-all",
                                (isSaving || isSuccess) && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {isSuccess ? (
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#C4FF00]" />
                                    Kaydedildi
                                </div>
                            ) : isSaving ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                'Bloğu Yayınla ✨'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
