import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '@/components/ui/Skeleton';

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col gap-6">
    <Skeleton className="h-10 w-1/3 rounded-2xl" />
    <Skeleton className="h-64 w-full rounded-3xl" />
  </div>
);

// Lazy-loaded Pages
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const RecipesPage = lazy(() => import('@/pages/RecipesPage').then((m) => ({ default: m.RecipesPage })));
const RecipeDetailPage = lazy(() => import('@/pages/RecipeDetailPage').then((m) => ({ default: m.RecipeDetailPage })));
const TipsPage = lazy(() => import('@/pages/TipsPage').then((m) => ({ default: m.TipsPage })));
const TipDetailPage = lazy(() => import('@/pages/TipDetailPage').then((m) => ({ default: m.TipDetailPage })));
const ContestsPage = lazy(() => import('@/pages/ContestsPage').then((m) => ({ default: m.ContestsPage })));
const ContestDetailPage = lazy(() => import('@/pages/ContestDetailPage').then((m) => ({ default: m.ContestDetailPage })));
const AnnouncementsPage = lazy(() => import('@/pages/AnnouncementsPage').then((m) => ({ default: m.AnnouncementsPage })));
const FaqPage = lazy(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const FeedbackPage = lazy(() => import('@/pages/FeedbackPage').then((m) => ({ default: m.FeedbackPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const MyContentPage = lazy(() => import('@/pages/MyContentPage').then((m) => ({ default: m.MyContentPage })));
const CommunityPage = lazy(() => import('@/pages/CommunityPage').then((m) => ({ default: m.CommunityPage })));
const MembershipPage = lazy(() => import('@/pages/MembershipPage').then((m) => ({ default: m.MembershipPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminRecipesPage = lazy(() => import('@/pages/admin/AdminRecipesPage').then((m) => ({ default: m.AdminRecipesPage })));
const AdminTipsPage = lazy(() => import('@/pages/admin/AdminTipsPage').then((m) => ({ default: m.AdminTipsPage })));
const AdminContestsPage = lazy(() => import('@/pages/admin/AdminContestsPage').then((m) => ({ default: m.AdminContestsPage })));
const AdminAnnouncementsPage = lazy(() => import('@/pages/admin/AdminAnnouncementsPage').then((m) => ({ default: m.AdminAnnouncementsPage })));
const AdminFeedbackPage = lazy(() => import('@/pages/admin/AdminFeedbackPage').then((m) => ({ default: m.AdminFeedbackPage })));
const AdminFaqPage = lazy(() => import('@/pages/admin/AdminFaqPage').then((m) => ({ default: m.AdminFaqPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'recipes',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecipesPage />
          </Suspense>
        ),
      },
      {
        path: 'recipes/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RecipeDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'tips',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TipsPage />
          </Suspense>
        ),
      },
      {
        path: 'tips/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TipDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'contests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestsPage />
          </Suspense>
        ),
      },
      {
        path: 'contests/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'announcements',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AnnouncementsPage />
          </Suspense>
        ),
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FaqPage />
          </Suspense>
        ),
      },
      {
        path: 'feedback',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeedbackPage />
          </Suspense>
        ),
      },
      {
        path: 'membership',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MembershipPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },

      // Authenticated Member Routes
      {
        path: 'profile',
        element: (
          <ProtectedRoute allowedRoles={['Member', 'Admin', 'User']}>
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-content',
        element: (
          <ProtectedRoute allowedRoles={['Member', 'Admin', 'User']}>
            <Suspense fallback={<PageLoader />}>
              <MyContentPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'community',
        element: (
          <ProtectedRoute allowedRoles={['Member', 'Admin', 'Guest', 'User']}>
            <Suspense fallback={<PageLoader />}>
              <CommunityPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // 404 Catch-All
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },

  // Admin Routes (Admin Layout & Protected with role 'Admin')
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['Admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'recipes',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminRecipesPage />
          </Suspense>
        ),
      },
      {
        path: 'tips',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminTipsPage />
          </Suspense>
        ),
      },
      {
        path: 'contests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminContestsPage />
          </Suspense>
        ),
      },
      {
        path: 'announcements',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminAnnouncementsPage />
          </Suspense>
        ),
      },
      {
        path: 'feedback',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminFeedbackPage />
          </Suspense>
        ),
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminFaqPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
    ],
  },
]);
