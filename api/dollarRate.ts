import {apiClient} from "@/api/client";

export interface IDollarRate {
  id: string;
  rate: number;
  source: string;
  lastUpdated: string;
}

export const getDollarRate = async (): Promise<IDollarRate> => {
  try {
    const response = await apiClient.get<{ data: IDollarRate }>("/dollar-rate");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dollar rate:", error);
    throw new Error("No se pudo obtener el valor del dólar.");
  }
};

