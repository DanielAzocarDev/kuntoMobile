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

export const updateClient = async (id: string, clientData: Partial<CreateClientPayload>): Promise<{ success: boolean; data: IClient }> => {
  try {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put(`/clients/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}; 