import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const generateOrderConfirmationHTML = (order, customerInfo) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        Quantity: ${item.quantity}<br>
        Price: Rs. ${item.price.toLocaleString()}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        Rs. ${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Bareehas Assemble</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D5B4A; margin-bottom: 10px;">BAREEHAS ASSEMBLE</h1>
        <p style="color: #666; margin: 0;">Premium Pakistani Fashion & Lifestyle Collections</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2D5B4A; margin-top: 0;">Order Confirmation</h2>
        <p>Dear ${customerInfo.name},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2D5B4A;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa;">
              <td style="padding: 12px; border-top: 2px solid #ddd;"><strong>Total Amount</strong></td>
              <td style="padding: 12px; border-top: 2px solid #ddd; text-align: right;"><strong>Rs. ${order.total.toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2D5B4A;">Shipping Information</h3>
        <p>
          <strong>Name:</strong> ${customerInfo.name}<br>
          <strong>Phone:</strong> ${customerInfo.phone}<br>
          <strong>Email:</strong> ${customerInfo.email}<br>
          <strong>Address:</strong> ${customerInfo.address}<br>
          <strong>City:</strong> ${customerInfo.city}
        </p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2D5B4A;">Payment Method</h3>
        <p><strong>${order.paymentMethod.toUpperCase()}</strong></p>
        ${
          order.paymentMethod === "cod"
            ? "<p><em>Please keep the exact amount ready for cash on delivery.</em></p>"
            : ""
        }
      </div>
      
      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="color: #2D5B4A; margin-top: 0;">What's Next?</h4>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Your order will be processed within 1-2 business days</li>
          <li>You'll receive a shipping confirmation with tracking details</li>
          <li>Delivery typically takes 3-5 business days</li>
        </ul>
      </div>
      
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #666;">
        <p>Thank you for choosing Bareehas Assemble!</p>
        <p>For any questions, contact us at: ${process.env.EMAIL_FROM}</p>
      </div>
    </body>
    </html>
  `;
};

const generateAdminNotificationHTML = (order, customerInfo) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - Bareehas Assemble Admin</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0;">🛍️ NEW ORDER RECEIVED</h1>
        <p style="margin: 5px 0 0 0;">Order #${order.orderNumber}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #2D5B4A;">Customer Information</h3>
        <table style="width: 100%;">
          <tr><td style="padding: 5px 0;"><strong>Name:</strong></td><td>${customerInfo.name}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Phone:</strong></td><td>${customerInfo.phone}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td>${customerInfo.email}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Address:</strong></td><td>${customerInfo.address}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>City:</strong></td><td>${customerInfo.city}</td></tr>
          <tr><td style="padding: 5px 0;"><strong>Payment:</strong></td><td><strong>${order.paymentMethod.toUpperCase()}</strong></td></tr>
        </table>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2D5B4A;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #2D5B4A; color: white;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td colspan="3" style="padding: 10px; text-align: right;">TOTAL AMOUNT:</td>
              <td style="padding: 10px; text-align: right; color: #dc2626;">Rs. ${order.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      ${
        order.notes
          ? `
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin-top: 0;">Customer Notes:</h4>
        <p style="margin-bottom: 0;">${order.notes}</p>
      </div>
      `
          : ""
      }
      
      <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; color: #0c5460;">
        <p style="margin: 0;"><strong>Action Required:</strong> Please process this order and update the status in admin panel.</p>
      </div>
    </body>
    </html>
  `;
};

// Email sending functions
export const sendOrderConfirmationEmail = async (order, customerInfo) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Bareehas Assemble" <${process.env.EMAIL_FROM}>`,
      to: customerInfo.email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: generateOrderConfirmationHTML(order, customerInfo),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNotificationEmail = async (order, customerInfo) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Bareehas Assemble System" <${process.env.EMAIL_FROM}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM,
      subject: `🛍️ New Order #${order.orderNumber} - Rs. ${order.total.toLocaleString()}`,
      html: generateAdminNotificationHTML(order, customerInfo),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return { success: false, error: error.message };
  }
};

export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return { success: true };
  } catch (error) {
    console.error("Email configuration error:", error);
    return { success: false, error: error.message };
  }
};
