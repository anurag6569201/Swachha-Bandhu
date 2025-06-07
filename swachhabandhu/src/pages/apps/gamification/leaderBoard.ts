// src/pages/apps/LeaderboardPage/leaderBoard.ts
export interface UserAction {
  actionId: string;
  actionType: 'waste_collection' | 'recycling' | 'event_participation' | 'referral';
  wasteType?: 'plastic' | 'organic' | 'metal' | 'other';
  quantity: number; 
  timestamp: string;
  points: number; 
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  city: string;
  points: number;
  rank: number;
  zoneId: string;
  actions: UserAction[];
}

export const availableZones = ['zone_a', 'zone_b', 'zone_c'];

const calculatePoints = (actions: UserAction[]): number => {
  return actions.reduce((total, action) => {
    let points = 0;
    switch (action.actionType) {
      case 'waste_collection':
        points = action.quantity * 10;
        break;
      case 'recycling':
        points = action.quantity * (action.wasteType === 'plastic' ? 15 : 12);
        break;
      case 'event_participation':
        points = action.quantity * 50;
        break;
      case 'referral':
        points = action.quantity * 20;
        break;
    }
    const actionDate = new Date(action.timestamp);
    const daysOld = (Date.now() - actionDate.getTime()) / (1000 * 60 * 60 * 24);
    return total + (daysOld > 30 ? points * 0.5 : points);
  }, 0);
};

export const mockLeaderboardData = {
  global: [
    {
      userId: 'u1',
      name: 'Rajesh Kumar',
      city: 'Delhi',
      points: 0,
      rank: 1,
      zoneId: 'all',
      actions: [
        { actionId: 'a1', actionType: 'recycling', wasteType: 'plastic', quantity: 100, timestamp: '2025-06-01T10:00:00Z', points: 1500 },
        { actionId: 'a2', actionType: 'event_participation', quantity: 2, timestamp: '2025-05-15T09:00:00Z', points: 100 },
      ],
    },
    {
      userId: 'u2',
      name: 'Priya Sharma',
      city: 'Mumbai',
      points: 0,
      rank: 2,
      zoneId: 'all',
      actions: [
        { actionId: 'a3', actionType: 'waste_collection', wasteType: 'organic', quantity: 150, timestamp: '2025-06-02T12:00:00Z', points: 1500 },
        { actionId: 'a4', actionType: 'referral', quantity: 3, timestamp: '2025-06-01T14:00:00Z', points: 60 },
      ],
    },
    {
      userId: 'u3',
      name: 'Amit Patel',
      city: 'Bengaluru',
      points: 0,
      rank: 3,
      zoneId: 'all',
      actions: [
        { actionId: 'a5', actionType: 'recycling', wasteType: 'metal', quantity: 80, timestamp: '2025-06-03T11:00:00Z', points: 960 },
        { actionId: 'a6', actionType: 'event_participation', quantity: 1, timestamp: '2025-04-01T10:00:00Z', points: 50 },
      ],
    },
    {
      userId: 'u4',
      name: 'Deepa Singh',
      city: 'Delhi',
      points: 0,
      rank: 4,
      zoneId: 'all',
      actions: [
        { actionId: 'a7', actionType: 'waste_collection', wasteType: 'other', quantity: 120, timestamp: '2025-06-04T13:00:00Z', points: 1200 },
      ],
    },
    {
      userId: 'u5',
      name: 'Suresh Verma',
      city: 'Mumbai',
      points: 0,
      rank: 5,
      zoneId: 'all',
      actions: [
        { actionId: 'a8', actionType: 'recycling', wasteType: 'plastic', quantity: 60, timestamp: '2025-06-05T15:00:00Z', points: 900 },
        { actionId: 'a9', actionType: 'referral', quantity: 2, timestamp: '2025-06-06T16:00:00Z', points: 40 },
      ],
    },
  ],
  zones: {
    zone_a: [
      {
        userId: 'u1',
        name: 'Rajesh Kumar',
        city: 'Delhi',
        points: 0,
        rank: 1,
        zoneId: 'zone_a',
        actions: [
          { actionId: 'a10', actionType: 'recycling', wasteType: 'plastic', quantity: 50, timestamp: '2025-06-01T10:00:00Z', points: 750 },
        ],
      },
      {
        userId: 'u4',
        name: 'Deepa Singh',
        city: 'Delhi',
        points: 0,
        rank: 2,
        zoneId: 'zone_a',
        actions: [
          { actionId: 'a11', actionType: 'waste_collection', wasteType: 'organic', quantity: 70, timestamp: '2025-06-02T12:00:00Z', points: 700 },
        ],
      },
      {
        userId: 'u6',
        name: 'Ankita Mehra',
        city: 'Noida',
        points: 0,
        rank: 3,
        zoneId: 'zone_a',
        actions: [
          { actionId: 'a12', actionType: 'event_participation', quantity: 1, timestamp: '2025-06-03T11:00:00Z', points: 50 },
        ],
      },
    ],
    zone_b: [
      {
        userId: 'u2',
        name: 'Priya Sharma',
        city: 'Mumbai',
        points: 0,
        rank: 1,
        zoneId: 'zone_b',
        actions: [
          { actionId: 'a13', actionType: 'waste_collection', wasteType: 'organic', quantity: 80, timestamp: '2025-06-01T14:00:00Z', points: 800 },
        ],
      },
      {
        userId: 'u5',
        name: 'Suresh Verma',
        city: 'Mumbai',
        points: 0,
        rank: 2,
        zoneId: 'zone_b',
        actions: [
          { actionId: 'a14', actionType: 'recycling', wasteType: 'plastic', quantity: 40, timestamp: '2025-06-02T15:00:00Z', points: 600 },
        ],
      },
      {
        userId: 'u7',
        name: 'Ravi Shankar',
        city: 'Pune',
        points: 0,
        rank: 3,
        zoneId: 'zone_b',
        actions: [
          { actionId: 'a15', actionType: 'referral', quantity: 2, timestamp: '2025-06-03T16:00:00Z', points: 40 },
        ],
      },
    ],
    zone_c: [
      {
        userId: 'u3',
        name: 'Amit Patel',
        city: 'Bengaluru',
        points: 0,
        rank: 1,
        zoneId: 'zone_c',
        actions: [
          { actionId: 'a16', actionType: 'recycling', wasteType: 'metal', quantity: 60, timestamp: '2025-06-01T10:00:00Z', points: 720 },
        ],
      },
      {
        userId: 'u8',
        name: 'Maya Reddy',
        city: 'Bengaluru',
        points: 0,
        rank: 2,
        zoneId: 'zone_c',
        actions: [
          { actionId: 'a17', actionType: 'waste_collection', wasteType: 'other', quantity: 50, timestamp: '2025-06-02T12:00:00Z', points: 500 },
        ],
      },
      {
        userId: 'u9',
        name: 'Arjun Das',
        city: 'Chennai',
        points: 0,
        rank: 3,
        zoneId: 'zone_c',
        actions: [
          { actionId: 'a18', actionType: 'event_participation', quantity: 1, timestamp: '2025-06-03T11:00:00Z', points: 50 },
        ],
      },
    ],
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
Object.values(mockLeaderboardData).forEach((data: any) => {
  if (Array.isArray(data)) {
    data.forEach((entry) => {
      entry.points = calculatePoints(entry.actions);
    });
    data.sort((a, b) => b.points - a.points);
    data.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  } else {
    Object.values(data).forEach((zoneData: LeaderboardEntry[]) => {
      zoneData.forEach((entry) => {
        entry.points = calculatePoints(entry.actions);
      });
      zoneData.sort((a, b) => b.points - a.points);
      zoneData.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    });
  }
});