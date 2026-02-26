# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Catering Tanne is a Next.js 16 (App Router) catering website with TypeScript, React 19, Tailwind CSS 4, NextAuth v5, and Supabase. It includes public pages (menus, services, contact), an ordering cart, table booking, an AI chatbot, and an admin dashboard.

### Running the app

- `npm run dev` starts the dev server on port 3000.
- `npm run build` builds the production app.
- `npm run lint` runs ESLint (pre-existing warnings/errors exist in the codebase).

### Environment variables

A `.env.local` file is needed. See `src/auth.ts` and `src/lib/supabase.ts` for required vars. Key variables:

- `AUTH_SECRET` — required by NextAuth v5 (any string for dev).
- `ADMIN_PASSWORD` — fallback admin password when Supabase is not configured (default: `"admin"`).
- `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_ANON_KEY` — leave **unset** if no Supabase project is available; the admin login will fall back to `ADMIN_PASSWORD`. If these are set to invalid values, admin credential login will fail silently (the Supabase auth path catches errors and returns `null` without falling through to the password fallback).
- Google OAuth, n8n webhooks, and Formspree are optional; the app degrades gracefully without them.

### Admin login (local dev without Supabase)

With `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_ANON_KEY` **unset** and `ADMIN_PASSWORD=admin`:
- Navigate to `/admin/login`
- Email: any (e.g. `admin@cateringtanne.se`), Password: `admin`
- This grants admin role via the credentials provider fallback.

### Table booking system

Table data is seeded in-memory (no external DB needed). The `/admin/tables` page works fully offline with 11 pre-seeded tables.

### Menu/orders API

The `/api/menus` and `/api/orders` routes require a configured Supabase project. Without one, these API calls return 500 errors, but the rest of the app remains functional.
