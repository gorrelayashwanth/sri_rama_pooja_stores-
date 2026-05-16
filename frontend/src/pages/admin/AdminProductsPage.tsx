import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Package,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Product, PaginatedResponse, Category, ApiResponse } from "../../types";
import placeholderImage from "../../assets/pooja-placeholder.svg";

const fallbackCategories: Category[] = [
  { id: "cat-1", name: "Puja Items", slug: "puja-items" },
  { id: "cat-2", name: "Idols & Frames", slug: "idols-frames" },
  { id: "cat-3", name: "Incense & Oils", slug: "incense-oils" },
  { id: "cat-4", name: "Festival Supplies", slug: "festival-supplies" },
  { id: "cat-5", name: "Brassware", slug: "brassware" },
];

const createInitialFormData = () => ({
  name: "",
  slug: "",
  description: "",
  price: "",
  salePrice: "",
  discount: "",
  sku: "",
  stock: "0",
  categoryId: "",
  imageUrl: "",
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { message?: string } } }).response;
    const message = maybeResponse?.data?.message;
    if (message) return message;
  }
  return fallback;
};

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [formData, setFormData] = useState(createInitialFormData());

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await api.get<PaginatedResponse<Product>>('/products', {
        params: { 
          page, 
          limit: 10,
          search: searchTerm,
          all: true // Admin should see all products
        }
      });
      setProducts(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.total
      });
    } catch (error) {
      setProducts([]);
      setLoadError(getErrorMessage(error, "Unable to load products. Please check your backend connection and database status."));
      setPagination({
        page,
        totalPages: 1,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const response = await api.get<ApiResponse<Category[]>>("/categories");
      if (response.data.data.length > 0) {
        setCategories(response.data.data);
      }
    } catch {
      setCategories(fallbackCategories);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      if (field === "name") {
        const shouldSyncSlug = !prev.slug || prev.slug === slugify(prev.name);
        return {
          ...prev,
          name: value,
          slug: shouldSyncSlug ? slugify(value) : prev.slug,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    setSubmitError("");
  };

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.sku || !formData.categoryId) {
      setSubmitError("Please fill the required product fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await api.post("/products", {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        discount: formData.discount ? Number(formData.discount) : null,
        sku: formData.sku,
        stock: Number(formData.stock || "0"),
        categoryId: formData.categoryId,
        images: formData.imageUrl
          ? [{ url: formData.imageUrl, publicId: `manual-${formData.slug}` }]
          : [],
      });

      setSubmitSuccess("Product created successfully.");
      setIsAddOpen(false);
      resetForm();
      fetchProducts(1);
    } catch (error) {
      setSubmitError(
        getErrorMessage(
          error,
          "Could not create the product. Make sure admin login and backend database are working."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      await api.patch(`/products/${id}/availability`);
      setProducts(products.map(p => 
        p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
      ));
    } catch (error) {
      console.error("Failed to toggle availability:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Catalog" subtitle="Inventory" />
      
      <div className="p-6 md:p-8 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-[#2d4a2d] p-4 rounded-2xl shadow-lg shadow-green-100">
              <Package className="h-7 w-7 text-[#86efac]" />
            </div>
            <div>
              <h1 className="text-3xl font-playfair font-black text-puja-text tracking-tight">Products</h1>
              <p className="text-[10px] text-saffron-600 font-black uppercase tracking-[0.3em]">Manage Your Inventory</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all shadow-sm placeholder:text-gray-300"
              />
            </div>
            <button className="p-4 bg-white border border-gray-200 rounded-2xl text-puja-text hover:bg-saffron-50 hover:border-saffron-200 transition-all shadow-sm active:scale-95">
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsAddOpen(true);
                setSubmitSuccess("");
              }}
              className="bg-[#2d4a2d] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-green-100 active:scale-95"
            >
              <Plus className="h-5 w-5" /> Add Product
            </button>
          </div>
        </div>


        {submitSuccess && (
          <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {submitSuccess}
          </div>
        )}

        {loadError && (
          <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {loadError}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
                        <p className="text-sm text-puja-muted font-medium">Loading products...</p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <p className="text-gray-400 italic">
                        {loadError ? "Products could not be loaded from the backend." : "No products found matching your search."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <img 
                              src={product.images[0]?.url || placeholderImage} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-puja-text text-sm truncate max-w-[200px]">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-saffron-600 bg-saffron-50 px-2.5 py-1 rounded-lg">
                          {product.category?.name || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-puja-text">₹{product.salePrice || product.price}</span>
                          {product.salePrice && (
                            <span className="text-[10px] text-gray-400 line-through">₹{product.price}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-500' : 'text-puja-text'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleAvailability(product.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${
                            product.isAvailable 
                              ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                              : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                          }`}
                        >
                          {product.isAvailable ? (
                            <><CheckCircle2 className="h-3 w-3" /> Active</>
                          ) : (
                            <><XCircle className="h-3 w-3" /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-puja-text transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-saffron-600 transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-puja-text transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium tracking-tight">
              Showing <span className="text-puja-text font-bold">{products.length}</span> of <span className="text-puja-text font-bold">{pagination.total}</span> products
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-puja-text disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => fetchProducts(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    pagination.page === i + 1 
                      ? 'bg-[#2d4a2d] text-white shadow-green-100' 
                      : 'bg-white border border-gray-100 text-gray-400 hover:text-puja-text'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-puja-text disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 md:px-8">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-puja-text">Add New Product</h2>
                  <p className="text-sm text-puja-muted">Create a product record from the admin panel.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-puja-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2 md:px-8">
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Product Name *</span>
                  <input
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Slug *</span>
                  <input
                    value={formData.slug}
                    onChange={(e) => handleFieldChange("slug", slugify(e.target.value))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold text-puja-text">Description *</span>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Price *</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Sale Price</span>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => handleFieldChange("salePrice", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Discount %</span>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleFieldChange("discount", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Stock</span>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">SKU *</span>
                  <input
                    value={formData.sku}
                    onChange={(e) => handleFieldChange("sku", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Category *</span>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange("categoryId", e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold text-puja-text">Image URL</span>
                  <input
                    value={formData.imageUrl}
                    onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
              </div>

              {submitError && (
                <div className="mx-6 mb-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:mx-8">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-end md:px-8">
                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-puja-text transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProduct}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#2d4a2d] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a2b1a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
