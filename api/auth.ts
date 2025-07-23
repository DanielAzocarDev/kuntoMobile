
import type { ILoginUser, LoginResponse, ApiError } from '../interfaces/auth.interfaces';
import { apiClient } from './client';



export const loginUser = async (payload: ILoginUser): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw error as ApiError;
  }
}; 