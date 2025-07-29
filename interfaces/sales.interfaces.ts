export interface ISaleItem {
  productId: string;
  quantity: number;
  price: number; // Precio del producto al momento de la venta
  product?: { name: string };
}

export interface ISale {
  id?: string; // ID es string y no opcional
  items: ISaleItem[];
  status: "PAID" | "PENDING"; // Estado de la venta
  clientId?: string; // Opcional, para asociar la venta a un cliente
  client?: { name: string }; // Añadido para el nombre del cliente
  saleDate?: string; // Fecha de la venta, puede ser generada en backend o frontend
  createdAt?: string; // Añadido para la fecha de creación/venta
  total?: number; // Añadido para el total de la venta
  paymentMethod?: 'CARD' | 'CASH' | 'TRANSFER' | 'OTHER'; // Método de pago
  initialPaymentAmount?: number; // Monto del pago inicial, opcional
}

export interface ISaleResponse {
  data: {
    data: ISale[];
    totalItems: number;
    totalPages: number;
    totalSale: number;
    currentPage: number;
    pageSize: number;
  };
  success: boolean;
}

// Interfaz para un artículo dentro del estado del carrito en el frontend
export interface ICartItem {
  productId: string;
  name: string;
  price: number; // Precio actual del producto desde IProduct
  quantity: number;
  image_url?: string;
  availableStock: number; // Cantidad disponible en inventario
}

export interface CreateSalePayload {
  clientId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: string;
}

export interface ApiErrorResponse {
  message: string;
} 