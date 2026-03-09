'use client';

import React from 'react';
import { Sparkles, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoreHeaderProps {
    isSavingDesign: boolean;
    handleSaveDesign: () => void;
    username: string;
    copied: boolean;
    copyToClipboard: () => void;
}

export default function StoreHeader({
    isSavingDesign,
    username,
    copied,
    copyToClipboard,
}: StoreHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
                {/* Title removed per user request */}
            </div>

            <div className="flex items-center gap-3">
                {/* Manual interactions removed for pure manual/save action flow */}
            </div>
        </div>
    );
}
