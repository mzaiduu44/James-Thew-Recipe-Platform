export type * from './entities';
export type * from './auth';

// ===
export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RecipeQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string | number;
  isFree?: boolean;
  createdById?: string | number;
  sortBy?: 'newest' | 'rating' | 'popular' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TipQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string | number;
  isFree?: boolean;
  createdById?: string | number;
}

export interface ContestQueryParams {
  status?: 'all' | 'active' | 'past';
  search?: string;
}

export interface LoginsRequest {
  email?: string;
  password?: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthUser | UserDto;
}


export interface AnnouncementDto {
  id: number;
  title?: string;
  description?: string;
  contestId?: number | null;
  contestTitle?: string;
  winnerSubmissionId?: number | null;
  winnerName?: string;
  winningEntryTitle?: string;
  winningEntryType?: 'Recipe' | 'Tip' | string;
  createdById?: number;
  createdByName?: string;
  createdAt?: string;
  type?: 'ContestWinner' | 'General' | 'CookingClass' | string;
  badgeText?: string;
}

export interface AnnouncementForCreation {
  title?: string;
  description?: string;
  contestId?: number | null;
  winnerSubmissionId?: number | null;
}

export interface AnnouncementForUpdation {
  id: number;
  title?: string;
  description?: string;
  contestId?: number | null;
  winnerSubmissionId?: number | null;
}

export interface CategoryDto {
  id: number;
  categoryName?: string;
  profileImage?: string;
  recipeCount?: number;
}

export interface CategoryForCreation {
  categoryName?: string;
  profileImage?: string;
}

export interface CategoryForUpdation {
  id: number;
  categoryName?: string;
  profileImage?: string;
}

export type CategoryForListning = CategoryDto;

export interface ContestDto {
  id: number;
  title?: string;
  description?: string;
  durationDays: number;
  profileImage?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  prize?: string;
  submissionCount?: number;
  createdById?: number;
  winnerSubmissionId?: number | null;
  winnerAnnouncementId?: number | null;
  rules?: string[];
  coverImage?: string;
  entryTypeAllowed?: 'All' | 'Recipe' | 'Tip';
}

export interface ContestForCreation {
  title?: string;
  description?: string;
  durationDays: number;
  profileImage?: string;
}

export interface ContestForUpdation {
  id: number;
  title?: string;
  description?: string;
  durationDays: number;
  profileImage?: string;
}

export interface ContestSubmissionDto {
  id: number;
  contestId: number;
  userId: number;
  recipeId?: number | null;
  tipId?: number | null;
  isWinner: boolean;
  submittedAt: string;
  contestTitle?: string;
  recipeTitle?: string;
  tipTitle?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  entryType?: 'Recipe' | 'Tip';
  recipeData?: {
    title?: string;
    description?: string;
    ingredients?: string[];
    procedure?: string[];
    categoryId?: string | number;
    imagePath?: string;
  };
  tipData?: {
    title?: string;
    description?: string;
    categoryId?: string | number;
  };
  adminNotes?: string;
}

export interface ContestSubmissionForCreation {
  contestId: number;
  recipeId?: number | null;
  tipId?: number | null;
}

export type ContestSubmissionForListning = ContestSubmissionDto;

export interface FAQDto {
  id: number;
  question?: string;
  answer?: string;
  category?: 'Membership' | 'Recipes & Tips' | 'Contests' | 'Feedback' | 'General' | string;
  order?: number;
}

export interface FAQForCreation {
  question?: string;
  answer?: string;
  category?: string;
}

export interface FAQForUpdation {
  id: number;
  question?: string;
  answer?: string;
  category?: string;
}

export type faqForCreation = FAQForCreation;
export type faqForUpdation = FAQForUpdation;

export interface FeedbackDto {
  id: number;
  recipeId: number;
  recipeTitle?: string;
  userId?: number;
  userName?: string;
  comment?: string;
  rating: number;
  createdAt?: string;
  userAvatar?: string;
}

export interface FeedbackForCreation {
  recipeId: number;
  comment?: string;
  rating: number;
}

export interface FeedbackForUpdation {
  id: number;
  comment?: string;
  rating: number;
}
export interface SiteFeedbackDto {
  id: number;
  userId?: number;
  userName?: string;
  comment?: string;
  rating: number;
  createdAt?: string;
}

export interface SiteFeedbackForCreation {
  comment?: string;
  rating: number;
}

export interface SiteFeedbackForUpdation {
  id: number;
  comment?: string;
  rating: number;
}

// Case aliases matching swagger
export type sitefeedbackForCreation = SiteFeedbackForCreation;
export type sitefeedbackForUpdation = SiteFeedbackForUpdation;

export interface IngredientDto {
  id: number;
  name?: string;
  profileImage?: string;
}

export interface IngredientForCreation {
  name?: string;
  profileImage?: string;
}

export interface IngredientForUpdation {
  id: number;
  name?: string;
  profileImage?: string;
}

export interface MediaUploadResponse {
  url?: string;
  path?: string;
  id?: number | string;
  imagePath?: string;
}

export type RecipeActionType = 'User' | 'Member' | 'Both';

export interface RecipeDto {
  id: number;
  title?: string;
  description?: string;
  procedure?: string;
  actionType?: RecipeActionType;
  categoryId: number;
  categoryName?: string;
  imagePaths?: string[];
  createdById?: number;
  createdByName?: string;
  createdByRole?: string;
  createdAt?: string;
  isFree?: boolean;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced' | string;
  averageRating?: number;
  ratingsCount?: number;
  ingredients?: string[];
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export interface RecipeForCreation {
  title?: string;
  description?: string;
  procedure?: string;
  actionType?: RecipeActionType;
  categoryId: number;
  imagePaths?: string[];
}

export interface RecipeForUpdation {
  id: number;
  title?: string;
  description?: string;
  procedure?: string;
  actionType?: RecipeActionType;
  categoryId: number;
  imagePaths?: string[];
}

export interface RecipeIngredientItemForCreation {
  ingredientName?: string;
  quantity?: string;
  profileImage?: string;
}

export interface RecIngredientForCreation {
  recipeName?: string;
  recipeitem?: RecipeIngredientItemForCreation[];
}

export interface RecIngredientForUpdation {
  id: number;
  recipeName?: string;
  ingredientName?: string;
  quantity?: string;
  profileImage?: string;
}

export interface RecipeIngredientDto {
  id: number;
  recipeName?: string;
  ingredientName?: string;
  quantity?: string;
  profileImage?: string;
}

export interface RoleDto {
  id: number;
  roleName?: string;
}

export interface RoleForCreation {
  roleName?: string;
}

export interface RoleForUpdation {
  id: number;
  roleName?: string;
}

export type RoleForListning = RoleDto;

export type PlanType = 'Weekly' | 'Monthly' | 'Yearly';
export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled';

export interface SubscriptionDto {
  id: number;
  userId: number;
  planType: PlanType;
  amount: number;
  startDate?: string;
  endDate?: string;
  status?: SubscriptionStatus;
}

export interface SubscriptionForCreation {
  userId: number;
  planType: PlanType;
  amount: number;
}

export interface SubscriptionForUpdation {
  planType: PlanType;
  amount: number;
}

export type SubscriptionForListning = SubscriptionDto;

export interface TipDto {
  id: number;
  title?: string;
  description?: string;
  actionType?: 'User' | 'Member' | 'Both';
  profileImage?: string;
  categoryId?: number;
  categoryName?: string;
  createdById?: number;
  createdByName?: string;
  createdByRole?: string;
  createdAt?: string;
  isFree?: boolean;
  tags?: string[];
  likesCount?: number;
}

export interface TipForCreation {
  title?: string;
  description?: string;
  actionType?: 'User' | 'Member' | 'Both';
  profileImage?: string;
}

export interface TipForUpdation {
  id: number;
  title?: string;
  description?: string;
  actionType?: 'User' | 'Member' | 'Both';
  createdById: number;
  profileImage?: string;
}

export interface UserDto {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  role?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
}

export interface UserForCreation {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: string;
}

export interface UserForUpdation {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  profileImage?: string;
}

// ============================================================================
// Admin Aggregation & Legacy Compatibility Types
// ============================================================================

export interface AdminStatsDto {
  totalUsers: number;
  activeMembers: number;
  totalRecipes: number;
  totalTips: number;
  activeContests: number;
  totalFeedback: number;
  totalSubmissions: number;
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  ingredients: string[];
  procedure: string[] | string;
  imagePath?: string;
  imagePaths?: string[];
  isFree?: boolean;
  categoryId: string | number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Intermediate' | 'Advanced';
  actionType?: RecipeActionType;
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface CreateTipDto {
  title: string;
  description: string;
  isFree?: boolean;
  categoryId?: string | number;
  tags?: string[];
  actionType?: 'User' | 'Member' | 'Both';
  profileImage?: string;
}

export interface UpdateTipDto extends Partial<CreateTipDto> {}

export interface CreateContestDto {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  prize?: string;
  entryTypeAllowed?: 'All' | 'Recipe' | 'Tip';
  rules?: string[];
  coverImage?: string;
  profileImage?: string;
}

export interface CreateContestSubmissionDto {
  contestId: string | number;
  userId?: string | number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  entryType?: 'Recipe' | 'Tip';
  recipeId?: number;
  tipId?: number;
  recipeData?: {
    title: string;
    description: string;
    ingredients: string[];
    procedure: string[];
    categoryId: string | number;
    imagePath?: string;
  };
  tipData?: {
    title: string;
    description: string;
    categoryId?: string | number;
  };
}

export interface CreateAnnouncementDto {
  title: string;
  description: string;
  contestId?: string | number;
  winnerName?: string;
  winnerSubmissionId?: number;
  winningEntryTitle?: string;
  winningEntryType?: 'Recipe' | 'Tip';
  type?: 'ContestWinner' | 'General' | 'CookingClass';
}

export interface CreateFeedbackDto {
  recipeId?: string | number;
  comment: string;
  rating: number;
  feedbackType?: 'Recipe' | 'General';
  userName?: string;
  userEmail?: string;
}

export interface CreateFaqDto {
  question: string;
  answer: string;
  category?: 'Membership' | 'Recipes & Tips' | 'Contests' | 'Feedback' | 'General';
}

export interface UpdateFaqDto extends Partial<CreateFaqDto> {}
