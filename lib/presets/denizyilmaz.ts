export const DENIZ_YILMAZ_STORE = {
    profile: {
        id: 'deniz-yilmaz-store',
        user_id: 'deniz-yilmaz-user',
        username: 'denizyilmaz',
        display_name: 'Deniz Yılmaz',
        full_name: 'Deniz Yılmaz',
        bio: 'İçerik üreticisi & yaratıcı girişimci. Notion şablonları, dijital rehberler ve 1:1 mentörlük seansları.',
        email: 'deniz@sety.store',
        profile_image_url: '/creator-deniz.jpg',
        is_verified: true,
        announcement_text: '✨ Yeni: İçerik Planlama Kiti & 1:1 Mentörlük seansları yayında!',
        security_badge_text: 'Güvenli Ödeme · SSL & Lisanslı Dijital Teslimat',
        social_links: {
            instagram: 'https://instagram.com/deniz.yilmaz',
            youtube: 'https://youtube.com/@denizyilmaz',
            behance: 'https://behance.net/denizyilmaz',
            twitter: 'https://x.com/denizyilmaz',
            whatsapp: '905550000000',
            phone: '05550000000',
        },
    },
    products: [
        {
            id: 'deniz-mentorship',
            store_id: 'deniz-yilmaz-store',
            type: 'coaching_call',
            title: '1:1 Mentörlük & Marka Danışmanlığı',
            subtitle: 'Birebir 45 dakikalık online strateji seansı. Takipçilerini müşteriye dönüştür.',
            price: 1500,
            currency: 'TRY',
            status: 'active',
            button_text: 'Randevu Talep Et',
            image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop',
            sort_order: 1,
            coaching_config: {
                duration_minutes: 45,
                allow_online: true,
                allow_in_person: false,
                default_mode: 'online',
                location_address: 'Google Meet / Zoom Görüntülü Görüşme',
                payment_mode: 'request_only',
                options: [
                    'İçerik & Büyüme Stratejisi',
                    'Portföy & Tasarım İncelemesi',
                    'Dijital Ürün Yol Haritası',
                    'Birebir Soru - Cevap'
                ],
                start_hour: 11,
                end_hour: 19,
                interval_minutes: 60
            }
        },
        {
            id: 'deniz-content-kit',
            store_id: 'deniz-yilmaz-store',
            type: 'digital_product',
            title: 'İçerik Planlama Kiti (Notion + Canva)',
            subtitle: 'Bir aylık içerik üretimi tek sistemde. 30 hazır şablon, kanca listesi ve takvim.',
            price: 290,
            currency: 'TRY',
            status: 'active',
            button_text: 'Hemen İndir',
            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
            sort_order: 2,
        },
        {
            id: 'deniz-ebook',
            store_id: 'deniz-yilmaz-store',
            type: 'digital_product',
            title: 'Yaratıcının Yol Haritası (PDF E-Kitap)',
            subtitle: 'Fikirden ilk 10.000 TL kazanca giden adımlar. 48 sayfalık pratik rehber.',
            price: 190,
            currency: 'TRY',
            status: 'active',
            button_text: 'Kitabı Al',
            image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
            sort_order: 3,
        },
        {
            id: 'deniz-community',
            store_id: 'deniz-yilmaz-store',
            type: 'digital_product',
            title: 'Yaratıcı Girişimciler Topluluğu',
            subtitle: 'Özel Discord kanalı, haftalık canlı yayınlar ve üretici network ağı.',
            price: 99,
            currency: 'TRY',
            status: 'active',
            button_text: 'Topluluğa Katıl',
            image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
            sort_order: 4,
        }
    ]
};

export const DEMO_USERNAMES = [
    'denizyilmaz',
    'deniz-yilmaz',
    'deniz_yilmaz',
    'deniz',
    'psikologgizemtepebas',
    'psikolog-gizem-tepebas',
    'gizemtepebas',
    'psk.gizemtepebas',
    'pskgizemtepebas',
    'psk-gizemtepebas',
    'gizem-tepebas',
    'gizem_tepebas'
];

export function isDemoStore(username: string): boolean {
    const clean = username.toLowerCase().replace(/[^a-z0-9._-]/g, '');
    return DEMO_USERNAMES.includes(clean);
}
