// React Query configuration for React Native app
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Configure axios for API calls to the web server
const API_BASE_URL = 'http://localhost:5000'; // This will need to be updated for actual deployment

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create the query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Default fetcher function for React Query
export const defaultQueryFn = async ({ queryKey }: { queryKey: unknown[] }) => {
  const url = queryKey[0] as string;
  if (!url) throw new Error('Query key must contain a URL');
  
  const { data } = await apiClient.get(url);
  return data;
};

// Set the default query function
queryClient.setQueryDefaults([], {
  queryFn: defaultQueryFn,
});

// Helper function for API requests with mutations
export const apiRequest = {
  get: (url: string) => apiClient.get(url).then(res => res.data),
  post: (url: string, data?: any) => apiClient.post(url, data).then(res => res.data),
  put: (url: string, data?: any) => apiClient.put(url, data).then(res => res.data),
  patch: (url: string, data?: any) => apiClient.patch(url, data).then(res => res.data),
  delete: (url: string) => apiClient.delete(url).then(res => res.data),
};