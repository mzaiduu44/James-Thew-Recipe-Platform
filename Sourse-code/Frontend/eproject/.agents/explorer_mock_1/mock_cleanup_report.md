# Comprehensive Mock & Legacy Codebase Cleanup Report

**Explorer**: Mock & Legacy Codebase Explorer  
**Date**: 2026-08-23  
**Project**: James Thew Culinary Salon & Recipe Platform Frontend  
**Integrity Mode**: Development / Refactoring to Live ASP.NET Core Backend  
**Backend Base URL**: `http://jamesthewrecipe.runasp.net`  
**Swagger Spec**: `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json`

---

## 1. Executive Summary

A comprehensive, file-by-file audit of the frontend repository was performed to identify all Mock Service Worker (MSW) infrastructure, in-memory databases, seed fixtures, synthetic latency, simulated uploaders, and demo role-switching utilities.

### Summary of Cleanup Scope
| Category | File Count / Artifacts | Impact / Action Required |
| :--- | :--- | :--- |
| **MSW Engine & Handlers** | `public/mockServiceWorker.js`<br>`src/mocks/browser.ts`<br>`src/mocks/handlers/index.ts` | Delete files, remove `enableMocking()` from `src/main.tsx`, remove `msw` dependency from `package.json`. |
| **In-Memory Mock DB & Fixtures** | `src/mocks/mockDb.ts`<br>`src/mocks/data/seedData.ts` | Delete files; all server state transitions to live ASP.NET Core endpoints via TanStack Query. |
| **Synthetic State & Demo Auth** | `src/store/authStore.ts`<br>`src/components/shared/RoleSwitcherBar.tsx`<br>`src/pages/LoginPage.tsx`<br>`src/pages/RegisterPage.tsx` | Remove `setDemoRole()`, remove `initialUsers` import, remove `<RoleSwitcherBar />` from `RootLayout.tsx`, disable/update mock self-register simulation. |
| **Simulated File Uploads** | `src/components/shared/ImageUploadDropzone.tsx` | Replace simulated `setInterval`/`setTimeout` DataURL reader with real `POST /api/Media` multipart/form-data uploader. |
| **Legacy Mock-Targeted Services** | `src/services/api/*.api.ts` (10 files) | Replace with 16 strongly-typed modular resource files under `src/api/` conforming to OpenAPI PascalCase routes. |
| **Build & Config Impact** | `package.json`, `public/`, `src/main.tsx` | Zero breaking impact on build configuration once mock imports are purged. |

---

## 2. Detailed Inventory of Mock & Synthetic Artifacts

### 2.1 Mock Service Worker (MSW) Setup

#### 1. `public/mockServiceWorker.js`
- **Location**: `c:/Users/akela/Downloads/eproject/public/mockServiceWorker.js`
- **Description**: Default MSW v2 client worker script generated for intercepting network requests in browser service worker scope.
- **Action**: Delete file.

#### 2. `src/main.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/main.tsx`
- **Lines of Interest**:
  ```typescript
  5: import { enableMocking } from './mocks/browser';
  7: async function prepareApp() {
  9:   try {
  10:     await enableMocking();
  11:   } catch (err) {
  12:     console.warn('MSW worker failed to start, falling back to network:', err);
  13:   }
  ...
  25: prepareApp();
  ```
- **Description**: Asynchronously delays app mount until MSW registers and activates.
- **Action**: Remove `enableMocking` import and `prepareApp()` wrapper. Mount the React root immediately with `createRoot(rootElement).render(...)`.

#### 3. `src/mocks/browser.ts`
- **Location**: `c:/Users/akela/Downloads/eproject/src/mocks/browser.ts` (15 lines)
- **Description**: Calls `setupWorker(...handlers)` and exports `enableMocking()`.
- **Action**: Delete file.

#### 4. `src/mocks/handlers/index.ts`
- **Location**: `c:/Users/akela/Downloads/eproject/src/mocks/handlers/index.ts` (499 lines)
- **Description**: Defines 16 HTTP mock route handlers for:
  - `POST */api/auth/login`
  - `POST */api/auth/register`
  - `GET */api/auth/me`
  - `GET */api/categories`
  - `GET */api/recipes`, `GET */api/recipes/:id`, `POST */api/recipes`, `PUT */api/recipes/:id`, `DELETE */api/recipes/:id`
  - `GET */api/tips`, `GET */api/tips/:id`, `POST */api/tips`, `PUT */api/tips/:id`, `DELETE */api/tips/:id`
  - `GET */api/contests`, `GET */api/contests/:id`, `POST */api/contests`, `DELETE */api/contests/:id`
  - `GET */api/contests/:id/submissions`, `POST */api/contests/:id/submissions`
  - `POST */api/contests/:id/select-winner`
  - `GET */api/announcements`, `POST */api/announcements`, `DELETE */api/announcements/:id`
  - `GET */api/feedback`, `POST */api/feedback`
  - `GET */api/faqs`, `POST */api/faqs`, `PUT */api/faqs/:id`, `DELETE */api/faqs/:id`
  - `GET */api/users`
  - `GET */api/admin/stats`
- **Action**: Delete file.

---

### 2.2 In-Memory Mock Databases & Seed Datasets

#### 1. `src/mocks/mockDb.ts`
- **Location**: `c:/Users/akela/Downloads/eproject/src/mocks/mockDb.ts` (344 lines)
- **Description**: Contains in-memory state object `mockDb` backed by `localStorage` (`STORAGE_KEY = 'james_thew_mock_db_v1'`). Simulates collection queries, filtering, search, pagination, relational joins (e.g., category count, recipe reviews), winner selection, and CRUD operations.
- **Action**: Delete file.

#### 2. `src/mocks/data/seedData.ts`
- **Location**: `c:/Users/akela/Downloads/eproject/src/mocks/data/seedData.ts` (696 lines)
- **Description**: Hardcoded fixture datasets:
  - `initialUsers`: 4 users (Admin James Thew, Member Sophia Lorenza, Member Marco Rossi, User Elena Rostova)
  - `initialCategories`: 7 culinary categories (Vegetarian, Non-Vegetarian, Italian, Juices, Desserts, Seafood, Bakery)
  - `initialRecipes`: 8 detailed Michelin-level recipes (4 free, 4 members-only)
  - `initialTips`: 5 chef tips
  - `initialContests`: 3 contests (2 active, 1 past)
  - `initialSubmissions`: 2 submissions
  - `initialAnnouncements`: 2 announcements
  - `initialFeedback`: 3 feedback reviews
  - `initialFaqs`: 7 required Aptech FAQ questions and answers
- **Action**: Delete file.

---

### 2.3 Synthetic State, Demo Authentication & Switching Tools

#### 1. `src/store/authStore.ts`
- **Location**: `c:/Users/akela/Downloads/eproject/src/store/authStore.ts`
- **Lines of Interest**:
  ```typescript
  4: import { initialUsers } from '@/mocks/data/seedData';
  ...
  16: setDemoRole: (role: 'Guest' | 'Member' | 'Admin') => void;
  ...
  52: setDemoRole: (role: 'Guest' | 'Member' | 'Admin') => {
  53:   if (role === 'Guest') {
  54:     set({ user: null, token: null, isAuthenticated: false, role: 'Guest' });
  55:   } else if (role === 'Member') {
  56:     const memberUser = initialUsers.find((u) => u.role === 'Member') || initialUsers[1];
  57:     set({ user: memberUser, token: 'mock-jwt-token-member-' + Date.now(), isAuthenticated: true, role: 'Member' });
  58:   } else if (role === 'Admin') {
  59:     const adminUser = initialUsers.find((u) => u.role === 'Admin') || initialUsers[0];
  60:     set({ user: adminUser, token: 'mock-jwt-token-admin-' + Date.now(), isAuthenticated: true, role: 'Admin' });
  61:   }
  62: }
  ```
- **Description**: Hardcodes fake users and synthetic JWTs for offline demo role switching.
- **Action**:
  - Remove `import { initialUsers } from '@/mocks/data/seedData';`.
  - Remove `setDemoRole` action or refactor store to hold actual decoded JWT claims and backend user session.

#### 2. `src/components/shared/RoleSwitcherBar.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/components/shared/RoleSwitcherBar.tsx` (81 lines)
- **Description**: Floating toolbar UI providing 1-click role swapping via `setDemoRole('Guest' | 'Member' | 'Admin')`.
- **Action**: Remove `<RoleSwitcherBar />` from `src/components/layout/RootLayout.tsx` and deprecate or remove the component.

#### 3. `src/components/layout/RootLayout.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/components/layout/RootLayout.tsx`
- **Lines of Interest**:
  ```typescript
  6: import { RoleSwitcherBar } from '../shared/RoleSwitcherBar';
  ...
  21: <RoleSwitcherBar />
  ```
- **Action**: Remove import and component tag.

#### 4. `src/pages/LoginPage.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/pages/LoginPage.tsx`
- **Lines of Interest**:
  ```typescript
  58: const handleQuickDemoLogin = (role: 'Admin' | 'Member') => {
  59:   setDemoRole(role);
  ...
  151: {/* 1-CLICK INSTANT DEMO EVALUATION BAR */}
  163: onClick={() => handleQuickDemoLogin('Admin')}
  172: onClick={() => handleQuickDemoLogin('Member')}
  ```
- **Description**: Demo login bypass buttons that inject mock tokens without verifying credentials against `POST /api/Auth`.
- **Action**: Remove the synthetic evaluation login buttons and ensure `LoginPage` submits exclusively to the live `POST /api/Auth` endpoint.

#### 5. `src/pages/RegisterPage.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/pages/RegisterPage.tsx`
- **Description**: Simulated 3D payment credit card form and calls `authApi.register`.
- **Action**: Per R3 ("Missing Backend Endpoints"), update the registration page to inform the user that public member self-registration / direct checkout is managed via administration or contact, instead of faking registration success via MSW.

---

### 2.4 Simulated Delays & Fake File Uploads

#### 1. `src/components/shared/ImageUploadDropzone.tsx`
- **Location**: `c:/Users/akela/Downloads/eproject/src/components/shared/ImageUploadDropzone.tsx`
- **Lines of Interest**:
  ```typescript
  27: // Simulate mock upload
  28: setIsUploading(true);
  29: setUploadProgress(0);
  31: const interval = setInterval(() => {
  32:   setUploadProgress((prev) => {
  33:     if (prev >= 95) {
  34:       clearInterval(interval);
  35:       setTimeout(() => {
  36:         const reader = new FileReader();
  37:         reader.onload = (e) => {
  38:           onChange(e.target?.result as string);
  39:           setIsUploading(false);
  40:         };
  41:         reader.readAsDataURL(file);
  42:       }, 300);
  43:       return 100;
  44:     }
  45:     return prev + 25;
  46:   });
  47: }, 100);
  ```
- **Description**: Fakes upload progress with timers and encodes file as Base64 Data URL instead of uploading real media files.
- **Action**: Replace with live upload handler calling `mediaApi.upload(file)` (`POST /api/Media` with form field `ImagePath`), setting the returned server URL into form state.

#### 2. MSW Handlers Artificial Delays
- **Location**: `src/mocks/handlers/index.ts`
- **Description**: `await delay(100)`, `await delay(150)`, `await delay(200)`, `await delay(250)`, `await delay(300)` simulating server latency.
- **Action**: Deleted with the MSW handlers file.

---

### 2.5 Legacy API Services vs New Live Backend Specification

The 10 existing files in `src/services/api/` were written against MSW mock routes. They must be replaced by 16 strongly-typed API modules organized under `src/api/` targeting the live ASP.NET Core OpenAPI contract:

| Legacy File (`src/services/api/`) | Target Endpoint in Mock | Live ASP.NET Core Endpoint | New Module Path (`src/api/`) |
| :--- | :--- | :--- | :--- |
| `auth.api.ts` | `POST /api/auth/login`<br>`POST /api/auth/register`<br>`GET /api/auth/me` | `POST /api/Auth` | `src/api/auth.ts` |
| `announcements.api.ts` | `/api/announcements` | `/api/Announcement` (CRUD) | `src/api/announcements.ts` |
| `categories.api.ts` | `/api/categories` | `/api/Category` (CRUD) | `src/api/categories.ts` |
| `contests.api.ts` | `/api/contests`<br>`/api/contests/:id/submissions`<br>`/api/contests/:id/select-winner` | `/api/Contest` (CRUD)<br>`/api/ContestSubmission` (CRUD)<br>`PUT /api/ContestSubmission/winner/{submissionId}` | `src/api/contests.ts`<br>`src/api/contestSubmissions.ts` |
| `faqs.api.ts` | `/api/faqs` | `/api/FAQ` (CRUD) | `src/api/faq.ts` |
| `feedback.api.ts` | `/api/feedback` | `/api/Feedback` (CRUD)<br>`/api/SiteFeedback` (CRUD) | `src/api/feedback.ts`<br>`src/api/siteFeedback.ts` |
| `recipes.api.ts` | `/api/recipes` | `/api/Recipe` (CRUD)<br>`/api/RecipeIngredient` (CRUD) | `src/api/recipes.ts`<br>`src/api/recipeIngredients.ts` |
| `tips.api.ts` | `/api/tips` | `/api/Tip` (CRUD) | `src/api/tips.ts` |
| `users.api.ts` | `/api/users` | `/api/User` (CRUD) | `src/api/users.ts` |
| `admin.api.ts` | `/api/admin/stats` | Aggregated via live queries (`User`, `Recipe`, `Contest`, etc.) or custom endpoint | `src/api/admin.ts` / hooks |
| *(None)* | *(None)* | `POST /api/Media` | `src/api/media.ts` |
| *(None)* | *(None)* | `/api/Ingredient` (CRUD) | `src/api/ingredients.ts` |
| *(None)* | *(None)* | `/api/Role` (CRUD) | `src/api/roles.ts` |
| *(None)* | *(None)* | `/api/Subscription` (CRUD) | `src/api/subscriptions.ts` |

---

## 3. Dependency & Build Impact Analysis

### 3.1 `package.json`
- **Dependencies to Remove**:
  - `"msw": "^2.15.0"` from `"dependencies"`
- **Config Blocks to Remove**:
  - `"msw": { "workerDirectory": ["public"] }`
- **Impact**: Removes ~15MB of MSW node_modules packages; reduces client bundle size; eliminates service worker build artifacts.

### 3.2 `vite.config.ts` & `tsconfig.json`
- **Current `vite.config.ts`**:
  ```typescript
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
  ```
- **Impact**: No changes required in `vite.config.ts` or `tsconfig.app.json`. The `@/*` path mapping will resolve `src/api/*` and all existing aliases seamlessly.

### 3.3 TypeScript Compilation (`npm run build`)
- Once the references to `@/mocks/*` in `src/main.tsx` and `src/store/authStore.ts` are removed, `tsc -b && vite build` will execute without MSW imports.
- Any components currently importing `initialUsers` or `mockDb` must be updated to consume data through TanStack Query hooks.

---

## 4. Recommended Step-by-Step Execution Plan

1. **Step 1: Clean Entry Point & Auth Store**
   - In `src/main.tsx`, eliminate `enableMocking()` and `prepareApp()`. Mount React root directly.
   - In `src/store/authStore.ts`, remove `import { initialUsers }` and remove `setDemoRole()`.
   - In `src/components/layout/RootLayout.tsx`, remove `<RoleSwitcherBar />`.

2. **Step 2: Create Central HTTP Client & 16 API Modules**
   - Create `src/api/client.ts` with `baseURL: 'http://jamesthewrecipe.runasp.net'` (or `import.meta.env.VITE_API_BASE_URL`).
   - Add Axios request interceptor for `Authorization: Bearer <token>` from `authStore`.
   - Add Axios response interceptor for `401 Unauthorized` redirecting to `/login`.
   - Implement the 16 resource modules in `src/api/` (`auth.ts`, `announcements.ts`, `categories.ts`, `contests.ts`, `contestSubmissions.ts`, `faq.ts`, `feedback.ts`, `ingredients.ts`, `media.ts`, `recipes.ts`, `recipeIngredients.ts`, `roles.ts`, `siteFeedback.ts`, `subscriptions.ts`, `tips.ts`, `users.ts`).

3. **Step 3: Update Dropzone with Live Media Upload**
   - Refactor `src/components/shared/ImageUploadDropzone.tsx` to upload selected image via `POST /api/Media` (`multipart/form-data`) and propagate the returned URL string.

4. **Step 4: Update Pages & Hooks**
   - Wire all query and mutation hooks in `src/hooks/` to call `src/api/*` modules.
   - Ensure query invalidation is properly handled on mutations.
   - Update `LoginPage.tsx` to authenticate against `POST /api/Auth`.
   - Update `RegisterPage.tsx` to handle backend constraints gracefully.
   - Ensure winner selection in `ContestDetailPage.tsx` and `AdminContestsPage.tsx` uses `PUT /api/ContestSubmission/winner/{submissionId}`.

5. **Step 5: Delete MSW & Mock Files**
   - Delete `public/mockServiceWorker.js`.
   - Delete `src/mocks/` directory recursively (`browser.ts`, `mockDb.ts`, `data/seedData.ts`, `handlers/index.ts`).
   - Remove `msw` from `package.json`.

6. **Step 6: Build & Test Verification**
   - Run `npm run build` to confirm zero TypeScript compilation errors.
