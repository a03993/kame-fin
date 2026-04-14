export const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
] as const;

export const ACCOUNT_SUB_CATEGORY_LABELS: Record<string, string> = {
    // Cash
    savings: "Savings",
    checking: "Checking",
    foreign: "Foreign",

    // Invest
    stock: "Stock",
    etf: "ETF",
    fund: "Fund",

    // Insurance
    life: "Life",
    annuity: "Annuity",
};
