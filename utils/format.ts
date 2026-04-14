import { ACCOUNT_SUB_CATEGORY_LABELS } from "@/utils/constants";

export function formatAccountType(type: string): string {
    if (!ACCOUNT_SUB_CATEGORY_LABELS[type]) {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    return ACCOUNT_SUB_CATEGORY_LABELS[type];
}

/**
 * Formats a number as a currency string using the given ISO 4217 currency code.
 * e.g. formatCurrency(10000, "USD") → "$10,000"
 *      formatCurrency(10000, "TWD") → "NT$10,000"
 */
export function formatCurrency(value: number, currency: string): string {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    });

    return formatter.format(value);
}

/**
 * Formats a number as a signed currency string (+ for positive, - for negative).
 * e.g. formatSignedCurrency(1000, "TWD") → "+NT$1,000"
 *      formatSignedCurrency(-500, "TWD") → "-NT$500"
 *      formatSignedCurrency(0, "TWD")    → "NT$0"
 */
export function formatSignedCurrency(value: number, currency: string): string {
    const formatted = formatCurrency(Math.abs(value), currency);
    if (value > 0) return `+${formatted}`;
    if (value < 0) return `-${formatted}`;
    return formatted;
}

/**
 * Formats a "YYYY-MM-DD" date string to a human-readable label.
 * e.g. "2026-03-01" → "Mar 01 2026"
 */
export function formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}
