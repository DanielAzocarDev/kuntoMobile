import { apiClient } from './client';

export interface IPayment {
  id: string;
  saleId: string;
  amount: number;
  method: string;
  createdAt: string;
}

export interface IAddPaymentPayload {
  saleId: string;
  amount: number;
  method: string;
}

export const addPaymentToSale = async (paymentData: IAddPaymentPayload) => {
  try {
    const { data } = await apiClient.post('/payments', paymentData);
    return data;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw new Error('Error adding payment. Please try again.');
  }
}; 