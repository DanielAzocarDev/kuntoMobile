import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { AuthState, createAuthSlice } from "./slices/auth.slice";

// Adaptador personalizado para expo-secure-store
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error('Error getting item from secure store:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error setting item in secure store:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing item from secure store:', error);
    }
  },
};

export const useAppStore = create<AuthState>()(
  persist(
    (set, get, api) => ({
      ...createAuthSlice(set, get, api),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);