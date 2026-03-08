# Development Guide — Scrappy Frontend

Setup and run instructions for the Scrappy Next.js frontend.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Auth | Auth0 (`@auth0/nextjs-auth0`) |
| Payments | Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`) |
| HTTP | native `fetch` via `lib/api/` |
| Testing | Jest + React Testing Library |
| E2E | Playwright |
| Deploy | Vercel |

---

## Prerequisites

- Node.js 22+
- npm 10+

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (e.g. `https://api.scrappy.io` or `http://localhost:8000`) |
| `AUTH0_SECRET` | Yes | Random 32-byte secret for session encryption — `openssl rand -hex 32` |
| `AUTH0_BASE_URL` | Yes | Frontend URL (e.g. `http://localhost:3000`) |
| `AUTH0_ISSUER_BASE_URL` | Yes | Auth0 tenant URL (e.g. `https://your-tenant.us.auth0.com`) |
| `AUTH0_CLIENT_ID` | Yes | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Yes | Auth0 application client secret |
| `AUTH0_AUDIENCE` | Yes | Auth0 API audience (e.g. `https://api.scrappy.io`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (`pk_test_...` or `pk_live_...`) |

> Never commit `.env.local` to version control.

### 3. Run locally

```bash
npm run dev
```

- App: `http://localhost:3000`
- Auth callback route: `http://localhost:3000/api/auth/callback` (handled by `@auth0/nextjs-auth0`)

---

## Auth0 Setup (local dev)

The frontend uses `@auth0/nextjs-auth0`. The SDK automatically handles:
- `/api/auth/login` — initiates login
- `/api/auth/logout` — clears session
- `/api/auth/callback` — exchanges code for tokens
- `/api/auth/me` — returns session user (client-side)

After login, the SDK provides the user's `accessToken` (Auth0 JWT) which must be sent as `Authorization: Bearer {token}` to the backend API.

**Important**: After the Auth0 callback, call `POST /auth/sync` on the backend to register the user in the Scrappy DB (SCRUM-25).

---

## Project Structure

```
scrappy-frontend/
├── app/
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home → redirects to /offers
│   ├── globals.css
│   ├── api/
│   │   └── auth/[auth0]/route.ts    # Auth0 SDK catch-all route handler
│   ├── auth/
│   │   └── callback/page.tsx        # POST /auth/sync + redirect (SCRUM-25)
│   ├── offers/
│   │   ├── page.tsx                 # Catalog of active offers (SCRUM-27)
│   │   └── [id]/page.tsx            # Offer detail + order form (SCRUM-29)
│   ├── checkout/
│   │   └── [order_id]/page.tsx      # Stripe payment form (SCRUM-30)
│   ├── orders/
│   │   ├── [id]/
│   │   │   ├── confirmation/page.tsx # Post-payment confirmation (SCRUM-31)
│   │   │   └── page.tsx             # Order detail + polling + download (SCRUM-33)
│   │   └── page.tsx                 # Order history (SCRUM-32)
│   └── admin/
│       ├── layout.tsx               # Admin layout + X-Admin-Key gate (SCRUM-35)
│       ├── offers/
│       │   ├── page.tsx             # Offers list (SCRUM-39)
│       │   └── [id]/page.tsx        # Edit offer (SCRUM-38)
│       ├── pricing/page.tsx         # Zone pricing table (SCRUM-43)
│       └── scraping-jobs/
│           ├── page.tsx             # Jobs list + polling (SCRUM-37)
│           └── new/page.tsx         # Trigger job form (SCRUM-36)
├── components/
│   ├── ui/                          # Button, Input, Card, Badge, Spinner...
│   ├── offers/
│   │   └── OfferCard.tsx            # SCRUM-28
│   ├── orders/
│   │   ├── DownloadButton.tsx       # SCRUM-34
│   │   └── OrderStatusBadge.tsx
│   └── admin/
│       └── PricingTable.tsx         # SCRUM-43
├── hooks/
│   ├── usePolling.ts                # Generic polling hook (used in order detail + jobs list)
│   └── useAuth.ts                   # Wraps Auth0 session + access token
├── lib/
│   ├── api/
│   │   ├── client.ts                # Base fetch with Bearer token injection (SCRUM-44)
│   │   ├── offersApi.ts             # getOffers(), getOffer(id, zone?)
│   │   ├── ordersApi.ts             # createOrder(), getOrders(), getOrder(id), downloadOrder(id)
│   │   ├── pricingApi.ts            # getPricing(), upsertPricing()
│   │   └── adminApi.ts              # Admin endpoints
│   └── utils/
│       ├── cn.ts                    # clsx + tailwind-merge
│       ├── formatCurrency.ts
│       └── formatDate.ts
├── types/
│   ├── offer.ts                     # OfferResponse, OfferAdminResponse
│   ├── order.ts                     # OrderResponse, OrderDetailResponse, CreateOrderRequest
│   ├── pricing.ts                   # PricingEntryResponse, UpsertPricingRequest
│   └── scrapingJob.ts               # ScrapingJobResponse
├── middleware.ts                    # Protected routes (SCRUM-26)
├── .env.local                       ← not committed
├── .env.example
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Key Patterns

### Auth token in API calls

All authenticated requests to the backend must include the Auth0 access token:

```ts
// lib/api/client.ts
export async function apiFetch<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}
```

### Protected routes (middleware.ts)

```ts
// middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
export default withMiddlewareAuthRequired();
export const config = { matcher: ['/orders/:path*', '/checkout/:path*', '/admin/:path*'] };
```

### Polling

Used in order detail (SCRUM-33) and admin scraping jobs list (SCRUM-37):

```ts
// hooks/usePolling.ts
useEffect(() => {
  if (!shouldPoll) return;
  const id = setInterval(refetch, 5000);
  return () => clearInterval(id);
}, [shouldPoll, refetch]);
```

### Admin key

The admin section reads `X-Admin-Key` from `process.env.ADMIN_API_KEY` (server-side env var, not `NEXT_PUBLIC_`). It is injected server-side in route handlers or Server Components — never exposed to the browser.

---

## Running Tests

```bash
npm test                   # Run unit tests (Jest + RTL)
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npx playwright test        # E2E tests
```

---

## Linting

```bash
npm run lint               # ESLint
npx tsc --noEmit           # TypeScript type check
```

---

## Deploy to Vercel

```bash
npm run build              # Verify build locally
vercel --prod              # Manual deploy
```

Or push to `main` for auto-deploy (configured in Vercel dashboard).

**Vercel environment variables** to configure (Settings → Environment Variables):

```
NEXT_PUBLIC_API_URL                 https://api.scrappy.io
AUTH0_SECRET                        <random 32-byte hex>
AUTH0_BASE_URL                      https://scrappy.io
AUTH0_ISSUER_BASE_URL               https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID                     <auth0 client id>
AUTH0_CLIENT_SECRET                 <auth0 client secret>
AUTH0_AUDIENCE                      https://api.scrappy.io
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_live_...
ADMIN_API_KEY                       <same value as backend>
```

---

## NPM Scripts

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Production build
npm start              # Start production server
npm run lint           # ESLint
npm test               # Unit tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Tests + coverage
npx playwright test    # E2E tests
```
