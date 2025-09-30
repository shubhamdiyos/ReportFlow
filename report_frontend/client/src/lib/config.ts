// API Configuration for Spring Boot Backend Integration
export const API_CONFIG = {
  // Spring Boot backend URL (Production)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://reportflow-c6lz.onrender.com/api',
  
  // Authentication endpoints
  AUTH_ENDPOINTS: {
    GITHUB_URL: '/auth/github/url',
    GITHUB_CALLBACK: '/auth/github/callback',
    HEALTH: '/auth/health',
  },
  
  // API endpoints
  ENDPOINTS: {
    USERS: '/users',
    ORGANIZATIONS: '/organizations',
    REPOSITORIES: '/repositories',
    ANALYTICS: '/analytics',
  }
} as const;

// JWT token storage keys
export const AUTH_STORAGE = {
  TOKEN: 'jwt_token',
  USER: 'user',
} as const;