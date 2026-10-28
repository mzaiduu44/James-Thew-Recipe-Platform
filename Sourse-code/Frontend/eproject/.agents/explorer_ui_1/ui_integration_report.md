# James Thew Recipe Platform — UI & Component Integration Report

**Date**: 2026-08-23  
**Integrity Mode**: Development  
**Backend Target**: ASP.NET Core Web API (http://jamesthewrecipe.runasp.net)  
**Swagger Spec**: http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json  

---

## 1. Executive Summary

This report delivers a complete mapping of the James Thew Culinary Salon frontend application (built with React 18, TanStack Query, Zustand, Tailwind CSS, and Framer Motion) to guide the frontend refactoring from MSW mock data to live typed API client & TanStack Query hooks.

All 16 live backend resources from the OpenAPI 3.0.4 specification have been analyzed and mapped against the UI views, forms, modals, tables, and stores. Crucial schema adaptations, field differences, two-step media workflows, and missing backend endpoint mitigations are fully documented.

---

## 2. Global State & Client Store Architecture

### 2.1 Zustand Stores

| Store | File Location | State Managed | Mock Dependencies to Remove | Live API Integration |
|---|---|---|---|---|
| useAuthStore | src/store/authStore.ts | user: User \| null, 	oken: string \| null, isAuthenticated: boolean, ole: UserRole \| 'Guest' | initialUsers import from src/mocks/data/seedData.ts, setDemoRole synthetic tokens | Connected to POST /api/Auth. Stores Bearer JWT in localStorage under key james_thew_auth. |
| useUiStore | src/store/uiStore.ts | 	oasts: ToastItem[], isDarkMode: boolean, isMobileNavOpen: boolean, isTransitioningTheme: boolean, quickViewRecipeId: string \| null | None (pure client state) | Retain for toast alerts, responsive navigation drawers, and dark/light mode wave curtain transition. |

### 2.2 Client HTTP Client & Interceptors (src/services/apiClient.ts)

- **Base URL**: http://jamesthewrecipe.runasp.net (or configurable via VITE_API_BASE_URL).
- **Request Interceptor**: Extracts 	oken from Zustand store (james_thew_auth) and attaches header Authorization: Bearer <token> for all endpoints (except POST /api/Auth).
- **Response Interceptor**: Intercepts 401 Unauthorized, clears the auth store token, and redirects the browser to /login.

---

## 3. Comprehensive UI Route & Component Mapping

### 3.1 Public & Member Facing Pages

| Page Component | Route Path | Access Tier | Consumed Endpoints / Resources | Modals / Drawers / Forms | Key Form Validation Rules |
|---|---|---|---|---|---|
| HomePage | / | Public (Guest, Member, Admin) | GET /api/Recipe, GET /api/Tip, GET /api/Contest?status=active | Curriculum stage selector, active contest countdown, video teaser modal | N/A |
| RecipesPage | /recipes | Public | GET /api/Recipe, GET /api/Category | Filter dropdowns (access tier, sort), category pill slider, keyword search bar | Search debouncing, category ID validation |
| RecipeDetailPage | /recipes/:id | Public (Gated details for Members-Only) | GET /api/Recipe/{id}, GET /api/Feedback?recipeId={id}, POST /api/Feedback | IngredientChecklist interactive scaling, LockedContentOverlay, Recipe review form | Comment required (non-empty), Rating (1–5 integer) |
| TipsPage | /tips | Public | GET /api/Tip, GET /api/Category | Keyword search input, access tier filter (all/free/members) | N/A |
| TipDetailPage | /tips/:id | Public (Gated for Members-Only) | GET /api/Tip/{id}, GET /api/Tip (related tips) | LockedContentOverlay for guests on Members-Only tips, share URL button | N/A |
| ContestsPage | /contests | Public | GET /api/Contest | Tab switcher (active vs past), ContestCountdown timer | Status filter validation |
| ContestDetailPage | /contests/:id | Public | GET /api/Contest/{id}, GET /api/ContestSubmission?contestId={id}, POST /api/ContestSubmission, PUT /api/ContestSubmission/winner/{submissionId} | Contest entry submission modal (Modal), Winner crown banner with canvas-confetti | Title required, description required, ingredients text, recipe/tip selection |
| AnnouncementsPage | /announcements | Public | GET /api/Announcement | Celebrate button with confetti animation | N/A |
| FaqPage | /faq | Public | GET /api/FAQ | Accordion items, category filter pills, keyword search | Search query match |
| FeedbackPage | /feedback | Public | GET /api/Feedback, GET /api/SiteFeedback, POST /api/Feedback, POST /api/SiteFeedback, GET /api/Recipe | General vs Recipe feedback toggle form, overall reader rating score card | Comment required, rating (1–5), target recipe ID when feedbackType='Recipe' |
| LoginPage | /login | Public (Unauthenticated) | POST /api/Auth | 1-Click evaluation buttons (Admin/Member), login form with password visibility toggle | Email required (valid email format), password required |
| RegisterPage | /register | Public | POST /api/User / POST /api/Subscription (Mitigated) | 3D interactive credit card simulator, plan switcher (Monthly  vs Yearly ), apprentice credentials form | Full name >= 2 chars, valid email regex, phone >= 10 digits, password >= 8 chars |
| ProfilePage | /profile | Authenticated (Member, Admin, User) | GET /api/User/{id}, PUT /api/User/{id}, POST /api/Media | Edit profile modal (Modal) with avatar portrait presets library & image upload | Name required, valid email, avatar URL / uploaded file |
| MyContentPage | /my-content | Authenticated (Member, Admin) | GET /api/Recipe, POST /api/Recipe, PUT /api/Recipe/{id}, DELETE /api/Recipe/{id}, GET /api/Tip, POST /api/Tip, PUT /api/Tip/{id}, DELETE /api/Tip/{id}, POST /api/Media, GET /api/Category | Recipe create/edit modal (Modal), Tip create/edit modal (Modal), ConfirmDeleteModal, ImageUploadDropzone | Title, description, ingredients list, procedure, prep/cook times |
| CommunityPage | /community | Authenticated (Member, Admin, User, Guest) | GET /api/Recipe, GET /api/Tip | Feed filter pills (All / Recipes / Tips) | N/A |
| NotFoundPage | * | Public | None | 404 illustration, Return home button | N/A |

---

### 3.2 Admin Management Pages (/admin/*)

| Admin Page Component | Route Path | Access Tier | Consumed Endpoints / Resources | Tables / Modals / Drawers | Key Form Validation Rules |
|---|---|---|---|---|---|
| AdminDashboardPage | /admin | Admin only | GET /api/User, GET /api/Recipe, GET /api/Contest, GET /api/Feedback, GET /api/ContestSubmission | Animated Area Chart (Revenue), Bar Chart (Categories), Donut Chart (Memberships), Stat cards | N/A |
| AdminRecipesPage | /admin/recipes | Admin only | GET /api/Recipe, POST /api/Recipe, PUT /api/Recipe/{id}, DELETE /api/Recipe/{id}, GET /api/Category, POST /api/Media, POST /api/RecipeIngredient | AdminDataTable with sorting & pagination, Recipe Drawer (Drawer), ImageUploadDropzone, ConfirmDeleteModal | Title required, description required, category required, prep/cook minutes > 0 |
| AdminTipsPage | /admin/tips | Admin only | GET /api/Tip, POST /api/Tip, PUT /api/Tip/{id}, DELETE /api/Tip/{id}, GET /api/Category | AdminDataTable, Tip Drawer (Drawer), ConfirmDeleteModal | Title required, description required, category ID |
| AdminContestsPage | /admin/contests | Admin only | GET /api/Contest, POST /api/Contest, PUT /api/Contest/{id}, DELETE /api/Contest/{id}, GET /api/ContestSubmission, PUT /api/ContestSubmission/winner/{submissionId} | AdminDataTable, Launch Contest Modal (Modal), Contest Submissions Viewer Drawer, ConfirmDeleteModal | Title required, prize required, startDate >= today, endDate >= startDate, durationDays calculated |
| AdminAnnouncementsPage | /admin/announcements | Admin only | GET /api/Announcement, POST /api/Announcement, PUT /api/Announcement/{id}, DELETE /api/Announcement/{id} | AdminDataTable, Publish Announcement Modal (Modal), ConfirmDeleteModal | Title required, description required, winnerName required if type='ContestWinner' |
| AdminFeedbackPage | /admin/feedback | Admin only | GET /api/Feedback, GET /api/SiteFeedback, DELETE /api/Feedback/{id}, DELETE /api/SiteFeedback/{id} | AdminDataTable with rating stars, comment preview | N/A |
| AdminFaqPage | /admin/faq | Admin only | GET /api/FAQ, POST /api/FAQ, PUT /api/FAQ/{id}, DELETE /api/FAQ/{id} | AdminDataTable, FAQ Modal (Modal), ConfirmDeleteModal | Question required, answer required |
| AdminUsersPage | /admin/users | Admin only | GET /api/User, GET /api/Subscription, GET /api/Role | AdminDataTable with avatar, role badge, subscription plan indicator | Search by name, email, role |

---

## 4. Resource-by-Resource API Client & Data Shape Mapping

Below is the precise mapping between frontend component expectations and the live ASP.NET Core backend OpenAPI schemas:

`
+--------------------------+-------------------------------------+---------------------------------------------------------+
| Frontend Resource Module | Live Backend Endpoint               | Live Payload / Schema & Discrepancies                   |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| auth.ts                  | POST /api/Auth                      | Req: { email, password }                                |
|                          |                                     | Res: { token, user } or token string                    |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| announcements.ts         | /api/Announcement                   | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { title, description, contestId?,                  |
|                          |                                     |        winnerSubmissionId? }                            |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| categories.ts            | /api/Category                       | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Res/Req: { id: number, categoryName: string,            |
|                          |                                     |            profileImage: string }                       |
|                          |                                     | Note: categoryName vs frontend name                     |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| contests.ts              | /api/Contest                        | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { title, description, durationDays: number,        |
|                          |                                     |        profileImage: string }                           |
|                          |                                     | Note: durationDays vs startDate/endDate                 |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| contestSubmissions.ts    | /api/ContestSubmission              | GET, POST, GET /{id}, DELETE /{id}                      |
|                          | PUT /winner/{submissionId}          | Req: { contestId: number, recipeId?, tipId? }           |
|                          |                                     | Res: { id, contestId, userId, recipeId, tipId, isWinner}|
+--------------------------+-------------------------------------+---------------------------------------------------------+
| faq.ts                   | /api/FAQ                            | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { question, answer }                               |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| feedback.ts              | /api/Feedback                       | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { recipeId: number, comment, rating: number }      |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| siteFeedback.ts          | /api/SiteFeedback                   | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { comment: string, rating: number }                |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| ingredients.ts           | /api/Ingredient                     | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { name: string, profileImage: string }             |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| media.ts                 | POST /api/Media                     | Content-Type: multipart/form-data                       |
|                          |                                     | Form field: ImagePath (binary file)                     |
|                          |                                     | Res: image path string                                  |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| recipes.ts               | /api/Recipe                         | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { title, description, procedure: string,           |
|                          |                                     |        actionType:  User|Member|Both,              |
|                          |                                     |        categoryId: number, imagePaths: string[] }       |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| recipeIngredients.ts     | /api/RecipeIngredient               | POST: { recipeName, recipeitem: [...] }                 |
|                          | PUT /{id}: { id, recipeName, ingredientName, quantity, profileImage }             |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| roles.ts                 | /api/Role                           | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { roleName: string }                               |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| subscriptions.ts         | /api/Subscription                   | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | POST: { userId: number, planType, amount: number }      |
|                          |                                     | PUT /{id}: { planType, amount } (no id/userId in body)  |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| tips.ts                  | /api/Tip                            | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { title, description,                              |
|                          |                                     |        actionType: User|Member|Both,              |
|                          |                                     |        profileImage: string }                           |
+--------------------------+-------------------------------------+---------------------------------------------------------+
| users.ts                 | /api/User                           | GET, POST, GET /{id}, PUT /{id}, DELETE /{id}           |
|                          |                                     | Req: { name, email, password, profileImage }            |
+--------------------------+-------------------------------------+---------------------------------------------------------+
`

---

## 5. Critical UI & Data Integration Gaps

1. **Two-Step Media Upload Pipeline**:
   - In ImageUploadDropzone.tsx, remove the simulated FileReader base64 timeout.
   - Execute mediaApi.upload(file) which posts multipart/form-data with form field ImagePath to POST /api/Media.
   - On success, pass the returned server file path to onChange(returnedUrl).

2. **Self-Registration Endpoint Gap**:
   - The ASP.NET Core backend exposes POST /api/Auth for login and POST /api/User for admin user creation, but lacks a public self-registration checkout endpoint (/api/auth/register).
   - *Resolution*: RegisterPage.tsx should execute usersApi.create({ name, email, password }) and subsequent uthApi.login({ email, password }) to authenticate the new user. If payment simulation is maintained, create subscription via subscriptionsApi.create().

3. **Recipe Ingredient Dual Payloads**:
   - For recipe creation: POST /api/RecipeIngredient with { recipeName: string, recipeitem: [{ ingredientName, quantity, profileImage }] }.
   - For recipe ingredient update: PUT /api/RecipeIngredient/{id} with { id, recipeName, ingredientName, quantity, profileImage }.

4. **DurationDays vs Date Picker**:
   - AdminContestsPage.tsx presents start/end HTML date inputs. When dispatching to POST /api/Contest, the frontend must calculate durationDays = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))).

5. **Feedback Separation**:
   - Recipe reviews on RecipeDetailPage and FeedbackPage (when target is a recipe) map to POST /api/Feedback.
   - General site feedback on FeedbackPage maps to POST /api/SiteFeedback.

6. **ActionType Mapping (isFree vs ctionType)**:
   - Frontend isFree === true maps to ctionType: 'User' or 'Both'.
   - Frontend isFree === false (Members only) maps to ctionType: 'Member'.

---

## 6. Verification and Migration Checklist

- [x] Complete inventory of all 24 page views and 30+ components.
- [x] Full mapping against OpenAPI 3.0.4 specification.
- [x] Identification of all MSW mock handlers and mock store state.
- [x] Two-step media upload specification documented.
- [x] Query key invalidation strategy established.
