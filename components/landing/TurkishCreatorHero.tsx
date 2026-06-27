'use client';

import * as React from 'react';
import {
    FloatingIconsHero,
    type FloatingIconsHeroProps,
} from '@/components/ui/floating-icons-hero-section';

// Import icons from react-icons
import { FaInstagram, FaYoutube, FaSpotify, FaWhatsapp } from 'react-icons/fa';
import { SiUdemy, SiNotion, SiZoom, SiTiktok, SiGooglecalendar } from 'react-icons/si';

// Wrapper components with exact brand colors
const IconInstagram = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <defs>
            <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="150%">
                <stop offset="0%" style={{ stopColor: '#fdf497' }} />
                <stop offset="5%" style={{ stopColor: '#fdf497' }} />
                <stop offset="45%" style={{ stopColor: '#fd5949' }} />
                <stop offset="60%" style={{ stopColor: '#d6249f' }} />
                <stop offset="90%" style={{ stopColor: '#285AEB' }} />
            </radialGradient>
        </defs>
        <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const IconYouTube = (props: React.SVGProps<SVGSVGElement>) => (
    <FaYoutube {...props} style={{ color: '#FF0000', width: '100%', height: '100%' }} />
);

const IconTikTok = (props: React.SVGProps<SVGSVGElement>) => (
    <SiTiktok {...props} className="text-black dark:text-white" style={{
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(-2px 0px 0px #25F4EE) drop-shadow(2px 0px 0px #FE2C55)'
    }} />
);

const IconUdemy = (props: React.SVGProps<SVGSVGElement>) => (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Purple top (graduation cap) */}
        <SiUdemy {...props} style={{ color: '#A435F0', width: '100%', height: '100%', position: 'absolute', clipPath: 'inset(0 0 60% 0)' }} />
        {/* Adaptive bottom (U letter) */}
        <SiUdemy {...props} className="text-black dark:text-white" style={{ width: '100%', height: '100%', position: 'absolute', clipPath: 'inset(40% 0 0 0)' }} />
    </div>
);

const IconNotion = (props: React.SVGProps<SVGSVGElement>) => (
    <SiNotion {...props} className="text-black dark:text-white" style={{ width: '100%', height: '100%' }} />
);

const IconGoogleDrive = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
);



const IconSpotify = (props: React.SVGProps<SVGSVGElement>) => (
    <FaSpotify {...props} style={{ color: '#1DB954', width: '100%', height: '100%' }} />
);

const IconWhatsApp = (props: React.SVGProps<SVGSVGElement>) => (
    <FaWhatsapp {...props} style={{ color: '#25D366', width: '100%', height: '100%' }} />
);

const IconZoom = (props: React.SVGProps<SVGSVGElement>) => (
    <SiZoom {...props} style={{ color: '#2D8CFF', width: '100%', height: '100%' }} />
);

const IconGoogleCalendar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="22" height="22" x="13" y="13" fill="#fff" />
        <polygon fill="#1e88e5" points="25.68,20.92 26.688,22.36 28.272,21.208 28.272,29.56 30,29.56 30,18.616 28.56,18.616" />
        <path fill="#1e88e5" d="M22.943,23.745c0.625-0.574,1.013-1.37,1.013-2.249c0-1.747-1.533-3.168-3.417-3.168 c-1.602,0-2.972,1.009-3.33,2.453l1.657,0.421c0.165-0.664,0.868-1.146,1.673-1.146c0.942,0,1.709,0.646,1.709,1.44 c0,0.794-0.767,1.44-1.709,1.44h-0.997v1.728h0.997c1.081,0,1.993,0.751,1.993,1.64c0,0.904-0.866,1.64-1.931,1.64 c-0.962,0-1.784-0.61-1.914-1.418L17,26.802c0.262,1.636,1.81,2.87,3.6,2.87c2.007,0,3.64-1.511,3.64-3.368 C24.24,25.281,23.736,24.363,22.943,23.745z" />
        <polygon fill="#fbc02d" points="34,42 14,42 13,38 14,34 34,34 35,38" />
        <polygon fill="#4caf50" points="38,35 42,34 42,14 38,13 34,14 34,34" />
        <path fill="#1e88e5" d="M34,14l1-4l-1-4H9C7.343,6,6,7.343,6,9v25l4,1l4-1V14H34z" />
        <polygon fill="#e53935" points="34,34 34,42 42,34" />
        <path fill="#1565c0" d="M39,6h-5v8h8V9C42,7.343,40.657,6,39,6z" />
        <path fill="#1565c0" d="M9,42h5v-8H6v5C6,40.657,7.343,42,9,42z" />
    </svg>
);

// Define the icons with balanced positions (10 total)
const turkishCreatorIcons: FloatingIconsHeroProps['icons'] = [
    // Web (Hassas Yerleşim) | Dişler: Mobile (Aynı Korundu)
    { id: 1, icon: IconInstagram, className: 'md:top-[12%] md:left-[14%] top-[11%] left-[5%]' },
    { id: 2, icon: IconYouTube, className: 'md:top-[8%] md:left-[40%] top-[10%] left-[35%]' },
    { id: 3, icon: IconTikTok, className: 'md:top-[11%] md:right-[25%] md:left-auto top-[11%] left-[70%]' }, // Biraz daha sola (içeri)
    { id: 4, icon: IconUdemy, className: 'md:top-[35%] md:left-[8%] bottom-[8%] left-[45%]' },
    { id: 5, icon: IconNotion, className: 'md:top-[25%] md:right-[10%] hidden md:block' },

    { id: 6, icon: IconGoogleDrive, className: 'md:top-[65%] md:left-[5%] top-[36%] left-[0%]' },
    { id: 7, icon: IconSpotify, className: 'md:top-[78%] md:left-[22%] bottom-[6%] left-[10%]' },
    { id: 8, icon: IconWhatsApp, className: 'md:bottom-[15%] md:right-[20%] md:left-auto bottom-[6%] left-[80%]' },
    { id: 9, icon: IconZoom, className: 'md:top-[55%] md:right-[6%] hidden md:block' },
    { id: 10, icon: IconGoogleCalendar, className: 'md:top-[85%] md:left-[48.5%] top-[36%] left-[85%]' }, // Daha da aşağı indirildi
]; // Metinden uzağa, sola alındı

import { useTranslation } from '@/lib/i18n/context';
import { useAuthModal } from '@/context/AuthModalContext';

export default function TurkishCreatorHero() {
    const { t } = useTranslation();
    const { openModal } = useAuthModal();

    return (
        <FloatingIconsHero
            heading={<>Takipçilerini müşteriye dönüştürmenin <br /><span className="text-[#5500ff]">en kolay yolu</span></>}
            subtitle={
                <>
                    Biyografine tek bir link koy, gerisini Sety halleder. E-kitaptan koçluk seansına, kurslardan birebir danışmanlığa kadar her şeyi dakikalar içinde sat. <span className="font-semibold text-[#5500ff]">Tek link. Sınırsız ürün. Sıfır komisyon.</span> Mağazanı 2 dakikada kur, hemen satmaya başla.
                </>
            }
            ctaText="Hemen Mağazanı Aç"
            ctaHref="#"
            onCtaClick={() => openModal('signup')}
            icons={turkishCreatorIcons}
        />
    );
}

