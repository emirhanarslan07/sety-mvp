import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import PublicStoreClient from '@/components/store/PublicStoreClient';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { isDemoStore, DENIZ_YILMAZ_STORE } from '@/lib/presets/denizyilmaz';

export const revalidate = 60;

interface Props {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

function getSupabaseClient() {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Ignored when called in Server Components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch {
                        // Ignored when called in Server Components
                    }
                },
            },
        }
    );
}

const getStoreData = cache(async (username: string) => {
    if (isDemoStore(username)) {
        return DENIZ_YILMAZ_STORE;
    }

    const supabase = getSupabaseClient();
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*, user_profiles(*), products(*)')
        .ilike('username', username)
        .single();

    if (storeError || !storeData) return null;

    // user_profiles is 1-to-1 based on user_id
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

    // Check profiles table if present for social fields and user info
    let profilesData: any = null;
    if (storeData.user_id) {
        try {
            const { data: pData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', storeData.user_id)
                .maybeSingle();
            profilesData = pData;
        } catch {
            // Fallback gracefully if profiles table is not used
        }
    }

    return {
        profile: {
            ...storeData,
            full_name: userProfile?.full_name || profilesData?.full_name,
            profile_image_url: userProfile?.profile_image_url || profilesData?.avatar_url || profilesData?.profile_image_url || storeData.store_logo_url,
            is_verified: userProfile?.is_verified ?? profilesData?.is_verified,
            payment_url: userProfile?.payment_url || storeData.payment_url,
            // Social channels from profiles table or store social_links
            twitter: profilesData?.twitter || storeData.social_links?.twitter || storeData.social_links?.x || '',
            instagram: profilesData?.instagram || storeData.social_links?.instagram || '',
            youtube: profilesData?.youtube || storeData.social_links?.youtube || '',
            globe: profilesData?.globe || profilesData?.website || storeData.social_links?.globe || storeData.social_links?.website || '',
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
            title: 'Store Not Found | Sety',
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

import { CreatorHubStorefront } from '@/components/store/CreatorHubStorefront';

export default async function Page({ params }: Props) {
    const data = await getStoreData(params.username);

    if (!data) {
        notFound();
    }

    if (isDemoStore(params.username)) {
        return <CreatorHubStorefront store={data.profile} />;
    }

    return (
        <PublicStoreClient
            initialProfile={data.profile}
            initialProducts={data.products}
        />
    );
}
