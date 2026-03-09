'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service if available
        console.error('Handled Global Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 font-jakarta">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle size={48} />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-none"
                >
                    Oops! Bir şeyler ters gitti.
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 font-medium mb-10 leading-relaxed"
                >
                    Uygulama çalışırken beklenmedik bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 bg-[#5500ff] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#4400cc] transition-all shadow-lg shadow-purple-200 active:scale-95"
                    >
                        <RefreshCcw size={20} />
                        Tekrar Dene
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Home size={20} />
                        Ana Sayfa
                    </Link>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                        Hata Kodu: {error.digest || 'UNKNOWN_ERROR'}
                    </p>
                </div>
            </div>
        </div>
    );
}
