import { type StateCreator } from 'zustand';
import type { ICartItem } from '../../interfaces/sales.interfaces';
import type { IProduct } from '../../interfaces/product.interfaces';

export interface ICartState {
  cart: ICartItem[];
  selectedClient: string | null;
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedClient: (clientId: string | null) => void;
}

export const createCartSlice: StateCreator<
  ICartState,
  [], // No middleware meta
  [], // No devtools meta
  ICartState
> = (set, get) => ({
  cart: [],
  selectedClient: null,
  addToCart: (product, quantity) => {
    const { cart } = get();
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      const updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { 
              ...item, 
              quantity: Math.min(item.quantity + quantity, item.availableStock) // No superar el stock disponible
            }
          : item
      );
      set({ cart: updatedCart });
    } else {
      // Si el producto no está, añádelo como nuevo ICartItem
      const cartItem: ICartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.min(quantity, product.quantity), // No superar el stock disponible
        image_url: product.image_url, // Asegúrate que IProduct tenga image_url
        availableStock: product.quantity, // Agregar el stock disponible
      };
      set({ cart: [...cart, cartItem] });
    }
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }));
  },
  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      // Si la cantidad es 0 o menos, eliminar el producto
      get().removeFromCart(productId);
    } else {
      set((state) => ({
        cart: state.cart.map((item) =>
          item.productId === productId 
            ? { 
                ...item, 
                quantity: Math.min(quantity, item.availableStock) // No superar el stock disponible
              } 
            : item
        ),
      }));
    }
  },
  clearCart: () => {
    set({ cart: [] });
  },
  setSelectedClient: (clientId) => {
    set({ selectedClient: clientId });
  },
}); 