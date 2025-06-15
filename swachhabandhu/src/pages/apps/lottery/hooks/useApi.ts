import { useState, useEffect, useCallback } from 'react';

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  deps: React.DependencyList = []
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      console.error("API call failed:", err);
      setError(err.response?.data?.detail || err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}