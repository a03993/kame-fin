"use client";

import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";

import { formatCurrency, formatSignedCurrency } from "@/utils/format";

import { type OverviewAccount } from "./types";

interface StatCardProps {
    label: string;
    value: string;
    rate?: number;
}

function StatCard({ label, value, rate }: StatCardProps) {
    const hasRate = rate !== undefined && rate !== 0;
    const isPositive = (rate ?? 0) >= 0;

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5">
            <div className="mb-2 flex h-4 items-start justify-between gap-1">
                <p className="text-xs whitespace-nowrap text-neutral-400">{label}</p>
                {hasRate ? (
                    <div
                        className={clsx(
                            "flex items-center gap-0.5 text-xs font-medium whitespace-nowrap",
                            isPositive ? "text-profit" : "text-loss"
                        )}
                    >
                        {isPositive ? (
                            <ArrowUp className="h-3 w-3" />
                        ) : (
                            <ArrowDown className="h-3 w-3" />
                        )}
                        {Math.abs(rate! * 100).toFixed(1)}%
                    </div>
                ) : null}
            </div>
            <p className="text-base font-semibold whitespace-nowrap text-neutral-900">{value}</p>
        </div>
    );
}

export function AccountStats({
    accounts,
    annualTarget,
}: {
    accounts: OverviewAccount[];
    annualTarget: number;
}) {
    const totalBalance = accounts.reduce((sum, item) => sum + item.balance, 0);
    const totalMonthChange = accounts.reduce((sum, item) => sum + item.monthChange, 0);
    const monthChangeRate =
        totalMonthChange && totalBalance
            ? totalMonthChange / (totalBalance - totalMonthChange)
            : undefined;

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4">
            <StatCard label="Total Balance" value={formatCurrency(totalBalance, "TWD")} />
            <StatCard
                label="This Month"
                value={formatSignedCurrency(totalMonthChange, "TWD")}
                rate={monthChangeRate}
            />
            <StatCard label="Accounts" value={String(accounts.length)} />
            <StatCard label="Goal" value={formatCurrency(annualTarget, "TWD")} />
        </div>
    );
}
