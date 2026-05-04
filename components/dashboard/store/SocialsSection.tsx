import React from 'react';
import { Instagram, Youtube, Twitter, Video } from 'lucide-react';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/context';

interface SocialsSectionProps {
    socialLinks: {
        instagram: string;
        twitter: string;
        youtube: string;
        tiktok: string;
    };
    setSocialLinks: (links: any) => void;
}

export default function SocialsSection({
    socialLinks,
    setSocialLinks,
}: SocialsSectionProps) {
    const { t } = useTranslation();

    const socialInputs = [
        { id: 'instagram', labelKey: 'dashboard.store.sections.instagram', icon: Instagram, placeholder: 'instagram.com/@username', color: 'text-pink-600' },
        { id: 'twitter', labelKey: 'dashboard.store.sections.twitter', icon: Twitter, placeholder: 'x.com/@username', color: 'text-slate-900' },
        { id: 'youtube', labelKey: 'dashboard.store.sections.youtube', icon: Youtube, placeholder: 'youtube.com/@username', color: 'text-red-500' },
        { id: 'tiktok', labelKey: 'dashboard.store.sections.tiktok', icon: Video, placeholder: 'tiktok.com/@username', color: 'text-black' },
    ];

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {/* Section Info */}
            <div className="space-y-2 px-1">
                <h3 className="text-[20px] font-black text-slate-900 tracking-tight">
                    {t('dashboard.store.sections.social_media')}
                </h3>
                <p className="text-[14px] font-bold text-slate-400">
                    {t('dashboard.store.sections.social_media_desc')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-8">
                {socialInputs.map((social) => (
                    <div key={social.id} className="space-y-6">
                        <label className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] px-1 opacity-60">
                            {t(social.labelKey)}
                        </label>
                        <PremiumInput
                            icon={<social.icon size={22} className={social.color} />}
                            placeholder={social.placeholder}
                            value={(socialLinks as any)[social.id]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocialLinks({ ...socialLinks, [social.id]: e.target.value })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
