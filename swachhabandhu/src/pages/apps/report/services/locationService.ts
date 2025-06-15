import apiClient from '../../../../Api';

export interface LocationDetails {
  id: string;
  name: string;
  description: string;
  location_type: string;
  municipality: string; // The UUID of the municipality
  municipality_name: string;
  latitude: number;
  longitude: number;
  geofence_radius: number;
}

export const getLocationDetails = async (locationId: string): Promise<LocationDetails> => {
  const { data } = await apiClient.get<LocationDetails>(`/locations/${locationId}/`);
  return data;
};