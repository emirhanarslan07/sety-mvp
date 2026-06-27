import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Mail, ArrowRight, Loader2, CheckCircle2, Calendar, Clock, User, MessageSquare, ChevronRight, X, Download, Video, Users2, Gift, Link2, Sparkles, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { supabasePublic } from '@/lib/supabase/client';
import { processCheckoutAction } from '@/app/actions/checkout';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n/context';

import Image from 'next/image';
const getFallbackIcon = (type: string) => {
    switch (type) {
        case 'digital_product': return Download;
        case 'coaching_call': return Clock;
        case 'video_response': return Video;
        case 'private_group': return Users2;
        case 'collect_emails': return Mail;
        case 'lead_magnet': return Gift;
        case 'external_link': return Link2;
        default: return Sparkles;
    }
};

const DEFAULT_COVERS: Record<string, string[]> = {
    digital_product: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2629&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop',
    ],
    coaching_call: [
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=2574&auto=format&fit=crop',
    ],
    external_link: [
        'https://images.unsplash.com/photo-1512758684065-94ed158f5612?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520869562399-e772f042f422?q=80&w=2673&auto=format&fit=crop',
    ]
};

interface ProductBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    onPurchase: (product: any, email?: string) => void;
    profile: any;
}

export default function ProductBottomSheet({ isOpen, onClose, product, onPurchase, profile }: ProductBottomSheetProps) {
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isCoaching = product?.type === 'danışmanlık' || product?.type === 'coaching_call';
    const isVideoResponse = product?.type === 'video_response' || product?.type === 'custom_product' || product?.type === 'ask_me_anything';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSuccess(false);
            setEmail('');
            setName('');
            setMessage('');
            setSelectedDate(null);
            setSelectedTime(null);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Calendar — current month
    const now = new Date();
    const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
    const [calendarYear, setCalendarYear] = useState(now.getFullYear());

    const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

    const calendarDays = useMemo(() => {
        const days: any[] = [];
        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const lastDay = new Date(calendarYear, calendarMonth + 1, 0);

        // Monday-start week
        let startDay = firstDay.getDay();
        if (startDay === 0) startDay = 7;

        for (let i = 1; i < startDay; i++) {
            days.push({ day: null, date: null });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(calendarYear, calendarMonth, i);
            days.push({
                day: i,
                date,
                isPast: date < today,
                isToday: date.getTime() === today.getTime(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }
        return days;
    }, [calendarMonth, calendarYear]);

    const timeSlots = [
        { label: "Sabah", slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
        { label: "Öğleden Sonra", slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"] },
        { label: "Akşam", slots: ["16:00", "16:30", "17:00", "17:30"] },
    ];

    const prevMonth = () => {
        if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
        else setCalendarMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
        else setCalendarMonth(m => m + 1);
    };

    const handleAction = async () => {
        // Native calendar bypassed for coaching, Calendly handled post-purchase

        if (!email || !email.includes('@')) {
            showToast('Lütfen geçerli bir e-posta adresi girin.', 'error');
            const el = document.getElementById('checkout-email-input');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => el.focus(), 300);
            }
            return;
        }

        setLoading(true);
        try {
            // Check for direct redirect if external checkout exists for paid products
            if (product.price > 0 && product.checkout_provider !== 'manual') {
                const checkoutUrl = product.external_checkout_url || profile?.payment_url;
                if (checkoutUrl) {
                    await supabasePublic.from('analytics_events').insert([{
                        user_id: profile.user_id,
                        store_id: profile.id,
                        event_name: 'checkout_redirect',
                        product_id: product.id,
                        metadata: {
                            email: email.toLowerCase(),
                            name,
                            price: product.price,
                            source: 'product_detail_redirect'
                        }
                    }]);
                    window.location.href = checkoutUrl;
                    return;
                }
            }

            // For Free or Manual products, or just to capture lead
            // Call Server Action to bypass RLS for customers, orders, and analytics insertion
            const checkoutResult = await processCheckoutAction({
                profileUserId: profile.user_id,
                profileId: profile.id,
                email: email.toLowerCase(),
                name: name || 'Müşteri',
                productId: product.id,
                productPrice: product.price || 0,
                isCoaching
            });

            if (!checkoutResult.success) {
                throw new Error(checkoutResult.error || 'Checkout failed');
            }

            setSuccess(true);
            setTimeout(() => {
                const checkoutUrl = product.external_checkout_url || profile?.payment_url;
                if (checkoutUrl && product.price > 0 && product.checkout_provider !== 'manual') {
                    // This case shouldn't be reached here as it's handled above, but just in case
                } else if (product.file_url || product.digital_file_url) {
                    window.open(product.file_url || product.digital_file_url, '_blank');
                    showToast('Dosyanız yeni sekmede açıldı.', 'success');
                } else if (product.calendly_url) {
                    window.location.href = product.calendly_url;
                } else {
                    showToast('İşlem başarılı.', 'success');
                }
                setLoading(false);
                setTimeout(() => onClose(), 2000);
            }, 2000);
        } catch (err: any) {
            console.error(err);
            showToast('Bir hata oluştu: ' + err.message, 'error');
            setLoading(false);
        } finally {
            if (product.price === 0 || product.checkout_provider === 'manual') {
                setLoading(false);
            }
        }
    };

    if (!product) return null;
    
    if (success) {
        const isManual = product.checkout_provider === 'manual';
        const paymentInfo = product.external_checkout_url || profile?.payment_url || '';

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-[130] bg-white flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
                    </div>
                    <h2 className="text-[28px] md:text-[32px] font-black text-slate-900 mb-4 tracking-tight">
                        {t('public.success_title') || 'Harika!'}
                    </h2>
                    
                    <div className="flex flex-col items-center max-w-sm w-full">
                        <p className="text-[16px] md:text-[18px] text-slate-500 font-medium mb-8 leading-relaxed">
                            {isCoaching ? (t('public.coaching_success') || 'Randevu talebiniz alındı. Sizinle en kısa sürede iletişime geçeceğiz.') :
                                (product.digital_file_url || product.file_url || product.redirect_url) ? (t('public.delivery_ready') || 'Ürününüz hazır! Aşağıdaki butona tıklayarak erişebilirsiniz.') :
                                    isManual ? (t('public.manual_payment_instruction') || 'Ödemeyi tamamlamak için aşağıdaki bilgileri kullanın.') :
                                        (t('public.order_captured') || 'Bilgileriniz başarıyla kaydedildi!')}
                            <br />
                            <span className="text-[13px] opacity-60 mt-3 block">
                                {t('public.order_email_sent') || 'Sipariş detayları e-posta adresinize de gönderildi.'}
                            </span>
                        </p>

                        {/* Manual Payment Info Box */}
                        {isManual && paymentInfo && (
                            <div className="w-full bg-slate-50 rounded-3xl p-6 mb-8 border-2 border-slate-100 text-left">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    {t('public.payment_details') || 'Ödeme Bilgileri'}
                                </label>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 group">
                                    <code className="text-[14px] font-bold text-slate-900 break-all">
                                        {paymentInfo}
                                    </code>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(paymentInfo);
                                            showToast(t('common.copied') || 'Kopyalandı!', 'success');
                                        }}
                                        className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#6C47FF] transition-all active:scale-95"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[12px] text-slate-400 font-medium mt-4 italic">
                                    {t('public.manual_payment_footer') || 'Ödeme yaparken açıklama kısmına e-posta adresinizi yazmayı unutmayın.'}
                                </p>
                            </div>
                        )}

                        {(product.digital_file_url || product.file_url || product.redirect_url) && !isCoaching && (
                            <Button
                                onClick={() => {
                                    const url = product.redirect_url || product.digital_file_url || product.file_url;
                                    window.open(url, '_blank');
                                }}
                                className="h-16 px-10 w-full rounded-2xl bg-slate-900 hover:bg-[#6C47FF] text-white font-black text-[17px] shadow-2xl flex items-center justify-center gap-3 group transition-all"
                            >
                                {product.redirect_url ? (t('public.go_to_link') || 'Bağlantıya Git') : (t('public.download_now') || 'Şimdi İndir')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
                        
                        {/* Calendly / Cal.com Iframe Embed */}
                        {isCoaching && product.calendly_url && (
                            <div className="w-full h-[500px] mt-6 rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50 relative">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                                <iframe 
                                    src={`${product.calendly_url}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`} 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    className="relative z-10"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-12 text-[14px] font-bold text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        {t('common.close') || 'Kapat'}
                    </button>
                </motion.div>
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] bg-[#FAFAFA]"
                >
                    {/* ─── FULL-PAGE LAYOUT ─── */}
                    <div className="h-full flex flex-col md:flex-row">

                        {/* ═══ LEFT: Profile sidebar (desktop) ═══ */}
                        <div className="hidden md:flex w-[300px] lg:w-[340px] h-full border-r border-slate-100 flex-col items-center justify-center p-8 shrink-0 bg-white">
                            <div className="flex flex-col items-center gap-5 text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white bg-white shrink-0">
                                    {profile?.profile_image_url ? (
                                        <Image src={profile.profile_image_url} alt={profile.full_name} className="w-full h-full object-cover"  width={800} height={800}  />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-5xl font-black uppercase">
                                            {(profile?.full_name || profile?.username)?.[0]}
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-[22px] font-black text-slate-900 tracking-tight">
                                    {profile?.full_name || `@${profile?.username}`}
                                </h2>
                                {profile?.bio && (
                                    <p className="text-[14px] text-slate-400 font-medium leading-relaxed max-w-[220px]">{profile.bio}</p>
                                )}
                            </div>
                        </div>

                        {/* ═══ RIGHT: Content ═══ */}
                        <div className="flex-1 h-full overflow-y-auto">
                            {/* Top nav */}
                            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                                <div className="flex items-center justify-between px-5 md:px-8 h-16">
                                    <button
                                        onClick={onClose}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <span className="text-[14px] font-bold hidden sm:inline">Mağazaya Dön</span>
                                    </button>

                                    {/* Mobile profile */}
                                    <div className="flex md:hidden items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                                            {profile?.profile_image_url ? (
                                                <Image src={profile.profile_image_url} alt="" className="w-full h-full object-cover"  width={800} height={800}  />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-black">
                                                    {(profile?.full_name || profile?.username)?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-600">{profile?.full_name}</span>
                                    </div>

                                    <div className="w-10" /> {/* Spacer */}
                                </div>
                            </div>

                            {/* ═══ SCROLLABLE CONTENT ═══ */}
                            <div className="px-5 md:px-10 lg:px-16 py-8 pb-36 max-w-[760px]">
                                {/* 1. HERO IMAGE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full rounded-[32px] overflow-hidden relative"
                                >
                                    {(product.image_url || (typeof DEFAULT_COVERS !== 'undefined' && DEFAULT_COVERS[product.type]?.[0])) ? (
                                        <Image src={product.image_url || (typeof DEFAULT_COVERS !== 'undefined' ? DEFAULT_COVERS[product.type]?.[0] : '')} alt={product.title} className="w-full h-auto aspect-[16/9] object-cover shadow-sm"  width={800} height={800}  />
                                    ) : (
                                        <div className="aspect-[21/9] w-full bg-slate-50 flex items-center justify-center relative shadow-sm border border-slate-100">
                                            <div 
                                                className="absolute inset-0 opacity-[0.03]" 
                                                style={{ background: `radial-gradient(circle at center, ${profile?.brand_color || '#6C47FF'} 0%, transparent 70%)` }} 
                                            />
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-center relative z-10 transition-transform hover:scale-105">
                                                {(() => {
                                                    const Icon = getFallbackIcon(product.type);
                                                    return <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: profile?.brand_color || '#6C47FF' }} strokeWidth={2.5} />;
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* 2. TITLE + PRICE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mt-8 space-y-4"
                                >
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black tracking-[0.15em] uppercase"
                                        style={{
                                            backgroundColor: `${profile?.brand_color || '#6C47FF'}14`,
                                            color: profile?.brand_color || '#6C47FF'
                                        }}
                                    >
                                        {(() => {
                                            const Icon = getFallbackIcon(product.type);
                                            return <Icon className="w-3.5 h-3.5" strokeWidth={2} />;
                                        })()}
                                        {product.type === 'digital_product' ? 'Dijital Ürün' :
                                         product.type === 'coaching_call' ? 'Birebir Seans' :
                                         product.type === 'video_response' ? 'Video Yanıt' :
                                         product.type === 'private_group' ? 'Özel Grup' :
                                         product.type === 'collect_emails' ? 'E-posta Toplama' :
                                         product.type === 'lead_magnet' ? 'Ücretsiz İçerik' :
                                         product.type === 'external_link' ? 'Harici Bağlantı' : 'Ürün'}
                                    </span>
                                    <h1 className="text-[28px] md:text-[36px] font-[1000] text-slate-900 tracking-tight leading-[1.1]">
                                        {product.title}
                                    </h1>
                                    <div>
                                        <span
                                            className="inline-flex items-center px-4 py-2 rounded-full text-[20px] md:text-[22px] font-extrabold"
                                            style={{
                                                backgroundColor: `${profile?.brand_color || '#6C47FF'}12`,
                                                color: profile?.brand_color || '#6C47FF'
                                            }}
                                        >
                                            {product.price === 0 ? (t('public.free') || 'Ücretsiz') : formatCurrency(product.price, product.currency || 'TRY')}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* 3. DESCRIPTION */}
                                {(product.subtitle || product.description) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.15 }}
                                        className="mt-6 space-y-4"
                                    >
                                        {product.subtitle && (
                                            <p className="text-[18px] text-slate-600 font-bold leading-relaxed">
                                                {product.subtitle}
                                            </p>
                                        )}
                                        {product.description && (
                                            <div className="text-[15px] text-slate-500 leading-[1.85] whitespace-pre-line">
                                                {product.description}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* ─── COACHING: Calendly happens after payment ─── */}
                                {isCoaching && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="mt-8 space-y-4 bg-emerald-50 border border-emerald-100 p-6 rounded-3xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-6 h-6 text-emerald-600" />
                                            <h3 className="text-[16px] font-black text-emerald-900">Takvim Randevusu</h3>
                                        </div>
                                        <p className="text-[14px] text-emerald-800/80 font-medium leading-relaxed">
                                            Ödemenizi tamamladıktan sonra, bir sonraki ekranda doğrudan takvim üzerinden uygun bir tarih ve saat seçebileceksiniz.
                                        </p>
                                    </motion.div>
                                )}

                                {/* ─── CONTACT FORM (always visible at bottom) ─── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: isCoaching ? 0.3 : 0.2 }}
                                    className="mt-12 space-y-5"
                                >
                                    <div className="rounded-2xl bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent border border-slate-100/80 p-5 flex items-center gap-4">
                                        <div
                                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${profile?.brand_color || '#6C47FF'}14` }}
                                        >
                                            <User className="w-5 h-5" style={{ color: profile?.brand_color || '#6C47FF' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight leading-tight">Bilgileriniz</h3>
                                            <p className="text-[13px] text-slate-400 font-medium mt-0.5">Ürünü alabilmeniz için bilgilerinizi girin</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">Adınız Soyadınız</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Adınız Soyadınız"
                                                    className="w-full h-14 pl-12 pr-5 rounded-xl bg-slate-50 border-2 border-slate-100 text-[15px] font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">E-posta Adresiniz</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                                                <input
                                                    id="checkout-email-input"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="ornek@mail.com"
                                                    className="w-full h-14 pl-12 pr-5 rounded-xl bg-slate-50 border-2 border-slate-100 text-[15px] font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        {isCoaching && (
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-slate-500 ml-1">Notunuz (opsiyonel)</label>
                                                <div className="relative group">
                                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-[#6C47FF] transition-colors" />
                                                    <textarea
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        placeholder="Görüşmede konuşmak istediğiniz konular..."
                                                        className="w-full min-h-[100px] pl-12 pr-5 py-4 rounded-xl bg-slate-50 border-2 border-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-[#6C47FF]/30 outline-none transition-all resize-none"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {isVideoResponse && (
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-slate-500 ml-1">Talebiniz/Sorunuz *</label>
                                                <div className="relative group">
                                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-[#6C47FF] transition-colors" />
                                                    <textarea
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        required
                                                        placeholder="Videonuzda/ürününüzde ele alınmasını istediğiniz detayları yazın..."
                                                        className="w-full min-h-[120px] pl-12 pr-5 py-4 rounded-xl bg-slate-50 border-2 border-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-[#6C47FF]/30 outline-none transition-all resize-none"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Trust */}
                                    <div className="flex items-center gap-2 px-1">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[12px] font-bold text-slate-400">Bilgileriniz güvende · SSL korumalı</span>
                                    </div>
                                </motion.div>

                                {/* Spacer for fixed button */}
                                <div className="h-8" />
                            </div>
                        </div>
                    </div>

                    {/* ═══ FIXED BOTTOM ACTION BAR ═══ */}
                    <div className="fixed bottom-0 left-0 md:left-[300px] lg:left-[340px] right-0 p-4 md:p-5 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-30">
                        <div className="max-w-[760px]">
                            {/* Summary chips */}
                            {isCoaching && (selectedDate || selectedTime) && (
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    {selectedDate && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6C47FF]/10 text-[#6C47FF] text-[12px] font-bold">
                                            <Calendar className="w-3 h-3" />
                                            {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                        </span>
                                    )}
                                    {selectedTime && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6C47FF]/10 text-[#6C47FF] text-[12px] font-bold">
                                            <Clock className="w-3 h-3" />
                                            {selectedTime}
                                        </span>
                                    )}
                                </div>
                            )}

                            <Button
                                onClick={handleAction}
                                disabled={loading || success}
                                className={cn(
                                    "w-full h-16 rounded-2xl font-black text-[17px] shadow-2xl transition-all flex items-center justify-between px-8 group",
                                    success
                                        ? "bg-emerald-500 hover:bg-emerald-500"
                                        : "shadow-lg"
                                )}
                                style={!success ? {
                                    backgroundColor: profile?.brand_color || '#6C47FF',
                                    boxShadow: `0 20px 40px -10px ${(profile?.brand_color || '#6C47FF')}33`
                                } : {}}
                            >
                                <span className="tracking-tight">
                                    {loading ? 'İşleniyor...' :
                                        success ? 'Harika! Yönlendiriliyorsunuz' :
                                            isCoaching ? 'Randevu İçin İlerle' :
                                                isVideoResponse ? 'Talebi Gönder' :
                                                    product.price === 0 ? 'Ücretsiz Al' : `${formatCurrency(product.price, product.currency || 'TRY')} — Hemen Al`}
                                </span>
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : success ? (
                                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                                ) : (
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
