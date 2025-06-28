import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { CheckCircle, Package, Clock, Truck } from "lucide-react";

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      // In a real app, you'd fetch order details from API
      // For now, we'll show a success message
      setIsLoading(false);
    }
  }, [orderNumber]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. We've received your order and will process
            it shortly.
          </p>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Order Number
            </h2>
            <p className="text-2xl font-bold text-brand-primary">
              #{orderNumber}
            </p>
          </div>

          {/* Order Status Steps */}
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Order Status
            </h3>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  Order Placed
                </span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Processing</span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Shipped</span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              What happens next?
            </h3>
            <div className="text-left space-y-3 text-blue-800">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm">
                    Your order will be processed within 1-2 business days
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Shipping Confirmation</p>
                  <p className="text-sm">
                    You'll receive an email with tracking details
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm">
                    Standard delivery takes 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                Continue Shopping
              </Button>
            </Link>

            <Button variant="outline" onClick={() => window.print()}>
              Print Order Details
            </Button>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Need help with your order?</p>
            <p className="mt-1">
              Contact us at{" "}
              <a
                href="mailto:na9334974@gmail.com"
                className="text-brand-primary hover:underline"
              >
                na9334974@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
