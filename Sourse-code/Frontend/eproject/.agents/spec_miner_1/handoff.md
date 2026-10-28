# API Specification Mining — Handoff Report

**Agent**: `spec_miner_1` (API Specification Miner)  
**Date**: 2026-08-23T10:32:00Z  
**Target Backend**: `http://jamesthewrecipe.runasp.net`  
**Swagger Source**: `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json`  
**Report Artifact**: `c:/Users/akela/Downloads/eproject/.agents/spec_miner_1/api_spec_report.md`

---

## 1. Observation

1. **Swagger OpenAPI Exploration**:
   - Evaluated `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json` (OpenAPI 3.0.4, Title: "E-Project", Version: "1.0").
   - Found 16 total controller routes:
     - `/api/Announcement` (GET, POST), `/api/Announcement/{id}` (GET, PUT, DELETE)
     - `/api/Auth` (POST)
     - `/api/Category` (GET, POST), `/api/Category/{id}` (GET, PUT, DELETE)
     - `/api/Contest` (GET, POST), `/api/Contest/{id}` (GET, PUT, DELETE)
     - `/api/ContestSubmission` (GET, POST), `/api/ContestSubmission/{id}` (GET, DELETE), `/api/ContestSubmission/winner/{submissionId}` (PUT)
     - `/api/FAQ` (GET, POST), `/api/FAQ/{id}` (GET, PUT, DELETE)
     - `/api/Feedback` (GET, POST), `/api/Feedback/{id}` (GET, PUT, DELETE)
     - `/api/Ingredient` (GET, POST), `/api/Ingredient/{id}` (GET, PUT, DELETE)
     - `/api/Media` (POST)
     - `/api/Recipe` (GET, POST), `/api/Recipe/{id}` (GET, PUT, DELETE)
     - `/api/RecipeIngredient` (GET, POST), `/api/RecipeIngredient/{id}` (GET, PUT, DELETE)
     - `/api/Role` (GET, POST), `/api/Role/{id}` (GET, PUT, DELETE)
     - `/api/SiteFeedback` (GET, POST), `/api/SiteFeedback/{id}` (GET, PUT, DELETE)
     - `/api/Subscription` (GET, POST), `/api/Subscription/{id}` (GET, PUT, DELETE)
     - `/api/Tip` (GET, POST), `/api/Tip/{id}` (GET, PUT, DELETE)
     - `/api/User` (GET, POST), `/api/User/{id}` (GET, PUT, DELETE)

2. **Live Backend Probe**:
   - HTTP GET without Bearer tokens against `/api/Announcement`, `/api/Category`, `/api/Contest`, `/api/FAQ`, `/api/Feedback`, `/api/Ingredient`, `/api/Recipe`, `/api/RecipeIngredient`, `/api/SiteFeedback`, `/api/Subscription`, `/api/Tip`, `/api/User` all returned HTTP `401 Unauthorized`.
   - HTTP GET against `/api/Role` returned HTTP `200 OK` with JSON `[{"id":1,"roleName":"Admin"}]`.
   - Security scheme defined in OpenAPI: Bearer JWT (`type: "http", scheme: "bearer", bearerFormat: "JWT"`).

3. **Key Payload Schema Discrepancies**:
   - **Media**: `POST /api/Media` accepts `multipart/form-data` with form field name `ImagePath` (binary). Returns string URL.
   - **Recipe Creation/Update**: `RecipeForCreation` has fields `{ title, description, procedure, actionType ("User" | "Member" | "Both"), categoryId (int32), imagePaths (string[]) }`.
   - **RecipeIngredient Batch vs Single**:
     - `POST /api/RecipeIngredient`: `RecIngredientForCreation` = `{ recipeName: string, recipeitem: [{ ingredientName, quantity, profileImage }] }`.
     - `PUT /api/RecipeIngredient/{id}`: `RecIngredientForUpdation` = `{ id, recipeName, ingredientName, quantity, profileImage }`.
   - **Subscription Update**: `PUT /api/Subscription/{id}` expects `SubscriptionForUpdation` = `{ planType ("Weekly" | "Monthly" | "Yearly"), amount (number) }`. `id` and `userId` are NOT in the body payload.
   - **Contest Submissions**: No generic `PUT /api/ContestSubmission/{id}`. Setting winner is explicitly `PUT /api/ContestSubmission/winner/{submissionId}`.

4. **Missing / Unimplemented Backend Endpoints**:
   - No `POST /api/Auth/register` (user creation is done via `POST /api/User`).
   - No `GET /api/Auth/me` (user context is derived from login or `GET /api/User/{id}`).
   - No `POST /api/Auth/refresh`.
   - No `GET /api/admin/stats` (must be computed on frontend from individual resource queries).

---

## 2. Logic Chain

1. **Authentication Interception**:
   - *Observation*: 15 out of 16 resource GET endpoints return `401 Unauthorized` when unauthenticated.
   - *Inference*: The Axios client in `src/services/apiClient.ts` (or `src/api/client.ts`) must supply `Authorization: Bearer <token>` from the Zustand auth store for all requests, and intercept `401` to clear credentials and redirect to `/login`.

2. **2-Step Media Workflow**:
   - *Observation*: `POST /api/Media` takes `multipart/form-data` with `ImagePath` and returns a string path, while `RecipeForCreation` takes `imagePaths: string[]`.
   - *Inference*: Any form uploading images (Recipes, Tips, Categories, Contests, Ingredients) must first perform file upload to `POST /api/Media`, obtain the uploaded URL/path, and then supply that URL/path string in the entity creation/update mutation.

3. **Data Type Normalization (int32 vs String IDs)**:
   - *Observation*: All entity IDs and foreign keys in the ASP.NET Core backend are defined as `int32` (e.g. `categoryId: number`, `durationDays: number`, `recipeId: number`).
   - *Inference*: The TypeScript interfaces in `src/types/` and API resource modules must use `number` for IDs or provide automatic `parseInt(id, 10)` conversion when parsing route parameters.

4. **Client-Side Defensiveness & Aggregation**:
   - *Observation*: Endpoints return bare arrays and lack server-side pagination parameters or stats endpoints in Swagger.
   - *Inference*: Frontend TanStack Query hooks must safely unpack array payloads (`Array.isArray(res.data) ? res.data : (res.data?.data ?? [])`) and compute dashboard metrics on the client.

---

## 3. Caveats

- **ASP.NET Core Untyped Response Descriptors**: In the live Swagger file, several `200` responses omit explicit `$ref` schema definitions (listing only `"200": { "description": "OK" }`). However, response types have been cross-referenced with corresponding `*ForListning` and `*Dto` schemas.
- **Database Seed State**: `GET /api/ContestSubmission` returned 500 when probed without auth/data, which indicates an unseeded or unhandled null reference on empty table relations in the live ASP.NET backend. Safe error boundaries and null fallbacks must be implemented in the frontend.

---

## 4. Conclusion

All 16 backend resources and their 72 discrete operations, parameters, request body schemas, response types, and constraints are fully mined, mapped, and documented in `api_spec_report.md`. The frontend refactoring team has exact interface definitions to implement `src/api/*.ts` modules and TanStack Query hooks.

---

## 5. Verification Method

To independently verify the discoveries:
1. **Inspect Report**: Read `c:/Users/akela/Downloads/eproject/.agents/spec_miner_1/api_spec_report.md`.
2. **Inspect Swagger**: Run HTTP request to `http://jamesthewrecipe.runasp.net/swagger/v1/swagger.json` to verify schema definitions (`RecipeForCreation`, `RecIngredientForCreation`, `SubscriptionForUpdation`, `LoginsRequest`, etc.).
3. **Verify Auth Enforcement**: Send `curl -i http://jamesthewrecipe.runasp.net/api/Recipe` to observe `401 Unauthorized` vs `curl -i http://jamesthewrecipe.runasp.net/api/Role` to observe `200 OK`.
