import apiClient from '../../../../Api';
import type { Report, IssueCategory } from '../../../../types/index';

// Define the shape of the standard paginated API response from Django
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

export const getIssueCategories = async (municipalityId: string): Promise<IssueCategory[]> => {
    // We expect the API to return a paginated response object.
    const { data } = await apiClient.get<PaginatedResponse<IssueCategory>>(`/issue-categories/?municipality=${municipalityId}`);
    
    // The actual list of categories is inside the 'results' property.
    // We return this array so the component doesn't have to worry about pagination structure.
    // If for some reason the API doesn't paginate and returns a direct array, `data.results` would be undefined,
    // so we provide a fallback to an empty array to prevent errors.
    return data.results || [];
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}