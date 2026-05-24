import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Package,
  X,
  Sparkles
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
  stock: "100",
  categoryId: "",
  imageUrl: "",
  subcategory: "",
  unit: "",
  minOrderQty: "1",
  material: "",
  weight: "",
  dimensions: "",
  tags: "",
  festival: "",
  deity: "",
  imagePrompt: "",
  isFeatured: false,
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
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
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
    setEditingProductId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsAddOpen(true);
    setSubmitSuccess("");
    setSubmitError("");
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      discount: product.discount ? String(product.discount) : "",
      sku: product.sku,
      stock: String(product.stock ?? 100),
      categoryId: product.categoryId || product.category?.id || "",
      imageUrl: product.images?.[0]?.url || "",
      subcategory: product.subcategory || "",
      unit: product.unit || "",
      minOrderQty: String(product.minOrderQty ?? 1),
      material: product.material || "",
      weight: product.weight || "",
      dimensions: product.dimensions || "",
      tags: (product.tags || []).join(", "),
      festival: (product.festival || []).join(", "),
      deity: (product.deity || []).join(", "),
      imagePrompt: product.imagePrompt || "",
      isFeatured: Boolean(product.isFeatured),
    });
    setIsAddOpen(true);
    setSubmitSuccess("");
    setSubmitError("");
  };

  const buildProductPayload = () => ({
    ...formData,
    price: Number(formData.price),
    salePrice: formData.salePrice ? Number(formData.salePrice) : null,
    discount: formData.discount ? Number(formData.discount) : 0,
    stock: Number(formData.stock || "100"),
    minOrderQty: Number(formData.minOrderQty || "1"),
    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    festival: formData.festival.split(",").map((f) => f.trim()).filter(Boolean),
    deity: formData.deity.split(",").map((d) => d.trim()).filter(Boolean),
    images: formData.imageUrl
      ? [{ url: formData.imageUrl, publicId: `manual-${formData.slug}` }]
      : [],
  });

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.sku || !formData.categoryId) {
      setSubmitError("Please fill the required product fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await api.post("/products", buildProductPayload());

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

  const handleUpdateProduct = async () => {
    if (!editingProductId) return;
    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.sku || !formData.categoryId) {
      setSubmitError("Please fill the required product fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await api.put(`/products/${editingProductId}`, buildProductPayload());
      setSubmitSuccess("Product updated successfully.");
      setIsAddOpen(false);
      resetForm();
      fetchProducts(pagination.page);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Could not update the product."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkInput.trim()) {
      setSubmitError("Please provide JSON array data.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      let data;
      try {
        data = JSON.parse(bulkInput);
      } catch (e) {
        throw new Error("Invalid JSON format.");
      }
      
      const res = await api.post("/products/bulk", { products: Array.isArray(data) ? data : [data] });
      setSubmitSuccess(res.data.message || "Bulk import successful.");
      setIsBulkOpen(false);
      setBulkInput("");
      fetchProducts(1);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Bulk import failed. Please check your data format."));
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

  const handleGenerateImage = async (id: string) => {
    try {
      setLoadError("");
      const res = await api.post(`/products/${id}/generate-image`);
      if (res.data.success) {
        alert("Image generated successfully!");
        fetchProducts(pagination.page); // Refresh to show new image
      }
    } catch (error) {
      alert(getErrorMessage(error, "Failed to generate image. Does it have an image prompt?"));
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
                setIsBulkOpen(true);
                setSubmitSuccess("");
                setSubmitError("");
              }}
              className="bg-white border border-gray-200 text-puja-text px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              Bulk Import
            </button>
            <button
              onClick={openCreateModal}
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
                              src={product.images?.[0]?.url || placeholderImage} 
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
                          <span className="text-sm font-black text-puja-text">
                            ₹{(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString("en-IN")}
                          </span>
                          {product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price && (
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
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <button 
                            type="button"
                            onClick={() => handleGenerateImage(product.id)}
                            className="p-2.5 text-gray-400 hover:text-saffron-500 hover:bg-saffron-50 rounded-xl transition-colors"
                            title="Generate Image"
                          >
                            <Sparkles className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => window.open(`/products/${product.slug}`, "_blank")}
                            className="p-2.5 text-gray-400 hover:text-puja-text hover:bg-gray-50 rounded-xl transition-colors"
                            title="View on store"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-2.5 text-gray-400 hover:text-saffron-600 hover:bg-saffron-50 rounded-xl transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
            <div className="w-full sm:max-w-4xl max-h-[100dvh] sm:max-h-[90vh] flex flex-col rounded-t-[28px] sm:rounded-[32px] border border-gray-100 bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4 md:px-8 md:py-5">
                <div>
                  <h2 className="text-xl md:text-2xl font-playfair font-bold text-puja-text">
                    {editingProductId ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-sm text-puja-muted">
                    {editingProductId ? "Update product details and save." : "Create a product record from the admin panel."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-puja-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 gap-5 px-5 py-5 md:grid-cols-2 md:px-8 md:py-6">
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
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Subcategory</span>
                  <input
                    value={formData.subcategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Unit (e.g. piece, pack)</span>
                  <input
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Min Order Qty</span>
                  <input
                    type="number"
                    value={formData.minOrderQty}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderQty: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Material</span>
                  <input
                    value={formData.material}
                    onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Weight</span>
                  <input
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Dimensions</span>
                  <input
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Is Featured?</span>
                  <div className="flex items-center gap-2 py-3">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="h-5 w-5 rounded border-gray-300 text-saffron-600 focus:ring-saffron-500"
                    />
                    <span className="text-sm text-gray-600">Featured Product</span>
                  </div>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold text-puja-text">Tags (comma separated)</span>
                  <input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. agarbatti, incense, rose"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Festivals (comma separated)</span>
                  <input
                    value={formData.festival}
                    onChange={(e) => setFormData(prev => ({ ...prev, festival: e.target.value }))}
                    placeholder="e.g. Diwali, Navratri"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-bold text-puja-text">Deities (comma separated)</span>
                  <input
                    value={formData.deity}
                    onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                    placeholder="e.g. Ganesha, Lakshmi"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-bold text-puja-text">AI Image Prompt</span>
                  <textarea
                    rows={2}
                    value={formData.imagePrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, imagePrompt: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                  />
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
              </div>

              {submitError && (
                <div className="mx-5 mb-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:mx-8">
                  {submitError}
                </div>
              )}

              <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-end md:px-8 safe-area-pb">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-puja-text transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingProductId ? handleUpdateProduct : handleCreateProduct}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#2d4a2d] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a2b1a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : editingProductId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isBulkOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 md:px-8">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-puja-text">Bulk Import Products</h2>
                  <p className="text-sm text-puja-muted">Paste a JSON array of products to import.</p>
                </div>
                <button
                  onClick={() => setIsBulkOpen(false)}
                  className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-puja-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <textarea
                  rows={10}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={'[\n  {\n    "name": "Agarbatti",\n    "categoryId": "cat-inc",\n    "price": 50\n  }\n]'}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-saffron-100"
                />
              </div>

              {submitError && (
                <div className="mx-6 mb-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:mx-8">
                  {submitError}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-end md:px-8">
                <button
                  onClick={() => setIsBulkOpen(false)}
                  className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-puja-text transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#2d4a2d] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a2b1a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Importing..." : "Import Products"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
