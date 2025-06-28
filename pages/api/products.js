import connectDB from "../../lib/db";
import { Product, Category } from "../../models";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const {
          category,
          featured,
          search,
          page = 1,
          limit = 12,
          sort = "createdAt",
          order = "desc",
        } = req.query;

        // Build query
        let query = {};

        if (category) {
          // Find category by slug
          const categoryDoc = await Category.findOne({ slug: category });
          if (categoryDoc) {
            query.category = categoryDoc._id;
          }
        }

        if (featured === "true") {
          query.featured = true;
        }

        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort options
        const sortObj = {};
        sortObj[sort] = order === "desc" ? -1 : 1;

        // Get products with pagination
        const products = await Product.find(query)
          .populate("category", "name slug")
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .lean();

        // Get total count for pagination
        const total = await Product.countDocuments(query);

        res.status(200).json({
          products,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total,
            hasNext: skip + products.length < total,
            hasPrev: parseInt(page) > 1,
          },
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
      }
      break;

    case "POST":
      try {
        const {
          name,
          slug,
          description,
          price,
          category,
          image,
          images,
          inventory,
          featured,
        } = req.body;

        // Validation
        if (!name || !description || !price || !category || !image) {
          return res.status(400).json({ message: "All fields are required" });
        }

        // Check if category exists
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
          return res.status(400).json({ message: "Invalid category" });
        }

        // Generate slug if not provided
        const productSlug =
          slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        // Check if slug already exists
        const existingProduct = await Product.findOne({ slug: productSlug });
        if (existingProduct) {
          return res
            .status(400)
            .json({ message: "Product with this slug already exists" });
        }

        const product = await Product.create({
          name,
          slug: productSlug,
          description,
          price: parseFloat(price),
          category,
          image,
          images: images || [],
          inventory: parseInt(inventory) || 0,
          inStock: parseInt(inventory) > 0,
          featured: featured || false,
        });

        await product.populate("category", "name slug");

        res.status(201).json({
          message: "Product created successfully",
          product,
        });
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
