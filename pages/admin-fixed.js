import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminFixed() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Only load data when component is properly mounted and hasn't loaded yet
    if (!hasLoaded) {
      const timer = setTimeout(() => {
        loadData();
      }, 500); // Increased delay for stability

      return () => clearTimeout(timer);
    }
  }, [hasLoaded]);

  const loadData = async () => {
    // Prevent multiple simultaneous loads
    if (hasLoaded) return;

    try {
      setHasLoaded(true);
      // Load categories first, then products
      await fetchCategories();
      await fetchProducts();
    } catch (error) {
      console.error("Error in loadData:", error);
      // Reset if loading failed
      setHasLoaded(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");

      // Add AbortController to handle cleanup
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/categories", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log("Categories API response:", data);

        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
          console.log("Categories set:", data.categories);
        } else {
          console.log("No categories in response");
          setCategories([]);
        }
      } else {
        console.error("Categories API failed:", response.status);
        setCategories([]);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Categories fetch was aborted");
      } else {
        console.error("Error fetching categories:", error);
      }
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      // Add AbortController to handle cleanup
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/products?limit=100", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        // Fallback to JSON products
        try {
          const jsonResponse = await fetch("/data/products.json", {
            signal: controller.signal,
          });
          const jsonData = await jsonResponse.json();
          setProducts(jsonData || []);
        } catch (fallbackError) {
          console.error("Error loading fallback products:", fallbackError);
          setProducts([]);
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Products fetch was aborted");
      } else {
        console.error("Error fetching products:", error);
      }
      setProducts([]);
    }
  };

  const seedCategories = async () => {
    try {
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch("/api/seed-categories", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success("Categories created successfully!");
        await fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to seed categories");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Request timed out");
      } else {
        console.error("Error seeding categories:", error);
        toast.error("Failed to seed categories");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        const error = await response.json();
        toast.error(`Upload failed: ${error.error}`);
        return null;
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Upload timed out");
      } else {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!productForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!productForm.category) {
      toast.error("Please select a category");
      return;
    }

    if (!productForm.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!selectedFile && !productForm.image.trim()) {
      toast.error("Product image is required");
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = productForm.image;

      // Upload file if selected
      if (selectedFile) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl) {
          setIsUploading(false);
          return;
        }
      }

      // Prepare product data
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        category: productForm.category,
        image: finalImageUrl,
        inventory: parseInt(productForm.inventory) || 0,
        featured: productForm.featured,
      };

      console.log("Sending product data:", productData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseData = await response.json();
      console.log("Product API response:", responseData);

      if (response.ok) {
        toast.success("Product added successfully!");
        // Reset form
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
        // Refresh products
        await fetchProducts();
      } else {
        toast.error(responseData.message || "Failed to add product");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Request timed out");
      } else {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    try {
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success("Category added successfully!");
        setCategoryForm({ name: "", description: "" });
        await fetchCategories();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to add category");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Request timed out");
      } else {
        console.error("Error adding category:", error);
        toast.error("Failed to add category");
      }
    } finally {
      setIsLoading(false);
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
            {/* Categories Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-800 font-medium">
                    Categories Status: {categories.length} categories available
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <span
                        key={cat._id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={fetchCategories} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  {categories.length === 0 && (
                    <Button
                      onClick={seedCategories}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Seed Categories"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-medium mb-4 text-brand-primary">
                🛍️ Add New Product
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                {/* Name and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    step="0.01"
                    placeholder="Price in PKR (required) *"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                    required
                  />
                </div>

                {/* Category and Inventory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => {
                        console.log("Category selected:", e.target.value);
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        });
                      }}
                      className="p-3 border rounded-md focus:ring-2 focus:ring-brand-primary w-full"
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {categories.length} categories
                    </p>
                  </div>
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
                </div>

                {/* Description */}
                <textarea
                  placeholder="Product Description (required) *"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-primary"
                  rows="3"
                  required
                />

                {/* Image Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    📸 Product Image *
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

                {/* Featured checkbox */}
                <label className="flex items-center">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 text-lg py-3"
                  disabled={isUploading || categories.length === 0}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {selectedFile ? "Uploading..." : "Adding Product..."}
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </form>
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
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Category:{" "}
                          {product.category?.name || product.category || "N/A"}
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Category
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Current Categories ({categories.length})
                </h3>
                <Button
                  onClick={seedCategories}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Seed Default Categories"
                  )}
                </Button>
              </div>
              <div className="p-6">
                {categories.length > 0 ? (
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
                  <div className="text-center text-gray-500">
                    <p>No categories found</p>
                    <p className="text-sm mt-2">
                      Click "Seed Default Categories" to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
