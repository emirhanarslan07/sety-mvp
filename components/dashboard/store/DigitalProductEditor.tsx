'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageLucide, Copy, Sparkles, BarChart3, User, Check, Plus, X, ChevronDown, ChevronUp, AlertCircle, Trash2, Share2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';

// Shared components
import ImageSelectorModal from './ImageSelectorModal';
import { EditorSection } from './checkout/EditorSection';
import { FieldManager } from './checkout/FieldManager';
import { DescriptionEditor } from './checkout/DescriptionEditor';
import { PricingSection } from './checkout/PricingSection';
import { FileUploadSection } from './checkout/FileUploadSection';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';
import AdvancedOptionsEditor from './AdvancedOptionsEditor';
import { analytics } from '@/lib/analytics/tracker';

// Preview
import DigitalProductPreview from './DigitalProductPreview';
interface DigitalProductEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    isSaving?: boolean;
    isSuccess?: boolean;
}

interface FormField {
    label: string;
    placeholder: string;
    type: string;
    options?: string[];
}

export default function DigitalProductEditor({
    productType,
    onClose,
    onSave,
    isSaving = false,
    isSuccess = false
}: DigitalProductEditorProps) {
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'checkout' | 'options'>('checkout');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isAddFieldMenuOpen, setIsAddFieldMenuOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleTabChange = useCallback((tab: 'checkout' | 'options') => {
        setActiveTab(tab);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, []);

    // Main form
    const [formData, setFormData] = useState({
        title: 'Get My [Template/eBook/Course] Now!',
        description: 'This is where you describe the value of your product.',
        bottom_title: 'Get My Guide',
        button_text: 'PURCHASE',
        image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800',
        fields: [
            { label: 'İsim', placeholder: 'İsminizi girin', type: 'text', options: [] },
            { label: 'E-posta', placeholder: 'E-postanızı girin', type: 'email', options: [] }
        ] as FormField[],
    });

    // Pricing
    const [pricingData, setPricingData] = useState({
        price: '9.99',
        discount_price: '',
        payment_plan_enabled: false,
        payment_plan_installments: '3',
        discount_code_enabled: false,
        discount_code: '',
        discount_percent: '',
        quantity_limit_enabled: false,
        quantity_limit: '',
    });

    const [extraOptions, setExtraOptions] = useState({
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

    // File / Redirect
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');

    const updateData = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const updatePricing = useCallback((field: string, value: string | boolean) => {
        setPricingData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Field handlers
    const updateField = useCallback((index: number, newLabel: string) => {
        setFormData(prev => ({ ...prev, fields: prev.fields.map((f, i) => i === index ? { ...f, label: newLabel } : f) }));
    }, []);

    const updateOption = useCallback((fieldIdx: number, optIdx: number, val: string) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? { ...f, options: f.options?.map((opt, j) => j === optIdx ? val : opt) } : f)
        }));
    }, []);

    const addOption = useCallback((fieldIdx: number) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? { ...f, options: [...(f.options || []), `Seçenek ${(f.options?.length || 0) + 1}`] } : f)
        }));
    }, []);

    const removeOption = useCallback((fieldIdx: number, optIdx: number) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map((f, i) => i === fieldIdx ? { ...f, options: f.options?.filter((_, j) => j !== optIdx) } : f)
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
        setFormData(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }));
    }, []);

    const [saveError, setSaveError] = useState<string | null>(null);

    const handleSave = async () => {
        if (isSaving) return;
        setSaveError(null);
        try {
            await onSave({
                ...formData,
                ...pricingData,
                price: parseFloat(pricingData.price) || 0,
                discount_price: parseFloat(pricingData.discount_price) || 0,
                digital_file_url: uploadedFileUrl,
                redirect_url: redirectUrl,
                extra_options: extraOptions,
            });

            analytics.productCreate('digital_product', parseFloat(pricingData.price) || 0);
        } catch (err: any) {
            setSaveError(err.message || 'Ürün yayınlanırken bir hata oluştu');
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden bg-[#FDFDFF]">
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center gap-4 px-6 h-24 relative z-10 bg-[#FDFDFF]">
                    <TabButton
                        active={activeTab === 'checkout'}
                        onClick={() => handleTabChange('checkout')}
                        icon={<ShoppingBag className="w-4 h-4" />}
                        label={t('dashboard.store.editors.tabs.checkout')}
                    />
                    <TabButton
                        active={activeTab === 'options'}
                        onClick={() => handleTabChange('options')}
                        icon={<Sparkles className="w-4 h-4" />}
                        label={t('dashboard.store.editors.tabs.options')}
                    />
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="max-w-[800px] space-y-16 pb-24">

                        {activeTab === 'checkout' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                                {/* Section 1: Image */}
                                <EditorSection number={1} title={t('dashboard.store.editors.sections.select_image')}>
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 flex items-center gap-10 group transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <div className="relative w-40 h-40 rounded-[32px] overflow-hidden bg-slate-50 border-2 border-slate-50 shadow-inner group-hover:scale-[1.02] transition-transform">
                                            {formData.image_url ? (
                                                <Image src={formData.image_url} alt="" fill className="object-cover" sizes="160px" />
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
                                                <h4 className="text-[17px] font-black text-slate-900 tracking-tight leading-none">{t('dashboard.store.editors.image_selection')}</h4>
                                                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">{t('dashboard.store.editors.image_hint')}</p>
                                            </div>
                                            <button
                                                onClick={() => setIsImageModalOpen(true)}
                                                className="h-14 px-8 rounded-2xl border-2 border-[#5500ff]/10 text-[#5500ff] font-black text-[14px] hover:bg-[#5500ff] hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                {t('dashboard.store.editors.select_button')}
                                            </button>
                                        </div>
                                    </div>
                                </EditorSection>

                                {/* Section 2: Write Description */}
                                <EditorSection number={2} title={t('dashboard.store.editors.sections.write_description')}>
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-10 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <PremiumInput
                                            label={t('dashboard.store.editors.fields.title_label')}
                                            value={formData.title}
                                            onChange={(e) => updateData('title', e.target.value)}
                                            placeholder={t('dashboard.store.editors.placeholders.title')}
                                        />

                                        <div className="space-y-4">
                                            <DescriptionEditor
                                                value={formData.description}
                                                onChange={(val: string) => updateData('description', val)}
                                            />
                                        </div>

                                        <PremiumInput
                                            label={t('dashboard.store.editors.fields.bottom_title_label')}
                                            value={formData.bottom_title}
                                            onChange={(e) => updateData('bottom_title', e.target.value)}
                                            placeholder={t('dashboard.store.editors.placeholders.bottom_title')}
                                        />
                                        <PremiumInput
                                            label={t('dashboard.store.editors.fields.button_text_label')}
                                            value={formData.button_text}
                                            onChange={(e) => updateData('button_text', e.target.value)}
                                            placeholder={t('dashboard.store.editors.placeholders.button_text')}
                                        />
                                    </div>
                                </EditorSection>

                                {/* Section 3: Pricing */}
                                <EditorSection number={3} title={t('dashboard.store.editors.sections.pricing')}>
                                    <PricingSection
                                        data={pricingData}
                                        onChange={(field: string, value: string | boolean) => updatePricing(field, value)}
                                    />
                                </EditorSection>

                                {/* Section 4: Collect Info */}
                                <EditorSection number={4} title={t('dashboard.store.editors.sections.collect_info')}>
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

                                {/* Section 5: Upload */}
                                <EditorSection number={5} title={t('dashboard.store.editors.sections.upload_product')}>
                                    <FileUploadSection
                                        uploadedFileUrl={uploadedFileUrl}
                                        redirectUrl={redirectUrl}
                                        onFileUploaded={(url: string, name: string) => { setUploadedFileUrl(url); setUploadedFileName(name); }}
                                        onRedirectUrlChange={setRedirectUrl}
                                    />
                                </EditorSection>

                                {/* Unified Action Bar */}
                                <div className="pt-20 border-t border-slate-100 mt-10">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[12px] text-slate-300 font-black italic">{t('dashboard.store.editors.improve_page')}</p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => showToast(t('dashboard.store.editors.draft_saved'), 'success')}
                                                className="h-14 px-8 rounded-2xl font-black text-[14px] text-slate-400 hover:text-slate-900 transition-colors"
                                            >
                                                {t('dashboard.store.editors.save_draft')}
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
                                                    <><Check className="w-5 h-5 text-[#C4FF00]" /> {t('dashboard.store.editors.published')}</>
                                                ) : isSaving ? (
                                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('dashboard.store.editors.publishing')}</>
                                                ) : (
                                                    t('dashboard.store.editors.publish')
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'options' && (
                            <AdvancedOptionsEditor
                                options={extraOptions}
                                updateOptions={setExtraOptions}
                                onOpenImageSelector={() => setIsImageModalOpen(true)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="hidden xl:flex w-[620px] border-l border-slate-100 flex-col items-center justify-center p-12 bg-[#FDFDFF] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{
                    backgroundImage: 'radial-gradient(circle, #c4b5fd 1.2px, transparent 1.2px)',
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)'
                }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
                    background: 'radial-gradient(circle, rgba(85,0,255,0.12) 0%, rgba(85,0,255,0.04) 45%, transparent 70%)',
                    filter: 'blur(40px)',
                }} />

                <div className="relative z-20 w-[300px] h-[640px] rounded-[3.2rem] bg-[#111111] border-[1.5px] border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-[7px] bg-white rounded-[2.6rem] overflow-hidden flex flex-col shadow-inner border border-black/5">
                        <div className="absolute top-[16px] inset-x-0 flex justify-center z-50 pointer-events-none">
                            <div style={{ width: '84px', height: '28px', background: 'black', borderRadius: '14px' }} />
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            <div className="w-full h-full overflow-y-auto mockup-screen-container bg-white">
                                <DigitalProductPreview
                                    data={{
                                        ...formData,
                                        ...pricingData,
                                        price: parseFloat(pricingData.price) || 0,
                                        discount_price: parseFloat(pricingData.discount_price) || undefined,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-100/30 rounded-full z-50" />
                    </div>
                </div>
            </div>

            <ImageSelectorModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSelect={(url: string) => updateData('image_url', url)}
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
