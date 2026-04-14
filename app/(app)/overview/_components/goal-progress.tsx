import { formatCurrency } from "@/utils/format";

function compact(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return String(v);
}

export function GoalProgress({
    annualTarget,
    totalBalance,
}: {
    annualTarget: number;
    totalBalance: number;
}) {
    if (annualTarget === 0) {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-4">
                <h3 className="text-sm font-bold text-neutral-900">Goal</h3>
                <p className="py-4 text-center text-xs text-neutral-400">No goal set</p>
            </div>
        );
    }

    const progress = Math.min(totalBalance / annualTarget, 1);
    const percent = Math.round(progress * 100);
    const remaining = Math.max(annualTarget - totalBalance, 0);

    // 今年剩餘月份（含當月）
    const monthsLeft = 12 - new Date().getMonth();
    const monthlyNeeded = remaining > 0 && monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : 0;

    return (
        <div className="flex h-full flex-col gap-6 rounded-2xl border border-neutral-200 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900">Goal</h3>
                <span className="text-xs font-medium text-neutral-400">{percent}%</span>
            </div>

            <div className="flex flex-1 items-center">
                <div className="flex w-full items-center gap-2">
                    <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-neutral-100">
                        <div
                            className="absolute inset-y-0 left-0 flex items-center justify-center rounded-full bg-neutral-500 transition-all duration-500"
                            style={{ width: `${Math.max(percent, 8)}%` }}
                        >
                            <span className="truncate px-2 text-[10px] font-semibold text-white">
                                {compact(totalBalance)}
                            </span>
                        </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-neutral-400">
                        {compact(annualTarget)}
                    </span>
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Remaining</span>
                    <span className="font-medium text-neutral-900">
                        {remaining > 0 ? formatCurrency(remaining, "TWD") : "Achieved!"}
                    </span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Monthly needed</span>
                    <span className="font-medium text-neutral-900">
                        {monthlyNeeded > 0 ? formatCurrency(monthlyNeeded, "TWD") : "—"}
                    </span>
                </div>
            </div>
        </div>
    );
}
