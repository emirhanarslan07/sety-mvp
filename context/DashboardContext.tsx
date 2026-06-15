'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DashboardContextType {
    user: any;
    profile: any;
    store: any;
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                setLoading(false);
                return;
            }

            const [profileRes, storeRes] = await Promise.all([
                supabase.from('user_profiles').select('*').eq('user_id', authUser.id).single(),
                supabase.from('stores').select('*').eq('user_id', authUser.id).single()
            ]);

            setUser(authUser);
            setProfile(profileRes.data);
            setStore(storeRes.data);
        } catch (error) {
            console.error("DashboardContext load error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <DashboardContext.Provider value={{ user, profile, store, loading, refreshData: loadData }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
