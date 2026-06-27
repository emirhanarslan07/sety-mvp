'use client';

import Link from 'next/link';
import { SetyLogo } from '@/components/ui/SetyLogo';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
    const { t } = useTranslation();

    const socialLinks = [
        {
            icon: (props: any) => (
                <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            ),
            href: 'https://x.com/setyforcreators'
        },
        { icon: Instagram, href: 'https://www.instagram.com/setyforcreators/' },
        { icon: Linkedin, href: 'https://www.linkedin.com/company/setywithme/' },
    ];

    const footerLinks = [
        { name: t('landing.nav.login'), href: '/auth?mode=login' },
        { name: t('landing.footer.help'), href: '#faq' },
        { name: t('landing.footer.privacy'), href: '/privacy' },
        { name: t('landing.footer.terms'), href: '/terms' },
        { name: 'Refund Policy', href: '/refund' },
    ];

    return (
        <footer className="bg-background py-24 border-t border-border/40 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    {/* Left Side: Socials & Logo */}
                    <div className="flex flex-col justify-between order-2 md:order-1 gap-16 md:gap-0">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, i) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={i}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all font-medium"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group pt-10 md:pt-0">
                            <SetyLogo size="md" className="group-hover:scale-110 transition-transform" />
                            <span translate="no" className="notranslate text-2xl font-black tracking-tighter text-foreground">
                                Sety
                            </span>
                        </Link>
                    </div>

                    {/* Right Side: Links */}
                    <div className="order-1 md:order-2">
                        <ul className="flex flex-col gap-4">
                            {footerLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] font-bold text-muted-foreground hover:text-primary transition-colors font-jakarta"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom line */}
                <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-sm text-muted-foreground/60 font-medium">
                        © {new Date().getFullYear()} <span translate="no" className="notranslate">Sety</span>. {t('landing.footer.rights')}
                    </p>
                    <p className="text-sm text-muted-foreground/60 font-medium">
                        Contact / İletişim: <a href="mailto:hello@sety.store" className="hover:text-primary transition-colors font-bold">hello@sety.store</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

