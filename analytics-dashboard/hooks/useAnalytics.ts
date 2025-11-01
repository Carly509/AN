import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import * as Types from '@/lib/types';

// ============ ORIGINAL 6 ENDPOINTS ============

/**
 * Fetches overall summary statistics
 * Endpoint: GET /api/analytics/summary
 */
export const useSummary = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.SummaryStats, unknown> => {
  return useQuery({
    queryKey: ['analytics', 'summary', dateRange],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.SummaryStats>(
          '/api/analytics/summary',
          {
            params: dateRange,
          }
        );
        return data;
      } catch (error) {
        console.error('Error fetching summary:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep cached data for 10 minutes
    retry: 1, // Retry once on failure
  });
};

/**
 * Fetches profit breakdown by team
 * Endpoint: GET /api/analytics/profit-by-team
 */
export const useProfitByTeam = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.TeamPerformance[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-team', dateRange],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.TeamPerformance[]>(
          '/api/analytics/profit-by-team',
          {
            params: dateRange,
          }
        );
        return data;
      } catch (error) {
        console.error('Error fetching profit by team:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches profit breakdown by individual agent
 * Endpoint: GET /api/analytics/profit-by-agent
 */
export const useProfitByAgent = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.AgentPerformance[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-agent', dateRange],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.AgentPerformance[]>(
          '/api/analytics/profit-by-agent',
          {
            params: dateRange,
          }
        );
        return data;
      } catch (error) {
        console.error('Error fetching profit by agent:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches lead source effectiveness (most profitable outreach methods)
 * Endpoint: GET /api/analytics/profit-by-lead
 */
export const useProfitByLead = (): UseQueryResult<
  Types.LeadSourceEffectiveness[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-lead'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.LeadSourceEffectiveness[]>(
          '/api/analytics/profit-by-lead'
        );
        return data;
      } catch (error) {
        console.error('Error fetching profit by lead:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches top performing agents
 * Endpoint: GET /api/analytics/top-performers
 */
export const useTopPerformers = (
  limit: number = 10
): UseQueryResult<Types.AgentPerformance[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'top-performers', limit],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.AgentPerformance[]>(
          '/api/analytics/top-performers',
          {
            params: { limit },
          }
        );
        return data;
      } catch (error) {
        console.error('Error fetching top performers:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches overall company efficiency metrics
 * Endpoint: GET /api/analytics/efficiency
 */
export const useCompanyEfficiency = (): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ['analytics', 'efficiency'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/api/analytics/efficiency');
        return data;
      } catch (error) {
        console.error('Error fetching company efficiency:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// ============ NEW ADVANCED 7 ENDPOINTS ============

/**
 * Fetches profit trends over time (daily/weekly/monthly)
 * Endpoint: GET /api/analytics/trends
 */
export const useTrends = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.TrendData[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'trends', dateRange],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.TrendData[]>(
          '/api/analytics/trends',
          {
            params: dateRange,
          }
        );
        return data;
      } catch (error) {
        console.error('Error fetching trends:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches performance comparison (best vs worst performers)
 * Endpoint: GET /api/analytics/performance-comparison
 */
export const usePerformanceComparison = (): UseQueryResult<
  Types.PerformanceComparison,
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'performance-comparison'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.PerformanceComparison>(
          '/api/analytics/performance-comparison'
        );
        return data;
      } catch (error) {
        console.error('Error fetching performance comparison:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches ROI metrics for each lead source method
 * Endpoint: GET /api/analytics/lead-roi
 */
export const useLeadROI = (): UseQueryResult<Types.LeadROI[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'lead-roi'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.LeadROI[]>(
          '/api/analytics/lead-roi'
        );
        return data;
      } catch (error) {
        console.error('Error fetching lead ROI:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches team x lead method matrix (performance of each method per team)
 * Endpoint: GET /api/analytics/team-lead-matrix
 */
export const useTeamLeadMatrix = (): UseQueryResult<
  Types.TeamLeadMatrixRow[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'team-lead-matrix'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.TeamLeadMatrixRow[]>(
          '/api/analytics/team-lead-matrix'
        );
        return data;
      } catch (error) {
        console.error('Error fetching team lead matrix:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches statistical analysis of profit distribution
 * Endpoint: GET /api/analytics/profit-distribution
 */
export const useProfitDistribution = (): UseQueryResult<
  Types.ProfitDistribution,
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'profit-distribution'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.ProfitDistribution>(
          '/api/analytics/profit-distribution'
        );
        return data;
      } catch (error) {
        console.error('Error fetching profit distribution:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches what each agent specializes in (best performing method per agent)
 * Endpoint: GET /api/analytics/agent-specialization
 */
export const useAgentSpecialization = (): UseQueryResult<
  Types.AgentSpecialization[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'agent-specialization'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.AgentSpecialization[]>(
          '/api/analytics/agent-specialization'
        );
        return data;
      } catch (error) {
        console.error('Error fetching agent specialization:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetches payment collection rates and rankings
 * Endpoint: GET /api/analytics/payment-collection
 */
export const usePaymentCollection = (): UseQueryResult<
  Types.PaymentCollection[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'payment-collection'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<Types.PaymentCollection[]>(
          '/api/analytics/payment-collection'
        );
        return data;
      } catch (error) {
        console.error('Error fetching payment collection:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};
