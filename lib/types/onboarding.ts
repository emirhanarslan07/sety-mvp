export interface OnboardingData {
    // Step 1: Basics
    niche: string;
    platform: string;

    // Step 2: Audience
    followers: number;
    engagementRate: number;
    country: string;

    // Step 3: Product
    productType: string;
    productPrice: number;
    monthlyGoal: number | null;
}

export const PLATFORMS = [
    'Instagram',
    'TikTok',
    'YouTube',
    'LinkedIn',
    'X',
    'WhatsApp',
    'Diğer',
] as const;

export const COUNTRIES = [
    'Türkiye',
    'ABD',
    'Birleşik Krallık',
    'Almanya',
    'Fransa',
    'Diğer',
] as const;

export const PRODUCT_TYPES = [
    { value: 'e-posta_topla', label: 'E-posta Topla', icon: '📧' },
    { value: 'dijital_ürün', label: 'Dijital Ürün', icon: '📦' },
    { value: 'danışmanlık_randevusu', label: 'Danışmanlık', icon: '🤝' },
    { value: 'özel_talep_/_servis', label: 'Özel Servis', icon: '✨' },
    { value: 'harici_link_/_medya', label: 'Harici Link', icon: '🔗' },
] as const;
