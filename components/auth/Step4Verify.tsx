'use client';

import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step4VerifyProps {
    email: string;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    handleVerifyOtp: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
}

export function Step4Verify({
    email,
    verificationCode,
    setVerificationCode,
    handleVerifyOtp,
    loading,
    error
}: Step4VerifyProps) {
    return (
        <motion.div
            key="signup-step-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 w-full"
        >
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-slate-950 z-10">
                    <Mail className="w-[20px] h-[20px] text-slate-400 transition-colors group-focus-within:text-slate-950" />
                </div>
                <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Verification Code"
                    className="pl-12 h-[52px] rounded-xl border border-slate-200 hover:border-slate-300 focus-visible:border-[#5500ff] bg-white shadow-sm text-[16px] placeholder:text-slate-400 font-medium transition-all duration-200"
                    required
                />
            </div>

            {error && <div className="text-red-500 text-[14px] text-center font-normal">{error}</div>}

            <div className="pt-2">
                <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || verificationCode.length < 6}
                    className="w-full h-[54px] rounded-full bg-[#5500ff] hover:bg-[#4400cc] text-white font-semibold text-[17px] shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] border-none"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify and Finish ✨'}
                </Button>
            </div>

            <p className="text-center text-[13px] text-slate-400 font-medium">
                Didn't receive code? <button className="text-[#5500ff] hover:underline font-bold">Resend</button>
            </p>
        </motion.div>
    );
}
