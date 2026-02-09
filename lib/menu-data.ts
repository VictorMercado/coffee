export interface MenuItem {
  id: string
  name: string
  description: string
  basePrice: number
  category: "signature" | "classic" | "cold" | "pastry"
  image: string
  tags?: string[]
}

export const menuItems: MenuItem[] = [
  // Signature Brews
  {
    id: "nebula-latte",
    name: "Nebula Latte",
    description: "Espresso swirled with lavender oat milk and stardust vanilla",
    basePrice: 6.5,
    category: "signature",
    image: "/images/nebula-latte.jpg",
    tags: ["popular", "oat milk"],
  },
  {
    id: "atomic-americano",
    name: "Atomic Americano",
    description: "Double shot espresso with filtered ionized water",
    basePrice: 4.5,
    category: "signature",
    image: "/images/atomic-americano.jpg",
    tags: ["strong"],
  },
  {
    id: "cosmic-cappuccino",
    name: "Cosmic Cappuccino",
    description: "Perfectly balanced foam with cinnamon galaxy dust",
    basePrice: 5.75,
    category: "signature",
    image: "/images/cosmic-cappuccino.jpg",
    tags: ["popular"],
  },
  {
    id: "saturn-ring-mocha",
    name: "Saturn Ring Mocha",
    description: "Rich chocolate orbiting around premium espresso",
    basePrice: 6.25,
    category: "signature",
    image: "/images/saturn-mocha.jpg",
    tags: ["sweet"],
  },
  // Classic Brews
  {
    id: "drip-coffee",
    name: "Orbit Drip",
    description: "Single origin Ethiopian beans, slow dripped to perfection",
    basePrice: 3.5,
    category: "classic",
    image: "/images/drip-coffee.jpg",
  },
  {
    id: "espresso-shot",
    name: "Espresso Shot",
    description: "Pure rocket fuel for your morning launch",
    basePrice: 3.0,
    category: "classic",
    image: "/images/espresso.jpg",
    tags: ["strong"],
  },
  {
    id: "classic-latte",
    name: "Classic Latte",
    description: "Timeless espresso and steamed milk combination",
    basePrice: 5.0,
    category: "classic",
    image: "/images/classic-latte.jpg",
  },
  // Cold Brews
  {
    id: "cryo-cold-brew",
    name: "Cryo Cold Brew",
    description: "24-hour steeped cold brew, nitrogen infused",
    basePrice: 5.5,
    category: "cold",
    image: "/images/cold-brew.jpg",
    tags: ["popular", "refreshing"],
  },
  {
    id: "iced-rocket-fuel",
    name: "Iced Rocket Fuel",
    description: "Triple shot over ice with a splash of cream",
    basePrice: 5.75,
    category: "cold",
    image: "/images/iced-rocket.jpg",
    tags: ["strong"],
  },
  {
    id: "frozen-orbit",
    name: "Frozen Orbit",
    description: "Blended coffee with vanilla and caramel swirl",
    basePrice: 6.0,
    category: "cold",
    image: "/images/frozen-orbit.jpg",
    tags: ["sweet"],
  },
  // Pastries
  {
    id: "meteor-muffin",
    name: "Meteor Muffin",
    description: "Blueberry muffin with crystallized sugar crater",
    basePrice: 4.0,
    category: "pastry",
    image: "/images/meteor-muffin.jpg",
  },
  {
    id: "space-croissant",
    name: "Space Croissant",
    description: "Flaky buttery layers folded 27 times",
    basePrice: 4.5,
    category: "pastry",
    image: "/images/croissant.jpg",
    tags: ["popular"],
  },
  {
    id: "galaxy-donut",
    name: "Galaxy Donut",
    description: "Glazed ring with cosmic sprinkles",
    basePrice: 3.75,
    category: "pastry",
    image: "/images/galaxy-donut.jpg",
    tags: ["sweet"],
  },
]

export const categories = [
  { id: "signature", name: "SIGNATURE", icon: "★" },
  { id: "classic", name: "CLASSIC", icon: "◉" },
  { id: "cold", name: "COLD", icon: "❄" },
  { id: "pastry", name: "PASTRY", icon: "◎" },
] as const

export const sizes = [
  { id: "SM", name: "SMALL", priceModifier: 0 },
  { id: "MD", name: "MEDIUM", priceModifier: 0.75 },
  { id: "LG", name: "LARGE", priceModifier: 1.5 },
] as const
