// src/pages/apps/LeaderboardPage/leaderboardData.ts
export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  rank: number;
  zoneId: string;
}

export const availableZones = ['zone_a', 'zone_b', 'zone_c'];

export const mockLeaderboardData: {
  global: LeaderboardEntry[];
  zones: {
    [key: string]: LeaderboardEntry[];
  };
} = {
  global: [
    { userId: 'u1', name: 'Rajesh Kumar', points: 2500, rank: 1, zoneId: 'all' },
    { userId: 'u2', name: 'Priya Sharma', points: 2350, rank: 2, zoneId: 'all' },
    { userId: 'u3', name: 'Amit Patel', points: 2200, rank: 3, zoneId: 'all' },
    { userId: 'u4', name: 'Deepa Singh', points: 2100, rank: 4, zoneId: 'all' },
    { userId: 'u5', name: 'Suresh Verma', points: 2000, rank: 5, zoneId: 'all' },
    { userId: 'u6', name: 'Ankita Mehra', points: 1950, rank: 6, zoneId: 'all' },
    { userId: 'u7', name: 'Ravi Shankar', points: 1880, rank: 7, zoneId: 'all' },
    { userId: 'u8', name: 'Maya Reddy', points: 1800, rank: 8, zoneId: 'all' },
    { userId: 'u9', name: 'Arjun Das', points: 1750, rank: 9, zoneId: 'all' },
    { userId: 'u10', name: 'Neha Gupta', points: 1700, rank: 10, zoneId: 'all' },
  ],
  zones: {
    zone_a: [
      { userId: 'u1', name: 'Rajesh Kumar', points: 1200, rank: 1, zoneId: 'zone_a' },
      { userId: 'u8', name: 'Maya Reddy', points: 1150, rank: 2, zoneId: 'zone_a' },
      { userId: 'u9', name: 'Arjun Das', points: 1100, rank: 3, zoneId: 'zone_a' },
      { userId: 'u10', name: 'Neha Gupta', points: 1050, rank: 4, zoneId: 'zone_a' },
      { userId: 'u11', name: 'Kiran Shah', points: 1000, rank: 5, zoneId: 'zone_a' },
    ],
    zone_b: [
      { userId: 'u6', name: 'Ankita Mehra', points: 1300, rank: 1, zoneId: 'zone_b' },
      { userId: 'u7', name: 'Ravi Shankar', points: 1250, rank: 2, zoneId: 'zone_b' },
      { userId: 'u12', name: 'Sunil Joshi', points: 1190, rank: 3, zoneId: 'zone_b' },
      { userId: 'u13', name: 'Pallavi Nair', points: 1150, rank: 4, zoneId: 'zone_b' },
      { userId: 'u5', name: 'Suresh Verma', points: 1130, rank: 5, zoneId: 'zone_b' },
    ],
    zone_c: [
      { userId: 'u14', name: 'Ishaan Khanna', points: 1250, rank: 1, zoneId: 'zone_c' },
      { userId: 'u15', name: 'Ritika Malhotra', points: 1220, rank: 2, zoneId: 'zone_c' },
      { userId: 'u16', name: 'Farhan Sheikh', points: 1180, rank: 3, zoneId: 'zone_c' },
      { userId: 'u17', name: 'Lavanya Rao', points: 1125, rank: 4, zoneId: 'zone_c' },
      { userId: 'u18', name: 'Manish Bhatt', points: 1100, rank: 5, zoneId: 'zone_c' },
    ],
  },
};