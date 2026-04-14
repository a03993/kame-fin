"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { MONTH_LABELS } from "@/utils/constants";

import { type MonthlyBalance } from "./types";

type Period = "3M" | "6M" | "1Y";

const PERIOD_MONTHS: Record<Period, number> = { "3M": 3, "6M": 6, "1Y": 12 };
const ALL_PERIODS: Period[] = ["3M", "6M", "1Y"];

function isPeriodEnabled(period: Period, dataMonthCount: number): boolean {
    if (period === "6M") return dataMonthCount > 3;
    if (period === "1Y") return dataMonthCount > 6;
    return true;
}

function compactValue(value: number): string {
    if (value === 0) return "$0";
    const abs = Math.abs(value);
    if (abs >= 1_000_000) {
        const m = value / 1_000_000;
        return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
    }
    if (abs >= 1_000) {
        const k = value / 1_000;
        return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
}

function tooltipValue(value: number): string {
    if (value === 0) return "$0";
    const abs = Math.abs(value);
    if (abs >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (abs >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { dataKey: string; value: number | null }[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    const entry = payload.find((p) => p.dataKey === "total" && p.value != null);
    if (!entry) return null;

    return (
        <div className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-sm">
            {label} · {tooltipValue(entry.value!)}
        </div>
    );
}

export function BalanceHistoryChart({ monthlyBalance }: { monthlyBalance: MonthlyBalance[] }) {
    const [period, setPeriod] = useState<Period>("3M");

    // 以有資料的最新月份為終點，往前推 N 個月
    const chartData = useMemo(() => {
        const count = PERIOD_MONTHS[period];

        const dataMap = new Map<string, number>();
        for (const d of monthlyBalance) {
            dataMap.set(d.month, d.balance);
        }

        // 找有資料的最新月份（monthlyBalance 已升冪排列，取最後一筆）
        const latestMonth = monthlyBalance.at(-1)?.month;
        const endIndex = latestMonth
            ? MONTH_LABELS.indexOf(latestMonth as (typeof MONTH_LABELS)[number])
            : new Date().getMonth();

        const months: string[] = [];
        for (let i = count - 1; i >= 0; i--) {
            const m = endIndex - i;
            if (m >= 0) {
                months.push(MONTH_LABELS[m]);
            }
        }

        return months.map((month) => ({
            month,
            total: dataMap.get(month) ?? null,
        }));
    }, [monthlyBalance, period]);

    return (
        <div className="flex h-72 flex-col rounded-2xl border border-neutral-200 bg-white px-5 py-4 md:h-full">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Balance History</h3>
                <div className="flex gap-1">
                    {ALL_PERIODS.map((p) => {
                        const enabled = isPeriodEnabled(p, monthlyBalance.length);
                        return (
                            <button
                                key={p}
                                onClick={() => enabled && setPeriod(p)}
                                disabled={!enabled}
                                className={clsx(
                                    "rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                                    p === period && enabled
                                        ? "bg-neutral-800 text-white"
                                        : enabled
                                          ? "text-neutral-400 hover:text-neutral-600"
                                          : "cursor-not-allowed text-neutral-200"
                                )}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            {monthlyBalance.length === 0 ? (
                <p className="py-16 text-center text-xs text-neutral-400">No data</p>
            ) : (
                <div className="min-h-0 flex-1">
                    <div className="h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 12, right: 12, left: 8, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(115,115,115,0.3)" />
                                        <stop offset="100%" stopColor="rgba(115,115,115,0)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={true}
                                    horizontal={false}
                                    stroke="#e5e5e5"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a3a3a3" }}
                                    interval={0}
                                />
                                <YAxis
                                    tickFormatter={compactValue}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#a3a3a3" }}
                                    width={30}
                                    domain={[0, "auto"]}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: "#d4d4d4", strokeWidth: 1 }}
                                />
                                <Area
                                    type="natural"
                                    dataKey="total"
                                    stroke="#737373"
                                    strokeWidth={2}
                                    fill="url(#areaGradient)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: "#737373", strokeWidth: 0 }}
                                    connectNulls
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
