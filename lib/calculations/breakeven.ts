export interface BreakEvenInput {
    monthlyCosts: number;
    productPrice: number;
    estimatedSales: number;
    targetProfit: number;
}

export interface TimelineMonth {
    month: number;
    sales: number;
    revenue: number;
    profit: number;
    profitable: boolean;
}

export interface BreakEvenOutput {
    monthlyCosts: number;
    targetProfit: number;
    breakEvenSales: number;
    targetSales: number;
    monthsToTarget: number;
    timeline: TimelineMonth[];
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenOutput {
    const { monthlyCosts, productPrice, estimatedSales, targetProfit } = input;

    // Calculate sales needed to break even
    const breakEvenSales = Math.ceil(monthlyCosts / productPrice);

    // Calculate sales needed to reach target profit
    const targetSales = Math.ceil((monthlyCosts + targetProfit) / productPrice);

    // Calculate months needed to reach target
    const monthsToTarget =
        estimatedSales > 0 ? Math.ceil(targetSales / estimatedSales) : 12;

    // Generate timeline (max 6 months)
    const timeline: TimelineMonth[] = [];
    const maxMonths = Math.min(6, monthsToTarget);

    for (let month = 1; month <= maxMonths; month++) {
        const cumulativeSales = estimatedSales * month;
        const cumulativeRevenue = cumulativeSales * productPrice;
        const cumulativeCosts = monthlyCosts * month;
        const profit = cumulativeRevenue - cumulativeCosts;

        timeline.push({
            month,
            sales: cumulativeSales,
            revenue: cumulativeRevenue,
            profit,
            profitable: profit >= 0,
        });
    }

    return {
        monthlyCosts,
        targetProfit,
        breakEvenSales,
        targetSales,
        monthsToTarget,
        timeline,
    };
}
