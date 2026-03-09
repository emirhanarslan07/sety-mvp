import { supabase } from '@/lib/supabase/client';
import PublicStoreClient from '@/components/store/PublicStoreClient';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
    params: { username: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

async function getStoreData(username: string) {
    const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

    if (storeError || !storeData) return null;

    const { data: profileData } = await supabase
        .from('user_profiles')
        .select('full_name, profile_image_url, is_verified')
        .eq('user_id', storeData.user_id)
        .single();

    const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    return {
        profile: {
            ...storeData,
            full_name: profileData?.full_name,
            profile_image_url: profileData?.profile_image_url || storeData.store_logo_url,
            is_verified: profileData?.is_verified,
        },
        products: productsData || [],
    };
}

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
