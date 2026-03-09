import { ProductType } from './revenue';

export interface GoalInput {
    monthlyGoal: number;
    activeAudience: number;
    productType: ProductType;
    countryMultiplier: number;
}

export type Feasibility = 'Easy' | 'Possible' | 'Challenging';

export interface GoalOption {
    type: string;
    price: number;
    description: string;
    salesNeeded: number;
    feasibility: Feasibility;
}

// Conversion rates for feasibility calculation
const CONVERSION_RATES: Record<ProductType, number> = {
    digital: 0.01,
    subscription: 0.007,
    service: 0.003,
};

export function calculateGoalPaths(input: GoalInput): GoalOption[] {
    const { monthlyGoal, activeAudience, productType, countryMultiplier } = input;

    // Define pricing options
    const options = [
        {
            type: 'High-Ticket Product',
            price: 197,
            description: 'Premium course or coaching',
        },
        {
            type: 'Monthly Subscription',
            price: 49,
            description: 'Recurring membership',
        },
        {
            type: 'Digital Product',
            price: 29,
            description: 'E-book or template',
        },
    ];

    // Calculate sales needed and feasibility for each option
    const results: GoalOption[] = options.map((option) => {
        const salesNeeded = Math.ceil(monthlyGoal / option.price);

        // Calculate maximum possible sales (optimistic scenario: 2x normal conversion)
        const baseConversion = CONVERSION_RATES[productType];
        const maxPossibleSales =
            activeAudience * baseConversion * countryMultiplier * 2;

        // Determine feasibility
        let feasibility: Feasibility;
        if (salesNeeded <= maxPossibleSales / 2) {
            feasibility = 'Easy';
        } else if (salesNeeded <= maxPossibleSales) {
            feasibility = 'Possible';
        } else {
            feasibility = 'Challenging';
        }

        return {
            ...option,
            salesNeeded,
            feasibility,
        };
    });

    // Sort by feasibility (Easy first, then Possible, then Challenging)
    const feasibilityOrder: Record<Feasibility, number> = {
        Easy: 3,
        Possible: 2,
        Challenging: 1,
    };

    return results.sort(
        (a, b) => feasibilityOrder[b.feasibility] - feasibilityOrder[a.feasibility]
    );
}
