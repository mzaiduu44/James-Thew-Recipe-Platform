# James Thew Culinary Salon — Frontend-to-Backend REST API Contract

> **Backend Architecture Target**: ASP.NET Core Web API 8+ / 9+, SQL Server, Entity Framework Core, JWT Bearer Authentication.

All API routes in the frontend are consumed via `src/services/api/*.api.ts` through a central Axios instance (`src/services/apiClient.ts`) configured with `baseURL: '/api'`.

---

## 1. Authentication & Security Header

Every authenticated request automatically transmits the JWT Bearer token in the standard HTTP header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Response Status Codes
- `200 OK` / `201 Created`: Request succeeded.
- `400 Bad Request`: Validation failure. Payload: `{ "message": "Reason description" }`
- `401 Unauthorized`: Token missing or expired.
- `403 Forbidden`: Role permission denied (e.g. Member trying to mutate Admin content).
- `404 Not Found`: Resource does not exist.

---

## 2. API Endpoints Specification

### 2.1 Auth (`/api/auth`)

#### `POST /api/auth/login`
- **Request Body**:
```json
{
  "email": "james.thew@chefjamesthew.com",
  "password": "password123"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "user-admin",
    "name": "James Thew",
    "email": "james.thew@chefjamesthew.com",
    "role": "Admin",
    "profileImage": "https://...",
    "phone": "+1 (555) 234-5678",
    "bio": "Executive Chef...",
    "createdAt": "2023-01-15T08:00:00Z",
    "subscription": {
      "id": "sub-admin",
      "userId": "user-admin",
      "planType": "Yearly",
      "amount": 100,
      "startDate": "2023-01-01T00:00:00Z",
      "endDate": "2030-01-01T00:00:00Z",
      "status": "Active"
    }
  }
}
```

#### `POST /api/auth/register`
- **Request Body**:
```json
{
  "name": "Sophia Lorenza",
  "email": "sophia@example.com",
  "password": "securepassword",
  "phone": "+1 (555) 345-6789",
  "planType": "Yearly" // "Monthly" ($10) or "Yearly" ($100)
}
```
- **Response `201 Created`**: Returns `{ "token": "...", "user": { ... } }`

#### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Returns current authenticated `User` object.

---

### 2.2 Recipes (`/api/recipes`)

#### `GET /api/recipes`
- **Query Parameters**:
  - `page` (default: 1)
  - `pageSize` (default: 12)
  - `search` (string)
  - `categoryId` (string)
  - `isFree` (boolean string: "true" | "false")
  - `createdById` (string, for "My Recipes")
  - `sortBy` ("newest" | "rating")
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": "rec-1",
      "title": "Classic Tuscan Tomato & Basil Ribollita",
      "description": "A comforting, hearty double-cooked Tuscan stew...",
      "ingredients": [
        "2 cups dried cannellini beans",
        "1 bunch Cavolo Nero",
        "4 ripe San Marzano tomatoes"
      ],
      "procedure": [
        "In a heavy-bottomed Dutch oven, warm 3 tbsp olive oil...",
        "Add crushed garlic and simmer..."
      ],
      "imagePath": "https://...",
      "isFree": true,
      "categoryId": "cat-veg",
      "categoryName": "Vegetarian",
      "createdById": "user-admin",
      "createdByName": "James Thew",
      "createdByRole": "Admin",
      "createdAt": "2024-05-10T11:00:00Z",
      "prepTimeMinutes": 20,
      "cookTimeMinutes": 60,
      "servings": 4,
      "difficulty": "Easy",
      "averageRating": 4.9,
      "ratingsCount": 28,
      "nutrition": {
        "calories": 380,
        "protein": "14g",
        "carbs": "52g",
        "fat": "12g"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "pageSize": 12,
  "totalPages": 1
}
```

#### `GET /api/recipes/:id`
- **Response `200 OK`**: Returns single `Recipe`.

#### `POST /api/recipes`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "title": "Pan-Roasted Wild Salmon",
  "description": "Crispy skin salmon with lemon dill butter...",
  "ingredients": ["4 salmon fillets", "Fresh dill", "Butter"],
  "procedure": ["Score skin", "Sear on medium-high heat for 6 mins"],
  "imagePath": "https://...",
  "isFree": false, // Only James (Admin) marks free/members-only; members submit without toggle
  "categoryId": "cat-seafood",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 15,
  "servings": 4,
  "difficulty": "Intermediate"
}
```
- **Response `201 Created`**: Returns created `Recipe`.

#### `PUT /api/recipes/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial or full update payload.
- **Response `200 OK`**: Returns updated `Recipe`.

#### `DELETE /api/recipes/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ "success": true, "deletedId": "rec-1" }`

---

### 2.3 Tips (`/api/tips`)

#### `GET /api/tips`
- **Query Parameters**: `search`, `isFree`, `createdById`
- **Response `200 OK`**: Paginated array of `Tip` objects:
```json
{
  "data": [
    {
      "id": "tip-1",
      "title": "The Secret to Silky Emulsified Pasta Sauces",
      "description": "Never drain your pasta into a sink and discard...",
      "isFree": true,
      "categoryId": "cat-italian",
      "categoryName": "Italian Classics",
      "createdById": "user-admin",
      "createdByName": "James Thew",
      "createdAt": "2024-05-01T09:00:00Z",
      "tags": ["Pasta", "Emulsion", "ItalianTechnique"],
      "likesCount": 142
    }
  ],
  "total": 5
}
```

#### `POST /api/tips`
- **Request Body**: `{ "title": "...", "description": "...", "categoryId": "...", "isFree": true, "tags": [...] }`

---

### 2.4 Contests & Submissions (`/api/contests`)

#### `GET /api/contests`
- **Query Parameters**: `status` ("active" | "past" | "all")
- **Response `200 OK`**: Array of `Contest` objects:
```json
[
  {
    "id": "contest-active-1",
    "title": "Autumn Masterclass: The Ultimate Handmade Pasta Innovation",
    "description": "Create and submit an original handmade pasta recipe...",
    "startDate": "2026-08-01T00:00:00Z",
    "endDate": "2026-09-15T23:59:59Z",
    "isActive": true,
    "createdById": "user-admin",
    "prize": "$1,500 Cash + Masterclass Feature & Damascus Knife Set",
    "entryTypeAllowed": "All",
    "submissionCount": 14,
    "rules": [
      "Open to both Registered Members and Guest visitors worldwide",
      "Recipe must include exact ingredient proportions"
    ],
    "coverImage": "https://..."
  }
]
```

#### `POST /api/contests/:id/submissions`
- **Access**: Open to **both Guests and Members** per Aptech specification.
- **Request Body**:
```json
{
  "contestId": "contest-active-1",
  "userName": "David Miller",
  "userEmail": "david@example.com",
  "userPhone": "+1 (555) 678-1234",
  "entryType": "Recipe", // or "Tip"
  "recipeData": {
    "title": "Smoked Ricotta & Roasted Beet Tortelloni",
    "description": "Hand-pleated tortelloni...",
    "ingredients": ["Tipo 00 flour", "Smoked ricotta", "Beets"],
    "procedure": ["Roll pasta", "Fold crowns", "Cook 2 mins"],
    "categoryId": "cat-italian"
  }
}
```
- **Response `201 Created`**: Returns created `ContestSubmission`.

#### `POST /api/contests/:id/select-winner` (Admin Only)
- **Request Body**: `{ "submissionId": "sub-win-1" }`
- **Effect**:
  1. Sets `contest.winnerSubmissionId = submissionId`
  2. Sets `contest.isActive = false`
  3. Sets `submission.isWinner = true`
  4. Automatically generates and stores an `Announcement` of type `ContestWinner`.
- **Response `200 OK`**: Returns `{ "contest": { ... }, "submission": { ... }, "announcement": { ... } }`

---

### 2.5 Announcements (`/api/announcements`)

#### `GET /api/announcements`
- **Response `200 OK`**: Array of Announcements ordered newest first:
```json
[
  {
    "id": "ann-1",
    "title": "Winner Announced: Summer Grand Prix Italian Risotto Challenge!",
    "description": "Mr. James Thew is thrilled to announce Sophia Lorenza as the grand champion...",
    "contestId": "contest-past-1",
    "contestTitle": "Summer Grand Prix: Signature Italian Summer Risotto",
    "winnerName": "Sophia Lorenza",
    "createdById": "user-admin",
    "createdAt": "2024-07-20T10:00:00Z",
    "type": "ContestWinner",
    "badgeText": "Contest Winner"
  }
]
```

---

### 2.6 Feedback (`/api/feedback`)

#### `GET /api/feedback`
- **Query Parameters**: `recipeId` (optional, to filter feedback for a specific recipe)
- **Response `200 OK`**: Array of `Feedback` objects.

#### `POST /api/feedback`
- **Request Body**:
```json
{
  "recipeId": "rec-1", // Optional (omit for general site feedback)
  "rating": 5, // 1 to 5
  "comment": "Made this for Sunday dinner and the flavor depth was spectacular!",
  "userName": "Sophia Lorenza",
  "userEmail": "sophia@example.com",
  "feedbackType": "Recipe" // or "General"
}
```

---

### 2.7 FAQs (`/api/faqs`)

#### `GET /api/faqs`
- **Response `200 OK`**: The 7 required Aptech FAQ records:
  1. How to become the member of this site?
  2. Will there be any subscription charges?
  3. How to view the recipes and tips? Will there be any charges for that?
  4. I am not the registered member of the site. Can I participate in the contest held?
  5. How to upload or post the recipes and tips?
  6. How to post a feedback?
  7. I have posted a recipe or a tip with respect to the contest. How can I know who is the winner?

#### `POST /api/faqs`, `PUT /api/faqs/:id`, `DELETE /api/faqs/:id` (Admin Only)

---

### 2.8 Admin Metrics (`/api/admin/stats`)

#### `GET /api/admin/stats` (Admin Only)
- **Response `200 OK`**:
```json
{
  "totalUsers": 4,
  "activeMembers": 3,
  "totalRecipes": 8,
  "totalTips": 5,
  "activeContests": 2,
  "totalFeedback": 3,
  "totalSubmissions": 2
}
```
