'use client';

import { Zap } from "lucide-react";
import Link from "next/link";

export function SetyLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={`sety-logo ${compact ? 'compact' : ''} ${className}`} aria-label="Sety ana sayfa">
      <span className="logo-symbol">
        <Zap fill="currentColor" strokeWidth={2.5} />
      </span>
      <span className="font-sans font-black tracking-tight">
        Sety
      </span>
    </Link>
  );
}
