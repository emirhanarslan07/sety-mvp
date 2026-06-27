'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Smartphone,
    Calendar,
    GraduationCap,
    BarChart3,
    MessageSquare,
    Mail,
    Layout,
    Users,
    Headphones,
    X,
    Check,
    ArrowRight
} from 'lucide-react';
import { useAuthModal } from '@/context/AuthModalContext';

const tools = [
    {
        icon: <Smartphone className="w-5 h-5 text-slate-600" />,
        name: 'Mobil Uyumlu "Link-in-Bio" Mağaza',
        replaces: 'Squarespace, Linktree',
        price: '$29'
    },
    {
        icon: <Calendar className="w-5 h-5 text-blue-500" />,
        name: 'Randevu ve Rezervasyon Sistemi',
        replaces: 'Calendly, Acuity',
        price: '$15'
    },
    {
        icon: <GraduationCap className="w-5 h-5 text-orange-500" />,
        name: 'Online Kurs Platformu',
        replaces: 'Kajabi, Teachable',
        price: '$119'
    },
    {
        icon: <BarChart3 className="w-5 h-5 text-rose-500" />,
        name: 'Gelişmiş İzleyici Analitiği',
        replaces: 'Google Analytics, Mixpanel',
        price: '$10'
    },
    {
        icon: <MessageSquare className="w-5 h-5 text-indigo-500" />,
        name: 'Otomatik Mesajlaşma (AutoDM)',
        replaces: 'Manychat',
        price: '$15'
    },
    {
        icon: <Mail className="w-5 h-5 text-blue-400" />,
        name: 'E-Bülten ve E-Posta Pazarlama',
        replaces: 'Mailchimp, Flodesk',
        price: '$29'
    },
    {
        icon: <Layout className="w-5 h-5 text-yellow-500" />,
        name: 'Hazır Tasarım Kütüphanesi',
        replaces: 'Canva Pro',
        price: '$12'
    },
    {
        icon: <Users className="w-5 h-5 text-emerald-500" />,
        name: 'Topluluk Yönetimi ve Erişim',
        replaces: 'Circle, Mighty Networks',
        price: '$99'
    },
    {
        icon: <Headphones className="w-5 h-5 text-purple-500" />,
        name: '1:1 Strateji Koçluğu Desteği',
        replaces: 'Danışmanlık Ücretleri',
        price: '$99'
    }
];

export function ToolComparison() {
    const { openModal } = useAuthModal();

    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-[1000] tracking-tighter text-slate-900 mb-6"
                    >
                        Daha Basit Bir Çözüm 💰
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed"
                    >
                        Artık 5&apos;ten fazla farklı uygulama için para ödemenize gerek yok! <br className="hidden md:block" /> Sety her şeyi tek bir platformda topluyor.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <div className="space-y-6">
                            {tools.map((tool, i) => (
                                <div key={i} className="flex items-center justify-between gap-4 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {tool.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm md:text-base font-black text-slate-800 leading-tight">{tool.name}</h4>
                                            <p className="text-[10px] md:text-xs font-bold text-slate-400">
                                                Bunların yerini alır: <span className="line-through opacity-60">{tool.replaces}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm md:text-base font-black text-slate-600 tracking-tight">{tool.price}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                        <X className="w-4 h-4 text-rose-500" strokeWidth={4} />
                                    </div>
                                    <span className="text-sm md:text-base font-black text-rose-400">Ayrı Ayrı Ödeseydiniz</span>
                                </div>
                                <span className="text-xl font-black text-rose-500 tracking-tight">$423/ay</span>
                            </div>

                            <div className="flex items-center justify-between bg-[#5500ff]/5 p-4 rounded-2xl border border-[#5500ff]/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#5500ff] flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" strokeWidth={4} />
                                    </div>
                                    <span className="text-sm md:text-lg font-black text-slate-900">Sety ile Tek Fiyat ✨</span>
                                </div>
                                <span className="text-xl md:text-2xl font-[1000] text-[#5500ff] tracking-tighter">$19/ay</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Button onClick={() => openModal('signup')} size="xl" className="bg-[#1a1b4b] hover:bg-[#1a1b4b]/90 text-white px-12 rounded-full font-black text-lg h-16 shadow-2xl transition-all hover:scale-105 active:scale-95 border-none">
                        Deneme Sürümünü Başlat
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
