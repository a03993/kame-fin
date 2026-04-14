"use client";

import { useMemo, useState } from "react";

import clsx from "clsx";
import { CirclePlus } from "lucide-react";

import { formatAccountType, formatDate } from "@/utils/format";

import { AccountCard, type AccountCardProps } from "@/components/ui/account-card";

export function AccountsList({ accounts }: { accounts: AccountCardProps[] }) {
    const subCategories = [
        "All",
        ...Array.from(new Set(accounts.map((account) => account.subCategory))),
    ];
    const [active, setActive] = useState("All");

    const filtered = useMemo(() => {
        if (active === "All") {
            return accounts;
        }

        return accounts.filter((account) => account.subCategory === active);
    }, [active, accounts]);

    const latestValuationAt = useMemo(() => {
        return accounts
            .map((a) => a.valuationAt)
            .filter(Boolean)
            .reduce((a, b) => (a > b ? a : b), "");
    }, [accounts]);

    return (
        <main className="mx-auto max-w-5xl px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {subCategories.map((subCategory) => (
                        <button
                            key={subCategory}
                            onClick={() => setActive(subCategory)}
                            className={clsx(
                                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                {
                                    "bg-neutral-800 text-white": active === subCategory,
                                    "text-neutral-400 hover:text-neutral-600":
                                        active !== subCategory,
                                }
                            )}
                        >
                            {subCategory === "All" ? "All" : formatAccountType(subCategory)}
                        </button>
                    ))}
                </div>

                {latestValuationAt && (
                    <span className="text-xs text-neutral-400">
                        {formatDate(latestValuationAt)}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))}

                {active === "All" && (
                    <button className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-300 hover:text-neutral-500">
                        <CirclePlus className="h-5 w-5" />
                        <span className="text-sm">New Card</span>
                    </button>
                )}
            </div>
        </main>
    );
}
