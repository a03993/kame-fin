"use client";

export default function AccountsError({ error }: { error: Error }) {
    return (
        <div className="p-8 text-sm text-neutral-500">Failed to load accounts: {error.message}</div>
    );
}
