'use client';

import React, { useState } from 'react';
import {
    MessageSquare,
    Mail,
    Bell,
    TrendingUp,
    Users,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Upload,
    Sparkles,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { useTranslation } from '@/lib/i18n';

interface AdvancedOptionsEditorProps {
    options: any;
    updateOptions: (newOptions: any) => void;
    onOpenImageSelector: () => void;
}

export default function AdvancedOptionsEditor({
    options,
    updateOptions,
    onOpenImageSelector
}: AdvancedOptionsEditorProps) {
    const [showAddReview, setShowAddReview] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', text: '', avatar: '' });
    const [openOptions, setOpenOptions] = useState<string[]>(['reviews']);

    const { t } = useTranslation();

    const toggleOption = (id: string) => {
        setOpenOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const updateField = (field: string, value: any) => {
        updateOptions({ ...options, [field]: value });
    };

    const handleAddReview = () => {
        if (newReview.name && newReview.text) {
            updateField('reviews', [...(options.reviews || []), { ...newReview, rating: 5 }]);
            setNewReview({ name: '', text: '', avatar: '' });
            setShowAddReview(false);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Customer Reviews */}
            <AccordionItem
                id="reviews"
                title={t('dashboard.store.editors.reviews.title')}
                icon={<MessageSquare className="w-5 h-5" />}
                isOpen={openOptions.includes('reviews')}
                onToggle={() => toggleOption('reviews')}
            >
                <div className="p-8 space-y-6">
                    <p className="text-[14px] text-slate-500 font-medium italic">{t('dashboard.store.editors.reviews.subtitle')}</p>

                    {options.reviews?.length > 0 && (
                        <div className="space-y-4">
                            {options.reviews.map((rev: any, idx: number) => (
                                <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-50">
                                            {rev.avatar && <img src={rev.avatar} className="w-full h-full object-cover" alt="" />}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-black text-slate-900">{rev.name}</p>
                                            <p className="text-[12px] text-slate-400 font-bold truncate max-w-[300px]">{rev.text}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newRevs = options.reviews.filter((_: any, i: number) => i !== idx);
                                            updateField('reviews', newRevs);
                                        }}
                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <AnimatePresence>
                        {showAddReview ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4"
                            >
                                <PremiumInput
                                    label={t('dashboard.store.editors.reviews.name_label')}
                                    placeholder={t('dashboard.store.editors.reviews.name_placeholder')}
                                    value={newReview.name}
                                    onChange={(e: any) => setNewReview({ ...newReview, name: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard.store.editors.reviews.text_label')}</p>
                                    <textarea
                                        value={newReview.text}
                                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                        className="w-full h-24 p-4 bg-white border border-slate-100 rounded-2xl text-[14px] font-medium outline-none resize-none"
                                        placeholder={t('dashboard.store.editors.reviews.text_placeholder')}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddReview}
                                        disabled={!newReview.name || !newReview.text}
                                        className="flex-1 h-12 rounded-xl bg-[#5500ff] text-white font-black text-[13px] hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {t('common.save')}
                                    </button>
                                    <button
                                        onClick={() => setShowAddReview(false)}
                                        className="h-12 px-6 rounded-xl border border-slate-200 text-slate-500 font-black text-[13px] hover:bg-white transition-all"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <button
                                onClick={() => setShowAddReview(true)}
                                className="h-12 px-6 rounded-xl border-2 border-[#5500ff]/10 text-[#5500ff] font-black text-[13px] hover:bg-[#5500ff]/5 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> {t('dashboard.store.editors.reviews.add_button')}
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </AccordionItem>

            {/* Email Flow */}
            <AccordionItem
                id="emails"
                title={t('dashboard.store.editors.emails.title')}
                icon={<Mail className="w-5 h-5" />}
                isOpen={openOptions.includes('emails')}
                onToggle={() => toggleOption('emails')}
            >
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-900">{t('dashboard.store.editors.emails.flow_title')}</h4>
                            <p className="text-[13px] text-slate-400 font-bold italic">{t('dashboard.store.editors.emails.flow_subtitle')}</p>
                        </div>
                        <button
                            onClick={() => updateField('email_flow_enabled', !options.email_flow_enabled)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                options.email_flow_enabled ? "bg-[#5500ff]" : "bg-slate-200"
                            )}
                        >
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", options.email_flow_enabled ? "translate-x-6" : "translate-x-0")} />
                        </button>
                    </div>

                    {options.email_flow_enabled && (
                        <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-4">
                                <p className="text-[14px] font-black text-slate-700">{t('dashboard.store.editors.emails.select_flow')}</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {(t('dashboard.store.editors.emails.flows', { returnObjects: true }) as string[]).map(flow => (
                                        <button
                                            key={flow}
                                            onClick={() => updateField('email_flow_id', flow)}
                                            className={cn(
                                                "w-full h-14 px-6 rounded-2xl border-2 flex items-center justify-between transition-all",
                                                options.email_flow_id === flow ? "border-[#5500ff] bg-white text-[#5500ff]" : "border-white bg-white/50 text-slate-500 hover:border-slate-100"
                                            )}
                                        >
                                            <span className="font-bold text-[14px]">{flow}</span>
                                            {options.email_flow_id === flow && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AccordionItem>

            {/* Email Reminders */}
            <AccordionItem
                id="reminders"
                title={t('dashboard.store.editors.reminders.title')}
                icon={<Bell className="w-5 h-5" />}
                isOpen={openOptions.includes('reminders')}
                onToggle={() => toggleOption('reminders')}
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-900">{t('dashboard.store.editors.reminders.flow_title')}</h4>
                            <p className="text-[13px] text-slate-400 font-bold italic">{t('dashboard.store.editors.reminders.flow_subtitle')}</p>
                        </div>
                        <button
                            onClick={() => updateField('email_reminders_enabled', !options.email_reminders_enabled)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                options.email_reminders_enabled ? "bg-[#5500ff]" : "bg-slate-200"
                            )}
                        >
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", options.email_reminders_enabled ? "translate-x-6" : "translate-x-0")} />
                        </button>
                    </div>

                    {options.email_reminders_enabled && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-4">
                                {options.reminders?.map((rem: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-black text-slate-800">{rem.time} {rem.unit === 'hour' ? t('dashboard.store.editors.reminders.hours') : t('dashboard.store.editors.reminders.days')} {t('dashboard.store.editors.reminders.before')}</p>
                                                <p className="text-[12px] text-slate-400 font-bold">{t('dashboard.store.editors.reminders.automatic')}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            const newRems = options.reminders.filter((_: any, i: number) => i !== idx);
                                            updateField('reminders', newRems);
                                        }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex-1">
                                    <input
                                        type="number"
                                        placeholder={t('dashboard.store.editors.reminders.time_placeholder')}
                                        value={options.newReminderTime || ''}
                                        onChange={e => updateField('newReminderTime', e.target.value)}
                                        className="w-full h-10 bg-transparent outline-none font-bold text-[14px] px-2"
                                    />
                                </div>
                                <span className="text-slate-400 font-bold text-[13px]">{t('dashboard.store.editors.reminders.hours_before')}</span>
                                <button
                                    onClick={() => {
                                        if (!options.newReminderTime) return;
                                        const newRem = { time: options.newReminderTime, unit: 'hour' };
                                        updateField('reminders', [...(options.reminders || []), newRem]);
                                        updateField('newReminderTime', '');
                                    }}
                                    className="w-10 h-10 rounded-xl bg-[#5500ff] text-white flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </AccordionItem>

            {/* Order Bump */}
            <AccordionItem
                id="bump"
                title={t('dashboard.store.editors.bump.title')}
                icon={<TrendingUp className="w-5 h-5" />}
                isOpen={openOptions.includes('bump')}
                onToggle={() => toggleOption('bump')}
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-900">{t('dashboard.store.editors.bump.flow_title')}</h4>
                            <p className="text-[13px] text-slate-400 font-bold italic">{t('dashboard.store.editors.bump.flow_subtitle')}</p>
                        </div>
                        <button
                            onClick={() => updateField('order_bump_enabled', !options.order_bump_enabled)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                options.order_bump_enabled ? "bg-[#5500ff]" : "bg-slate-200"
                            )}
                        >
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", options.order_bump_enabled ? "translate-x-6" : "translate-x-0")} />
                        </button>
                    </div>

                    {options.order_bump_enabled && (
                        <div className="space-y-6 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <PremiumInput
                                label={t('dashboard.store.editors.bump.product_name')}
                                value={options.order_bump?.title || ''}
                                onChange={(e: any) => updateField('order_bump', { ...options.order_bump, title: e.target.value })}
                                placeholder={t('dashboard.store.editors.bump.product_placeholder')}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <PremiumInput
                                    label={t('dashboard.store.editors.bump.price')}
                                    value={options.order_bump?.price || ''}
                                    onChange={(e: any) => updateField('order_bump', { ...options.order_bump, price: e.target.value })}
                                    placeholder="4.99"
                                />
                                <div className="space-y-2">
                                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dashboard.store.editors.bump.select_image')}</p>
                                    <button
                                        className="w-full h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-[#5500ff] transition-colors"
                                        onClick={onOpenImageSelector}
                                    >
                                        <Upload className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('common.description')}</p>
                                <textarea
                                    className="w-full h-24 p-4 bg-white border border-slate-100 rounded-2xl text-[14px] font-medium outline-none resize-none"
                                    value={options.order_bump?.description || ''}
                                    onChange={(e: any) => updateField('order_bump', { ...options.order_bump, description: e.target.value })}
                                    placeholder={t('dashboard.store.editors.bump.desc_placeholder')}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </AccordionItem>

            {/* Affiliate */}
            <AccordionItem
                id="affiliates"
                title={t('dashboard.store.editors.affiliate.title')}
                icon={<Users className="w-5 h-5" />}
                isOpen={openOptions.includes('affiliates')}
                onToggle={() => toggleOption('affiliates')}
            >
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-[15px] font-black text-slate-900">{t('dashboard.store.editors.affiliate.flow_title')}</h4>
                            <p className="text-[13px] text-slate-400 font-bold italic">{t('dashboard.store.editors.affiliate.flow_subtitle')}</p>
                        </div>
                        <button
                            onClick={() => updateField('affiliates_enabled', !options.affiliates_enabled)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                                options.affiliates_enabled ? "bg-[#5500ff]" : "bg-slate-200"
                            )}
                        >
                            <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", options.affiliates_enabled ? "translate-x-6" : "translate-x-0")} />
                        </button>
                    </div>

                    {options.affiliates_enabled && (
                        <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between max-w-xs">
                                <p className="text-[14px] font-black text-slate-700">{t('dashboard.store.editors.affiliate.commission_rate')}</p>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        value={options.affiliates_commission || '20'}
                                        onChange={e => updateField('affiliates_commission', e.target.value)}
                                        className="w-16 h-10 bg-white border border-slate-100 rounded-xl text-center font-black text-[14px] text-[#5500ff] outline-none"
                                    />
                                    <span className="font-black text-slate-400">%</span>
                                </div>
                            </div>
                            <p className="text-[12px] text-slate-400 font-bold mt-4 italic">{t('dashboard.store.editors.affiliate.commission_desc')}</p>
                        </div>
                    )}
                </div>
            </AccordionItem>
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
