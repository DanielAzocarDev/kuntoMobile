export interface IClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClientResponse {
  data: {
    data: IClient[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  success: boolean;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ApiErrorResponse {
  message: string;
} 