import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Organization, UserOrganization } from "@shared/schema";

// Extended interface for organization membership with role information
export interface UserOrganizationMembership extends Organization {
  role: "admin" | "manager" | "developer";
  joinedAt: Date;
  isActive: boolean;
}

// Tenant state interface
interface TenantState {
  selectedTenant: Organization | null;
  userOrganizations: UserOrganizationMembership[];
  isLoading: boolean;
  error: string | null;
}

interface TenantContextType {
  // State
  selectedTenant: Organization | null;
  userOrganizations: UserOrganizationMembership[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  switchTenant: (organizationId: string | null) => Promise<void>;
  refreshUserOrganizations: () => Promise<void>;
  clearTenantState: () => void;
  
  // Computed properties
  isIndividualMode: boolean;
  currentUserRole: "admin" | "manager" | "developer" | null;
  
  // Tenant-aware data fetching helper
  getTenantAwareQueryKey: (baseKey: string | string[], includeOrgId?: boolean) => string[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Initialize state
  const [tenantState, setTenantState] = useState<TenantState>(() => {
    // Try to restore selected tenant from localStorage
    const savedTenantId = localStorage.getItem('selectedTenantId');
    return {
      selectedTenant: null,
      userOrganizations: [],
      isLoading: false,
      error: null,
    };
  });

  // Query to fetch user's organizations
  const { data: userOrganizations = [], isLoading: organizationsLoading } = useQuery<UserOrganizationMembership[]>({
    queryKey: ['api', 'organizations', 'user', user?.id],
    queryFn: async ({ queryKey }) => {
      const userId = queryKey[3];
      if (!userId) throw new Error('User ID is required');
      
      const response = await fetch(`http://localhost:8080/api/organizations/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user organizations: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to switch tenant context
  const switchTenantMutation = useMutation({
    mutationFn: async (organizationId: string | null) => {
      // Skip API call for individual mode (null/empty string)
      if (!organizationId) return { success: true };
      
      // This could include API call to log tenant switch or update user preferences
      return apiRequest('POST', `/organizations/${organizationId}/switch`);
    },
    onSuccess: () => {
      // Invalidate all tenant-specific queries when switching
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey.some(key => 
            typeof key === 'string' && key.includes('tenant:')
          );
        }
      });
    },
  });

  // Switch tenant function
  const switchTenant = useCallback(async (organizationId: string | null) => {
    setTenantState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Handle individual mode (null or empty string)
      if (!organizationId || organizationId === "") {
        // Switch to individual mode
        setTenantState(prev => ({
          ...prev,
          selectedTenant: null,
          isLoading: false,
          error: null,
        }));

        // Remove from localStorage
        localStorage.removeItem('selectedTenantId');
        
        // Execute the mutation for logging/analytics
        await switchTenantMutation.mutateAsync(null);
        
        // Show success toast
        toast({
          title: "Switched to Individual Mode",
          description: "You are now working in individual mode.",
          variant: "default",
        });
        
        return;
      }

      // Handle organization switching
      if (!userOrganizations || userOrganizations.length === 0) {
        const errorMessage = "No organizations available to switch to";
        setTenantState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: errorMessage 
        }));
        
        toast({
          title: "Switch Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const targetOrganization = userOrganizations.find((org: UserOrganizationMembership) => org.id === organizationId);
      if (!targetOrganization) {
        const errorMessage = "Organization not found in user's organizations";
        setTenantState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: errorMessage 
        }));
        
        toast({
          title: "Switch Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Execute the mutation (could be used for logging/analytics)
      await switchTenantMutation.mutateAsync(organizationId);
      
      // Update local state
      setTenantState(prev => ({
        ...prev,
        selectedTenant: {
          id: targetOrganization.id,
          name: targetOrganization.name,
          domain: targetOrganization.domain,
          logo: targetOrganization.logo,
          type: targetOrganization.type,
          createdAt: targetOrganization.createdAt,
        },
        isLoading: false,
        error: null,
      }));

      // Persist to localStorage
      localStorage.setItem('selectedTenantId', organizationId);
      
      // Show success toast
      toast({
        title: "Organization Switched",
        description: `Successfully switched to ${targetOrganization.name}.`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      const errorMessage = "Failed to switch organization";
      setTenantState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage 
      }));
      
      toast({
        title: "Switch Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [userOrganizations, switchTenantMutation, toast]);

  // Refresh user organizations
  const refreshUserOrganizations = useCallback(async () => {
    if (!user?.id) return;
    
    await queryClient.invalidateQueries({
      queryKey: ['api', 'organizations', 'user', user.id]
    });
  }, [user?.id, queryClient]);

  // Clear tenant state (used on logout)
  const clearTenantState = useCallback(() => {
    setTenantState({
      selectedTenant: null,
      userOrganizations: [],
      isLoading: false,
      error: null,
    });
    localStorage.removeItem('selectedTenantId');
    
    // Clear all tenant-specific queries
    queryClient.removeQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return Array.isArray(queryKey) && queryKey.some(key => 
          typeof key === 'string' && key.includes('tenant:')
        );
      }
    });
  }, [queryClient]);

  // Helper function for tenant-aware query keys
  const getTenantAwareQueryKey = useCallback((
    baseKey: string | string[], 
    includeOrgId: boolean = true
  ): string[] => {
    const keyArray = Array.isArray(baseKey) ? baseKey : [baseKey];
    
    if (includeOrgId && tenantState.selectedTenant) {
      return [...keyArray, `tenant:${tenantState.selectedTenant.id}`];
    }
    
    return keyArray;
  }, [tenantState.selectedTenant]);

  // Track if tenant initialization has been completed to prevent infinite loops
  const isInitializingRef = useRef(false);
  const lastUserOrganizationsRef = useRef<UserOrganizationMembership[]>([]);

  // Combined effect: Update userOrganizations and initialize selected tenant
  useEffect(() => {
    // Prevent re-running if we're already initializing or if userOrganizations hasn't actually changed
    if (isInitializingRef.current || 
        JSON.stringify(userOrganizations) === JSON.stringify(lastUserOrganizationsRef.current)) {
      return;
    }

    isInitializingRef.current = true;
    lastUserOrganizationsRef.current = userOrganizations || [];

    if (userOrganizations && userOrganizations.length > 0) {
      const processedOrganizations = userOrganizations.map((org: UserOrganizationMembership) => ({
        ...org,
        joinedAt: new Date(org.joinedAt || new Date()),
      }));

      // Initialize tenant selection logic
      let initialTenant: Organization | null = tenantState.selectedTenant;
      
      // Only initialize if no tenant is currently selected
      if (!initialTenant) {
        const savedTenantId = localStorage.getItem('selectedTenantId');
        
        if (savedTenantId) {
          // Try to restore saved tenant - validate it exists in current organizations
          const savedOrg = userOrganizations.find((org: UserOrganizationMembership) => org.id === savedTenantId);
          if (savedOrg && savedOrg.isActive) {
            initialTenant = {
              id: savedOrg.id,
              name: savedOrg.name,
              domain: savedOrg.domain,
              logo: savedOrg.logo,
              type: savedOrg.type,
              createdAt: savedOrg.createdAt,
            };
          }
        }

        // If no saved tenant or saved tenant is invalid, use first available organization
        if (!initialTenant) {
          const firstActiveOrg = userOrganizations.find((org: UserOrganizationMembership) => org.isActive);
          if (firstActiveOrg) {
            initialTenant = {
              id: firstActiveOrg.id,
              name: firstActiveOrg.name,
              domain: firstActiveOrg.domain,
              logo: firstActiveOrg.logo,
              type: firstActiveOrg.type,
              createdAt: firstActiveOrg.createdAt,
            };
          }
        }
      }

      // Update state in a single operation (including loading state)
      setTenantState(prev => ({
        ...prev,
        userOrganizations: processedOrganizations,
        selectedTenant: initialTenant,
        isLoading: organizationsLoading || switchTenantMutation.isPending,
      }));

      // Persist selected tenant to localStorage if it was just set
      if (initialTenant && initialTenant !== tenantState.selectedTenant) {
        localStorage.setItem('selectedTenantId', initialTenant.id);
      }

    } else if (userOrganizations && userOrganizations.length === 0) {
      // No organizations available - clear everything
      setTenantState(prev => ({
        ...prev,
        userOrganizations: [],
        selectedTenant: null,
        isLoading: organizationsLoading || switchTenantMutation.isPending,
      }));
      localStorage.removeItem('selectedTenantId');
    }

    // Reset the initialization flag after a short delay to allow for state updates
    setTimeout(() => {
      isInitializingRef.current = false;
    }, 100);
  }, [userOrganizations]);

  // Clear tenant state when user logs out
  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearTenantState();
    }
  }, [isAuthenticated, user, clearTenantState]);

  // Update loading state separately only when organizations aren't being processed
  useEffect(() => {
    if (!isInitializingRef.current) {
      setTenantState(prev => ({
        ...prev,
        isLoading: organizationsLoading || switchTenantMutation.isPending,
      }));
    }
  }, [organizationsLoading, switchTenantMutation.isPending]);

  // Computed properties
  const isIndividualMode = tenantState.selectedTenant === null || 
    tenantState.userOrganizations.length === 0 || 
    (tenantState.selectedTenant?.type === "individual");

  const currentUserRole = tenantState.selectedTenant && tenantState.userOrganizations.length > 0
    ? tenantState.userOrganizations.find((org: UserOrganizationMembership) => org.id === tenantState.selectedTenant?.id)?.role || null
    : null;

  const contextValue: TenantContextType = {
    // State
    selectedTenant: tenantState.selectedTenant,
    userOrganizations: tenantState.userOrganizations,
    isLoading: tenantState.isLoading,
    error: tenantState.error,
    
    // Actions
    switchTenant,
    refreshUserOrganizations,
    clearTenantState,
    
    // Computed properties
    isIndividualMode,
    currentUserRole,
    
    // Helper functions
    getTenantAwareQueryKey,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

// Additional hook for components that need to be tenant-aware
export function useTenantAwareQuery<T>(
  baseQueryKey: string | string[],
  options?: {
    enabled?: boolean;
    staleTime?: number;
    includeTenantId?: boolean;
  }
) {
  const { getTenantAwareQueryKey, selectedTenant } = useTenant();
  
  const queryKey = getTenantAwareQueryKey(baseQueryKey, options?.includeTenantId ?? true);
  
  return useQuery<T>({
    queryKey,
    enabled: (options?.enabled ?? true) && !!selectedTenant,
    staleTime: options?.staleTime ?? 30000, // 30 seconds default
  });
}