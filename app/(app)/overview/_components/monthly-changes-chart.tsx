"use client";

import clsx from "clsx";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import { type MonthlyBalance } from "./types";

const BAR_COLOR = "#d4d4d4";
const LABEL_COLOR = "#737373";

function compactValue(v: number): string {
    const abs = Math.abs(v);
    const sign = v >= 0 ? "+" : "";
    if (abs >= 1_000_000) return `${sign}${(v / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}${(v / 1_000).toFixed(0)}K`;
    return `${sign}${v}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLabel(props: any) {
    const { x, y, width, value } = props;
    if (value == null || isNaN(x) || isNaN(y)) return null;
    return (
        <text
            x={x + width / 2}
            y={y - 6}
            textAnchor="middle"
            fontSize={10}
            fill={LABEL_COLOR}
            fontWeight={500}
        >
            {compactValue(value)}
        </text>
    );
}

export function MonthlyBalanceChart({
    monthlyBalance,
    className,
}: {
    monthlyBalance: MonthlyBalance[];
    className?: string;
}) {
    const chartData = monthlyBalance.map((d, i) => ({
        month: d.month,
        balance: d.balance,
        change: i === 0 ? null : d.balance - monthlyBalance[i - 1].balance,
    }));

    return (
        <div
            className={clsx("rounded-2xl border border-neutral-200 bg-white px-5 py-4", className)}
        >
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Monthly Changes</h3>
            </div>

            {chartData.length === 0 ? (
                <p className="py-12 text-center text-xs text-neutral-400">No data</p>
            ) : (
                <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={chartData} margin={{ top: 20, right: 4, left: 4, bottom: -12 }}>
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            horizontal={true}
                            stroke="#e5e5e5"
                        />
                        <YAxis hide={true} tickCount={4} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#a3a3a3" }}
                            interval={0}
                        />
                        <Bar
                            dataKey="balance"
                            fill={BAR_COLOR}
                            maxBarSize={28}
                            radius={[4, 4, 0, 0]}
                        >
                            <LabelList dataKey="change" content={renderLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
