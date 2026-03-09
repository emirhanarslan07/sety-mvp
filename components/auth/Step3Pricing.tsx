'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step3PricingProps {
    selectedPlan: 'founder' | 'pro';
    setSelectedPlan: (plan: 'founder' | 'pro') => void;
    founderStats: { founder_count: number; is_full: boolean };
}

export function Step3Pricing({ selectedPlan, setSelectedPlan, founderStats }: Step3PricingProps) {
    return (
        <motion.div
            key="signup-step-3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 w-full"
        >
            {/* Founder / Pro Plan Card */}
            <div className={cn(
                "relative p-8 rounded-[32px] border transition-all duration-500 shadow-2xl overflow-hidden group",
                selectedPlan === 'founder'
                    ? "border-[#5500ff]/20 bg-gradient-to-br from-white via-white to-blue-50/50 shadow-blue-500/10"
                    : "border-slate-200 bg-white shadow-slate-200/50"
            )}>
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h3 className="text-2xl font-semibold text-slate-900 tracking-tight leading-none mb-2 flex items-center gap-2">
                            {selectedPlan === 'founder' ? 'Sety Founder' : 'Sety Pro'}
                            {selectedPlan === 'founder' && <span className="text-xl">🚀</span>}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5500ff]/5 text-[#5500ff] text-[10px] font-bold uppercase tracking-widest">
                            1 Ay Ücretsiz Deneme
                        </div>
                    </div>
                    <div className="bg-[#C4FF00] px-3 py-1.5 rounded-xl shadow-sm">
                        <span className="text-black text-[10px] font-bold whitespace-nowrap uppercase tracking-widest">LANSMAN ÖZEL</span>
                    </div>
                </div>

                <div className="space-y-4 mb-4 relative z-10">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-semibold text-slate-900 tracking-tighter">
                            19$
                        </span>
                        <span className="text-sm font-semibold text-slate-400">/ay</span>
                    </div>
                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">
                        Lansman dönemimize özel, 1 ay boyunca tüm özellikleri ücretsiz deneyin. Sonrasında ayda sadece 19$.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
                <button
                    onClick={() => setSelectedPlan('founder')}
                    disabled={founderStats.is_full}
                    className={cn(
                        "py-3 rounded-xl text-sm font-bold transition-all",
                        selectedPlan === 'founder'
                            ? "bg-white text-[#5500ff] shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Founder
                </button>
                <button
                    onClick={() => setSelectedPlan('pro')}
                    className={cn(
                        "py-3 rounded-xl text-sm font-bold transition-all",
                        selectedPlan === 'pro'
                            ? "bg-white text-[#5500ff] shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Pro
                </button>
            </div>
        </motion.div>
    );
}
