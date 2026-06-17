'use client';

import React from 'react';
import {
    CreditCard,
    Zap,
    CheckCircle2
} from 'lucide-react';

export default function PaymentSettings({ initialConfig, onSave }: any) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-[#5500ff]/5 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-[#5500ff]" />
                    </div>
                    <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
                        Ödeme Yöntemleri
                    </h2>
                </div>
                <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-2xl opacity-80">
                    Sety'de satacağınız ürünler için kendi ödeme altyapınızın (Iyzico, Stripe, Shopier vb.) linklerini kullanabilirsiniz.
                </p>
            </div>

            <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Komisyonsuz Satış</h3>
                        <p className="text-[14px] font-bold text-slate-500">Ödemeler doğrudan sizin hesabınıza geçer, Sety komisyon almaz.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="font-black text-slate-900 mb-2">Nasıl Çalışır?</h4>
                    <ol className="list-decimal list-inside space-y-2 text-[15px] font-bold text-slate-600">
                        <li>Kendi ödeme sağlayıcınızdan bir ürün ödeme linki oluşturun.</li>
                        <li>Sety'de ürün eklerken "Dış Bağlantı" (External Link) seçeneğine bu linki yapıştırın.</li>
                        <li>Müşteriniz "Satın Al" butonuna bastığında direkt sizin ödeme sayfanıza yönlendirilir.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
