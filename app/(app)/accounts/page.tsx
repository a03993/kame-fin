import { computeAccountCard } from "@/utils/compute-account-card";
import { createClient } from "@/utils/supabase/server";

import { AccountsList } from "./_components/list";

export default async function AccountsPage() {
    const supabase = await createClient();

    const [
        { data: accountRows, error: accountsError },
        { data: valuations, error: valuationsError },
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
    ]);

    if (accountsError) throw new Error(accountsError.message);
    if (valuationsError) throw new Error(valuationsError.message);

    const latestValuationByAccount = new Map<string, (typeof valuations)[number]>();

    for (const item of valuations) {
        if (!latestValuationByAccount.has(item.account_id)) {
            latestValuationByAccount.set(item.account_id, item);
        }
    }

    const accounts = accountRows.map((row) => {
        const item = latestValuationByAccount.get(row.id);

        if (!item) {
            console.warn(`[AccountsPage] No valuation found for account ${row.id}`);
        }

        return computeAccountCard(row, item);
    });

    accounts.sort((a, b) => b.balance - a.balance);

    return <AccountsList accounts={accounts} />;
}
