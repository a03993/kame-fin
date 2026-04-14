"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatAccountType, formatCurrency, formatDate } from "@/utils/format";

import { BankCard } from "@/components/ui/bank-card";

import { type OverviewAccount } from "./types";

interface Props {
    accounts: OverviewAccount[];
    index: number;
    onIndexChange: (index: number) => void;
}

export function CardCarousel({ accounts, index, onIndexChange }: Props) {
    const account = accounts[index];

    return (
        <div className="flex h-full flex-col">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Card</h3>
                <div className="flex gap-2 lg:hidden">
                    <button
                        onClick={() =>
                            onIndexChange((index - 1 + accounts.length) % accounts.length)
                        }
                        className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-1.5 transition-colors hover:bg-neutral-50"
                    >
                        <ChevronLeft className="h-4 w-4 text-neutral-500" />
                    </button>
                    <button
                        onClick={() => onIndexChange((index + 1) % accounts.length)}
                        className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white p-1.5 transition-colors hover:bg-neutral-50"
                    >
                        <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 lg:flex-col">
                <div className="flex flex-1 flex-row gap-3 lg:flex-col">
                    <div className="w-30 md:w-auto">
                        <BankCard
                            institution={account.institution}
                            holderName="Tina Chiu"
                            lastFourDigits={account.lastFourDigits}
                        />
                    </div>

                    <div className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                        <div className="mb-3">
                            <p className="mb-1 text-xs text-neutral-400">Balance</p>
                            <p className="text-xl font-semibold text-neutral-900">
                                {formatCurrency(account.balance, "TWD")}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3">
                            <div>
                                <p className="mb-0.5 text-xs text-neutral-400">Type</p>
                                <p className="text-sm text-neutral-900">
                                    {formatAccountType(account.subCategory)}
                                </p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-xs text-neutral-400">Last Updated</p>
                                <p className="text-sm text-neutral-900">
                                    {account.valuationAt ? formatDate(account.valuationAt) : "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 hidden gap-3 lg:flex">
                <button
                    onClick={() => onIndexChange((index - 1 + accounts.length) % accounts.length)}
                    className="flex flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white py-2 transition-colors hover:bg-neutral-50"
                >
                    <ChevronLeft className="h-5 w-5 text-neutral-500" />
                </button>
                <button
                    onClick={() => onIndexChange((index + 1) % accounts.length)}
                    className="flex flex-1 items-center justify-center rounded-2xl border border-neutral-200 bg-white py-2 transition-colors hover:bg-neutral-50"
                >
                    <ChevronRight className="h-5 w-5 text-neutral-500" />
                </button>
            </div>
        </div>
    );
}
