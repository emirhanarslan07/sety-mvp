import { ProductType } from './revenue';

export interface PricingInput {
    currentPrice: number;
    productType: ProductType;
    estimatedSales: number;
}

export interface PricingOutput {
    currentPrice: number;
    marketAvg: number;
    recommended: number;
    priceDifference: number;
    potentialIncrease: number;
}

// Market average prices by product type
const MARKET_AVERAGES: Record<ProductType, number> = {
    digital: 67,
    subscription: 49,
    service: 150,
};

export function calculatePricingRecommendation(
    input: PricingInput
): PricingOutput {
    const { currentPrice, productType, estimatedSales } = input;

    // Get market average for this product type
    const marketAvg = MARKET_AVERAGES[productType];

    // Recommended price: 88% of market average (slight discount strategy)
    const recommended = Math.round(marketAvg * 0.88);

    // Calculate price difference
    const priceDifference = recommended - currentPrice;

    // Calculate potential revenue increase
    const potentialIncrease = priceDifference * estimatedSales;

    return {
        currentPrice,
        marketAvg,
        recommended,
        priceDifference,
        potentialIncrease,
    };
}
