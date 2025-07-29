export interface IProduct {
  id: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  sku: string;
  image_url?: string;
  description?: string;
}

export interface IProductResponse {
  data: {
    data: IProduct[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  success: boolean;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  cost: number;
  quantity: number;
  sku: string;
}

export interface ApiErrorResponse {
  message: string;
} 