import { supabase } from '@/lib/supabase/client';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
    const { data: store } = await supabase
        .from('stores')
        .select(`
            bio,
            user_id,
            user_profiles:user_id (
                full_name,
                profile_image_url
            )
        `)
        .eq('username', params.username.toLowerCase())
        .single();

    if (!store) return { title: 'Mağaza Bulunamadı | Sety' };
    const profile = Array.isArray(store.user_profiles) ? store.user_profiles[0] : store.user_profiles;
    const fullName = profile?.full_name || params.username;

    return {
        title: `${fullName} | Sety Store`,
        description: store.bio || `${fullName} tarafından küratörlüğü yapılmış özel dijital ürünler.`,
        openGraph: {
            title: `${fullName} (@${params.username})`,
            description: store.bio,
            images: [profile?.profile_image_url || '/og-default.png'],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${fullName} | Sety Store`,
            description: store.bio,
            images: [profile?.profile_image_url || '/og-default.png'],
        }
    };
}

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
