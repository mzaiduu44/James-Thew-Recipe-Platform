export type UserRole = 'Admin' | 'Member' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  password?: string;
  subscription?: Subscription;
}

export type SubscriptionPlan = 'Weekly' | 'Monthly' | 'Yearly';
export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled';

export interface Subscription {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  amount: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
}

export interface Category {
  id: string;
  name: string;
  categoryName?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  profileImage?: string;
  recipeCount?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  procedure: string[];
  imagePath: string;
  isFree: boolean;
  categoryId: string;
  categoryName?: string;
  createdById: string;
  createdByName?: string;
  createdByRole?: UserRole;
  createdAt: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  averageRating?: number;
  ratingsCount?: number;
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export interface Tip {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
  categoryId?: string;
  categoryName?: string;
  createdById: string;
  createdByName?: string;
  createdByRole?: UserRole;
  createdAt: string;
  tags?: string[];
  likesCount?: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdById: string;
  prize: string;
  entryTypeAllowed: 'All' | 'Recipe' | 'Tip';
  submissionCount?: number;
  winnerSubmissionId?: string;
  winnerAnnouncementId?: string;
  rules?: string[];
  coverImage?: string;
}

export interface ContestSubmission {
  id: string;
  contestId: string;
  contestTitle?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  entryType: 'Recipe' | 'Tip';
  recipeData?: {
    title: string;
    description: string;
    ingredients: string[];
    procedure: string[];
    categoryId: string;
    imagePath?: string;
  };
  tipData?: {
    title: string;
    description: string;
    categoryId?: string;
  };
  isWinner: boolean;
  submittedAt: string;
  adminNotes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  contestId?: string;
  contestTitle?: string;
  winnerName?: string;
  winnerId?: string;
  winningEntryTitle?: string;
  winningEntryType?: 'Recipe' | 'Tip';
  createdById: string;
  createdByName?: string;
  createdAt: string;
  type: 'ContestWinner' | 'General' | 'CookingClass';
  badgeText?: string;
}

export interface Feedback {
  id: string;
  recipeId?: string;
  recipeTitle?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  comment: string;
  rating: number; // 1-5
  feedbackType: 'Recipe' | 'General';
  createdAt: string;
  userAvatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: 'Membership' | 'Recipes & Tips' | 'Contests' | 'Feedback' | 'General';
  order: number;
}
