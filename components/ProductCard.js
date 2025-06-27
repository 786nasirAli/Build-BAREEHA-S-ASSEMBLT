import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "../lib/utils";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Product Image */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
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
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-brand-primary">
              {formatPrice(product.price)}
            </p>
            {!product.inStock && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
