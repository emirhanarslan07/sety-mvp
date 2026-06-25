'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    loading: boolean;
    error: string;
    handleAuth: (e: React.FormEvent) => void;
    setIsForgotPassword: (forgot: boolean) => void;
}

export function LoginForm({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleAuth,
    setIsForgotPassword
}: LoginFormProps) {
    return (
        <motion.div
            key="login-fields"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 w-full"
        >
            <PremiumInput
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email or username"
                autoComplete="username"
                required
            />

            <PremiumInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
            />

            {error && <div className="text-red-500 text-[14px] text-center font-bold px-4">{error}</div>}

            <div className="flex justify-end pt-1">
                <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[14px] text-[#5500ff] hover:text-[#4400cc] font-bold transition-colors"
                >
                    Forgot password?
                </button>
            </div>

            <div className="pt-4">
                <Button
                    onClick={handleAuth}
                    disabled={loading}
                    className="relative w-full h-[54px] rounded-full bg-gradient-to-r from-[#5500ff] to-[#6C47FF] hover:from-[#4400cc] hover:to-[#5500ff] text-white font-black text-[17px] shadow-[0_10px_30px_-10px_rgba(85,0,255,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] border-none overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </Button>
            </div>
        </motion.div>
    );
}
