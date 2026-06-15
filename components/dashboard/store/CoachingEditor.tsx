'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
    Upload,
    Image as ImageLucide,
    Check,
    Calendar,
    ChevronDown,
    ChevronUp,
    Plus,
    Mail,
    Bell,
    TrendingUp,
    Users,
    MessageSquare,
    Trash2,
    Globe,
    ShoppingBag,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

// Components
import AdvancedOptionsEditor from './AdvancedOptionsEditor';
import ImageSelectorModal from './ImageSelectorModal';
import LiveCoachingPreview from './LiveCoachingPreview';
import { EditorSection } from './checkout/EditorSection';
import { FieldManager } from './checkout/FieldManager';
import { DescriptionEditor } from './checkout/DescriptionEditor';
import { PricingSection } from './checkout/PricingSection';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';

interface CoachingEditorProps {
    productType: any;
    onClose: () => void;
    onSave: (data: any) => void;
    isSaving?: boolean;
    isSuccess?: boolean;
    initialData?: any;
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const TIMEZONES = [
    { label: "GMT - Londra, Man Adası, Guernsey | UTC 0", value: "GMT - London | UTC 0" },
    { label: "BST - Londra, Man Adası, Guernsey | UTC +1", value: "BST - London | UTC +1" },
    { label: "GDT - Kanarya, Faroe Adaları | UTC +1", value: "GDT - Canary | UTC +1" },
    { label: "CEDT - Amsterdam, Paris, Brüksel | UTC +2", value: "CEDT - Amsterdam | UTC +2" },
    { label: "TDT - İstanbul | UTC +3", value: "TDT - Istanbul | UTC +3" },
    { label: "EEDT - Atina, Bükreş | UTC +3", value: "EEDT - Athens | UTC +3" },
    { label: "MSK - Moskova | UTC +3", value: "MSK - Moscow | UTC +3" },
    { label: "AST - Bağdat, Riyad | UTC +3", value: "AST - Baghdad | UTC +3" },
    { label: "GST - Abu Dabi, Dubai | UTC +4", value: "GST - Dubai | UTC +4" },
    { label: "PKT - İslamabad, Karaçi | UTC +5", value: "PKT - Karachi | UTC +5" },
    { label: "IST - Delhi, Mumbai | UTC +5.5", value: "IST - India | UTC +5.5" },
    { label: "HKT - Hong Kong | UTC +8", value: "HKT - Hong Kong | UTC +8" },
    { label: "JST - Tokyo | UTC +9", value: "JST - Tokyo | UTC +9" },
    { label: "AEST - Sidney | UTC +10", value: "AEST - Sydney | UTC +10" },
    { label: "NZDT - Auckland | UTC +13", value: "NZDT - Auckland | UTC +13" },
    { label: "PST - Los Angeles | UTC -7", value: "PST - Pacific | UTC -7" },
    { label: "MST - Denver | UTC -6", value: "MST - Mountain | UTC -6" },
    { label: "CST - Chicago | UTC -5", value: "CST - Central | UTC -5" },
    { label: "EST - New York | UTC -4", value: "EST - Eastern | UTC -4" }
];

export default function CoachingEditor({
    productType,
    onClose,
    onSave,
    isSaving = false,
    isSuccess = false,
    initialData = null
}: CoachingEditorProps) {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'checkout' | 'availability' | 'options'>('checkout');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isAddFieldMenuOpen, setIsAddFieldMenuOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleTabChange = useCallback((tab: 'checkout' | 'availability' | 'options') => {
        setActiveTab(tab);
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [setActiveTab]);


    // Form State
    const [formData, setFormData] = useState({
        title: initialData?.title || 'Book a 1:1 Call with Me',
        description: initialData?.description || `
            <p>I am here to help you achieve your goals.</p>
            <p>On this 1:1 Video Call, I will personally help you:</p>
            <ul>
                <li>Give you specific advice to your situation</li>
                <li>Build a plan to reach your goals</li>
                <li>Walk you through all of your questions</li>
            </ul>
        `,
        bottom_title: initialData?.subtitle || 'Work With Me 1:1',
        button_text: initialData?.button_text || 'Book a Call',
        image_url: initialData?.image_url || 'https://images.unsplash.com/photo-1506784919141-93503140507d?auto=format&fit=crop&q=80&w=800',
        price: initialData?.price?.toString() || '9.99',
        discount_price: initialData?.discount_price?.toString() || '0',
        payment_plan_enabled: initialData?.payment_plan_enabled || false,
        payment_plan_installments: initialData?.payment_plan_installments?.toString() || '3',
        discount_code_enabled: initialData?.discount_code_enabled || false,
        discount_code: initialData?.discount_code || '',
        discount_percent: initialData?.discount_percent?.toString() || '20',
        quantity_limit_enabled: initialData?.quantity_limit_enabled || false,
        quantity_limit: initialData?.quantity_limit?.toString() || '100',
        fields: initialData?.fields || [
            { label: 'İsim', placeholder: 'Adınızı Soyadınızı girin', type: 'text' },
            { label: 'E-posta', placeholder: 'E-posta adresinizi girin', type: 'email' }
        ],
        calendly_url: initialData?.calendly_url || '',
        options: initialData?.extra_options || {
            reminders: [
                { time: '1', unit: 'hour' },
                { time: '24', unit: 'hour' }
            ],
            reviews: [],
            email_flow_enabled: false,
            email_flow_id: '',
            order_bump_enabled: false,
            order_bump: {
                title: '',
                price: '',
                description: '',
                image_url: ''
            },
            affiliates_enabled: false,
            affiliates_commission: '20'
        }
    });

    const updateData = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);



    const handleSave = async () => {
        if (isSaving) return;
        await onSave({
            ...formData,
            price: parseFloat(formData.price) || 0,
            discount_price: parseFloat(formData.discount_price) || 0,
            type: 'coaching_call'
        });
    };

    return (
        <div className="flex-1 flex overflow-hidden bg-[#FDFDFF]">
            {/* Left Side: Editor */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Internal Tabs - Stan Style Pills */}
                <div className="flex items-center gap-4 px-6 h-24 relative z-10 bg-[#FDFDFF]">
                    <TabButton active={activeTab === 'checkout'} onClick={() => handleTabChange('checkout')} icon={<ShoppingBag className="w-4 h-4" />} label="Ödeme Sayfası" />
                    <TabButton active={activeTab === 'availability'} onClick={() => handleTabChange('availability')} icon={<Calendar className="w-4 h-4" />} label="Müsaitlik" />
                    <TabButton active={activeTab === 'options'} onClick={() => handleTabChange('options')} icon={<Sparkles className="w-4 h-4" />} label="Seçenekler" />
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    <div className="max-w-[800px] space-y-16 pb-24">

                        {activeTab === 'checkout' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                                {/* Section 1: Image */}
                                <EditorSection number={1} title="Görsel Seç">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 flex items-center gap-10 group transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <div className="relative w-40 h-40 rounded-[32px] overflow-hidden bg-slate-50 border-2 border-slate-50 shadow-inner group-hover:scale-[1.02] transition-transform">
                                            {formData.image_url ? (
                                                <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                    <ImageLucide className="w-10 h-10" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => setIsImageModalOpen(true)} className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                                                    <Upload className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <h4 className="text-[17px] font-black text-slate-900 tracking-tight leading-none">Görselinizi Buraya Sürükleyin</h4>
                                                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wider">Önerilen: 1920 x 1080</p>
                                            </div>
                                            <button onClick={() => setIsImageModalOpen(true)} className="h-14 px-8 rounded-2xl border-2 border-[#5500ff]/10 text-[#5500ff] font-black text-[14px] hover:bg-[#5500ff] hover:text-white transition-all shadow-sm">
                                                Görsel Seç
                                            </button>
                                        </div>
                                    </div>
                                </EditorSection>

                                {/* Section 2: Description */}
                                <EditorSection number={2} title="Açıklama Yazın">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-10 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                                        <PremiumInput label="Başlık *" value={formData.title} onChange={(e) => updateData('title', e.target.value)} placeholder="Book a 1:1 Call" />
                                        <DescriptionEditor value={formData.description} onChange={(val) => updateData('description', val)} />
                                        <PremiumInput label="Alt Başlık *" value={formData.bottom_title} onChange={(e) => updateData('bottom_title', e.target.value)} placeholder="Work With Me 1:1" />
                                        <PremiumInput label="Harekete Geçirme Düğmesi *" value={formData.button_text} onChange={(e) => updateData('button_text', e.target.value)} placeholder="Book a Call" />
                                    </div>
                                </EditorSection>

                                {/* Section 3: Pricing */}
                                <EditorSection number={3} title="Fiyatı Belirle">
                                    <PricingSection data={formData as any} onChange={updateData as any} />
                                </EditorSection>

                                {/* Section 4: Collect Info */}
                                <EditorSection number={4} title="Bilgi Topla">
                                    <FieldManager
                                        fields={formData.fields}
                                        updateField={(idx, label) => {
                                            const newFields = [...formData.fields];
                                            newFields[idx].label = label;
                                            updateData('fields', newFields);
                                        }}
                                        removeField={(idx) => {
                                            updateData('fields', formData.fields.filter((_: any, i: number) => i !== idx));
                                        }}
                                        addField={(type, label) => {
                                            updateData('fields', [...formData.fields, { label, placeholder: label, type }]);
                                            setIsAddFieldMenuOpen(false);
                                        }}
                                        isAddFieldMenuOpen={isAddFieldMenuOpen}
                                        setIsAddFieldMenuOpen={setIsAddFieldMenuOpen}
                                        updateOption={() => { }}
                                        addOption={() => { }}
                                        removeOption={() => { }}
                                    />
                                </EditorSection>
                            </motion.div>
                        )}


                        {activeTab === 'availability' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                                {/* Calendly Integration */}
                                <EditorSection number={1} title="Takvim Bağlantısı (Calendly / Cal.com)">
                                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/10 space-y-6 transition-all hover:shadow-2xl hover:shadow-slate-200/20">
                                        <p className="text-[14px] text-slate-500 font-medium">
                                            Müşterileriniz ödemeyi tamamladıktan sonra otomatik olarak bu takvim bağlantısına yönlendirilecek veya ekranda göreceklerdir. Ücretsiz Calendly veya Cal.com bağlantınızı buraya yapıştırabilirsiniz.
                                        </p>
                                        <div className="space-y-4">
                                            <p className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1">Takvim Linki *</p>
                                            <PremiumInput
                                                value={formData.calendly_url}
                                                onChange={(e) => updateData('calendly_url', e.target.value)}
                                                placeholder="Örn: https://calendly.com/kullaniciadi/30dk"
                                            />
                                        </div>
                                    </div>
                                </EditorSection>
                            </motion.div>
                        )}

                        {activeTab === 'options' && (
                            <AdvancedOptionsEditor
                                options={formData.options}
                                updateOptions={(newOptions) => updateData('options', newOptions)}
                                onOpenImageSelector={() => setIsImageModalOpen(true)}
                            />
                        )}

                        {/* Unified Action Bar (End of Content) */}
                        <div className="pt-20 border-t border-slate-100 mt-10">
                            <div className="flex items-center justify-between">
                                {activeTab === 'options' ? (
                                    <button className="flex items-center gap-2 text-rose-500 font-extrabold text-[13px] px-6 h-14 rounded-2xl hover:bg-rose-50 transition-all">
                                        <Trash2 className="w-5 h-5" /> Sil
                                    </button>
                                ) : (
                                    <p className="text-[12px] text-slate-300 font-black italic">Bu sayfayı iyileştirin</p>
                                )}

                                <div className="flex items-center gap-4">
                                    <button className="h-14 px-8 rounded-2xl font-black text-[14px] text-slate-400 hover:text-slate-900 transition-colors">
                                        Taslak Olarak Kaydet
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (activeTab === 'checkout') handleTabChange('availability');
                                            else if (activeTab === 'availability') handleTabChange('options');
                                            else handleSave();
                                        }}
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
                                        ) : activeTab === 'options' ? (
                                            'Yayınla ✨'
                                        ) : (
                                            'Sonraki'
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
                    onSelect={(url) => updateData('image_url', url)}
                />
            </div>

            {/* Right Side: Preview (The Mockup) */}
            <div className="hidden xl:flex w-[620px] bg-[#FDFDFF] border-l border-slate-100 items-center justify-center p-12 relative overflow-hidden shrink-0">
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
                    {/* Inner Screen */}
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
                                <LiveCoachingPreview
                                    data={{
                                        ...formData,
                                        price: parseFloat(formData.price) || 0
                                    }}
                                />
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-100/30 rounded-full z-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LocationSelect({ value, onChange }: { value: string, onChange: (id: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const locations = [
        { id: 'google_meet', label: 'Google Meet', icon: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-64dp/logo_meet_2020q4_color_2x_web_64dp.png' },
        { id: 'zoom', label: 'Zoom Toplantısı', icon: 'https://marketplace-cdn.zoom.us/9H8_I7_oR_-Syy6Yy_uW0A/z8T6p2l2T_G-KID-O6B_Aw/image.png' },
        { id: 'custom', label: 'Özel Konum', lucide: <Calendar className="w-5 h-5" /> },
        { id: 'varsayilan', label: 'Varsayılan', lucide: <Calendar className="w-5 h-5" /> }
    ];

    const current = locations.find(l => l.id === value) || locations[3];

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-16 px-6 bg-white border-2 rounded-2xl flex items-center justify-between transition-all",
                    isOpen ? "border-[#5500ff] shadow-lg shadow-[#5500ff]/5" : "border-slate-100 hover:border-slate-200"
                )}
            >
                <div className="flex items-center gap-4">
                    {current.id === 'google_meet' ? (
                        <img src={current.icon} className="w-6 h-6 object-contain" />
                    ) : current.id === 'zoom' ? (
                        <div className="p-1.5 rounded-lg bg-[#2D8CFF] flex items-center justify-center">
                            <img src={current.icon} className="w-4 h-4 object-contain invert" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5500ff]">
                            <Calendar className="w-5 h-5" />
                        </div>
                    )}
                    <span className="text-[15px] font-black text-slate-800">{current.id === 'varsayilan' ? 'Default' : current.label}</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-50 py-4 overflow-hidden"
                    >
                        {locations.map(loc => (
                            <button
                                key={loc.id}
                                type="button"
                                onClick={() => {
                                    onChange(loc.id);
                                    setIsOpen(false);
                                }}
                                className="w-full h-16 px-8 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {loc.id === 'google_meet' ? <img src={loc.icon} className="w-6 h-6" /> :
                                        loc.id === 'zoom' ? (
                                            <div className="p-1 rounded-md bg-[#2D8CFF] flex items-center justify-center">
                                                <img src={loc.icon} className="w-3.5 h-3.5 invert" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5500ff]"><Calendar className="w-4 h-4" /></div>
                                        )}
                                </div>
                                <span className="text-[15px] font-black text-slate-800">{loc.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface TimeItem {
    raw: string;
    display: string;
    simple: string;
}

function TimePicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Generate times every 15 mins
    const times: TimeItem[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hour = h.toString().padStart(2, '0');
            const min = m.toString().padStart(2, '0');
            const isPM = h >= 12;
            const period = isPM ? 'PM' : 'AM';
            const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
            times.push({
                raw: `${hour}:${min}`,
                display: `${displayH}:${min} ${period}`,
                simple: `${hour}:${min}`
            });
        }
    }

    React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            // Close on scroll if needed, but let's see if keeping it open is better
            // If we want to allow site scrolling, we should probably close it or let it follow.
            // Actually, the user says they can't scroll the site.
            // If we let them scroll the site, the absolute menu will stay fixed relative to the button.
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    React.useEffect(() => {
        if (isOpen && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Target time: if value exists, scroll to value, otherwise scroll to 09:00
            const targetTime = value || '09:00';
            const targetIndex = times.findIndex(t => t.raw === targetTime);
            if (targetIndex !== -1) {
                const itemHeight = 44; // h-11 = 2.75rem = 44px
                container.scrollTop = targetIndex * itemHeight - (container.clientHeight / 2) + (itemHeight / 2);
            }
        }
    }, [isOpen, value, times]);

    const currentDisplay = times.find(t => t.raw === value)?.display || value;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "h-12 px-5 bg-white border border-slate-100 rounded-xl flex items-center justify-between gap-3 min-w-[130px] hover:border-slate-300 transition-all shadow-sm",
                    isOpen && "border-[#5500ff] ring-4 ring-[#5500ff]/5"
                )}
            >
                <span className="text-[14px] font-black text-slate-800">{currentDisplay}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-44 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[70] h-[300px] flex flex-col overflow-hidden"
                    >
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-y-auto custom-scrollbar p-2"
                        >
                            {times.map(t => (
                                <button
                                    key={t.raw}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(t.raw);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full h-11 px-4 flex items-center text-[14px] font-black rounded-lg transition-colors text-left",
                                        t.raw === value ? "bg-[#5500ff]/5 text-[#5500ff]" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {t.display}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AccordionItem({ id, title, icon, children, isOpen, onToggle }: any) {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100/60 shadow-sm overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-7 hover:bg-slate-50 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#5500ff] transition-colors">
                        {icon}
                    </div>
                    <span className="text-[15px] font-black text-slate-800">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-50"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
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

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    small?: boolean;
}

function CustomSelect({ value, onChange, options, small = false }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const currentLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold text-slate-800 outline-none focus:border-[#5500ff] focus:bg-white transition-all shadow-sm",
                    small ? "h-12" : "h-14",
                    isOpen && "border-[#5500ff] bg-white ring-4 ring-[#5500ff]/5 shadow-lg"
                )}
            >
                <span className="truncate">{currentLabel}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-[240px] overflow-y-auto custom-scrollbar p-2"
                    >
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full h-11 px-4 flex items-center text-[14px] font-bold rounded-xl transition-all text-left",
                                    opt.value === value ? "bg-[#5500ff]/5 text-[#5500ff]" : "text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
