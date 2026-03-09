import { Mail, Download, Clock, Sparkles, Link2, Play, CreditCard, Video, Users2, Trophy, ChevronRight } from 'lucide-react';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import Image from 'next/image';

interface LiveCardPreviewProps {
    data: {
        title: string;
        subtitle?: string;
        price: number;
        currency: string;
        thumbnail_style: string;
        button_text: string;
        image_url?: string;
        image_zoom?: number;
        type: string;
        checkout_provider?: string;
    };
    icon?: any;
}

const providerNames: any = {
    'stripe': 'Stripe',
    'iyzico': 'iyzico',
    'shopier': 'Shopier',
    'paddle': 'Paddle',
    'external': 'Harici'
};

const icons: any = {
    'collect_emails': Mail,
    'digital_product': Download,
    'coaching_call': Clock,
    'custom_product': Sparkles,
    'external_links': Link2,
    'ecourse': Play,
    'recurring_membership': CreditCard,
    'webinar': Video,
    'community': Users2,
    'sety_affiliate': Trophy
};

const iconPaths: any = {
    'collect_emails': 'https://cdn-icons-png.flaticon.com/512/9431/9431186.png',
    'digital_product': 'https://cdn-icons-png.flaticon.com/512/9440/9440386.png',
    'coaching_call': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    'custom_product': 'https://cdn-icons-png.flaticon.com/512/9431/9431171.png',
    'external_links': 'https://cdn-icons-png.flaticon.com/512/10061/10061730.png',
    'ecourse': 'https://cdn-icons-png.flaticon.com/512/9431/9431221.png',
    'recurring_membership': 'https://cdn-icons-png.flaticon.com/512/9431/9431181.png',
    'webinar': 'https://cdn-icons-png.flaticon.com/512/9431/9431156.png',
    'community': 'https://cdn-icons-png.flaticon.com/512/9431/9431166.png',
    'sety_affiliate': 'sety_logo'
};

export default function LiveCardPreview({ data, icon: OverrideIcon }: LiveCardPreviewProps) {
    const Icon = OverrideIcon || icons[data.type] || Download;
    const iconUrl = iconPaths[data.type];
    const isCallout = data.thumbnail_style === 'callout';
    const isButton = data.thumbnail_style === 'button';
    const isPreview = data.thumbnail_style === 'preview';

    const getButtonText = () => {
        if (data.checkout_provider && data.checkout_provider !== 'manual' && data.checkout_provider !== 'none') {
            const name = providerNames[data.checkout_provider] || data.checkout_provider;
            return `${name} ile Güvenli Ödeme`;
        }
        return data.button_text || 'Hemen Al';
    };

    const displayButtonText = getButtonText();

    return (
        <div className="w-full max-w-[400px] mx-auto perspective-1000">
            <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100 transition-all duration-500 hover:translate-y-[-4px]">

                {/* Callout Style (Prominent) */}
                {isCallout && (
                    <div className="p-4 flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100/50 shadow-sm transition-all">
                            {data.image_url ? (
                                <div className="relative w-full h-full overflow-hidden">
                                    <Image
                                        src={data.image_url}
                                        alt=""
                                        fill
                                        className="object-cover transition-transform duration-300"
                                        style={{ transform: `scale(${data.image_zoom || 1})` }}
                                        sizes="64px"
                                    />
                                </div>
                            ) : data.type === 'sety_affiliate' ? (
                                <SetyLogo size="sm" showBackground={false} />
                            ) : iconUrl ? (
                                <div className="relative w-10 h-10">
                                    <Image src={iconUrl} alt="" fill className="object-contain" sizes="40px" />
                                </div>
                            ) : (
                                <Icon className="w-8 h-8 text-[#5500ff]" strokeWidth={1.5} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-[16px] font-black text-slate-900 tracking-tight leading-tight">
                                    {data.title || 'Ürün Başlığı'}
                                </h4>
                                <span className="text-[16px] font-bold text-[#5500ff]">
                                    {data.price === 0 ? 'ÜCRETSİZ' : formatCurrency(data.price, data.currency)}
                                </span>
                            </div>
                            {data.subtitle && (
                                <p className="text-[12px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                                    {data.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Button Style (Simple) */}
                {isButton && (
                    <div className="p-4 flex items-center justify-between gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center border border-slate-100 overflow-hidden transition-all">
                            {data.image_url ? (
                                <img
                                    src={data.image_url}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-300"
                                    style={{ transform: `scale(${data.image_zoom || 1})` }}
                                />
                            ) : data.type === 'sety_affiliate' ? (
                                <SetyLogo size="sm" showBackground={false} />
                            ) : iconUrl ? (
                                <img src={iconUrl} alt="" className="w-8 h-8 object-contain" />
                            ) : (
                                <Icon className="w-6 h-6 text-[#5500ff]" strokeWidth={1.5} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[15px] font-bold text-slate-900">{data.title || 'Ürün Başlığı'}</h4>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                )}

                {/* Preview Style (Media Focus) */}
                {isPreview && (
                    <div>
                        <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                            {data.image_url ? (
                                <Image
                                    src={data.image_url}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-300"
                                    style={{ transform: `scale(${data.image_zoom || 1})` }}
                                    sizes="(max-width: 400px) 100vw, 400px"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon className="w-12 h-12 text-slate-300" strokeWidth={1} />
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <h4 className="text-[18px] font-bold text-slate-900">{data.title || 'Ürün Başlığı'}</h4>
                            <p className="text-[14px] text-slate-500 font-medium mt-1 leading-relaxed">
                                {data.subtitle || 'Ürününüzün detaylı açıklaması.'}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[16px] font-black text-slate-900">
                                    {data.price === 0 ? 'ÜCRETSİZ' : formatCurrency(data.price, data.currency)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button (Stripe/Stan Style) */}
                {(isCallout || isPreview) && (
                    <div className="px-5 pb-5 pt-0">
                        <button className="w-full h-14 rounded-[18px] bg-[#00CE69] hover:bg-[#00B85E] text-white font-black text-[16px] transition-all active:scale-[0.98] shadow-[0_8px_20px_-4px_rgba(0,206,105,0.4)] border-none">
                            {displayButtonText}
                        </button>
                    </div>
                )}

                {isButton && (
                    <div className="px-4 pb-4">
                        <div className="bg-slate-50 rounded-xl p-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {data.price === 0 ? 'Ücretsiz' : formatCurrency(data.price, data.currency)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
