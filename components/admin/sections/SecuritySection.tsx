'use client';

import React from 'react';
import {
    Shield,
    Lock,
    Zap,
    History,
    AlertCircle,
    CheckCircle2,
    Activity,
    Smartphone,
    Globe,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function SecuritySection() {
    const LogItem = ({ type, user, action, date, status }: any) => (
        <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group active:scale-[0.99] cursor-pointer">
            <div className="flex items-center gap-5">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                    status === 'success' ? "bg-emerald-50 text-emerald-500 shadow-emerald-100" : "bg-rose-50 text-rose-500 shadow-rose-100"
                )}>
                    {status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                    <h5 className="font-logo text-[15px] font-black text-slate-800 leading-tight">{action}</h5>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{user} • {date}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{type}</span>
                    <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Güvenlik & Sistem</h1>
                    <p className="text-slate-400 font-medium">Platformun güvenliğini, erişim kayıtlarını ve sistem sağlığını buradan yönetebilirsin.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-100 px-6 font-bold flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Kayıtları Temizle
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Security Logs (Main Column) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <Zap className="w-6 h-6 text-[#5500ff]" fill="#5500ff" />
                        Canlı Erişim Kayıtları
                    </h3>

                    <LogItem
                        type="AUTH"
                        action="Yeni Yönetici Girişi"
                        user="hello@sety.store"
                        date="Az önce"
                        status="success"
                    />
                    <LogItem
                        type="DATABASE"
                        action="Toplu Veri Sayımı"
                        user="System Worker"
                        date="5 dakika önce"
                        status="success"
                    />
                    <LogItem
                        type="AUTH"
                        action="Hatalı Giriş Denemesi"
                        user="test@asd.com"
                        date="12 dakika önce"
                        status="error"
                    />
                    <LogItem
                        type="SECURITY"
                        action="RLS Politikası Güncellendi"
                        user="Admin Console"
                        date="1 saat önce"
                        status="success"
                    />
                    <LogItem
                        type="AUTH"
                        action="Çıkış Yapıldı"
                        user="emir@sety.store"
                        date="2 saat önce"
                        status="success"
                    />
                </div>

                {/* System Status / Health (Side Column) */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            Sistem Sağlığı
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                    <Globe className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                    Bölgesel Erişim
                                </div>
                                <span className="text-emerald-500 font-black text-xs uppercase group-hover:scale-105 transition-transform">Online</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                    <Smartphone className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                    Mobil Servisler
                                </div>
                                <span className="text-emerald-500 font-black text-xs uppercase group-hover:rotate-6 transition-transform">Online</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                    <Lock className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                    SSL Sertifikası
                                </div>
                                <span className="text-emerald-500 font-black text-xs uppercase group-hover:scale-110 transition-transform">Güvenli</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl shadow-slate-200/50 group overflow-hidden relative active:scale-[0.98] transition-all cursor-pointer">
                        <Shield className="w-12 h-12 text-[#C4FF00] mb-6 transform group-hover:rotate-12 transition-all duration-500" />
                        <h4 className="text-xl font-black mb-2 relative z-10">Tüm Verileri Korunuyor</h4>
                        <p className="text-slate-400 text-sm font-semibold max-w-[200px] leading-relaxed relative z-10">
                            Sety güvenlik motoru 256-bit şifreleme ve RLS protokollerini aktif tutuyor.
                        </p>

                        {/* Background glow effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/40 transition-all duration-1000" />
                    </div>
                </div>
            </div>
        </div>
    );
}
