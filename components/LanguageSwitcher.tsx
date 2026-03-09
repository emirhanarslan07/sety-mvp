'use client';

import { useTranslation } from '@/lib/i18n/context';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { lang, setLang } = useTranslation();

    return (
        <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-100 backdrop-blur-sm">
            {[
                { id: 'tr', label: 'TR' },
                { id: 'en', label: 'EN' },
                { id: 'ar', label: 'AR' }
            ].map((l) => (
                <button
                    key={l.id}
                    onClick={() => setLang(l.id as any)}
                    className={cn(
                        "px-4 py-1.5 rounded-xl text-[11px] font-black transition-all",
                        lang === l.id ? "bg-white text-[#5500ff] shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
