import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatPrice } from "../lib/utils";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Shopping Cart ({getCartItemCount()} items)
          </h1>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {cart.items.map((item, index) => (
                <div
                  key={item._id || item.id}
                  className={`p-6 ${
                    index !== cart.items.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.image?.startsWith("/products/") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item._id || item.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 hover:text-brand-primary cursor-pointer line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center mt-3 space-x-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item._id || item.id,
                                item.quantity - 1,
                              )
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-2 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item._id || item.id,
                                item.quantity + 1,
                              )
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveItem(item._id || item.id, item.name)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({getCartItemCount()} items)
                  </span>
                  <span className="font-medium">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total</span>
                    <span className="text-brand-primary">
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-brand-primary hover:bg-brand-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>Free shipping on all orders</p>
                <p>Secure checkout with multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
