'use client';

import React from 'react';
import {
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export interface SocialLinkItem {
  id?: string;
  url: string;
  title?: string;
  type?: string;
}

interface SmartSocialLinksProps {
  links: SocialLinkItem[];
  className?: string;
}

export function getLinkBrand(url: string, type?: string) {
  const u = (url || '').toLowerCase();
  const t = (type || '').toLowerCase();

  if (t === 'instagram' || u.includes('instagram.com')) {
    return {
      name: 'Instagram',
      color: '#E4405F',
      bgHover: 'hover:border-[#E4405F]/50 hover:text-[#E4405F]',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    };
  }

  if (t === 'whatsapp' || u.includes('wa.me') || u.includes('whatsapp.com')) {
    return {
      name: 'WhatsApp',
      color: '#25D366',
      bgHover: 'hover:border-[#25D366]/50 hover:text-[#25D366]',
      icon: <MessageCircle className="w-4 h-4" />,
    };
  }

  if (t === 'phone' || u.startsWith('tel:')) {
    return {
      name: 'Telefon',
      color: '#0F172A',
      bgHover: 'hover:border-slate-800 hover:text-[#5500FF]',
      icon: <Phone className="w-4 h-4" />,
    };
  }

  if (t === 'location' || u.includes('maps.google') || u.includes('goo.gl/maps')) {
    return {
      name: 'Konum',
      color: '#EA4335',
      bgHover: 'hover:border-[#EA4335]/50 hover:text-[#EA4335]',
      icon: <MapPin className="w-4 h-4" />,
    };
  }

  if (t === 'doktortakvimi' || u.includes('doktortakvimi.com')) {
    return {
      name: 'DoktorTakvimi',
      color: '#00B39B',
      bgHover: 'hover:border-[#00B39B]/50 hover:text-[#00B39B]',
      icon: (
        <svg className="w-4 h-4 fill-none stroke-currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m-2-2h4" />
        </svg>
      ),
    };
  }

  if (u.includes('dribbble.com')) {
    return {
      name: 'Dribbble',
      color: '#EA4C89',
      bgHover: 'hover:border-[#EA4C89]/50 hover:text-[#EA4C89]',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm9.89 10.98c-.28-.02-2.73-.2-5.33.64-.17-.38-.34-.76-.53-1.14 3.73-1.58 5.16-3.52 5.25-3.66 1.48 2.05 2.37 4.56 2.37 7.28 0 .28-.02.56-.05.83-.02-.02-.75-1.74-1.71-3.95zm-3.07-4.99c-.11.14-1.46 1.95-5.06 3.44-1.57-2.88-3.27-5.32-3.43-5.55 1.63-.58 3.39-.88 5.22-.88 1.22 0 2.39.17 3.5.49-.07.1-.15.27-.23.5zm-10.74-2.8c.17.23 1.84 2.64 3.42 5.48-4.22 1.25-8.06 1.25-8.38 1.25.75-2.93 2.66-5.38 5.23-6.73h-.27zm-6.02 8.35c.29 0 3.73 0 7.82-1.15.22.46.42.92.62 1.39-3.99 2.5-6.07 6.45-6.19 6.69-1.4-1.99-2.25-4.42-2.25-7.06 0-.25.01-.5.03-.74l-.03.87zm3.17 8.07c.13-.23 1.99-3.88 5.92-6.36 1.34 3.65 1.9 6.77 1.96 7.15-1.39.54-2.9.84-4.48.84-1.23 0-2.4-.2-3.48-.57l.08-1.06zm9.21 1.26c-.08-.43-.63-3.44-1.92-7.01 2.39-.81 4.58-.69 4.88-.67-.28 3.09-1.87 5.76-4.21 7.42l1.25.26z" />
        </svg>
      ),
    };
  }

  if (u.includes('behance.net')) {
    return {
      name: 'Behance',
      color: '#1769FF',
      bgHover: 'hover:border-[#1769FF]/50 hover:text-[#1769FF]',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.459 0-5.755-2.509-5.755-5.79 0-3.425 2.509-5.834 5.834-5.834 3.298 0 5.42 2.316 5.42 5.596 0 .426-.041.831-.098 1.205h-8.874c.153 1.989 1.637 3.323 3.623 3.323 1.637 0 2.766-.757 3.251-1.5l1.57.001zm-7.447-3.667h6.495c-.171-1.802-1.332-2.833-3.134-2.833-1.838 0-3.076 1.054-3.361 2.833zm-9.279 5.667h-7v-14h7.02c3.551 0 5.23 1.764 5.23 4.223 0 1.488-.702 2.77-1.875 3.398 1.488.583 2.375 1.996 2.375 3.759 0 2.832-2.008 4.62-5.75 4.62zm-4.32-8.375h3.805c1.785 0 2.895-.873 2.895-2.222 0-1.429-1.07-2.143-2.895-2.143h-3.805v4.365zm0 2.651v4.464h4.045c1.928 0 3.095-.992 3.095-2.401 0-1.349-1.127-2.063-3.095-2.063h-4.045z" />
        </svg>
      ),
    };
  }

  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    return {
      name: 'YouTube',
      color: '#FF0000',
      bgHover: 'hover:border-[#FF0000]/50 hover:text-[#FF0000]',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    };
  }

  if (u.includes('linkedin.com')) {
    return {
      name: 'LinkedIn',
      color: '#0A66C2',
      bgHover: 'hover:border-[#0A66C2]/50 hover:text-[#0A66C2]',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-2.239-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    };
  }

  if (u.includes('x.com') || u.includes('twitter.com')) {
    return {
      name: 'X',
      color: '#000000',
      bgHover: 'hover:border-slate-800 hover:text-black',
      icon: (
        <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    };
  }

  // Default web link
  return {
    name: 'Web Sitesi',
    color: '#5500FF',
    bgHover: 'hover:border-[#5500FF]/50 hover:text-[#5500FF]',
    icon: <Globe className="w-4 h-4" />,
  };
}

export function SmartSocialLinks({ links, className = '' }: SmartSocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <div className={`flex items-center flex-wrap justify-center gap-2 mt-4 ${className}`}>
      {links.map((link, idx) => {
        const brand = getLinkBrand(link.url, link.type);
        const title = link.title || brand.name;

        return (
          <a
            key={link.id || `${link.url}-${idx}`}
            href={link.url}
            target={link.url.startsWith('tel:') ? undefined : '_blank'}
            rel={link.url.startsWith('tel:') ? undefined : 'noopener noreferrer'}
            aria-label={title}
            title={title}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 shadow-2xs transition-all duration-200 hover:scale-105 active:scale-95 ${brand.bgHover}`}
          >
            {brand.icon}
          </a>
        );
      })}
    </div>
  );
}
