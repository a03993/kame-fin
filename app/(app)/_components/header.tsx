"use client";

import { usePathname, useRouter } from "next/navigation";

import clsx from "clsx";

import Logo from "@/components/branding/logo.svg";
import AccountsIcon from "@/components/icons/accounts.svg";
import OverviewIcon from "@/components/icons/overview.svg";

const navItems = [
    { href: "/overview", label: "Overview", Icon: OverviewIcon },
    { href: "/accounts", label: "Accounts", Icon: AccountsIcon },
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <header className="border-b border-neutral-200 bg-white">
            <div className="flex items-center gap-5 px-12 py-4">
                <button
                    onClick={() => router.push("/")}
                    className="flex shrink-0 items-center gap-2"
                >
                    <Logo className="w-6 text-neutral-800" />
                    <div className="text-xl text-neutral-800">
                        <span className="font-black">ka</span>
                        <span className="font-medium">me</span>
                    </div>
                </button>

                <nav className="flex items-center gap-5">
                    {navItems.map(({ href, label, Icon }) => (
                        <button
                            key={href}
                            onClick={() => router.push(href)}
                            className={clsx(
                                "flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                                {
                                    "bg-neutral-50 text-neutral-700": pathname === href,
                                    "text-neutral-300 hover:bg-neutral-50 hover:text-neutral-500 active:bg-neutral-50 active:text-neutral-700":
                                        pathname !== href,
                                }
                            )}
                        >
                            <Icon className="h-5 w-5 text-current" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}
