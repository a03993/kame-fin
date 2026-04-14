import Header from "./_components/header";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="flex-1 bg-neutral-50">{children}</div>
        </>
    );
}
