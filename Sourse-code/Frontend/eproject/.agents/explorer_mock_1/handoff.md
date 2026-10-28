# Handoff Report — Mock & Legacy Codebase Exploration

**Agent**: explorer_mock_1 (Mock & Legacy Codebase Explorer)  
**Parent Task ID**: 056cb173-b69e-491e-ac7a-7275687e2977  
**Date**: 2026-08-23T10:33:00Z  
**Type**: Hard Handoff (Investigation Complete)

---

## 1. Observation

Direct observations from examining the codebase:

1. **Mock Service Worker (MSW) Infrastructure**:
   - `public/mockServiceWorker.js` exists in the public directory.
   - `package.json` line 20: `"msw": "^2.15.0"` and lines 41-45: `"msw": { "workerDirectory": ["public"] }`.
   - `src/main.tsx` lines 5, 10:
     ```typescript
     import { enableMocking } from './mocks/browser';
     await enableMocking();
     ```
   - `src/mocks/browser.ts` lines 1-14: sets up `setupWorker(...handlers)` pointing to `/mockServiceWorker.js`.
   - `src/mocks/handlers/index.ts` lines 1-499: defines 16 mock HTTP handlers with artificial `delay(100)` to `delay(300)`.

2. **In-Memory Mock Database & Seed Data**:
   - `src/mocks/mockDb.ts` lines 1-344: maintains in-memory `DbState` initialized from `initialState` and synchronized to `localStorage.getItem('james_thew_mock_db_v1')`.
   - `src/mocks/data/seedData.ts` lines 1-696: contains 696 lines of hardcoded mock fixtures (`initialUsers`, `initialCategories`, `initialRecipes`, `initialTips`, `initialContests`, `initialSubmissions`, `initialAnnouncements`, `initialFeedback`, `initialFaqs`).

3. **Mock Dependencies in Application State & Components**:
   - `src/store/authStore.ts` line 4: `import { initialUsers } from '@/mocks/data/seedData';` and lines 52-77: `setDemoRole: (role: 'Guest' | 'Member' | 'Admin') => { ... }` injecting mock tokens `mock-jwt-token-member-...` and `mock-jwt-token-admin-...`.
   - `src/components/shared/RoleSwitcherBar.tsx` lines 1-81: floating bar that triggers `setDemoRole()`.
   - `src/components/layout/RootLayout.tsx` line 6: `import { RoleSwitcherBar } from '../shared/RoleSwitcherBar';` and line 21: `<RoleSwitcherBar />`.
   - `src/pages/LoginPage.tsx` lines 58-66, 151-179: "1-Click Evaluation Profiles" buttons providing synthetic one-click login.
   - `src/pages/RegisterPage.tsx` lines 54-56, 432-455: mock credit card input simulator.
   - `src/components/shared/ImageUploadDropzone.tsx` lines 27-48: uses `setInterval` / `setTimeout` with `FileReader.readAsDataURL` to simulate upload progress instead of calling a real backend API.

4. **Legacy API Services vs Real ASP.NET Core Contract**:
   - `src/services/api/` contains 10 legacy files (`admin.api.ts`, `announcements.api.ts`, `auth.api.ts`, `categories.api.ts`, `contests.api.ts`, `faqs.api.ts`, `feedback.api.ts`, `recipes.api.ts`, `tips.api.ts`, `users.api.ts`).
   - The backend contract in `ORIGINAL_REQUEST.md` requires 16 typed resource modules under `src/api/` targeting PascalCase ASP.NET Core controllers: `/api/Auth`, `/api/Announcement`, `/api/Category`, `/api/Contest`, `/api/ContestSubmission`, `/api/FAQ`, `/api/Feedback`, `/api/Ingredient`, `/api/Media`, `/api/Recipe`, `/api/RecipeIngredient`, `/api/Role`, `/api/SiteFeedback`, `/api/Subscription`, `/api/Tip`, `/api/User`.

---

## 2. Logic Chain

1. **MSW Independence**: Because `src/main.tsx` explicitly calls `await enableMocking()` before mounting React (`src/main.tsx:10`), every outgoing browser fetch is currently intercepted by MSW handlers (`src/mocks/handlers/index.ts`) before reaching the network.
2. **Direct Root Mount**: Removing `enableMocking()` and mounting the React root directly in `src/main.tsx` allows requests to hit the actual network/backend.
3. **Store & Component Decoupling**: Outside the `src/mocks/` directory, only `src/store/authStore.ts` imports from `src/mocks/data/seedData` (`src/store/authStore.ts:4`).
4. **Clean Removal**: Removing `setDemoRole` and the `seedData` import from `authStore.ts`, removing `<RoleSwitcherBar />` from `RootLayout.tsx`, and removing the demo login buttons from `LoginPage.tsx` completely severs the frontend from the mock ecosystem.
5. **API Client Alignment**: The existing `src/services/apiClient.ts` already has basic token attaching and 401 handling, but needs to be configured with the live backend base URL `http://jamesthewrecipe.runasp.net`. Moving from 10 legacy files to the 16 OpenAPI-compliant modules in `src/api/` will satisfy all requirements without legacy mock residue.
6. **Build Compatibility**: `package.json`, `vite.config.ts`, and `tsconfig.app.json` will continue to compile cleanly via `tsc -b && vite build` once mock files are deleted and all imports are updated to `@/api/*`.

---

## 3. Caveats

- **Missing Backend Endpoints**: As noted in `ORIGINAL_REQUEST.md` (lines 44-46), the live ASP.NET Core backend does not have public self-registration endpoints (`POST /api/Auth/Register` or similar). The UI in `RegisterPage.tsx` must gracefully inform the user of this constraint rather than faking mock success.
- **Media Upload Flow**: Recipe creation requires a two-step flow (`POST /api/Media` with `ImagePath` form-data, followed by `POST /api/Recipe` with `imagePaths: string[]`). `ImageUploadDropzone` must be updated accordingly.

---

## 4. Conclusion

All mock and synthetic artifacts in the repository have been cataloged with exact file paths and line numbers in `mock_cleanup_report.md`. The removal strategy is clearly defined:
1. Delete `public/mockServiceWorker.js`, `src/mocks/` (entire directory), and uninstall `msw`.
2. Clean `src/main.tsx`, `src/store/authStore.ts`, `src/components/layout/RootLayout.tsx`, `src/pages/LoginPage.tsx`, and `src/components/shared/ImageUploadDropzone.tsx`.
3. Create the 16 live API modules under `src/api/` and update hooks in `src/hooks/`.

---

## 5. Verification Method

To independently verify this inventory:
1. Check `src/main.tsx` to inspect `enableMocking` usage.
2. Check `src/store/authStore.ts` to inspect `initialUsers` and `setDemoRole`.
3. Check `src/components/shared/ImageUploadDropzone.tsx` to inspect fake upload simulation.
4. Review detailed findings in `c:/Users/akela/Downloads/eproject/.agents/explorer_mock_1/mock_cleanup_report.md`.
