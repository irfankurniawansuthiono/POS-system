export const formatNumber = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const raw = String(value).replace(/\D/g, "");

    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    return cleaned === "" ? 0 : Number(cleaned);
};
