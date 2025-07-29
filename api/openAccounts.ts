import { apiClient } from './client';

export interface IOpenAccount {
  id: string;
  clientId: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  sales?: Array<{
    id: string;
    total: number;
    status: 'PENDING' | 'PAID';
    createdAt: string;
    items?: Array<{
      id: string;
      productId: string;
      quantity: number;
      price: number;
      name: string;
      product?: {
        id: string;
        name: string;
      };
    }>;
    Payment?: Array<{
      id: string;
      amount: number;
      method: string;
      createdAt: string;
    }>;
  }>;
  totalPaidOnThisAccount?: number;
}

export interface IOpenAccountResponse {
  data: {
    data: IOpenAccount[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  success: boolean;
}

export const getOpenAccounts = async (page = 1, pageSize = 10, search?: string) => {
  try {
    const params: { page: number; pageSize: number; search?: string } = {
      page,
      pageSize,
    };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const { data } = await apiClient.get<IOpenAccountResponse>('/open-accounts', {
      params,
    });
    return data;
  } catch (error) {
    console.error('Error fetching open accounts:', error);
    throw new Error('Error fetching open accounts');
  }
};

export const getOpenAccountById = async (id: string) => {
  try {
    const { data } = await apiClient.get<{ success: boolean; data: IOpenAccount }>(`/open-accounts/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching open account by ID:", error);
    throw new Error("Failed to fetch open account by ID");
  }
}; 