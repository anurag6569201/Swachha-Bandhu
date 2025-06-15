import axios from 'axios';
import type { LeaderboardUser, Lottery, UserProfileStats } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/gamification/`,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const fetchUserProfileStats = async (): Promise<UserProfileStats> => {
  const response = await apiClient.get<UserProfileStats>('profile-stats/');
  return response.data;
};

export const fetchLeaderboard = async (period: 'monthly' | 'all_time' = 'all_time'): Promise<LeaderboardUser[]> => {
  const response = await apiClient.get<PaginatedResponse<LeaderboardUser>>(`leaderboard/?period=${period}`);
  return response.data.results;
};

export const fetchLotteries = async (): Promise<Lottery[]> => {
  const response = await apiClient.get<PaginatedResponse<Lottery>>('lotteries/');
  return response.data.results;
};