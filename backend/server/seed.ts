import { db } from "./db";
import * as schema from "@shared/schema";

export async function seed() {
  console.log("Seeding database...");

  // Check if categories exist
  const existingCategories = await db.select().from(schema.categories);
  if (existingCategories.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  // Seed categories
  const insertedCategories = await db.insert(schema.categories).values([
    {
      name: "Salas",
      slug: "salas",
      description: "Muebles para tu sala de estar",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Comedores",
      slug: "comedores",
      description: "Mesas y sillas para tu comedor",
      imageUrl: "https://images.unsplash.com/photo-1577145745729-0974630990f1?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Recámaras",
      slug: "recamaras",
      description: "Camas y burós para tu descanso",
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
    },
  ]).returning();

  const salasId = insertedCategories.find(c => c.slug === "salas")?.id;
  const comedoresId = insertedCategories.find(c => c.slug === "comedores")?.id;
  const recamarasId = insertedCategories.find(c => c.slug === "recamaras")?.id;

  // Seed products
  await db.insert(schema.products).values([
    {
      name: "Sofá Moderno Gris",
      description: "Un sofá elegante y de precisión CNC para tu sala.",
      price: "12500.00",
      categoryId: salasId,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
      featured: true,
      inStock: true,
      stockQuantity: 10,
    },
    {
      name: "Mesa de Comedor de Roble",
      description: "Mesa robusta para 6 personas.",
      price: "8900.00",
      categoryId: comedoresId,
      imageUrl: "https://images.unsplash.com/photo-1577145745729-0974630990f1?auto=format&fit=crop&q=80&w=800",
      featured: true,
      inStock: true,
      stockQuantity: 5,
    },
    {
      name: "Cama King Size",
      description: "Máximo confort para tu recámara.",
      price: "15000.00",
      categoryId: recamarasId,
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
      featured: true,
      inStock: true,
      stockQuantity: 3,
    },
  ]);

  console.log("Seeding completed.");
}

if (require.main === module) {
  seed().catch(console.error);
}
