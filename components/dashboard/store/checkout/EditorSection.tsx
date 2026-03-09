'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EditorSectionProps {
    number: number;
    title: string;
    children: React.ReactNode;
}

export function EditorSection({ number, title, children }: EditorSectionProps) {
    return (
        <section className="space-y-8">
            <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full bg-[#5500ff]/10 text-[#5500ff] flex items-center justify-center font-bold text-[15px] border border-[#5500ff]/20">
                    {number}
                </div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">{title}</h2>
            </div>
            {children}
        </section>
    );
}
