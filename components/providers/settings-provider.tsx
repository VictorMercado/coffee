"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/lib/settings-store";
import { fetchSettings, fetchSizes } from "@/lib/client/api";

export function SettingsProvider({ children }: { children: React.ReactNode; }) {
  const { setSettings, setSizes, setHydrated, isHydrated } = useSettings();

  // Fetch settings
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: Infinity, // Settings rarely change
  });

  // Fetch sizes
  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: fetchSizes,
    staleTime: Infinity, // Sizes rarely change
  });

  // Sync fetched data to Zustand store
  useEffect(() => {
    if (settingsData && sizesData && !isHydrated) {
      setSettings({
        pricingEnabled: settingsData.pricingEnabled,
        storeName: settingsData.storeName,
        storeAddress: settingsData.storeAddress,
        storePhone: settingsData.storePhone,
        taxRate: settingsData.taxRate,
        prepTime: settingsData.prepTime,
      });
      setSizes(sizesData);
      setHydrated(true);
    }
  }, [settingsData, sizesData, isHydrated, setSettings, setSizes, setHydrated]);

  return <>{children}</>;
}
