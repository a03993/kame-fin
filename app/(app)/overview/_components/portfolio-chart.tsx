"use client";

import { useMemo } from "react";

import clsx from "clsx";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { formatAccountType, formatCurrency } from "@/utils/format";

import { type OverviewAccount } from "./types";

interface AccountSlice {
    id: string;
    name: string;
    subCategory: string;
    value: number;
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload: AccountSlice; value: number }[];
}) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm">
            {d.name} · {formatCurrency(d.value, "TWD")}
        </div>
    );
}

export function PortfolioChart({
    accounts,
    selectedAccount,
}: {
    accounts: OverviewAccount[];
    selectedAccount: OverviewAccount;
}) {
    const { accountSlices, subCategoryTotals, totalBalance } = useMemo(() => {
        const sorted = [...accounts].sort((a, b) => a.subCategory.localeCompare(b.subCategory));
        const accountSlices: AccountSlice[] = sorted.map((a) => ({
            id: a.id,
            name: a.name,
            subCategory: a.subCategory,
            value: a.balance,
        }));

        const subCategoryTotals = new Map<string, number>();
        for (const a of accounts) {
            subCategoryTotals.set(
                a.subCategory,
                (subCategoryTotals.get(a.subCategory) ?? 0) + a.balance
            );
        }

        const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
        return { accountSlices, subCategoryTotals, totalBalance };
    }, [accounts]);

    const selectedPercent =
        totalBalance > 0 ? ((selectedAccount.balance / totalBalance) * 100).toFixed(1) : "0.0";

    return (
        <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white px-5 py-4">
            <div className="mb-3">
                <h3 className="text-sm font-bold text-neutral-900">Portfolio</h3>
            </div>

            {accountSlices.length === 0 ? (
                <p className="py-16 text-center text-xs text-neutral-400">No data</p>
            ) : (
                <>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="relative">
                            <PieChart width={220} height={200}>
                                <Pie
                                    data={accountSlices}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={77}
                                    strokeWidth={0}
                                    dataKey="value"
                                >
                                    {accountSlices.map((entry) => (
                                        <Cell
                                            key={entry.id}
                                            fill={
                                                entry.id === selectedAccount.id
                                                    ? "var(--color-neutral-500)"
                                                    : "var(--color-neutral-200)"
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-neutral-900">
                                    {selectedPercent}%
                                </span>
                                <span className="mt-0.5 text-[10px] text-neutral-400">
                                    {selectedAccount.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                        {Array.from(subCategoryTotals.entries()).map(([sub, value]) => {
                            const isActive = sub === selectedAccount.subCategory;
                            const percent =
                                totalBalance > 0
                                    ? ((value / totalBalance) * 100).toFixed(1)
                                    : "0.0";
                            return (
                                <div key={sub} className="flex items-center gap-1.5">
                                    <span
                                        className={clsx("inline-block h-2.5 w-2.5 rounded-full", {
                                            "bg-neutral-500": isActive,
                                            "bg-neutral-200": !isActive,
                                        })}
                                    />
                                    <span
                                        className={clsx("text-xs", {
                                            "font-medium text-neutral-900": isActive,
                                            "text-neutral-500": !isActive,
                                        })}
                                    >
                                        {formatAccountType(sub)} {percent}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
