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
            className="group relative bg-card backdrop-blur-xl rounded-[2.5rem] p-10 border border-border/40 hover:border-primary/20 hover:shadow-soft-lg transition-all duration-500 flex flex-col items-center text-center shadow-soft hover:shadow-premium"
        >
            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 border border-primary/10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500 shadow-glow-primary">
                <Icon className="w-8 h-8 text-primary transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
                {title}
            </h3>
            <p className="text-muted-foreground font-medium leading-relaxed mb-8 text-sm">
                {description}
            </p>

            <ul className="space-y-3 mt-auto w-full">
                <li className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
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
        <section className="relative py-32 md:py-48 bg-background overflow-hidden" id="features">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-8 leading-tight md:leading-[1.15]"
                    >
                        {t('landing.features.title')} <br />
                        <span className="text-[#5500ff]">{t('landing.features.title_accent')}</span>
                    </motion.h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto">
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

