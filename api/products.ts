import { apiClient } from "@/api/client";
import type { IProductResponse } from "@/interfaces/product.interfaces";

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