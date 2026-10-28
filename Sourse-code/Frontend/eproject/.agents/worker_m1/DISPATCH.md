## 2026-08-23T10:33:09Z

You are the Foundation & Mock Removal Worker for Milestone 1 of the James Thew recipe platform frontend refactoring.
Working directory for your metadata: c:/Users/akela/Downloads/eproject/.agents/worker_m1/
Project root: c:/Users/akela/Downloads/eproject

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task for Milestone 1 (Complete Mock Removal & Centralized Typed API Client):
1. Read `ORIGINAL_REQUEST.md`, `API_CONTRACT.md`, `.agents/spec_miner_1/api_spec_report.md`, and `.agents/explorer_mock_1/mock_cleanup_report.md`.
2. Cleanly remove all MSW setup and mock artifacts:
   - Remove `src/mocks/` directory (browser.ts, handlers.ts, server.ts, db.ts, seed.ts, etc.) and `public/mockServiceWorker.js`.
   - Clean `src/main.tsx` to eliminate any mock worker initialization / conditional MSW startup.
   - Remove mock services, fake database files, fixture arrays, and synthetic delay helpers.
   - Remove `RoleSwitcherBar` or demo mock switchers that bypass real auth.
   - Ensure `package.json` has clean dependencies.
3. Build the Centralized Typed API Client in `src/api/client.ts` (or `src/services/apiClient.ts` / `src/api/index.ts`):
   - BaseURL: `http://jamesthewrecipe.runasp.net` (configurable via `VITE_API_BASE_URL` with default).
   - Request Interceptor: Automatically attach `Authorization: Bearer <token>` from the Zustand auth store (`useAuthStore`) when available.
   - Response Interceptor: Catch 401 Unauthorized responses -> clear auth state -> redirect to `/login`.
   - Defensive error handling: Standardize error messages from ASP.NET Core ProblemDetails / string errors.
4. Create complete TypeScript interfaces in `src/types/api.ts` for all 16 backend resources and DTOs:
   - Auth: LoginsRequest, LoginResponse / AuthUser
   - Announcement: AnnouncementDto, AnnouncementForCreation, AnnouncementForUpdation
   - Category: CategoryDto, CategoryForCreation, CategoryForUpdation
   - Contest: ContestDto, ContestForCreation, ContestForUpdation
   - ContestSubmission: ContestSubmissionDto, ContestSubmissionForCreation
   - FAQ: FAQDto, FAQForCreation, FAQForUpdation
   - Feedback: FeedbackDto, FeedbackForCreation, FeedbackForUpdation (Recipe comments)
   - SiteFeedback: SiteFeedbackDto, SiteFeedbackForCreation, SiteFeedbackForUpdation (General website feedback)
   - Ingredient: IngredientDto, IngredientForCreation, IngredientForUpdation
   - Media: MediaUploadResponse (URL / path / id)
   - Recipe: RecipeDto, RecipeForCreation, RecipeForUpdation
   - RecipeIngredient: RecIngredientForCreation ({ recipeName, recipeitem: [...] }), RecIngredientForUpdation ({ id, recipeName, ingredientName, quantity, profileImage })
   - Role: RoleDto, RoleForCreation, RoleForUpdation
   - Subscription: SubscriptionDto, SubscriptionForCreation, SubscriptionForUpdation ({ planType, amount })
   - Tip: TipDto, TipForCreation, TipForUpdation
   - User: UserDto, UserForCreation, UserForUpdation
5. Create `PROJECT.md` at project root summarizing the project architecture, feature inventory, code layout, interface contracts, and milestone roadmap.
6. Verify code compiles without broken imports.
7. Write your handoff report to `c:/Users/akela/Downloads/eproject/.agents/worker_m1/handoff.md` and send a message when complete.
