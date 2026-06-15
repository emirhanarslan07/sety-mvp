'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CreditCard, Bell, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { useToast } from '@/context/ToastContext';
import { useTranslation } from '@/lib/i18n/context';
import { format } from 'date-fns';

export default function BillingSettings() {
    const { profile, user, refreshData } = useDashboard();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Initialize Paddle on the client
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Paddle) {
            const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_0cece6c0d24cdc0f17461df383b';
            try {
                const paddle = (window as any).Paddle;
                const env = clientToken.startsWith('live_') ? 'production' : 'sandbox';
                paddle.Environment.set(env);
                paddle.Initialize({
                    token: clientToken
                });
            } catch (err) {
                console.error('Paddle initialization error:', err);
            }
        }
    }, []);

    const handleUpgrade = () => {
        if (typeof window === 'undefined' || !(window as any).Paddle) {
            showToast('Paddle checkout is loading. Please wait a moment and try again.', 'error');
            return;
        }

        const paddle = (window as any).Paddle;
        setLoading(true);

        const priceId = 'pri_01kv4p41r3xjjzp2qae6zne1e8';
        const userEmail = user?.email || '';

        try {
            paddle.Checkout.open({
                items: [
                    {
                        priceId: priceId,
                        quantity: 1,
                    },
                ],
                customer: {
                    email: userEmail,
                },
                customData: {
                    userId: user?.id || '',
                },
                settings: {
                    displayMode: 'overlay',
                    theme: 'light',
                    locale: 'en',
                },
                eventCallback: async (event: any) => {
                    console.log('Paddle checkout event callback:', event);
                    if (event.name === 'checkout.completed') {
                        showToast('Payment successful! Upgrading your account...', 'success');
                        try {
                            const response = await fetch('/api/settings/update-subscription', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    planType: 'pro',
                                    status: 'active'
                                }),
                            });

                            const data = await response.json();
                            if (response.ok && data.success) {
                                showToast('Welcome to Sety Pro! Your account is now active.', 'success');
                                await refreshData();
                            } else {
                                throw new Error(data.error || 'Upgrade process failed');
                            }
                        } catch (error: any) {
                            console.error('Failed to update subscription in DB:', error);
                            showToast(`Verification failed: ${error.message || 'database error'}. Please contact support.`, 'error');
                        }
                    } else if (event.name === 'checkout.closed') {
                        setLoading(false);
                    }
                },
            });
        } catch (error: any) {
            console.error('Error opening Paddle checkout:', error);
            showToast(`Checkout error: ${error.message || 'unknown error'}`, 'error');
            setLoading(false);
        }
    };

    const isPro = profile?.plan_type === 'pro' && profile?.subscription_status === 'active';

    const mockHistory = [
        { id: 'inv-01', date: new Date(), amount: '₺99.00', status: 'Paid' }
    ];

    return (
        <div className="space-y-10">
            {isPro ? (
                /* PRO SUBSCRIBER CARD */
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
                                        <h2 className="text-[44px] font-black text-white tracking-tighter leading-none italic">Sety Pro</h2>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[15px] font-black">Active Subscription</span>
                                    </div>
                                    <p className="text-slate-400 font-bold text-lg">
                                        Next payment: {format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'MMMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-10 border border-white/10 text-right min-w-[280px]">
                                <div className="text-6xl font-black text-white tracking-tighter leading-none italic">₺99<span className="text-2xl text-slate-400 ml-1">/mo</span></div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[11px] opacity-80 mt-2">All Features Unlocked</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <button 
                                onClick={() => showToast('Subscription details and portal are managed securely via Paddle. Check your email inbox for billing receipts or update links.', 'info')}
                                className="h-20 px-10 rounded-[28px] bg-white text-slate-900 hover:bg-[#C4FF00] font-black text-[17px] shadow-2xl transition-all active:scale-95"
                            >
                                Manage Plan
                            </button>
                            <button 
                                onClick={() => showToast('To cancel your subscription, please use the cancel link in your Paddle billing confirmation email, or contact support at support@sety.store.', 'info')}
                                className="h-20 px-10 rounded-[28px] bg-white/5 hover:bg-white/10 text-white font-black text-[17px] border border-white/10 transition-all active:scale-95"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* UPGRADE REQUIRED CARD */
                <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5500ff]/20 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-[#5500ff]/30 transition-colors duration-1000" />
                    <CardContent className="p-10 md:p-14 text-white relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#5500ff] to-indigo-600 flex items-center justify-center border border-white/10">
                                        <Zap className="w-8 h-8 text-white" fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Upgrade Plan</p>
                                        <h2 className="text-[32px] font-black text-white tracking-tight leading-none">Unlock Sety Pro</h2>
                                    </div>
                                </div>
                                
                                <p className="text-slate-300 font-medium text-[16px] leading-relaxed max-w-xl">
                                    Get the most out of your digital store. Remove limitations and keep 100% of your creator earnings.
                                </p>

                                <div className="space-y-3.5 pt-2">
                                    {[
                                        '0% Platform transaction fees (keep everything you sell)',
                                        'Unlimited digital products, downloads & coaching guides',
                                        'Advanced conversion analytics & full pixel tracking integrations',
                                        'Connect your own custom domain (e.g. yourname.com)',
                                        'Zapier integration support to automate your marketing workflow'
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-slate-200">
                                            <CheckCircle2 className="w-5 h-5 text-[#C4FF00] shrink-0" />
                                            <span className="text-[14px] font-semibold">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 text-center min-w-[280px] flex flex-col justify-center">
                                <p className="text-slate-400 font-black uppercase tracking-wider text-[11px] mb-2">Flat Rate Pricing</p>
                                <div className="text-5xl font-black text-white tracking-tighter leading-none italic">₺99<span className="text-xl text-slate-400 ml-1">/mo</span></div>
                                <p className="text-slate-400 text-[13px] font-semibold mt-3">Cancel anytime. 14-day money back guarantee.</p>
                            </div>
                        </div>

                        <div className="flex">
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="h-16 px-12 rounded-2xl bg-gradient-to-r from-[#5500ff] to-indigo-600 hover:from-[#C4FF00] hover:to-[#C4FF00] text-white hover:text-slate-900 font-black text-[16px] transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/35"
                            >
                                <CreditCard className="w-5 h-5" />
                                {loading ? 'Opening Checkout...' : 'Upgrade to Sety Pro'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* BILLING HISTORY CARD */}
            <Card className="rounded-[40px] border-none shadow-[0_30px_60px_rgba(0,0,0,0.03)] bg-white">
                <CardContent className="p-10 md:p-12 space-y-8">
                    <h3 className="text-[22px] font-black text-slate-900 tracking-tight">Billing History</h3>
                    
                    {isPro ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">Invoice ID</th>
                                        <th className="py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">Amount</th>
                                        <th className="py-4 text-[13px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockHistory.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-slate-50 last:border-none">
                                            <td className="py-4 font-bold text-slate-900 text-[15px]">{invoice.id}</td>
                                            <td className="py-4 text-slate-500 font-semibold text-[14px]">
                                                {format(invoice.date, 'MMM dd, yyyy')}
                                            </td>
                                            <td className="py-4 font-bold text-slate-900 text-[15px]">{invoice.amount}</td>
                                            <td className="py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[12px] font-bold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {invoice.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50/50 rounded-[32px] border border-slate-100/50">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Bell className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold italic text-[15px]">No billing history available yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
