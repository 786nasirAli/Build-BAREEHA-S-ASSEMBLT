import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import CategoryBar from "../../components/CategoryBar";
import ProductCard from "../../components/ProductCard";

export default function CategoryPage({
  products,
  categories,
  currentCategory,
}) {
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

  return (
    <Layout>
      {/* Category Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
            {currentCategory?.name || router.query.category} Collection
          </h1>
          <p className="text-lg text-brand-warm/80">
            {currentCategory?.description ||
              `Explore our premium ${router.query.category} collection`}
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <CategoryBar categories={categories} />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} products in{" "}
                <span className="font-medium capitalize">
                  {router.query.category}
                </span>{" "}
                category
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              There are no products in this category yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const fs = require("fs");
  const path = require("path");

  const categoriesData = fs.readFileSync(
    path.join(process.cwd(), "data/categories.json"),
    "utf8",
  );
  const categories = JSON.parse(categoriesData);

  const paths = categories.map((category) => ({
    params: { category: category.id },
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
  const categoriesData = fs.readFileSync(
    path.join(process.cwd(), "data/categories.json"),
    "utf8",
  );

  const allProducts = JSON.parse(productsData);
  const categories = JSON.parse(categoriesData);

  const products = allProducts.filter(
    (product) => product.category === params.category,
  );
  const currentCategory = categories.find((cat) => cat.id === params.category);

  return {
    props: {
      products,
      categories,
      currentCategory: currentCategory || null,
    },
  };
}
