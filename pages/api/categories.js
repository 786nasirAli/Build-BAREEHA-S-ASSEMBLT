import connectDB from "../../lib/db";
import { Category } from "../../models";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const categories = await Category.find({})
          .sort({ createdAt: -1 })
          .lean();

        res.status(200).json({ categories });
      } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
      }
      break;

    case "POST":
      try {
        const { name, slug, description, image } = req.body;

        // Validation
        if (!name) {
          return res.status(400).json({ message: "Category name is required" });
        }

        // Generate slug if not provided
        const categorySlug =
          slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Check if slug already exists
        const existingCategory = await Category.findOne({
          slug: categorySlug,
        });
        if (existingCategory) {
          return res
            .status(400)
            .json({ message: "Category with this slug already exists" });
        }

        const category = await Category.create({
          name,
          slug: categorySlug,
          description: description || "",
          image: image || "",
        });

        res.status(201).json({
          message: "Category created successfully",
          category,
        });
      } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Error creating category" });
      }
      break;

    case "PUT":
      try {
        const { id, name, slug, description, image } = req.body;

        if (!id || !name) {
          return res
            .status(400)
            .json({ message: "Category ID and name are required" });
        }

        // Generate slug if not provided
        const categorySlug =
          slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Check if slug already exists (excluding current category)
        const existingCategory = await Category.findOne({
          slug: categorySlug,
          _id: { $ne: id },
        });
        if (existingCategory) {
          return res
            .status(400)
            .json({ message: "Category with this slug already exists" });
        }

        const category = await Category.findByIdAndUpdate(
          id,
          {
            name,
            slug: categorySlug,
            description: description || "",
            image: image || "",
          },
          { new: true, runValidators: true },
        );

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
          message: "Category updated successfully",
          category,
        });
      } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Error updating category" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: "Category ID is required" });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
          message: "Category deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Error deleting category" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
