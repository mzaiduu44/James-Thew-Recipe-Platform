# James Thew Recipe & Culinary Salon Platform — Architecture & Project Specification

**Document Version**: 1.0.0  
**Target Backend**: ASP.NET Core REST Web API (`http://jamesthewrecipe.runasp.net`)  
**Frontend Architecture**: React 19 / Vite / TypeScript / Tailwind CSS / TanStack Query v5 / Zustand / Axios / Framer Motion

---

## 1. Project Architecture & Technology Stack

The James Thew platform is a luxury culinary salon and gourmet recipe sharing web application. The frontend communicates with a live ASP.NET Core backend over HTTP/REST using JWT Bearer authentication.

```
┌─────────────────────────────────────────────────────────────┐
│                       React 19 UI                           │
│  (Tailwind CSS, Framer Motion, React Router v7, UI Store)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌────────────────────────┐             ┌───────────────────────┐
│     Zustand Store      │             │  TanStack Query v5    │
│  (Auth, Tokens, Modals)│             │ (Queries & Mutations) │
└───────────┬────────────┘             └──────────┬────────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Central Axios API Client                    │
│   (src/api/client.ts: Bearer Interceptor, 401 Redirect,     │
│             Defensive ProblemDetails Error Parser)          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Live ASP.NET Core Web API Backend               │
│          http://jamesthewrecipe.runasp.net/api/...          │
└─────────────────────────────────────────────────────────────┘
```

### Core Architecture Rules:
1. **Zero Mock Interception**: All network requests hit the live ASP.NET Core backend. MSW, mock databases, and static fixture arrays are completely eliminated.
2. **Server State Exclusivity**: Server state resides solely in TanStack Query caches. Mutation hooks trigger targeted query invalidations.
3. **Client State Separation**: Local UI state (theme, modals, mobile drawers, active filter tabs) is managed via Zustand (`useUiStore`) or local component state.
4. **Defensive Error Normalization**: The API client standardizes ASP.NET Core ProblemDetails, validation error maps, and string errors into clear user-facing messages.

---

## 2. Code Layout & Directory Structure

```
c:/Users/akela/Downloads/eproject/
├── index.html                     # HTML entry point with luxury serif typography fonts
├── vite.config.ts                 # Vite bundler configuration (@/ alias to src/)
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # TypeScript application compiler options
├── package.json                   # Dependencies and scripts (tsc, vite build, oxlint)
├── PROJECT.md                     # Central architectural and contract document
├── API_CONTRACT.md                # REST API contract reference
├── public/                        # Static assets (favicons, SVG vector assets)
└── src/
    ├── main.tsx                   # React application root mounting (direct createRoot)
    ├── App.tsx                    # Top-level RouterProvider and QueryClientProvider
    ├── index.css                  # Tailwind styles and theme CSS custom properties
    ├── api/                       # Centralized API client and 16 resource modules
    │   ├── client.ts              # Axios instance, interceptors, error parsers
    │   ├── index.ts               # Re-exports and client entrypoint
    │   ├── auth.ts                # Auth API (POST /api/Auth)
    │   ├── announcements.ts       # Announcement CRUD (/api/Announcement)
    │   ├── categories.ts          # Category CRUD (/api/Category)
    │   ├── contests.ts            # Contest CRUD (/api/Contest)
    │   ├── contestSubmissions.ts  # ContestSubmission CRUD & winner selection
    │   ├── faq.ts                 # FAQ CRUD (/api/FAQ)
    │   ├── feedback.ts            # Recipe feedback CRUD (/api/Feedback)
    │   ├── ingredients.ts         # Ingredient catalog CRUD (/api/Ingredient)
    │   ├── media.ts               # File upload (POST /api/Media)
    │   ├── recipes.ts             # Recipe CRUD (/api/Recipe)
    │   ├── recipeIngredients.ts   # RecipeIngredient batch creation & update
    │   ├── roles.ts               # Role catalog CRUD (/api/Role)
    │   ├── siteFeedback.ts        # General website feedback CRUD (/api/SiteFeedback)
    │   ├── subscriptions.ts       # Subscription CRUD (/api/Subscription)
    │   ├── tips.ts                # Culinary tip CRUD (/api/Tip)
    │   └── users.ts               # User account CRUD (/api/User)
    ├── components/                # Reusable UI component library
    │   ├── layout/                # RootLayout, Navbar, Footer, AdminSidebar, PageContainer
    │   ├── ui/                    # Button, Input, Modal, Drawer, Toast, Badge, Skeleton
    │   ├── shared/                # AppImage, RatingStars, RecipeCard, TipCard, ContestCountdown
    │   ├── recipes/               # Recipe filters, procedure steps, nutrition card
    │   ├── tips/                  # Tip cards, tag badges, like actions
    │   ├── contests/              # Contest cards, submission dialogs, winner banner
    │   └── forms/                 # Form controls, media dropzones
    ├── hooks/                     # Custom hooks and TanStack Query wrappers
    ├── pages/                     # Routed view pages (Public, Member, Admin)
    ├── routes/                    # Route tree definitions and ProtectedRoute guards
    ├── store/                     # Zustand state stores (authStore, uiStore)
    ├── types/                     # Strong TypeScript models and API DTO definitions
    │   ├── api.ts                 # Comprehensive DTOs for all 16 resources & query params
    │   ├── auth.ts                # Auth state interfaces
    │   └── entities.ts            # Domain entity models
    └── utils/                     # Formatting utilities, date helpers, cn helper
```

---

## 3. Comprehensive Feature & Resource Inventory

| # | Resource | Backend Base Route | Operations Supported | Key Request / Response DTOs | Auth Required |
|---|----------|--------------------|----------------------|-----------------------------|---------------|
| 1 | **Auth** | `/api/Auth` | `POST` (Login) | `LoginsRequest` ➔ `LoginResponse` | No |
| 2 | **Announcement** | `/api/Announcement` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `AnnouncementForCreation`, `AnnouncementForUpdation`, `AnnouncementDto` | Yes |
| 3 | **Category** | `/api/Category` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `CategoryForCreation`, `CategoryForUpdation`, `CategoryDto` | Yes |
| 4 | **Contest** | `/api/Contest` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `ContestForCreation`, `ContestForUpdation`, `ContestDto` | Yes |
| 5 | **ContestSubmission** | `/api/ContestSubmission` | `GET`, `POST`, `GET /:id`, `DELETE /:id`, `PUT /winner/:submissionId` | `ContestSubmissionForCreation`, `ContestSubmissionDto` | Yes |
| 6 | **FAQ** | `/api/FAQ` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `FAQForCreation`, `FAQForUpdation`, `FAQDto` | Yes |
| 7 | **Feedback** | `/api/Feedback` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `FeedbackForCreation`, `FeedbackForUpdation`, `FeedbackDto` | Yes |
| 8 | **SiteFeedback** | `/api/SiteFeedback` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `SiteFeedbackForCreation`, `SiteFeedbackForUpdation`, `SiteFeedbackDto` | Yes |
| 9 | **Ingredient** | `/api/Ingredient` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `IngredientForCreation`, `IngredientForUpdation`, `IngredientDto` | Yes |
| 10 | **Media** | `/api/Media` | `POST` (`multipart/form-data`) | Form field `ImagePath` ➔ `string` (saved path/URL) | Yes |
| 11 | **Recipe** | `/api/Recipe` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `RecipeForCreation`, `RecipeForUpdation`, `RecipeDto` | Yes |
| 12 | **RecipeIngredient** | `/api/RecipeIngredient` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `RecIngredientForCreation` (batch), `RecIngredientForUpdation` (single), `RecipeIngredientDto` | Yes |
| 13 | **Role** | `/api/Role` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `RoleForCreation`, `RoleForUpdation`, `RoleDto` | `GET` is Public; mutations require auth |
| 14 | **Subscription** | `/api/Subscription` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `SubscriptionForCreation`, `SubscriptionForUpdation`, `SubscriptionDto` | Yes |
| 15 | **Tip** | `/api/Tip` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `TipForCreation`, `TipForUpdation`, `TipDto` | Yes |
| 16 | **User** | `/api/User` | `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` | `UserForCreation`, `UserForUpdation`, `UserDto` | Yes |

---

## 4. Interface Contracts & Protocol Rules

### 4.1 Base URL & Environment Configuration
- Base URL is configured in `src/api/client.ts` via `import.meta.env.VITE_API_BASE_URL` with default fallback to `http://jamesthewrecipe.runasp.net`.
- In development, Vite can also proxy `/api` if needed, but requests directly targeting the live host are fully supported.

### 4.2 Authentication Flow
1. Login sends `POST /api/Auth` with `{ email, password }`.
2. Response returns `{ token, user? }` or a raw JWT token string.
3. The token is stored in Zustand (`useAuthStore`) with local storage persistence (`james_thew_auth`).
4. Axios request interceptor attaches `Authorization: Bearer <token>` to all subsequent requests.
5. Axios response interceptor catches `401 Unauthorized`, calls `useAuthStore.getState().logout()`, and redirects to `/login`.

### 4.3 Two-Step Media Upload Flow
For recipes and profile avatars:
1. User chooses an image file in the UI.
2. File is uploaded to `POST /api/Media` via `FormData` under key `ImagePath`.
3. Server returns the path/URL string.
4. The path is passed into `imagePaths: string[]` on Recipe creation/update or `profileImage: string` on Category/Contest/Tip.

### 4.4 RecipeIngredient Create vs Update Discrepancy
- **Create (`POST /api/RecipeIngredient`)**:
  ```typescript
  {
    recipeName: string;
    recipeitem: Array<{
      ingredientName?: string;
      quantity?: string;
      profileImage?: string;
    }>;
  }
  ```
- **Update (`PUT /api/RecipeIngredient/{id}`)**:
  ```typescript
  {
    id: number;
    recipeName?: string;
    ingredientName?: string;
    quantity?: string;
    profileImage?: string;
  }
  ```

### 4.5 Subscription Updation Body
- `PUT /api/Subscription/{id}` accepts only `{ planType: PlanType, amount: number }`.
- `id` and `userId` are NOT included in the request body (the ID is supplied strictly via the route parameter).

### 4.6 Contest Winner Selection
- Selecting a winner triggers `PUT /api/ContestSubmission/winner/{submissionId}` without body.

---

## 5. Milestone Roadmap

- **Milestone 1 (Foundation & Mock Elimination)**:
  - Remove all MSW service worker files, mock handlers, seed data, and demo role switcher.
  - Build central typed Axios client with JWT interceptor and 401 handling.
  - Define complete TypeScript DTO interfaces for all 16 backend resources in `src/types/api.ts`.
  - Author `PROJECT.md` root specification.

- **Milestone 2 (Authentication, Users, Roles & Subscriptions)**:
  - Implement `src/api/auth.ts`, `src/api/users.ts`, `src/api/roles.ts`, `src/api/subscriptions.ts`.
  - Update `LoginPage`, `RegisterPage`, `useAuthStore`, and Admin User / Subscription management views.

- **Milestone 3 (Categories, Ingredients, Media & Recipe Management)**:
  - Implement `src/api/categories.ts`, `src/api/ingredients.ts`, `src/api/media.ts`, `src/api/recipes.ts`, `src/api/recipeIngredients.ts`.
  - Implement 2-step media upload in Recipe creation forms and ImageUploadDropzone.

- **Milestone 4 (Culinary Tips, Contests, Submissions & Winner Selection)**:
  - Implement `src/api/tips.ts`, `src/api/contests.ts`, `src/api/contestSubmissions.ts`.
  - Connect Contest detail submissions, submission review tables, and winner designation endpoints.

- **Milestone 5 (Announcements, FAQs, Feedback, SiteFeedback & Admin Stats)**:
  - Implement `src/api/announcements.ts`, `src/api/faq.ts`, `src/api/feedback.ts`, `src/api/siteFeedback.ts`.
  - Connect Admin dashboard metrics calculation, public FAQ accordion, recipe feedback submission, and announcements feed.
