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

// Interface for the main hero component's props.
export interface FloatingIconsHeroProps {
    heading: React.ReactNode;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    subCtaText?: string;
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
            <div className="absolute inset-0 w-full h-full opacity-70 md:opacity-100">
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
            <div className="relative z-20 text-center px-8 md:px-4 flex items-center justify-center min-h-screen">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1] text-foreground font-logo">
                        {heading}
                    </h1>
                    <p className="mt-8 max-w-2xl mx-auto text-base md:text-xl text-muted-foreground leading-relaxed font-medium">
                        {subtitle}
                    </p>

                    <div className="mt-14 flex flex-col items-center gap-4">
                        <Link href={ctaHref}>
                            <Button size="xl" className="px-16 h-16 rounded-full font-black text-lg bg-[#5500ff] hover:bg-[#4400cc] shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all active:scale-95 border-none text-white">
                                {ctaText} <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="inline-block ml-2"
                                >→</motion.span>
                            </Button>
                        </Link>
                        {subCtaText && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-sm font-bold text-[#5500ff] bg-[#5500ff]/5 px-4 py-1.5 rounded-full tracking-wide"
                            >
                                {subCtaText}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </section>

    );
});


FloatingIconsHero.displayName = 'FloatingIconsHero';

export { FloatingIconsHero };
