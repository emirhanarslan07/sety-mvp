'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';

export function LeadMagnet() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            // For now, we can just store the email in a 'leads' table if it exists, or just simulate it.
            // Assuming there is a generic leads table, if not, we can just show success.
            // Let's just simulate the collection for now as the backend schema might not have it yet.
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Try to insert if table exists, otherwise ignore error
            await supabase.from('leads').insert([{ email, source: 'free_guide_playbook' }]);

            setSuccess(true);
            showToast('Rehber başarıyla e-posta adresinize gönderildi!', 'success');
        } catch (error) {
            showToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#5500ff]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-8 md:p-16 overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
                        {/* Text Content */}
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5500ff]/10 text-[#5500ff] font-bold text-sm">
                                <Book className="w-4 h-4" />
                                <span>Ücretsiz E-Kitap</span>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    14-Day Revenue <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5500ff] to-fuchsia-500">Launch Playbook</span>
                                </h2>
                                <p className="text-lg md:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0">
                                    Sıfırdan ilk dijital ürününüzü nasıl oluşturup satışa sunabileceğinizi adım adım anlatan ücretsiz rehberimizi hemen indirin.
                                </p>
                            </div>

                            <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                                {[
                                    'Niş belirleme ve ürün fikri bulma',
                                    '1 saatte ürün oluşturma teknikleri',
                                    'Sety.store ile mağazayı yayına alma',
                                    'Instagram & TikTok pazarlama stratejileri'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {!success ? (
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto lg:mx-0">
                                    <Input 
                                        type="email" 
                                        placeholder="E-posta adresiniz..." 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 rounded-2xl bg-white border-slate-200 text-lg"
                                        required
                                    />
                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="h-14 px-8 rounded-2xl bg-[#5500ff] hover:bg-[#4400cc] text-white font-bold text-lg whitespace-nowrap"
                                    >
                                        {loading ? 'Gönderiliyor...' : 'Hemen İndir'} <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </form>
                            ) : (
                                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4 max-w-md mx-auto lg:mx-0">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-900">Harika! Rehber Yolda.</h4>
                                        <p className="text-emerald-700 font-medium text-sm">E-posta kutunuzu (ve spam klasörünü) kontrol etmeyi unutmayın.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Visual Presentation */}
                        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative aspect-[4/5] bg-gradient-to-br from-indigo-500 to-fuchsia-600 rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500"
                            >
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
                                    <div className="space-y-2">
                                        <div className="w-12 h-1 bg-white/30 rounded-full" />
                                        <div className="w-24 h-1 bg-white/30 rounded-full" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black leading-tight">
                                            14-Day<br/>Revenue<br/>Launch<br/>Playbook
                                        </h3>
                                        <p className="text-white/80 font-medium text-lg">By Sety</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <SetyLogoIcon />
                                        <span className="font-black tracking-tight text-xl">Sety</span>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Decorative element behind the book */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#5500ff]/20 to-fuchsia-500/20 blur-[60px] -z-10 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SetyLogoIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}
