import { type AccountCategory } from "@/utils/types";

interface accountProps {
    id: string;
    name: string;
    institution: string;
    category: AccountCategory;
    sub_category: string;
    last_four_digits: string;
}

interface ValuationProps {
    base_amount: number;
    cost: number;
    metadata: { interest_rate?: number };
    valuation_at: string;
}

export function computeAccountCard(account: accountProps, valuation: ValuationProps | undefined) {
    const balance = valuation ? Number(valuation.base_amount) : 0;
    const cost = valuation?.cost ? Number(valuation.cost) : 0;
    const profit = cost ? balance - cost : 0;
    const profitRate = cost ? profit / cost : 0;
    const interestRate = valuation?.metadata?.interest_rate
        ? valuation.metadata.interest_rate * 100
        : 0;

    return {
        id: account.id,
        name: account.name,
        institution: account.institution,
        category: account.category,
        subCategory: account.sub_category,
        lastFourDigits: account.last_four_digits,
        balance,
        cost,
        profit,
        profitRate,
        interestRate,
        valuationAt: valuation?.valuation_at ?? "",
    };
}
