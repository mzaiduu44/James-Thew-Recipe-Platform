# Original User Request

## 2026-08-23T10:23:51Z

Refactor the James Thew recipe platform frontend (React 18, TanStack Query, Zustand, Tailwind, Framer Motion) to completely replace all mock data and MSW mocking with a typed API client and live TanStack Query hooks integrated against the live ASP.NET Core backend.

Working directory: c:/Users/akela/Downloads/eproject
Integrity mode: development
Backend Base URL: http://jamesthewrecipe.runasp.net
Swagger Specification: http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json

## Requirements

### R1. Complete Mock Removal & Cleanup
- Remove all mock service workers (MSW), mock database files, seed datasets, synthetic delays, and hardcoded fixture arrays across all pages, components, and services.
- Ensure the application boots directly against live network requests without any mock interception in `src/main.tsx` or elsewhere.

### R2. Centralized Typed API Client & Resource Modules
- Create a centralized HTTP client (`src/api/client.ts` or `src/services/apiClient.ts`) configured with `baseURL: http://jamesthewrecipe.runasp.net`.
- Automatically attach `Authorization: Bearer <token>` from the Zustand auth store for all authenticated requests (all routes except `POST /api/Auth`).
- Intercept HTTP `401 Unauthorized` responses to clear auth state and redirect the user to `/login`.
- Export strongly-typed endpoint functions and matching TanStack Query hooks (queries and mutations with appropriate query cache invalidation) organized into modular resource files under `src/api/` for:
  - `auth.ts` (`POST /api/Auth`)
  - `announcements.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Announcement`)
  - `categories.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Category`)
  - `contests.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Contest`)
  - `contestSubmissions.ts` (`GET`, `POST`, `GET /:id`, `DELETE /:id`, `PUT /winner/:submissionId` `/api/ContestSubmission`)
  - `faq.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/FAQ`)
  - `feedback.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Feedback`)
  - `ingredients.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Ingredient`)
  - `media.ts` (`POST /api/Media` with `multipart/form-data` and form field `ImagePath`)
  - `recipes.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Recipe`)
  - `recipeIngredients.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/RecipeIngredient`)
  - `roles.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Role`)
  - `siteFeedback.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/SiteFeedback`)
  - `subscriptions.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Subscription`)
  - `tips.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/Tip`)
  - `users.ts` (`GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id` `/api/User`)

### R3. Exact Backend Payload & Schema Compliance
- Follow the live OpenAPI schemas and backend constraints exactly:
  - **Media Upload**: Execute two-step recipe creation/updation: upload selected image files individually to `POST /api/Media` (`ImagePath` form field), collect returned path strings, and pass them as `imagePaths: string[]` in the recipe payload.
  - **RecipeIngredient Discrepancy**: Handle distinct create payload (`{ recipeName, recipeitem: [{ ingredientName, quantity, profileImage }] }`) vs update payload (`{ id, recipeName, ingredientName, quantity, profileImage }`).
  - **Subscription Updation**: Send `{ planType, amount }` without `id` or `userId` in the PUT body (id passed via route parameter only).
  - **Missing Backend Endpoints**: For unimplemented endpoints (such as public self-registration or token refresh), disable or clearly mark the UI as not yet supported by the backend instead of faking mock success.
  - **Defensive Response Handling**: Safely handle undocumented GET response formats from ASP.NET Core endpoints.

### R4. UI & Store Integration
- Connect all public and admin pages, tables, dialogs, filters, and forms (Recipes, Tips, Contests, Submissions, Announcements, FAQs, Feedback, Admin Dashboard, Users, Subscriptions) to the TanStack Query hooks.
- Manage client-only state (modals, filters, form drafts) in Zustand or local React state while server state resides exclusively in TanStack Query.

## Acceptance Criteria

### Mock Elimination
- [ ] No files in `src/mocks` remain active or imported in `src/main.tsx` or any application component.
- [ ] Zero static dummy recipe/contest/tip arrays used as fallback or initial render data in application views.

### API Client & Resources
- [ ] Central HTTP client automatically attaches the stored Bearer token to headers on requests.
- [ ] A 401 response from the server purges the token from the Zustand store and routes to `/login`.
- [ ] All 16 resource modules are created under `src/api/` with typed query/mutation hooks.
- [ ] Mutations trigger appropriate `queryClient.invalidateQueries` calls upon success.

### Feature Integration & Data Flow
- [ ] Recipe creation uploads images to `POST /api/Media` using `ImagePath` before submitting the recipe.
- [ ] Recipe ingredients create and update mutations send their respective conforming payloads.
- [ ] Admin management pages (Contests, FAQs, Announcements, Feedback, Recipes, Tips, Users) perform live CRUD operations against the backend.
- [ ] Contest winner selection correctly invokes `PUT /api/ContestSubmission/winner/{submissionId}`.
- [ ] All forms provide user feedback on error/success states without mock delays.

### Build & Verification
- [ ] Project builds cleanly via `npm run build` with zero TypeScript compilation errors.
- [ ] Automated smoke tests verify live API connectivity for key resources.
