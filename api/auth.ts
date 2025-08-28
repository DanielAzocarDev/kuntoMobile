
import type {
  ILoginUser,
  LoginResponse,
  ApiError,
  IForgotPassword,
  ForgotPasswordResponse,
  IResetPassword,
  ResetPasswordResponse,
} from "../interfaces/auth.interfaces";
import { apiClient } from './client';

export const forgotPassword = async (
  payload: IForgotPassword
): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await apiClient.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      payload
    );
    console.log(data);
    return data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const resetPassword = async (
  payload: IResetPassword
): Promise<ResetPasswordResponse> => {
  try {
    const { data } = await apiClient.post<ResetPasswordResponse>(
      "/auth/reset-password",
      payload
    );
    return data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const loginUser = async (payload: ILoginUser): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw error as ApiError;
  }
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await apiClient.put('/auth/change-password', payload);
    return data;
  } catch (error) {
    throw error as ApiError;
  }
};

// Función para validar si el token está expirado
export const validateToken = async (): Promise<boolean> => {
  console.log("🔍 [validateToken] Iniciando validación de token");
  
  try {
    console.log("🔍 [validateToken] Haciendo petición a /auth/validate");
    const { data } = await apiClient.get('/auth/validate');
    console.log("🔍 [validateToken] Respuesta del servidor:", data);
    
    if (data.success) {
      console.log("✅ [validateToken] Token válido");
      return true;
    } else {
      console.log("❌ [validateToken] Token inválido según respuesta del servidor");
      return false;
    }
  } catch (error) {
    const apiError = error as ApiError;
    console.log("❌ [validateToken] Error en la petición:", apiError);
    console.log("❌ [validateToken] Status:", apiError.status);
    console.log("❌ [validateToken] Response data:", apiError.response?.data);
    
    // Si hay un error 401 (Unauthorized), el token está expirado
    if (apiError.status === 401) {
      console.log("❌ [validateToken] Token expirado (401 Unauthorized)");
      return false;
    }
    
    // Para otros errores, asumimos que el token no es válido
    console.log("❌ [validateToken] Otro tipo de error, asumiendo token inválido");
    return false;
  }
}; 