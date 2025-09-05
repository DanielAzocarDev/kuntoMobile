import { apiClient } from './client';

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface CountriesResponse {
  success: boolean;
  data: Country[];
}

export const getCountries = async () => {
  try {
    const response = await apiClient.get('/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('No se pudieron cargar los países. Inténtalo de nuevo más tarde.');
  }
}; 