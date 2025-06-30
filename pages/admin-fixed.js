import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminFixed() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    inventory: "",
    featured: false,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        console.log("Categories fetched:", data);
        setCategories(data.categories || []);
      } else {
        console.error("Failed to fetch categories:", response.status);
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        // Fallback to JSON products
        const jsonResponse = await fetch("/data/products.json");
        const jsonData = await jsonResponse.json();
        setProducts(jsonData || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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
        return data.imageUrl;
      } else {
        const error = await response.json();
        toast.error(`Upload failed: ${error.error}`);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error("Name, Price and Category are required!");
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = productForm.image;

      if (selectedFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl) {
          setIsUploading(false);
          return;
        }
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          image: finalImageUrl,
          price: parseFloat(productForm.price) || 0,
          inventory: parseInt(productForm.inventory) || 0,
        }),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        setProductForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
          inventory: "",
          featured: false,
        });
        setSelectedFile(null);
        setImagePreview("");
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error("Category name is required!");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        toast.success("Category added successfully!");
        setCategoryForm({ name: "", description: "" });
        fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard - Bareehas Assemble
          </h1>
          <p className="text-gray-600">
            Manage your store - Add products and categories
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📦 Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "categories"
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              📁 Categories
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4 text-brand-primary">
                🛍️ Add New Product
              </h3>
              <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  type="text"
                  placeholder="Product Name (required) *"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  required
                />
                <input
                  type="number"
                  placeholder="Price in PKR (required) *"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  required
                />

                {/* Category Dropdown */}
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  required
                >
                  <option value="">Select Category *</option>
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>

                <input
                  type="number"
                  placeholder="Stock/Inventory (optional)"
                  value={productForm.inventory}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      inventory: e.target.value,
                    })
                  }
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                />

                {/* Image Upload Section */}
                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    📸 Upload Product Image
                  </label>

                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1 p-3 border rounded-md"
                    />
                    {selectedFile && (
                      <span className="text-sm text-green-600">
                        ✓ {selectedFile.name}
                      </span>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <input
                    type="url"
                    placeholder="Or paste image URL"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <textarea
                  placeholder="Product Description (optional)"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="p-3 border rounded-md md:col-span-2 focus:ring-2 focus:ring-brand-primary"
                  rows="3"
                />

                <label className="flex items-center md:col-span-2">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        featured: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Featured Product (show on homepage?)
                </label>

                <Button
                  type="submit"
                  className="md:col-span-2 bg-brand-primary hover:bg-brand-primary/90 text-lg py-3"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </form>

              {/* Categories Debug Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Available Categories ({categories.length}):
                </h4>
                {isLoading ? (
                  <p className="text-blue-600">Loading categories...</p>
                ) : categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <span
                        key={cat._id}
                        className="px-3 py-1 bg-brand-primary text-white rounded-full text-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600">
                    ⚠️ No categories found. Please add categories first!
                  </p>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">
                  Current Products ({products.length})
                </h3>
              </div>
              <div className="p-6">
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 6).map((product) => (
                      <div
                        key={product._id || product.id}
                        className="border rounded-lg p-4"
                      >
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Category: {product.category?.name || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No products found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4 text-brand-primary">
                📁 Add New Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name (required) *"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  required
                />
                <textarea
                  placeholder="Category Description (optional)"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  rows="3"
                />
                <Button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-lg py-3"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Category
                </Button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">
                  Current Categories ({categories.length})
                </h3>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <p className="text-center text-blue-600">Loading...</p>
                ) : categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div key={category._id} className="border rounded-lg p-4">
                        <h4 className="font-medium text-lg">{category.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {category.description || "No description"}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Slug: {category.slug}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No categories found
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
