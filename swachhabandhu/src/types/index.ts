// src/types/index.ts

// =====================================================================
// ==                       AUTHENTICATION & USER                     ==
// =====================================================================

/**
 * Core user data returned from the backend's UserSerializer.
 * This is the base for all user-related types.
 */
export interface User {
  id: string; // Changed to string to match UUIDField
  email: string;
  full_name: string;
  phone_number: string | null;
  role: 'CITIZEN' | 'MODERATOR' | 'MUNICIPAL_ADMIN' | 'SUPER_ADMIN';
  total_points: number;
  municipality: string | null; // UUID of the municipality
  municipality_name: string | null;
  date_joined: string; // ISO date string
}


// =====================================================================
// ==                            REPORTS                              ==
// =====================================================================

/**
 * Represents a category for a reported issue, defined by the municipality.
 */
export interface IssueCategory {
  id: string; // UUID
  name: string;
  description: string;
}

/**
 * Represents a media file (image or video) attached to a report.
 */
export interface ReportMedia {
  id: string; // UUID
  file: string; // URL to the file
  uploaded_at: string; // ISO date string
}

/**
 * Represents a single entry in a report's status change history.
 */
export interface ReportStatusHistory {
  status: ReportStatus;
  timestamp: string; // ISO date string
  notes: string | null;
  changed_by_email: string | null;
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
  | 'ACTIONED';

/**
 * Defines the possible severity levels for a report.
 */
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Represents the base Report object as seen in a list view.
 */
export interface Report {
  id: number;
  user: Pick<User, 'full_name'> | null; // Use a subset of the User type for lists
  location: string; // UUID of the location
  location_name: string;
  issue_category: Pick<IssueCategory, 'name'>; // Only name is needed for lists
  description: string;
  status: ReportStatus;
  severity: SeverityLevel;
  media: ReportMedia[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  verification_count: number;
  verifies_report: number | null; // ID of the report it verifies
}

/**

 * Represents the full Report object with all nested details.
 * This is for the Report Detail Page.
 */
export interface ReportDetail extends Omit<Report, 'issue_category' | 'location' | 'user'> {
  // Overwrite list types with full detail types
  issue_category: IssueCategory; 
  user: User | null;
  location: LocationDetails;

  // Add fields only available in the detail view
  moderator_notes?: string | null;
  action_taken_notes?: string | null;
  status_history: ReportStatusHistory[];
  points_awarded: number;
}


// =====================================================================
// ==                           LOCATIONS                             ==
// =====================================================================

/**
 * Represents the full details of a specific location.
 */
export interface LocationDetails {
  id: string; // UUID
  name: string;
  description: string;
  location_type: string;
  municipality: string; // The UUID of the municipality
  municipality_name: string;
  latitude: number; // Changed to number
  longitude: number; // Changed to number
  geofence_radius: number;
}


// =====================================================================
// ==                         GAMIFICATION                            ==
// =====================================================================

export interface Sponsor {
  name: string;
  logo: string; // URL
  website: string;
  description: string;
}

export interface Lottery {
  id: string; // UUID
  name:string;
  description: string;
  sponsor: Sponsor | null;
  municipality_name: string;
  end_date: string; // ISO date string
  winner_name: string | null;
  drawn_at: string | null; // ISO date string
}

export interface Badge {
  name: string;
  description: string;
  icon: string; // URL
}

export interface UserBadge {
  badge: Badge;
  earned_at: string; // ISO date string
}

export interface LeaderboardUser {
  id: string; // UUID
  full_name: string;
  total_points: number;
  rank: number;
}

/**
 * Represents the detailed user profile data for the gamification section.
 */
export interface UserProfileStats {
  id: string; // UUID
  full_name: string;
  total_points: number;
  rank: number | null;
  earned_badges: UserBadge[];
}


// =====================================================================
// ==                           DASHBOARD                             ==
// =====================================================================
// These types are specific to the dashboard components and can stay as they are,
// but they are included here for completeness.

export interface KpiChange { current: number; previous: number; change_percentage: number | null; }
export interface HeatmapPoint { latitude: number; longitude: number; intensity: number; }

export interface MunicipalKpi { 
    total_reports: number; 
    pending_reports: number; 
    verified_reports: number; 
    actioned_reports: number; 
    rejected_reports: number; 
    total_active_citizens: number; 
    average_resolution_time_hours: number | null; 
    total_locations: number; 
    reports_in_last_30_days: KpiChange; 
}

export interface CitizenKpi { 
    total_points: number; 
    rank: number | null; 
    reports_filed: number; 
    reports_verified: number; 
    reports_actioned: number; 
    reports_pending: number; 
}

export interface SeverityBreakdown { 
    severity: string; 
    count: number; 
    percentage: number; 
}

export interface CategoryBreakdown { 
    category_name: string; 
    count: number; 
    percentage: number; 
}

export interface NextBadgeProgress { 
    name: string; 
    description: string; 
    icon_url: string | null; 
    current_points: number; 
    required_points: number; 
    current_reports: number; 
    required_reports: number; 
    current_verifications: number; 
    required_verifications: number; 
    overall_progress_percentage: number; 
}

export interface TopContributor { 
    full_name: string; 
    total_points: number; 
    reports_filed: number; 
    profile_image_url?: string | null; 
}

export interface RecentActivity { 
    activity_type: 'points' | 'badge'; 
    details: string; 
    points: number; 
    timestamp: string; 
    report_id: number | null; 
    badge_name: string | null; 
    badge_icon_url: string | null; 
}