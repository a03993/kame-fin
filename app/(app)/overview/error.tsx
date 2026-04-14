"use client";

export default function OverviewError({ error }: { error: Error }) {
    return (
        <div className="p-8 text-sm text-neutral-500">Failed to load overview: {error.message}</div>
    );
}
