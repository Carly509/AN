
export interface User {
  username: string;
  role: 'admin' | 'manager';
}

export interface AuthResponse {
  token: string;
  user?: User;
}

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

export interface TeamPerformance {
  team: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  department: string;
  totalProfit: number;
  leadsHandled: number;
  conversionRate: number;
  rank?: number;
}

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

export interface TrendData {
  month: string;
  totalProfit: number;
  jobCount: number;
  avgProfit: number;
  paidJobs: number;
  unpaidJobs: number;
  paymentRate: number;
}

export interface PerformanceComparison {
  topPerformers: AgentPerformance[];
  bottomPerformers: AgentPerformance[];
  averageMetrics: {
    avgProfit: number;
    avgLeads: number;
    avgConversion: number;
  };
}

export interface LeadROI {
  method: string;
  totalInvestment: number;
  totalReturn: number;
  roi: number;
  profitMargin: number;
  roi_percentage?: number;
}

export interface TopPerformer {
  agent: string;
  team: string;
  totalProfit: number;
  jobCount: number;
}

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

export interface TeamLeadMatrixRow {
  team: string;
  [method: string]: any;
}

export interface ProfitDistribution {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export interface AgentSpecialization {
  agentId: string;
  agentName: string;
  bestMethod: string;
  bestMethodProfit: number;
  methodBreakdown: {
    method: string;
    profit: number;
    percentage: number;
  }[];
}

export interface PaymentCollection {
  agentId: string;
  agentName: string;
  collectionRate: number;
  totalOutstanding: number;
  totalCollected: number;
  rank?: number;
}

export interface CompanyEfficiency {
  score: number;
  avgLeadsPerAgent: number;
  avgProfitPerLead: number;
  overallConversionRate: number;
  efficiency_percentage?: number;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface AnalyticsFilters {
  dateRange?: DateRange;
  teamId?: string;
  agentId?: string;
  method?: string;
}
