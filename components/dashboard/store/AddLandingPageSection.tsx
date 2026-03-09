'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Mail, Download, Clock, Sparkles, Play, CreditCard, Video, Users2, Book, MessageSquare, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';

export const landingPageTypes = [
    {
        id: 'collect_emails',
        title: 'E-postaları / Başvuruları Topla',
        description: 'Potansiyel müşteri bilgilerini bir çekme aracıyla toplayın.',
        icon: Mail,
        color: 'bg-indigo-50 text-indigo-600',
    },
    {
        id: 'digital_product',
        title: 'Dijital Ürün',
        description: 'PDF\'ler, kılavuzlar, şablonlar, e-kitaplar vb. satın.',
        icon: Download,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        id: 'coaching_call',
        title: 'Koçluk Görüşmesi',
        description: 'Tanışma görüşmeleri ve ücretli koçluk hizmetleri sunun.',
        icon: Clock,
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        id: 'ask_me_anything',
        title: 'Soru-Cevap (AMA)',
        description: 'Takipçilerinizin size ücretli sorular sormasını sağlayın.',
        icon: MessageSquare,
        color: 'bg-teal-50 text-teal-600',
    },
    {
        id: 'private_group',
        title: 'Özel Erişim / Kapalı Grup',
        description: 'Telegram veya Instagram Yakın Arkadaşlar erişimi satın.',
        icon: ShieldCheck,
        color: 'bg-rose-50 text-rose-600',
    },
    {
        id: 'custom_product',
        title: 'Özel Ürün',
        description: 'Denetimler, analizler veya kişiye özel video incelemeleri.',
        icon: Sparkles,
        color: 'bg-amber-50 text-amber-600',
    },
];

interface AddLandingPageSectionProps {
    onBack: () => void;
    onSelectType: (type: any) => void;
}

export default function AddLandingPageSection({
    onBack,
    onSelectType,
}: AddLandingPageSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-slate-400 hover:text-slate-900 font-bold transition-all group"
                >
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    {t('store.actions.back')}
                </button>
            </div>

            <div className="space-y-2 text-center max-w-2xl mx-auto">
                <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-tight">
                    {t('store.pages.empty_title')}
                </h2>
                <p className="text-slate-400 font-bold text-lg leading-relaxed">
                    {t('store.pages.empty_desc')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingPageTypes.map((type) => (
                    <motion.button
                        key={type.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectType(type)}
                        className={cn(
                            "p-7 rounded-[32px] bg-white border border-slate-100/60 text-left flex items-center gap-6 transition-all group relative overflow-hidden",
                            "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:border-[#5500ff]/10"
                        )}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-white/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 relative shadow-sm group-hover:shadow-md overflow-hidden",
                            type.color
                        )}>
                            {/* The "White Line" on top detayı */}
                            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40 z-20" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                            {type.id === 'sety_affiliate' ? (
                                <SetyLogo size="sm" showBackground={false} />
                            ) : type.iconUrl ? (
                                <img
                                    src={type.iconUrl}
                                    className="w-10 h-10 object-contain relative z-10 transition-transform group-hover:scale-110 duration-500"
                                    alt=""
                                />
                            ) : (
                                <type.icon className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110 duration-500" strokeWidth={2.5} />
                            )}
                        </div>
                        <div className="flex-1 relative z-10">
                            <h4 className="text-[17px] font-extrabold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors mb-1.5">
                                {t(`store.product_types.${type.id}.title`) || type.title}
                            </h4>
                            <p className="text-[14px] font-bold text-slate-400 leading-snug group-hover:text-slate-500 transition-colors">
                                {t(`store.product_types.${type.id}.desc`) || type.description}
                            </p>
                        </div>
                        <div className="relative z-10 w-11 h-11 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-[#5500ff] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1 shadow-sm group-hover:shadow-md">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
