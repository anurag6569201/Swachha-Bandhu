// src/services/api/reportService.ts
import apiClient from '../../Api';

/**
 * Submits a new report.
 * Because this includes files, it must be sent as FormData.
 * @param reportData The FormData object containing the report details.
 */
export const submitReport = (reportData: FormData) => {
  return apiClient.post('/reports/', reportData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};