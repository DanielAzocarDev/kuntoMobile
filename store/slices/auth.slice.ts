import { Data } from "@/interfaces/auth.interfaces";
import { StateCreator } from "zustand";



export interface AuthState extends Data {
  login: (payload: Data) => void;
  logout: () => void;
  updateUser: (country: string, currency: string, currencySymbol: string) => void;
}

const initialState: Data = {
  token: '',
  user: {
    id: '',
    email: '',
    name: '',
    country: '',
    currency: '',
    currencySymbol: '',
    role: 'USER',
  },
}
export const createAuthSlice: StateCreator<AuthState> = (set) => ({
  ...initialState,
  login: (payload: Data) => set({ ...payload }),
  logout: () => {
    set(initialState);
  },
  updateUser: (country, currency, currencySymbol) =>
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        country,
        currency,
        currencySymbol,
      },
    })),
});