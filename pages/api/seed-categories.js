import connectDB from "../../lib/db";
import { Category } from "../../models";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    // Define basic categories
    const categories = [
      {
        name: "Lawn",
        slug: "lawn",
        description: "Beautiful lawn fabric collections",
      },
      {
        name: "Embroidered",
        slug: "embroidered",
        description: "Intricate embroidered designs",
      },
      {
        name: "Cotton",
        slug: "cotton",
        description: "Pure cotton fabric collections",
      },
      {
        name: "Chiffon",
        slug: "chiffon",
        description: "Elegant chiffon collections",
      },
      {
        name: "Silk",
        slug: "silk",
        description: "Premium silk fabric collections",
      },
    ];

    // Clear existing categories first
    await Category.deleteMany({});

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);

    res.status(200).json({
      message: "Categories seeded successfully",
      categories: createdCategories,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    res.status(500).json({
      message: "Error seeding categories",
      error: error.message,
    });
  }
}
