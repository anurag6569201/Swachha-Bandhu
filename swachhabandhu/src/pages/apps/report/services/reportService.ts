import apiClient from '../../../../Api';
import type { Report, IssueCategory } from '../../../../types/index';

export const createReport = async (formData: FormData): Promise<Report> => {
  const { data } = await apiClient.post<Report>('/reports/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getIssueCategories = async (municipalityId: string): Promise<IssueCategory[]> => {
    const { data } = await apiClient.get<IssueCategory[]>(`/issue-categories/?municipality=${municipalityId}`);
    return data;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}