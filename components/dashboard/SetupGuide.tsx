'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Store, Package, Image as ImageIcon, Link2, X } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import Confetti to avoid SSR issues with window object
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export function SetupGuide() {
    const { profile, store } = useDashboard();
    const router = useRouter();
    
    const [isVisible, setIsVisible] = useState(true);
    const [hasProducts, setHasProducts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Set window size for confetti
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const hidden = localStorage.getItem('sety_setup_guide_hidden');
        if (hidden === 'true') {
            setIsVisible(false);
        }

        const checkProducts = async () => {
            if (store?.id) {
                const { data } = await supabase.from('products').select('id').eq('store_id', store.id).limit(1);
                if (data && data.length > 0) {
                    setHasProducts(true);
                }
            }
            setLoading(false);
        };

        checkProducts();
    }, [store?.id]);

    const handleHide = () => {
        setIsVisible(false);
        localStorage.setItem('sety_setup_guide_hidden', 'true');
    };

    const hasProfileCustomized = !!profile?.profile_image_url || !!profile?.bio;
    
    const hasSocialLinks = store?.social_links && (
        store.social_links.instagram || 
        store.social_links.tiktok || 
        store.social_links.youtube || 
        store.social_links.twitter
    );
    
    const steps = [
        {
            id: 'store',
            title: 'Mağazanı Oluştur',
            description: 'Harika bir başlangıç yaptın!',
            icon: Store,
            completed: true,
            action: null
        },
        {
            id: 'product',
            title: 'İlk Ürününü Ekle',
            description: 'Satışa başlamak için dijital veya fiziksel bir ürün ekle.',
            icon: Package,
            completed: hasProducts,
            action: () => router.push('/dashboard/store?action=add'),
            actionLabel: 'Hemen Ekle'
        },
        {
            id: 'profile',
            title: 'Profilini Özelleştir',
            description: 'Müşterilerine güven vermek için fotoğraf ve biyografi ekle.',
            icon: ImageIcon,
            completed: hasProfileCustomized,
            action: () => router.push('/dashboard/settings'),
            actionLabel: 'Profili Düzenle'
        },
        {
            id: 'socials',
            title: 'Sosyal Medyayı Bağla',
            description: 'Takipçilerini mağazana çekmek için sosyal medya linklerini ekle.',
            icon: Link2,
            completed: !!hasSocialLinks,
            action: () => router.push('/dashboard/settings'),
            actionLabel: 'Hesap Ekle'
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    useEffect(() => {
        if (progress === 100 && !loading) {
            const hasSeenConfetti = localStorage.getItem('sety_setup_confetti_seen');
            if (!hasSeenConfetti) {
                setShowConfetti(true);
                localStorage.setItem('sety_setup_confetti_seen', 'true');
                
                // Hide confetti after 5 seconds, then hide guide after another 2 seconds
                setTimeout(() => {
                    setShowConfetti(false);
                    setTimeout(() => handleHide(), 2000);
                }, 5000);
            } else {
                // If they already saw it but guide is somehow open, just hide it after a few seconds
                setTimeout(() => handleHide(), 5000);
            }
        }
    }, [progress, loading]);

    if (!isVisible || loading) return null;

    return (
        <>
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.15}
                        colors={['#5500ff', '#8844ff', '#ff00ff', '#00e676', '#ffea00']}
                    />
                </div>
            )}
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white/80 backdrop-blur-xl rounded-[32px] border-2 border-[#5500ff]/10 shadow-[0_20px_60px_-15px_rgba(85,0,255,0.15)] p-6 md:p-8 mb-8 relative overflow-hidden font-inter"
            >
                {/* Background Blob */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#5500ff]/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                
                <button 
                    onClick={handleHide}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="mb-8 relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                        {progress === 100 
                            ? "Tebrikler! Mağazanız satışa hazır! 🎉" 
                            : "Mağazanız hazır, şimdi vitrini doldurma zamanı! ✨"
                        }
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base">
                        {progress === 100
                            ? "Tüm adımları başarıyla tamamladınız. Artık linkinizi paylaşıp para kazanmaya başlayabilirsiniz!"
                            : "Satışa başlamak için aşağıdaki adımları tamamlayarak mağazanı %100 hazır hale getir."
                        }
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 flex items-center gap-4 max-w-2xl">
                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-[#5500ff] rounded-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full" />
                            </motion.div>
                        </div>
                        <span className="text-sm font-bold text-[#5500ff] whitespace-nowrap">
                            %{Math.round(progress)} Tamamlandı
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                    {steps.map((step) => (
                        <div 
                            key={step.id}
                            className={cn(
                                "flex items-start gap-4 p-5 rounded-[24px] border transition-all",
                                step.completed 
                                    ? "bg-emerald-50/50 border-emerald-100/50 opacity-70" 
                                    : "bg-white border-slate-100 shadow-sm hover:border-[#5500ff]/20 hover:shadow-md group"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                step.completed ? "bg-emerald-500 text-white" : "bg-[#5500ff]/10 text-[#5500ff] group-hover:bg-[#5500ff] group-hover:text-white"
                            )}>
                                {step.completed ? <Check className="w-6 h-6" strokeWidth={3} /> : <step.icon className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h3 className={cn(
                                    "text-[16px] font-bold tracking-tight mb-1",
                                    step.completed ? "text-emerald-900 line-through decoration-emerald-200" : "text-slate-900 group-hover:text-[#5500ff] transition-colors"
                                )}>
                                    {step.title}
                                </h3>
                                <p className="text-[13px] font-medium text-slate-500 leading-snug mb-3">
                                    {step.description}
                                </p>
                                
                                {!step.completed && step.action && (
                                    <button 
                                        onClick={step.action}
                                        className="flex items-center gap-1.5 text-[13px] font-bold text-[#5500ff] hover:text-[#4400cc] bg-[#5500ff]/10 hover:bg-[#5500ff]/20 px-4 py-2 rounded-xl transition-colors active:scale-95"
                                    >
                                        {step.actionLabel}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
