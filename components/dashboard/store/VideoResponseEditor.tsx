"use client";

import React, { useState, useCallback, useRef } from 'react';
import {
    ChevronLeft,
    Image as ImageIcon,
    CreditCard,
    Settings,
    Plus,
    Trash2,
    Upload,
    Check,
    ChevronDown,
    ChevronUp,
    Mail,
    Bell,
    TrendingUp,
    Users,
    MessageSquare,
    Sparkles,
    Layout,
    Type,
    MousePointer2,
    Clock,
    DollarSign,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import ImageSelectorModal from './ImageSelectorModal';
import AdvancedOptionsEditor from './AdvancedOptionsEditor';
import { analytics } from '@/lib/analytics/tracker';

// --- Shared Components ---

function EditorSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
            <div className="space-y-6">{children}</div>
        </div>
    );
}

function PremiumInput({ label, value, onChange, placeholder, maxLength, hint }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end px-1">
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                {maxLength && (
                    <span className="text-[10px] font-bold text-slate-300">
                        {value?.length || 0}/{maxLength}
                    </span>
                )}
            </div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all shadow-sm"
            />
            {hint && <p className="text-[11px] text-slate-400 font-medium px-1">{hint}</p>}
        </div>
    );
}

// --- Main Editor ---

interface VideoResponseEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    isSaving: boolean;
    isSuccess: boolean;
}

export default function VideoResponseEditor({
    productType,
    onClose,
    onSave,
    isSaving: isSavingProp,
    isSuccess: isSuccessProp
}: VideoResponseEditorProps) {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState<'thumbnail' | 'checkout' | 'options'>('thumbnail');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageContext, setImageContext] = useState<'thumbnail' | 'checkout' | 'bump' | null>(null);

    const [formData, setFormData] = useState({
        thumbnail: {
            style: 'button', // 'button' | 'callout'
            image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
            title: t('dashboard.store.editors.video_response.title_default'),
            subtitle: t('dashboard.store.editors.video_response.subtitle_default'),
            button_text: t('dashboard.store.editors.video_response.button_text_default')
        },
        checkout: {
            image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
            title: t('dashboard.store.editors.video_response.title_default'),
            description: t('dashboard.store.editors.video_response.checkout_desc_default'),
            subhead: 'Get Your Video!',
            cta_button: 'PURCHASE',
            price: '9.99',
            discounted_price: '0',
            collect_info: [
                { id: '1', label: 'Name', required: true, type: 'text' },
                { id: '2', label: 'Email', required: true, type: 'email' }
            ]
        },
        options: {
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
        }
    });

    const openImageSelector = (context: 'thumbnail' | 'checkout' | 'bump') => {
        setImageContext(context);
        setIsImageModalOpen(true);
    };

    const handleImageSelect = (url: string) => {
        if (!imageContext) return;
        if (imageContext === 'thumbnail') updateData('thumbnail.image_url', url);
        else if (imageContext === 'checkout') updateData('checkout.image_url', url);
        else if (imageContext === 'bump') updateData('options.order_bump.image_url', url);
        setIsImageModalOpen(false);
    };

    const updateData = useCallback((path: string, value: any) => {
        setFormData(prev => {
            const next = { ...prev };
            const keys = path.split('.');
            let current: any = next;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return next;
        });
    }, []);

    const handleSave = async () => {
        onSave({
            title: formData.thumbnail.title,
            bottom_title: formData.thumbnail.subtitle,
            button_text: formData.thumbnail.button_text,
            image_url: formData.thumbnail.image_url,
            description: formData.checkout.description,
            price: parseFloat(formData.checkout.price) || 0,
            discount_price: parseFloat(formData.checkout.discounted_price) || 0,
            extra_options: formData.options
        });
        analytics.productCreate('video_response', parseFloat(formData.checkout.price) || 0);
    };

    return (
        <div className="flex h-screen bg-[#FDFDFF] overflow-hidden font-sans">
            {/* Left Side: Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Header */}

                {/* Tabs */}
                <div className="px-8 pt-6 border-b border-slate-50">
                    <div className="flex gap-4">
                        <TabButton
                            active={activeTab === 'thumbnail'}
                            onClick={() => setActiveTab('thumbnail')}
                            icon={<ImageIcon className="w-4 h-4" />}
                            label={t('dashboard.store.editors.tabs.thumbnail')}
                        />
                        <TabButton
                            active={activeTab === 'checkout'}
                            onClick={() => setActiveTab('checkout')}
                            icon={<CreditCard className="w-4 h-4" />}
                            label={t('dashboard.store.editors.tabs.checkout')}
                        />
                        <TabButton
                            active={activeTab === 'options'}
                            onClick={() => setActiveTab('options')}
                            icon={<Settings className="w-4 h-4" />}
                            label={t('dashboard.store.editors.tabs.options')}
                        />
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                    <div className="max-w-2xl space-y-12">

                        {activeTab === 'thumbnail' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <EditorSection title={t('dashboard.store.editors.general.style_selection')}>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'button', label: t('dashboard.store.editors.general.style_button'), icon: <MousePointer2 className="w-5 h-5" />, desc: t('dashboard.store.editors.general.style_button_desc') },
                                            { id: 'callout', label: t('dashboard.store.editors.general.style_callout'), icon: <Layout className="w-5 h-5" />, desc: t('dashboard.store.editors.general.style_callout_desc') }
                                        ].map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateData('thumbnail.style', style.id)}
                                                className={cn(
                                                    "p-6 rounded-3xl border-2 text-left transition-all group",
                                                    formData.thumbnail.style === style.id
                                                        ? "border-[#5500ff] bg-[#5500ff]/5 shadow-lg shadow-[#5500ff]/5"
                                                        : "border-slate-100 hover:border-slate-200"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                                    formData.thumbnail.style === style.id ? "bg-[#5500ff] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                                )}>
                                                    {style.icon}
                                                </div>
                                                <p className="font-black text-[15px] text-slate-900">{style.label}</p>
                                                <p className="text-[12px] text-slate-400 font-bold mt-1">{style.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </EditorSection>

                                <EditorSection title={t('dashboard.store.editors.general.image_selection')}>
                                    <div
                                        onClick={() => openImageSelector('thumbnail')}
                                        className="relative aspect-video rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden"
                                    >
                                        {formData.thumbnail.image_url ? (
                                            <>
                                                <img src={formData.thumbnail.image_url} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold text-[13px]">{t('dashboard.store.editors.general.image_change')}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-3 group-hover:scale-110 transition-transform">
                                                    <Upload className="w-6 h-6" />
                                                </div>
                                                <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.store.editors.general.image_upload')}</p>
                                            </>
                                        )}
                                    </div>
                                </EditorSection>

                                <EditorSection title={t('dashboard.store.editors.general.text_selection')}>
                                    <div className="space-y-6">
                                        <PremiumInput
                                            label={t('dashboard.store.editors.general.title')}
                                            value={formData.thumbnail.title}
                                            onChange={(e: any) => updateData('thumbnail.title', e.target.value)}
                                            maxLength={50}
                                        />
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end px-1">
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.store.editors.general.subtitle')}</p>
                                                <span className="text-[10px] font-bold text-slate-300">{formData.thumbnail.subtitle.length}/100</span>
                                            </div>
                                            <textarea
                                                value={formData.thumbnail.subtitle}
                                                onChange={(e) => updateData('thumbnail.subtitle', e.target.value)}
                                                maxLength={100}
                                                className="w-full h-24 p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all shadow-sm resize-none"
                                            />
                                        </div>
                                        <PremiumInput
                                            label={t('dashboard.store.editors.general.button_text')}
                                            value={formData.thumbnail.button_text}
                                            onChange={(e: any) => updateData('thumbnail.button_text', e.target.value)}
                                            maxLength={30}
                                        />
                                    </div>
                                </EditorSection>
                            </motion.div>
                        )}

                        {activeTab === 'checkout' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                <EditorSection title={t('dashboard.store.editors.general.edit_appearance')}>
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center">{t('dashboard.store.editors.general.header_image')}</p>
                                            <div
                                                onClick={() => openImageSelector('checkout')}
                                                className="relative h-48 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden"
                                            >
                                                {formData.checkout.image_url ? (
                                                    <img src={formData.checkout.image_url} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <ImageIcon className="w-8 h-8 text-slate-200 mb-2" />
                                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{t('dashboard.store.editors.general.image_selection')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <PremiumInput
                                            label={t('dashboard.store.editors.general.title') + " *"}
                                            value={formData.checkout.title}
                                            onChange={(e: any) => updateData('checkout.title', e.target.value)}
                                        />

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.store.editors.general.description_text')} *</p>
                                                <button className="flex items-center gap-1.5 text-[#5500ff] font-black text-[11px] hover:underline">
                                                    <Sparkles className="w-3 h-3" /> {t('dashboard.store.editors.general.ai_generate')}
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.checkout.description}
                                                onChange={(e) => updateData('checkout.description', e.target.value)}
                                                className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all shadow-sm resize-none custom-scrollbar"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <PremiumInput
                                                label={t('dashboard.store.editors.general.subtitle') + " *"}
                                                value={formData.checkout.subhead}
                                                onChange={(e: any) => updateData('checkout.subhead', e.target.value)}
                                            />
                                            <PremiumInput
                                                label={t('dashboard.store.editors.general.cta_button') + " *"}
                                                value={formData.checkout.cta_button}
                                                onChange={(e: any) => updateData('checkout.cta_button', e.target.value)}
                                                maxLength={30}
                                            />
                                        </div>
                                    </div>
                                </EditorSection>

                                <EditorSection title={t('dashboard.store.editors.general.set_price_title')}>
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard.store.editors.general.price')} *</p>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</div>
                                                    <input
                                                        type="text"
                                                        value={formData.checkout.price}
                                                        onChange={e => updateData('checkout.price', e.target.value)}
                                                        className="w-full h-14 pl-10 pr-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-bold px-1 italic">{t('dashboard.store.editors.general.price_hint')}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard.store.editors.general.discount_price')}</p>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</div>
                                                    <input
                                                        type="text"
                                                        value={formData.checkout.discounted_price}
                                                        onChange={e => updateData('checkout.discounted_price', e.target.value)}
                                                        className="w-full h-14 pl-10 pr-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <button className="h-12 rounded-xl bg-slate-50 text-slate-600 font-black text-[12px] border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-center gap-2">
                                                <CreditCard className="w-3.5 h-3.5" /> {t('dashboard.store.editors.general.add_payment_plan')}
                                            </button>
                                            <button className="h-12 rounded-xl bg-slate-50 text-slate-600 font-black text-[12px] border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-center gap-2">
                                                <Clock className="w-3.5 h-3.5" /> {t('dashboard.store.editors.general.limit_amount')}
                                            </button>
                                            <button className="h-12 rounded-xl bg-indigo-50 text-[#5500ff] font-black text-[12px] border border-indigo-100/50 hover:bg-indigo-100/50 transition-all flex items-center justify-center gap-2">
                                                <Sparkles className="w-3.5 h-3.5" /> {t('dashboard.store.editors.general.discount_code')}
                                            </button>
                                        </div>
                                    </div>
                                </EditorSection>

                                <EditorSection title={t('dashboard.store.editors.general.collect_info_title')}>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-3">
                                            <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-50 rounded-2xl opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><Type className="w-4 h-4 text-slate-300" /></div>
                                                    <span className="text-[13px] font-black text-slate-700">Name</span>
                                                </div>
                                                <Info className="w-4 h-4 text-slate-200" />
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-50 rounded-2xl opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center"><Mail className="w-4 h-4 text-slate-300" /></div>
                                                    <span className="text-[13px] font-black text-slate-700">Email</span>
                                                </div>
                                                <Info className="w-4 h-4 text-slate-200" />
                                            </div>
                                        </div>
                                        <button className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-black text-[14px] hover:border-[#5500ff]/20 hover:text-[#5500ff] transition-all flex items-center justify-center gap-2">
                                            <Plus className="w-5 h-5" /> {t('dashboard.store.editors.general.add_field')}
                                        </button>
                                    </div>
                                </EditorSection>
                            </motion.div>
                        )}

                        {activeTab === 'options' && (
                            <AdvancedOptionsEditor
                                options={formData.options}
                                updateOptions={(newOptions) => updateData('options', newOptions)}
                                onOpenImageSelector={() => openImageSelector('bump')}
                            />
                        )}

                        {/* Unified Action Bar */}
                        <div className="pt-20 border-t border-slate-100 mt-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="text-[12px] text-slate-300 font-black italic">{t('dashboard.store.editors.general.improve_page')}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="h-14 px-8 rounded-2xl font-black text-[14px] border border-indigo-100 text-[#5500ff] bg-indigo-50/20 hover:bg-slate-50 transition-colors">
                                        {t('dashboard.store.editors.general.save_draft')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (activeTab === 'thumbnail') setActiveTab('checkout');
                                            else if (activeTab === 'checkout') setActiveTab('options');
                                            else handleSave();
                                        }}
                                        disabled={isSavingProp || isSuccessProp}
                                        className={cn(
                                            "h-14 px-10 rounded-2xl bg-[#5500ff] text-white font-black text-[15px] shadow-xl shadow-[#5500ff]/20 flex items-center gap-3 transition-all",
                                            (isSavingProp || isSuccessProp) && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isSuccessProp ? (
                                            <><Check className="w-5 h-5" /> {t('dashboard.store.editors.general.saved')}</>
                                        ) : isSavingProp ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('common.loading')}</>
                                        ) : activeTab === 'options' ? (
                                            t('dashboard.store.editors.general.publish')
                                        ) : (
                                            t('dashboard.store.editors.general.next')
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <ImageSelectorModal
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                    onSelect={handleImageSelect}
                />
            </div>

            {/* Right Side: Preview */}
            <div className="hidden xl:flex w-[620px] bg-[#FDFDFF] border-l border-slate-100 items-center justify-center p-12 relative overflow-hidden shrink-0">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{
                    backgroundImage: 'radial-gradient(circle, #c4b5fd 1.2px, transparent 1.2px)',
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)'
                }} />

                {/* Phone Mockup */}
                <div className="relative z-20 w-[320px] h-[670px] rounded-[3.8rem] bg-[#111111] p-[9px] shadow-[0_60px_120px_-20px_rgba(30,15,80,0.4)] border border-white/5">
                    <div className="w-full h-full bg-white rounded-[3.3rem] overflow-hidden relative flex flex-col border border-black/10">
                        {/* Dynamic Island */}
                        <div className="absolute top-4 inset-x-0 flex justify-center z-50">
                            <div className="w-24 h-7 bg-black rounded-full" />
                        </div>

                        {/* App Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pt-12">
                            <VideoResponsePreview data={formData} activeTab={activeTab} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Preview Components ---

function VideoResponsePreview({ data, activeTab }: { data: any, activeTab: string }) {
    const { t } = useTranslation();

    if (activeTab === 'thumbnail') {
        return (
            <div className="p-6">
                <div className={cn(
                    "w-full rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/50",
                    data.thumbnail.style === 'callout' ? "p-4" : "p-3"
                )}>
                    {data.thumbnail.image_url && (
                        <div className="aspect-video rounded-[1.5rem] overflow-hidden mb-4">
                            <img src={data.thumbnail.image_url} className="w-full h-full object-cover" alt="" />
                        </div>
                    )}
                    <div className="px-3 pb-3 space-y-2">
                        <h3 className="text-[17px] font-black text-slate-900 leading-tight">{data.thumbnail.title}</h3>
                        <p className="text-[13px] text-slate-500 font-bold leading-relaxed">{data.thumbnail.subtitle}</p>
                        <div className="pt-4">
                            <div className="w-full h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[13px]">
                                {data.thumbnail.button_text}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="relative h-48 bg-slate-100">
                {data.checkout.image_url && (
                    <img src={data.checkout.image_url} className="w-full h-full object-cover" alt="" />
                )}
                {/* Header Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
            </div>

            <div className="flex-1 px-8 py-10 space-y-8">
                <div className="space-y-4">
                    <h2 className="text-[26px] font-black text-slate-900 leading-[1.1] tracking-tight">{data.checkout.title}</h2>
                    <div className="inline-flex items-center">
                        <span className="text-[26px] font-black text-pink-500">
                            {data.checkout.price?.toString().replace('.', ',')} {t('dashboard.store.editors.general.currency_name')}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-[14px] text-slate-600 leading-[1.7] font-medium whitespace-pre-wrap">
                        {data.checkout.description}
                    </p>
                </div>

                <div className="pt-10 space-y-6">
                    <div className="space-y-4">
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{data.checkout.subhead}</p>
                        <div className="space-y-3">
                            <div className="h-14 px-6 rounded-2xl bg-white border-2 border-slate-100 flex items-center text-[14px] text-slate-300 font-bold italic">
                                Name
                            </div>
                            <div className="h-14 px-6 rounded-2xl bg-white border-2 border-slate-100 flex items-center text-[14px] text-slate-300 font-bold italic">
                                Email
                            </div>
                        </div>
                    </div>

                    <button className="w-full h-16 rounded-[2rem] bg-slate-900 text-white font-black text-[15px] shadow-2xl shadow-slate-400/20 active:scale-[0.98] transition-all">
                        {data.checkout.cta_button}
                    </button>

                    <p className="text-center text-[11px] text-slate-400 font-bold">
                        {t('dashboard.store.editors.general.secure_process')}
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- Internal Helper Components ---

function TabButton({ active, onClick, icon, label }: any) {
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

