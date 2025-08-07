import { apiClient } from "@/api/client";
import type { IProductResponse, CreateProductPayload } from "@/interfaces/product.interfaces";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const getProducts = async (page = 1, pageSize = 10, search?: string) => {
  try {
    const params: { page: number; pageSize: number; search?: string } = {
      page,
      pageSize,
    };
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const { data } = await apiClient.get<IProductResponse>("/products", {
      params
    });
    console.log({data}, "data");
    return data;
  } catch (error) {
    console.log({error}, "error");
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  }
};

export const addProduct = async (productData: CreateProductPayload) => {
  try {
    const { data } = await apiClient.post("/products", productData);
    return data;
  } catch (error) {
    console.error("Error adding product:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error("Error adding product. Please try again.");
  }
};

export const updateProduct = async (id: string, productData: Partial<CreateProductPayload>) => {
  try {
    const { data } = await apiClient.put(`/products/${id}`, productData);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error("Error updating product. Please try again.");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await apiClient.put(`/products/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response && axiosError.response.data && axiosError.response.data.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error("Error deleting product. Please try again.");
  }
}; 