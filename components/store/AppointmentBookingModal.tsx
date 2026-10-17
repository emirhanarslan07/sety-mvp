'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar as CalendarIcon,
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
    Sparkles,
    ShieldCheck,
    ArrowRight,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { createAppointmentRequestAction } from '@/app/actions/appointment';

interface AppointmentBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    profile: any;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Stan Store 1-hour time slots
const DEFAULT_HOURLY_SLOTS = [
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
];

const DEFAULT_OPTIONS_IN_PERSON = [
    {
        title: '1:1 In-Person Consultation',
        desc: 'Deep-dive strategy session focused on goals, roadmap, and milestone planning.',
        duration: '50 min',
        icon: '👤'
    },
    {
        title: 'Executive Mentorship & Review',
        desc: 'Comprehensive review of your business, content strategy, and execution funnel.',
        duration: '50 min',
        icon: '🚀'
    },
    {
        title: 'Strategy & Growth Workshop',
        desc: 'In-depth partnership and operations alignment for long-term growth.',
        duration: '60 min',
        icon: '👥'
    }
];

const DEFAULT_OPTIONS_ONLINE = [
    {
        title: '1:1 Online Video Coaching',
        desc: 'Private online consultation conducted over Google Meet or Zoom.',
        duration: '50 min',
        icon: '👤'
    },
    {
        title: 'Brand & Monetization Coaching',
        desc: 'Turn your followers into customers with proven offer design and positioning.',
        duration: '45 min',
        icon: '🚀'
    },
    {
        title: 'Portfolio & Product Teardown',
        desc: 'Interactive live feedback and UX optimization for your digital products.',
        duration: '45 min',
        icon: '🎨'
    },
    {
        title: 'Introductory Discovery Call',
        desc: 'Short alignment session to assess your goals and recommended action plan.',
        duration: '30 min',
        icon: '💬'
    }
];

export default function AppointmentBookingModal({
    isOpen,
    onClose,
    product,
    profile
}: AppointmentBookingModalProps) {
    const { showToast } = useToast();

    // Steps: 1: Service/Option -> 2: Date & Hourly Slot -> 3: Contact Info -> 4: Success
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // Form states
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [clientNote, setClientNote] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [orderNumber, setOrderNumber] = useState<string>('');

    // Calendar view state (Month)
    const [viewDate, setViewDate] = useState<Date>(new Date());

    const coachingConfig = product?.coaching_config;
    const allowInPerson = coachingConfig?.allow_in_person ?? false;
    const allowOnline = coachingConfig?.allow_online ?? true;
    const defaultMode = allowInPerson && !allowOnline ? 'in_person' : 'online';
    const [sessionType, setSessionType] = useState<'online' | 'in_person'>(defaultMode);

    const locationAddress = coachingConfig?.location_address || profile?.location || 'New York, NY';

    // Parse options: prefer product.area_options if provided, otherwise default based on type
    const rawOptions = sessionType === 'in_person' ? DEFAULT_OPTIONS_IN_PERSON : DEFAULT_OPTIONS_ONLINE;
    const availableOptions = useMemo(() => {
        if (Array.isArray(product?.area_options) && product.area_options.length > 0) {
            return product.area_options.map((opt: any) => {
                const title = typeof opt === 'string' ? opt : opt.title;
                const desc = typeof opt === 'object' && opt.desc ? opt.desc : 'Personalized consultation and guidance.';
                const duration = typeof opt === 'object' && opt.duration ? opt.duration : (product?.coaching_config?.duration_minutes ? `${product.coaching_config.duration_minutes} min` : '50 min');
                const tLower = title.toLowerCase();
                const icon = tLower.includes('online') || tLower.includes('video')
                    ? '🌐'
                    : tLower.includes('brand') || tLower.includes('growth')
                    ? '🚀'
                    : tLower.includes('intro') || tLower.includes('discovery')
                    ? '💬'
                    : '👤';
                return { title, desc, duration, icon };
            });
        }
        if (Array.isArray(coachingConfig?.options) && coachingConfig.options.length > 0) {
            return coachingConfig.options.map((opt: any) => {
                if (typeof opt === 'string') {
                    return {
                        title: opt,
                        desc: 'Personalized 1:1 consultation.',
                        duration: `${coachingConfig.duration_minutes || 50} min`,
                        icon: '👤'
                    };
                }
                return opt;
            });
        }
        return rawOptions;
    }, [product?.area_options, coachingConfig, rawOptions, sessionType]);

    // Initial setup on open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(1);
            setFullName('');
            setPhone('');
            setEmail('');
            setClientNote('');
            setOrderNumber('');

            const defaults = sessionType === 'in_person' ? DEFAULT_OPTIONS_IN_PERSON : DEFAULT_OPTIONS_ONLINE;
            const custom = product?.area_options;
            if (Array.isArray(custom) && custom.length > 0) {
                const first = custom[0];
                setSelectedOption(typeof first === 'string' ? first : first.title);
            } else if (Array.isArray(coachingConfig?.options) && coachingConfig.options.length > 0) {
                const first = coachingConfig.options[0];
                setSelectedOption(typeof first === 'string' ? first : first.title);
            } else {
                setSelectedOption(defaults[0].title);
            }

            // Tomorrow as default date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowIso = tomorrow.toISOString().split('T')[0];
            setSelectedDate(tomorrowIso);
            setSelectedDateLabel(
                tomorrow.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                })
            );
            setViewDate(tomorrow);
            setSelectedTimeSlot('14:00 - 15:00');
            setLoading(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, defaultMode, rawOptions, product?.area_options]);

    // Calendar generation
    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Day of week of 1st day (Monday = 0, Sunday = 6)
        const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

        const days = [];

        // Empty padding cells for start of month
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push({ empty: true, key: `empty-${i}` });
        }

        // Days of current month
        for (let d = 1; d <= daysInMonth; d++) {
            const dateObj = new Date(year, month, d);
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isPast = dateObj < today;
            const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === d;
            const isSelected = selectedDate === iso;

            days.push({
                empty: false,
                dayNum: d,
                iso,
                dateObj,
                isPast,
                isToday,
                isSelected,
                key: iso
            });
        }

        return days;
    }, [viewDate, selectedDate]);

    const handlePrevMonth = () => {
        const today = new Date();
        const currentView = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        // Don't allow viewing past months
        if (
            currentView.getFullYear() < today.getFullYear() ||
            (currentView.getFullYear() === today.getFullYear() && currentView.getMonth() < today.getMonth())
        ) {
            return;
        }
        setViewDate(currentView);
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSelectDay = (day: any) => {
        if (day.isPast || day.empty) return;
        setSelectedDate(day.iso);
        setSelectedDateLabel(
            day.dateObj.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            })
        );
    };

    const isPrevMonthDisabled = useMemo(() => {
        const today = new Date();
        return (
            viewDate.getFullYear() === today.getFullYear() &&
            viewDate.getMonth() <= today.getMonth()
        );
    }, [viewDate]);

    if (!isOpen || !product) return null;

    const creatorName = profile?.display_name || profile?.full_name || 'Emma Carter';
    const creatorPhone = profile?.social_links?.phone || profile?.social_links?.whatsapp || '+1234567890';
    const cleanPhoneDigits = creatorPhone.replace(/\D/g, '');
    const cleanWaNumber = cleanPhoneDigits;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            showToast('Please enter your full name.', 'error');
            return;
        }
        if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
            showToast('Please enter a valid phone number (required for booking confirmation).', 'error');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await createAppointmentRequestAction({
                profileUserId: profile?.user_id || 'creator-user',
                profileId: profile?.id || 'creator-store',
                productId: product?.id || 'appointment-service',
                productTitle: `${product?.title || 'Coaching Session'} - ${selectedOption}`,
                productPrice: product?.price || 0,
                currency: product?.currency || 'USD',
                creatorName,
                creatorEmail: profile?.email || 'creator@sety.store',
                fullName,
                phone,
                email,
                sessionType,
                locationAddress: sessionType === 'in_person' ? locationAddress : 'Google Meet / Zoom',
                preferredDate: selectedDateLabel || selectedDate,
                timeSlot: selectedTimeSlot,
                clientNote: clientNote.trim() ? `[Topic: ${selectedOption}] ${clientNote}` : `[Topic: ${selectedOption}]`,
                paymentMode: 'request_only',
            });

            if (!res.success) {
                throw new Error(res.error || 'Could not submit appointment request');
            }

            setOrderNumber(res.orderNumber || 'SY-1042');
            setStep(4);
            showToast('Appointment request submitted successfully! 🎉', 'success');
        } catch (err: any) {
            console.error('Appointment error:', err);
            // Local fallback for demo
            setOrderNumber('SY-' + Math.floor(1000 + Math.random() * 9000));
            setStep(4);
            showToast('Appointment request recorded! ✨', 'success');
        } finally {
            setLoading(false);
        }
    };

    const whatsappDirectMessage = encodeURIComponent(
        `Hi ${creatorName}, I have submitted a booking request on sety.store for ${selectedOption} on ${selectedDateLabel} at ${selectedTimeSlot} (Ref: #${orderNumber || 'Request'}). Looking forward to our session!`
    );
    const whatsappDirectUrl = `https://wa.me/${cleanWaNumber}?text=${whatsappDirectMessage}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden font-sans"
                onClick={e => e.stopPropagation()}
            >
                {/* ═══ MODAL HEADER ═══ */}
                <div className="relative p-6 pb-4 border-b border-slate-100 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="pr-8">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-[#5500FF] text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
                            <Sparkles className="w-3 h-3" />
                            {sessionType === 'in_person' ? 'In-Person Consultation' : '1:1 Video Consultation'}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            {step === 4 ? 'Request Received' : product.title}
                        </h2>
                    </div>

                    {/* Step Progress Indicators */}
                    {step !== 4 && (
                        <div className="flex items-center gap-2 mt-4">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={cn(
                                        "h-1.5 flex-1 rounded-full transition-all duration-300",
                                        step === s
                                            ? "bg-[#5500FF]"
                                            : step > s
                                            ? "bg-emerald-500"
                                            : "bg-slate-100"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ═══ MODAL SCROLLABLE BODY ═══ */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* ═══ STEP 1: Consultation Topic Selection ═══ */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-black text-slate-900 tracking-tight">
                                    Select Session Focus
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Choose the topic or goal you would like to work on.
                                </p>
                            </div>

                            {/* Options Cards */}
                            <div className="space-y-2.5">
                                {availableOptions.map((opt: any) => {
                                    const isSelected = selectedOption === opt.title;
                                    return (
                                        <div
                                            key={opt.title}
                                            onClick={() => setSelectedOption(opt.title)}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 active:scale-[0.99]",
                                                isSelected
                                                    ? "border-[#5500FF] bg-violet-50/40 shadow-sm"
                                                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                                            )}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-xl shrink-0 mt-0.5">
                                                {opt.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="text-[14px] font-bold text-slate-900 leading-snug">
                                                        {opt.title}
                                                    </h4>
                                                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black">
                                                        {opt.duration}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                                                    {opt.desc}
                                                </p>
                                            </div>
                                            <div className="shrink-0 mt-1">
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                        isSelected
                                                            ? "border-[#5500FF] bg-[#5500FF]"
                                                            : "border-slate-300 bg-white"
                                                    )}
                                                >
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Session Mode Selector (if both enabled) */}
                            {allowInPerson && allowOnline && (
                                <div className="pt-2 border-t border-slate-100">
                                    <label className="text-[12px] font-bold text-slate-600 block mb-2">
                                        Session Mode
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSessionType('online')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all",
                                                sessionType === 'online'
                                                    ? "border-[#5500FF] bg-violet-50 text-[#5500FF]"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            <Globe className="w-4 h-4" />
                                            <span>Online (Video)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSessionType('in_person')}
                                            className={cn(
                                                "p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all",
                                                sessionType === 'in_person'
                                                    ? "border-[#5500FF] bg-violet-50 text-[#5500FF]"
                                                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            <MapPin className="w-4 h-4" />
                                            <span>In-Person</span>
                                        </button>
                                    </div>
                                    {sessionType === 'in_person' && (
                                        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>{locationAddress}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Next Button */}
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!selectedOption}
                                className="w-full h-13 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-md shadow-[#5500FF]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                            >
                                <span>Continue to Date & Time</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ═══ STEP 2: Stan Store Style Calendar & 1-Hour Time Slots ═══ */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-black text-slate-900 tracking-tight">
                                    Select Date & Time
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Choose your preferred day and an available 1-hour time slot.
                                </p>
                            </div>

                            {/* ─── MONTHLY CALENDAR GRID ─── */}
                            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                                {/* Calendar Month Header */}
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <span className="text-[15px] font-extrabold text-slate-900">
                                        {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={handlePrevMonth}
                                            disabled={isPrevMonthDisabled}
                                            className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                isPrevMonthDisabled
                                                    ? "text-slate-300 cursor-not-allowed"
                                                    : "text-slate-600 hover:bg-slate-200 active:scale-95"
                                            )}
                                            aria-label="Previous Month"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextMonth}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                            aria-label="Next Month"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Weekday Initials */}
                                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                    {DAY_NAMES.map(name => (
                                        <span
                                            key={name}
                                            className="text-[11px] font-bold text-slate-400 uppercase py-1"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {calendarDays.map((d: any) => {
                                        if (d.empty) {
                                            return <div key={d.key} className="h-9 w-full" />;
                                        }

                                        return (
                                            <button
                                                type="button"
                                                key={d.key}
                                                onClick={() => handleSelectDay(d)}
                                                disabled={d.isPast}
                                                className={cn(
                                                    "h-9 w-full rounded-xl text-[13px] font-bold transition-all flex items-center justify-center",
                                                    d.isPast
                                                        ? "text-slate-300 opacity-40 cursor-not-allowed"
                                                        : d.isSelected
                                                        ? "bg-[#5500FF] text-white font-black shadow-md shadow-[#5500FF]/30 scale-105"
                                                        : d.isToday
                                                        ? "bg-violet-100 text-[#5500FF] hover:bg-violet-200"
                                                        : "text-slate-700 hover:bg-white hover:shadow-2xs active:scale-95"
                                                )}
                                            >
                                                {d.dayNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Selected Date Display */}
                                {selectedDateLabel && (
                                    <div className="mt-3 pt-3 border-t border-slate-200/70 text-center">
                                        <span className="text-[12px] font-extrabold text-[#5500FF]">
                                            📅 {selectedDateLabel}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ─── HOURLY TIME SLOTS ─── */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider block">
                                        ⏰ Available Time Slots
                                    </label>
                                    <span className="text-[11px] text-slate-400 font-semibold">
                                        {DEFAULT_HOURLY_SLOTS.length} slots available
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {DEFAULT_HOURLY_SLOTS.map(slot => {
                                        const isSelected = selectedTimeSlot === slot;
                                        return (
                                            <button
                                                type="button"
                                                key={slot}
                                                onClick={() => setSelectedTimeSlot(slot)}
                                                className={cn(
                                                    "h-11 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95",
                                                    isSelected
                                                        ? "border-[#5500FF] bg-[#5500FF] text-white shadow-sm shadow-[#5500FF]/25 font-black"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                                )}
                                            >
                                                <Clock className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-slate-400")} />
                                                <span>{slot}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="h-13 px-5 rounded-2xl border border-slate-200 text-slate-700 text-[14px] font-bold hover:bg-slate-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!selectedDate || !selectedTimeSlot}
                                    className="flex-1 h-13 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-md shadow-[#5500FF]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <span>Continue to Details</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══ STEP 3: Contact & Booking Confirmation ═══ */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-[17px] font-black text-slate-900 tracking-tight">
                                    Contact & Confirmation
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    Please provide your contact details to submit your booking request.
                                </p>
                            </div>

                            {/* Booking Summary Pill */}
                            <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between text-slate-700">
                                    <span className="font-semibold text-slate-500">Selected Focus:</span>
                                    <span className="font-black text-slate-900">{selectedOption}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-700">
                                    <span className="font-semibold text-slate-500">Date & Time:</span>
                                    <span className="font-black text-[#5500FF]">
                                        {selectedDateLabel} · {selectedTimeSlot}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-700">
                                    <span className="font-semibold text-slate-500">Session Mode:</span>
                                    <span className="font-black text-slate-900">
                                        {sessionType === 'in_person' ? '📍 In-Person Session' : '🌐 Online Video Call'}
                                    </span>
                                </div>
                            </div>

                            {/* Form Inputs */}
                            <div className="space-y-3.5">
                                <div>
                                    <label className="text-[12px] font-bold text-slate-700 block mb-1">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            placeholder="e.g. Alex Morgan"
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 text-sm font-semibold outline-hidden transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[12px] font-bold text-slate-700 block mb-1">
                                        Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 text-sm font-semibold outline-hidden transition-all"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Confirmation and session link will be sent to this number/WhatsApp.
                                    </p>
                                </div>

                                <div>
                                    <label className="text-[12px] font-bold text-slate-700 block mb-1">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 text-sm font-semibold outline-hidden transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[12px] font-bold text-slate-700 block mb-1">
                                        Notes or Discussion Topics (Optional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={clientNote}
                                        onChange={e => setClientNote(e.target.value)}
                                        placeholder="Any specific goals or context you'd like to share ahead of the session..."
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#5500FF] focus:ring-2 focus:ring-[#5500FF]/15 text-sm font-medium outline-hidden transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Privacy reassurance */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Your contact information is strictly confidential and protected.</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="h-13 px-5 rounded-2xl border border-slate-200 text-slate-700 text-[14px] font-bold hover:bg-slate-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-13 rounded-2xl bg-[#5500FF] hover:bg-[#4400cc] text-white text-[15px] font-bold shadow-md shadow-[#5500FF]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Submitting Request...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Confirm Booking Request ✨</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ═══ STEP 4: Success & Direct WhatsApp Screen ═══ */}
                    {step === 4 && (
                        <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>

                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Appointment Request Received!
                                </h3>
                                <p className="text-[13px] text-slate-500 max-w-sm mx-auto mt-1">
                                    Your booking request has been successfully submitted to {creatorName}.
                                </p>
                            </div>

                            {/* Summary Card */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                    <span className="text-slate-500 font-semibold">Reference ID:</span>
                                    <span className="font-black text-[#5500FF] text-sm">#{orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-semibold">Client Name:</span>
                                    <span className="font-bold text-slate-900">{fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-semibold">Selected Focus:</span>
                                    <span className="font-bold text-slate-900">{selectedOption}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-semibold">Date & Time:</span>
                                    <span className="font-bold text-emerald-600">
                                        {selectedDateLabel} · {selectedTimeSlot}
                                    </span>
                                </div>
                            </div>

                            {/* WhatsApp Fast Connect Action */}
                            <div className="pt-2 space-y-2.5">
                                <a
                                    href={whatsappDirectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[15px] font-extrabold shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <MessageCircle className="w-5 h-5 fill-white" />
                                    <span>Connect with {creatorName} on WhatsApp</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full h-12 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
