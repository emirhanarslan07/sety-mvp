'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    Mail,
    Download,
    Clock,
    Sparkles,
    Box,
    Play,
    Video,
    CreditCard,
    Users2,
    Link2,
    Trophy,
    ChevronRight,
    Instagram,
    Youtube,
    Twitter,
    Facebook,
    Linkedin,
    Github,
    Globe,
    Music2,
    MessageCircle,
    Send,
    Heart,
    Gift,
    Book,
    DollarSign,
    Zap,
    Check,
    Loader2,
    X,
    Lock,
    ExternalLink,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import ProductBottomSheet from '@/components/store/ProductBottomSheet';
import StoryCardGenerator from '@/components/store/StoryCardGenerator';
import { useTranslation } from '@/lib/i18n/context';

const iconMap: Record<string, any> = {
    mail: Mail,
    download: Download,
    video: Video,
    sparkles: Sparkles,
    heart: Heart,
    gift: Gift,
    book: Book,
    music: Music2,
    link: Link2,
    play: Play,
    clock: Clock,
    credit: CreditCard,
    users: Users2,
    trophy: Trophy,
    dollar: DollarSign,
};

const DEFAULT_COVERS: Record<string, string[]> = {
    digital_product: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=2574&auto=format&fit=crop',
    ],
    coaching_call: [
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2670&auto=format&fit=crop',
    ],
    external_link: [
        'https://images.unsplash.com/photo-1512758684065-94ed158f5612?q=80&w=2574&auto=format&fit=crop',
    ]
};

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

const formatTypeLabel = (type: string) => {
    switch (type) {
        case 'digital_product': return 'DİJİTAL İNDİRME';
        case 'coaching_call': return 'BİREBİR KOÇLUK';
        case 'video_response': return 'VİDEO YANIT';
        case 'lead_magnet': return 'ÜCRETSİZ REHBER';
        case 'collect_emails': return 'E-BÜLTEN';
        case 'external_link': return 'BAĞLANTI';
        default: return type.replace('_', ' ').toUpperCase();
    }
};

interface PublicStoreClientProps {
    initialProfile: any;
    initialProducts: any[];
}

export default function PublicStoreClient({ initialProfile, initialProducts }: PublicStoreClientProps) {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslation();

    const [profile, setProfile] = useState<any>(initialProfile);
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [loading, setLoading] = useState(!initialProfile);
    const [error, setError] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    // Lead capture states for inline blocks
    const [leadEmails, setLeadEmails] = useState<Record<string, string>>({});
    const [leadLoading, setLeadLoading] = useState<Record<string, boolean>>({});
    const [leadSuccess, setLeadSuccess] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!initialProfile) {
            const fetchStore = async () => {
                const username = params.username as string;
                const { data: storeData, error: storeError } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('username', username.toLowerCase())
                    .single();

                if (storeError || !storeData) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                const { data: profileData } = await supabase
                    .from('user_profiles')
                    .select('full_name, profile_image_url, is_verified, payment_url')
                    .eq('user_id', storeData.user_id)
                    .single();

                setProfile({
                    ...storeData,
                    full_name: profileData?.full_name,
                    profile_image_url: profileData?.profile_image_url || storeData.store_logo_url,
                    is_verified: profileData?.is_verified,
                    payment_url: profileData?.payment_url || storeData.payment_url,
                });

                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('store_id', storeData.id)
                    .eq('status', 'active')
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false });

                setProducts(productsData || []);
                setLoading(false);
            };
            fetchStore();
        }
    }, [params.username, initialProfile]);

    useEffect(() => {
        if (profile) {
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: profile.username,
                    event_type: 'store_view'
                })
            }).catch(console.error);
        }
    }, [profile?.id, profile?.username]);

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setIsSheetOpen(true);

        fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: profile?.username,
                product_id: product.id,
                event_type: 'product_click'
            })
        }).catch(console.error);

        supabase.from('analytics_events').insert([{
            user_id: profile?.user_id,
            store_id: profile?.id,
            event_name: 'product_view',
            product_id: product.id,
            metadata: { visitor_id: typeof window !== 'undefined' ? localStorage.getItem('s_vid') : null }
        }]);
    };

    const handlePurchase = async (product: any, email?: string) => {
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: profile?.username,
                product_id: product.id,
                event_type: 'product_click'
            })
        }).catch(console.error);

        await supabase.from('analytics_events').insert([{
            user_id: profile?.user_id,
            store_id: profile?.id,
            event_name: 'purchase_captured',
            product_id: product.id,
            metadata: {
                email,
                visitor_id: typeof window !== 'undefined' ? localStorage.getItem('s_vid') : null
            }
        }]);

        if (product.redirect_url) {
            let url = product.redirect_url;
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.location.href = url;
            return;
        }

        if (product.digital_file_url || product.file_url) {
            let url = product.digital_file_url || product.file_url;
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
            return;
        }

        const checkoutUrl = product.external_checkout_url || profile?.payment_url;
        if (checkoutUrl && product.checkout_provider !== 'manual') {
            let url = checkoutUrl;
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        }
    };

    const handleInlineLeadSubmit = async (e: React.FormEvent, product: any) => {
        e.preventDefault();
        const email = leadEmails[product.id];
        if (!email) return;

        setLeadLoading(prev => ({ ...prev, [product.id]: true }));
        try {
            const res = await fetch('/api/lead-capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    store_id: profile.id,
                    block_id: product.id,
                    email,
                    name: email.split('@')[0]
                })
            });
            if (res.ok) {
                setLeadSuccess(prev => ({ ...prev, [product.id]: true }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLeadLoading(prev => ({ ...prev, [product.id]: false }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
                <div className="w-24 h-24 rounded-full bg-slate-100 animate-pulse mb-6" />
                <div className="h-8 w-48 rounded-xl bg-slate-100 animate-pulse mb-3" />
                <div className="h-4 w-64 rounded-xl bg-slate-100 animate-pulse mb-8" />
                <div className="w-full max-w-xl space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    <Box className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Mağaza Bulunamadı</h1>
                <p className="text-slate-500 mb-6 text-sm">Aradığınız kullanıcıya ait bir mağaza bulunamadı veya kapatılmış olabilir.</p>
                <Button onClick={() => router.push('/')} className="bg-[#5500FF] rounded-xl h-11 px-6 font-bold text-white hover:bg-[#4400cc]">
                    Ana Sayfaya Dön
                </Button>
            </div>
        );
    }

    const displayName = profile?.display_name || profile?.full_name || `@${profile?.username}`;
    const announcementText = profile?.announcement_text || 'Bu hafta tüm e-kitap ve rehberlerde özel fırsat';
    const socialPlatforms = [
        { key: 'twitter', icon: Twitter, href: profile?.twitter || profile?.social_links?.twitter || profile?.social_links?.x, label: 'Twitter' },
        { key: 'instagram', icon: Instagram, href: profile?.instagram || profile?.social_links?.instagram, label: 'Instagram' },
        { key: 'youtube', icon: Youtube, href: profile?.youtube || profile?.social_links?.youtube, label: 'YouTube' },
        { key: 'globe', icon: Globe, href: profile?.globe || profile?.website || profile?.social_links?.globe || profile?.social_links?.website, label: 'Website' },
    ];

    const socialItems = socialPlatforms.filter(
        s => typeof s.href === 'string' && s.href.trim().length > 0
    );

    // If no social links configured, show Instagram/YouTube placeholders or leave empty
    const visibleProducts = products.filter(p => p.status === 'active');
    const featuredProduct = visibleProducts.length > 0 ? visibleProducts[0] : null;
    const remainingProducts = visibleProducts.length > 1 ? visibleProducts.slice(1) : [];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#5500FF]/10 selection:text-[#5500FF] relative">
            {/* Announcement Banner */}
            {showBanner && profile?.announcement_text && (
                <div className="relative z-50 flex items-center justify-center bg-[#5500FF] text-white px-6 py-2.5 text-center text-[12px] font-bold uppercase tracking-[0.1em] shadow-sm">
                    <span>{profile.announcement_text}</span>
                    <button
                        onClick={() => setShowBanner(false)}
                        aria-label="Kapat"
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#5500FF]/5 blur-[120px]" />

            <main className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 sm:px-6 pt-12 pb-24">
                {/* ═══ PROFILE HEADER ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center w-full mb-8"
                >
                    {/* Avatar with Glow */}
                    <div className="group relative mb-5">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#5500FF] to-[#C4FF00] opacity-30 blur-md transition duration-500 group-hover:opacity-60" />
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white">
                            {profile?.profile_image_url ? (
                                <Image
                                    src={profile.profile_image_url}
                                    alt={displayName}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-black text-3xl">
                                    {displayName[0]?.toUpperCase() || 'S'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Creator Display Name (Instrument Serif editorial style) */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 leading-[1.05]">
                            {displayName}
                        </h1>
                        {profile?.is_verified && (
                            <span className="inline-flex items-center justify-center p-1 bg-[#5500FF] text-[#C4FF00] rounded-full shadow-sm" title="Doğrulanmış İçerik Üretici">
                                <Zap className="w-3.5 h-3.5 fill-[#C4FF00]" />
                            </span>
                        )}
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p className="max-w-md text-center text-[15px] sm:text-[16px] leading-relaxed text-slate-500 font-normal mb-6">
                            {profile.bio}
                        </p>
                    )}

                    {/* Social Media Pills */}
                    {socialItems.length > 0 && (
                        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-2">
                            {socialItems.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href.startsWith('http://') || href.startsWith('https://') ? href : `https://${href}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 hover:border-[#5500FF]/40 hover:bg-[#5500FF]/5 hover:text-[#5500FF] hover:scale-105"
                                    aria-label={label}
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ═══ PRODUCT CARDS FEED ═══ */}
                <div className="w-full space-y-4">
                    {visibleProducts.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                            <Box className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm font-semibold">Bu mağazada henüz ürün bulunmuyor.</p>
                        </div>
                    ) : (
                        visibleProducts.map((product, idx) => {
                            const isEmailBlock = product.type === 'collect_emails' || product.type === 'lead_magnet';
                            const IconComponent = iconMap[product.icon_id as string] || getFallbackIcon(product.type);
                            const fallbackCover = DEFAULT_COVERS[product.type]?.[0] || DEFAULT_COVERS.digital_product[0];
                            const coverSrc = product.image_url || fallbackCover;
                            const isLeadDone = leadSuccess[product.id];
                            const isLeadSubmitting = leadLoading[product.id];

                            // Inline Lead Magnet Card
                            if (isEmailBlock) {
                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                                        className="relative overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#5500FF]/30 hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-[#5500FF]/10 text-[#5500FF] flex items-center justify-center shrink-0 border border-[#5500FF]/15">
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#5500FF] mb-1">
                                                    {formatTypeLabel(product.type)}
                                                </span>
                                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                                    {product.title}
                                                </h3>
                                                {product.subtitle && (
                                                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                                                        {product.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {isLeadDone ? (
                                            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 p-3.5 text-emerald-700 text-xs font-bold">
                                                <Check className="w-4 h-4 shrink-0" />
                                                <span>Harika! İndirme bağlantısı e-posta adresine gönderildi.</span>
                                            </div>
                                        ) : (
                                            <form onSubmit={(e) => handleInlineLeadSubmit(e, product)} className="flex flex-col sm:flex-row gap-2.5 mt-2">
                                                <input
                                                    type="email"
                                                    required
                                                    value={leadEmails[product.id] || ''}
                                                    onChange={(e) => setLeadEmails(prev => ({ ...prev, [product.id]: e.target.value }))}
                                                    placeholder="E-posta adresini gir..."
                                                    className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#5500FF] focus:bg-white focus:ring-2 focus:ring-[#5500FF]/10 transition-all font-medium"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isLeadSubmitting}
                                                    className="h-11 px-5 rounded-xl bg-[#5500FF] hover:bg-[#4400cc] active:scale-[0.98] text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-[#5500FF]/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                                                >
                                                    {isLeadSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (product.button_text || 'Hemen İndir')}
                                                </button>
                                            </form>
                                        )}
                                    </motion.div>
                                );
                            }

                            // Standard Modern High-Converting Product Card
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                                    onClick={() => handleProductClick(product)}
                                    className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#5500FF]/40 hover:shadow-[0_12px_32px_rgba(85,0,255,0.08)] hover:-translate-y-0.5 active:scale-[0.99] flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    {/* Thumbnail Image */}
                                    <div className="relative w-full sm:w-24 h-44 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100/80 shrink-0">
                                        <Image
                                            src={coverSrc}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 left-2 sm:hidden">
                                            <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[#5500FF] shadow-sm">
                                                {formatTypeLabel(product.type)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="hidden sm:block mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5500FF]">
                                                {formatTypeLabel(product.type)}
                                            </span>
                                        </div>
                                        <h3 className="font-sans text-[17px] sm:text-[18px] font-bold text-slate-900 leading-snug group-hover:text-[#5500FF] transition-colors line-clamp-1">
                                            {product.title}
                                        </h3>
                                        {product.subtitle && (
                                            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                                {product.subtitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0 shrink-0">
                                        <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
                                            {product.price === 0 ? 'ÜCRETSİZ' : formatCurrency(product.price, product.currency || 'TRY')}
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 group-hover:bg-[#5500FF] text-white px-4 py-2 text-xs font-bold transition-all shadow-sm group-hover:shadow-md">
                                            <span>Satın Al</span>
                                            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* ═══ FOOTER BADGE ═══ */}
                <div className="mt-16 flex flex-col items-center gap-3 text-center">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Güvenli Ödeme · Shopier & Kart Korumalı</span>
                    </div>

                    <a
                        href="https://sety.store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 shadow-sm transition-all hover:border-[#5500FF]/40 hover:bg-slate-50"
                    >
                        <span className="text-[11px] font-semibold text-slate-400">Powered by</span>
                        <span className="font-sans text-[12px] font-black tracking-tight text-[#5500FF]">SETY</span>
                    </a>
                </div>
            </main>

            {/* Bottom Sheet for Product Purchase / Lead Capture */}
            <ProductBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                product={selectedProduct}
                profile={profile}
                onPurchase={handlePurchase}
            />

            {/* Story Card Generator Modal */}
            <StoryCardGenerator
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                product={selectedProduct}
                profile={profile}
            />
        </div>
    );
}
