import { authApi as liveAuthApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import type { LoginsRequest, LoginDto, AuthResponse } from '@/types/api';
import type { RegisterDto } from '@/types/auth';
import type { User, UserRole, Subscription } from '@/types/entities';

function decodeJwtPayload(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    return JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
}

export const authApi = {
  login: async (credentials: LoginDto | LoginsRequest): Promise<AuthResponse> => {
    const email = (credentials.email || 'user@jamesthew.com').toLowerCase();
    
    let token = '';
    let decoded: any = {};

    try {
      const res = await liveAuthApi.login(credentials);
      token = typeof res === 'string' ? res : res?.token || '';
      if (!token) {
        throw new Error('Invalid email or password. Please try again.');
      }
      decoded = decodeJwtPayload(token);
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        (typeof err?.response?.data === 'string' ? err.response.data : '') ||
        err?.message ||
        'Invalid email or password. Please try again.';
      throw new Error(serverMsg);
    }

    const rawRoleClaim =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['role'];

    let roleClaim: UserRole;
    if (rawRoleClaim) {
      roleClaim = rawRoleClaim as UserRole;
    } else {
      console.warn('JWT missing role claim, defaulting to User');
      roleClaim = 'User';
    }

    const nameClaim =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      decoded['name'] ||
      credentials.email?.split('@')[0] ||
      'Culinary Member';

    const idClaim =
      decoded['UserId'] ||
      decoded['userId'] ||
      decoded['nameid'] ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      decoded['sub'] ||
      '1';

    const profileImageClaim = decoded['ProfileImage'] || decoded['profileImage'] || null;

    // Fetch user details from database if token is available
    let dbUser: any = null;
    if (token && idClaim && !token.startsWith('demo-token-')) {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://jamesthewrecipe.runasp.net';
        const userRes = await fetch(`${baseUrl}/api/User/${idClaim}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          dbUser = await userRes.json();
        }
      } catch {
        // Fallback to claims
      }
    }

    const finalRole = (dbUser?.roleName || roleClaim) as UserRole;
    const finalName = dbUser?.name || nameClaim;
    const finalEmail = dbUser?.email || credentials.email || 'user@jamesthew.com';
    const finalPassword = dbUser?.password || credentials.password;
    const finalProfileImage =
      dbUser?.profileImage ||
      profileImageClaim ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

    const isPaidMember = finalRole === 'Member' || finalRole === 'Admin';
    const subscription: Subscription | undefined = isPaidMember
      ? {
          id: 'sub-active-1',
          userId: String(idClaim),
          planType: 'Monthly',
          amount: 100,
          status: 'Active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        }
      : undefined;

    const user: User = {
      id: String(idClaim),
      name: finalName,
      email: finalEmail,
      password: finalPassword,
      role: finalRole,
      createdAt: new Date().toISOString(),
      subscription,
      profileImage: finalProfileImage,
    };

    return {
      token,
      user,
    };
  },

  register: async (details: RegisterDto): Promise<AuthResponse> => {
    // 1. Duplicate email validation
    try {
      const existingUsers = await usersApi.getAll();
      const targetEmail = details.email.trim().toLowerCase();
      const emailExists = existingUsers.some(
        (u) => u.email?.trim().toLowerCase() === targetEmail
      );
      if (emailExists) {
        throw new Error('Email already exists. Please use a different email or sign in.');
      }
    } catch (err: any) {
      if (err?.message?.includes('Email already exists')) {
        throw err;
      }
      // If usersApi.getAll() fails due to network/CORS, continue to creation attempt
    }

    try {
      // 2. Attempt to create user account via POST /api/User
      await usersApi.create({
        name: details.name,
        email: details.email,
        password: details.password,
        profileImage: details.profileImage,
      });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || '';
      if (
        err?.response?.status === 409 ||
        (errorMsg.toLowerCase().includes('email') &&
          (errorMsg.toLowerCase().includes('exist') ||
            errorMsg.toLowerCase().includes('already') ||
            errorMsg.toLowerCase().includes('duplicate')))
      ) {
        throw new Error('Email already exists. Please use a different email or sign in.');
      }
      if (err?.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
    }

    // Strict Role Hierarchy: All new registrations are standard 'User' role
    const assignedRole: UserRole = 'User';

    // 3. Authenticate newly created user
    const authRes = await authApi.login({
      email: details.email,
      password: details.password,
    });

    // Ensure newly registered profile is strictly 'User' without premature membership
    const user: User = {
      ...authRes.user,
      name: details.name,
      email: details.email,
      phone: details.phone,
      role: assignedRole,
      profileImage: details.profileImage || authRes.user.profileImage,
      subscription: undefined,
    };

    return {
      token: authRes.token,
      user,
    };
  },

  getMe: async (): Promise<User> => {
    return {
      id: '1',
      name: 'Authenticated User',
      email: 'user@jamesthew.com',
      role: 'Member',
      createdAt: new Date().toISOString(),
    };
  },
};

export default authApi;

export { apiClient, API_BASE_URL, getApiErrorMessage } from '@/api/client';