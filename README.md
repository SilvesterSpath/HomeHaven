# HomeHaven

A modern rental marketplace built with Next.js 14. Browse verified listings, save favorites, message hosts, and publish your own listings — all in one place.

## Features

- Search and browse rental listings with map view (Leaflet)
- Bookmark and revisit saved properties
- Direct messaging between renters and hosts
- Listing management — create, edit, and delete your own listings
- Cloudinary-backed image uploads
- AI-assisted listing copy (OpenAI) on the create flow
- Google sign-in via NextAuth

## Tech Stack

- Next.js 14 (App Router) and React 18
- MongoDB with Mongoose
- NextAuth (Google OAuth)
- Cloudinary for image hosting
- Tailwind CSS
- OpenAI (optional, for listing-copy generation)
- Jest for unit and route-handler tests

## Quick Start

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

For Google OAuth in local dev, allow `http://localhost:3000/api/auth/callback/google` as a redirect URI in the Google Cloud console.

## Environment Variables

| Variable                  | Required | Purpose                                                                  |
| ------------------------- | -------- | ------------------------------------------------------------------------ |
| `MONGO_URI`               | yes      | MongoDB connection string                                                |
| `NEXTAUTH_SECRET`         | yes      | NextAuth signing and encryption secret                                   |
| `NEXT_AUTH_URL_INTERNAL`  | yes      | Base URL used to build the Google OAuth `callbackUrl`                    |
| `NEXT_AUTH_URL`           | yes      | Public base URL used for redirects after listing creation                |
| `GOOGLE_CLIENT_ID`        | yes      | Google OAuth client ID                                                   |
| `GOOGLE_CLIENT_SECRET`    | yes      | Google OAuth client secret                                               |
| `CLOUDINARY_CLOUD_NAME`   | yes      | Cloudinary cloud name                                                    |
| `CLOUDINARY_API_KEY`      | yes      | Cloudinary API key                                                       |
| `CLOUDINARY_API_SECRET`   | yes      | Cloudinary API secret                                                    |
| `NEXT_PUBLIC_API_DOMAIN`  | yes      | Origin plus `/api`, e.g. `http://localhost:3000/api`                     |
| `NEXT_PUBLIC_DOMAIN`      | yes      | Origin used for absolute share URLs                                      |
| `OPENAI_API_KEY`          | optional | Enables AI listing-copy generation                                       |
| `OPENAI_MODEL`            | optional | OpenAI model override (defaults to `gpt-4o-mini`)                        |

`NEXT_PUBLIC_*` variables are baked at build time — rebuild after changing them.

## Scripts

```bash
npm run dev            # Start the dev server
npm run build          # Production build
npm start              # Start the production build
npm run lint           # ESLint
npm test               # Jest
npm run test:watch     # Jest watch mode
npm run test:coverage  # Jest with coverage
```

## Project Structure

```
app/
  layout.jsx, page.jsx, loading.jsx, not-found.jsx
  login/, profile/, messages/
  properties/
    page.jsx                       # All listings
    add/, saved/, search-results/
    [id]/page.jsx, [id]/edit/page.jsx
  api/
    auth/[...nextauth]/route.js
    properties/, properties/[id]/, properties/search/
    properties/user/[userId]/
    properties/ai-content/         # AI listing-copy endpoint
    bookmarks/, bookmarks/check/
    messages/, messages/[id]/
components/                        # UI: forms, cards, navbar, footer
config/                            # Mongo and Cloudinary config
models/                            # User, Property, Message schemas
utils/                             # Auth helpers, fetch helpers, AI utilities
middleware.js                      # NextAuth route protection
__tests__/                         # Jest tests
```

Path alias: `@/*` resolves to the repository root (see `jsconfig.json`).

## Authentication and Authorization

- Google sign-in via NextAuth (`utils/authOptions.js`).
- Route protection lives in `middleware.js` for `/properties/add`, `/properties/saved`, `/profile`, and `/messages`.
- API handlers enforce session checks and ownership for all mutating endpoints — create, update, and delete listings, bookmark management, and message send and delete.

## Data Model

Three Mongoose models live in `models/`:

- **User** — `email`, `username`, `image`, `bookmarks` (references to Property).
- **Property** — `owner` (User), `name`, `type`, `description`, `location`, `beds`, `baths`, `square_feet`, `amenities`, `rates`, `seller_info`, `images`, `is_featured`.
- **Message** — `sender`, `recipient` (Users), `property` (Property), `name`, `email`, `phone`, `body`, `read`.

## AI Listing Generation

The Add Property form includes a *Generate listing with AI* helper that drafts a title and short description from the property details entered in the form.

- Endpoint: `POST /api/properties/ai-content`
- Requires an authenticated session.
- Server-side only — the OpenAI key is never exposed to the client.
- Configured via `OPENAI_API_KEY` (required) and `OPENAI_MODEL` (optional).

The endpoint returns a typed error shape on failure:

| Code                         | Status | Meaning                                                |
| ---------------------------- | ------ | ------------------------------------------------------ |
| `UNAUTHORIZED`               | 401    | No valid session                                       |
| `INVALID_REQUEST`            | 400    | Malformed JSON body or failed validation               |
| `AI_PROVIDER_NOT_CONFIGURED` | 500    | `OPENAI_API_KEY` is not set                            |
| `AI_PROVIDER_ERROR`          | 502    | OpenAI request failed                                  |
| `AI_INVALID_RESPONSE`        | 502    | OpenAI returned an unexpected response shape           |
| `INTERNAL_ERROR`             | 500    | Unexpected server error                                |

## Testing and CI

Jest runs unit tests for selected API route handlers and components. The CI pipeline at `.github/workflows/ci.yml` runs `npm run lint` and `npm test` on every push and pull request.

## Deployment

Any Node.js 20+ host that runs Next.js works — Vercel, Railway, Render, or a custom Node server.

Production checklist:

1. Set every environment variable from the table above on your host.
2. Update the Google OAuth redirect URI to `https://<your-domain>/api/auth/callback/google`.
3. Set `NEXT_AUTH_URL_INTERNAL` and `NEXT_AUTH_URL` to your public HTTPS origin.
4. Set `NEXT_PUBLIC_API_DOMAIN` to `https://<your-domain>/api`.
5. Set `NEXT_PUBLIC_DOMAIN` for share links.
6. Rebuild after changing any `NEXT_PUBLIC_*` variables.

## Troubleshooting

| Symptom                                  | Likely cause                                                  |
| ---------------------------------------- | ------------------------------------------------------------- |
| Empty listings on the home page          | `NEXT_PUBLIC_API_DOMAIN` unset or wrong (must include `/api`) |
| Google redirect mismatch                 | `NEXT_AUTH_URL_INTERNAL` does not match the Google console    |
| Wrong host after creating a listing      | `NEXT_AUTH_URL` not aligned with the public origin            |
| Images fail to upload                    | Cloudinary environment variables missing or invalid           |
| Mongo errors on cold start               | `MONGO_URI` wrong or the Atlas allowlist excludes the host    |
| Share links point to the wrong domain    | `NEXT_PUBLIC_DOMAIN` not set or stale build                   |
