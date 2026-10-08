'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useTranslation } from '@/lib/i18n/context';

export function FAQ() {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = t('landing.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;

    return (
        <section id="faq" className="relative py-24 md:py-36 bg-slate-50/50 border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Side: Header */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.05 }}
                            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 font-sans"
                            dangerouslySetInnerHTML={{ __html: t('landing.faq.title').replace(' ', '<br />') }}
                        />
                        <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-sm">
                            {t('landing.faq.subtitle')}
                        </p>
                    </div>

                    {/* Right Side: Accordion */}
                    <div className="lg:col-span-2 space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm",
                                        isOpen ? "border-[#5500ff]/30 shadow-md" : "border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between p-7 text-left"
                                    >
                                        <span className={cn(
                                            "text-lg font-bold transition-all",
                                            isOpen ? "text-[#5500ff]" : "text-slate-900"
                                        )}>
                                            {faq.q}
                                        </span>
                                        <div className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full transition-all border shrink-0 ml-4",
                                            isOpen ? "bg-[#5500ff] text-white border-[#5500ff]" : "bg-slate-50 text-slate-400 border-slate-200"
                                        )}>
                                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-7 pb-7 text-slate-500 leading-relaxed text-base sm:text-lg font-medium font-sans">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}


