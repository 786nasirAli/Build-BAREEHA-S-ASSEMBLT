import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "../../components/ui/button";
import { formatPrice } from "../../lib/utils";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);

  // Form states for adding/editing
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    description: "",
    inStock: true,
  });

  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.imagePath;
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // First upload the image if one is selected
      let imagePath = productForm.image; // Use existing URL if provided

      if (selectedFile) {
        imagePath = await uploadImage();
        if (!imagePath) {
          setIsUploading(false);
          return; // Stop if image upload failed
        }
      }

      // Then create the product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: parseInt(productForm.price),
          image: imagePath,
        }),
      });

      if (response.ok) {
        setProductForm({
          name: "",
          price: "",
          category: "",
          image: "",
          description: "",
          inStock: true,
        });
        setSelectedFile(null);
        setImagePreview(null);
        fetchProducts();
        alert("Product added successfully!");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchProducts();
          alert("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      if (response.ok) {
        setCategoryForm({ id: "", name: "", description: "" });
        fetchCategories();
        alert("Category added successfully!");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchCategories();
          alert("Category deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  };

  if (isLoading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "categories"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Categories ({categories.length})
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (PKR)"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>

                  {/* File Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full p-3 border rounded-md"
                  />

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  {/* Optional: URL Input as fallback */}
                  <div className="pt-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Or enter image URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-md"
                  rows="3"
                  required
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        inStock: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  In Stock
                </label>
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Add Product"}
                </Button>
              </form>
            </div>

            {/* Products List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.price)} • {product.category}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="Category ID (e.g., lawn)"
                  value={categoryForm.id}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, id: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-md"
                  rows="3"
                  required
                />
                <Button type="submit" className="w-full">
                  Add Category
                </Button>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
