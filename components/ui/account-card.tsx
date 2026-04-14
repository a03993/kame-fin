import clsx from "clsx";
import { ArrowDown, ArrowUp } from "lucide-react";

import { formatAccountType, formatCurrency, formatSignedCurrency } from "@/utils/format";
import { type AccountCategory } from "@/utils/types";

import { BankCard } from "@/components/ui/bank-card";

export interface AccountCardProps {
    id: string;
    name: string;
    institution: string;
    category: AccountCategory;
    subCategory: string;
    lastFourDigits: string | null;
    balance: number;
    cost: number;
    profit: number;
    profitRate: number;
    interestRate: number;
    valuationAt: string;
}

export function AccountCard({ account }: { account: AccountCardProps }) {
    const isCash = account.category === "cash";
    const isInvest = account.category === "invest";

    return (
        <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-900">{account.name}</h2>

                <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500">
                    {formatAccountType(account.subCategory)}
                </span>
            </div>

            <div className="mb-3">
                <BankCard
                    institution={account.institution}
                    holderName="Tina Chiu"
                    lastFourDigits={account.lastFourDigits}
                />
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                <div className="mb-3">
                    <p className="mb-1 text-xs text-neutral-400">Balance</p>
                    <span className="text-xl font-semibold text-neutral-900">
                        {formatCurrency(account.balance, "TWD")}
                    </span>
                </div>

                {isCash && (
                    <div className="border-t border-neutral-100 pt-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="mb-0.5 text-xs text-neutral-400">Interest Rate</p>
                                <p className="text-sm font-medium text-neutral-700">
                                    {account.interestRate.toFixed(2)}%
                                </p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-xs text-neutral-400">Return</p>
                                {(() => {
                                    const monthlyReturn = Math.floor(
                                        (account.balance * account.interestRate) / 100 / 12
                                    );
                                    return (
                                        <p
                                            className={clsx("text-sm", {
                                                "text-neutral-700": monthlyReturn === 0,
                                                "text-profit font-medium": monthlyReturn > 0,
                                            })}
                                        >
                                            {formatSignedCurrency(monthlyReturn, "TWD")}
                                        </p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {isInvest && (
                    <div className="border-t border-neutral-100 pt-3">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400">Cost Basis</p>
                                <p className="text-sm font-medium text-neutral-700">
                                    {formatCurrency(account.cost, "TWD")}
                                </p>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs text-neutral-400">Return</p>

                                <div
                                    className={clsx("flex items-center gap-2 text-sm font-medium", {
                                        "text-neutral-700": account.profit === 0,
                                        "text-profit": account.profit > 0,
                                        "text-loss": account.profit < 0,
                                    })}
                                >
                                    <span>{formatSignedCurrency(account.profit, "TWD")}</span>
                                    <span className="flex items-center text-xs">
                                        {account.profitRate >= 0 ? (
                                            <ArrowUp className="h-3 w-3" />
                                        ) : (
                                            <ArrowDown className="h-3 w-3" />
                                        )}
                                        {Math.abs(account.profitRate * 100).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
