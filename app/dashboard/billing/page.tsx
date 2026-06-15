'use client';

import BillingSettings from '@/components/dashboard/settings/BillingSettings';
import { useTranslation } from '@/lib/i18n/context';

export default function BillingPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#F8FAFF] pb-32">
            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
                            Billing & Subscription
                        </h1>
                        <p className="text-slate-400 font-bold text-[15px] mt-2">
                            Manage your Sety Pro subscription plan and view payment invoices.
                        </p>
                    </div>
                </div>

                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BillingSettings />
                </div>
            </div>
        </div>
    );
}
