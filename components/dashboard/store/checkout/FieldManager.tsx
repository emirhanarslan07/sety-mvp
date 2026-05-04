'use client';

import React from 'react';
import { Trash2, Plus, X, ChevronDown, CheckSquare, List, AlignLeft, Phone, Mail, User, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';

interface FormField {
    label: string;
    placeholder: string;
    type: string;
    options?: string[];
}

interface FieldManagerProps {
    fields: FormField[];
    updateField: (index: number, label: string) => void;
    removeField: (index: number) => void;
    updateOption: (fieldIdx: number, optIdx: number, val: string) => void;
    addOption: (fieldIdx: number) => void;
    removeOption: (fieldIdx: number, optIdx: number) => void;
    addField: (type: string, label: string) => void;
    isAddFieldMenuOpen: boolean;
    setIsAddFieldMenuOpen: (open: boolean) => void;
}

export function FieldManager({
    fields,
    updateField,
    removeField,
    updateOption,
    addOption,
    removeOption,
    addField,
    isAddFieldMenuOpen,
    setIsAddFieldMenuOpen
}: FieldManagerProps) {
    const { t } = useTranslation();

    // Menu options for adding new fields
    const ADD_FIELD_OPTIONS = [
        {
            id: 'phone',
            label: t('dashboard.store.editors.fields_manager.types.phone'),
            description: t('dashboard.store.editors.fields_manager.types.phone_desc'),
            icon: Phone,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            id: 'text',
            label: t('dashboard.store.editors.fields_manager.types.text'),
            description: t('dashboard.store.editors.fields_manager.types.text_desc'),
            icon: AlignLeft,
            color: 'text-slate-500',
            bg: 'bg-slate-100',
        },
        {
            id: 'multiple',
            label: t('dashboard.store.editors.fields_manager.types.multiple'),
            description: t('dashboard.store.editors.fields_manager.types.multiple_desc'),
            icon: List,
            color: 'text-violet-500',
            bg: 'bg-violet-50',
        },
        {
            id: 'dropdown',
            label: t('dashboard.store.editors.fields_manager.types.dropdown'),
            description: t('dashboard.store.editors.fields_manager.types.dropdown_desc'),
            icon: ChevronDown,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
        },
        {
            id: 'checkbox',
            label: t('dashboard.store.editors.fields_manager.types.checkbox'),
            description: t('dashboard.store.editors.fields_manager.types.checkbox_desc'),
            icon: CheckSquare,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
    ];

    // Type → display config for existing fields
    const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
        text: { icon: AlignLeft, color: 'text-slate-400', bg: 'bg-slate-100', label: t('dashboard.store.editors.fields_manager.types.text') },
        email: { icon: Mail, color: 'text-violet-500', bg: 'bg-violet-50', label: t('dashboard.store.editors.fields_manager.types.email') },
        phone: { icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50', label: t('dashboard.store.editors.fields_manager.types.phone') },
        multiple: { icon: List, color: 'text-violet-500', bg: 'bg-violet-50', label: t('dashboard.store.editors.fields_manager.types.multiple') },
        dropdown: { icon: ChevronDown, color: 'text-amber-500', bg: 'bg-amber-50', label: t('dashboard.store.editors.fields_manager.types.dropdown') },
        checkbox: { icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', label: t('dashboard.store.editors.fields_manager.types.checkbox') },
    };

    // Base (locked) field icons
    const BASE_FIELD_ICONS: Record<number, React.ElementType> = {
        0: User,
        1: Mail,
    };

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100/60 shadow-xl shadow-slate-200/20 space-y-6 transition-all hover:shadow-2xl hover:shadow-slate-200/30">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h5 className="text-[16px] font-black text-slate-900 tracking-tight">{t('dashboard.store.editors.fields_manager.title')}</h5>
                    <p className="text-[12px] text-slate-400 font-semibold mt-0.5">{t('dashboard.store.editors.fields_manager.subtitle')}</p>
                </div>
            </div>

            {/* Locked/Base Fields */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">{t('dashboard.store.editors.fields_manager.required_section')}</p>
                {fields.slice(0, 2).map((field, idx) => {
                    const cfg = TYPE_CONFIG[field.type] || TYPE_CONFIG['text'];
                    const Icon = BASE_FIELD_ICONS[idx] || cfg.icon;
                    return (
                        <div key={idx} className="flex items-center gap-3 px-5 h-14 bg-slate-50/80 border border-slate-100 rounded-2xl">
                            <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[14px] font-bold text-slate-700 flex-1">{field.label}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('dashboard.store.editors.fields_manager.required_badge')}</span>
                        </div>
                    );
                })}
            </div>

            {/* Custom Fields */}
            {fields.length > 2 && (
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">{t('dashboard.store.editors.fields_manager.extra_section')}</p>
                    {fields.slice(2).map((field, relIdx) => {
                        const idx = relIdx + 2;
                        const cfg = TYPE_CONFIG[field.type] || TYPE_CONFIG['text'];
                        const Icon = cfg.icon;
                        return (
                            <div key={idx} className="group space-y-0">
                                <div className="flex items-center gap-3 px-4 h-14 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-all">
                                    {/* Drag handle hint */}
                                    <GripVertical className="w-4 h-4 text-slate-200 shrink-0" />

                                    {/* Type icon */}
                                    <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>

                                    {/* Editable label */}
                                    <input
                                        value={field.label}
                                        onChange={(e) => updateField(idx, e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-[14px] font-bold text-slate-800 placeholder:text-slate-300"
                                        placeholder={t('dashboard.store.editors.fields_manager.placeholder_name')}
                                    />

                                    {/* Type pill */}
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} shrink-0`}>
                                        {cfg.label}
                                    </span>

                                    {/* Delete */}
                                    <button
                                        onClick={() => removeField(idx)}
                                        className="w-8 h-8 rounded-xl bg-rose-50 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Options for multiple & dropdown */}
                                {(field.type === 'multiple' || field.type === 'dropdown') && (
                                    <div className="mx-2 mb-2 mt-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">
                                            {field.type === 'multiple' ? t('dashboard.store.editors.fields_manager.options_title') : t('dashboard.store.editors.fields_manager.menu_items_title')}
                                        </p>
                                        {field.options && field.options.length > 0 ? (
                                            field.options.map((opt, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-2.5 group/opt">
                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${field.type === 'multiple' ? 'border-violet-300' : 'border-amber-300'
                                                        }`} />
                                                    <input
                                                        value={opt}
                                                        onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                                                        className="flex-1 bg-white border border-slate-100 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-slate-700 focus:border-[#5500ff]/30 focus:ring-2 focus:ring-[#5500ff]/5 outline-none transition-all placeholder:text-slate-300"
                                                        placeholder={`${t('dashboard.store.editors.fields_manager.options_title')} ${optIdx + 1}`}
                                                    />
                                                    <button
                                                        onClick={() => removeOption(idx, optIdx)}
                                                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all opacity-0 group-hover/opt:opacity-100"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[12px] text-slate-300 font-medium text-center py-2">{t('dashboard.store.editors.fields_manager.no_options')}</p>
                                        )}
                                        <button
                                            onClick={() => addOption(idx)}
                                            className="flex items-center gap-2 text-[12px] font-bold text-[#5500ff]/60 hover:text-[#5500ff] transition-colors mt-1 ml-6"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            {t('dashboard.store.editors.fields_manager.add_option')}
                                        </button>
                                    </div>
                                )}

                                {/* Checkbox preview */}
                                {field.type === 'checkbox' && (
                                    <div className="mx-2 mb-2 mt-0 bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">{t('dashboard.store.editors.fields_manager.preview_title')}</p>
                                        <div className="flex items-start gap-3 px-1">
                                            <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white mt-0.5 shrink-0 flex items-center justify-center shadow-sm">
                                            </div>
                                            <p className="text-[13px] font-medium text-slate-500 leading-snug">
                                                {field.label || t('dashboard.store.editors.fields_manager.checkbox_hint_default')}
                                            </p>
                                        </div>
                                        <p className="text-[11px] text-emerald-500/70 font-medium mt-3 ml-1">{t('dashboard.store.editors.fields_manager.checkbox_hint')}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Field Button */}
            <div className="relative">
                <button
                    onClick={() => setIsAddFieldMenuOpen(!isAddFieldMenuOpen)}
                    className="w-full h-12 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[14px] hover:border-[#5500ff]/30 hover:text-[#5500ff] hover:bg-[#5500ff]/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    {t('dashboard.store.editors.fields_manager.add_field_button')}
                </button>

                <AnimatePresence>
                    {isAddFieldMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsAddFieldMenuOpen(false)}
                                className="fixed inset-0 z-40"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-[28px] shadow-2xl border border-slate-100/80 overflow-hidden z-50 p-3 space-y-1"
                            >
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-3 py-1">{t('dashboard.store.editors.fields_manager.select_type_title')}</p>
                                {ADD_FIELD_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { addField(opt.id, opt.label.split(' ')[0]); setIsAddFieldMenuOpen(false); }}
                                        className="w-full h-14 px-4 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-colors group text-left"
                                    >
                                        <div className={`w-10 h-10 rounded-2xl ${opt.bg} flex items-center justify-center ${opt.color} shrink-0 group-hover:scale-110 transition-transform`}>
                                            <opt.icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-bold text-slate-700 leading-tight">{opt.label}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{opt.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
