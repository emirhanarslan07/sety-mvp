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
        { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/@username', color: 'text-pink-600' },
        { id: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: 'x.com/@username', color: 'text-slate-900' },
        { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/@username', color: 'text-red-500' },
        { id: 'tiktok', label: 'TikTok', icon: Video, placeholder: 'tiktok.com/@username', color: 'text-black' },
    ];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {socialInputs.map((social) => (
                    <div key={social.id} className="space-y-4">
                        <label className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-1 opacity-60">
                            {social.label}
                        </label>
                        <PremiumInput
                            icon={<social.icon size={20} />}
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
