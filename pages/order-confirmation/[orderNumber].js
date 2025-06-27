import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { formatPrice } from "../../lib/utils";
import Link from "next/link";

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The order you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for your order. We'll contact you soon to confirm.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Order Confirmation
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">
                <strong>Order Number:</strong> {order.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Delivery Information
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {order.customerInfo.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {order.customerInfo.phone}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {order.customerInfo.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>City:</strong> {order.customerInfo.city}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product?.image || "/placeholder.svg"}
                      alt={item.product?.name || "Product"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium">
                      {item.product?.name || "Product"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-brand-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Button onClick={() => window.print()}>Print Order</Button>
        </div>
      </div>
    </Layout>
  );
}
