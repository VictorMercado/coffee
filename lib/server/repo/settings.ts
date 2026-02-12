import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  pricingEnabled: true,
  storeName: "Orbit Coffee",
  storeAddress: "123 Space Station Blvd\nLunar Colony, Moon 90210",
  storePhone: "(555) 123-4567",
  taxRate: 8.0,
  prepTime: 15,
};

export async function getOrCreateSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({ data: DEFAULT_SETTINGS });
  }

  return settings;
}

export async function updateSettings(data: {
  pricingEnabled: boolean;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxRate: number;
  prepTime: number;
}) {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    return prisma.settings.create({ data });
  }

  return prisma.settings.update({
    where: { id: settings.id },
    data,
  });
}
