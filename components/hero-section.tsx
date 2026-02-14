import Link from "next/link";
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center border-b border-border overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute bg-card top-10 left-10 w-32 h-32 border border-primary hidden lg:block">
        <div className="absolute inset-4 border border-primary" />
        <div className="absolute inset-8 border border-primary/50" />
        <div className="scanline" />
      </div>
      <div className="absolute bg-card bottom-10 right-10 w-24 h-24 border border-primary hidden lg:block">
        <div className="absolute inset-4 border border-primary rotate-45" />
        <div className="absolute inset-8 border border-primary/50 rotate-45" />
        <div className="scanline" />
      </div>

      {/* Content */}
      <div className="relative text-center px-4 py-16 sm:py-24">
        <div className="inline-block border border-primary px-4 py-1 mb-6">
          <span className="font-mono text-primary text-xs tracking-[0.3em]">EST. 2087</span>
        </div>

        <h1 className="font-mono text-foreground text-4xl sm:text-6xl lg:text-8xl tracking-widest mb-4">
          <span className="text-primary">ORBIT</span> COFFEE
        </h1>

        <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          Premium brews crafted with atomic precision. Experience coffee from the future, today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-mono tracking-[0.15em] text-sm hover:bg-primary/90 transition-colors"
          >
            VIEW MENU
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border border-border rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary" />
        </div>
      </div>
    </section>
  )
}
