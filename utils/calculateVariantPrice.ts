export function calculatePrice(params: {
    costPrice: number;
    profitMargin: number;
    ppn?: number;
    isPpnEnabled?: boolean;
}) {
    const { costPrice, profitMargin, ppn = 0, isPpnEnabled = false } = params;

    const basePrice = costPrice + (costPrice * profitMargin) / 100;

    if (isPpnEnabled && ppn > 0) {
        return basePrice + basePrice * ppn;
    }

    return basePrice;
}
