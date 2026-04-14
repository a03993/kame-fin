import { type ElementType } from "react";

import clsx from "clsx";
import { CreditCard, Shield, TrendingUp, Wallet } from "lucide-react";

import { formatAccountType, formatCurrency, formatDate } from "@/utils/format";

import { type OverviewAccount } from "./types";

const CATEGORY_ICON: Record<string, ElementType> = {
    cash: CreditCard,
    invest: TrendingUp,
    insurance: Shield,
};

interface SubCategoryRow {
    subCategory: string;
    category: string;
    monthChange: number;
    valuationAt: string;
}

export function BalanceChangeList({ accounts }: { accounts: OverviewAccount[] }) {
    const rowMap = new Map<string, SubCategoryRow>();

    for (const account of accounts) {
        const existing = rowMap.get(account.subCategory);
        if (!existing) {
            rowMap.set(account.subCategory, {
                subCategory: account.subCategory,
                category: account.category,
                monthChange: account.monthChange,
                valuationAt: account.valuationAt,
            });
        } else {
            rowMap.set(account.subCategory, {
                ...existing,
                monthChange: existing.monthChange + account.monthChange,
                valuationAt:
                    account.valuationAt > existing.valuationAt
                        ? account.valuationAt
                        : existing.valuationAt,
            });
        }
    }

    const allRows = Array.from(rowMap.values()).sort(
        (a, b) => Math.abs(b.monthChange) - Math.abs(a.monthChange)
    );
    const rows = allRows.slice(0, 3);
    const hasMore = allRows.length > 3;

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Changes</h3>
                {hasMore && (
                    <button className="text-xs text-neutral-400 transition-colors hover:text-neutral-600">
                        View all
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {rows.map((row) => {
                    const Icon = CATEGORY_ICON[row.category] ?? Wallet;
                    const isPositive = row.monthChange > 0;
                    const isNegative = row.monthChange < 0;

                    return (
                        <div key={row.subCategory} className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                                <Icon className="h-4 w-4 text-neutral-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm leading-tight font-semibold text-neutral-900">
                                    {formatAccountType(row.subCategory)}
                                </p>
                                <p className="text-xs text-neutral-400">
                                    {row.valuationAt ? formatDate(row.valuationAt) : "—"}
                                </p>
                            </div>
                            <span
                                className={clsx(
                                    "text-sm font-medium tabular-nums",
                                    isPositive
                                        ? "text-profit"
                                        : isNegative
                                          ? "text-loss"
                                          : "text-neutral-500"
                                )}
                            >
                                {row.monthChange !== 0
                                    ? `${isPositive ? "+" : ""}${formatCurrency(row.monthChange, "TWD")}`
                                    : "—"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
