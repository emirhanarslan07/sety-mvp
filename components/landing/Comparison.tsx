'use client';

import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useTranslation } from '@/lib/i18n/context';
import { useAuthModal } from '@/context/AuthModalContext';

export function Comparison() {
    const { t } = useTranslation();
    const { openModal } = useAuthModal();
    return (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                        {t('landing.comparison.title')}<span className="text-[#5500ff]">{t('landing.comparison.title_accent')}</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        {t('landing.comparison.subtitle')}
                    </p>
                </div>

                <div className="max-w-2xl mx-auto items-stretch">
                    {/* Sety Card */}
                    <div className="flex flex-col">
                        <div className="mb-8 flex items-center justify-center gap-4 px-4">
                            <SetyLogo size="lg" />
                            <h3 translate="no" className="notranslate text-4xl font-bold text-slate-900 tracking-tight">{t('landing.comparison.sety.title')}</h3>
                        </div>

                        <div className="bg-white rounded-[48px] p-10 md:p-14 border border-slate-100 flex-grow flex flex-col shadow-sm hover:shadow-md transition-all duration-500">
                            <div className="flex-grow">
                                <ul className="space-y-6 mb-12">
                                    {(t('landing.comparison.sety.items', { returnObjects: true }) as string[]).map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-700">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <Check className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <span className="font-bold text-lg md:text-xl tracking-tight">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-10 border-t border-slate-200 mt-auto text-center">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t('landing.comparison.sety.cost_label')}</div>
                                <div className="flex justify-center items-baseline gap-2">
                                    <span className="text-4xl md:text-5xl font-extrabold text-[#5500ff] tracking-tight leading-none">{t('landing.comparison.sety.price')}</span>
                                    {t('landing.comparison.sety.period') && (
                                        <span className="text-xl text-slate-400 font-bold uppercase tracking-tight"><span className="italic mr-0.5">/</span>{t('landing.comparison.sety.period').replace('/', '')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="mt-24 max-w-5xl mx-auto">
                    <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(85,0,255,0.2)]">
                        {/* Subtle Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#5500ff] to-transparent opacity-50" />

                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
                                {t('landing.comparison.banner.title')}<span className="text-[#5500ff] drop-shadow-[0_0_20px_rgba(85,0,255,0.4)]">{t('landing.comparison.banner.title_accent')}</span> {t('landing.comparison.banner.title_end')}
                            </h3>
                            <p className="text-slate-300 font-bold text-xl mb-12 max-w-4xl mx-auto leading-relaxed">
                                {t('landing.comparison.banner.description')}<span className="text-white underline decoration-[#5500ff] underline-offset-8">{t('landing.comparison.banner.description_accent')}</span>{t('landing.comparison.banner.description_end')}
                            </p>
                            <div className="flex justify-center">
                                <Button onClick={() => openModal('signup')} size="xl" className="bg-[#5500ff] hover:bg-[#4a00e6] text-white rounded-full px-8 md:px-16 font-black h-16 md:h-20 text-lg md:text-xl transition-all hover:scale-105 shadow-[0_15px_30px_rgba(85,0,255,0.3)] border-none w-full md:w-auto">
                                    <span className="hidden md:inline text-xl">{t('landing.comparison.banner.button')}</span>
                                    <span className="md:hidden text-lg">{t('landing.comparison.banner.button_mobile')}</span>
                                    <ArrowRight className="ml-3 w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
