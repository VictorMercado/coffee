-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pricingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "storeName" TEXT NOT NULL DEFAULT 'Orbit Coffee',
    "storeAddress" TEXT NOT NULL DEFAULT '123 Space Station Blvd
Lunar Colony, Moon 90210',
    "storePhone" TEXT NOT NULL DEFAULT '(555) 123-4567',
    "taxRate" REAL NOT NULL DEFAULT 8.0,
    "prepTime" INTEGER NOT NULL DEFAULT 15,
    "updatedAt" DATETIME NOT NULL
);
