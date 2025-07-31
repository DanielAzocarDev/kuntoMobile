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

export const updateUserProfile = async (payload: {
  name: string;
  email: string;
  country: string;
  currency: string;
  currencySymbol: string;
}) => {
  try {
    const { data } = await apiClient.put('/user/profile', payload);
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 