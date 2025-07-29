import { apiClient } from './client';

export const updateUserCountry = async (payload: {
  country: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
}) => {
  try {
    const { data } = await apiClient.put('/user/country', payload);
    return data;
  } catch (error) {
    console.error('Error updating user country:', error);
    throw new Error('Error updating user country');
  }
}; 