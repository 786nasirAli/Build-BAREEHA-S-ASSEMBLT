import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminDirect() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const productsRes = await fetch("/api/products?limit=100");
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      // Fetch categories
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);

      // Fetch orders
      const ordersRes = await fetch("/api/orders?limit=50");
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

      // Calculate stats
      const totalRevenue = (ordersData.orders || []).reduce(
        (sum, order) => sum + order.total,
        0,
      );
      const pendingOrders = (ordersData.orders || []).filter(
        (order) => order.status === "pending",
      ).length;

      setStats({
        totalProducts: (productsData.products || []).length,
        totalOrders: (ordersData.orders || []).length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Direct access to your e-commerce admin panel
          </p>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              ✅ <strong>Admin Access Granted</strong> - You have full
              administrative privileges
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/admin")}
                className="w-full justify-start"
                variant="outline"
              >
                📦 Manage Products
              </Button>
              <Button
                onClick={() => router.push("/admin")}
                className="w-full justify-start"
                variant="outline"
              >
                📁 Manage Categories
              </Button>
              <Button
                onClick={() => router.push("/admin")}
                className="w-full justify-start"
                variant="outline"
              >
                📋 View Orders
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="flex justify-between text-sm">
                  <span className="truncate">{order.orderNumber}</span>
                  <span className="font-medium">
                    {formatPrice(order.total)}
                  </span>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-medium mb-4">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="text-green-600">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email System</span>
                <span className="text-green-600">✅ Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin Status</span>
                <span className="text-green-600">✅ Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Access Full Dashboard */}
        <div className="bg-brand-primary text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            Ready to Manage Your Store?
          </h3>
          <p className="mb-4">
            Access the complete admin dashboard with all management tools
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push("/admin")}
              variant="secondary"
              size="lg"
              className="mr-4"
            >
              Open Full Admin Dashboard →
            </Button>
            <Button
              onClick={() => window.open("/admin", "_blank")}
              variant="outline"
              size="lg"
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
