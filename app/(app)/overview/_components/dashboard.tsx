"use client";

import { useState } from "react";

import { AccountStats } from "./account-stats";
import { BalanceChangeList } from "./balance-changes-list";
import { BalanceHistoryChart } from "./balance-history-chart";
import { CardCarousel } from "./card-carousel";
import { GoalProgress } from "./goal-progress";
import { MonthlyBalanceChart } from "./monthly-changes-chart";
import { PortfolioChart } from "./portfolio-chart";
import { type OverviewAccount } from "./types";
import { type MonthlyBalance } from "./types";

interface Props {
    accounts: OverviewAccount[];
    monthlyBalance: Record<string, MonthlyBalance[]>;
    annualTarget: number;
}

export function OverviewDashboard({ accounts, monthlyBalance, annualTarget }: Props) {
    const [index, setIndex] = useState(0);

    if (!accounts.length) {
        return (
            <main className="mx-auto max-w-5xl px-6 py-4">
                <p className="text-sm text-neutral-400">
                    No accounts yet. Add your first account to get started.
                </p>
            </main>
        );
    }

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <main className="mx-auto max-w-5xl px-6 py-4">
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[3fr_7fr]">
                <CardCarousel accounts={accounts} index={index} onIndexChange={setIndex} />

                <div className="flex flex-col gap-4">
                    <AccountStats accounts={accounts} annualTarget={annualTarget} />

                    <div className="hidden min-h-0 flex-1 grid-cols-[3fr_2fr] gap-4 lg:grid">
                        <BalanceHistoryChart
                            monthlyBalance={monthlyBalance[accounts[index].id] ?? []}
                        />
                        <PortfolioChart accounts={accounts} selectedAccount={accounts[index]} />
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr] lg:hidden">
                <BalanceHistoryChart monthlyBalance={monthlyBalance[accounts[index].id] ?? []} />
                <PortfolioChart accounts={accounts} selectedAccount={accounts[index]} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <GoalProgress annualTarget={annualTarget} totalBalance={totalBalance} />
                <BalanceChangeList accounts={accounts} />
                <MonthlyBalanceChart
                    monthlyBalance={monthlyBalance[accounts[index].id] ?? []}
                    className="order-first md:order-last"
                />
            </div>
        </main>
    );
}
