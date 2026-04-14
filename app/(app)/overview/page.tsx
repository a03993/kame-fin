import { computeAccountCard } from "@/utils/compute-account-card";
import { MONTH_LABELS } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";

import { OverviewDashboard } from "./_components/dashboard";
import { type MonthlyBalance } from "./_components/types";

export default async function OverviewPage() {
    const supabase = await createClient();

    const [
        { data: accountRows, error: accountsError },
        { data: valuationRows, error: valuationsError },
        { data: goalRows, error: goalError },
    ] = await Promise.all([
        supabase
            .from("accounts")
            .select("id, name, institution, category, sub_category, last_four_digits")
            .eq("is_active", true),
        supabase
            .from("valuations")
            .select("account_id, base_amount, cost, metadata, valuation_at, created_at")
            .order("valuation_at", { ascending: false })
            .order("created_at", { ascending: false }),
        supabase
            .from("goals")
            .select("target_amount")
            .eq("year", new Date().getFullYear())
            .single(),
    ]);

    if (accountsError) throw new Error(accountsError.message);
    if (valuationsError) throw new Error(valuationsError.message);
    if (goalError) throw new Error(goalError.message);

    const annualTarget = Number(goalRows.target_amount ?? 0);

    const now = new Date();
    const currentYear = String(now.getFullYear());

    // Track the latest and previous calendar-month valuations per account (for monthChange).
    const latestValuation = new Map<string, (typeof valuationRows)[number]>();
    const latestYmByAccount = new Map<string, string>();
    const prevMonthValuation = new Map<string, (typeof valuationRows)[number]>();

    // Track one snapshot per month per account for the current year (for charts).
    const processedMonths = new Set<string>();
    const monthlyBalanceMap = new Map<string, { ym: string; month: string; balance: number }[]>();

    for (const item of valuationRows) {
        const ym = item.valuation_at.slice(0, 7);

        if (!latestValuation.has(item.account_id)) {
            latestValuation.set(item.account_id, item);
            latestYmByAccount.set(item.account_id, ym);
        } else {
            // Find the calendar month immediately before the account's latest valuation month.
            const latestYm = latestYmByAccount.get(item.account_id)!;
            const [ly, lm] = latestYm.split("-").map(Number);
            const prevYm = `${lm === 1 ? ly - 1 : ly}-${String(lm === 1 ? 12 : lm - 1).padStart(2, "0")}`;
            if (ym === prevYm && !prevMonthValuation.has(item.account_id)) {
                prevMonthValuation.set(item.account_id, item);
            }
        }

        if (item.valuation_at.slice(0, 4) !== currentYear) {
            continue;
        }

        const key = item.account_id + "|" + ym;

        if (processedMonths.has(key)) {
            continue;
        }

        processedMonths.add(key);

        const monthIndex = Number(item.valuation_at.slice(5, 7)) - 1;
        const monthlyBalances = monthlyBalanceMap.get(item.account_id) ?? [];

        monthlyBalances.push({
            ym,
            month: MONTH_LABELS[monthIndex],
            balance: Number(item.base_amount),
        });
        monthlyBalanceMap.set(item.account_id, monthlyBalances);
    }

    // Sort each account's history ascending by month.
    const monthlyBalance: Record<string, MonthlyBalance[]> = {};

    for (const [id, item] of monthlyBalanceMap) {
        monthlyBalance[id] = item
            .sort((a, b) => a.ym.localeCompare(b.ym))
            .map(({ month, balance }) => ({ month, balance }));
    }

    const accounts = accountRows.map((item) => {
        const valuation = latestValuation.get(item.id);
        const prevValuation = prevMonthValuation.get(item.id);

        let monthChange = 0;

        if (valuation && prevValuation) {
            monthChange = Number(valuation.base_amount) - Number(prevValuation.base_amount);
        }

        return {
            ...computeAccountCard(item, valuation),
            monthChange,
        };
    });

    accounts.sort((a, b) => b.balance - a.balance);

    return (
        <OverviewDashboard
            accounts={accounts}
            monthlyBalance={monthlyBalance}
            annualTarget={annualTarget}
        />
    );
}
