import { User, SubscriptionPlan } from './entities';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  planType?: SubscriptionPlan | 'Free';
  accountTier?: 'Free' | 'VIP';
  profileImage?: string;
}
