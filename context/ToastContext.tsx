'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 11);
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (type !== 'loading' && duration > 0) {
            setTimeout(() => hideToast(id), duration);
        }

        return id;
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[320px] max-w-[420px]",
                                toast.type === 'success' && "bg-white/95 border-emerald-100 text-emerald-900 shadow-emerald-500/10",
                                toast.type === 'error' && "bg-white/95 border-rose-100 text-rose-900 shadow-rose-500/10",
                                toast.type === 'info' && "bg-white/95 border-blue-100 text-blue-900 shadow-blue-500/10",
                                toast.type === 'loading' && "bg-white/95 border-slate-100 text-slate-900 shadow-slate-500/10"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                                toast.type === 'success' && "bg-emerald-50 text-emerald-600",
                                toast.type === 'error' && "bg-rose-50 text-rose-600",
                                toast.type === 'info' && "bg-blue-50 text-blue-600",
                                toast.type === 'loading' && "bg-slate-50 text-slate-600"
                            )}>
                                {toast.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
                                {toast.type === 'info' && <Info className="w-6 h-6" />}
                                {toast.type === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <p className="text-[14px] font-bold leading-tight tracking-tight">
                                    {toast.message}
                                </p>
                            </div>

                            <button
                                onClick={() => hideToast(toast.id)}
                                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
