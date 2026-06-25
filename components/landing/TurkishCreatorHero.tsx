'use client';

import * as React from 'react';
import {
    FloatingIconsHero,
    type FloatingIconsHeroProps,
} from '@/components/ui/floating-icons-hero-section';

const AbstractShape1 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="#5500ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <circle cx="12" cy="12" r="10" />
    </svg>
);

const AbstractShape2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="#5500ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
);

const AbstractShape3 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="#5500ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
);

const turkishCreatorIcons: FloatingIconsHeroProps['icons'] = [
    { id: 1, icon: AbstractShape1, className: 'md:top-[15%] md:left-[20%] top-[10%] left-[10%]' },
    { id: 2, icon: AbstractShape2, className: 'md:top-[20%] md:right-[20%] top-[15%] right-[10%] hidden md:block' },
    { id: 3, icon: AbstractShape3, className: 'md:top-[65%] md:left-[15%] top-[70%] left-[10%]' },
    { id: 4, icon: AbstractShape1, className: 'md:bottom-[20%] md:right-[20%] bottom-[15%] right-[15%]' },
];

import { useTranslation } from '@/lib/i18n/context';

export default function TurkishCreatorHero() {
    const { t } = useTranslation();

    return (
        <FloatingIconsHero
            heading={<>{t('landing.hero.title')}<br /><span className="text-[#5500ff]">{t('landing.hero.title_accent')}</span></>}
            subtitle={t('landing.hero.subtitle')}
            ctaText={t('landing.hero.cta')}
            ctaHref="/auth?mode=signup"
            icons={turkishCreatorIcons}
        />
    );
}

