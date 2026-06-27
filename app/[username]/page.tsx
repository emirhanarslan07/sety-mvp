import { supabase } from '@/lib/supabase/client';
import PublicStoreClient from '@/components/store/PublicStoreClient';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { cache } from 'react';

export const revalidate = 60;

interface Props {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

const getStoreData = cache(async (username: string) => {
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*, user_profiles(*), products(*)')
        .ilike('username', username)
        .single();

    if (storeError || !storeData) return null;

    // Supabase will return arrays for joined tables, but user_profiles is 1-to-1 based on user_id usually.
    // products is a 1-to-many. Let's format the return properly.
    const userProfile = Array.isArray(storeData.user_profiles) ? storeData.user_profiles[0] : storeData.user_profiles;
    let products = Array.isArray(storeData.products) ? storeData.products : [];

    // Filter active products and sort them
    products = products
        .filter((p: any) => p.status === 'active')
        .sort((a: any, b: any) => {
            if (a.sort_order === b.sort_order) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return (a.sort_order || 0) - (b.sort_order || 0);
        });

    return {
        profile: {
            ...storeData,
            full_name: userProfile?.full_name,
            profile_image_url: userProfile?.profile_image_url || storeData.store_logo_url,
            is_verified: userProfile?.is_verified,
            payment_url: userProfile?.payment_url,
        },
        products: products,
    };
});

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const username = params.username;
    const data = await getStoreData(username);

    if (!data) {
        return {
            title: 'Mağaza Bulunamadı | Sety',
        };
    }

    const { profile } = data;
    const displayName = profile.display_name || profile.full_name || `@${profile.username}`;
    const bio = profile.bio || `${displayName}'s personal store on Sety.`;
    const image = profile.profile_image_url || '/og-image.png';

    return {
        title: `${displayName} | Sety`,
        description: bio,
        openGraph: {
            title: `${displayName} | Sety`,
            description: bio,
            images: [image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${displayName} | Sety`,
            description: bio,
            images: [image],
        },
    };
}

export default async function Page({ params }: Props) {
    const data = await getStoreData(params.username);

    if (!data) {
        notFound();
    }

    return (
        <PublicStoreClient
            initialProfile={data.profile}
            initialProducts={data.products}
        />
    );
}
