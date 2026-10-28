## 2026-08-23T10:42:57Z
You are the UI & Admin Integration Worker for James Thew recipe platform frontend refactoring.
Working directory for your metadata: c:/Users/akela/Downloads/eproject/.agents/worker_ui_1/
Project root: c:/Users/akela/Downloads/eproject

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task:
1. Read `ORIGINAL_REQUEST.md`, `API_CONTRACT.md`, `PROJECT.md`, `.agents/spec_miner_1/api_spec_report.md`, and `.agents/explorer_ui_1/ui_integration_report.md`.
2. Integrate ALL Public Views with live TanStack Query hooks from `src/api/`:
   - `HomePage`: Live stats/highlights, featured recipes from `/api/Recipe`, latest announcements from `/api/Announcement`, tips from `/api/Tip`.
   - `RecipesPage` & `RecipeDetailPage`: Fetch recipes, categories, recipe ingredients (`/api/RecipeIngredient`), recipe comments/feedback (`/api/Feedback`), recipe ratings/favorites. Support recipe creation/editing with 2-step media upload and ingredient batch linking.
   - `CategoriesPage`: Fetch and filter categories from `/api/Category`.
   - `ContestsPage` & `ContestDetailPage`: Fetch contests from `/api/Contest`, submissions from `/api/ContestSubmission`, handle user submission creation, display winner badge.
   - `TipsPage` & `FAQsPage`: Fetch tips from `/api/Tip` and FAQs from `/api/FAQ`.
   - `AnnouncementsPage`: Fetch announcements from `/api/Announcement`.
   - `FeedbackPage` & Site Feedback modal: Submit general feedback to `/api/SiteFeedback` and recipe feedback to `/api/Feedback`.
   - `LoginPage` & `RegisterPage`: Login via `/api/Auth` (POST LoginsRequest `{ email, password }`), Register via `/api/User` (POST UserForCreation `{ name, email, password, roleId: 2 }`).
   - `ProfilePage` & Subscription modal: Fetch user profile, allow plan selection and subscription update via `PUT /api/Subscription/{id}` (`{ planType, amount }`).
3. Integrate ALL Admin Views, Tables, Modals & Forms:
   - `AdminDashboard`: Compute live statistics (total recipes, total users, pending contests, feedback count, etc.) by aggregating live queries from `/api/Recipe`, `/api/User`, `/api/Contest`, `/api/Feedback`.
   - `AdminRecipes` & `RecipeForm`: Full CRUD with 2-step media upload and RecipeIngredient integration (`POST /api/RecipeIngredient`).
   - `AdminCategories` & `CategoryForm`: Full CRUD for categories.
   - `AdminIngredients` & `IngredientForm`: Full CRUD for ingredients (`/api/Ingredient`).
   - `AdminContests` & `ContestForm`: Full CRUD for contests, durationDays calculation, view submissions, and declare winner via `PUT /api/ContestSubmission/winner/{submissionId}`.
   - `AdminUsers` & `UserForm`: Full CRUD for users (`/api/User`), role selection (`/api/Role`).
   - `AdminRoles`: View and manage roles (`/api/Role`).
   - `AdminMedia`: View and upload media via `POST /api/Media`.
   - `AdminFeedback` & `AdminAnnouncements` & `AdminFAQs` & `AdminTips`: Full CRUD moderation tables.
4. Handle Unsupported Endpoints & UI Indicators:
   - Where backend does not support certain operations (e.g. `PUT /api/ContestSubmission/{id}` without winner, `POST /api/Auth/refresh`, server-side search endpoints), provide clear visual indicators (read-only badges, disabled action buttons with tooltips, client-side filtering/search).
5. Defensive Data Handling:
   - Ensure all components safely unpack arrays and handle null/empty responses gracefully (`Array.isArray(...) ? ... : []`).
   - Add loading skeletons / spinners, error alerts, and empty state illustrations.
6. Verify:
   - Run `npm run build` to ensure 0 TypeScript errors.
   - Run `node scripts/verify-api.mjs` to ensure all tests pass.
7. Write your handoff report to `c:/Users/akela/Downloads/eproject/.agents/worker_ui_1/handoff.md` and send a message when complete.
