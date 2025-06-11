// src/utils/errorUtils.ts
export const parseApiError = (error: any): string => {
    if (error.response && error.response.data) {
        const errorData = error.response.data;
        // Handle standard DRF validation errors (object with arrays of strings)
        if (typeof errorData === 'object' && !Array.isArray(errorData)) {
            const messages = Object.entries(errorData).map(([key, value]) => {
                const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return `${fieldName}: ${Array.isArray(value) ? value.join(' ') : value}`;
            });
            if (messages.length > 0) return messages.join('; ');
        }
        // Handle simple error strings (e.g., {"detail": "..."})
        if (errorData.detail) return errorData.detail;
        if (errorData.error) return errorData.error;
    }
    return 'An unexpected error occurred. Please try again.';
};