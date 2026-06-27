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
        <section id="faq" className="relative py-32 md:py-48 bg-background">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Side: Header */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-8"
                            dangerouslySetInnerHTML={{ __html: t('landing.faq.title').replace(' ', '<br />') }}
                        />
                        <p className="text-muted-foreground text-lg leading-relaxed font-bold max-w-sm">
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
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "bg-card backdrop-blur-md rounded-[24px] border transition-all duration-300 overflow-hidden",
                                        isOpen ? "border-primary/20 shadow-premium" : "border-border/40 hover:border-border shadow-soft"
                                    )}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between p-7 text-left"
                                    >
                                        <span className={cn(
                                            "text-lg font-bold transition-all",
                                            isOpen ? "text-primary" : "text-foreground/70"
                                        )}>
                                            {faq.q}
                                        </span>
                                        <div className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full transition-all border",
                                            isOpen ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border/40"
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
                                                <div className="px-7 pb-7 text-muted-foreground leading-relaxed text-lg font-medium font-jakarta">
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


