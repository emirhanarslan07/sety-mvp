import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Mail, ArrowRight, Loader2, CheckCircle2, Calendar, Clock, User, MessageSquare, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n/context';

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
        if (isCoaching && (!selectedDate || !selectedTime)) {
            showToast('Lütfen tarih ve saat seçin.', 'error');
            return;
        }

        if (!email || !email.includes('@')) {
            showToast('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        setLoading(true);
        try {
            // 1. Capture/Update Customer
            const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .upsert([{
                    user_id: profile.user_id,
                    store_id: profile.id,
                    email: email.toLowerCase(),
                    name: name || 'Müşteri'
                }], { onConflict: 'email,store_id' })
                .select()
                .single();

            if (customerError) throw customerError;

            // 2. Create an order record (generalized infrastructure test)
            const { error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: profile.user_id,
                    store_id: profile.id,
                    product_id: product.id,
                    customer_id: customerData.id,
                    customer_email: email.toLowerCase(),
                    amount: product.price || 0,
                    status: 'paid'
                }]);

            if (orderError) console.error('Order creation error:', orderError);

            // 3. Track Analytics
            await supabase.from('analytics_events').insert([{
                user_id: profile.user_id,
                store_id: profile.id,
                event_name: isCoaching ? 'appointment_booked' : 'purchase_complete',
                product_id: product.id,
                metadata: {
                    email: email.toLowerCase(),
                    name,
                    price: product.price,
                    message,
                    selected_date: selectedDate?.toISOString(),
                    selected_time: selectedTime,
                    source: 'product_detail'
                }
            }]);

            setSuccess(true);

            // Handle delivery/redirection
            setTimeout(() => {
                onPurchase(product, email);

                // If it's a free product with a redirect or file, we might want to stay open or handle it in the parent
                // For now, let's let onPurchase handle it.
                if (product.external_checkout_url || product.redirect_url || product.digital_file_url) {
                    // We'll keep it open for a bit to show success if not redirecting immediately
                } else {
                    onClose();
                }
            }, 1500);
        } catch (err: any) {
            console.error(err);
            showToast('Bir hata oluştu: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;
    
    if (success) {
        const isManual = product.checkout_provider === 'manual';
        const paymentInfo = product.external_checkout_url || '';

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

                        {(product.digital_file_url || product.file_url || product.redirect_url) && (
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
                                        <img src={profile.profile_image_url} alt={profile.full_name} className="w-full h-full object-cover" />
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
                                                <img src={profile.profile_image_url} alt="" className="w-full h-full object-cover" />
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
                                    className="aspect-[16/9] w-full rounded-2xl bg-slate-100 overflow-hidden relative"
                                >
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                                            <ShieldCheck className="w-20 h-20" strokeWidth={1} />
                                        </div>
                                    )}
                                </motion.div>

                                {/* 2. TITLE + PRICE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mt-8 space-y-3"
                                >
                                    <h1 className="text-[28px] md:text-[36px] font-black text-slate-900 tracking-tight leading-[1.1]">
                                        {product.title}
                                    </h1>
                                    <p className="text-[24px] font-bold text-[#6C47FF]">
                                        {product.price === 0 ? (t('public.free') || 'Free') : formatCurrency(product.price, product.currency || 'USD')}
                                    </p>
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
                                            <p className="text-[16px] text-slate-600 font-medium leading-relaxed">
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

                                {/* ─── COACHING: Date & Time Selection (inline, scrollable) ─── */}
                                {isCoaching && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="mt-12 space-y-10"
                                    >
                                        {/* Divider */}
                                        <div className="h-px bg-slate-100" />

                                        {/* ── Calendar ── */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#6C47FF]/10 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-[#6C47FF]" />
                                                </div>
                                                <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Tarih Seçin</h3>
                                            </div>

                                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                                                {/* Month navigation */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#6C47FF]/10 flex items-center justify-center text-slate-400 hover:text-[#6C47FF] transition-all">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <h4 className="text-[16px] font-black text-slate-800 capitalize tracking-tight">{monthName}</h4>
                                                    <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#6C47FF]/10 flex items-center justify-center text-slate-400 hover:text-[#6C47FF] transition-all">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Day names */}
                                                <div className="grid grid-cols-7 gap-1 mb-2">
                                                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                                                        <div key={d} className="text-center text-[11px] font-bold text-slate-300 uppercase py-2">{d}</div>
                                                    ))}
                                                </div>

                                                {/* Days grid */}
                                                <div className="grid grid-cols-7 gap-1">
                                                    {calendarDays.map((d: any, i: number) => {
                                                        const isSelected = selectedDate && d.date && selectedDate.toDateString() === d.date.toDateString();
                                                        return (
                                                            <button
                                                                key={i}
                                                                disabled={!d.day || d.isPast}
                                                                onClick={() => d.date && setSelectedDate(d.date)}
                                                                className={cn(
                                                                    "aspect-square rounded-xl flex items-center justify-center text-[14px] font-bold transition-all relative",
                                                                    !d.day && "opacity-0 pointer-events-none",
                                                                    d.isPast && "text-slate-200 cursor-not-allowed",
                                                                    d.isWeekend && !isSelected && !d.isPast && "text-slate-300",
                                                                    isSelected
                                                                        ? "bg-[#6C47FF] text-white shadow-lg shadow-[#6C47FF]/25 scale-105 ring-4 ring-[#6C47FF]/10"
                                                                        : !d.isPast && d.day ? "text-slate-700 hover:bg-[#6C47FF]/5 hover:text-[#6C47FF]" : "",
                                                                    d.isToday && !isSelected && "ring-2 ring-[#6C47FF]/20 text-[#6C47FF] font-black"
                                                                )}
                                                            >
                                                                {d.day}
                                                                {d.isToday && !isSelected && (
                                                                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6C47FF]" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Selected date display */}
                                                {selectedDate && (
                                                    <div className="mt-5 pt-5 border-t border-slate-50 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
                                                            <Calendar className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="text-[15px] font-bold text-slate-800">
                                                            {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* ── Time Slots ── */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#6C47FF]/10 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-[#6C47FF]" />
                                                </div>
                                                <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Saat Seçin</h3>
                                            </div>

                                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                                                {timeSlots.map((group) => (
                                                    <div key={group.label} className="space-y-3">
                                                        <p className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">{group.label}</p>
                                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                            {group.slots.map(time => {
                                                                const isSelected = selectedTime === time;
                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        onClick={() => setSelectedTime(time)}
                                                                        className={cn(
                                                                            "py-3 rounded-xl text-[14px] font-bold transition-all border-2",
                                                                            isSelected
                                                                                ? "border-[#6C47FF] bg-[#6C47FF] text-white shadow-lg shadow-[#6C47FF]/20"
                                                                                : "border-slate-100 text-slate-500 hover:border-[#6C47FF]/30 hover:text-[#6C47FF] hover:bg-[#6C47FF]/5"
                                                                        )}
                                                                    >
                                                                        {time}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                {selectedTime && (
                                                    <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-[#6C47FF] flex items-center justify-center">
                                                            <Clock className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="text-[15px] font-bold text-slate-800">{selectedTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </motion.div>
                                )}

                                {/* ─── CONTACT FORM (always visible at bottom) ─── */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: isCoaching ? 0.3 : 0.2 }}
                                    className="mt-12 space-y-5"
                                >
                                    <div className="h-px bg-slate-100" />

                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="w-10 h-10 rounded-xl bg-[#6C47FF]/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-[#6C47FF]" />
                                        </div>
                                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Bilgileriniz</h3>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">Adınız Soyadınız</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#6C47FF] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Adınız Soyadınız"
                                                    className="w-full h-14 pl-12 pr-5 rounded-xl bg-slate-50 border-2 border-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-[#6C47FF]/30 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-bold text-slate-500 ml-1">E-posta Adresiniz</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#6C47FF] transition-colors" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="ornek@mail.com"
                                                    className="w-full h-14 pl-12 pr-5 rounded-xl bg-slate-50 border-2 border-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-[#6C47FF]/30 outline-none transition-all"
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
                                disabled={loading || success || (isCoaching && (!selectedDate || !selectedTime))}
                                className={cn(
                                    "w-full h-16 rounded-2xl font-black text-[17px] shadow-2xl transition-all flex items-center justify-between px-8 group",
                                    success
                                        ? "bg-emerald-500 hover:bg-emerald-500"
                                        : "bg-[#6C47FF] hover:bg-[#5835E0] shadow-[#6C47FF]/20"
                                )}
                            >
                                <span className="tracking-tight">
                                    {loading ? 'İşleniyor...' :
                                        success ? 'Harika! Yönlendiriliyorsunuz' :
                                            isCoaching ? 'Randevuyu Onayla' :
                                                isVideoResponse ? 'Talebi Gönder' :
                                                    product.price === 0 ? 'Ücretsiz Al' : `${formatCurrency(product.price)} — Hemen Al`}
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
