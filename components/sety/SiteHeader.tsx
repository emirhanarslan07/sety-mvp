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
        <a href="#how-it-works">How it works</a>
        <a href="#what-to-sell">What you can sell</a>
        <Link href="/emma">
          Demo store <ArrowUpRight size={13} />
        </Link>
      </nav>
      <div className="header-actions">
        <Button className="btn-login" onClick={() => openModal('login')}>
          Log in
        </Button>
        <Button className="pill" onClick={() => openModal('signup')}>
          Get started <ArrowUpRight />
        </Button>
      </div>
    </header>
  );
}
