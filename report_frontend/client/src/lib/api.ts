import { API_CONFIG, AUTH_STORAGE } from './config';
import { User, Organization, Repository, UserOrganizationMembership } from './types';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface SyncResponse {
  success: boolean;
  message: string;
  syncedOrganizations?: number;
  personalOrganization?: string;
  organizations?: Organization[];
  totalRepositories?: number;
  organizationCounts?: Record<string, number>;
}

interface OnboardingStatus {
  user: User;
  isOnboarded: boolean;
  currentStep: string;
}

interface OnboardingProgress {
  user: User;
  isOnboarded: boolean;
  organizationsCount: number;
  repositoriesCount: number;
  hasGitHubToken: boolean;
  currentStep: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(AUTH_STORAGE.TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async getGitHubAuthUrl(): Promise<{ url: string }> {
    return this.request(API_CONFIG.AUTH_ENDPOINTS.GITHUB_URL);
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request(API_CONFIG.AUTH_ENDPOINTS.HEALTH);
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    return this.request(API_CONFIG.ENDPOINTS.USERS_ME);
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    return this.request(API_CONFIG.ENDPOINTS.USERS_ME, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Organization endpoints
  async getUserOrganizations(userId: string): Promise<UserOrganizationMembership[]> {
    return this.request(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/user/${userId}`);
  }

  async syncOrganizations(): Promise<SyncResponse> {
    return this.request(API_CONFIG.ENDPOINTS.ORGANIZATIONS_SYNC, {
      method: 'POST',
    });
  }

  async getOrganization(id: string): Promise<Organization> {
    return this.request(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${id}`);
  }

  async switchOrganization(organizationId: string): Promise<{ organizationId: string; organizationName: string; message: string }> {
    return this.request(`${API_CONFIG.ENDPOINTS.ORGANIZATIONS}/${organizationId}/switch`, {
      method: 'POST',
    });
  }

  // Repository endpoints
  async getRepositories(organizationId: string, status?: string, search?: string): Promise<Repository[]> {
    const params = new URLSearchParams({ organizationId });
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    return this.request(`${API_CONFIG.ENDPOINTS.REPOSITORIES}?${params}`);
  }

  async syncAllRepositories(): Promise<SyncResponse> {
    return this.request(API_CONFIG.ENDPOINTS.REPOSITORIES_SYNC_ALL, {
      method: 'POST',
    });
  }

  async syncRepository(id: string): Promise<{ repositoryId: string; status: string; message: string }> {
    return this.request(`${API_CONFIG.ENDPOINTS.REPOSITORIES}/${id}/sync`, {
      method: 'POST',
    });
  }

  async toggleRepository(id: string): Promise<Repository> {
    return this.request(`${API_CONFIG.ENDPOINTS.REPOSITORIES}/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async addRepository(data: { name: string; description: string; githubUrl: string; organizationId: string }): Promise<Repository> {
    return this.request(API_CONFIG.ENDPOINTS.REPOSITORIES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Onboarding endpoints
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    return this.request(`${API_CONFIG.ENDPOINTS.ONBOARDING}/status`);
  }

  async syncOnboardingOrganizations(): Promise<SyncResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.ONBOARDING}/sync-organizations`, {
      method: 'POST',
    });
  }

  async syncOnboardingRepositories(): Promise<SyncResponse> {
    return this.request(`${API_CONFIG.ENDPOINTS.ONBOARDING}/sync-repositories`, {
      method: 'POST',
    });
  }

  async completeOnboarding(preferences: Record<string, any> = {}): Promise<{ success: boolean; message: string; user: User; redirectTo: string }> {
    return this.request(`${API_CONFIG.ENDPOINTS.ONBOARDING}/complete`, {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async getOnboardingProgress(): Promise<OnboardingProgress> {
    return this.request(`${API_CONFIG.ENDPOINTS.ONBOARDING}/progress`);
  }

  // Analytics endpoints (existing)
  async getKPIs(organizationId?: string, userRole?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (userRole) params.append('userRole', userRole);
    
    return this.request(`${API_CONFIG.ENDPOINTS.ANALYTICS}/kpis?${params}`);
  }

  async getChartData(type: string, organizationId?: string, dateRange?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (organizationId) params.append('organizationId', organizationId);
    if (dateRange) params.append('dateRange', dateRange);
    
    return this.request(`${API_CONFIG.ENDPOINTS.ANALYTICS}/charts/${type}?${params}`);
  }
}

export const apiService = new ApiService();
export default apiService;
