# CinemaVault SPA

CinemaVault SPA is the React TypeScript frontend repository for the Coventry University 6003CEM Web API Development CW2 project.

This Phase 8.0 scaffold sets up the frontend application shell only. It does not yet implement real login, film fetching, admin CRUD, tracking, messages, or OMDB UI.

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

Placeholder pages only:

```text
/             Home
/films        Films
/films/:id    Film Detail
/login        Login
/register     Register
/admin        Admin Dashboard
*             Not Found
```

## Folder Structure

```text
src/
  api/
  components/
  hooks/
  layouts/
  pages/
  routes/
  types/
  utils/
```

## Phase 8.0 Scope

Implemented:

- Vite + React + TypeScript scaffold
- React Router setup
- Ant Design setup and basic theme
- Axios API client wrapper
- `VITE_API_BASE_URL` environment support
- Navigation layout
- Responsive placeholder pages
- README, `.env.example`, and `.gitignore`

Not implemented yet:

- Real JWT login/register flow
- Film API fetching
- Film detail data loading
- Admin film CRUD
- Favourites, watchlist, watched records
- Messages
- OMDB import UI
