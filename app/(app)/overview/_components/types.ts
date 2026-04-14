import { type AccountCardProps } from "@/components/ui/account-card";

export interface MonthlyBalance {
    month: string;
    balance: number;
}

export interface OverviewAccount extends AccountCardProps {
    monthChange: number;
}
