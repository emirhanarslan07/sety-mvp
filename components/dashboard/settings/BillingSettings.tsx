'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle2, Heart } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { format } from 'date-fns';

export default function BillingSettings() {
    const { profile } = useDashboard();

    return (
        <div className="space-y-10">
            {/* PRO SUBSCRIBER CARD (FREE FOR ALL) */}
            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-slate-900 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5500ff]/20 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-[#5500ff]/30 transition-colors duration-1000" />
                <CardContent className="p-12 md:p-16 text-white relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#5500ff] to-indigo-600 flex items-center justify-center shadow-2xl border border-white/10">
                                    <Zap className="w-10 h-10 text-white" fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Plan</p>
                                    <h2 className="text-[44px] font-black text-white tracking-tighter leading-none italic">Sety Pro (Early Adopter)</h2>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[15px] font-black">100% Free Forever</span>
                                </div>
                                <p className="text-slate-400 font-bold text-lg">
                                    Joined: {profile?.created_at ? format(new Date(profile.created_at), 'MMMM dd, yyyy') : 'Today'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 text-right min-w-[280px]">
                            <div className="text-6xl font-black text-white tracking-tighter leading-none italic">$0<span className="text-2xl text-slate-400 ml-1">/mo</span></div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] opacity-80 mt-2 flex items-center justify-end gap-2">
                                <Heart className="w-3 h-3 text-pink-500" /> All Features Unlocked
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5 bg-white/5 p-8 rounded-[28px] border border-white/10">
                        <h3 className="text-xl font-bold mb-2">Thank you for being one of our first creators! 🎉</h3>
                        <p className="text-slate-300">As an early adopter, you get Sety Pro completely free. We do not charge you any monthly subscription fees. You only pay standard transaction fees when you make a sale. Keep building and growing your store!</p>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                '0% Platform Monthly Fees',
                                'Unlimited Products & Coaching',
                                'Advanced Analytics',
                                'Custom Domain Support'
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-200">
                                    <CheckCircle2 className="w-5 h-5 text-[#C4FF00] shrink-0" />
                                    <span className="text-[14px] font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
