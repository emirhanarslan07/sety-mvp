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
    Check,
    Loader2
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

const LeadMagnetBlock = ({ product, theme_id, brand_color, buttonRadius, cardRadius, profile }: any) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const isDarkTheme = ['premium', 'midnight-neon', 'luxury-gold', 'cyber-future'].includes(theme_id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
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
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const IconComponent = iconMap[product.icon_id as string] || getFallbackIcon(product.type);

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className={cn(
                "p-8 border shadow-sm flex flex-col gap-6 transition-all",
                theme_id === 'neo-brutalist' ? "rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white text-slate-900" : cardRadius,
                isDarkTheme
                    ? "bg-white/5 border-white/10 text-white" 
                : theme_id === 'arctic-glass'
                    ? "bg-white/40 border-white/40 backdrop-blur-lg text-slate-900"
                : theme_id === 'dreamy-mesh'
                    ? "bg-white/50 border-white/40 backdrop-blur-md text-slate-900"
                : theme_id === 'soft-clay'
                    ? "bg-[#F0F2F5] border-transparent shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] text-slate-900"
                : "bg-white border-white/60 text-slate-900"
            )}
        >
            <div className="flex items-start gap-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center relative">
                    {product.image_url ? (
                        <Image src={product.image_url} fill className="object-cover" alt="" />
                    ) : (
                        <IconComponent className="w-8 h-8" style={{ color: brand_color }} />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className={cn(
                        "text-[18px] font-black leading-tight mb-2",
                        isDarkTheme ? "text-white" : "text-slate-900"
                    )}>{product.title}</h3>
                    {product.subtitle && (
                        <p className={cn(
                            "text-[14px] font-medium leading-relaxed",
                            isDarkTheme ? "text-white/60" : "text-slate-400"
                        )}>{product.subtitle}</p>
                    )}
                </div>
            </div>

            {success ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-xl font-bold">
                    <Check className="w-5 h-5" />
                    <span className="text-[13px]">E-postanıza gönderildi! Lütfen gelen kutunuzu kontrol edin.</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-posta adresiniz"
                        className={cn(
                            "w-full h-14 px-6 outline-none border transition-all font-bold text-sm",
                            theme_id === 'neo-brutalist' ? "rounded-lg border-2 border-black text-black placeholder:text-slate-400 bg-white" : buttonRadius,
                            isDarkTheme
                                ? "bg-white/5 border-white/10 text-white placeholder:text-slate-650 focus:bg-white/10 focus:border-white/20"
                                : "bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary/20"
                        )}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full h-14 text-white font-black text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2",
                            theme_id === 'neo-brutalist' ? "rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black" : buttonRadius
                        )}
                        style={{ 
                            backgroundColor: brand_color, 
                            boxShadow: theme_id !== 'neo-brutalist' ? `0 10px 30px -5px ${brand_color}33` : undefined,
                            color: ['midnight-neon', 'luxury-gold', 'cyber-future', 'neo-brutalist'].includes(theme_id) && 
                                   (['#c4ff00', '#ffffff', '#facb15', '#fbbf24', '#06b6d4'].includes(brand_color.toLowerCase())) 
                                   ? '#000' : '#fff'
                        }}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (product.button_text || 'İNDİR')}
                    </button>
                </form>
            )}
        </motion.div>
    );
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
                    .order('sort_order', { ascending: true })
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
            metadata: { visitor_id: localStorage.getItem('s_vid') }
        }]);
    };

    const handlePurchase = async (product: any, email?: string) => {
        // Also count as click just in case
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
                visitor_id: localStorage.getItem('s_vid') 
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

        // If it's manual, we don't open a link, the details are shown in the bottom sheet success state
        if (product.external_checkout_url && product.checkout_provider !== 'manual') {
            let url = product.external_checkout_url;
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
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
        'Inter': 'font-inter',
        'Plus Jakarta': 'font-plus_jakarta',
        'Outfit': 'font-outfit',
        'Space Mono': 'font-space_mono',
        'Playfair': 'font-playfair',
        'Montserrat': 'font-montserrat',
        'Poppins': 'font-poppins',
        'Lexend': 'font-lexend',
    } as Record<string, string>)[font_family] || 'font-sans';

    const buttonRadius = ({
        'rounded': 'rounded-full',
        'semi': 'rounded-xl',
        'sharp': 'rounded-none'
    } as Record<string, string>)[button_style] || 'rounded-full';

    const cardRadius = ({
        'rounded': 'rounded-[24px]',
        'semi': 'rounded-2xl',
        'sharp': 'rounded-none'
    } as Record<string, string>)[button_style] || 'rounded-[24px]';

    const isDarkTheme = ['premium', 'midnight-neon', 'luxury-gold', 'cyber-future'].includes(theme_id);

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
            "min-h-screen text-slate-900 relative overflow-hidden",
            fontStyles,
            theme_id === 'luxury-gold' && 'font-playfair',
            isDarkTheme ? "bg-[#0A0B10] text-white" :
            theme_id === 'arctic-glass' ? "bg-[#F4F7FF]" :
            theme_id === 'sunset-pastel' ? "bg-gradient-to-br from-[#FF3B8E] via-[#FF5DA2] to-[#FF9DC2]" :
            theme_id === 'dreamy-mesh' ? "bg-[#f8f7ff]" :
            theme_id === 'soft-clay' ? "bg-[#F0F2F5]" :
            theme_id === 'neo-brutalist' ? "bg-[#FACC15]" :
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

            {/* Theme Background Effects */}
            {theme_id === 'arctic-glass' && (
                <>
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-300/20 blur-[100px] pointer-events-none" />
                </>
            )}
            {theme_id === 'midnight-neon' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#C4FF00]/5 blur-[150px] pointer-events-none" />
            )}
            {theme_id === 'dreamy-mesh' && (
                <>
                    <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-purple-300/20 blur-[100px] pointer-events-none" />
                    <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full bg-blue-300/15 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[10%] left-[30%] w-[250px] h-[250px] rounded-full bg-pink-300/15 blur-[80px] pointer-events-none" />
                </>
            )}
            {theme_id === 'cyber-future' && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
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
                            "w-44 h-44 overflow-hidden shadow-2xl border-4 bg-white shrink-0 relative z-10",
                            theme_id === 'neo-brutalist' ? "rounded-2xl border-black border-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "rounded-full",
                            isDarkTheme ? "border-white/10" :
                            theme_id === 'arctic-glass' ? "border-white/60" :
                            theme_id === 'sunset-pastel' ? "border-white/80" :
                            theme_id === 'soft-clay' ? "border-[#F0F2F5] shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]" :
                            "border-white"
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
                                isDarkTheme ? "text-white" :
                                theme_id === 'sunset-pastel' ? "text-white" :
                                theme_id === 'luxury-gold' ? "font-serif" :
                                "text-slate-900"
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
                                isDarkTheme ? "text-slate-400" :
                                theme_id === 'sunset-pastel' ? "text-white/80" :
                                "text-slate-500"
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
                                            isDarkTheme ? "text-slate-500 hover:text-white" :
                                            theme_id === 'sunset-pastel' ? "text-white/70 hover:text-white" :
                                            "text-slate-400 hover:text-slate-900"
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
                                        const isEmail = product.type === 'collect_emails' || product.type === 'lead_magnet';

                                        if (isEmail) {
                                            return (
                                                <LeadMagnetBlock 
                                                    key={product.id}
                                                    product={product}
                                                    theme_id={theme_id}
                                                    brand_color={brand_color}
                                                    buttonRadius={buttonRadius}
                                                    cardRadius={cardRadius}
                                                    profile={profile}
                                                />
                                            );
                                        }

                                        return (
                                            <motion.div
                                                key={product.id}
                                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                onClick={() => handleProductClick(product)}
                                                className={cn(
                                                    "group p-4 border cursor-pointer flex items-center gap-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 shadow-sm",
                                                    theme_id === 'neo-brutalist' ? "rounded-xl" : cardRadius,
                                                    isDarkTheme
                                                        ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                                    : theme_id === 'arctic-glass'
                                                        ? "bg-white/40 border-white/40 backdrop-blur-lg hover:bg-white/60"
                                                    : theme_id === 'sunset-pastel'
                                                        ? "bg-white border-transparent shadow-md hover:shadow-lg"
                                                    : theme_id === 'dreamy-mesh'
                                                        ? "bg-white/50 border-white/40 backdrop-blur-md hover:bg-white/70"
                                                    : theme_id === 'soft-clay'
                                                        ? "bg-[#F0F2F5] border-transparent shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]"
                                                    : theme_id === 'neo-brutalist'
                                                        ? "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                                                    : "bg-white border-white/60 hover:shadow-xl hover:shadow-slate-200/50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-16 h-16 bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center relative",
                                                    theme_id === 'neo-brutalist' ? "rounded-lg border-2 border-black" : "rounded-2xl border border-slate-100"
                                                )}>
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
                                                    <div className="min-w-0">
                                                        <h3 className={cn(
                                                            "text-[16px] font-black tracking-tight leading-tight mb-1 truncate",
                                                            isDarkTheme ? "text-white" : "text-slate-900"
                                                        )}>
                                                            {product.title}
                                                        </h3>
                                                        {product.subtitle && (
                                                            <p className={cn(
                                                                "text-[12px] font-medium truncate max-w-[140px] md:max-w-xs",
                                                                isDarkTheme ? "text-white/40" : "text-slate-400"
                                                            )}>{product.subtitle}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div
                                                            className={cn(
                                                                "h-10 px-5 flex items-center justify-center font-black text-xs transition-all shadow-sm group-hover:scale-[1.02]",
                                                                theme_id === 'neo-brutalist' ? "rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black" : buttonRadius
                                                            )}
                                                            style={{
                                                                backgroundColor: brand_color,
                                                                color: ['midnight-neon', 'luxury-gold', 'cyber-future', 'neo-brutalist'].includes(theme_id) && 
                                                                       (['#c4ff00', '#ffffff', '#facb15', '#fbbf24', '#06b6d4', '#000000', '#000'].includes(brand_color.toLowerCase())) 
                                                                       ? '#000' : '#fff'
                                                            }}
                                                        >
                                                            {product.price === 0 ? (t('public.free') || 'FREE') : formatCurrency(product.price, product.currency || 'USD')}
                                                        </div>
                                                        <ChevronRight className={cn(
                                                            "w-4 h-4 transition-all opacity-20 group-hover:opacity-60",
                                                            isDarkTheme ? "text-white" : "text-slate-900"
                                                        )} />
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
                                    isDarkTheme ? "bg-white/5 text-white/30 hover:text-white/60" :
                                    theme_id === 'sunset-pastel' ? "bg-white/20 text-white/60 hover:text-white/80" :
                                    theme_id === 'neo-brutalist' ? "bg-black text-white hover:bg-gray-800" :
                                    "bg-slate-100 text-slate-400 hover:bg-slate-200"
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
                        isDarkTheme ? "bg-slate-900 border-slate-800" :
                        theme_id === 'neo-brutalist' ? "bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl" :
                        "bg-white border-slate-100"
                    )}>
                        <div className="p-1 bg-primary/10 rounded-full">
                            <SetyLogo size="sm" />
                        </div>
                        <span className={cn(
                            "text-[15px] font-black tracking-tight",
                            isDarkTheme ? "text-white" : "text-slate-900"
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
