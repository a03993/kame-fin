import { ReactNode } from "react";

interface Props {
    institution: string;
    holderName: string;
    lastFourDigits: string | null;
    children?: ReactNode;
}

export function BankCard({ institution, holderName, lastFourDigits, children }: Props) {
    return (
        <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "1.586" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            <div className="absolute -right-10 -bottom-14 h-52 w-52 rounded-full bg-neutral-600/30" />
            <div className="absolute -right-4 -bottom-20 h-64 w-64 rounded-full bg-neutral-600/15" />

            <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                    <span className="text-xs text-neutral-400">{institution}</span>
                    <span className="text-sm font-extrabold tracking-widest text-white italic">
                        VISA
                    </span>
                </div>
                <div>
                    <p className="mb-0.5 text-xs text-neutral-400">{holderName}</p>
                    <p className="font-mono text-xs tracking-widest text-neutral-300">
                        XXXX - XXXX - XXXX - {lastFourDigits ?? "????"}
                    </p>
                </div>
            </div>

            {children}
        </div>
    );
}
