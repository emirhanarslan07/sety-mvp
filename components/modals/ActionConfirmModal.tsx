'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'warning';
    isLoading?: boolean;
}

export default function ActionConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Evet, Onayla',
    cancelText = 'Vazgeç',
    variant = 'primary',
    isLoading = false
}: ActionConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
                >
                    <div className="p-8">
                        {/* Icon */}
                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                            variant === 'danger' ? "bg-rose-50 text-rose-500" :
                                variant === 'warning' ? "bg-amber-50 text-amber-500" :
                                    "bg-indigo-50 text-primary"
                        )}>
                            {variant === 'danger' ? <Trash2 className="w-8 h-8" /> :
                                variant === 'warning' ? <AlertCircle className="w-8 h-8" /> :
                                    <HelpCircle className="w-8 h-8" />}
                        </div>

                        {/* Text */}
                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                                    variant === 'danger' ? "bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600" :
                                        variant === 'warning' ? "bg-amber-500 text-white shadow-lg shadow-amber-200 hover:bg-amber-600" :
                                            "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
                                )}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : confirmText}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full h-14 rounded-2xl font-bold text-sm text-slate-400 hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
