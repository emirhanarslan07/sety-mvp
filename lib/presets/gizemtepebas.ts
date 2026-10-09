export const GIZEM_TEPEBAS_STORE = {
    profile: {
        id: 'gizem-tepebas-store',
        user_id: 'gizem-tepebas-user',
        username: 'psikologgizemtepebas',
        display_name: 'Uzm. Klinik Psikolog Gizem Tepebaş',
        full_name: 'Uzm. Klinik Psikolog Gizem Tepebaş',
        bio: 'Çocuk, Ergen, Yetişkin & Çift Terapisi\n📍 Haydarbey Mah., Açıkgöz Plaza Kat:1 No:3, Kahramanmaraş\n🌍 Yüz Yüze & Online Seanslar',
        email: 'emirhanarslan896@gmail.com',
        profile_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        is_verified: true,
        announcement_text: 'Kahramanmaraş Klinik & Online Danışmanlık Randevuları Açık',
        security_badge_text: 'Talepleriniz Gizlilik & KVKK Kapsamında Korunur',
        social_links: {
            instagram: 'https://instagram.com/psikologgizemtepebas',
            whatsapp: 'https://wa.me/905069863046?text=Merhaba%20Gizem%20Hanım,%20seans%20bilgisi%20almak%20istiyorum.',
            phone: 'tel:05069863046',
            location: 'https://maps.google.com/?q=Açıkgöz+Plaza,+Haydarbey,+Kahramanmaraş',
            doktortakvimi: 'https://www.doktortakvimi.com/profil/gizem-tepebas-2',
            website: 'https://www.doktortakvimi.com/profil/gizem-tepebas-2',
        },
    },
    products: [
        {
            id: 'gizem-in-person',
            store_id: 'gizem-tepebas-store',
            type: 'coaching_call',
            title: 'Yüz Yüze Danışmanlık (Kahramanmaraş Klinik)',
            subtitle: 'Kahramanmaraş Açıkgöz Plaza kliniğinde yetişkin, çocuk-ergen ve çift terapisi seansları.',
            price: 0,
            currency: 'TRY',
            status: 'active',
            button_text: 'Randevu Talep Et',
            image_url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1200&auto=format&fit=crop',
            sort_order: 1,
            coaching_config: {
                duration_minutes: 50,
                allow_online: false,
                allow_in_person: true,
                default_mode: 'in_person',
                location_address: 'Haydarbey Mah., Açıkgöz Plaza Kat:1 No:3, Kahramanmaraş',
                hide_price: true,
                payment_mode: 'request_only',
                options: [
                    'Yetişkin Seansı (Bireysel Terapi)',
                    'Çocuk & Ergen Danışmanlığı',
                    'Çift ve Evlilik Terapisi'
                ],
                start_hour: 10,
                end_hour: 18,
                interval_minutes: 60
            }
        },
        {
            id: 'gizem-online',
            store_id: 'gizem-tepebas-store',
            type: 'coaching_call',
            title: 'Online Danışmanlık (Görüntülü Seans)',
            subtitle: 'Türkiye ve yurt dışı için Google Meet / Zoom üzerinden bireysel terapi ve danışmanlık.',
            price: 0,
            currency: 'TRY',
            status: 'active',
            button_text: 'Randevu Talep Et',
            image_url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop',
            sort_order: 2,
            coaching_config: {
                duration_minutes: 50,
                allow_online: true,
                allow_in_person: false,
                default_mode: 'online',
                location_address: 'Google Meet / Zoom Görüntülü Görüşme',
                hide_price: true,
                payment_mode: 'request_only',
                options: [
                    'Bireysel Yetişkin Terapisi',
                    'Online Ergen Danışmanlığı',
                    'Online Çift ve Evlilik Terapisi',
                    'Online Ön Görüşme & Değerlendirme'
                ],
                start_hour: 10,
                end_hour: 18,
                interval_minutes: 60
            }
        }
    ]
};

export const GIZEM_USERNAMES = [
    'psikologgizemtepebas',
    'psikolog-gizem-tepebas',
    'gizemtepebas',
    'psk.gizemtepebas',
    'pskgizemtepebas',
    'psk-gizemtepebas',
    'gizem-tepebas',
    'gizem_tepebas'
];

export function isGizemStore(username: string): boolean {
    const clean = username.toLowerCase().replace(/[^a-z0-9._-]/g, '');
    return GIZEM_USERNAMES.includes(clean);
}
