import connectDB from "../../lib/db";
import { Order, Product } from "../../models";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "../../lib/emailService";

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `BA${timestamp}${random}`;
};

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const { page = 1, limit = 10, status, userId } = req.query;

        // Build query
        let query = {};
        if (status) query.status = status;
        if (userId) query.user = userId;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get orders with pagination
        const orders = await Order.find(query)
          .populate("items.product", "name image price")
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean();

        // Get total count for pagination
        const total = await Order.countDocuments(query);

        res.status(200).json({
          orders,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total,
            hasNext: skip + orders.length < total,
            hasPrev: parseInt(page) > 1,
          },
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders" });
      }
      break;

    case "POST":
      try {
        const {
          items,
          customerInfo,
          paymentMethod = "cod",
          notes,
          userId,
        } = req.body;

        // Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ message: "Order items are required" });
        }

        if (
          !customerInfo ||
          !customerInfo.name ||
          !customerInfo.email ||
          !customerInfo.phone ||
          !customerInfo.address ||
          !customerInfo.city
        ) {
          return res
            .status(400)
            .json({ message: "Complete customer information is required" });
        }

        // Validate and calculate order total
        let calculatedTotal = 0;
        const validatedItems = [];

        for (const item of items) {
          let product = null;

          // Try to find product in MongoDB first (for admin-created products)
          try {
            if (
              typeof item.productId === "string" &&
              item.productId.length === 24
            ) {
              product = await Product.findById(item.productId);
            }
          } catch (error) {
            // Not a valid ObjectId, continue to JSON fallback
          }

          // If not found in MongoDB, check JSON products file (for demo products)
          if (!product) {
            const fs = require("fs");
            const path = require("path");
            const productsPath = path.join(
              process.cwd(),
              "data",
              "products.json",
            );

            try {
              const productsData = fs.readFileSync(productsPath, "utf8");
              const products = JSON.parse(productsData);
              product = products.find((p) => p.id == item.productId);

              // Convert JSON product to match expected format
              if (product) {
                product = {
                  _id: product.id,
                  name: product.name,
                  price: product.price,
                  inStock: product.inStock,
                  inventory: product.inventory || 999, // Default high inventory for JSON products
                };
              }
            } catch (error) {
              console.error("Error reading products.json:", error);
            }
          }

          if (!product) {
            return res
              .status(400)
              .json({ message: `Product not found: ${item.productId}` });
          }

          if (!product.inStock) {
            return res.status(400).json({
              message: `Product out of stock: ${product.name}`,
            });
          }

          const itemTotal = product.price * item.quantity;
          calculatedTotal += itemTotal;

          validatedItems.push({
            product: product._id,
            name: product.name, // Store name for easier access
            quantity: item.quantity,
            price: product.price,
          });

          // Only update inventory for MongoDB products (not JSON products)
          if (typeof product._id === "string" && product._id.length === 24) {
            try {
              await Product.findByIdAndUpdate(product._id, {
                $inc: { inventory: -item.quantity },
                inStock: product.inventory - item.quantity > 0,
              });
            } catch (error) {
              console.warn(
                "Could not update inventory for product:",
                product._id,
              );
            }
          }
        }

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Create order
        const order = await Order.create({
          orderNumber,
          user: userId || null,
          customerInfo,
          items: validatedItems,
          total: calculatedTotal,
          paymentMethod,
          notes: notes || "",
          status: "pending",
        });

        // Populate the order for email
        await order.populate("items.product", "name image");

        // Send confirmation email to customer
        try {
          await sendOrderConfirmationEmail(order, customerInfo);
        } catch (emailError) {
          console.error("Error sending customer email:", emailError);
          // Don't fail the order if email fails
        }

        // Send notification email to admin
        try {
          await sendAdminNotificationEmail(order, customerInfo);
        } catch (emailError) {
          console.error("Error sending admin email:", emailError);
          // Don't fail the order if email fails
        }

        res.status(201).json({
          message: "Order created successfully",
          order: {
            orderNumber: order.orderNumber,
            _id: order._id,
            total: order.total,
            status: order.status,
            customerInfo: order.customerInfo,
          },
        });
      } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order" });
      }
      break;

    case "PUT":
      try {
        const { orderId, status, notes } = req.body;

        if (!orderId) {
          return res.status(400).json({ message: "Order ID is required" });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const order = await Order.findByIdAndUpdate(orderId, updateData, {
          new: true,
          runValidators: true,
        }).populate("items.product", "name image price");

        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
          message: "Order updated successfully",
          order,
        });
      } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Error updating order" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
