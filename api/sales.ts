import { apiClient } from './client';
import type { ISaleResponse, ISale } from '../interfaces/sales.interfaces';

export const createSale = async (saleData: Omit<ISale, "id">) => {
  try {
    const { data } = await apiClient.post("/sales", saleData);
    return data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw new Error("Error creating sale. Please try again.");
  }
};

export const getSales = async (page = 1, pageSize = 10, search?: string) => {
  try {
    const params: { page: number; pageSize: number; search?: string } = {
      page,
      pageSize,
    };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const { data } = await apiClient.get<ISaleResponse>('/sales', {
      params,
    });
    return data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw new Error('Error fetching sales');
  }
}; 