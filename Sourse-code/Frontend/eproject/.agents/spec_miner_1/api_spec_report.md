# James Thew Culinary Salon — Authoritative API Specification Report

**Document Version**: 1.0.0  
**Generated Date**: 2026-08-23  
**Target Backend**: ASP.NET Core Web API (OpenAPI 3.0.4)  
**Live Backend Base URL**: `http://jamesthewrecipe.runasp.net`  
**Swagger Source**: `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json`

---

## Executive Summary & Architecture Overview

The backend is an ASP.NET Core REST API serving the James Thew Culinary Salon platform. All protected endpoints enforce JWT Bearer authentication. All numeric identifiers (`id`, `categoryId`, `userId`, `contestId`, `recipeId`, `tipId`) are 32-bit integers (`int32`), differing from legacy frontend mock string identifiers.

### Key Architectural Guidelines
1. **Base URL Configuration**: Central Axios/fetch instance must use `baseURL: 'http://jamesthewrecipe.runasp.net'` (or `/api` with Vite reverse proxy to `http://jamesthewrecipe.runasp.net`).
2. **Authentication Flow**:
   - Login via `POST /api/Auth` with `LoginsRequest` (`{ email, password }`).
   - Requests attach header: `Authorization: Bearer <token>`.
   - Global HTTP `401 Unauthorized` interceptor clears local token/auth store and routes to `/login`.
   - Unauthenticated GET requests return `401 Unauthorized` for all endpoints except `GET /api/Role`.
3. **2-Step Media Flow**:
   - Media creation: `POST /api/Media` with `multipart/form-data` and form field `ImagePath` (binary file).
   - Server returns the stored file URL/path string.
   - The returned URL/path is subsequently passed in creation/updation DTOs (e.g. `imagePaths` in Recipe, `profileImage` in Category, Contest, Tip, Ingredient, User).
4. **RecipeIngredient DTO Discrepancy**:
   - Create payload (`RecIngredientForCreation`): `{ recipeName: string, recipeitem: [{ ingredientName, quantity, profileImage }] }` (nested batch array).
   - Update payload (`RecIngredientForUpdation`): `{ id: number, recipeName: string, ingredientName: string, quantity: string, profileImage: string }` (flat item update).
5. **Subscription Updation Payload**:
   - `PUT /api/Subscription/{id}` accepts `{ planType: PlanType, amount: number }`.
   - `id` and `userId` are omitted from the PUT body (the resource ID is passed in the URL path).
6. **Unsupported Endpoints & Gaps**:
   - No public self-registration (`POST /api/Auth/register` does not exist; user creation is `POST /api/User`).
   - No `GET /api/Auth/me` or `POST /api/Auth/refresh`.
   - No generic `PUT /api/ContestSubmission/{id}` (winner is set via `PUT /api/ContestSubmission/winner/{submissionId}`).
   - No aggregate `GET /api/admin/stats` (frontend must aggregate stats from entity list queries).

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Auth | User Login | Authenticates user credentials and returns JWT Bearer token | `POST /api/Auth`<br>Body: `LoginsRequest` `{ email, password }` | `200 OK`<br>`{ token, user? }` or token string | `400 Bad Request` on invalid schema;<br>`401 Unauthorized` on bad credentials | Swagger OpenAPI & live probe |
| 2 | Announcement | List Announcements | Retrieves list of all public/system announcements | `GET /api/Announcement` | `200 OK`<br>Array of Announcement DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 3 | Announcement | Create Announcement | Publishes a new announcement | `POST /api/Announcement`<br>Body: `AnnouncementForCreation` `{ title, description, contestId?, winnerSubmissionId? }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 4 | Announcement | Get Announcement by ID | Fetches a single announcement record | `GET /api/Announcement/{id}` (int32) | `200 OK`<br>Announcement DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 5 | Announcement | Update Announcement | Updates an existing announcement | `PUT /api/Announcement/{id}` (string path)<br>Body: `AnnouncementForUpdation` `{ id, title, description, contestId?, winnerSubmissionId? }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 6 | Announcement | Delete Announcement | Removes an announcement | `DELETE /api/Announcement/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 7 | Category | List Categories | Retrieves all recipe/content categories | `GET /api/Category` | `200 OK`<br>Array of `CategoryForListning` `{ id, categoryName, profileImage }` | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 8 | Category | Create Category | Creates a new category | `POST /api/Category`<br>Body: `CategoryForCreation` `{ categoryName, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 9 | Category | Get Category by ID | Retrieves single category details | `GET /api/Category/{id}` (int32) | `200 OK`<br>Category DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 10 | Category | Update Category | Updates category name and image | `PUT /api/Category/{id}` (int32)<br>Body: `CategoryForUpdation` `{ id, categoryName, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 11 | Category | Delete Category | Deletes category record | `DELETE /api/Category/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 12 | Contest | List Contests | Retrieves all culinary contests | `GET /api/Contest` | `200 OK`<br>Array of Contest DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 13 | Contest | Create Contest | Publishes new contest | `POST /api/Contest`<br>Body: `ContestForCreation` `{ title, description, durationDays, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 14 | Contest | Get Contest by ID | Retrieves single contest details | `GET /api/Contest/{id}` (int32) | `200 OK`<br>Contest DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 15 | Contest | Update Contest | Modifies contest title, duration, image | `PUT /api/Contest/{id}` (string path)<br>Body: `ContestForUpdation` `{ id, title, description, durationDays, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 16 | Contest | Delete Contest | Deletes contest record | `DELETE /api/Contest/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 17 | ContestSubmission | List Submissions | Lists contest submissions | `GET /api/ContestSubmission` | `200 OK`<br>Array of `ContestSubmissionForListning` `{ id, contestId, userId, recipeId?, tipId?, isWinner, submittedAt }` | `401 Unauthorized`, `500` if DB unseeded | Swagger OpenAPI & live probe |
| 18 | ContestSubmission | Submit to Contest | Submits a recipe or tip to a contest | `POST /api/ContestSubmission`<br>Body: `ContestSubmissionForCreation` `{ contestId, recipeId?, tipId? }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 19 | ContestSubmission | Get Submission by ID | Fetches single contest submission | `GET /api/ContestSubmission/{id}` (int32) | `200 OK`<br>`ContestSubmissionDto` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 20 | ContestSubmission | Delete Submission | Deletes a contest submission | `DELETE /api/ContestSubmission/{id}` (int32) | `200 OK`<br>`boolean` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 21 | ContestSubmission | Select Contest Winner | Marks submission as winner for contest | `PUT /api/ContestSubmission/winner/{submissionId}` (int32) | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 22 | FAQ | List FAQs | Lists all frequently asked questions | `GET /api/FAQ` | `200 OK`<br>Array of FAQ DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 23 | FAQ | Create FAQ | Creates a new FAQ question/answer | `POST /api/FAQ`<br>Body: `faqForCreation` `{ question, answer }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 24 | FAQ | Get FAQ by ID | Retrieves single FAQ record | `GET /api/FAQ/{id}` (int32) | `200 OK`<br>FAQ DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 25 | FAQ | Update FAQ | Updates FAQ question and answer | `PUT /api/FAQ/{id}` (string path)<br>Body: `faqForUpdation` `{ id, question, answer }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 26 | FAQ | Delete FAQ | Removes FAQ record | `DELETE /api/FAQ/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 27 | Feedback | List Feedback | Lists recipe / user feedback | `GET /api/Feedback` | `200 OK`<br>Array of Feedback DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 28 | Feedback | Create Feedback | Submits feedback for a recipe | `POST /api/Feedback`<br>Body: `FeedbackForCreation` `{ recipeId, comment, rating }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 29 | Feedback | Get Feedback by ID | Retrieves feedback by ID | `GET /api/Feedback/{id}` (int32) | `200 OK`<br>Feedback DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 30 | Feedback | Update Feedback | Updates feedback comment/rating | `PUT /api/Feedback/{id}` (string path)<br>Body: `FeedbackForUpdation` `{ id, comment, rating }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 31 | Feedback | Delete Feedback | Deletes feedback record | `DELETE /api/Feedback/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 32 | Ingredient | List Ingredients | Lists master ingredient catalog | `GET /api/Ingredient` | `200 OK`<br>Array of Ingredient DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 33 | Ingredient | Create Ingredient | Creates master ingredient | `POST /api/Ingredient`<br>Body: `IngredientForCreation` `{ name, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 34 | Ingredient | Get Ingredient by ID | Retrieves single ingredient | `GET /api/Ingredient/{id}` (int32) | `200 OK`<br>Ingredient DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 35 | Ingredient | Update Ingredient | Updates ingredient name and image | `PUT /api/Ingredient/{id}` (string path)<br>Body: `IngredientForUpdation` `{ id, name, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 36 | Ingredient | Delete Ingredient | Deletes master ingredient | `DELETE /api/Ingredient/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 37 | Media | Upload Media File | Uploads raw image file via multipart form | `POST /api/Media`<br>`multipart/form-data` with field `ImagePath` | `200 OK`<br>String URL/path | `400 Bad Request`, `401 Unauthorized`, `415 Unsupported Media Type` | Swagger OpenAPI |
| 38 | Recipe | List Recipes | Lists all recipes | `GET /api/Recipe` | `200 OK`<br>Array of Recipe DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 39 | Recipe | Create Recipe | Creates a recipe with actionType and imagePaths | `POST /api/Recipe`<br>Body: `RecipeForCreation` `{ title, description, procedure, actionType, categoryId, imagePaths }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 40 | Recipe | Get Recipe by ID | Retrieves recipe details by ID | `GET /api/Recipe/{id}` (int32) | `200 OK`<br>Recipe DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 41 | Recipe | Update Recipe | Modifies recipe details | `PUT /api/Recipe/{id}` (int32)<br>Body: `RecipeForUpdation` `{ id, title, description, procedure, actionType, categoryId, imagePaths }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 42 | Recipe | Delete Recipe | Removes recipe record | `DELETE /api/Recipe/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 43 | RecipeIngredient | List Recipe Ingredients | Lists recipe ingredient mappings | `GET /api/RecipeIngredient` | `200 OK`<br>Array of RecipeIngredient DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 44 | RecipeIngredient | Batch Create Recipe Ingredients | Links multiple ingredients to a recipe name | `POST /api/RecipeIngredient`<br>Body: `RecIngredientForCreation` `{ recipeName, recipeitem: [{ ingredientName, quantity, profileImage }] }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 45 | RecipeIngredient | Get Recipe Ingredient by ID | Retrieves single recipe ingredient record | `GET /api/RecipeIngredient/{id}` (int32) | `200 OK`<br>RecipeIngredient DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 46 | RecipeIngredient | Update Single Recipe Ingredient | Updates individual ingredient assignment | `PUT /api/RecipeIngredient/{id}` (string path)<br>Body: `RecIngredientForUpdation` `{ id, recipeName, ingredientName, quantity, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 47 | RecipeIngredient | Delete Recipe Ingredient | Removes recipe ingredient link | `DELETE /api/RecipeIngredient/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 48 | Role | List Roles | Lists user roles | `GET /api/Role` | `200 OK`<br>`[{"id":1,"roleName":"Admin"}]` | Public endpoint (returns 200 without auth) | Swagger OpenAPI & live probe |
| 49 | Role | Create Role | Creates new user role | `POST /api/Role`<br>Body: `RoleForCreation` `{ roleName }` | `200 OK`<br>`boolean` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 50 | Role | Get Role by ID | Fetches single role details | `GET /api/Role/{id}` (int32) | `200 OK`<br>`RoleDto` `{ id, roleName }` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 51 | Role | Update Role | Updates role name | `PUT /api/Role/{id}` (string path)<br>Body: `RoleForUpdation` `{ id, roleName }` | `200 OK`<br>`boolean` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 52 | Role | Delete Role | Deletes role | `DELETE /api/Role/{id}` (int32) | `200 OK`<br>`boolean` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 53 | SiteFeedback | List Site Feedback | Lists general website feedback | `GET /api/SiteFeedback` | `200 OK`<br>Array of SiteFeedback DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 54 | SiteFeedback | Create Site Feedback | Submits general site feedback | `POST /api/SiteFeedback`<br>Body: `sitefeedbackForCreation` `{ comment, rating }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 55 | SiteFeedback | Get Site Feedback by ID | Retrieves single site feedback | `GET /api/SiteFeedback/{id}` (int32) | `200 OK`<br>SiteFeedback DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 56 | SiteFeedback | Update Site Feedback | Updates site feedback | `PUT /api/SiteFeedback/{id}` (string path)<br>Body: `sitefeedbackForUpdation` `{ id, comment, rating }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 57 | SiteFeedback | Delete Site Feedback | Deletes site feedback | `DELETE /api/SiteFeedback/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 58 | Subscription | List Subscriptions | Lists user subscriptions | `GET /api/Subscription` | `200 OK`<br>Array of `SubscriptionForListning` `{ id, userId, planType, amount, startDate, endDate, status }` | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 59 | Subscription | Create Subscription | Creates new membership subscription | `POST /api/Subscription`<br>Body: `SubscriptionForCreation` `{ userId, planType, amount }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 60 | Subscription | Get Subscription by ID | Retrieves subscription details | `GET /api/Subscription/{id}` (int32) | `200 OK`<br>`SubscriptionDto` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 61 | Subscription | Update Subscription Plan/Amount | Updates subscription plan and fee | `PUT /api/Subscription/{id}` (int32)<br>Body: `SubscriptionForUpdation` `{ planType, amount }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 62 | Subscription | Delete Subscription | Cancels/removes subscription | `DELETE /api/Subscription/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 63 | Tip | List Culinary Tips | Lists chef culinary tips | `GET /api/Tip` | `200 OK`<br>Array of Tip DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 64 | Tip | Create Culinary Tip | Publishes a new culinary tip | `POST /api/Tip`<br>Body: `TipForCreation` `{ title, description, actionType, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 65 | Tip | Get Tip by ID | Retrieves tip details by ID | `GET /api/Tip/{id}` (int32) | `200 OK`<br>Tip DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 66 | Tip | Update Culinary Tip | Updates tip title, description, image | `PUT /api/Tip/{id}` (string path)<br>Body: `TipForUpdation` `{ id, title, description, actionType, createdById, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 67 | Tip | Delete Culinary Tip | Deletes tip | `DELETE /api/Tip/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 68 | User | List Users | Lists registered accounts | `GET /api/User` | `200 OK`<br>Array of User DTOs | `401 Unauthorized` if unauthenticated | Swagger OpenAPI & live probe |
| 69 | User | Create User | Creates an account | `POST /api/User`<br>Body: `UserForCreation` `{ name, email, password, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 70 | User | Get User by ID | Fetches user details | `GET /api/User/{id}` (int32) | `200 OK`<br>User DTO | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |
| 71 | User | Update User Profile | Updates user credentials/profile | `PUT /api/User/{id}` (string path)<br>Body: `UserForUpdation` `{ id, name, email, password, profileImage }` | `200 OK` | `400 Bad Request`, `401 Unauthorized` | Swagger OpenAPI |
| 72 | User | Delete User | Removes user account | `DELETE /api/User/{id}` (int32) | `200 OK` | `401 Unauthorized`, `404 Not Found` | Swagger OpenAPI |

---

## Edge Cases & Defensive Behaviors

| # | Feature / Area | Input / Scenario | Observed / Required Behavior |
|---|----------------|------------------|------------------------------|
| 1 | Global Auth | Unauthenticated GET request on protected endpoint | Returns HTTP `401 Unauthorized`. Client response interceptor intercepts 401, clears `useAuthStore` token, and triggers redirect to `/login`. |
| 2 | Public Role Query | `GET /api/Role` without JWT | Returns `200 OK` with JSON `[{"id":1,"roleName":"Admin"}]`. Only endpoint accessible without Bearer token. |
| 3 | Media Upload Form | `POST /api/Media` with non-FormData or JSON body | Fails with `415 Unsupported Media Type` or `400 Bad Request`. Requires `multipart/form-data` with exact form field name `ImagePath`. |
| 4 | Media File Types | Uploading JPEG/PNG/WebP files | Backend stores file and returns file path string (e.g. `/uploads/guid.jpg`). Frontend must prepend base URL if returning relative path. |
| 5 | Recipe Image Storage | Recipe creation with multiple images | `imagePaths` in `RecipeForCreation` is an array of strings (`string[]`), populated from sequential/parallel `POST /api/Media` calls. |
| 6 | Recipe Ingredient Batching | Adding ingredients to a recipe during creation | `POST /api/RecipeIngredient` takes `{ recipeName: string, recipeitem: [{ ingredientName, quantity, profileImage }] }`. Batch creation payload differs from single-item PUT. |
| 7 | Recipe Ingredient Updation | Updating an existing recipe ingredient row | `PUT /api/RecipeIngredient/{id}` requires `{ id, recipeName, ingredientName, quantity, profileImage }`. The body contains the individual ingredient row details. |
| 8 | Subscription PUT Body | Modifying subscription plan/amount | `PUT /api/Subscription/{id}` accepts ONLY `{ planType, amount }`. Including `id` or `userId` in the body will cause deserialization or model binding mismatch if `additionalProperties` is enforced. |
| 9 | Contest Submission Flow | Submitting an entry for a contest | `POST /api/ContestSubmission` accepts `{ contestId, recipeId, tipId }`. A user submits an existing recipe ID or tip ID rather than embedding raw recipe text directly in the submission payload. |
| 10 | Contest Winner Selection | Admin picks contest winner | `PUT /api/ContestSubmission/winner/{submissionId}` without request body. Modifies contest submission status to winner. |
| 11 | Missing Self-Registration | User accesses `/register` | Backend lacks `POST /api/Auth/register`. UI must either invoke `POST /api/User` with standard user role or render an informative banner indicating registration requires admin provisioning. |
| 12 | Missing GET `/api/Auth/me` | App initialization / token restore | Frontend reconstructs user context from persisted Zustand store or queries `GET /api/User/{userId}` using stored user ID. |
| 13 | Admin Stats Aggregation | Admin Dashboard load | Backend lacks `GET /api/admin/stats`. Dashboard hooks execute concurrent queries (`GET /api/User`, `GET /api/Recipe`, `GET /api/Contest`, `GET /api/Tip`, `GET /api/Feedback`) and compute length metrics on client. |
| 14 | GET Response Array vs Object | ASP.NET Core list endpoints | Returns bare JSON arrays (e.g. `CategoryForListning[]`). Query hooks must unwrap defensively: `Array.isArray(res.data) ? res.data : (res.data?.data ?? [])`. |
| 15 | Numeric ID vs String ID | Route params and payload IDs | Backend models use `int32` (`number`). Route parameters parsed from URL strings (`params.id`) must be converted via `parseInt(id, 10)` or `Number(id)` before passing to mutations. |

---

## Detailed Resource Specifications

### 1. `Auth` (`/api/Auth`)
- **Base Endpoint**: `/api/Auth`
- **Supported Methods**: `POST`
- **Unsupported Methods**: `GET`, `PUT`, `DELETE` (No `/api/Auth/register`, `/api/Auth/me`, `/api/Auth/refresh`)
- **Operation Details**:
  - `POST /api/Auth`:
    - Headers: `Content-Type: application/json`
    - Request Body: `LoginsRequest`
      ```typescript
      interface LoginsRequest {
        email?: string;
        password?: string;
      }
      ```
    - Response `200 OK`: Returns JWT token string or `{ token: string, user: UserDto }`.
    - Error Responses: `400 Bad Request`, `401 Unauthorized`.

---

### 2. `Announcement` (`/api/Announcement`)
- **Base Endpoint**: `/api/Announcement`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Announcement`: Returns array of announcements.
  - `POST /api/Announcement`:
    - Request Body: `AnnouncementForCreation`
      ```typescript
      interface AnnouncementForCreation {
        title?: string;
        description?: string;
        contestId?: number; // int32 nullable
        winnerSubmissionId?: number; // int32 nullable
      }
      ```
  - `GET /api/Announcement/{id}`: Path param `id` (`int32`).
  - `PUT /api/Announcement/{id}`:
    - Path param `id` (`string`).
    - Request Body: `AnnouncementForUpdation`
      ```typescript
      interface AnnouncementForUpdation {
        id: number; // int32
        title?: string;
        description?: string;
        contestId?: number;
        winnerSubmissionId?: number;
      }
      ```
  - `DELETE /api/Announcement/{id}`: Path param `id` (`int32`).

---

### 3. `Category` (`/api/Category`)
- **Base Endpoint**: `/api/Category`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Category`: Returns `CategoryForListning[]`
    ```typescript
    interface CategoryForListning {
      id: number;
      categoryName?: string;
      profileImage?: string;
    }
    ```
  - `POST /api/Category`:
    - Request Body: `CategoryForCreation`
      ```typescript
      interface CategoryForCreation {
        categoryName?: string;
        profileImage?: string;
      }
      ```
  - `GET /api/Category/{id}`: Path param `id` (`int32`).
  - `PUT /api/Category/{id}`:
    - Path param `id` (`int32`).
    - Request Body: `CategoryForUpdation`
      ```typescript
      interface CategoryForUpdation {
        id: number;
        categoryName?: string;
        profileImage?: string;
      }
      ```
  - `DELETE /api/Category/{id}`: Path param `id` (`int32`).

---

### 4. `Contest` (`/api/Contest`)
- **Base Endpoint**: `/api/Contest`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Contest`: Returns array of contests.
  - `POST /api/Contest`:
    - Request Body: `ContestForCreation`
      ```typescript
      interface ContestForCreation {
        title?: string;
        description?: string;
        durationDays: number; // int32
        profileImage?: string;
      }
      ```
  - `GET /api/Contest/{id}`: Path param `id` (`int32`).
  - `PUT /api/Contest/{id}`:
    - Path param `id` (`string`).
    - Request Body: `ContestForUpdation`
      ```typescript
      interface ContestForUpdation {
        id: number;
        title?: string;
        description?: string;
        durationDays: number;
        profileImage?: string;
      }
      ```
  - `DELETE /api/Contest/{id}`: Path param `id` (`int32`).

---

### 5. `ContestSubmission` (`/api/ContestSubmission`)
- **Base Endpoint**: `/api/ContestSubmission`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `DELETE /:id`, `PUT /winner/{submissionId}`
- **Unsupported Methods**: Generic `PUT /api/ContestSubmission/{id}` is not available.
- **Operation Details**:
  - `GET /api/ContestSubmission`: Returns `ContestSubmissionForListning[]`
    ```typescript
    interface ContestSubmissionForListning {
      id: number;
      contestId: number;
      userId: number;
      recipeId?: number;
      tipId?: number;
      isWinner: boolean;
      submittedAt: string; // ISO date-time
    }
    ```
  - `POST /api/ContestSubmission`:
    - Request Body: `ContestSubmissionForCreation`
      ```typescript
      interface ContestSubmissionForCreation {
        contestId: number;
        recipeId?: number;
        tipId?: number;
      }
      ```
  - `GET /api/ContestSubmission/{id}`: Path param `id` (`int32`). Returns `ContestSubmissionDto`.
  - `DELETE /api/ContestSubmission/{id}`: Path param `id` (`int32`). Returns `boolean`.
  - `PUT /api/ContestSubmission/winner/{submissionId}`: Path param `submissionId` (`int32`). No request body. Marks the specified submission as the contest winner.

---

### 6. `FAQ` (`/api/FAQ`)
- **Base Endpoint**: `/api/FAQ`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/FAQ`: Returns list of FAQs.
  - `POST /api/FAQ`:
    - Request Body: `faqForCreation`
      ```typescript
      interface faqForCreation {
        question?: string;
        answer?: string;
      }
      ```
  - `GET /api/FAQ/{id}`: Path param `id` (`int32`).
  - `PUT /api/FAQ/{id}`:
    - Path param `id` (`string`).
    - Request Body: `faqForUpdation`
      ```typescript
      interface faqForUpdation {
        id: number;
        question?: string;
        answer?: string;
      }
      ```
  - `DELETE /api/FAQ/{id}`: Path param `id` (`int32`).

---

### 7. `Feedback` (`/api/Feedback`)
- **Base Endpoint**: `/api/Feedback`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Feedback`: Returns list of recipe feedback records.
  - `POST /api/Feedback`:
    - Request Body: `FeedbackForCreation`
      ```typescript
      interface FeedbackForCreation {
        recipeId: number; // int32
        comment?: string;
        rating: number; // int32 (1 to 5)
      }
      ```
  - `GET /api/Feedback/{id}`: Path param `id` (`int32`).
  - `PUT /api/Feedback/{id}`:
    - Path param `id` (`string`).
    - Request Body: `FeedbackForUpdation`
      ```typescript
      interface FeedbackForUpdation {
        id: number;
        comment?: string;
        rating: number;
      }
      ```
  - `DELETE /api/Feedback/{id}`: Path param `id` (`int32`).

---

### 8. `Ingredient` (`/api/Ingredient`)
- **Base Endpoint**: `/api/Ingredient`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Ingredient`: Returns list of master catalog ingredients.
  - `POST /api/Ingredient`:
    - Request Body: `IngredientForCreation`
      ```typescript
      interface IngredientForCreation {
        name?: string;
        profileImage?: string;
      }
      ```
  - `GET /api/Ingredient/{id}`: Path param `id` (`int32`).
  - `PUT /api/Ingredient/{id}`:
    - Path param `id` (`string`).
    - Request Body: `IngredientForUpdation`
      ```typescript
      interface IngredientForUpdation {
        id: number;
        name?: string;
        profileImage?: string;
      }
      ```
  - `DELETE /api/Ingredient/{id}`: Path param `id` (`int32`).

---

### 9. `Media` (`/api/Media`)
- **Base Endpoint**: `/api/Media`
- **Supported Methods**: `POST`
- **Unsupported Methods**: `GET`, `PUT`, `DELETE`
- **Operation Details**:
  - `POST /api/Media`:
    - Headers: `Content-Type: multipart/form-data`
    - Form Field: `ImagePath` (File / Blob)
    - Response `200 OK`: Returns saved file path string (e.g. `"/uploads/638...jpg"` or full URL).

---

### 10. `Recipe` (`/api/Recipe`)
- **Base Endpoint**: `/api/Recipe`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `RecipeActionType` Enum: `"User" | "Member" | "Both"`
  - `GET /api/Recipe`: Returns array of recipes.
  - `POST /api/Recipe`:
    - Request Body: `RecipeForCreation`
      ```typescript
      interface RecipeForCreation {
        title?: string;
        description?: string;
        procedure?: string;
        actionType?: 'User' | 'Member' | 'Both';
        categoryId: number; // int32
        imagePaths?: string[]; // array of strings
      }
      ```
  - `GET /api/Recipe/{id}`: Path param `id` (`int32`).
  - `PUT /api/Recipe/{id}`:
    - Path param `id` (`int32`).
    - Request Body: `RecipeForUpdation`
      ```typescript
      interface RecipeForUpdation {
        id: number;
        title?: string;
        description?: string;
        procedure?: string;
        actionType?: 'User' | 'Member' | 'Both';
        categoryId: number;
        imagePaths?: string[];
      }
      ```
  - `DELETE /api/Recipe/{id}`: Path param `id` (`int32`).

---

### 11. `RecipeIngredient` (`/api/RecipeIngredient`)
- **Base Endpoint**: `/api/RecipeIngredient`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/RecipeIngredient`: Returns array of recipe ingredient relations.
  - `POST /api/RecipeIngredient` (Batch creation):
    - Request Body: `RecIngredientForCreation`
      ```typescript
      interface RecipeIngredientItemForCreation {
        ingredientName?: string;
        quantity?: string;
        profileImage?: string;
      }

      interface RecIngredientForCreation {
        recipeName?: string;
        recipeitem?: RecipeIngredientItemForCreation[];
      }
      ```
  - `GET /api/RecipeIngredient/{id}`: Path param `id` (`int32`).
  - `PUT /api/RecipeIngredient/{id}` (Single item update):
    - Path param `id` (`string`).
    - Request Body: `RecIngredientForUpdation`
      ```typescript
      interface RecIngredientForUpdation {
        id: number;
        recipeName?: string;
        ingredientName?: string;
        quantity?: string;
        profileImage?: string;
      }
      ```
  - `DELETE /api/RecipeIngredient/{id}`: Path param `id` (`int32`).

---

### 12. `Role` (`/api/Role`)
- **Base Endpoint**: `/api/Role`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Role`: Returns `RoleForListning[]` (Public, returns `200 OK` without Bearer token).
    ```typescript
    interface RoleForListning {
      id: number;
      roleName?: string;
    }
    ```
  - `POST /api/Role`: Request Body: `RoleForCreation` `{ roleName?: string }`. Returns `boolean`.
  - `GET /api/Role/{id}`: Path param `id` (`int32`). Returns `RoleDto` `{ id: number, roleName?: string }`.
  - `PUT /api/Role/{id}`: Path param `id` (`string`). Request Body: `RoleForUpdation` `{ id: number, roleName?: string }`. Returns `boolean`.
  - `DELETE /api/Role/{id}`: Path param `id` (`int32`). Returns `boolean`.

---

### 13. `SiteFeedback` (`/api/SiteFeedback`)
- **Base Endpoint**: `/api/SiteFeedback`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/SiteFeedback`: Returns general site feedback list.
  - `POST /api/SiteFeedback`:
    - Request Body: `sitefeedbackForCreation`
      ```typescript
      interface sitefeedbackForCreation {
        comment?: string;
        rating: number; // int32
      }
      ```
  - `GET /api/SiteFeedback/{id}`: Path param `id` (`int32`).
  - `PUT /api/SiteFeedback/{id}`: Path param `id` (`string`). Request Body: `sitefeedbackForUpdation` `{ id: number, comment?: string, rating: number }`.
  - `DELETE /api/SiteFeedback/{id}`: Path param `id` (`int32`).

---

### 14. `Subscription` (`/api/Subscription`)
- **Base Endpoint**: `/api/Subscription`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - Enums:
    - `PlanType`: `"Weekly" | "Monthly" | "Yearly"`
    - `SubscriptionStatus`: `"Active" | "Expired" | "Cancelled"`
  - `GET /api/Subscription`: Returns `SubscriptionForListning[]`
    ```typescript
    interface SubscriptionForListning {
      id: number;
      userId: number;
      planType: 'Weekly' | 'Monthly' | 'Yearly';
      amount: number; // double
      startDate: string; // ISO date-time
      endDate: string; // ISO date-time
      status: 'Active' | 'Expired' | 'Cancelled';
    }
    ```
  - `POST /api/Subscription`:
    - Request Body: `SubscriptionForCreation`
      ```typescript
      interface SubscriptionForCreation {
        userId: number;
        planType: 'Weekly' | 'Monthly' | 'Yearly';
        amount: number;
      }
      ```
  - `GET /api/Subscription/{id}`: Path param `id` (`int32`). Returns `SubscriptionDto`.
  - `PUT /api/Subscription/{id}`:
    - Path param `id` (`int32`).
    - Request Body: `SubscriptionForUpdation`
      ```typescript
      interface SubscriptionForUpdation {
        planType: 'Weekly' | 'Monthly' | 'Yearly';
        amount: number;
      }
      ```
    - **CRITICAL**: Do NOT pass `id` or `userId` in the body payload.
  - `DELETE /api/Subscription/{id}`: Path param `id` (`int32`).

---

### 15. `Tip` (`/api/Tip`)
- **Base Endpoint**: `/api/Tip`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/Tip`: Returns array of tips.
  - `POST /api/Tip`:
    - Request Body: `TipForCreation`
      ```typescript
      interface TipForCreation {
        title?: string;
        description?: string;
        actionType?: 'User' | 'Member' | 'Both';
        profileImage?: string;
      }
      ```
  - `GET /api/Tip/{id}`: Path param `id` (`int32`).
  - `PUT /api/Tip/{id}`:
    - Path param `id` (`string`).
    - Request Body: `TipForUpdation`
      ```typescript
      interface TipForUpdation {
        id: number;
        title?: string;
        description?: string;
        actionType?: 'User' | 'Member' | 'Both';
        createdById: number;
        profileImage?: string;
      }
      ```
  - `DELETE /api/Tip/{id}`: Path param `id` (`int32`).

---

### 16. `User` (`/api/User`)
- **Base Endpoint**: `/api/User`
- **Supported Methods**: `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Operation Details**:
  - `GET /api/User`: Returns array of registered users.
  - `POST /api/User`:
    - Request Body: `UserForCreation`
      ```typescript
      interface UserForCreation {
        name?: string;
        email?: string;
        password?: string;
        profileImage?: string;
      }
      ```
  - `GET /api/User/{id}`: Path param `id` (`int32`).
  - `PUT /api/User/{id}`:
    - Path param `id` (`string`).
    - Request Body: `UserForUpdation`
      ```typescript
      interface UserForUpdation {
        id: number;
        name?: string;
        email?: string;
        password?: string;
        profileImage?: string;
      }
      ```
  - `DELETE /api/User/{id}`: Path param `id` (`int32`).
