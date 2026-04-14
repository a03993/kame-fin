# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js Version Warning

This project uses Next.js **16** with React 19 — significantly newer than most training data. APIs, conventions, and file structure **may differ** from what you know. Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm start        # Start production server (after build)
npm run lint     # ESLint (flat config, eslint-config-next)
npm run format   # Prettier (write)
```

No test framework is configured.

## Architecture

**Kame** is a personal wealth tracking dashboard. Users track financial accounts, balances over time, and net worth.

### Route Structure

The `app/(app)/` route group is the authenticated app shell — it wraps all pages with a sticky `<Header>` nav.

- `/` — landing page with login/signup (currently bypasses auth, links directly to `/overview`)
- `/overview` — full dashboard: card carousel, stats, charts (balance history, portfolio), balance changes, goal progress, monthly changes
- `/accounts` — grid of account cards showing balance, cost basis, return
- `/accounts/[id]` — per-account detail (planned, not yet implemented)

Pages follow a **Server Component → Client Component** split: `page.tsx` fetches data server-side and passes it as props to a `_components/` Client Component that handles interactivity.

### Data Layer

All DB access is done in **Server Components** via `utils/supabase/server.ts` (`createClient()`), which uses `@supabase/ssr` with Next.js cookies. There is no client-side Supabase utility or auth middleware yet. Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.

Key tables (no generated types — client is untyped, all column names are bare strings):

- `accounts` — `id, name, institution, category, sub_category, last_four_digits, is_active`. Queried with `.eq("is_active", true)` filter.
- `valuations` — `account_id, base_amount, cost, metadata (JSONB), valuation_at (YYYY-MM-DD), created_at`. Queried ordered `valuation_at DESC, created_at DESC`. `metadata.interest_rate` (decimal fraction) is used for cash accounts.
- `goals` — `year, target_amount`. Queried with `.eq("year", currentYear).single()`. Users set a goal before accessing `/overview`.

The `/overview` page fetches accounts + all valuations + goal in one `Promise.all`, then computes in JS:

- `monthChange` — diff between latest and previous calendar-month valuation per account
- `monthlyBalance` — `Record<accountId, MonthlyBalance[]>` for the current year (one entry per month, most recent valuation wins), used for charts. `MonthlyBalance = { month: string; balance: number }` is defined in `_components/types.ts` and shared across chart components.

### Overview Dashboard Components

`app/(app)/overview/_components/` — all Client Components (except `balance-changes-list.tsx` and `goal-progress.tsx`), driven by props from `page.tsx`:

- `dashboard.tsx` — layout owner; holds `index` state (selected card); RWD layout: `lg+` two-column `[3fr_7fr]` (carousel + right column with stats/charts), `md` stacked rows, mobile single column
- `card-carousel.tsx` — single BankCard with `<`/`>` nav; shows Balance, Type (subCategory), Last Updated; `lg+` vertical layout, `md` and below card+info side-by-side with nav buttons in header
- `account-stats.tsx` — stat grid (Total Balance, This Month, Accounts count, Goal target); **not** tied to selected card — shows all-account totals
- `balance-history-chart.tsx` — Recharts `AreaChart`; period selector (3M/6M/1Y); data = `monthlyBalance[selectedId]`
- `portfolio-chart.tsx` — Recharts `PieChart` donut; one slice per account, grouped by subCategory; selected account highlighted via opacity; center shows selected account's % of total; legend shows subCategory totals
- `balance-changes-list.tsx` — top-3 subCategories by `|monthChange|`; View all button when >3; not tied to selected card
- `goal-progress.tsx` — horizontal progress bar (pure CSS, no Recharts); shows current/target, remaining, monthly needed to reach goal by year end; reads `annualTarget` from `goals` table
- `monthly-changes-chart.tsx` — Recharts `BarChart`; bar height = monthly balance, label = month-over-month diff; tied to selected card
- `types.ts` — shared types for chart components (`MonthlyBalance`)

### Account Categories

`category` is a union type `"cash" | "invest" | "insurance"` (defined in `utils/types.ts` as `AccountCategory`). Each category renders different info:

- `cash` — Interest Rate (`metadata.interest_rate × 100`), Est. Monthly interest
- `invest` — Cost Basis, Return (profit + rate)
- `insurance` — planned, not yet implemented

Account type labels (e.g. `savings → "Savings"`) are in `ACCOUNT_SUB_CATEGORY_LABELS` in `utils/constants.ts`. `formatAccountType(type)` is in `utils/format.ts`.

### Charts

**Recharts** (v3) is the only chart library. All chart components require `"use client"`. Use `ResponsiveContainer` with `height="100%"` when the card uses `flex-1`/`h-full` to fill available space; use a fixed pixel height only for fixed-size cards.

For SVG fill colors in Recharts (which don't accept Tailwind classes), use Tailwind v4 CSS variables: `"var(--color-neutral-400)"` instead of hardcoded hex values.

### Card Style Conventions

All overview card components follow these standards:

- Card wrapper: `rounded-2xl border border-neutral-200 bg-white px-5 py-4`
- Title: `h3 text-sm font-bold text-neutral-900` with `mb-3`
- Label text: `text-xs text-neutral-400`
- Value text: `text-neutral-900`
- Chart axis ticks: `fontSize: 10, fill: "#a3a3a3"`
- Grid gaps: `gap-4` (outer), `gap-4` (inner)
- Chart label fontSize: `10` (unified across all charts)

### Currency

`formatCurrency(value, currency)` in `utils/format.ts` — `currency` is required, hardcoded as `"TWD"` at every call site. For chart axes, use compact formatters inline (e.g. `$1.5M`) rather than `formatCurrency` — the output is too long for axis ticks.

### Styling

**Tailwind v4** — no `tailwind.config.js`. All theme customization lives in `app/globals.css` via `@theme inline`.

Semantic color tokens (use these instead of raw Tailwind colors):

- `text-profit` — gains (maps to `red-500` — TWD convention: red = positive)
- `text-loss` — losses (maps to `lime-600` — TWD convention: green = negative)
- `text-warning` — stale data warnings (maps to `amber-500`)

### Utility Functions

- `utils/format.ts` — `formatCurrency(value, currency)`, `formatSignedCurrency(value, currency)` (prepends `+`/`-`), `formatDate(dateStr)` (expects `"YYYY-MM-DD"`, returns `"Mar 01, 2026"`), `formatAccountType(type)`
- `utils/types.ts` — `AccountCategory` type (`"cash" | "invest" | "insurance"`), `AccountSubCategory` type
- `utils/constants.ts` — `MONTH_LABELS`, `ACCOUNT_SUB_CATEGORY_LABELS`
- `utils/compute-account-card.ts` — `computeAccountCard(row, valuation)` transforms raw DB rows into the normalized account shape used by both `/overview` and `/accounts` pages

### Folder Conventions

- `lib/` — third-party service wrappers (Supabase, future: Stripe, Auth)
- `utils/` — pure functions (formatting, domain data)
- `components/ui/` — reusable UI primitives (`BankCard`, `AccountCard`)
- `components/branding/` — brand assets (logo)
- `components/icons/` — SVG icons as React components

### Icons

Two icon systems coexist:

- **SVG components** in `components/icons/` — imported directly as React components via `@svgr/webpack`. Do not include `width`/`height` attributes — control size via `className`. Use `fill="currentColor"` for color control via Tailwind text classes.
- **lucide-react** — used for generic UI icons (e.g. `ArrowUp`, `ArrowDown`, `ChevronLeft`). Size via `className` (e.g. `h-4 w-4`).

### Known Stubs / Hardcodes

- `holderName` is hardcoded as `"Tina Chiu"` at every `BankCard` call site — not yet driven by auth/user data.
- Card network is hardcoded as `"VISA"` in `BankCard`.
- Currency is hardcoded as `"TWD"` at every `formatCurrency` call site.
- Auth is not implemented — `/overview` is accessible without login.

### Path Aliases

`@/*` resolves to the repo root (configured in `tsconfig.json`).
