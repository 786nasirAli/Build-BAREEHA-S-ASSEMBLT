import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { formatPrice } from "../../lib/utils";

export default function ProductDetail({ product }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>Product not found</div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    // Cart functionality to be implemented
    alert("Added to cart! (Cart functionality to be implemented)");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-brand-primary">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a
                href={`/category/${product.category}`}
                className="hover:text-brand-primary capitalize"
              >
                {product.category}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
            {product.image.startsWith("/products/") ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={800}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-3xl font-bold text-brand-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Category
              </h3>
              <span className="inline-block bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                {product.category}
              </span>
            </div>

            <div className="mb-8">
              {product.inStock ? (
                <span className="text-green-600 font-medium">✓ In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="w-full mb-4"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button variant="outline" size="lg" className="w-full">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");

  const productsData = fs.readFileSync(
    path.join(process.cwd(), "data/products.json"),
    "utf8",
  );
  const products = JSON.parse(productsData);

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const fs = require("fs");
  const path = require("path");

  const productsData = fs.readFileSync(
    path.join(process.cwd(), "data/products.json"),
    "utf8",
  );
  const products = JSON.parse(productsData);

  const product = products.find((p) => p.id.toString() === params.id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
}
