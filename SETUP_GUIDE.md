# 🛍️ Bareehas Assemble - Complete E-commerce Setup Guide

## 🚀 Quick Start

This is a complete e-commerce solution built with Next.js, featuring authentication, cart management, order processing, and email notifications.

### Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer
- **State Management**: React Context API
- **UI Components**: Radix UI + Custom Components

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB Atlas** account
3. **Google Console** project for OAuth
4. **Email service** (Gmail recommended)

## 🔧 Environment Setup

### 1. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database user with read/write permissions
4. Configure Network Access (add your IP or 0.0.0.0/0 for development)
5. Get your connection string

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

### 3. Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an "App Password":
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in your environment variables

## 🔐 Environment Variables

Create `.env.local` file in root directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bareehas-assemble

# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-here-32-characters-long
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com

# Admin Configuration
ADMIN_EMAIL=admin@bareehas-assemble.com
```

### Generate NEXTAUTH_SECRET

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd bareehas-assemble

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🗄️ Database Seeding

### Sample Categories

```javascript
// Add via API or directly to MongoDB
[
  {
    name: "Lawn Collection",
    slug: "lawn",
    description: "Premium lawn dresses",
  },
  {
    name: "Embroidered",
    slug: "embroidered",
    description: "Elegant embroidered wear",
  },
  {
    name: "Cotton Collection",
    slug: "cotton",
    description: "Comfortable cotton wear",
  },
];
```

### Sample Products

```javascript
// Add via API or directly to MongoDB
[
  {
    name: "Premium Lawn Dress",
    slug: "premium-lawn-dress",
    description: "Beautiful lawn dress with intricate patterns",
    price: 4500,
    category: "ObjectId-of-lawn-category",
    image: "/products/lawn-dress-1.jpg",
    inventory: 10,
    inStock: true,
    featured: true,
  },
];
```

## 🎨 Features Implemented

### ✅ Authentication System

- **Email/Password** registration and login
- **Google OAuth** integration
- Session management with NextAuth.js
- Protected routes and admin panel

### ✅ Shopping Cart

- Add/remove items
- Quantity management
- Persistent cart (localStorage)
- Real-time cart updates
- Cart page with full functionality

### ✅ Product Management

- Dynamic product listing
- Category-based filtering
- Search functionality
- Featured products
- Product detail pages

### ✅ Order System

- Complete checkout process
- Customer information collection
- Multiple payment methods (COD, Bank Transfer, etc.)
- Order confirmation
- Order tracking

### ✅ Email Notifications

- **Customer**: Order confirmation with details
- **Admin**: New order notifications
- Professional HTML email templates
- Error handling for email failures

### ✅ Dynamic Categories

- Add/edit/delete categories
- Automatic route generation (`/category/[slug]`)
- Category-wise product filtering

## 🎯 Usage Guide

### For Customers

1. **Browse Products**: Visit homepage or category pages
2. **Add to Cart**: Click "Add to Cart" on any product
3. **Quick Purchase**: Use "Buy Now" for immediate checkout
4. **Authentication**: Sign up/in with email or Google
5. **Checkout**: Fill customer details and place order
6. **Confirmation**: Receive email confirmation

### For Admins

1. **Access Admin Panel**: Sign in with admin account
2. **Manage Products**: Add/edit/delete products
3. **Manage Categories**: Create new categories
4. **Order Management**: View and update order status
5. **Customer Management**: View customer information

## 🛠️ API Endpoints

### Products

- `GET /api/products` - List products with filtering
- `POST /api/products` - Create new product (admin)

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category (admin)

### Orders

- `GET /api/orders` - List orders
- `POST /api/orders` - Create new order
- `PUT /api/orders` - Update order status (admin)

### Authentication

- `POST /api/auth/register` - Register new user
- NextAuth.js handles other auth routes

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variables** in Vercel dashboard
4. **Update NEXTAUTH_URL** to your production domain
5. **Deploy**

### Environment Variables for Production

```bash
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@your-domain.com
```

## 🔍 Testing

### Test Email Configuration

```javascript
// Add this API route for testing
// pages/api/test-email.js
import { testEmailConfiguration } from "../../lib/emailService";

export default async function handler(req, res) {
  const result = await testEmailConfiguration();
  res.json(result);
}
```

### Test Order Flow

1. Add products to cart
2. Proceed to checkout
3. Fill customer information
4. Place order
5. Check email notifications

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database name is included in URI

2. **Google OAuth Error**
   - Verify redirect URIs in Google Console
   - Check client ID and secret
   - Ensure OAuth consent screen is configured

3. **Email Not Sending**
   - Verify Gmail app password
   - Check SMTP settings
   - Test email configuration

4. **Environment Variables**
   - Restart dev server after changes
   - Check for typos in variable names
   - Ensure .env.local is in root directory

## 📞 Support

For issues and questions:

1. Check this setup guide
2. Review error logs in console
3. Test individual components
4. Verify environment variables

## 🎉 Next Steps

1. **Add Payment Gateway** (Stripe, PayPal)
2. **Implement Product Reviews**
3. **Add Wishlist Functionality**
4. **Advanced Admin Dashboard**
5. **Mobile App with React Native**
6. **SEO Optimization**
7. **Performance Monitoring**

## 📄 License

This project is for educational and commercial use. Please customize according to your needs.

---

**Happy Coding! 🚀**

For the most up-to-date documentation and support, please refer to the project repository.
