'use client';

import { motion } from 'framer-motion';
import { Zap, User, Sparkles, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step2GoalsProps {
    selectedGoal: string | null;
    setSelectedGoal: (id: string | null) => void;
}

export function Step2Goals({ selectedGoal, setSelectedGoal }: Step2GoalsProps) {
    const goals = [
        { id: 'passive_income', label: 'Dijital Ürün Satmak', description: 'E-kitap, kurs ve rehberlerinle pasif gelir elde et.', icon: <Zap className="w-6 h-6" />, color: 'text-amber-500 bg-amber-50 border-amber-100' },
        { id: 'professional_brand', label: 'Markanı İnşa Etmek', description: 'Güven veren, profesyonel bir link-in-bio sayfası.', icon: <User className="w-6 h-6" />, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
        { id: 'booking', label: 'Randevu & Danışmanlık', description: 'Takvimini yönet ve zamanını paraya dönüştür.', icon: <Sparkles className="w-6 h-6" />, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
        { id: 'services', label: 'Kişiye Özel Çözümler', description: 'Uzmanlığını dijital hizmete dönüştür.', icon: <Globe className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    ];

    return (
        <motion.div
            key="signup-step-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 gap-4 w-full"
        >
            {goals.map((goal) => (
                <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-[24px] border-2 transition-all duration-300 text-left group relative overflow-hidden",
                        selectedGoal === goal.id
                            ? "border-[#5500ff] bg-[#5500ff]/5 shadow-md shadow-[#5500ff]/10"
                            : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                >
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110",
                        goal.color
                    )}>
                        {goal.icon}
                    </div>
                    <div className="flex-1">
                        <h4 className={cn(
                            "text-[15px] font-bold transition-colors",
                            selectedGoal === goal.id ? "text-[#5500ff]" : "text-slate-900"
                        )}>
                            {goal.label}
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5">
                            {goal.description}
                        </p>
                    </div>
                    <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedGoal === goal.id
                            ? "border-[#5500ff] bg-[#5500ff]"
                            : "border-slate-200 group-hover:border-slate-300"
                    )}>
                        {selectedGoal === goal.id && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                    </div>
                </button>
            ))}
        </motion.div>
    );
}
