import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create or update admin user
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@orbitcoffee.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user created: ${admin.email}`);

  // Create or update guest user
  console.log("Creating guest user...");
  const guestPassword = await bcrypt.hash("guest123", 10);
  const guest = await prisma.user.upsert({
    where: { username: "guest" },
    update: {},
    create: {
      username: "guest",
      email: "guest@orbitcoffee.com",
      password: guestPassword,
      role: "USER",
    },
  });
  console.log(`✓ Guest user created: ${guest.email}`);

  // Create categories
  console.log("\nCreating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "SIGNATURE",
        slug: "signature",
        icon: "★",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "CLASSIC",
        slug: "classic",
        icon: "◉",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "COLD",
        slug: "cold",
        icon: "❄",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "PASTRY",
        slug: "pastry",
        icon: "◎",
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`✓ Created ${categories.length} categories`);

  // Create sizes
  console.log("\nCreating sizes...");
  const sizes = await Promise.all([
    prisma.size.create({
      data: {
        name: "SMALL",
        abbreviation: "SM",
        priceModifier: 0,
        sortOrder: 1,
      },
    }),
    prisma.size.create({
      data: {
        name: "MEDIUM",
        abbreviation: "MD",
        priceModifier: 0.75,
        sortOrder: 2,
      },
    }),
    prisma.size.create({
      data: {
        name: "LARGE",
        abbreviation: "LG",
        priceModifier: 1.5,
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`✓ Created ${sizes.length} sizes`);

  // Create tags
  console.log("\nCreating tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "popular", slug: "popular" } }),
    prisma.tag.create({ data: { name: "oat milk", slug: "oat-milk" } }),
    prisma.tag.create({ data: { name: "strong", slug: "strong" } }),
    prisma.tag.create({ data: { name: "sweet", slug: "sweet" } }),
    prisma.tag.create({ data: { name: "refreshing", slug: "refreshing" } }),
  ]);
  console.log(`✓ Created ${tags.length} tags`);

  // Create sample ingredients
  console.log("\nCreating sample ingredients...");
  const ingredients = await Promise.all([
    prisma.ingredient.create({
      data: {
        name: "Espresso",
        description: "Premium arabica espresso shot",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Oat Milk",
        description: "Creamy oat milk",
        allergens: "Oats",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Whole Milk",
        description: "Fresh whole milk",
        allergens: "Dairy",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Vanilla Syrup",
        description: "House-made vanilla syrup",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Lavender Syrup",
        description: "House-made lavender syrup",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Chocolate Sauce",
        description: "Rich dark chocolate sauce",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Cinnamon",
        description: "Ground cinnamon",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Ethiopian Coffee Beans",
        description: "Single origin Ethiopian coffee",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Nitrogen",
        description: "Nitrogen gas for infusion",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Ice",
        description: "Filtered ice",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Cream",
        description: "Heavy cream",
        allergens: "Dairy",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Caramel Sauce",
        description: "Sweet caramel sauce",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Blueberries",
        description: "Fresh blueberries",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Butter",
        description: "European-style butter",
        allergens: "Dairy",
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Flour",
        description: "All-purpose flour",
        allergens: "Gluten",
      },
    }),
  ]);
  console.log(`✓ Created ${ingredients.length} ingredients`);

  // Get category IDs
  const signatureCategory = categories.find((c) => c.slug === "signature")!;
  const classicCategory = categories.find((c) => c.slug === "classic")!;
  const coldCategory = categories.find((c) => c.slug === "cold")!;
  const pastryCategory = categories.find((c) => c.slug === "pastry")!;

  // Get tag IDs
  const popularTag = tags.find((t) => t.slug === "popular")!;
  const oatMilkTag = tags.find((t) => t.slug === "oat-milk")!;
  const strongTag = tags.find((t) => t.slug === "strong")!;
  const sweetTag = tags.find((t) => t.slug === "sweet")!;
  const refreshingTag = tags.find((t) => t.slug === "refreshing")!;

  // Create menu items
  console.log("\nCreating menu items...");

  // SIGNATURE BREWS
  const nebulaLatte = await prisma.menuItem.create({
    data: {
      name: "Nebula Latte",
      description: "Espresso swirled with lavender oat milk and stardust vanilla",
      basePrice: 6.5,
      categoryId: signatureCategory.id,
      imagePath: "/images/nebula-latte.jpg",
      isFeatured: true,
      sortOrder: 1,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: nebulaLatte.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.createMany({
    data: [
      { menuItemId: nebulaLatte.id, tagId: popularTag.id },
      { menuItemId: nebulaLatte.id, tagId: oatMilkTag.id },
    ],
  });

  const atomicAmericano = await prisma.menuItem.create({
    data: {
      name: "Atomic Americano",
      description: "Double shot espresso with filtered ionized water",
      basePrice: 4.5,
      categoryId: signatureCategory.id,
      imagePath: "/images/atomic-americano.jpg",
      sortOrder: 2,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: atomicAmericano.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: atomicAmericano.id, tagId: strongTag.id },
  });

  const cosmicCappuccino = await prisma.menuItem.create({
    data: {
      name: "Cosmic Cappuccino",
      description: "Perfectly balanced foam with cinnamon galaxy dust",
      basePrice: 5.75,
      categoryId: signatureCategory.id,
      imagePath: "/images/cosmic-cappuccino.jpg",
      isFeatured: true,
      sortOrder: 3,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: cosmicCappuccino.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: cosmicCappuccino.id, tagId: popularTag.id },
  });

  const saturnMocha = await prisma.menuItem.create({
    data: {
      name: "Saturn Ring Mocha",
      description: "Rich chocolate orbiting around premium espresso",
      basePrice: 6.25,
      categoryId: signatureCategory.id,
      imagePath: "/images/saturn-mocha.jpg",
      sortOrder: 4,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: saturnMocha.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: saturnMocha.id, tagId: sweetTag.id },
  });

  // CLASSIC BREWS
  const dripCoffee = await prisma.menuItem.create({
    data: {
      name: "Orbit Drip",
      description: "Single origin Ethiopian beans, slow dripped to perfection",
      basePrice: 3.5,
      categoryId: classicCategory.id,
      imagePath: "/images/drip-coffee.jpg",
      sortOrder: 5,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: dripCoffee.id,
      sizeId: size.id,
    })),
  });

  const espressoShot = await prisma.menuItem.create({
    data: {
      name: "Espresso Shot",
      description: "Pure rocket fuel for your morning launch",
      basePrice: 3.0,
      categoryId: classicCategory.id,
      imagePath: "/images/espresso.jpg",
      sortOrder: 6,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: espressoShot.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: espressoShot.id, tagId: strongTag.id },
  });

  const classicLatte = await prisma.menuItem.create({
    data: {
      name: "Classic Latte",
      description: "Timeless espresso and steamed milk combination",
      basePrice: 5.0,
      categoryId: classicCategory.id,
      imagePath: "/images/classic-latte.jpg",
      sortOrder: 7,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: classicLatte.id,
      sizeId: size.id,
    })),
  });

  // COLD BREWS
  const cryoColdBrew = await prisma.menuItem.create({
    data: {
      name: "Cryo Cold Brew",
      description: "24-hour steeped cold brew, nitrogen infused",
      basePrice: 5.5,
      categoryId: coldCategory.id,
      imagePath: "/images/cold-brew.jpg",
      isFeatured: true,
      sortOrder: 8,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: cryoColdBrew.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.createMany({
    data: [
      { menuItemId: cryoColdBrew.id, tagId: popularTag.id },
      { menuItemId: cryoColdBrew.id, tagId: refreshingTag.id },
    ],
  });

  const icedRocketFuel = await prisma.menuItem.create({
    data: {
      name: "Iced Rocket Fuel",
      description: "Triple shot over ice with a splash of cream",
      basePrice: 5.75,
      categoryId: coldCategory.id,
      imagePath: "/images/iced-rocket.jpg",
      sortOrder: 9,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: icedRocketFuel.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: icedRocketFuel.id, tagId: strongTag.id },
  });

  const frozenOrbit = await prisma.menuItem.create({
    data: {
      name: "Frozen Orbit",
      description: "Blended coffee with vanilla and caramel swirl",
      basePrice: 6.0,
      categoryId: coldCategory.id,
      imagePath: "/images/frozen-orbit.jpg",
      sortOrder: 10,
    },
  });
  await prisma.menuItemSize.createMany({
    data: sizes.map((size) => ({
      menuItemId: frozenOrbit.id,
      sizeId: size.id,
    })),
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: frozenOrbit.id, tagId: sweetTag.id },
  });

  // PASTRIES
  const meteorMuffin = await prisma.menuItem.create({
    data: {
      name: "Meteor Muffin",
      description: "Blueberry muffin with crystallized sugar crater",
      basePrice: 4.0,
      categoryId: pastryCategory.id,
      imagePath: "/images/meteor-muffin.jpg",
      sortOrder: 11,
    },
  });
  // Pastries don't have sizes

  const spaceCroissant = await prisma.menuItem.create({
    data: {
      name: "Space Croissant",
      description: "Flaky buttery layers folded 27 times",
      basePrice: 4.5,
      categoryId: pastryCategory.id,
      imagePath: "/images/croissant.jpg",
      isFeatured: true,
      sortOrder: 12,
    },
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: spaceCroissant.id, tagId: popularTag.id },
  });

  const galaxyDonut = await prisma.menuItem.create({
    data: {
      name: "Galaxy Donut",
      description: "Glazed ring with cosmic sprinkles",
      basePrice: 3.75,
      categoryId: pastryCategory.id,
      imagePath: "/images/galaxy-donut.jpg",
      sortOrder: 13,
    },
  });
  await prisma.menuItemTag.create({
    data: { menuItemId: galaxyDonut.id, tagId: sweetTag.id },
  });

  console.log(`✓ Created 13 menu items`);

  console.log("\n✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
