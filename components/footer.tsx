import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
            <Image
              src="/icon.svg"
              alt="Orbit Coffee"
              width={46}
              height={46}
            />
              <div>
                <h3 className="font-mono text-primary text-lg tracking-[0.2em]">ORBIT</h3>
                <p className="text-[10px] text-muted-foreground tracking-[0.3em]">COFFEE CO.</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Brewing the future, one cup at a time. Premium coffee with atomic precision since 2087.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-foreground text-sm tracking-[0.15em] mb-4">HOURS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Mon - Fri</span>
                <span className="font-mono text-foreground">06:00 - 22:00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Sat - Sun</span>
                <span className="font-mono text-foreground">07:00 - 23:00</span>
              </div>
            </div>
            <div className="mt-6 p-3 border border-accent bg-accent/10">
              <p className="font-mono text-accent text-xs tracking-wider">NOW OPEN</p>
              <p className="text-muted-foreground text-xs mt-1">Victor's Station</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © 2087 ORBIT COFFEE CO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground text-xs hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
