// src/services/api/locationService.ts
import apiClient from '../../Api';
import type { Location } from '../../types';

/**
 * Fetches the details of a single location by its UUID.
 * @param locationId The UUID of the location.
 */
export const getLocationById = (locationId: string) => {
  return apiClient.get<Location>(`/locations/${locationId}/`);
};