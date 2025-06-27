import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-6 border-b last:border-b-0"
            >
              {/* Product Image */}
              <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 ml-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-gray-600">{item.category}</p>
                <p className="text-lg font-bold text-brand-primary">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Item Total */}
              <div className="ml-6 text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">
                Total ({getCartCount()} items)
              </span>
              <span className="text-2xl font-bold text-brand-primary">
                {formatPrice(getCartTotal())}
              </span>
            </div>

            <div className="flex space-x-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
