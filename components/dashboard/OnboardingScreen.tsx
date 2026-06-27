'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, User, Package, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useToast } from '@/context/ToastContext';

interface OnboardingScreenProps {
    profile: any;
    refreshData: () => Promise<void>;
}

export function OnboardingScreen({ profile, refreshData }: OnboardingScreenProps) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleComplete = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ onboarding_completed: true })
                .eq('id', profile.id);

            if (error) throw error;
            
            await refreshData();
        } catch (error: any) {
            console.error("Error completing onboarding:", error);
            showToast("Bir hata oluştu.", "error");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-12 my-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center">
                        <SetyLogo size="md" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4 tracking-tight">
                    Mağazana Hoş Geldin! 🎉
                </h1>
                <p className="text-slate-500 font-medium text-center mb-10 text-lg leading-relaxed">
                    Satış yapmaya başlamadan önce tamamlaman gereken 3 basit adım var. Her şey hazır olduğunda harika şeyler başaracaksın!
                </p>

                <div className="space-y-4 mb-12">
                    {/* Adım 1 */}
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-black text-slate-900 mb-0.5">Profilini Tamamla</h3>
                            <p className="text-sm font-medium text-slate-500">Profil fotoğrafı ekle ve mağazanı kişiselleştir.</p>
                        </div>
                    </div>

                    {/* Adım 2 */}
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-500 shrink-0">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-black text-slate-900 mb-0.5">İlk Ürününü Ekle</h3>
                            <p className="text-sm font-medium text-slate-500">Dijital ürün, kurs veya randevu oluştur.</p>
                        </div>
                    </div>

                    {/* Adım 3 */}
                    <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-rose-500 shrink-0">
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-black text-slate-900 mb-0.5">Linkini Paylaş</h3>
                            <p className="text-sm font-medium text-slate-500">Mağaza linkini sosyal medya hesaplarına ekle.</p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={handleComplete} 
                    disabled={loading}
                    className="w-full h-16 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-black text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all group"
                >
                    {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            Hadi Başlayalım
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
