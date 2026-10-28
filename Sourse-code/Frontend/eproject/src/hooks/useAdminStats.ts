import { useQuery } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import { usersApi } from '@/api/users';
import { contestsApi } from '@/api/contests';
import { contestSubmissionsApi } from '@/api/contestSubmissions';
import { feedbackApi } from '@/api/feedback';
import { siteFeedbackApi } from '@/api/siteFeedback';
import { tipsApi } from '@/api/tips';
import { subscriptionsApi } from '@/api/subscriptions';
import type { AdminStatsDto } from '@/types/api';

export function useAdminStats() {
  return useQuery<AdminStatsDto>({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStatsDto> => {
      const [
        recipes,
        users,
        contests,
        submissions,
        feedback,
        siteFeedback,
        tips,
        subscriptions,
      ] = await Promise.all([
        recipesApi.getAll().catch(() => []),
        usersApi.getAll().catch(() => []),
        contestsApi.getAll().catch(() => []),
        contestSubmissionsApi.getAll().catch(() => []),
        feedbackApi.getAll().catch(() => []),
        siteFeedbackApi.getAll().catch(() => []),
        tipsApi.getAll().catch(() => []),
        subscriptionsApi.getAll().catch(() => []),
      ]);

      const activeContestsCount = contests.filter((c) => c.isActive).length;
      const activeMembersCount = subscriptions.filter(
        (s) => s.status === 'Active'
      ).length || users.filter((u) => u.role === 'Member').length;

      return {
        totalUsers: users.length,
        activeMembers: activeMembersCount,
        totalRecipes: recipes.length,
        totalTips: tips.length,
        activeContests: activeContestsCount,
        totalFeedback: feedback.length + siteFeedback.length,
        totalSubmissions: submissions.length,
      };
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 1000 * 60,
  });
}
