# Art Gallery Management System

MCA final-year individual project frontend: a React portal for an art gallery. The public Home page and JWT authentication foundation are in place. Business modules (artists, artworks, categories, exhibitions, reports, and inquiries) will be added later, one feature at a time.

The ASP.NET Core Web API and SQL Server database are developed separately and are not part of this repository.

## Technology stack

- React.js
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Lucide React

Linting uses **Oxlint** and **ESLint** (`npm run lint`). Oxlint is the default Vite React template linter; ESLint is included for TypeScript and React Hooks rules.

## Architecture

The frontend is organized by feature so new modules can be added without changing unrelated code.

Authentication flow:

```
Login page
  → AuthContext.login()
    → authService.login()
      → Axios apiClient
        → ASP.NET Core Web API
```

- **UI pages** never call Axios.
- **AuthContext** owns session state (`isAuthenticated`, `currentUser`, `login`, `logout`).
- **authService** owns HTTP communication for authentication.
- **apiClient** owns base URL, JSON headers, Bearer tokens, and 401 handling.
- **authStorage** is the only place that reads or writes `localStorage`.

Route guards:

- `/` is public and does not require login.
- Unauthenticated visitors to `/admin` are redirected to `/login`.
- Authenticated visitors to `/login` are redirected by role (`Admin` → `/admin`, other roles → `/`).
- Authenticated non-admin users who open `/admin` are sent to `/unauthorized`.
- While the stored session is being restored, a loading screen is shown.
- Logout clears token and user data and returns the user to `/`.

## Folder structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui primitives actually used
│   ├── common/             # PasswordInput, loading states
│   └── layout/             # Public header and footer
├── features/
│   ├── auth/
│   └── home/               # Public home sections and mock artwork data
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── schemas/
│       └── types/
├── layouts/
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   └── AdminLayout.tsx
├── routes/
│   ├── AppRoutes.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── services/
│   └── apiClient.ts
├── context/
│   └── AuthContext.tsx
├── hooks/
├── types/
├── utils/
├── constants/
├── config/
│   └── env.ts
├── pages/
│   ├── Home.tsx
│   ├── Unauthorized.tsx
│   ├── AdminHome.tsx
│   └── NotFound.tsx
├── App.tsx
├── main.tsx
└── index.css
```

Future modules should follow the same feature layout, for example:

```
src/features/artists/
  components/  pages/  services/  hooks/  schemas/  types/
```

Do not put artists, artworks, or other business code in `features/auth`.

## Pages

| Route            | Access                         | Description                         |
| ---------------- | ------------------------------ | ----------------------------------- |
| `/`              | Public                         | Home page with header and footer    |
| `/login`         | Guest only                     | Sign-in form                        |
| `/admin`         | Protected, Admin role          | Placeholder admin home              |
| `/unauthorized`  | Public                         | Shown when a signed-in user lacks access |
| `*`              | Public                         | 404 page                            |

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

The Vite development server starts on `http://localhost:5173` by default.

Production build:

```bash
npm run build
npm run preview
```

Quality checks:

```bash
npm run lint
```

## Environment configuration

Copy the example file and adjust the API origin if needed:

```bash
cp .env.example .env
```

| Variable             | Description                                      | Example                         |
| -------------------- | ------------------------------------------------ | ------------------------------- |
| `VITE_API_BASE_URL`  | ASP.NET Core API base URL, including `/api`      | `http://localhost:5000/api`     |

The URL is read in `src/config/env.ts` and passed to Axios. Do not hard-code API URLs in components.

Vite only exposes variables prefixed with `VITE_`. Restart the dev server after changing `.env`.

## Authentication flow

1. The user opens `/login` and submits email/username and password.
2. `LoginForm` validates with Zod through React Hook Form.
3. `AuthContext.login()` calls `authService.login()`.
4. `apiClient` posts to `POST /auth/login`.
5. On success, the access token and user profile are stored through `authStorage`.
6. `PublicRoute` sees `isAuthenticated` and redirects using `getPostLoginPath()` (`Admin` → `/admin`, other roles → `/`).
7. On later visits, `AuthProvider` restores the session from storage and optionally refreshes the user via `GET /auth/me`.
8. Logout calls `POST /auth/logout` (best-effort), then clears storage and returns the user to `/`.

Expected login response from ASP.NET Core:

```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "Admin"
  }
}
```

Login request body:

```json
{
  "email": "admin@gallery.com",
  "password": "your-password"
}
```

The `email` field accepts either an email address or a username. If the value contains `@`, it is validated as an email.

## Connecting the ASP.NET Core API

1. Run the API so it listens on the origin in `VITE_API_BASE_URL` (default `http://localhost:5000/api`).
2. Enable CORS for the Vite origin (`http://localhost:5173` in development).
3. Implement the endpoints below using camelCase JSON (the ASP.NET Core default).
4. Return JWT access tokens in `accessToken`.
5. Protect `/auth/me` and `/auth/logout` with Bearer authentication.
6. Return HTTP 401 for invalid credentials and expired tokens. The Axios response interceptor clears the local session on 401 for authenticated requests (not for `/auth/login`).

| Method | Path           | Auth   | Purpose                          |
| ------ | -------------- | ------ | -------------------------------- |
| POST   | `/auth/login`  | No     | Issue JWT and return user        |
| POST   | `/auth/logout` | Bearer | Optional server-side logout      |
| GET    | `/auth/me`     | Bearer | Return the current user          |

Configure JWT Bearer authentication on the API. The frontend sends:

```
Authorization: Bearer <accessToken>
```

Until the API is running, login will show a user-friendly network error. That is expected.

## Error handling

The UI never displays raw server exception text. `src/utils/error.ts` maps failures to messages for:

- Invalid credentials (401 on login)
- Network / connection errors
- Timeouts
- Server errors (5xx)
- Unexpected errors

## Adding the next module

When a business module is ready:

1. Create `src/features/<module>/` with `components`, `pages`, `services`, `hooks`, `schemas`, and `types` as needed.
2. Put HTTP calls in that feature's `services` file, using `apiClient`.
3. Register the page in `src/routes/AppRoutes.tsx` under `AdminLayout`.
4. Add a navigation item in `AdminLayout` only when that module exists.
