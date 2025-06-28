import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatPrice } from "../lib/utils";

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    setIsLoading(true);
    try {
      addToCart(product, 1);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    // Add to cart first
    addToCart(product, 1);

    // Redirect to checkout with this specific product
    router.push(
      `/checkout?product=${product._id || product.id}&quantity=1&direct=true`,
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/product/${product._id || product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {product.image.startsWith("/products/") ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={533}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Out of Stock
              </span>
            </div>
          )}

          {product.featured && (
            <div className="absolute top-3 left-3 bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-2 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/product/${product._id || product.id}`);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id || product.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-brand-primary">
              {formatPrice(product.price)}
            </span>
            {product.inventory &&
              product.inventory <= 5 &&
              product.inventory > 0 && (
                <span className="text-orange-500 text-xs font-medium">
                  Only {product.inventory} left!
                </span>
              )}
          </div>

          {!product.inStock && (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {isInCart(product._id || product.id) ? "In Cart" : "Add"}
          </Button>

          <Button
            size="sm"
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50"
            onClick={handleBuyNow}
            disabled={!product.inStock || isLoading}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
