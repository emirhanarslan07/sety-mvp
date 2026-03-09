'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SetyLogo } from '@/components/ui/SetyLogo';
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
    zap: Zap,
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

    useEffect(() => {
        // If we don't have initial data, fetch it (fallback)
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
                    .select('full_name, profile_image_url, is_verified')
                    .eq('user_id', storeData.user_id)
                    .single();

                setProfile({
                    ...storeData,
                    full_name: profileData?.full_name,
                    profile_image_url: profileData?.profile_image_url || storeData.store_logo_url,
                    is_verified: profileData?.is_verified,
                });

                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('store_id', storeData.id)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                setProducts(productsData || []);
                setLoading(false);
            };
            fetchStore();
        }
    }, [params.username, initialProfile]);

    // Track initial page view on client-side
    useEffect(() => {
        if (profile) {
            supabase.from('analytics_events').insert([{
                user_id: profile.user_id,
                store_id: profile.id,
                event_name: 'store_view',
                visitor_id: localStorage.getItem('s_vid') || (() => {
                    const id = Math.random().toString(36).substring(2);
                    localStorage.setItem('s_vid', id);
                    return id;
                })(),
                metadata: {
                    referrer: document.referrer || 'direct'
                }
            }]).then(() => { });
        }
    }, [profile?.id]);

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        setIsSheetOpen(true);
        supabase.from('analytics_events').insert([{
            user_id: profile?.user_id,
            store_id: profile?.id,
            event_name: 'product_view',
            product_id: product.id,
            visitor_id: localStorage.getItem('s_vid'),
        }]);
    };

    const handlePurchase = async (product: any, email?: string) => {
        await supabase.from('analytics_events').insert([{
            user_id: profile?.user_id,
            store_id: profile?.id,
            event_name: 'purchase_captured',
            product_id: product.id,
            visitor_id: localStorage.getItem('s_vid'),
            metadata: { email }
        }]);

        if (product.redirect_url) {
            window.location.href = product.redirect_url;
            return;
        }
        if (product.digital_file_url || product.file_url) {
            const url = product.digital_file_url || product.file_url;
            window.open(url, '_blank');
            return;
        }

        if (product.external_checkout_url) {
            window.open(product.external_checkout_url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex">
                <div className="w-full md:w-2/5 flex flex-col items-center justify-center py-20 gap-6">
                    <div className="w-48 h-48 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-7 w-40 rounded-xl bg-slate-200 animate-pulse" />
                </div>
                <div className="flex-1 py-16 px-10 grid grid-cols-2 gap-4 items-start">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-3">Mağaza Bulunamadı</h1>
                <p className="text-slate-500 mb-8">Aradığınız kullanıcıya ait bir mağaza bulunamadı.</p>
                <Button onClick={() => router.push('/')} className="bg-[#5500ff] rounded-2xl h-12 px-8 font-black text-white">
                    Ana Sayfaya Dön
                </Button>
            </div>
        );
    }

    const {
        theme_id = 'minimal',
        brand_color = '#5500ff',
        font_family = 'Inter',
        button_style = 'rounded',
        announcement_text,
        show_affiliate_badge = true,
        cover_image_url,
    } = profile || {};

    const fontStyles = ({
        'Inter': 'font-sans',
        'Plus Jakarta': 'font-sans',
        'Outfit': 'font-sans',
        'Playfair': 'font-serif',
    } as Record<string, string>)[font_family] || 'font-sans';

    const radiusMap = ({
        'rounded': 'rounded-full',
        'semi': 'rounded-xl',
        'sharp': 'rounded-none'
    } as Record<string, string>)[button_style] || 'rounded-2xl';

    const getSocialIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('instagram')) return Instagram;
        if (p.includes('youtube')) return Youtube;
        if (p.includes('twitter') || p.includes('x')) {
            const TwitterIcon = (props: any) => (
                <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            );
            return TwitterIcon;
        }
        if (p.includes('facebook')) return Facebook;
        if (p.includes('linkedin')) return Linkedin;
        if (p.includes('github')) return Github;
        if (p.includes('tiktok')) return Music2;
        if (p.includes('whatsapp')) return MessageCircle;
        if (p.includes('telegram')) return Send;
        return Globe;
    };

    return (
        <div className={cn(
            "min-h-screen text-slate-900",
            fontStyles,
            theme_id === 'premium' ? "bg-slate-950 text-white" :
                theme_id === 'modern' ? "bg-indigo-50/30" :
                    theme_id === 'vibrant' ? "bg-slate-50" : "bg-white"
        )}>
            {/* Announcement Bar */}
            {announcement_text && (
                <div
                    className="w-full py-2.5 px-4 text-[12px] font-black text-center sticky top-0 z-50 shadow-sm"
                    style={{ backgroundColor: brand_color, color: '#fff' }}
                >
                    {announcement_text}
                </div>
            )}

            {/* Banner */}
            {cover_image_url && (
                <div className="w-full h-48 md:h-64 overflow-hidden relative">
                    <Image
                        src={cover_image_url}
                        alt="Cover"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                </div>
            )}

            <div className={cn(
                "flex flex-col md:flex-row min-h-screen pb-16 relative",
                cover_image_url ? "-mt-16 md:-mt-24" : ""
            )}>

                {/* ═══ LEFT PANEL ═══ */}
                <div className="w-full md:w-[38%] lg:w-[35%] md:h-screen md:sticky md:top-0 flex flex-col items-center justify-center py-16 px-6 shrink-0 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-5 text-center"
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 bg-white shrink-0 relative z-10",
                            theme_id === 'premium' ? "border-slate-800" : "border-white"
                        )}>
                            {profile.profile_image_url ? (
                                <Image
                                    src={profile.profile_image_url}
                                    alt={profile.display_name || profile.full_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-6xl font-black uppercase">
                                    {(profile.display_name || profile.username)?.[0]}
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="flex items-center justify-center gap-2">
                            <h1 className={cn(
                                "text-[32px] font-black tracking-tight leading-tight",
                                theme_id === 'premium' ? "text-white" : "text-slate-900"
                            )}>
                                {profile.display_name || profile.full_name || `@${profile.username}`}
                            </h1>
                            {profile.is_verified && (
                                <div className="flex items-center justify-center p-1 bg-[#5500ff] rounded-full shadow-lg">
                                    <Zap className="w-3 h-3 text-[#C4FF00] fill-[#C4FF00]" />
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <p className={cn(
                                "text-[16px] font-medium leading-relaxed max-w-[280px]",
                                theme_id === 'premium' ? "text-slate-400" : "text-slate-500"
                            )}>
                                {profile.bio}
                            </p>
                        )}

                        {/* Social icons */}
                        <div className="flex items-center gap-6 pt-2">
                            {Object.entries(profile.social_links || {}).map(([platform, link]: any) => {
                                if (!link) return null;
                                const Icon = getSocialIcon(platform);
                                return (
                                    <a
                                        key={platform}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "transition-all hover:scale-110",
                                            theme_id === 'premium' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
                                        )}
                                    >
                                        <Icon className="w-[24px] h-[24px]" strokeWidth={2} />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* ═══ RIGHT PANEL ═══ */}
                <div className="flex-1 md:h-screen overflow-y-auto py-10 md:py-24 px-4 md:px-10 lg:px-20 scrollbar-hide">
                    <div className="max-w-[800px] mx-auto">
                        {products.length === 0 ? (
                            <div className="py-24 text-center text-slate-400 font-bold opacity-30">
                                <Box className="w-12 h-12 mx-auto mb-4" />
                                <p>Henüz ürün eklenmemiş.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                                    className="flex flex-col gap-4"
                                >
                                    {products.map((product) => {
                                        const IconComponent = iconMap[product.icon_id as string] || Box;
                                        const isEmail = product.type === 'collect_emails';

                                        if (isEmail) {
                                            return (
                                                <motion.div
                                                    key={product.id}
                                                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                                    className={cn(
                                                        "p-8 border shadow-sm flex flex-col gap-6 transition-all",
                                                        radiusMap,
                                                        theme_id === 'premium' ? "bg-white/5 border-white/10" : "bg-white border-white/60"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-5">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative">
                                                            {product.image_url ? (
                                                                <Image
                                                                    src={product.image_url}
                                                                    fill
                                                                    className="object-cover"
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <IconComponent className="w-8 h-8" style={{ color: brand_color }} />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-[18px] font-black leading-tight mb-2">
                                                                {product.title}
                                                            </h3>
                                                            {product.subtitle && (
                                                                <p className="text-[14px] opacity-60 font-medium leading-relaxed">
                                                                    {product.subtitle}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <input
                                                            type="email"
                                                            placeholder="E-posta adresiniz"
                                                            className={cn(
                                                                "w-full h-14 px-6 rounded-2xl outline-none border transition-all font-bold text-sm",
                                                                theme_id === 'premium'
                                                                    ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-white/20"
                                                                    : "bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-primary/20"
                                                            )}
                                                        />
                                                        <button
                                                            className="w-full h-14 rounded-2xl text-white font-black text-sm tracking-wider uppercase transition-all shadow-xl active:scale-[0.98]"
                                                            style={{ backgroundColor: brand_color, boxShadow: `0 10px 30px -5px ${brand_color}33` }}
                                                        >
                                                            KAYIT OL &amp; İNDİR
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        return (
                                            <motion.div
                                                key={product.id}
                                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                onClick={() => handleProductClick(product)}
                                                className={cn(
                                                    "group p-4 border cursor-pointer flex items-center gap-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 shadow-sm",
                                                    radiusMap,
                                                    theme_id === 'premium'
                                                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                                        : "bg-white border-white/60 hover:shadow-xl hover:shadow-slate-200/50"
                                                )}
                                            >
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 relative">
                                                    {product.image_url ? (
                                                        <Image
                                                            src={product.image_url}
                                                            fill
                                                            className="object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <IconComponent className="w-7 h-7 text-slate-400 group-hover:scale-110 transition-transform" />
                                                    )}
                                                </div>

                                                <div className="flex-1 flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-[16px] font-bold tracking-tight leading-tight mb-0.5">
                                                            {product.title}
                                                        </h3>
                                                        {product.subtitle && (
                                                            <p className="text-[12px] opacity-40 font-medium truncate max-w-[200px] md:max-w-xs">{product.subtitle}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[15px] font-black" style={{ color: brand_color }}>
                                                            {product.price === 0 ? 'FREE' : formatCurrency(product.price)}
                                                        </span>
                                                        <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-40" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        )}

                        <div className="mt-20 flex justify-center pb-32">
                            <Link
                                href="/privacy"
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[12px] font-bold transition-all",
                                    theme_id === 'premium' ? "bg-white/5 text-white/30 hover:text-white/60" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                )}
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ BRANDING BADGE ═══ */}
            {show_affiliate_badge && (
                <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <div className={cn(
                        "flex items-center gap-3 bg-white rounded-full p-2 pr-6 shadow-2xl border transition-all hover:scale-105 active:scale-95 group",
                        theme_id === 'premium' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                    )}>
                        <div className="p-1 bg-primary/10 rounded-full">
                            <SetyLogo size="sm" />
                        </div>
                        <span className={cn(
                            "text-[15px] font-black tracking-tight",
                            theme_id === 'premium' ? "text-white" : "text-slate-900"
                        )}>Sety</span>
                        <span className="text-slate-200 text-[14px]">·</span>
                        <button
                            onClick={() => window.open('https://sety.store', '_blank')}
                            className="text-[14px] font-extrabold text-[#5c4fff] hover:opacity-70 transition-opacity tracking-tight whitespace-nowrap"
                        >
                            30 Gün Ücretsiz Deneyin
                        </button>
                    </div>
                </div>
            )}

            <ProductBottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                product={selectedProduct}
                profile={profile}
                onPurchase={handlePurchase}
            />
            <StoryCardGenerator
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                product={selectedProduct}
                profile={profile}
            />
        </div>
    );
}
