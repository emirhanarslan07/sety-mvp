'use client';

import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import Image from 'next/image';

const testimonials = [
    {
        name: 'Sarah Johnson',
        roleKey: 0,
        followers: '45K',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    {
        name: 'Marcus Chen',
        roleKey: 1,
        followers: '120K',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    {
        name: 'Claire Vance',
        roleKey: 2,
        followers: '32K',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
];

export function SocialProof() {
    const { t } = useTranslation();
    return (
        <section className="relative py-32 md:py-48 bg-background overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-foreground"
                        >
                            {t('landing.social_proof.title')} <br />
                            <span className="text-[#5500ff]">{t('landing.social_proof.title_accent')}</span>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimony, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group h-full"
                        >
                            {/* Adaptive Glass Card */}
                            <div className="h-full bg-card backdrop-blur-xl rounded-[32px] border border-border/40 p-8 flex flex-col transition-all duration-500 hover:border-primary/20 hover:shadow-soft-lg shadow-soft hover:shadow-premium">
                                <div className="mb-8">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, starI) => (
                                            <Star key={starI} className="w-4 h-4 fill-primary text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]" />
                                        ))}
                                    </div>
                                    <p className="text-lg md:text-xl font-medium text-foreground/80 leading-relaxed mb-6 italic font-jakarta">
                                        &quot;{(t('landing.social_proof.testimonials', { returnObjects: true }) as any[])[testimony.roleKey].quote}&quot;
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center gap-4 border-t border-border/10 pt-6">
                                    <div className="relative">
                                        <Image
                                            src={testimony.image}
                                            alt={testimony.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10 transition-all duration-500"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-md">
                                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm">{testimony.name}</div>
                                        <div className="text-xs text-muted-foreground font-medium">
                                            {(t('landing.social_proof.testimonials', { returnObjects: true }) as any[])[testimony.roleKey].role} • {testimony.followers} {t('landing.social_proof.followers')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


