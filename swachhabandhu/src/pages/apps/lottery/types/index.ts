export interface Sponsor {
  name: string;
  logo: string;
  website: string;
  description: string;
}

export interface Lottery {
  id: string;
  name: string;
  description: string;
  sponsor: Sponsor | null;
  municipality_name: string;
  end_date: string;
  winner_name: string | null;
  drawn_at: string | null;
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
}

export interface UserBadge {
  badge: Badge;
  earned_at: string;
}

export interface LeaderboardUser {
  id: string;
  full_name: string;
  total_points: number;
  rank: number;
}

export interface UserProfileStats {
  id: string;
  full_name: string;
  total_points: number;
  rank: number | null;
  earned_badges: UserBadge[];
}