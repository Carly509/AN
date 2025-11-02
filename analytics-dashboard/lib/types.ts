// ==================== AUTH TYPES ====================

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager';
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user: {
    id: string;
    username: string;
    role: 'admin' | 'manager';
  };
}

// ==================== DATA TYPES ====================

export interface Job {
  _id: string;
  agent: string;
  timestamp: string;
  profit: number;
  jobNumber: number;
  status: 'paid' | 'unpaid';
  lead: string;
}

export interface Role {
  _id: string;
  agent: string;
  role: string; // 'Tech Sales' | 'Home Sales' | 'Auto Sales'
}

// ==================== ANALYTICS TYPES ====================

// /api/analytics/summary
export interface SummaryStats {
  totalProfit: number;
  totalJobs: number;
  avgProfitPerJob: number;
  paidJobs: number;
  unpaidJobs: number;
  paidProfit: number;
  unpaidProfit: number;
  paymentRate: number;
}

// /api/analytics/profit-by-team
export interface TeamPerformance {
  team: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
}

// /api/analytics/profit-by-agent
export interface AgentPerformance {
  agent: string;
  team: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
}

// /api/analytics/profit-by-lead
export interface LeadSourceEffectiveness {
  leadSource: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  conversionRate: number;
  paymentRate: number;
}

// /api/analytics/top-performers
export interface TopPerformer {
  agent: string;
  team: string;
  totalProfit: number;
  jobCount: number;
}

// /api/analytics/efficiency
export interface CompanyEfficiency {
  totalAgents: number;
  totalJobs: number;
  avgJobsPerAgent: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
  uniqueLeadSources: number;
  teamDistribution: Record<string, number>;
}

// /api/analytics/trends
export interface TrendData {
  month: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
}

// /api/analytics/performance-comparison
export interface PerformanceComparison {
  topPerformers: Array<{
    agent: string;
    team: string;
    totalProfit: number;
    jobCount: number;
    avgProfit: number;
    paidJobs: number;
    paymentRate: number;
  }>;
  bottomPerformers: Array<{
    agent: string;
    team: string;
    totalProfit: number;
    jobCount: number;
    avgProfit: number;
    paidJobs: number;
    paymentRate: number;
  }>;
  teamAverages: Record<string, number>;
  companyAverage: number;
}

// /api/analytics/lead-roi
export interface LeadROI {
  leadSource: string;
  totalProfit: number;
  paidProfit: number;
  unpaidProfit: number;
  jobCount: number;
  paidJobs: number;
  unpaidJobs: number;
  avgProfit: number;
  avgPaidProfit: number;
  paymentRate: number;
  roi: number;
}

// /api/analytics/team-lead-matrix
export interface TeamLeadMatrix {
  team: string;
  leadSource: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  paymentRate: number;
}

// /api/analytics/profit-distribution
export interface ProfitDistribution {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  totalJobs: number;
  totalProfit: number;
}

// /api/analytics/agent-specialization
export interface AgentSpecialization {
  agent: string;
  team: string;
  bestLeadSource: string;
  bestLeadProfit: number;
  bestLeadJobCount: number;
  bestLeadAvgProfit: number;
  allLeadSources: Array<{
    leadSource: string;
    totalProfit: number;
    jobCount: number;
    avgProfit: number;
  }>;
}

// /api/analytics/payment-collection
export interface PaymentCollection {
  agent: string;
  team: string;
  totalJobs: number;
  paidJobs: number;
  unpaidJobs: number;
  paidProfit: number;
  unpaidProfit: number;
  paymentRate: number;
}

// ==================== UTILITY TYPES ====================

export interface ApiError {
  error: string;
}

export interface HealthCheck {
  status: 'ok';
  timestamp: string;
  collections: {
    dummy_data: boolean;
    dummy_roles: boolean;
  };
}

// ==================== QUERY PARAMS ====================

export interface TopPerformersQuery {
  limit?: number;
}

export interface DateRange {
  start?: string;
  end?: string;
}

export interface AnalyticsFilters {
  dateRange?: DateRange;
  team?: string;
  agent?: string;
  leadSource?: string;
}

// ==================== HELPER TYPES ====================

export type LeadSource = 'Cold Call' | 'Google Ads' | 'Recommendation' | string;
export type TeamRole = 'Tech Sales' | 'Home Sales' | 'Auto Sales' | string;
export type JobStatus = 'paid' | 'unpaid';

// ==================== API RESPONSE WRAPPERS ====================

export type ApiResponse<T> = T | ApiError;

// Generic paginated response if you add pagination later
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
