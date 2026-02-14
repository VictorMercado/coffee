import type { Settings } from "@/lib/types/settings";

export type SettingsDTO = Omit<Settings, "updatedAt">;
