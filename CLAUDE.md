## 1. Core Principles

- **Small tasks, one at a time**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Test-Driven Development**: Start with failing tests for any new functionality (TDD), according to the task details.
- **Type Safety**: All code must be fully typed. Use strict TypeScript.
- **Clear Naming**: Use clear, descriptive names for all variables and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences.
- **Pattern Detection**: Detect and highlight repeated code patterns.

## 2. Language Standards

- **English Only**: All technical artifacts must always use English, including:
  - Code (variables, functions, classes, comments, error messages, log messages)
  - Documentation (README, guides, API docs)
  - Configuration files and scripts
  - Git commit messages
  - Test names and descriptions

## 3. Project Context

**Product**: Scrappy — an on-demand business data marketplace. Users purchase scraping jobs for a specific business category and geographic zone. After payment, scraping runs asynchronously and the result (CSV, Excel, or JSON) is available for download.

**Business model**: Users browse offers (by category), select a zone, choose a format, and pay. Pricing is zone-based (configured by admin). After payment, AWS Step Functions runs the scraping pipeline and delivers the result file.

**Frontend Stack**: Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Auth0 (`@auth0/nextjs-auth0`) · Stripe (`@stripe/react-stripe-js`) · Jest + React Testing Library · Playwright

**Backend API**: `https://api.scrappy.io` (FastAPI on AWS Lambda). Auth via Auth0 RS256 JWT (Bearer token). See `openspec/specs/api-spec.yml` for all endpoints.

**Infrastructure**: Vercel (frontend deployment)

## 4. Auth

Authentication is handled by **Auth0** (`@auth0/nextjs-auth0`).
- The SDK manages login/logout/callback routes at `/api/auth/[auth0]`
- After login, call `POST /auth/sync` on the backend to register the user in the Scrappy DB
- Pass the Auth0 `accessToken` as `Authorization: Bearer {token}` in all authenticated API requests
- Protected routes: `/orders/**`, `/checkout/**`, `/admin/**` — enforced via `middleware.ts`
- Admin routes additionally require `X-Admin-Key` header (server-side env var `ADMIN_API_KEY`)

## 5. Specific Standards

For detailed standards refer to:

- [Frontend Standards](./openspec/specs/frontend-standards.mdc) — Next.js App Router, Tailwind CSS, Server/Client Components, data fetching, API client pattern
- [Documentation Standards](./openspec/specs/documentation-standards.mdc) — docs structure and maintenance
- [API Spec](./openspec/specs/api-spec.yml) — OpenAPI 3.0 spec (source of truth for endpoints and schemas)
- [Data Model](./openspec/specs/data-model.md) — PostgreSQL relational schema (offers, pricing, orders, scraping_jobs, users)
- [Development Guide](./openspec/specs/development_guide.md) — local setup, project structure, env vars, deploy
