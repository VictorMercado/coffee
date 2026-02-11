"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Beaker, Flame, Clock, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { useCart } from "@/lib/cart-store";
import { useSettings } from "@/lib/settings-store";

interface DrinkDetailProps {
  drink: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    imagePath: string | null;
    isFeatured: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    sizes: {
      id: string;
      name: string;
      abbreviation: string;
      priceModifier: number;
      isDefault: boolean;
    }[];
    ingredients: {
      id: string;
      name: string;
      description: string | null;
      allergens: string | null;
      quantity: string | null;
      isOptional: boolean;
    }[];
    tags: string[];
    recipeSteps: {
      stepNumber: number;
      instruction: string;
      duration: string | null;
      temperature: string | null;
    }[];
  };
}

export function DrinkDetail({ drink }: DrinkDetailProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const { settings, sizes: activeSizes } = useSettings();

  const availableSizes = drink.sizes.filter((itemSize) =>
    activeSizes.some((activeSize) => activeSize.id === itemSize.abbreviation)
  );

  const defaultSize =
    availableSizes.find((s) => s.isDefault)?.abbreviation ||
    availableSizes[1]?.abbreviation ||
    availableSizes[0]?.abbreviation ||
    null;

  const [selectedSize, setSelectedSize] = useState<string | null>(defaultSize);

  const sizeData = selectedSize
    ? availableSizes.find((s) => s.abbreviation === selectedSize)
    : null;
  const finalPrice = sizeData
    ? drink.basePrice + sizeData.priceModifier
    : drink.basePrice;

  const handleAddToCart = () => {
    addItem({
      id: drink.id,
      name: drink.name,
      price: finalPrice,
      size: selectedSize as "SM" | "MD" | "LG",
      image: drink.imagePath || "/images/placeholder.jpg",
    });
  };

  // Collect all unique allergens from ingredients
  const allergens = [
    ...new Set(
      drink.ingredients
        .map((i) => i.allergens)
        .filter(Boolean)
        .flatMap((a) => a!.split(",").map((s) => s.trim()))
    ),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-16 sm:pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              BACK TO MENU
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-square bg-muted relative overflow-hidden border-b md:border-b-0 md:border-r border-border">
                {drink.imagePath ? (
                  <Image
                    src={drink.imagePath}
                    alt={drink.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-border flex items-center justify-center">
                      <span className="font-mono text-6xl text-muted-foreground">
                        ☕
                      </span>
                    </div>
                  </div>
                )}
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] pointer-events-none" />

                {/* Tags */}
                {drink.tags.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {drink.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary text-primary-foreground font-mono text-[10px] tracking-wider uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {drink.isFeatured && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/90 text-black font-mono text-[10px] tracking-wider uppercase">
                      <Sparkles className="w-3 h-3" />
                      FEATURED
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                <div className="inline-block border border-border px-3 py-0.5 mb-4 self-start">
                  <span className="font-mono text-muted-foreground text-[10px] tracking-[0.3em] uppercase">
                    {drink.category.name}
                  </span>
                </div>

                <h1 className="font-mono text-foreground text-2xl sm:text-3xl lg:text-4xl tracking-widest uppercase mb-4">
                  {drink.name}
                </h1>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {drink.description}
                </p>

                {/* Price */}
                {settings?.pricingEnabled && (
                  <div className="mb-6">
                    <span className="font-mono text-primary text-3xl">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Size Selector */}
                {availableSizes.length > 0 && (
                  <div className="mb-6">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider block mb-2">
                      SELECT SIZE
                    </span>
                    <div className="flex gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() =>
                            setSelectedSize(size.abbreviation || size.id)
                          }
                          className={`
                            px-6 py-3 font-mono text-xs tracking-wider border transition-colors
                            ${selectedSize ===
                              (size.abbreviation || size.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                            }
                          `}
                        >
                          {size.name || size.abbreviation}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-widest py-6 px-8 text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ADD TO ORDER
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        {drink.ingredients.length > 0 && (
          <section className="border-b border-border py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <Beaker className="w-5 h-5 text-primary" />
                <h2 className="font-mono text-foreground text-lg tracking-widest uppercase">
                  INGREDIENTS
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {drink.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="border border-border p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-foreground text-sm tracking-wider uppercase">
                        {ingredient.name}
                      </span>
                      {ingredient.isOptional && (
                        <span className="font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5 shrink-0">
                          OPTIONAL
                        </span>
                      )}
                    </div>
                    {ingredient.quantity && (
                      <span className="font-mono text-primary text-xs">
                        {ingredient.quantity}
                      </span>
                    )}
                    {ingredient.description && (
                      <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                        {ingredient.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Allergen Warning */}
              {allergens.length > 0 && (
                <div className="mt-6 flex items-start gap-3 border border-yellow-500/30 bg-yellow-500/5 p-4">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-xs text-yellow-500 tracking-wider">
                      ALLERGENS
                    </span>
                    <p className="text-muted-foreground text-xs mt-1">
                      Contains: {allergens.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recipe Steps Section */}
        {drink.recipeSteps.length > 0 && (
          <section className="border-b border-border py-12 sm:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-8">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="font-mono text-foreground text-lg tracking-widest uppercase">
                  PREPARATION
                </h2>
              </div>

              <div className="space-y-0">
                {drink.recipeSteps.map((step, idx) => (
                  <div
                    key={step.stepNumber}
                    className="flex gap-6 relative"
                  >
                    {/* Step line */}
                    {idx < drink.recipeSteps.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
                    )}

                    {/* Step number */}
                    <div className="w-10 h-10 border border-primary flex items-center justify-center shrink-0 bg-background relative z-10">
                      <span className="font-mono text-primary text-sm">
                        {String(step.stepNumber).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Step content */}
                    <div className="pb-8 flex-1">
                      <p className="text-foreground text-sm leading-relaxed">
                        {step.instruction}
                      </p>
                      <div className="flex gap-4 mt-2">
                        {step.duration && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground tracking-wider">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </span>
                        )}
                        {step.temperature && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground tracking-wider">
                            <Flame className="w-3 h-3" />
                            {step.temperature}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href="/menu"
              className="inline-block border border-border px-8 py-3 font-mono text-xs tracking-widest text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              ← EXPLORE MORE DRINKS
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
