'use client';

import { motion } from 'framer-motion';
import { Calendar, Download, BookOpen, Users, Check, ArrowRight } from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';

const creatorUseCases = [
    {
        title: 'Birebir Danışmanlık & 1-on-1 Seanslar',
        target: 'Danışmanlar, Koçlar, Terapistler, Diyetisyenler',
        desc: 'Takvimini ve saatlik ücretini belirle. Danışanların ön talep oluştursun, saatini seçsin ve randevu detayları anında WhatsApp ile cebine gelsin.',
        icon: Calendar,
        iconBg: 'bg-violet-50 text-[#5500ff] border-violet-100',
        examples: ['60 Dk Strateji Seansı', 'Kariyer Koçluğu', 'Beslenme Danışmanlığı', 'Yüz Yüze Görüşme'],
        sampleProduct: {
            label: 'RANDEVU & SEANS',
            title: '1-on-1 Strateji Görüşmesi',
            meta: '60 Dk · Online (Google Meet)',
            price: '₺1.500',
        },
    },
    {
        title: 'Dijital Ürünler & Şablonlar',
        target: 'Tasarımcılar, Yazılımcılar, Notion & Excel Üreticileri',
        desc: 'Dosyanı veya şablon bağlantını bir kez yükle. Takipçin satın aldığı saniyede dosya güvenle teslim edilsin; kargo veya manuel gönderimle uğraşma.',
        icon: Download,
        iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        examples: ['Notion Şablonları', 'Excel Bütçe Tabloları', 'Lightroom Presetleri', 'Figma UI Kit'],
        sampleProduct: {
            label: 'DİJİTAL İNDİRME',
            title: 'Notion Yaşam & Finans Planlayıcı',
            meta: 'Anında Teslimat · Ömür Boyu Erişim',
            price: '₺290',
        },
    },
    {
        title: 'E-Kitaplar & Pratik Kılavuzlar',
        target: 'Yazarlar, Eğitmenler, Fitness & Yaşam Koçları',
        desc: 'Bilgini ve deneyimini derlediğin PDF e-kitapları ve çalışma rehberlerini sat. Alıcıların hem telefonda hem bilgisayarda tek tıkla erişsin.',
        icon: BookOpen,
        iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
        examples: ['30 Günlük Fitness Rehberi', 'Pasif Gelir Kılavuzu', 'Yemek Tarifleri Kitabı', 'Çalışma Sayfaları'],
        sampleProduct: {
            label: 'E-KİTAP & PDF',
            title: '30 Günde Alışkanlık Değişim Rehberi',
            meta: '48 Sayfa PDF + Egzersiz Tablosu',
            price: '₺350',
        },
    },
    {
        title: 'Özel Topluluklar & Mini Kurslar',
        target: 'Topluluk Yöneticileri, Mentorlar, İçerik Üreticileri',
        desc: 'Özel Telegram/Discord grubuna giriş hakkı veya video serilerini listele. Ödemesi onaylanan üyeye anında özel davet bağlantısı iletilsin.',
        icon: Users,
        iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
        examples: ['VIP Telegram Grubu', 'Discord Topluluk Erişimi', 'Haftalık Soru-Cevap', 'Video Masterclass'],
        sampleProduct: {
            label: 'ÖZEL ERİŞİM',
            title: 'İçerik Üreticileri VIP Topluluğu',
            meta: 'Telegram Kanalı + Canlı Yayınlar',
            price: '₺450',
        },
    },
];

export function WhoIsItFor() {
    const { openModal } = useAuthModal();

    return (
        <section id="use-cases" className="py-24 md:py-36 bg-slate-50/50 border-t border-slate-100 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 font-sans text-balance"
                    >
                        Sety ile <span className="text-[#5500ff]">ne satabilirsin?</span>
                    </motion.h2>
                    <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Hangi alanda içerik üretiyor olursan ol; bilgini, zamanını ve dosyalarını dakikalar içinde profesyonel bir vitrinle gelire dönüştür.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {creatorUseCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="group relative bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 hover:border-[#5500ff]/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between shadow-sm"
                            >
                                <div>
                                    {/* Icon & Target */}
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${useCase.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-right">
                                            {useCase.target}
                                        </span>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed mb-6">
                                        {useCase.desc}
                                    </p>

                                    {/* Examples Pills */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {useCase.examples.map((ex, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-semibold text-slate-600 bg-slate-50/80 border border-slate-100 px-3 py-1 rounded-lg"
                                            >
                                                {ex}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Sample Storefront Card Preview */}
                                <div className="mt-auto pt-6 border-t border-slate-100/80">
                                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-4 group-hover:bg-[#5500ff]/[0.02] transition-colors">
                                        <div className="min-w-0">
                                            <span className="text-[9px] font-bold text-[#5500ff] uppercase tracking-wider block mb-1">
                                                {useCase.sampleProduct.label}
                                            </span>
                                            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                                {useCase.sampleProduct.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                                {useCase.sampleProduct.meta}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-base sm:text-lg font-black text-[#5500ff]">
                                                {useCase.sampleProduct.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Inline CTA */}
                <div className="mt-16 text-center">
                    <button
                        onClick={() => openModal('signup')}
                        className="h-14 sm:h-16 px-8 sm:px-10 rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#5500FF]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
                    >
                        <span>Kendi Mağazanı Aç — 2 Dakikada</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-4">
                        Kredi kartı gerekmez • Sınırsız ürün listele
                    </p>
                </div>
            </div>
        </section>
    );
}
