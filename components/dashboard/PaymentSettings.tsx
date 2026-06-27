'use client';

import React from 'react';
import { CreditCard, Link as LinkIcon, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PaymentSettings({ paymentUrl, setPaymentUrl, onSave, saving }: any) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-[#5500ff]/5 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-[#5500ff]" />
                    </div>
                    <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
                        Ödeme Bağlantın
                    </h2>
                </div>
                <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-2xl opacity-80">
                    Müşterileriniz ürün satın almak istediğinde bu linke yönlendirilecek. Shopier, iyzico, PayTR veya herhangi bir ödeme sayfası linkini buraya ekleyebilirsin.
                </p>
            </div>

            <div className="p-8 md:p-10 rounded-[32px] bg-white border border-slate-100 shadow-sm overflow-hidden space-y-8">
                
                <div className="space-y-3">
                    <label className="block text-[13px] font-black text-slate-500 uppercase tracking-widest">
                        Ödeme Linki
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="url"
                            value={paymentUrl}
                            onChange={(e) => setPaymentUrl(e.target.value)}
                            placeholder="https://shopier.com/kullaniciadin"
                            className="w-full h-14 pl-12 pr-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#5500ff]/30 outline-none font-bold text-[15px] text-slate-900 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-[13px] font-bold text-slate-400 mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bu platformlardan birini kullanabilirsin:
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center">
                            <span className="font-black text-[#00B4D8] text-[14px]">Shopier</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-[#0051C4]/10 border border-[#0051C4]/20 flex items-center justify-center">
                            <span className="font-black text-[#0051C4] text-[14px]">iyzico</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-[#00D06C]/10 border border-[#00D06C]/20 flex items-center justify-center">
                            <span className="font-black text-[#00D06C] text-[14px]">PayTR</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex">
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className={cn(
                            "h-12 px-8 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-[14px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50",
                            saving ? "w-[140px]" : "w-auto"
                        )}
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>

            </div>
        </div>
    );
}
