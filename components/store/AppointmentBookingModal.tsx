'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MessageSquare,
    Sparkles,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { useToast } from '@/context/ToastContext';
import { createAppointmentRequestAction } from '@/app/actions/appointment';

interface AppointmentBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    profile: any;
}

const TIME_BLOCKS = [
    { id: 'weekday_morning', label: 'Hafta içi Gündüz', time: '10:00 - 14:00', icon: '☀️' },
    { id: 'weekday_afternoon', label: 'Hafta içi Öğleden Sonra', time: '14:00 - 18:00', icon: '🌤️' },
    { id: 'weekday_evening', label: 'Hafta içi Akşam', time: '18:00 - 21:00', icon: '🌙' },
    { id: 'weekend', label: 'Hafta Sonu', time: '11:00 - 17:00', icon: '🌴' },
];

export default function AppointmentBookingModal({
    isOpen,
    onClose,
    product,
    profile,
}: AppointmentBookingModalProps) {
    const { showToast } = useToast();

    // Configuration from product
    const coachingConfig = product?.coaching_config || {};
    const allowOnline = coachingConfig.allow_online ?? true;
    const allowInPerson = coachingConfig.allow_in_person ?? false;
    const locationAddress = coachingConfig.location_address || '';
    const durationMinutes = coachingConfig.duration_minutes || 60;
    const hidePrice = coachingConfig.hide_price ?? false;
    const paymentMode = coachingConfig.payment_mode || 'request_only';

    // Steps: 1 = Session Type, 2 = Date & Time, 3 = Client Info, 4 = Success
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Selected state
    const [sessionType, setSessionType] = useState<'online' | 'in_person'>(
        allowOnline ? 'online' : 'in_person'
    );
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Hafta içi Gündüz (10:00 - 14:00)');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [clientNote, setClientNote] = useState('');

    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string>('');

    // Generate upcoming 14 days
    const upcomingDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 1; i <= 21; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            const iso = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
            const dayNum = d.getDate();
            const monthName = d.toLocaleDateString('tr-TR', { month: 'short' });
            days.push({ iso, dayName, dayNum, monthName, full: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }) });
        }
        return days;
    }, []);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(1);
            setSessionType(allowOnline ? 'online' : 'in_person');
            if (upcomingDays.length > 0) {
                setSelectedDate(upcomingDays[0].iso);
            }
            setSelectedTimeSlot('Hafta içi Gündüz (10:00 - 14:00)');
            setLoading(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, allowOnline, upcomingDays]);

    if (!isOpen || !product) return null;

    const creatorName = profile?.display_name || profile?.full_name || `@${profile?.username}`;

    const handleNextFromType = () => {
        setStep(2);
    };

    const handleNextFromDateTime = () => {
        if (!selectedDate) {
            showToast('Lütfen tercih ettiğiniz bir tarih seçin.', 'error');
            return;
        }
        if (!selectedTimeSlot) {
            showToast('Lütfen bir zaman aralığı seçin.', 'error');
            return;
        }
        setStep(3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            showToast('Lütfen adınızı ve soyadınızı girin.', 'error');
            return;
        }
        if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
            showToast('Lütfen geçerli bir telefon numarası girin (WhatsApp teyidi için gereklidir).', 'error');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            showToast('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        setLoading(true);

        try {
            const selectedDayObj = upcomingDays.find(d => d.iso === selectedDate);
            const formattedDateString = selectedDayObj ? selectedDayObj.full : selectedDate;

            const res = await createAppointmentRequestAction({
                profileUserId: profile.user_id,
                profileId: profile.id,
                productId: product.id,
                productTitle: product.title,
                productPrice: product.price || 0,
                currency: product.currency || 'TRY',
                creatorName,
                creatorEmail: profile.email,
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                sessionType,
                locationAddress: sessionType === 'in_person' ? locationAddress : undefined,
                preferredDate: formattedDateString,
                timeSlot: selectedTimeSlot,
                clientNote: clientNote.trim() || undefined,
                paymentMode,
            });

            if (!res.success) {
                throw new Error(res.error || 'Talep iletilemedi');
            }

            setOrderNumber(res.orderNumber || '');
            setStep(4);
        } catch (err: any) {
            showToast(err.message || 'Bir hata oluştu.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPayment = () => {
        const checkoutUrl = product.external_checkout_url || profile?.payment_url;
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">

                {/* HEADER */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        {step > 1 && step < 4 && (
                            <button
                                onClick={() => setStep((s) => (s - 1) as any)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all active:scale-95"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#5500FF] block">
                                Randevu & Danışmanlık
                            </span>
                            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-slate-900 leading-tight line-clamp-1">
                                {step === 4 ? 'Talep Onayı' : product.title}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* STEP PROGRESS BAR */}
                {step < 4 && (
                    <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                        <div className="flex-1 flex items-center gap-2">
                            <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                                step >= 1 ? "bg-[#5500FF] text-white" : "bg-slate-200 text-slate-500"
                            )}>1</span>
                            <span className={step === 1 ? "text-slate-900 font-extrabold" : ""}>Tür</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <div className="flex-1 flex items-center gap-2">
                            <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                                step >= 2 ? "bg-[#5500FF] text-white" : "bg-slate-200 text-slate-500"
                            )}>2</span>
                            <span className={step === 2 ? "text-slate-900 font-extrabold" : ""}>Tarih</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        <div className="flex-1 flex items-center gap-2">
                            <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                                step >= 3 ? "bg-[#5500FF] text-white" : "bg-slate-200 text-slate-500"
                            )}>3</span>
                            <span className={step === 3 ? "text-slate-900 font-extrabold" : ""}>Bilgiler</span>
                        </div>
                    </div>
                )}

                {/* MODAL BODY */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">

                    {/* ═══ STEP 1: Görüşme Türü Seçimi ═══ */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-extrabold text-slate-900">
                                    Görüşme Türünü Seçin
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Seans süresi: <strong className="text-slate-800">{durationMinutes} Dakika</strong>
                                    {!hidePrice && product.price > 0 && (
                                        <span> • <strong className="text-[#5500FF]">{formatCurrency(product.price, product.currency || 'TRY')}</strong></span>
                                    )}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Online Seans */}
                                {allowOnline && (
                                    <div
                                        onClick={() => setSessionType('online')}
                                        className={cn(
                                            "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4",
                                            sessionType === 'online'
                                                ? "border-[#5500FF] bg-[#5500FF]/5 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl",
                                            sessionType === 'online' ? "bg-[#5500FF] text-white" : "bg-slate-100 text-slate-600"
                                        )}>
                                            🌐
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[15px] font-bold text-slate-900">Online Seans</h4>
                                                {sessionType === 'online' && (
                                                    <span className="w-5 h-5 rounded-full bg-[#5500FF] text-white flex items-center justify-center text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-slate-500 mt-1 leading-snug">
                                                Google Meet veya Zoom üzerinden görüntülü görüşme.
                                            </p>
                                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                                                Konumdan Bağımsız • Tüm Türkiye
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Yüz Yüze Seans */}
                                {allowInPerson && (
                                    <div
                                        onClick={() => setSessionType('in_person')}
                                        className={cn(
                                            "p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4",
                                            sessionType === 'in_person'
                                                ? "border-[#5500FF] bg-[#5500FF]/5 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl",
                                            sessionType === 'in_person' ? "bg-[#5500FF] text-white" : "bg-slate-100 text-slate-600"
                                        )}>
                                            📍
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[15px] font-bold text-slate-900">Yüz Yüze Seans</h4>
                                                {sessionType === 'in_person' && (
                                                    <span className="w-5 h-5 rounded-full bg-[#5500FF] text-white flex items-center justify-center text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-slate-500 mt-1 leading-snug">
                                                Klinik veya ofis ortamında birebir görüşme.
                                            </p>
                                            {locationAddress && (
                                                <div className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 bg-amber-50 border border-amber-200/60 rounded-lg px-2.5 py-1">
                                                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                    <span className="truncate">{locationAddress}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleNextFromType}
                                className="w-full h-14 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-lg shadow-[#5500FF]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <span>Tarih Seçimine Geç</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ═══ STEP 2: Tercih Edilen Zaman Dilimi ═══ */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-extrabold text-slate-900">
                                    Uygun Tarih & Zaman Aralığı
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Görüşmek istediğiniz tahmini gün ve saat bloğunu seçin.
                                </p>
                            </div>

                            {/* Date Picker Carousel */}
                            <div className="space-y-2">
                                <label className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider block">
                                    📅 Tercih Edilen Gün
                                </label>
                                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 -mx-2 px-2 scrollbar-none">
                                    {upcomingDays.map((d) => {
                                        const isSelected = selectedDate === d.iso;
                                        return (
                                            <button
                                                type="button"
                                                key={d.iso}
                                                onClick={() => setSelectedDate(d.iso)}
                                                className={cn(
                                                    "flex flex-col items-center justify-center min-w-[70px] h-[78px] rounded-2xl border-2 transition-all shrink-0 active:scale-95",
                                                    isSelected
                                                        ? "border-[#5500FF] bg-[#5500FF] text-white shadow-md shadow-[#5500FF]/25"
                                                        : "border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700 hover:bg-white"
                                                )}
                                            >
                                                <span className={cn("text-[11px] font-bold uppercase", isSelected ? "text-white/80" : "text-slate-400")}>
                                                    {d.dayName}
                                                </span>
                                                <span className="text-[19px] font-black leading-tight my-0.5">
                                                    {d.dayNum}
                                                </span>
                                                <span className={cn("text-[10px] font-bold", isSelected ? "text-white/90" : "text-slate-500")}>
                                                    {d.monthName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slot Blocks */}
                            <div className="space-y-2.5">
                                <label className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider block">
                                    ⏰ Zaman Aralığı (Saat Bloğu)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {TIME_BLOCKS.map((slot) => {
                                        const fullLabel = `${slot.label} (${slot.time})`;
                                        const isSelected = selectedTimeSlot === fullLabel;
                                        return (
                                            <button
                                                type="button"
                                                key={slot.id}
                                                onClick={() => setSelectedTimeSlot(fullLabel)}
                                                className={cn(
                                                    "p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-3",
                                                    isSelected
                                                        ? "border-[#5500FF] bg-[#5500FF]/5 text-slate-900 font-bold"
                                                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="text-base">{slot.icon}</span>
                                                    <div>
                                                        <span className="text-[13px] font-bold block text-slate-900 leading-tight">
                                                            {slot.label}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500 font-medium">
                                                            {slot.time}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <span className="w-5 h-5 rounded-full bg-[#5500FF] text-white flex items-center justify-center text-xs shrink-0">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                                💡 Kesin randevu saati, uzmanımız tarafından WhatsApp veya telefon üzerinden sizinle iletişime geçilerek karşılıklı teyit edilecektir.
                            </p>

                            <button
                                onClick={handleNextFromDateTime}
                                className="w-full h-14 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-lg shadow-[#5500FF]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <span>İletişim Bilgilerine Geç</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ═══ STEP 3: Kısa Danışan Bilgileri ═══ */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-extrabold text-slate-900">
                                    İletişim Bilgileriniz
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Randevu onayı ve bağlantı linki için bilgilerinizi eksiksiz doldurun.
                                </p>
                            </div>

                            {/* Ad Soyad */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-extrabold text-slate-700 block">
                                    Ad Soyad <span className="text-[#5500FF]">*</span>
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Ahmet Yılmaz"
                                        className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:border-[#5500FF] focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Telefon */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-extrabold text-slate-700 block">
                                    Telefon Numarası (WhatsApp) <span className="text-[#5500FF]">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="w-5 h-5 text-emerald-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0532 123 45 67"
                                        className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:border-[#5500FF] focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <span className="text-[11px] text-slate-400 font-medium block">
                                    WhatsApp üzerinden randevu saatiniz teyit edilecektir.
                                </span>
                            </div>

                            {/* E-posta */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-extrabold text-slate-700 block">
                                    E-posta Adresi <span className="text-[#5500FF]">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ahmet@example.com"
                                        className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-[14px] font-bold text-slate-900 outline-none focus:border-[#5500FF] focus:bg-white transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Kısa Not */}
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-extrabold text-slate-700 block">
                                    Kısa Not <span className="text-slate-400 font-normal">(Opsiyonel)</span>
                                </label>
                                <textarea
                                    value={clientNote}
                                    onChange={(e) => setClientNote(e.target.value)}
                                    placeholder="Kısaca destek almak istediğiniz konudan bahsedebilirsiniz..."
                                    rows={2}
                                    className="w-full p-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-[13px] font-medium text-slate-900 outline-none focus:border-[#5500FF] focus:bg-white transition-all resize-none placeholder:text-slate-400"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-lg shadow-[#5500FF]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Talebiniz İletiliyor...</span>
                                    </>
                                ) : paymentMode === 'pay_now' ? (
                                    <>
                                        <span>Talebi Gönder & Ödemeye Geç</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>Randevu Talebini Gönder ✨</span>
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 pt-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Bilgileriniz gizli tutulur ve yalnızca randevu amacıyla kullanılır.</span>
                            </div>
                        </form>
                    )}

                    {/* ═══ STEP 4: Başvuru Onay Ekranı ═══ */}
                    {step === 4 && (
                        <div className="py-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 className="w-10 h-10 animate-bounce" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-[22px] font-extrabold text-slate-900">
                                    Talebiniz Başarıyla İletildi! 🎉
                                </h3>
                                <p className="text-[14px] text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                                    Talebiniz <strong className="text-slate-900">{creatorName}</strong>&apos;a iletildi. Randevu saatinizi netleştirmek için en kısa sürede <strong className="text-emerald-700">WhatsApp / Telefon</strong> üzerinden sizinle iletişime geçilecektir.
                                </p>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2.5">
                                <div className="flex justify-between pb-2 border-b border-slate-200">
                                    <span className="text-slate-500">Talep No:</span>
                                    <span className="font-mono font-bold text-slate-900">{orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Hizmet:</span>
                                    <span className="font-bold text-slate-900">{product.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Görüşme Türü:</span>
                                    <span className="font-bold text-[#5500FF]">
                                        {sessionType === 'online' ? '🌐 Online Seans' : `📍 Yüz Yüze (${locationAddress || 'Klinik'})`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Zaman Aralığı:</span>
                                    <span className="font-bold text-slate-900">{selectedTimeSlot}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Danışan:</span>
                                    <span className="font-bold text-slate-900">{fullName} ({phone})</span>
                                </div>
                            </div>

                            {/* Payment Redirect Button if payment_mode is pay_now */}
                            {paymentMode === 'pay_now' && (product.external_checkout_url || profile?.payment_url) ? (
                                <button
                                    onClick={handleProceedToPayment}
                                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    <span>Ödemeyi Tamamla (Shopier / Kart)</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full h-13 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-bold transition-all active:scale-[0.98]"
                                >
                                    Tamam, Kapat
                                </button>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
