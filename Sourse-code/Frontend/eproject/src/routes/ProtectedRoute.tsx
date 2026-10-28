import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LockedPage } from '@/components/shared/LockedPage';
import type { UserRole } from '@/types/entities';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (UserRole | 'Guest')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['Member', 'Admin'],
}) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated && !allowedRoles.includes('Guest')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (allowedRoles.includes('Admin')) {
      return (
        <LockedPage
          title="Executive Admin Area Restricted"
          description="Access to the management console is restricted to the Executive Chef / Administrator account."
          requiredRole="Administrator"
        />
      );
    }

    return (
      <LockedPage
        title="VIP Membership Required"
        description="This exclusive masterclass area is reserved for James Thew VIP Members. Upgrade to unlock."
        requiredRole="VIP Member"
      />
    );
  }

  return <>{children}</>;
};
