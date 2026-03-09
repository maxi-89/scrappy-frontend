# Development Guide — Scrappy Frontend

Setup and run instructions for the Scrappy Next.js frontend.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Auth | Custom JWT (access_token 15m + refresh_token 7d) |
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
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key (for zone autocomplete) |
| `ADMIN_API_KEY` | Yes | Admin API key — injected server-side via `X-Admin-Key` header |

> Never commit `.env.local` to version control.

### 3. Run locally

```bash
npm run dev
```

- App: `http://localhost:3000`

---

## Auth (Custom JWT)

Authentication is implemented without any external SDK:

- `/api/auth/login` — POST: calls backend, sets `access_token` + `refresh_token` cookies
- `/api/auth/signup` — POST: calls backend, sets cookies
- `/api/auth/logout` — POST: calls backend logout, clears cookies
- `/api/auth/refresh` — POST: reads `refresh_token` cookie, rotates both tokens

Cookie strategy:
- `access_token`: non-httpOnly, SameSite=Lax, 15min TTL → readable client-side and by Server Components via `cookies()`
- `refresh_token`: httpOnly, SameSite=Lax, 7d TTL → only set/cleared server-side

After login the JWT payload is decoded client-side (`atob`) in `lib/auth/AuthContext.tsx` to extract `{ id, email }`.

---

## Project Structure

```
scrappy-frontend/
├── app/
│   ├── layout.tsx                   # Root layout (wraps with AuthProvider)
│   ├── page.tsx                     # Home → redirects to /offers
│   ├── globals.css
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts       # POST: login proxy, sets cookies
│   │       ├── signup/route.ts      # POST: signup proxy, sets cookies
│   │       ├── logout/route.ts      # POST: logout, clears cookies
│   │       └── refresh/route.ts     # POST: token rotation
│   ├── auth/
│   │   ├── login/page.tsx           # Email + password login form
│   │   ├── signup/page.tsx          # Registration form
│   │   ├── forgot-password/page.tsx # Request password reset email
│   │   └── reset-password/page.tsx  # Set new password (?token=)
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
│   ├── layout/
│   │   └── Navbar.tsx               # Top nav (shows user email + sign out)
│   ├── offers/
│   │   ├── OfferCard.tsx            # SCRUM-28
│   │   └── OrderForm.tsx            # Order creation form
│   ├── orders/
│   │   ├── DownloadButton.tsx       # SCRUM-34
│   │   └── OrderStatusBadge.tsx
│   └── admin/
│       └── PricingTable.tsx         # SCRUM-43
├── hooks/
│   ├── usePolling.ts                # Generic polling hook
│   └── useAuth.ts                   # Wraps AuthContext → { user, isLoading, isAuthenticated, accessToken }
├── lib/
│   ├── api/
│   │   ├── client.ts                # Base fetch with Bearer token injection (SCRUM-44)
│   │   ├── authApi.ts               # Direct backend auth calls (signup, login, logout, refresh...)
│   │   ├── offersApi.ts             # getOffers(), getOffer(id, zone?)
│   │   ├── ordersApi.ts             # createOrder(), getOrders(), getOrder(id), downloadOrder(id)
│   │   ├── pricingApi.ts            # getPricing(), upsertPricing()
│   │   └── adminApi.ts              # Admin endpoints
│   ├── auth/
│   │   ├── AuthContext.tsx          # AuthProvider + useAuthContext()
│   │   └── cookies.ts               # getClientAccessToken() — reads cookie client-side
│   └── utils/
│       ├── cn.ts                    # clsx + tailwind-merge
│       ├── formatCurrency.ts
│       └── formatDate.ts
├── types/
│   ├── offer.ts                     # OfferResponse, OfferAdminResponse
│   ├── order.ts                     # OrderResponse, OrderDetailResponse, CreateOrderRequest
│   ├── pricing.ts                   # PricingEntryResponse, UpsertPricingRequest
│   └── scrapingJob.ts               # ScrapingJobResponse
├── middleware.ts                    # Cookie presence check → redirects to /auth/login (SCRUM-26)
├── .env.local                       ← not committed
├── .env.example
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## Key Patterns

### Auth token in API calls

**Client Components** — read from `AuthContext`:

```ts
import { useAuth } from '@/hooks/useAuth';

const { accessToken } = useAuth();
const order = await getOrder(id, accessToken ?? '');
```

**Server Components** — read from cookies:

```ts
import { cookies } from 'next/headers';

const token = (await cookies()).get('access_token')?.value ?? '';
const orders = await getOrders(token);
```

### Protected routes (middleware.ts)

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get('access_token')?.value;
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/checkout/:path*', '/admin/:path*'],
};
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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_live_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY     <google maps key>
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
