import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <h1 className="mb-4 text-5xl font-black text-neutral-900">
                    ka<span className="font-medium">me</span>
                </h1>
                <p className="mb-10 max-w-md text-lg text-neutral-500">
                    Track your net worth, investments, and savings — all in one place.
                </p>
                <Link
                    href="/overview"
                    className="rounded-xl bg-neutral-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                >
                    Get started
                </Link>
            </main>

            <footer className="py-6 text-center text-xs text-neutral-400">
                © {new Date().getFullYear()} Kame
            </footer>
        </div>
    );
}
