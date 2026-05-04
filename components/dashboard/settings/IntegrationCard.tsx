'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCardProps {
    id: string;
    name: string;
    subtitle?: string;
    description: string;
    icon: string | React.ReactNode;
    learnMoreUrl?: string;
    isConnected?: boolean;
    isComingSoon?: boolean;
    onConnect?: (id: string) => void;
}

export function IntegrationCard({
    id,
    name,
    subtitle,
    description,
    icon,
    learnMoreUrl = '#',
    isConnected = false,
    isComingSoon = false,
    onConnect
}: IntegrationCardProps) {
    const [hasError, setHasError] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[40px] p-8 flex flex-col h-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50 transition-all hover:shadow-[0_40px_80px_rgba(85,0,255,0.05)] group"
        >
            <div className="flex-1 space-y-6">
                {/* Header: Logo and Name on same line */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm p-1.5 shrink-0">
                        {typeof icon === 'string' ? (
                            !hasError ? (
                                <div className="relative w-full h-full">
                                    <img 
                                        src={icon} 
                                        alt={name} 
                                        className="w-full h-full object-contain"
                                        onError={() => setHasError(true)}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-[#5500ff] font-black text-[10px]">
                                    {name.substring(0, 2).toUpperCase()}
                                </div>
                            )
                        ) : (
                            icon
                        )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight leading-none group-hover:text-[#5500ff] transition-colors">
                            {name}
                        </h3>
                        {isComingSoon && (
                            <div className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#5500ff] text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                Soon
                            </div>
                        )}
                    </div>
                </div>

                {/* Content: Subtitle and Description */}
                <div className="space-y-2">
                    {subtitle && (
                        <p className="text-[15px] font-black text-slate-900 leading-tight">
                            {subtitle}
                        </p>
                    )}
                    <p className="text-slate-400 font-bold text-[13px] leading-relaxed line-clamp-4">
                        {description}
                    </p>
                </div>

                {/* Learn More */}
                <a
                    href={learnMoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#5500ff] font-black text-[13px] hover:underline underline-offset-4 decoration-2"
                >
                    Learn More
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Footer / Action */}
            <div className="mt-10">
                <button
                    onClick={() => onConnect?.(id)}
                    disabled={isConnected}
                    className={cn(
                        "w-full h-14 rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-3 active:scale-95",
                        isConnected
                            ? "bg-emerald-50 text-emerald-600 cursor-default"
                            : "bg-[#5500ff] text-white hover:bg-slate-900 shadow-lg shadow-indigo-100"
                    )}
                >
                    {isConnected ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Connected
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            Connect
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

export function IntegrationRequestCard() {
    return (
        <div className="rounded-[40px] border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center space-y-6 h-full hover:border-[#5500ff]/30 transition-colors group">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#5500ff] group-hover:scale-110 transition-all duration-500">
                <Plus className="w-10 h-10" strokeWidth={3} />
            </div>
            <div className="space-y-2">
                <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Don&apos;t see an integration?</h3>
                <p className="text-slate-400 font-bold text-[14px]">Let us know what you need.</p>
            </div>
            <button className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black text-[15px] hover:bg-[#5500ff] transition-all active:scale-95 shadow-xl">
                Request New Integration
            </button>
        </div>
    );
}
