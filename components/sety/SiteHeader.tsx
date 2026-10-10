'use client';

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetyLogo } from "./brand";
import { useAuthModal } from "@/context/AuthModalContext";

export function SiteHeader() {
  const { openModal } = useAuthModal();

  return (
    <header className="site-header">
      <SetyLogo />
      <nav className="desktop-nav">
        <a href="#nasil-calisir">Nasıl çalışır?</a>
        <a href="#neler-satabilirsin">Neler satabilirsin?</a>
        <Link href="/denizyilmaz">
          Örnek mağaza <ArrowUpRight size={13} />
        </Link>
      </nav>
      <div className="header-actions">
        <Button className="btn-login" onClick={() => openModal('login')}>
          Giriş yap
        </Button>
        <Button className="pill" onClick={() => openModal('signup')}>
          Ücretsiz başla <ArrowUpRight />
        </Button>
      </div>
    </header>
  );
}
