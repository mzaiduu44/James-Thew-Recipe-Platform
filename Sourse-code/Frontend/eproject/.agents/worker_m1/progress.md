# Progress Log - Milestone 1 Foundation & Mock Removal

**Last visited**: 2026-08-23T15:43:00Z

## Completed Tasks
1. Cleanly removed all MSW files and mock artifacts:
   - Deleted `public/mockServiceWorker.js`
   - Deleted `src/mocks/` directory (`browser.ts`, `handlers/`, `mockDb.ts`, `data/seedData.ts`)
   - Deleted `src/components/shared/RoleSwitcherBar.tsx`
   - Cleaned `src/main.tsx` to mount React directly without `enableMocking()`
   - Cleaned `src/store/authStore.ts` to remove `initialUsers` and `setDemoRole`
   - Cleaned `src/components/layout/RootLayout.tsx` to remove `RoleSwitcherBar`
   - Cleaned `src/pages/LoginPage.tsx` to remove demo login bypass buttons
   - Cleaned `package.json` to remove `msw` dependencies and config
2. Built Centralized Typed API Client:
   - Created `src/api/client.ts` with baseURL `http://jamesthewrecipe.runasp.net` (configurable via `VITE_API_BASE_URL`)
   - Added Request Interceptor attaching `Authorization: Bearer <token>` from `useAuthStore`
   - Added Response Interceptor catching 401 Unauthorized, clearing auth state, and redirecting to `/login`
   - Added `getApiErrorMessage` standardizing ProblemDetails, validation errors, and strings
   - Updated `src/services/apiClient.ts` to re-export central client
3. Created Complete TypeScript Interfaces in `src/types/api.ts`:
   - DTOs and mutation payloads for all 16 backend resources (Auth, Announcement, Category, Contest, ContestSubmission, FAQ, Feedback, SiteFeedback, Ingredient, Media, Recipe, RecipeIngredient, Role, Subscription, Tip, User)
   - Pagination and query parameters
4. Implemented 16 Modular API Resource Modules in `src/api/`:
   - `auth.ts`, `announcements.ts`, `categories.ts`, `contests.ts`, `contestSubmissions.ts`, `faq.ts`, `feedback.ts`, `ingredients.ts`, `media.ts`, `recipes.ts`, `recipeIngredients.ts`, `roles.ts`, `siteFeedback.ts`, `subscriptions.ts`, `tips.ts`, `users.ts`
   - Integrated with TanStack Query hooks and invalidation
5. Updated `ImageUploadDropzone.tsx` to use live `POST /api/Media` (`ImagePath` form field).
6. Created `PROJECT.md` at root summarizing architecture, feature inventory, layout, contracts, and roadmap.
7. Verification:
   - `tsc -b && vite build` passed cleanly with 0 errors.
   - `node scripts/verify-api.mjs` passed 71/71 automated smoke verification checks.
