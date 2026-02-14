"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/client/cart-store";
import { useSettings } from "@/lib/settings-store";
import type { MenuItem } from "@/lib/client/api/menu-items";

export function MenuItemCard({ item }: { item: MenuItem; }) {
  const addItem = useCart((state) => state.addItem);
  const { settings, sizes: activeSizes } = useSettings();

  // Filter item sizes to only show active sizes from settings store
  const availableSizes = item.sizes.filter((itemSize) =>
    activeSizes.some((activeSize) => activeSize.id === itemSize.abbreviation)
  ).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // Use the first available active size as default, or pastries have no sizes
  const defaultSize = availableSizes.length > 0 ? availableSizes[1]?.abbreviation || availableSizes[0]?.abbreviation || "MD" : null;
  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize as "SM" | "MD" | "LG" | null);

  const sizeData = selectedSize ? availableSizes.find((s) => s.abbreviation === selectedSize) : null;
  const finalPrice = sizeData ? item.basePrice + sizeData.priceModifier : item.basePrice;

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: finalPrice,
      size: selectedSize as "SM" | "MD" | "LG",
      image: item.imagePath || "/images/placeholder.jpg",
    });
  };

  return (
    <Link href={`/menu/${item.id}`} className="hover:text-primary transition-colors">
      <div className="flex flex-col h-full group bg-card border border-border hover:border-primary transition-colors">
        {/* Image with retro styling */}
        <div className="aspect-square bg-muted relative overflow-hidden">
          {item.imagePath ? (
            <Image
              src={item.imagePath}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-border flex items-center justify-center">
                <span className="font-mono text-4xl text-muted-foreground">☕</span>
              </div>
            </div>
          )}
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none" />
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="grow flex flex-col justify-between p-4 space-y-4">
          <div className="flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-mono text-foreground text-sm tracking-wider uppercase">
                {item.name}
              </h3>
              {settings?.pricingEnabled && (
                <span className="font-mono text-primary text-lg">
                  ${finalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {item.description}
            </p>
          </div>
          {/* Size selector - only for items with active sizes */}
          <div className="space-y-4">
            {availableSizes.length > 0 && (
              <div className="flex gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size.abbreviation || size.id);
                    }}
                    className={`
                      flex-1 py-2 font-mono text-xs tracking-wider border transition-colors
                      ${selectedSize === (size.abbreviation || size.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {size.abbreviation || size.id}
                  </button>
                ))}
              </div>
            )}
            {/* Add to cart button */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono tracking-wider transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD TO ORDER
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
