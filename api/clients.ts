import { apiClient } from './client';
import { IClientResponse, IClient, CreateClientPayload } from '../interfaces/client.interfaces';

export const getClients = async (page: number = 1, limit: number = 50): Promise<IClientResponse> => {
  try {
    const response = await apiClient.get(`/clients?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData: CreateClientPayload): Promise<{ success: boolean; data: IClient }> => {
  try {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}; 