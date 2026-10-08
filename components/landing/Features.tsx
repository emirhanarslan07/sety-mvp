'use client';

import { motion } from 'framer-motion';
import {
    Store,
    Link,
    Wallet,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: any;
    footerLabel: string;
    index: number;
}

function FeatureCard({ title, description, icon: Icon, footerLabel, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:border-[#5500ff]/20 hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center shadow-sm"
        >
            <div className="w-16 h-16 bg-[#5500ff]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#5500ff]/20 group-hover:scale-110 transition-all duration-500 text-[#5500ff]">
                <Icon className="w-8 h-8 text-[#5500ff]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
                {description}
            </p>

            <ul className="space-y-3 mt-auto w-full">
                <li className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{footerLabel}</span>
                </li>
            </ul>
        </motion.div>
    );
}

import { useTranslation } from '@/lib/i18n/context';

export function Features() {
    const { t } = useTranslation();

    const icons = [Store, Link, Wallet];

    return (
        <section className="relative py-24 md:py-36 bg-white overflow-hidden border-t border-slate-100" id="features">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 font-sans"
                    >
                        {t('landing.features.title')} <br />
                        <span className="text-[#5500ff]">{t('landing.features.title_accent')}</span>
                    </motion.h2>
                    <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-xl mx-auto">
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[0, 1, 2].map((i) => (
                        <FeatureCard
                            key={i}
                            index={i}
                            title={t(`landing.features.cards.${i}.title`)}
                            description={t(`landing.features.cards.${i}.desc`)}
                            footerLabel={t(`landing.features.cards.${i}.footer`)}
                            icon={icons[i]}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

