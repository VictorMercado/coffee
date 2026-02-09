import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Settings {
  pricingEnabled: boolean;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxRate: number;
  prepTime: number;
}

export interface Size {
  id: string;
  name: string;
  priceModifier: number;
}

interface SettingsStore {
  settings: Settings;
  sizes: Size[];
  isHydrated: boolean;
  setSettings: (settings: Settings) => void;
  setSizes: (sizes: Size[]) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const defaultSettings: Settings = {
  pricingEnabled: true,
  storeName: "Orbit Coffee",
  storeAddress: "123 Space Station Blvd\nLunar Colony, Moon 90210",
  storePhone: "(555) 123-4567",
  taxRate: 8.0,
  prepTime: 15,
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      sizes: [],
      isHydrated: false,
      setSettings: (settings) => set({ settings }),
      setSizes: (sizes) => set({ sizes }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "orbit-settings",
    }
  )
);
