import React from 'react';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface SetyLogoProps {
    className?: string;
    iconClassName?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    showBackground?: boolean;
}

export function SetyLogo({
    className,
    iconClassName,
    size = 'md',
    color = '#C4FF00',
    showBackground = true
}: SetyLogoProps) {
    const sizeMap = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const iconSizeMap = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-11 w-11',
    };

    const strokeWidthMap = {
        sm: 2.5,
        md: 2.5,
        lg: 2.2,
        xl: 2,
    };

    const icon = (
        <Zap
            className={cn(iconSizeMap[size], 'drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.15)]', iconClassName)}
            fill={color}
            color={color}
            strokeWidth={strokeWidthMap[size]}
        />
    );

    if (!showBackground) return icon;

    return (
        <div className={cn(
            "flex items-center justify-center rounded-full bg-[#5500ff] shadow-lg shadow-[#5500ff]/20",
            sizeMap[size],
            className
        )}>
            {icon}
        </div>
    );
}
