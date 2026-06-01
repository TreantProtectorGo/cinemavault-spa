# CinemaVault SPA

CinemaVault SPA is the React TypeScript frontend repository for the Coventry University 6003CEM Web API Development CW2 project.

This frontend repository contains the React SPA for CinemaVault. Phase 8.2 adds public film catalogue browsing and film detail pages against the backend Films API.

## Tech Stack

- Vite
- React
- TypeScript
- React Router
- Ant Design
- Axios

## Backend Dependency

The SPA expects the CinemaVault backend API to be running separately.

Default backend URL:

```text
http://localhost:4000
```

Backend API docs:

```text
http://localhost:4000/api-docs
```

Raw OpenAPI spec:

```text
http://localhost:4000/api-docs/openapi.json
```

## Environment Setup

Create a local environment file:

```bash
cp .env.example .env
```

Configure the backend API base URL:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Do not commit `.env`; it is ignored by git.

## Demo Backend Accounts

After running the backend seed script, these accounts are available:

```text
Admin
Email: admin@cinemavault.local
Password: AdminPassword123!

User
Email: member@cinemavault.local
Password: UserPassword123!
```

For public film browsing, run the backend migrations and seed script so the catalogue has demo films:

```bash
cd ../cinemavault-api
npm run prisma:migrate
npm run prisma:seed
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Current Routes

```text
/             Home
/films        Films
/films/:id    Film Detail
/login        Login
/register     Register
/admin        Admin Dashboard, protected admin-only route
*             Not Found
```

Unauthenticated users who visit protected routes are redirected to `/login`. Authenticated non-admin users who visit `/admin` see a 403 style page.

## Folder Structure

```text
src/
  api/
    auth.ts
    client.ts
  components/
  context/
  hooks/
  layouts/
  pages/
  routes/
  types/
  utils/
```

## Authentication Flow

The SPA uses the backend JWT endpoints:

```text
POST /api/v1/auth/login
POST /api/v1/auth/register
GET  /api/v1/admin/ping
```

Normal frontend authentication uses JWT only. The backend Basic Auth endpoint remains coursework evidence and is not used by the SPA.

Current auth behaviour:

- Login submits `emailOrUsername` and `password`.
- Register submits `email`, `username`, and `password` with frontend confirm-password validation.
- Successful login/register stores the JWT and public user object in `localStorage`.
- Axios attaches the token as `Authorization: Bearer <token>`.
- Logout clears local auth state and removes the bearer token.
- Navigation shows Login/Register when logged out.
- Navigation shows current username, role, and Logout when logged in.
- Admin navigation appears only for users with role `ADMIN`.

## Public Film Browsing

The public film pages use these backend endpoints:

```text
GET /api/v1/films
GET /api/v1/films/:id
```

`/films` supports backend query parameters through the UI:

- `title`
- `genre`
- `year`
- `rating`
- `isLive`
- `sortBy`
- `order`
- `page`
- `limit`

`/films/:id` shows poster, title, genre, year, rating, director, cast, plot, runtime, language, country, and IMDb ID where available.

Film browsing remains public and does not require login.

## Phase 8.2 Scope

Implemented:

- Vite + React + TypeScript scaffold
- React Router setup
- Ant Design setup and basic theme
- Axios API client wrapper
- `VITE_API_BASE_URL` environment support
- Navigation layout
- Responsive placeholder pages
- README, `.env.example`, and `.gitignore`
- Auth TypeScript types
- Auth API service
- Auth context and `useAuth` hook
- JWT persistence in `localStorage`
- Login and register forms wired to backend endpoints
- Protected route and admin route guards
- Role-aware navigation
- Film API service
- Public film catalogue with loading, error, empty, filtering, sorting, and pagination states
- Public film detail page with loading, error, and not-found states

Not implemented yet:

- Admin film CRUD
- Favourites, watchlist, watched records
- Messages
- OMDB import UI
