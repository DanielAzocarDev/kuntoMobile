import { Data, User } from "@/interfaces/auth.interfaces";
import { StateCreator } from "zustand";

export type CurrencyMode = "USD" | "VES";

export interface AuthState extends Data {
  currencyMode: CurrencyMode;
  dollarRate: number | null;
  login: (payload: Data) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setCurrencyMode: (mode: CurrencyMode) => void;
  setDollarRate: (rate: number) => void;
}

const initialState: Omit<AuthState, 'login' | 'logout' | 'updateUser' | 'setCurrencyMode' | 'setDollarRate'> = {
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
  currencyMode: "USD",
  dollarRate: null,
}
export const createAuthSlice: StateCreator<AuthState> = (set) => ({
  ...initialState,
  login: (payload: Data) => set({ ...payload }),
  logout: () => {
    set(initialState);
  },
  updateUser: (user) =>
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        ...user,
      },
    })),
    setCurrencyMode: (mode) => set({ currencyMode: mode }),
    setDollarRate: (rate) => set({ dollarRate: rate }),
});