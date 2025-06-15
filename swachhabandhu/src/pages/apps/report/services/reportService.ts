// src/pages/apps/report/services/reportService.ts
import apiClient from '../../../../Api';
import type { Report, IssueCategory } from '../../../../types/index';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const createReport = async (formData: FormData): Promise<Report> => {
  const { data } = await apiClient.post<Report>('/reports/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// --- NEW FUNCTION ---
export const verifyReport = async (originalReportId: string, formData: FormData): Promise<Report> => {
  const { data } = await apiClient.post<Report>(`/reports/${originalReportId}/verify/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getIssueCategories = async (municipalityId: string): Promise<IssueCategory[]> => {
    const { data } = await apiClient.get<PaginatedResponse<IssueCategory>>(`/issue-categories/?municipality=${municipalityId}`);
    return data.results || [];
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}