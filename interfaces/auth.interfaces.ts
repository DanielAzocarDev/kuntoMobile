export interface ILoginUser {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface ApiError {
  response?: {
    data?: {
      success?: number;
      message?: string;
    };
  };
  status?: number;
}

export interface IForgotPassword {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}