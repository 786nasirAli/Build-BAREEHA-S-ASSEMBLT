import connectDB from "../../lib/db";
import { Order, Product } from "../../models";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOrderNumber = () => {
  return `BA${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { customerInfo, items, total, paymentMethod, notes } = req.body;

    // Validate required fields
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await Order.create({
      orderNumber,
      customerInfo,
      items,
      total,
      paymentMethod,
      notes,
    });

    // Populate product details for email
    const populatedOrder = await Order.findById(order._id).populate(
      "items.product",
    );

    // Send confirmation email to customer
    const customerEmailHTML = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #2D5B4A;">Order Confirmation - Bareehas Assemble</h1>
        <p>Dear ${customerInfo.name},</p>
        <p>Thank you for your order! Your order has been received and is being processed.</p>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> PKR ${total.toLocaleString()}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Items Ordered:</h3>
          ${items
            .map(
              (item) => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>Product:</strong> ${item.product?.name || "Product"}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <p><strong>Price:</strong> PKR ${(
                item.price * item.quantity
              ).toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
        </div>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Delivery Information:</h3>
          <p><strong>Address:</strong> ${customerInfo.address}</p>
          <p><strong>City:</strong> ${customerInfo.city}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        </div>

        <p>We will contact you soon to confirm your order and arrange delivery.</p>
        <p>Thank you for choosing Bareehas Assemble!</p>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Bareehas Assemble - Premium Pakistani Fashion</p>
        </div>
      </div>
    `;

    // Send confirmation email to admin
    const adminEmailHTML = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1 style="color: #2D5B4A;">New Order Received - Bareehas Assemble</h1>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> PKR ${total.toLocaleString()}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Customer Information:</h3>
          <p><strong>Name:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>Address:</strong> ${customerInfo.address}</p>
          <p><strong>City:</strong> ${customerInfo.city}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        </div>

        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Items Ordered:</h3>
          ${items
            .map(
              (item) => `
            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
              <p><strong>Product:</strong> ${item.product?.name || "Product"}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <p><strong>Price:</strong> PKR ${(
                item.price * item.quantity
              ).toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;

    try {
      // Send email to customer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: customerInfo.email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: customerEmailHTML,
      });

      // Send email to admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Order Received - ${orderNumber}`,
        html: adminEmailHTML,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue without failing the order creation
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderNumber,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
}
