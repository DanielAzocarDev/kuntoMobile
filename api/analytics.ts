import { apiClient } from "./client";

// Tipos para las respuestas de analytics (adaptados para mobile)
export interface DailyAnalytics {
  date: string;
  totalSales: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface WeeklyAnalytics {
  weekStart: string;
  weekEnd: string;
  totalSales: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface MonthlyAnalytics {
  month: string; // formato YYYY-MM
  totalSales: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface TopProductAnalytics {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  timesSold: number;
  profit: number;
  averagePrice: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalSales: number;
  monthlyRevenue: number;
  monthlySales: number;
  totalProfit: number;
  totalCost: number;
  profitMargin: number;
  salesByStatus: Array<{
    status: "PAID" | "PENDING";
    count: number;
    amount: number;
  }>;
}

export interface ClientAnalytics {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  averageOrderValue: number;
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    totalRevenue: number;
    totalOrders: number;
    lastOrderDate: number;
  }>;
  clientRetentionRate: number;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    period?: string;
    limit?: number;
    simplified?: boolean;
  };
}

// Función auxiliar para números seguros (similar a la web)
export const safeMobileNumber = (value: unknown): number => {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "object" && value !== null && "id" in (value as any)) {
    const id = (value as any).id;
    if (typeof id === "number" && !isNaN(id)) return id;
  }
  return 0;
};

// Funciones API para analytics optimizadas para mobile
export const getDailyAnalytics = async (
  days: number = 30
): Promise<AnalyticsResponse<DailyAnalytics[]>> => {
  const { data } = await apiClient.get(
    `/sales/analytics/daily?days=${days}&mobile=true`
  );
  return data;
};

export const getWeeklyAnalytics = async (
  weeks: number = 12
): Promise<AnalyticsResponse<WeeklyAnalytics[]>> => {
  const { data } = await apiClient.get(
    `/sales/analytics/weekly?weeks=${weeks}&mobile=true`
  );
  return data;
};

export const getMonthlyAnalytics = async (
  months: number = 12
): Promise<AnalyticsResponse<MonthlyAnalytics[]>> => {
  const { data } = await apiClient.get(
    `/sales/analytics/monthly?months=${months}&mobile=true`
  );
  return data;
};

export const getTopProductsAnalytics = async (
  limit: number = 5
): Promise<AnalyticsResponse<TopProductAnalytics[]>> => {
  const { data } = await apiClient.get(
    `/sales/analytics/top-products?limit=${limit}&mobile=true`
  );
  return data;
};

export const getRevenueAnalytics = async (): Promise<
  AnalyticsResponse<RevenueAnalytics>
> => {
  const { data } = await apiClient.get(
    "/sales/analytics/revenue?mobile=true"
  );
  return data;
};

export const getClientAnalytics = async (): Promise<
  AnalyticsResponse<ClientAnalytics>
> => {
  const { data } = await apiClient.get(
    "/sales/analytics/clients?mobile=true"
  );
  return data;
};
