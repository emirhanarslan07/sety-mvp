export type ProductType = 'digital' | 'subscription' | 'service';
export type Country =
    | 'USA'
    | 'UK'
    | 'Germany'
    | 'France'
    | 'Turkey'
    | 'Brazil'
    | 'India'
    | 'Spain'
    | 'Other';

export interface RevenueInput {
    followers: number;
    engagementRate: number; // percentage (e.g., 3.5 for 3.5%)
    productPrice: number;
    productType: ProductType;
    country: Country;
}

export interface RevenueOutput {
    activeAudience: number;
    estimatedSales: number;
    monthlyRevenue: number;
    optimizedRevenue: number;
    conversionRate: string; // formatted as percentage
}

// Base conversion rates by product type
const CONVERSION_RATES: Record<ProductType, number> = {
    digital: 0.01, // 1%
    subscription: 0.007, // 0.7%
    service: 0.003, // 0.3%
};

// Country multipliers for purchasing power
const COUNTRY_MULTIPLIERS: Record<Country, number> = {
    USA: 1.2,
    UK: 1.1,
    Germany: 1.0,
    France: 1.0,
    Turkey: 0.8,
    Brazil: 0.7,
    India: 0.6,
    Spain: 0.9,
    Other: 1.0,
};

export function calculateRevenue(input: RevenueInput): RevenueOutput {
    const { followers, engagementRate, productPrice, productType, country } = input;

    // Step 1: Calculate active audience
    const activeAudience = Math.round(followers * (engagementRate / 100));

    // Step 2: Get base conversion rate
    const baseConversion = CONVERSION_RATES[productType];

    // Step 3: Apply country multiplier
    const countryMultiplier = COUNTRY_MULTIPLIERS[country];

    // Step 4: Calculate estimated sales
    const estimatedSales = Math.round(
        activeAudience * baseConversion * countryMultiplier
    );

    // Step 5: Calculate monthly revenue
    const monthlyRevenue = Math.round(estimatedSales * productPrice);

    // Step 6: Calculate optimized revenue (20% improvement potential)
    const optimizedRevenue = Math.round(monthlyRevenue * 1.2);

    // Format conversion rate as percentage
    const conversionRate = (baseConversion * 100).toFixed(2);

    return {
        activeAudience,
        estimatedSales,
        monthlyRevenue,
        optimizedRevenue,
        conversionRate,
    };
}
