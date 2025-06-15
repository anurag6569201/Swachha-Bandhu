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



/**
 * Represents a media file (image or video) attached to a report.
 */
export interface ReportMedia {
  id: string;
  file: string; // This will be the URL to the file
  uploaded_at: string;
}

/**
 * Represents a single entry in a report's status change history.
 */
export interface ReportStatusHistory {
  status: ReportStatus;
  timestamp: string;
  notes: string;
  changed_by_email: string | null;
}

/**
 * Represents a category for a reported issue, defined by the municipality.
 */
export interface IssueCategory {
  id: string;
  name: string;
  description: string;
}

/**
 * Defines the possible status values for a report.
 * Matches the choices on the Django backend model.
 */
export type ReportStatus = 
  | 'PENDING' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'DUPLICATE';

/**
 * Defines the possible severity levels for a report.
 */
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Represents the main Report object, combining all related data.
 * This is the primary data structure you'll work with on the frontend.
 */
export interface Report {
  id: number;
  user: User | null;
  location: string; // UUID of the location
  location_name: string;
  issue_category: IssueCategory;
  description: string;
  status: ReportStatus;
  severity: SeverityLevel;
  media: ReportMedia[];
  created_at: string;
  updated_at: string;
  verification_count: number;
  verifies_report: number | null; // ID of the report it verifies

  // Fields that may only be present for moderators/admins
  moderator_notes?: string | null;
  action_taken_notes?: string | null;
  status_history?: ReportStatusHistory[];
}