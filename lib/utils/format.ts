/**
 * Currency and Number Formatting Utilities for Sety Global
 */

export const formatCurrency = (
    amount: number,
    currency: string = 'USD'
) => {
    // Toplam Gelir ve diğer para birimleri için her zaman 2 basamak göster (0.00$ gibi)
    const formattedAmount = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    const symbols: { [key: string]: string } = {
        'TRY': '₺',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
    };

    const symbol = symbols[currency] || currency;

    // Kullanıcının istediği temiz format: 100.00$
    return `${formattedAmount}${symbol}`;
};

export const formatCompactNumber = (number: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(number);
};

export const formatPercent = (number: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(number / 100);
};
