'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Send, 
    ExternalLink,
    Loader2,
    Calendar,
    Twitter,
    Linkedin,
    Instagram
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';

export default function SchedulerPage() {
    const { profile } = useDashboard();
    const brandColor = profile?.brand_color || '#7C3AED';
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSSORedirect = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/scheduler/sso', {
                method: 'POST',
            });
            const data = await res.json();
            
            if (data.success && data.redirectUrl) {
                // Open external scheduler with SSO token in a new tab
                window.open(data.redirectUrl, '_blank');
            } else {
                showToast("SSO köprüsü oluşturulamadı.", "error");
            }
        } catch (error) {
            console.error("SSO Error:", error);
            showToast("Bağlantı hatası.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0A0A0A] rounded-[32px] overflow-hidden text-[#F5F5F5] min-h-[calc(100vh-120px)] flex flex-col mb-10 shadow-2xl border border-zinc-800/50">
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
                
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" style={{ backgroundColor: `${brandColor}20` }} />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 max-w-2xl text-center"
                >
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-xl relative">
                        <Send className="w-10 h-10" style={{ color: brandColor }} />
                        <div className="absolute -bottom-2 -right-2 bg-zinc-800 border-2 border-[#0A0A0A] rounded-full p-1.5 shadow-sm">
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-300" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Sety Scheduler
                    </h1>
                    
                    <p className="text-[17px] md:text-[19px] leading-relaxed text-zinc-400 mb-10 max-w-xl mx-auto">
                        Mağazanıza trafik çekmek ve sosyal medya gönderilerinizi planlamak için tasarlanan 
                        <strong className="text-zinc-200 font-semibold px-1">Sety Scheduler</strong>, 
                        yüksek performans ve güvenlik için tamamen izole edilmiş bir sunucuda barındırılmaktadır.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <button 
                            onClick={handleSSORedirect}
                            disabled={isLoading}
                            className="relative h-16 px-10 rounded-2xl text-white font-bold text-lg flex items-center gap-3 overflow-hidden group shadow-xl active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
                            style={{ backgroundColor: brandColor }}
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-700 ease-out" />
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Planlayıcı'yı Başlat
                                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                        
                        <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800/50">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Güvenli SSO Bağlantısı ile Yönlendirilir
                        </div>
                    </div>
                </motion.div>

                {/* Decorative Platform Icons */}
                <div className="absolute bottom-10 inset-x-0 flex justify-center gap-8 opacity-20 pointer-events-none">
                    <Twitter className="w-8 h-8" />
                    <Linkedin className="w-8 h-8" />
                    <Instagram className="w-8 h-8" />
                    <Calendar className="w-8 h-8" />
                </div>
            </div>
        </div>
    );
}
