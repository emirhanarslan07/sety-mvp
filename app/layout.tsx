import { Inter, Plus_Jakarta_Sans, Cairo, Montserrat, Syne, Space_Mono, Playfair_Display, Outfit, Bebas_Neue, Poppins, Lexend } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-montserrat",
    weight: ["700", "800", "900"],
});

const syne = Syne({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-syne",
});

const spaceMono = Space_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-space-mono",
    weight: ["400", "700"],
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-playfair",
});

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-outfit",
});

const bebasNeue = Bebas_Neue({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-bebas",
    weight: ["400"],
});

const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
    weight: ["400", "500", "600", "700", "800", "900"],
});

const lexend = Lexend({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-lexend",
});
import "./globals.css";
import { PHProvider } from "@/lib/analytics/posthog-provider";
import { I18nProvider } from "@/lib/i18n/context";
import { ThemeProvider } from "@/components/theme-provider";
import DiagnosticLayer from "@/components/debug/DiagnosticLayer";
import { ToastProvider } from "@/context/ToastContext";
import { headers, cookies } from "next/headers";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin", "latin-ext"],
    display: "swap",
    variable: "--font-plus-jakarta",
});

const cairo = Cairo({
    subsets: ["arabic"],
    display: "swap",
    variable: "--font-cairo",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://sety.store'),
    title: {
        default: "Sety — Sell Your Digital Products | Creator Store Platform",
        template: "%s | Sety"
    },
    description: "Create your online store in 2 minutes. Sell digital products, coaching sessions, and more. The simplest way for creators to monetize their audience.",
    keywords: ["creator economy", "digital products", "online store", "sell digital products", "creator store", "link in bio store", "stan store alternative"],
    authors: [{ name: "Sety" }],
    alternates: {
        canonical: '/',
        languages: {
            'en': '/?lang=en',
            'tr': '/?lang=tr',
            'ar': '/?lang=ar',
            'ru': '/?lang=ru',
            'de': '/?lang=de',
            'es': '/?lang=es',
            'pt': '/?lang=pt',
            'fr': '/?lang=fr',
            'zh': '/?lang=zh',
            'hi': '/?lang=hi',
        },
    },
    openGraph: {
        title: "Sety — Sell Your Digital Products | Creator Store Platform",
        description: "Create your online store in 2 minutes. Sell digital products, coaching sessions, and more. The simplest way for creators to monetize their audience.",
        type: "website",
        url: 'https://sety.store',
        siteName: 'Sety',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Sety Platform Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sety — Sell Your Digital Products | Creator Store Platform',
        description: 'Create your online store in 2 minutes. Sell digital products, coaching sessions, and more. The simplest way for creators to monetize their audience.',
        images: ['/og-image.png'],
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies();
    const lang = cookieStore.get('s_lang')?.value || 'tr';

    return (
        <html lang={lang} className={`${inter.variable} ${plusJakartaSans.variable} ${cairo.variable} ${montserrat.variable} ${syne.variable} ${spaceMono.variable} ${playfair.variable} ${outfit.variable} ${bebasNeue.variable} ${poppins.variable} ${lexend.variable}`} suppressHydrationWarning>
            <head>
                {/* Google Analytics */}
                <Script
                    strategy="afterInteractive"
                    src={`https://www.googletagmanager.com/gtag/js?id=G-BQ821YY6WL`}
                />
                <Script
                    id="google-analytics"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-BQ821YY6WL', {
                                page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </head>
            <body className="antialiased font-sans">
                <PHProvider>
                    <I18nProvider>
                        <ToastProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="light"
                                forcedTheme="light"
                                enableSystem={false}
                                disableTransitionOnChange
                            >
                                <DiagnosticLayer />
                                {children}
                                <Analytics />
                            </ThemeProvider>
                        </ToastProvider>
                    </I18nProvider>
                </PHProvider>
            </body>
        </html>
    );
}
