export const EMMA_CARTER_STORE = {
    profile: {
        id: 'emma-carter-store',
        user_id: 'emma-carter-user',
        username: 'emma',
        display_name: 'Emma Carter',
        full_name: 'Emma Carter',
        bio: 'Digital creator & creative entrepreneur. Notion systems, design frameworks, and 1:1 strategy calls.',
        email: 'emma@sety.store',
        profile_image_url: '/creator-deniz.jpg',
        is_verified: true,
        announcement_text: '✨ New: Content Planning OS & 1:1 Strategy calls are now live!',
        security_badge_text: 'Secure Checkout · SSL Encrypted & Instant Digital Delivery',
        social_links: {
            instagram: 'https://instagram.com/emmacarter',
            youtube: 'https://youtube.com/@emmacarter',
            behance: 'https://behance.net/emmacarter',
            twitter: 'https://x.com/emmacarter',
            whatsapp: '15550192834',
            phone: '15550192834',
        },
    },
    products: [
        {
            id: 'emma-mentorship',
            store_id: 'emma-carter-store',
            type: 'coaching_call',
            title: '1:1 Mentorship & Brand Strategy',
            subtitle: 'Direct 45-minute online video call. Turn your audience into loyal paying clients.',
            price: 75,
            currency: 'USD',
            status: 'active',
            button_text: 'Book Session',
            image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop',
            sort_order: 1,
            coaching_config: {
                duration_minutes: 45,
                allow_online: true,
                allow_in_person: false,
                default_mode: 'online',
                location_address: 'Google Meet / Zoom Video Call',
                payment_mode: 'request_only',
                options: [
                    'Content & Growth Strategy',
                    'Portfolio & Design Review',
                    'Digital Product Roadmap',
                    'Direct 1:1 Q&A'
                ],
                start_hour: 10,
                end_hour: 18,
                interval_minutes: 60
            }
        },
        {
            id: 'emma-content-kit',
            store_id: 'emma-carter-store',
            type: 'digital_product',
            title: 'Content Planning OS (Notion + Canva)',
            subtitle: 'One month of content in one simple system. 30 ready-to-use templates, hook vault & calendar.',
            price: 19,
            currency: 'USD',
            status: 'active',
            button_text: 'Download Now',
            image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
            sort_order: 2,
        },
        {
            id: 'emma-ebook',
            store_id: 'emma-carter-store',
            type: 'digital_product',
            title: 'The Creator\'s Roadmap (PDF Guide)',
            subtitle: 'From zero to your first $1,000 online. A 48-page actionable handbook.',
            price: 12,
            currency: 'USD',
            status: 'active',
            button_text: 'Get Guide',
            image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
            sort_order: 3,
        },
        {
            id: 'emma-community',
            store_id: 'emma-carter-store',
            type: 'digital_product',
            title: 'Creative Founders Circle',
            subtitle: 'Private Discord community, weekly live coaching sessions, and peer creator network.',
            price: 9,
            currency: 'USD',
            status: 'active',
            button_text: 'Join Circle',
            image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
            sort_order: 4,
        }
    ]
};

// Aliases kept for backwards compatibility
export const DENIZ_YILMAZ_STORE = EMMA_CARTER_STORE;

export const DEMO_USERNAMES = [
    'emma',
    'emmacarter',
    'emma-carter',
    'emma_carter',
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
