'use client';

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetyLogo } from "./brand";
import { useAuthModal } from "@/context/AuthModalContext";
import { useTranslation } from "@/lib/i18n/context";

export function SiteHeader() {
  const { openModal } = useAuthModal();
  const { lang, setLang } = useTranslation();
  const isEn = lang === 'en';

  return (
    <header className="site-header">
      <SetyLogo />
      <nav className="desktop-nav">
        <a href={isEn ? "#how-it-works" : "#nasil-calisir"}>
          {isEn ? "How it works" : "Nasıl çalışır?"}
        </a>
        <a href={isEn ? "#what-to-sell" : "#neler-satabilirsin"}>
          {isEn ? "What you can sell" : "Neler satabilirsin?"}
        </a>
        <Link href="/denizyilmaz">
          {isEn ? "Demo store" : "Örnek mağaza"} <ArrowUpRight size={13} />
        </Link>
      </nav>
      <div className="header-actions">
        {/* Language Switcher */}
        <div className="inline-flex items-center p-0.5 rounded-full border border-[#5500FF]/30 bg-white/90 backdrop-blur-xs text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-black transition-all ${
              isEn
                ? 'bg-[#5500FF] text-white shadow-xs'
                : 'text-[#5500FF] hover:bg-[#5500FF]/10'
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('tr')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-black transition-all ${
              !isEn
                ? 'bg-[#5500FF] text-white shadow-xs'
                : 'text-[#5500FF] hover:bg-[#5500FF]/10'
            }`}
            aria-label="Türkçe'ye geç"
          >
            TR
          </button>
        </div>

        <Button className="btn-login" onClick={() => openModal('login')}>
          {isEn ? "Log in" : "Giriş yap"}
        </Button>
        <Button className="pill" onClick={() => openModal('signup')}>
          {isEn ? "Get started" : "Ücretsiz başla"} <ArrowUpRight />
        </Button>
      </div>
    </header>
  );
}
