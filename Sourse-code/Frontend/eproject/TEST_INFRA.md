# Test Infrastructure & Verification Specification

**Project**: James Thew Culinary Salon & Recipe Platform  
**Target Backend**: ASP.NET Core Web API 8/9 (`http://jamesthewrecipe.runasp.net`)  
**Swagger Contract**: `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json`  
**Document Version**: 1.0.0  
**Author**: E2E & Smoke Test Suite Engineer  

---

## 1. Overview & Testing Philosophy

This test infrastructure specification establishes an automated, multi-tiered verification framework designed to guarantee the integrity of the frontend refactoring from legacy Mock Service Worker (MSW) mocks to the live ASP.NET Core backend.

The testing strategy operates on four complementary tiers:

```
+-----------------------------------------------------------------------+
|                       Tier 4: Build Hygiene                           |
|       TypeScript Compilation (tsc -b) & Production Vite Bundling      |
+-----------------------------------------------------------------------+
|                  Tier 3: E2E Smoke Network Probing                    |
|      Live HTTP Status & Response Verification against ASP.NET Core    |
+-----------------------------------------------------------------------+
|               Tier 2: Backend Payload Contract Suite                  |
|    Schema Conformance, 2-Step Media, RecipeIngredient, Subscription   |
+-----------------------------------------------------------------------+
|              Tier 1: Static Architectural & Mock Audit                |
|  16 Resource Modules, Client Config, Interceptors, 0 Mocks/MSW/Delays |
+-----------------------------------------------------------------------+
```

---

## 2. Feature & Resource Inventory (16 Modular Resources)

All API integration modules are located under `src/api/` and must expose strongly-typed API client functions alongside corresponding TanStack Query query and mutation hooks.

| # | Resource Module | Endpoints Covered | HTTP Methods | Query Hooks | Mutation Hooks |
|---|-----------------|-------------------|--------------|-------------|----------------|
| 1 | `src/api/auth.ts` | `/api/Auth` | `POST` | — | `useLoginMutation` |
| 2 | `src/api/announcements.ts` | `/api/Announcement`<br>`/api/Announcement/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useAnnouncementsQuery`<br>`useAnnouncementQuery` | `useCreateAnnouncementMutation`<br>`useUpdateAnnouncementMutation`<br>`useDeleteAnnouncementMutation` |
| 3 | `src/api/categories.ts` | `/api/Category`<br>`/api/Category/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useCategoriesQuery`<br>`useCategoryQuery` | `useCreateCategoryMutation`<br>`useUpdateCategoryMutation`<br>`useDeleteCategoryMutation` |
| 4 | `src/api/contests.ts` | `/api/Contest`<br>`/api/Contest/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useContestsQuery`<br>`useContestQuery` | `useCreateContestMutation`<br>`useUpdateContestMutation`<br>`useDeleteContestMutation` |
| 5 | `src/api/contestSubmissions.ts` | `/api/ContestSubmission`<br>`/api/ContestSubmission/{id}`<br>`/api/ContestSubmission/winner/{submissionId}` | `GET`, `POST`, `GET`, `DELETE`, `PUT` | `useContestSubmissionsQuery`<br>`useContestSubmissionQuery` | `useCreateContestSubmissionMutation`<br>`useDeleteContestSubmissionMutation`<br>`useSelectWinnerMutation` |
| 6 | `src/api/faq.ts` | `/api/FAQ`<br>`/api/FAQ/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useFaqsQuery`<br>`useFaqQuery` | `useCreateFaqMutation`<br>`useUpdateFaqMutation`<br>`useDeleteFaqMutation` |
| 7 | `src/api/feedback.ts` | `/api/Feedback`<br>`/api/Feedback/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useFeedbackQuery`<br>`useFeedbackItemQuery` | `useCreateFeedbackMutation`<br>`useUpdateFeedbackMutation`<br>`useDeleteFeedbackMutation` |
| 8 | `src/api/ingredients.ts` | `/api/Ingredient`<br>`/api/Ingredient/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useIngredientsQuery`<br>`useIngredientQuery` | `useCreateIngredientMutation`<br>`useUpdateIngredientMutation`<br>`useDeleteIngredientMutation` |
| 9 | `src/api/media.ts` | `/api/Media` | `POST` (`multipart/form-data`) | — | `useUploadMediaMutation` |
| 10 | `src/api/recipes.ts` | `/api/Recipe`<br>`/api/Recipe/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useRecipesQuery`<br>`useRecipeQuery` | `useCreateRecipeMutation`<br>`useUpdateRecipeMutation`<br>`useDeleteRecipeMutation` |
| 11 | `src/api/recipeIngredients.ts` | `/api/RecipeIngredient`<br>`/api/RecipeIngredient/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useRecipeIngredientsQuery`<br>`useRecipeIngredientQuery` | `useCreateRecipeIngredientMutation`<br>`useUpdateRecipeIngredientMutation`<br>`useDeleteRecipeIngredientMutation` |
| 12 | `src/api/roles.ts` | `/api/Role`<br>`/api/Role/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useRolesQuery`<br>`useRoleQuery` | `useCreateRoleMutation`<br>`useUpdateRoleMutation`<br>`useDeleteRoleMutation` |
| 13 | `src/api/siteFeedback.ts` | `/api/SiteFeedback`<br>`/api/SiteFeedback/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useSiteFeedbackQuery`<br>`useSiteFeedbackItemQuery` | `useCreateSiteFeedbackMutation`<br>`useUpdateSiteFeedbackMutation`<br>`useDeleteSiteFeedbackMutation` |
| 14 | `src/api/subscriptions.ts` | `/api/Subscription`<br>`/api/Subscription/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useSubscriptionsQuery`<br>`useSubscriptionQuery` | `useCreateSubscriptionMutation`<br>`useUpdateSubscriptionMutation`<br>`useDeleteSubscriptionMutation` |
| 15 | `src/api/tips.ts` | `/api/Tip`<br>`/api/Tip/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useTipsQuery`<br>`useTipQuery` | `useCreateTipMutation`<br>`useUpdateTipMutation`<br>`useDeleteTipMutation` |
| 16 | `src/api/users.ts` | `/api/User`<br>`/api/User/{id}` | `GET`, `POST`, `GET`, `PUT`, `DELETE` | `useUsersQuery`<br>`useUserQuery` | `useCreateUserMutation`<br>`useUpdateUserMutation`<br>`useDeleteUserMutation` |

---

## 3. Central Client Specification (`src/api/client.ts`)

The centralized Axios client must adhere to the following contract:

1. **Base URL Configuration**:
   - `baseURL`: `http://jamesthewrecipe.runasp.net` (or dynamically configurable via `import.meta.env.VITE_API_BASE_URL` with default fallback to `http://jamesthewrecipe.runasp.net`).
2. **Request Interceptor (Bearer Token)**:
   - For all outgoing requests (except unauthenticated public routes), inspect Zustand `authStore` or `localStorage`.
   - If a valid JWT token exists, inject header: `Authorization: Bearer <token>`.
3. **Response Interceptor (401 Unauthorized Handling)**:
   - Upon receiving HTTP `401 Unauthorized`:
     - Clear the token and user state in `authStore` (`logout()` or `clearAuth()`).
     - Redirect browser navigation to `/login`.
     - Reject promise with normalized error object.
4. **Content-Type Defaults**:
   - `Content-Type: application/json` for standard requests.
   - Automatic boundary management for `multipart/form-data` in media uploads.

---

## 4. Backend Payload Contract Assertions

The verification suite validates exact payload schemas against ASP.NET Core model binding rules:

### 4.1 Two-Step Media Upload Flow
- **Step 1**: Binary file is sent to `POST /api/Media` via `multipart/form-data` with exact form field name `ImagePath`.
- **Step 2**: The returned path/URL string is collected and supplied in creation/updation DTOs (e.g. `imagePaths: string[]` in `RecipeForCreation` / `RecipeForUpdation`, or `profileImage: string` in other entities).

### 4.2 RecipeIngredient Batch vs Item Asymmetry
- **Batch Creation (`POST /api/RecipeIngredient`)**:
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
- **Single Row Update (`PUT /api/RecipeIngredient/{id}`)**:
  ```typescript
  {
    id: number;
    recipeName?: string;
    ingredientName?: string;
    quantity?: string;
    profileImage?: string;
  }
  ```

### 4.3 Subscription Update Body Constraints
- **`PUT /api/Subscription/{id}`**:
  - URL parameter: `id` (int32).
  - Request Body: strictly `{ planType: 'Weekly' | 'Monthly' | 'Yearly', amount: number }`.
  - Body must **NOT** contain `id` or `userId` (prevents model binding / schema validation rejection).

### 4.4 Contest Winner Selection
- **`PUT /api/ContestSubmission/winner/{submissionId}`**:
  - Invoked with target `submissionId` in URL path.
  - Requires no request body.

---

## 5. Mock Elimination & Hygiene Gates

The automated verification suite scans all source files (`src/**/*.{ts,tsx,js,jsx}`) and public assets to ensure total removal of mock infrastructure:

| Audit Check | Failure Condition | Target Threshold |
|:---|:---|:---|
| **MSW Engine Imports** | Any import from `msw`, `msw/browser`, `msw/node` | **0 occurrences** |
| **Mock Browser Setup** | Existence of `src/mocks/browser.ts` or `public/mockServiceWorker.js` | **0 files** |
| **Mock Database** | Existence of `src/mocks/mockDb.ts` or `src/mocks/data/seedData.ts` | **0 files** |
| **Mock Handlers** | Existence of `src/mocks/handlers/` | **0 files** |
| **Main.tsx Mock Mount** | Any call to `enableMocking()` or `prepareApp()` mock delay in `src/main.tsx` | **0 occurrences** |
| **Synthetic Latency** | Any `delay(...)`, `setTimeout` / `setInterval` fake progress simulations | **0 occurrences** |
| **Demo Role Switcher** | Any `setDemoRole()` action or `<RoleSwitcherBar />` in layout | **0 occurrences** |

---

## 6. Verification Thresholds & Gate Matrix

To be certified **TEST_READY** and pass release verification, all criteria must be 100% satisfied:

| Metric / Check | Required Threshold | Verification Mechanism |
|:---|:---|:---|
| **API Resource Coverage** | 16/16 resource modules exist | Automated file & AST scanner |
| **Query & Mutation Exports** | 100% typed query & mutation hooks exported | Verification script / TypeScript AST |
| **Client Interceptors** | Bearer token + 401 redirect verified | Structural regex & AST check |
| **Payload Contracts** | Media form field `ImagePath`, RecIngredient shapes, Subscription PUT shape | AST type assertion suite |
| **Mock Absence** | 0 MSW files, 0 mock handlers, 0 mock DBs | Directory & AST search |
| **TypeScript Compilation** | 0 errors (`tsc -b`) | Node build script |
| **Vite Bundle Build** | Clean production bundle generated | `npm run build` |

---

## 7. Execution Instructions

Run the automated verification suite using:

```bash
# Run the automated verification test script
node scripts/verify-api.mjs

# Run full TypeScript compiler and Vite production build
npm run build
```
