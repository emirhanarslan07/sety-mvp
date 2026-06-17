'use client';

import {
    Zap,
    Instagram,
    Youtube,
    Video as VideoIcon,
    ChevronRight,
    Sparkles,
    Download,
    Mail,
    Heart,
    Gift,
    Book,
    Music,
    Clock,
    Link2,
    Play,
    Trophy,
    Video,
    Users2,
    MessageSquare,
    ShieldCheck,
    Package,
    Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { THEME_TEMPLATES } from '@/components/dashboard/store/ThemeCarousel';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils/format';
import { useTranslation } from '@/lib/i18n/context';

export const getProductTypes = (t: (key: string) => string) => [
    {
        id: 'digital_product',
        title: t('dashboard.store.product_types.digital_product.title'),
        description: t('dashboard.store.product_types.digital_product.desc'),
        icon: Package,
        color: 'bg-blue-50 text-blue-600',
        comingSoon: false,
    },
    {
        id: 'coaching_call',
        title: t('dashboard.store.product_types.coaching_call.title'),
        description: t('dashboard.store.product_types.coaching_call.desc'),
        icon: Target,
        color: 'bg-emerald-50 text-emerald-600',
        comingSoon: false,
    },
    {
        id: 'external_link',
        title: t('dashboard.store.product_types.external_link.title'),
        description: t('dashboard.store.product_types.external_link.desc'),
        icon: Link2,
        color: 'bg-violet-50 text-[#5500ff]',
        comingSoon: false,
    },
];

export default function StorePreview({
    profile,
    products,
    designProps
}: {
    profile: any;
    products: any[];
    designProps: {
        theme: string;
        logo?: string | null;
        socialLinks?: {
            instagram?: string;
            twitter?: string;
            youtube?: string;
            tiktok?: string;
        };
        displayName?: string;
        bio?: string;
        isVerified?: boolean;
        coverImage?: string | null;
        announcement?: string;
        showAffiliateBadge?: boolean;
    }
}) {
    const { t } = useTranslation();
    const { theme, logo, socialLinks, displayName, bio, isVerified, coverImage, showAffiliateBadge } = designProps;
    const activeThemeData = THEME_TEMPLATES.find(t => t.id === theme) || THEME_TEMPLATES[0];
    const color = activeThemeData.color;
    const font = activeThemeData.font;
    const buttonStyle = activeThemeData.buttonStyle;

    const allProductTypes = getProductTypes((key) => t(key));

    const fontStyles = {
        'Inter': 'font-inter',
        'Plus Jakarta': 'font-plus_jakarta',
        'Outfit': 'font-outfit',
        'Lexend': 'font-lexend',
        'Poppins': 'font-poppins',
        'Space Mono': 'font-space_mono',
        'Playfair': 'font-playfair',
        'Montserrat': 'font-montserrat',
        'Inter Tight': 'font-inter_tight',
    }[font] || 'font-sans';

    const buttonRadius = {
        'rounded': 'rounded-full',
        'semi': 'rounded-2xl',
        'sharp': 'rounded-[5px]'
    }[buttonStyle] || 'rounded-full';

    const cardRadius = {
        'rounded': 'rounded-[32px]',
        'semi': 'rounded-2xl',
        'sharp': 'rounded-[5px]'
    }[buttonStyle] || 'rounded-[24px]';

    const isDarkTheme = ['premium', 'midnight-neon', 'luxury-gold', 'cyber-future', 'deep-midnight'].includes(theme);

    return (
        <div className="relative w-[300px] mx-auto transition-transform duration-700 hover:scale-[1.02]">
            {/* iPhone 17 Pro Mockup Frame */}
            <div
                className="relative z-20 w-[300px] h-[640px] rounded-[3.2rem] bg-[#111111] border-[1.5px] border-white/5 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)]"
            >
                {/* Inner Screen - Perfectly Centered */}
                <div
                    className={cn(
                        "absolute inset-[7px] rounded-[2.6rem] overflow-hidden flex flex-col shadow-inner border border-black/5 transition-all",
                        isDarkTheme ? "bg-[#0A0C14]" :
                            theme === 'arctic-glass' ? "bg-gradient-to-br from-blue-50 via-white to-purple-50" :
                                theme === 'sunset-pastel' ? "bg-gradient-to-br from-orange-50 via-pink-50 to-white" :
                                    theme === 'dreamy-mesh' ? "bg-[#f8f7ff]" :
                                        theme === 'soft-clay' ? "bg-[#F0F2F5]" :
                                            theme === 'neo-brutalist' ? "bg-[#FACC15]" :
                                                theme === 'vibrant' ? "bg-[#FFF5F9]" : "bg-white"
                    )}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-[16px] inset-x-0 flex justify-center z-50 pointer-events-none">
                        <div style={{ width: '84px', height: '28px', background: 'black', borderRadius: '14px' }} />
                    </div>

                    {/* Hide Scrollbars Global Style for Mockup */}
                    <style>{`
                        .mockup-preview-container::-webkit-scrollbar {
                            display: none;
                        }
                        .mockup-preview-container {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>

                    {/* Inner Screen Content */}
                    <div className="flex-1 overflow-y-auto mockup-preview-container flex flex-col items-center pb-24">
                        {/* Background Effects */}
                        {theme === 'arctic-glass' && (
                            <div className="absolute inset-0 z-0">
                                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 blur-[80px] rounded-full animate-pulse" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                            </div>
                        )}

                        {theme === 'midnight-neon' && (
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(85,0,255,0.05),transparent_70%)]" />
                            </div>
                        )}

                        {theme === 'cyber-future' && (
                            <div className="absolute inset-0 z-0 opacity-20">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>
                        )}

                        {theme === 'dreamy-mesh' && (
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-purple-200/40 blur-[100px] rounded-full animate-pulse" />
                                <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-200/40 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-pink-100/30 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                            </div>
                        )}

                        {/* Cover Image */}
                        {coverImage && (
                            <div className="absolute top-0 inset-x-0 h-40 z-0">
                                <Image
                                    src={coverImage}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="320px"
                                />
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-b",
                                    isDarkTheme ? "from-black/40 via-transparent to-[#0A0C14]" : "from-black/20 via-transparent to-white"
                                )} />
                            </div>
                        )}

                        <div className={cn(
                            "flex flex-col items-center px-4 pt-16 pb-8 space-y-6 w-full relative z-10",
                            fontStyles,
                            theme === 'luxury-gold' && 'font-playfair'
                        )}>
                            {/* Profile Section */}
                            <div className="flex flex-col items-center text-center w-full px-4 relative">
                                {/* Avatar */}
                                <div
                                    className={cn(
                                        "flex-shrink-0 border-[6px] shadow-2xl flex items-center justify-center overflow-hidden mb-6 transition-all",
                                        theme === 'neo-brutalist' ? "rounded-2xl border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" :
                                            theme === 'soft-clay' ? "rounded-[40px] border-white shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]" : "rounded-full",
                                        theme === 'arctic-glass' || theme === 'dreamy-mesh' ? "border-white/50 backdrop-blur-md" :
                                            theme === 'midnight-neon' ? "border-[#C4FF00]/20 shadow-[#C4FF00]/10" :
                                                theme === 'luxury-gold' ? "border-amber-400/20 shadow-amber-900/10" :
                                                    theme === 'cyber-future' ? "border-cyan-500/30 shadow-cyan-900/10" :
                                                        theme === 'minimal' || theme === 'premium' || theme === 'deep-midnight' ? "border-white/20" : "border-white"
                                    )}
                                    style={{ width: '112px', minWidth: '112px', height: '112px', minHeight: '112px' }}
                                >
                                    {logo || profile?.profile_image_url ? (
                                        <Image
                                            src={logo || profile?.profile_image_url}
                                            alt=""
                                            fill
                                            className="object-cover object-center"
                                            sizes="112px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <SetyLogo size="md" />
                                        </div>
                                    )}
                                </div>

                                {/* Username & Bio */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <h2 className={cn(
                                            "text-2xl font-black tracking-tight transition-all",
                                            isDarkTheme ? "text-white" : "text-slate-900"
                                        )}>
                                            {displayName || t('dashboard.store.preview.brand_name_placeholder')}
                                        </h2>
                                        {isVerified && (
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-[15px] font-semibold leading-relaxed px-4 transition-all",
                                        isDarkTheme ? "text-white/60" : "text-slate-500"
                                    )}>
                                        {bio || t('dashboard.store.preview.bio_placeholder')}
                                    </p>
                                </div>

                                {/* Social Links */}
                                {socialLinks && (
                                    <div className="flex items-center justify-center gap-3 mt-8">
                                        {[
                                            { id: 'instagram', icon: Instagram, url: socialLinks.instagram },
                                            { id: 'twitter', icon: Zap, url: socialLinks.twitter }, // Keeping Zap for X as common pattern in this project if no X icon
                                            { id: 'youtube', icon: Youtube, url: socialLinks.youtube },
                                            { id: 'tiktok', icon: VideoIcon, url: socialLinks.tiktok }
                                        ].filter(s => s.url).map((social) => (
                                            <a
                                                key={social.id}
                                                href="#"
                                                className={cn(
                                                    "w-11 h-11 flex items-center justify-center transition-all",
                                                    theme === 'neo-brutalist' ? "rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" :
                                                        theme === 'soft-clay' ? "rounded-2xl bg-[#F0F2F5] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]" :
                                                            "rounded-2xl",
                                                    theme === 'arctic-glass' || theme === 'dreamy-mesh' ? "bg-white/20 backdrop-blur-md border border-white/20" :
                                                        theme === 'minimal' || theme === 'premium' || theme === 'vibrant' ? "bg-slate-50" : "bg-white/5 border border-white/10"
                                                )}
                                            >
                                                <social.icon className={cn(
                                                    "w-5 h-5",
                                                    isDarkTheme ? "text-white" : "text-slate-900"
                                                )} />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Products Container */}
                            <div className="w-full space-y-4 relative z-10 px-4">
                                {/* Product List */}
                                {products.map((item) => {
                                    const typeInfo = allProductTypes.find(t => t.id === item.type) || allProductTypes[1];
                                    return (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "w-full p-3 border flex items-center gap-3 active:scale-[0.98] transition-all group/card",
                                                cardRadius,
                                                theme === 'arctic-glass' ? "bg-white/30 border-white/30 backdrop-blur-lg" :
                                                    theme === 'midnight-neon' ? "bg-white/5 border-white/5" :
                                                        theme === 'sunset-pastel' ? "bg-white/60 border-transparent shadow-sm" :
                                                            theme === 'dreamy-mesh' ? "bg-white/40 border-white/40 backdrop-blur-md" :
                                                                theme === 'soft-clay' ? "bg-[#F0F2F5] border-transparent shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff]" :
                                                                    theme === 'neo-brutalist' ? "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" :
                                                                        theme === 'luxury-gold' ? "bg-white/5 border-white/5" :
                                                                            theme === 'cyber-future' ? "bg-white/5 border-white/5" :
                                                                            theme === 'deep-midnight' ? "bg-white/5 border-white/10" : "bg-white border-slate-100"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 bg-slate-50 flex-shrink-0 overflow-hidden flex items-center justify-center transition-all relative",
                                                theme === 'neo-brutalist' ? "rounded-lg border-2 border-black" :
                                                    theme === 'soft-clay' ? "rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]" : "rounded-[14px] border border-slate-50"
                                            )}>
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (typeInfo as any).iconUrl ? (
                                                    <Image
                                                        src={(typeInfo as any).iconUrl as string}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className={cn(
                                                        "w-full h-full flex items-center justify-center relative",
                                                        typeInfo.color,
                                                    )}>
                                                        {/* The "White Line" on top detayı */}
                                                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40 z-20" />
                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                                                        {item.icon_id ? (() => {
                                                            const iconMap: Record<string, any> = {
                                                                mail: Mail,
                                                                download: Download,
                                                                video: VideoIcon,
                                                                sparkles: Sparkles,
                                                                heart: Heart,
                                                                gift: Gift,
                                                                book: Book,
                                                                music: Music
                                                            };
                                                            const IconComponent = iconMap[item.icon_id as string] || typeInfo.icon;
                                                            return <IconComponent className="w-5 h-5 relative z-10 text-white" strokeWidth={2.5} />;
                                                        })() : (
                                                            <typeInfo.icon className="w-5 h-5 relative z-10 text-white" strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className={cn(
                                                    "text-[14px] font-[1000] tracking-tight leading-tight truncate transition-all",
                                                    isDarkTheme ? "text-white" : "text-slate-900"
                                                )}>{item.title}</h4>
                                                <p className={cn(
                                                    "text-[11px] font-bold mt-0.5 transition-all opacity-80",
                                                    isDarkTheme ? "text-white/40" : "text-slate-400"
                                                )}>{item.subtitle || (t(`dashboard.store.product_types.${typeInfo.id}.desc`) || typeInfo.description).slice(0, 30) + '...'}</p>
                                            </div>

                                            <div
                                                className={cn(
                                                    "h-9 px-4 flex items-center justify-center font-black text-[11px] transition-all",
                                                    buttonRadius,
                                                    theme === 'neo-brutalist' ? "border-2 border-black" : ""
                                                )}
                                                style={{
                                                    backgroundColor: color,
                                                    color: (isDarkTheme || theme === 'neo-brutalist') && (color === '#C4FF00' || color === '#ffffff' || color === '#FACC15' || color === '#FBBF24' || color === '#06B6D4') ? '#000' : '#fff'
                                                }}
                                            >
                                                {item.price === 0 || !item.price ? t('dashboard.store.preview.free_button') : formatCurrency(item.price, item.currency || 'TRY')}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Affiliate Badge */}
                            {showAffiliateBadge && (
                                <div className="w-full px-4 pt-2 pb-6 relative z-20">
                                    <div className={cn(
                                        "w-full p-4 rounded-3xl flex items-center gap-4 border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                                        theme === 'arctic-glass' ? "bg-white/40 border-white/40 backdrop-blur-xl shadow-lg" :
                                            theme === 'midnight-neon' ? "bg-white/5 border-[#C4FF00]/20 backdrop-blur-md" :
                                                theme === 'luxury-gold' ? "bg-white/5 border-amber-400/20 backdrop-blur-md" :
                                                    theme === 'cyber-future' ? "bg-white/5 border-cyan-400/20 backdrop-blur-md" :
                                                        theme === 'deep-midnight' ? "bg-white/5 border-white/10 backdrop-blur-md" :
                                                            "bg-white border-slate-100 shadow-xl shadow-slate-200/50"
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                                            theme === 'midnight-neon' ? "bg-[#C4FF00]/10" :
                                                theme === 'luxury-gold' ? "bg-amber-400/10" :
                                                    theme === 'cyber-future' ? "bg-cyan-400/10" : "bg-indigo-50"
                                        )}>
                                            <SetyLogo size="sm" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={cn(
                                                "text-[13px] font-black tracking-tight leading-tight transition-all",
                                                isDarkTheme ? "text-white" : "text-slate-900"
                                            )}>{t('dashboard.store.preview.affiliate_badge_text')}</h4>
                                        </div>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 transition-all",
                                            isDarkTheme ? "text-white/40" : "text-slate-300"
                                        )} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-100/30 rounded-full z-50" />
                </div>

                {/* iPhone Shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/10 blur-2xl rounded-full" />
            </div>
        </div>
    );
}
