import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CategoryBar from "../components/CategoryBar";
import ProductCard from "../components/ProductCard";

export default function Home({ products, categories }) {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            BAREEHAS ASSEMBLE
          </h1>
          <p className="text-xl md:text-2xl text-brand-warm/90 mb-8">
            Premium Pakistani Fashion & Lifestyle Collections
          </p>
          <p className="text-lg text-brand-warm/80">
            Curated elegance for the modern Pakistani woman
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <CategoryBar categories={categories} />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const fs = require("fs");
  const path = require("path");

  // Read products and categories data
  const productsData = fs.readFileSync(
    path.join(process.cwd(), "data/products.json"),
    "utf8",
  );
  const categoriesData = fs.readFileSync(
    path.join(process.cwd(), "data/categories.json"),
    "utf8",
  );

  const products = JSON.parse(productsData);
  const categories = JSON.parse(categoriesData);

  return {
    props: {
      products,
      categories,
    },
  };
}
