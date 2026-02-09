"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSettings as useSettingsStore } from "@/lib/settings-store";
import { fetchSettings, updateSettings } from "@/lib/client/api";
import type { Settings } from "@/lib/settings-store";
import { Store, DollarSign, Clock, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSettings: setGlobalSettings } = useSettingsStore();

  const { data: fetchedSettings, isLoading: loading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [settings, setSettings] = useState<Settings>({
    pricingEnabled: true,
    storeName: "Orbit Coffee",
    storeAddress: "123 Space Station Blvd\nLunar Colony, Moon 90210",
    storePhone: "(555) 123-4567",
    taxRate: 8.0,
    prepTime: 15,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setGlobalSettings(data);
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to save settings");
    },
  });

  const handleSave = () => {
    setError("");
    setSuccess(false);
    mutation.mutate(settings);
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="SETTINGS" description="Configure application settings" />
        <div className="p-8 flex items-center justify-center">
          <div className="font-mono text-muted-foreground">LOADING SETTINGS...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="SETTINGS"
        description="Configure application settings"
      />
      <div className="p-8 space-y-6">
        {/* Pricing Settings */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="font-mono text-lg text-primary">PRICING</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <Label htmlFor="pricingEnabled" className="font-mono text-sm text-primary cursor-pointer">
                  ENABLE PRICING
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Toggle pricing throughout the app. When disabled, all items are free (perfect for household use)
                </p>
              </div>
              <Switch
                id="pricingEnabled"
                checked={settings.pricingEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pricingEnabled: checked })
                }
              />
            </div>

            {settings.pricingEnabled && (
              <div>
                <Label htmlFor="taxRate" className="font-mono text-xs text-muted-foreground">
                  TAX RATE (%)
                </Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })
                  }
                  step="0.1"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Tax rate applied to all orders
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Store Information */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Store className="w-5 h-5 text-primary" />
            <h2 className="font-mono text-lg text-primary">STORE INFORMATION</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName" className="font-mono text-xs text-muted-foreground">
                STORE NAME
              </Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="storeAddress" className="font-mono text-xs text-muted-foreground">
                ADDRESS
              </Label>
              <Textarea
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) =>
                  setSettings({ ...settings, storeAddress: e.target.value })
                }
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="storePhone" className="font-mono text-xs text-muted-foreground">
                PHONE
              </Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) =>
                  setSettings({ ...settings, storePhone: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-mono text-lg text-primary">ORDER SETTINGS</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="prepTime" className="font-mono text-xs text-muted-foreground">
                AVERAGE PREP TIME (MINUTES)
              </Label>
              <Input
                id="prepTime"
                type="number"
                value={settings.prepTime}
                onChange={(e) =>
                  setSettings({ ...settings, prepTime: parseInt(e.target.value) || 0 })
                }
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Shown to customers on order confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="border border-green-500 bg-green-900/20 p-4">
            <p className="font-mono text-sm text-green-400">Settings saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="border border-red-500 bg-red-900/20 p-4">
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="bg-primary font-mono text-background hover:bg-primary/80"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                SAVING...
              </>
            ) : (
              "SAVE SETTINGS"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
