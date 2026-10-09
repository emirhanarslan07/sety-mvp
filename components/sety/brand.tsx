'use client';

import { Zap } from "lucide-react";
import Link from "next/link";

export function SetyLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="sety-logo" aria-label="Sety ana sayfa">
      <span className="logo-symbol">
        <Zap fill="currentColor" strokeWidth={2.5} />
      </span>
      {!compact && (
        <span>
          Sety<span className="logo-dot">.</span>
        </span>
      )}
    </Link>
  );
}
