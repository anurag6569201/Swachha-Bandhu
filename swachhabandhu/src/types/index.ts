// src/types/index.ts

// --- Authentication & User Types ---

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password2: string;
}

export interface PasswordResetData {
    token: string;
    new_password: string;
    confirm_new_password: string;
}

/**
 * Represents the core User object returned from the backend.
 * This should match the fields in your Django UserSerializer.
 */
export interface User {
  id: number;
  email: string;
  full_name: string;
  date_joined: string; // ISO date string
}

/**
 * Represents the detailed user profile data, including gamification stats.
 * This matches the data returned from our gamification profile endpoint
 * and what we store in the AuthContext.
 */
export interface UserProfile extends User {
    total_points: number;
    badges: BadgeInfo[];
}

// --- Gamification Types ---

export interface BadgeInfo {
    badge: {
        name: string;
        description: string;
        icon_url: string | null;
    };
    earned_at: string; // ISO date string
}

// --- Report & Location Types (to be used in upcoming phases) ---

export interface Location {
    id: string; // UUID
    name: string;
    description: string;
    latitude: string; // Decimal is sent as string in JSON
    longitude: string; // Decimal is sent as string in JSON
    location_type: string;
}

export interface ReportMedia {
    id: string; // UUID
    media_type: 'IMAGE' | 'VIDEO' | 'AUDIO';
    file: string; // URL to the file
}

export interface Report {
    id: number;
    user: User;
    location: string; // UUID of the location
    location_name: string;

    issue_type: string;
    description: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACTIONED';
    media: ReportMedia[];
    created_at: string; // ISO date string
    
    verification_count: number;
    verifies_report: number | null; // ID of the report it verifies
}