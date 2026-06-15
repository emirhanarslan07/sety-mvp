'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageLucide, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';

// Components
import ImageSelectorModal from './ImageSelectorModal';
import LiveCheckoutPreview from './LiveCheckoutPreview';
import { EditorSection } from './checkout/EditorSection';
import { FieldManager } from './checkout/FieldManager';
import { DescriptionEditor } from './checkout/DescriptionEditor';
import AdvancedOptionsEditor from './AdvancedOptionsEditor';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';

interface CheckoutEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    isSaving?: boolean;
    isSuccess?: boolean;
    initialData?: any;
}

interface FormField {
    label: string;
    placeholder: string;
    type: string;
    options?: string[];
}

interface CheckoutFormData {
    title: string;
    description: string;
    bottom_title: string;
    button_text: string;
    image_url: string;
    fields: FormField[];
}

export default function CheckoutEditor({
    productType,
    onClose,
    onSave,
    isSaving = false,
    isSuccess = false,
    initialData = null
}: CheckoutEditorProps) {
    const { showToast } = useToast();
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isAddFieldMenuOpen, setIsAddFieldMenuOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<CheckoutFormData>({
        title: initialData?.title || 'Get My FREE Guide Now!',
        description: initialData?.description || 'Join my email list and never miss an update from me!',
        bottom_title: initialData?.subtitle || 'Get My FREE Guide',
        button_text: initialData?.button_text || 'Download',
        image_url: initialData?.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        fields: initialData?.fields || [
            { label: 'İsim', placeholder: 'İsminizi girin', type: 'text', options: [] },
            { label: 'E-posta', placeholder: 'E-postanızı girin', type: 'email', options: [] }
        ]
    });

    const [activeTab, setActiveTab] = useState<'checkout' | 'options'>('checkout');
    const [extraOptions, setExtraOptions] = useState(initialData?.extra_options || {
        reviews: [],
        email_flow_enabled: false,
        email_flow_id: '',
        email_reminders_enabled: false,
        reminders: [
            { time: '1', unit: 'hour' },
            { time: '24', unit: 'hour' }
        ],
        order_bump_enabled: false,
        order_bump: { title: '', price: '', description: '', image_url: '' },
        affiliates_enabled: false,
        affiliates_commission: '20'
    });

    const updateData = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateField = useCallback((index: number, newLabel: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === index ? { ...f, label: newLabel } : f)
        }));
    }, []);

    const updateOption = useCallback((fieldIdx: number, optIdx: number, val: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? {
                ...f,
                options: f.options?.map((opt, j) => j === optIdx ? val : opt)
            } : f)
        }));
    }, []);

    const addOption = useCallback((fieldIdx: number) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? {
                ...f,
                options: [...(f.options || []), `Seçenek ${(f.options?.length || 0) + 1}`]
            } : f)
        }));
    }, []);

    const removeOption = useCallback((fieldIdx: number, optIdx: number) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? {
                ...f,
                options: f.options?.filter((_, j) => j !== optIdx)
            } : f)
        }));
    }, []);

    const addField = useCallback((type: string, label: string) => {
        setFormData(prev => ({
            ...prev,
            fields: [...prev.fields, {
                label,
                placeholder: `${label} girin`,
                type,
                options: (type === 'multiple' || type === 'dropdown') ? ['Seçenek 1', 'Seçenek 2'] : []
            }]
        }));
        setIsAddFieldMenuOpen(false);
    }, []);

    const removeField = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index)
        }));
    }, []);

    const handleSave = async () => {
        if (isSaving) return;
        await onSave({
            ...formData,
            extra_options: extraOptions
        });
    };

    const handleTabChange = (tab: 'checkout' | 'options') => {
        setActiveTab(tab);
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FDFDFF]">
            {/* Tabs */}
            <div className="flex items-center gap-4 px-6 h-24 relative z-10 bg-[#FDFDFF]">
                <TabButton
                    active={activeTab === 'checkout'}
                    onClick={() => handleTabChange('checkout')}
                    icon={<ShoppingBag className="w-4 h-4" />}
                    label="Ödeme Sayfası"
                />
                <TabButton
                    active={activeTab === 'options'}
                    onClick={() => handleTabChange('options')}
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Seçenekler"
                />
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Editor Inputs */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="max-w-[800px] space-y-16 pb-24 animate-in fade-in duration-500">
                        {activeTab === 'checkout' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                                {/* Section 1: Select Image */}
                                <EditorSection number={1} title="Görsel Seçin">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 flex items-center gap-10 group transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <div className="relative w-40 h-40 rounded-[32px] overflow-hidden bg-slate-50 border-2 border-slate-50 shadow-inner group-hover:scale-[1.02] transition-transform">
                                            {formData.image_url ? (
                                                <Image
                                                    src={formData.image_url}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="160px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                    <ImageLucide className="w-10 h-10" />
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
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <h4 className="text-[17px] font-black text-slate-900 tracking-tight leading-none">Görselinizi Buraya Sürükleyin</h4>
                                                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">Önerilen: 1920 x 1080</p>
                                            </div>
                                            <button
                                                onClick={() => setIsImageModalOpen(true)}
                                                className="h-14 px-8 rounded-2xl border-2 border-[#5500ff]/10 text-[#5500ff] font-black text-[14px] hover:bg-[#5500ff] hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                Görsel Seç
                                            </button>
                                        </div>
                                    </div>
                                </EditorSection>

                                {/* Section 2: Write Description */}
                                <EditorSection number={2} title="Açıklama Yazın">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-10 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <PremiumInput
                                            label="Başlık *"
                                            value={formData.title}
                                            onChange={(e) => updateData('title', e.target.value)}
                                            placeholder="Get My FREE Guide Now!"
                                        />

                                        <DescriptionEditor
                                            value={formData.description}
                                            onChange={(val) => updateData('description', val)}
                                        />

                                        <PremiumInput
                                            label="Alt Başlık (CTA)"
                                            value={formData.bottom_title}
                                            onChange={(e) => updateData('bottom_title', e.target.value)}
                                            placeholder="Get My FREE Guide"
                                        />

                                        <PremiumInput
                                            label="Buton Metni *"
                                            value={formData.button_text}
                                            onChange={(e) => updateData('button_text', e.target.value)}
                                            placeholder="Download"
                                        />
                                    </div>
                                </EditorSection>

                                {/* Section 3: Collect Info */}
                                <EditorSection number={3} title="Bilgi Toplayın">
                                    <FieldManager
                                        fields={formData.fields}
                                        updateField={updateField}
                                        removeField={removeField}
                                        updateOption={updateOption}
                                        addOption={addOption}
                                        removeOption={removeOption}
                                        addField={addField}
                                        isAddFieldMenuOpen={isAddFieldMenuOpen}
                                        setIsAddFieldMenuOpen={setIsAddFieldMenuOpen}
                                    />
                                </EditorSection>
                            </motion.div>
                        )}

                        {activeTab === 'options' && (
                            <AdvancedOptionsEditor
                                options={extraOptions}
                                updateOptions={setExtraOptions}
                                onOpenImageSelector={() => setIsImageModalOpen(true)}
                            />
                        )}

                        {/* Unified Action Bar (End of Content) */}
                        <div className="pt-20 border-t border-slate-100 mt-10">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] text-slate-300 font-black italic">Bu sayfayı iyileştirin</p>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            showToast('Taslak olarak kaydedildi', 'success');
                                        }}
                                        className="h-14 px-8 rounded-2xl font-black text-[14px] text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        Taslak Olarak Kaydet
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || isSuccess}
                                        className={cn(
                                            "h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black text-[15px] shadow-xl shadow-[#5500ff]/20 flex items-center gap-3 transition-all",
                                            (isSaving || isSuccess) && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isSuccess ? (
                                            <><Check className="w-5 h-5 text-[#C4FF00]" /> Yayınlandı ✨</>
                                        ) : isSaving ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Yükleniyor...</>
                                        ) : (
                                            'Yayınla ✨'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Live Page Preview */}
                <div className="hidden xl:flex w-[620px] border-l border-slate-100 flex-col items-center justify-center p-12 bg-[#FDFDFF] relative overflow-hidden">
                    {/* ── Dot Grid Background ── */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{
                        backgroundImage: 'radial-gradient(circle, #c4b5fd 1.2px, transparent 1.2px)',
                        backgroundSize: '30px 30px',
                        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)'
                    }} />

                    {/* ── Purple Glows ── */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
                        background: 'radial-gradient(circle, rgba(85,0,255,0.12) 0%, rgba(85,0,255,0.04) 45%, transparent 70%)',
                        filter: 'blur(40px)',
                    }} />

                    {/* ── IPHONE MOCKUP ── */}
                    <div
                        className="relative z-20 w-[300px] h-[640px] rounded-[3.2rem] bg-[#111111] border-[1.5px] border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]"
                    >
                        {/* Inner Screen - Perfectly Centered */}
                        <div className="absolute inset-[7px] bg-white rounded-[2.6rem] overflow-hidden flex flex-col shadow-inner border border-black/5">
                            {/* Dynamic Island */}
                            <div className="absolute top-[16px] inset-x-0 flex justify-center z-50 pointer-events-none">
                                <div style={{ width: '84px', height: '28px', background: 'black', borderRadius: '14px' }} />
                            </div>

                            {/* Screen Content */}
                            <div className="flex-1 overflow-hidden relative">
                                <style>{`
                                    .mockup-screen-container::-webkit-scrollbar {
                                        display: none;
                                    }
                                    .mockup-screen-container {
                                        -ms-overflow-style: none;
                                        scrollbar-width: none;
                                    }
                                `}</style>
                                <div className="w-full h-full overflow-y-auto mockup-screen-container bg-white">
                                    <LiveCheckoutPreview data={{ ...formData }} />
                                </div>
                            </div>

                            {/* Home Indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-100/30 rounded-full z-50" />
                        </div>
                    </div>
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


function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "h-12 px-6 rounded-full flex items-center gap-3 font-black text-[14px] transition-all border-2",
                active
                    ? "bg-[#5500ff]/5 border-[#5500ff] text-[#5500ff] shadow-sm"
                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm"
            )}
        >
            {icon}
            {label}
        </button>
    );
}
