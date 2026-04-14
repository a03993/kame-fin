# Kame

A personal wealth tracking dashboard. Track financial accounts, balances over time, and net worth.

## Stack

- **Next.js 16** / React 19
- **Supabase** — database and auth
- **Tailwind v4** — styling
- **Recharts v3** — charts

## Getting Started

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Then install and run:

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
npm run format   # Prettier
```
