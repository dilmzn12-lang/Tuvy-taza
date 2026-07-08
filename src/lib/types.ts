export type Role = 'super_admin' | 'owner' | 'employee' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  restaurantId: string | null;
  createdAt?: unknown;
}

export interface Restaurant {
  name: string;
  ownerId: string;
  createdAt: unknown;
  slug?: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    tagline?: string;
  };
}
