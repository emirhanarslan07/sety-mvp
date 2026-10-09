'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Check, X, ChevronDown, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { useToast } from '@/context/ToastContext';
import { useDashboard } from '@/context/DashboardContext';
import { supabase } from '@/lib/supabase/client';
import { completeOnboardingAction } from '@/app/actions/onboarding';

interface OnboardingScreenProps {
    profile: any;
    refreshData: () => Promise<void>;
}

const NICHES = [
    'Yazılım / Teknoloji',
    'Tasarım / Sanat',
    'Koçluk / Danışmanlık',
    'Eğitim / Kurs',
    'E-kitap / Şablon',
    'Diğer'
];

export function OnboardingScreen({ profile, refreshData }: OnboardingScreenProps) {
    const { user, store } = useDashboard();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    
    const [username, setUsername] = useState('');
    const [niche, setNiche] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Phase 4: Import State
    const [importUrl, setImportUrl] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [importedImage, setImportedImage] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Pre-fill username based on email if it exists
    useEffect(() => {
        if (user?.email && !username) {
            const defaultName = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
            setUsername(defaultName);
        }
    }, [user]);

    // Check username availability
    useEffect(() => {
        const checkAvailability = async () => {
            if (!username || username.length < 3) {
                setIsAvailable(null);
                return;
            }

            const cleanUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
            if (cleanUsername !== username || cleanUsername.length < 3) {
                setIsAvailable(false);
                return;
            }

            const reserved = ['admin', 'sety', 'api', 'auth', 'dashboard', 'store', 'support', 'help', 'login', 'signup', 'register'];
            if (reserved.includes(cleanUsername)) {
                setIsAvailable(false);
                return;
            }

            setIsChecking(true);
            try {
                const { data, error } = await supabase
                    .from('stores')
                    .select('id')
                    .eq('username', cleanUsername)
                    .maybeSingle();

                if (error) {
                    console.error('Error checking username:', error);
                    setIsAvailable(false);
                } else {
                    setIsAvailable(!data);
                }
            } catch (err) {
                console.error(err);
                setIsAvailable(false);
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(checkAvailability, 150);
        return () => clearTimeout(timeoutId);
    }, [username]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleComplete = async () => {
        if (!isAvailable || username.length < 3) {
            showToast("Lütfen geçerli ve kullanılabilir bir mağaza adı girin.", "error");
            return;
        }

        setLoading(true);
        try {
            const result = await completeOnboardingAction(
                user?.id as string,
                profile.id,
                store?.id as string,
                username,
                niche
            );

            if (!result.success) {
                throw new Error(result.error);
            }
            
            showToast("Mağazanız başarıyla oluşturuldu!", "success");
            await refreshData();
        } catch (error: any) {
            console.error("Error completing onboarding:", error);
            showToast(error.message || "Bir hata oluştu.", "error");
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!importUrl || importUrl.length < 5) {
            showToast("Lütfen geçerli bir Linktree veya Stan Store linki girin.", "error");
            return;
        }

        setIsImporting(true);
        try {
            const res = await fetch('/api/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: importUrl })
            });
            const result = await res.json();

            if (result.success) {
                setImportSuccess(true);
                showToast("Profiliniz başarıyla kopyalandı! (Magic Import)", "success");
                
                if (result.data.image) {
                    setImportedImage(result.data.image);
                }
                
                // Set username from imported name if current is empty or auto-generated
                if (result.data.name) {
                    const clean = result.data.name.toLowerCase().replace(/[^a-z0-9-]/g, '');
                    if (clean.length >= 3) {
                        setUsername(clean);
                    }
                }
            } else {
                showToast(result.error || "İçe aktarılırken bir hata oluştu.", "error");
                showToast("Profilinizi otomatik çekemedik, lütfen aşağıdaki formdan manuel olarak devam edin.", "info");
            }
        } catch (error) {
            console.error("Import error:", error);
            showToast("Bağlantı hatası.", "error");
            showToast("Lütfen mağaza bilgilerinizi manuel olarak girin.", "info");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#5500ff]/[0.03] backdrop-blur-sm overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5500ff]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8844ff]/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5500ff]/15 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
            
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-6 min-h-[100dvh]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_80px_-20px_rgba(85,0,255,0.15)] border border-white p-8 md:p-12 my-auto overflow-visible"
                >
                <div className="flex justify-center mb-8">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="w-16 h-16 rounded-2xl bg-[#5500ff]/10 border border-[#5500ff]/20 shadow-lg shadow-[#5500ff]/10 flex items-center justify-center p-3"
                    >
                        <SetyLogo size="md" />
                    </motion.div>
                </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-3 tracking-tight">
                        Sety'ye Hoş Geldin! <span className="inline-block hover:scale-110 transition-transform origin-bottom-left cursor-default">🚀</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-center mb-8 text-[15px] leading-relaxed max-w-[90%] mx-auto">
                        Mağazanı 2 dakikada kur veya varolan hesabını tek tıkla Sety'ye taşı.
                    </p>

                    {/* Phase 4: 1-Click Migration Engine */}
                    <div className="mb-8 p-5 bg-[#5500ff]/[0.02] border border-[#5500ff]/10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                            <DownloadCloud className="w-16 h-16 text-[#5500ff]" />
                        </div>
                        <div className="relative z-10">
                            <label className="text-sm font-bold text-[#5500ff] ml-1 flex items-center gap-2 mb-3">
                                <span className="flex h-5 w-5 rounded-full bg-[#5500ff]/10 items-center justify-center">✨</span>
                                Linktree / Stan Store'dan Aktar (Magic)
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={importUrl}
                                    onChange={(e) => setImportUrl(e.target.value)}
                                    placeholder="Linkinizi yapıştırın (örn: linktr.ee/john)"
                                    className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#5500ff] focus:ring-2 focus:ring-[#5500ff]/10 transition-all text-sm"
                                />
                                <Button 
                                    onClick={handleImport}
                                    disabled={isImporting || importSuccess}
                                    className={`h-12 px-5 rounded-xl font-bold text-white transition-all shadow-md ${importSuccess ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#5500ff] hover:bg-[#4400cc]'}`}
                                >
                                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : importSuccess ? <Check className="w-5 h-5" /> : 'İçe Aktar'}
                                </Button>
                            </div>
                            {importedImage && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-3 mt-4 pt-4 border-t border-[#5500ff]/10"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                        {/* Using our Proxy API to bypass CORS/Referrer policies */}
                                        <img src={`/api/proxy-image?url=${encodeURIComponent(importedImage)}`} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm font-medium text-[#5500ff]">Profil resminiz güvenle çekildi!</p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="relative flex items-center py-4 mb-4">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">veya manuel kur</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <div className="space-y-6 mb-10">
                        {/* Username Input */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Mağaza Linkin</label>
                            <div className="relative flex items-center group bg-white border-2 border-slate-100 hover:border-slate-200 focus-within:border-[#5500ff] focus-within:ring-4 focus-within:ring-[#5500ff]/10 rounded-2xl transition-all shadow-sm h-14 overflow-hidden">
                                <span className="pl-4 pr-0.5 text-slate-400 font-medium select-none group-focus-within:text-[#5500ff] whitespace-nowrap transition-colors">
                                    sety.store/
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    placeholder="mağaza-adin"
                                    className="flex-1 h-full bg-transparent outline-none font-medium text-slate-900 placeholder:text-slate-300 pr-12 min-w-0"
                                />
                                <div className="absolute right-4 flex items-center z-10">
                                {isChecking ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                ) : username.length >= 3 ? (
                                    isAvailable ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-100 p-1 rounded-full">
                                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-rose-100 p-1 rounded-full">
                                            <X className="w-4 h-4 text-rose-600 stroke-[3]" />
                                        </motion.div>
                                    )
                                ) : null}
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {username.length > 0 && username.length < 3 && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-rose-500 font-medium ml-1">En az 3 karakter girmelisiniz.</motion.p>
                            )}
                            {username.length >= 3 && !isChecking && !isAvailable && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-rose-500 font-medium ml-1">Bu mağaza adı maalesef alınmış.</motion.p>
                            )}
                            {username.length >= 3 && !isChecking && isAvailable && (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-emerald-500 font-medium ml-1">Harika! Bu ad kullanılabilir.</motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Custom Dropdown */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                            Kategori <span className="text-slate-400 font-normal ml-1">(İsteğe bağlı)</span>
                        </label>
                        <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full h-14 px-4 rounded-2xl bg-white border-2 hover:border-slate-200 outline-none transition-all font-medium flex items-center justify-between cursor-pointer shadow-sm ${isDropdownOpen ? 'border-[#5500ff] ring-4 ring-[#5500ff]/10' : 'border-slate-100'}`}
                        >
                            <span className={niche ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                                {niche || 'Seçiniz...'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                                >
                                    {NICHES.map((n) => (
                                        <div 
                                            key={n}
                                            onClick={() => {
                                                setNiche(n);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between hover:bg-[#5500ff]/5 ${niche === n ? 'bg-[#5500ff]/10 text-[#5500ff] font-semibold' : 'text-slate-600 font-medium'}`}
                                        >
                                            {n}
                                            {niche === n && <Check className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                    <Button 
                        onClick={handleComplete} 
                        disabled={loading || !isAvailable || username.length < 3}
                        className="relative w-full h-16 rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-bold text-lg shadow-xl shadow-[#5500ff]/20 active:scale-[0.98] transition-all group overflow-hidden disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Mağazamı Oluştur
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

