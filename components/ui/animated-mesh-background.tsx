'use client';

import { motion } from 'framer-motion';

export function AnimatedMeshBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-transparent blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-transparent blur-3xl"
                animate={{
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-0 left-1/3 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-orange-400/15 via-pink-400/15 to-transparent blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -80, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
