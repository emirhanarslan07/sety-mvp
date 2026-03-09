'use client';

import { motion } from 'framer-motion';

interface ParticleFieldProps {
    color?: string;
    count?: number;
}

export function ParticleField({ color = 'purple', count = 30 }: ParticleFieldProps) {
    const particles = Array.from({ length: count });

    const colorMap: Record<string, string> = {
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
    };

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute h-1 w-1 rounded-full ${colorMap[color] || colorMap.purple}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.2,
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        scale: [1, Math.random() + 0.5, 1],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
}
