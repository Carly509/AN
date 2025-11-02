import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import * as Types from '@/lib/types';

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 1,
} as const;

export const useSummary = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.SummaryStats, unknown> => {
  return useQuery({
    queryKey: ['analytics', 'summary', dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.SummaryStats>(
        '/api/analytics/summary',
        { params: dateRange }
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useProfitByTeam = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.TeamPerformance[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-team', dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.TeamPerformance[]>(
        '/api/analytics/profit-by-team',
        { params: dateRange }
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useProfitByAgent = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.AgentPerformance[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-agent', dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.AgentPerformance[]>(
        '/api/analytics/profit-by-agent',
        { params: dateRange }
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useProfitByLead = (): UseQueryResult<
  Types.LeadSourceEffectiveness[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'profit-by-lead'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.LeadSourceEffectiveness[]>(
        '/api/analytics/profit-by-lead'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useTopPerformers = (
  limit: number = 10
): UseQueryResult<Types.TopPerformer[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'top-performers', limit],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.TopPerformer[]>(
        '/api/analytics/top-performers',
        { params: { limit } }
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useCompanyEfficiency = (): UseQueryResult<
  Types.CompanyEfficiency,
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'efficiency'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.CompanyEfficiency>(
        '/api/analytics/efficiency'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useTrends = (
  dateRange?: { start: string; end: string }
): UseQueryResult<Types.TrendData[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'trends', dateRange],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.TrendData[]>(
        '/api/analytics/trends',
        { params: dateRange }
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const usePerformanceComparison = (): UseQueryResult<
  Types.PerformanceComparison,
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'performance-comparison'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.PerformanceComparison>(
        '/api/analytics/performance-comparison'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useLeadROI = (): UseQueryResult<Types.LeadROI[], unknown> => {
  return useQuery({
    queryKey: ['analytics', 'lead-roi'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.LeadROI[]>(
        '/api/analytics/lead-roi'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useTeamLeadMatrix = (): UseQueryResult<
  Types.TeamLeadMatrix[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'team-lead-matrix'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.TeamLeadMatrix[]>(
        '/api/analytics/team-lead-matrix'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useProfitDistribution = (): UseQueryResult<
  Types.ProfitDistribution,
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'profit-distribution'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.ProfitDistribution>(
        '/api/analytics/profit-distribution'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const useAgentSpecialization = (): UseQueryResult<
  Types.AgentSpecialization[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'agent-specialization'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.AgentSpecialization[]>(
        '/api/analytics/agent-specialization'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};

export const usePaymentCollection = (): UseQueryResult<
  Types.PaymentCollection[],
  unknown
> => {
  return useQuery({
    queryKey: ['analytics', 'payment-collection'],
    queryFn: async () => {
      const { data } = await apiClient.get<Types.PaymentCollection[]>(
        '/api/analytics/payment-collection'
      );
      return data;
    },
    ...QUERY_CONFIG,
  });
};
