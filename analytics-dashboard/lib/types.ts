// ============ AUTHENTICATION ============

export interface User {
  username: string;
  role: 'admin' | 'manager';
}

export interface AuthResponse {
  token: string;
  user?: User;
}

// ============ SUMMARY STATS ============

export interface SummaryStats {
  totalProfit: number;
  totalAgents: number;
  totalLeads: number;
  avgProfitPerAgent: number;
  conversionRate?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

// ============ TEAM PERFORMANCE ============

export interface TeamPerformance {
  teamId: string;
  teamName: string;
  profit: number;
  agentCount: number;
  avgProfitPerAgent: number;
  conversionRate?: number;
  leadsHandled?: number;
}

// ============ AGENT PERFORMANCE ============

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  department: string;
  totalProfit: number;
  leadsHandled: number;
  conversionRate: number;
  rank?: number;
}

// ============ LEAD SOURCE EFFECTIVENESS ============

export interface LeadSourceEffectiveness {
  method: string;
  totalProfit: number;
  leadCount: number;
  avgProfitPerLead: number;
  conversionRate: number;
}

// ============ TREND DATA ============

export interface TrendData {
  date: string;
  profit: number;
  leads: number;
  conversions: number;
}

// ============ PERFORMANCE COMPARISON ============

export interface PerformanceComparison {
  topPerformers: AgentPerformance[];
  bottomPerformers: AgentPerformance[];
  averageMetrics: {
    avgProfit: number;
    avgLeads: number;
    avgConversion: number;
  };
}

// ============ LEAD ROI ============

export interface LeadROI {
  method: string;
  totalInvestment: number;
  totalReturn: number;
  roi: number;
  profitMargin: number;
  roi_percentage?: number;
}

// ============ TEAM LEAD MATRIX ============

export interface TeamLeadMatrixRow {
  team: string;
  [method: string]: any;
}

// ============ PROFIT DISTRIBUTION ============

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

// ============ AGENT SPECIALIZATION ============

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

// ============ PAYMENT COLLECTION ============

export interface PaymentCollection {
  agentId: string;
  agentName: string;
  collectionRate: number;
  totalOutstanding: number;
  totalCollected: number;
  rank?: number;
}

// ============ COMPANY EFFICIENCY ============

export interface CompanyEfficiency {
  score: number;
  avgLeadsPerAgent: number;
  avgProfitPerLead: number;
  overallConversionRate: number;
  efficiency_percentage?: number;
  [key: string]: any;
}

// ============ API ERROR ============

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============ PAGINATION ============

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============ FILTER OPTIONS ============

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
