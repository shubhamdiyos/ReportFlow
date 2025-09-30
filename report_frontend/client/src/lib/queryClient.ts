import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_CONFIG, AUTH_STORAGE } from "./config";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE.TOKEN);
}

// Create headers with JWT authentication
function createHeaders(includeAuth: boolean = true, additionalHeaders: Record<string, string> = {}): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: { includeAuth?: boolean; additionalHeaders?: Record<string, string> } = {},
): Promise<Response> {
  const { includeAuth = true, additionalHeaders = {} } = options;
  
  // Convert relative URLs to absolute URLs
  const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: createHeaders(includeAuth, additionalHeaders),
    body: data ? JSON.stringify(data) : undefined,
  });

  // Handle token expiration
  if (res.status === 401 && includeAuth) {
    // Clear invalid token and user data
    localStorage.removeItem(AUTH_STORAGE.TOKEN);
    localStorage.removeItem(AUTH_STORAGE.USER);
    // Redirect to login will be handled by the auth context
    window.location.href = '/login';
    return res;
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Convert queryKey array to full URL
    const urlPath = queryKey.join("/");
    const fullUrl = urlPath.startsWith('http') ? urlPath : `${API_CONFIG.BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
    
    const res = await fetch(fullUrl, {
      headers: createHeaders(true),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      // Clear invalid token and user data
      localStorage.removeItem(AUTH_STORAGE.TOKEN);
      localStorage.removeItem(AUTH_STORAGE.USER);
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
