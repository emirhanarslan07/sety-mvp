'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

// Interface for the props of each individual icon.
interface IconProps {
    id: number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    className: string; // Used for custom positioning of the icon.
}

export interface FloatingIconsHeroProps {
    eyebrow?: React.ReactNode;
    heading: React.ReactNode;
    subtitle: React.ReactNode;
    ctaText: string;
    ctaHref: string;
    onCtaClick?: () => void;
    subCtaText?: string;
    ctaFooter?: React.ReactNode;
    icons: IconProps[];
}

// A single icon component with its own motion logic
const Icon = ({
    mouseX,
    mouseY,
    iconData,
    index,
}: {
    mouseX: React.MutableRefObject<number>;
    mouseY: React.MutableRefObject<number>;
    iconData: IconProps;
    index: number;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    // Motion values for the icon's position, with spring physics for smooth movement
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 20 });
    const springY = useSpring(y, { stiffness: 300, damping: 20 });

    React.useEffect(() => {
        const handleMouseMove = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
                    Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
                );

                // If the cursor is close enough, repel the icon
                if (distance < 150) {
                    const angle = Math.atan2(
                        mouseY.current - (rect.top + rect.height / 2),
                        mouseX.current - (rect.left + rect.width / 2)
                    );
                    // The closer the cursor, the stronger the repulsion
                    const force = (1 - distance / 150) * 50;
                    x.set(-Math.cos(angle) * force);
                    y.set(-Math.sin(angle) * force);
                } else {
                    // Return to original position when cursor is away
                    x.set(0);
                    y.set(0);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y, mouseX, mouseY]);

    return (
        <motion.div
            ref={ref}
            key={iconData.id}
            style={{
                x: springX,
                y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.4,
                ease: "easeOut",
            }}
            // Tailwind classes to update CSS variables based on screen size
            // Removing Framer Motion's scale property to let CSS scale work properly
            className={cn(
                'absolute transition-all duration-700',
                '[--scale:0.65] [--opacity:1] md:[--scale:0.85] md:[--opacity:1]',
                'scale-[var(--scale)] opacity-[var(--opacity)]',
                iconData.className
            )}
        >
            {/* Inner wrapper for the continuous floating animation */}
            <motion.div
                className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 p-3 rounded-3xl shadow-xl md:shadow-2xl bg-white border border-slate-100"
                animate={{
                    y: [0, -8, 0, 8, 0],
                    x: [0, 6, 0, -6, 0],
                    rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                }}
            >
                <iconData.icon />
            </motion.div>
        </motion.div>
    );
};

const FloatingIconsHero = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, heading, subtitle, ctaText, ctaHref, subCtaText, icons, ...props }, ref) => {
    // Refs to track the raw mouse position
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        mouseX.current = event.clientX;
        mouseY.current = event.clientY;
    };

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className={cn(
                'relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-white text-foreground transition-colors duration-500',
                className
            )}
            {...props}
        >
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05)_0%,transparent_60%)] pointer-events-none" />

            {/* Container for the background floating icons */}
            <div className="absolute inset-0 w-full h-full opacity-40 sm:opacity-100 pointer-events-none">
                {icons.map((iconData, index) => (
                    <Icon
                        key={iconData.id}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        iconData={iconData}
                        index={index}
                    />
                ))}
            </div>

            {/* Container for the foreground content */}
            <div className="relative z-20 text-center px-4 md:px-6 flex items-center justify-center min-h-screen">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {props.eyebrow && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 flex items-center justify-center"
                        >
                            {props.eyebrow}
                        </motion.div>
                    )}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-4xl font-sans">
                        {heading}
                    </h1>
                    <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mb-10">
                        {subtitle}
                    </p>

                    <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                        {props.onCtaClick ? (
                            <button
                                onClick={props.onCtaClick}
                                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl sm:rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#5500FF]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                            >
                                {ctaText} — Kredi kartı gerekmez
                            </button>
                        ) : (
                            <Link href={ctaHref} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 rounded-2xl sm:rounded-full bg-[#5500FF] hover:bg-[#4400cc] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#5500FF]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center cursor-pointer">
                                    {ctaText} — Kredi kartı gerekmez
                                </button>
                            </Link>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm font-semibold mt-2">
                            <span>⚡ 2 dakikada kurulum</span>
                            <span>•</span>
                            <span>Kredi kartı gerekmez</span>
                            <span>•</span>
                            <span>Anında satışa başla</span>
                        </div>
                    </div>
                        {props.ctaFooter && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="mt-6"
                            >
                                {props.ctaFooter}
                            </motion.div>
                        )}
                    </div>
                </div>
        </section>

    );
});


FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };
