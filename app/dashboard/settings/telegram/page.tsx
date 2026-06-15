import { Suspense } from 'react';
import { Bot } from 'lucide-react';
import TelegramSettingsFetcher, { TelegramSettingsSkeleton } from './TelegramSettingsFetcher';

export default async function TelegramSettingsPage() {
    return (
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-10 md:py-16 pb-32 space-y-10">
            {/* Page Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#5500ff] flex items-center justify-center shadow-lg shadow-indigo-100">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-[32px] md:text-[40px] font-black text-slate-900 tracking-tight leading-none italic uppercase">
                        Telegram Bot
                    </h1>
                </div>
                <p className="text-[16px] md:text-[18px] font-bold text-slate-400 tracking-tight ml-1">
                    Mağazanızı Telegram'a bağlayın ve satışlarınızı anlık takip edin.
                </p>
            </div>

            {/* Content Area with Suspense for better UX */}
            <Suspense fallback={<TelegramSettingsSkeleton />}>
                <TelegramSettingsFetcher />
            </Suspense>
        </div>
    );
}
