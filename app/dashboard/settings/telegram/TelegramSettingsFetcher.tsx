'use client';

import { useDashboard } from '@/context/DashboardContext';
import { useEffect, useState } from 'react';
import TelegramSettingsClientComponent from './TelegramSettingsClient';
import { Skeleton } from '@/components/ui/skeleton';

export function TelegramSettingsSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-[250px] w-full rounded-[32px]" />
            <Skeleton className="h-[400px] w-full rounded-[32px]" />
            <Skeleton className="h-[200px] w-full rounded-[32px]" />
        </div>
    );
}

export default function TelegramSettingsFetcher() {
    const { store, loading: contextLoading } = useDashboard();
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!store?.id) {
            if (!contextLoading) setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                const res = await fetch(`/api/telegram/settings?store_id=${store.id}`);
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [store?.id, contextLoading]);

    if (contextLoading || loading) return <TelegramSettingsSkeleton />;
    if (!store) return <div className="p-12 text-center font-bold text-slate-400">Mağaza bilgisi yüklenemedi.</div>;

    return <TelegramSettingsClientComponent initialSettings={settings} store={store} />;
}
