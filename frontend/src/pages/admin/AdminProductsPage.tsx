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
  priceTiers: [] as { weight: string; price: number; salePrice: number | null }[],
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

  // Custom states for details view, photo uploads, and price variant configuration
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newTierWeight, setNewTierWeight] = useState("");
  const [newTierPrice, setNewTierPrice] = useState("");
  const [newTierSalePrice, setNewTierSalePrice] = useState("");

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
      priceTiers: product.priceTiers
        ? (typeof product.priceTiers === 'string' ? JSON.parse(product.priceTiers) : product.priceTiers)
        : [],
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
    priceTiers: formData.priceTiers,
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setSubmitError("");
    setSubmitSuccess("");
    setIsUploadingPhoto(true);

    try {
      const response = await api.post('/media/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data?.success) {
        const uploadedUrl = response.data.data.url;
        setFormData(prev => ({
          ...prev,
          imageUrl: uploadedUrl
        }));
        setSubmitSuccess("Photo uploaded successfully!");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.response?.data?.message || "Failed to upload photo. Ensure file is an image.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleAddPriceTier = () => {
    if (!newTierWeight.trim() || !newTierPrice.trim()) {
      alert("Weight and Price are required to add a tier.");
      return;
    }
    const tier = {
      weight: newTierWeight.trim(),
      price: Number(newTierPrice),
      salePrice: newTierSalePrice.trim() ? Number(newTierSalePrice) : null,
    };
    setFormData(prev => ({
      ...prev,
      priceTiers: [...(prev.priceTiers || []), tier]
    }));
    setNewTierWeight("");
    setNewTierPrice("");
    setNewTierSalePrice("");
  };

  const handleRemovePriceTier = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      priceTiers: (prev.priceTiers || []).filter((_, i) => i !== idx)
    }));
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

        {/* Desktop View Table */}
        <div className="hidden lg:block bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
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
                            onClick={() => setDetailProduct(product)}
                            className="p-2.5 text-gray-400 hover:text-puja-text hover:bg-gray-50 rounded-xl transition-colors"
                            title="View specs detail modal"
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
        </div>

        {/* Mobile View Card Grid */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
              <p className="text-sm text-[#2d4a2d] font-medium">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 italic text-gray-400">
              {loadError ? "Products could not be loaded from the backend." : "No products found matching your search."}
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-[32px] border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img 
                      src={product.images?.[0]?.url || placeholderImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-puja-text truncate">{product.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">SKU: {product.sku}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-md">
                        {product.category?.name || "General"}
                      </span>
                      <span className={`text-[10px] font-bold ${product.stock < 10 ? 'text-red-500 font-black' : 'text-gray-500'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-sm font-black text-puja-text">
                      ₹{(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString("en-IN")}
                    </span>
                    {product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price && (
                      <span className="text-[10px] text-gray-400 line-through block">₹{product.price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => toggleAvailability(product.id)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border transition-all ${
                        product.isAvailable 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}
                    >
                      {product.isAvailable ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailProduct(product)}
                      className="p-2 text-gray-400 hover:text-puja-text"
                      title="View specs detail modal"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="p-2 text-gray-400 hover:text-saffron-600"
                      title="Edit product"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Shared Pagination */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm px-8 py-6 bg-gray-50/30 flex items-center justify-between">
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
                <div className="space-y-2 md:col-span-2 border-t border-gray-100 pt-6">
                  <span className="text-sm font-black text-[#2d4a2d] block uppercase tracking-wider">Product Photo Upload</span>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-6 rounded-3xl border border-gray-150">
                    <div className="w-20 h-20 bg-white border rounded-2xl overflow-hidden shrink-0">
                      <img src={formData.imageUrl || placeholderImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploadingPhoto}
                        className="text-xs text-puja-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-[#2d4a2d] file:text-white hover:file:bg-black file:cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400">Supported formats: JPG, PNG, WEBP. Uploads directly to storage.</p>
                      {isUploadingPhoto && <span className="text-xs text-saffron-600 font-bold block animate-pulse">Uploading photo...</span>}
                    </div>
                  </div>
                  <label className="block space-y-2 mt-4">
                    <span className="text-xs font-bold text-puja-text">Or Paste Custom Image URL</span>
                    <input
                      value={formData.imageUrl}
                      onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    />
                  </label>
                </div>

                {/* Price/Weight Tiers Configurator */}
                <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6">
                  <div>
                    <span className="text-sm font-black text-[#2d4a2d] block uppercase tracking-wider">Quantity / Weight Price Tiers</span>
                    <p className="text-xs text-puja-muted mt-0.5">Configure distinct pricing for weight variants (e.g., 250g, 500g, 1kg).</p>
                  </div>

                  {formData.priceTiers && formData.priceTiers.length > 0 && (
                    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-inner">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-150">
                            <th className="px-4 py-3 font-bold text-puja-text">Weight / Variant</th>
                            <th className="px-4 py-3 font-bold text-puja-text">Original Price</th>
                            <th className="px-4 py-3 font-bold text-puja-text">Sale Price</th>
                            <th className="px-4 py-3 font-bold text-puja-text text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formData.priceTiers.map((tier, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 font-bold text-puja-text">{tier.weight}</td>
                              <td className="px-4 py-3 text-puja-muted">₹{tier.price}</td>
                              <td className="px-4 py-3 text-saffron-600 font-bold">₹{tier.salePrice || '-'}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePriceTier(idx)}
                                  className="text-red-500 hover:text-red-700 font-bold uppercase tracking-widest text-[9px] bg-red-50 px-2 py-1 rounded-lg border border-red-100"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-150 items-end">
                    <label className="space-y-1.5 col-span-1">
                      <span className="text-xs font-bold text-puja-text">Weight</span>
                      <input
                        value={newTierWeight}
                        onChange={(e) => setNewTierWeight(e.target.value)}
                        placeholder="e.g. 500g"
                        className="w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </label>
                    <label className="space-y-1.5 col-span-1">
                      <span className="text-xs font-bold text-puja-text">Price</span>
                      <input
                        type="number"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value)}
                        placeholder="Price"
                        className="w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </label>
                    <label className="space-y-1.5 col-span-1">
                      <span className="text-xs font-bold text-puja-text">Sale Price</span>
                      <input
                        type="number"
                        value={newTierSalePrice}
                        onChange={(e) => setNewTierSalePrice(e.target.value)}
                        placeholder="Sale (opt)"
                        className="w-full rounded-xl border border-gray-250 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPriceTier}
                      className="bg-[#2d4a2d] hover:bg-black text-white py-2 px-4 rounded-xl text-xs font-black uppercase tracking-widest h-fit"
                    >
                      Add Tier
                    </button>
                  </div>
                </div>
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
        {detailProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white rounded-[32px] border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              <div className="bg-[#2d4a2d] text-white p-6 md:p-8 flex justify-between items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-playfair font-bold">Product Specification Details</h3>
                  <p className="text-xs text-white/70 uppercase tracking-widest mt-1">SKU: {detailProduct.sku}</p>
                </div>
                <button
                  onClick={() => setDetailProduct(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img 
                      src={detailProduct.images?.[0]?.url || placeholderImage} 
                      alt={detailProduct.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-puja-text">{detailProduct.name}</h4>
                    <p className="text-xs font-bold text-saffron-600 bg-saffron-50 px-2.5 py-1 rounded-lg w-fit">
                      {detailProduct.category?.name || "General"}
                    </p>
                    <p className="text-puja-muted italic">"{detailProduct.description}"</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Price</span>
                    <span className="text-sm font-black text-puja-text">₹{detailProduct.price}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Sale Price</span>
                    <span className="text-sm font-black text-puja-text">₹{detailProduct.salePrice || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Available Stock</span>
                    <span className="text-sm font-black text-puja-text">{detailProduct.stock} units</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Status</span>
                    <span className={`text-xs font-bold ${detailProduct.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {detailProduct.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Price Tiers Specification */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#2d4a2d] mb-3">Weight / Quantity Price Tiers</h4>
                  {detailProduct.priceTiers && (() => {
                    const parsedTiers = typeof detailProduct.priceTiers === 'string' 
                      ? JSON.parse(detailProduct.priceTiers) 
                      : detailProduct.priceTiers;
                    if (Array.isArray(parsedTiers) && parsedTiers.length > 0) {
                      return (
                        <div className="border border-gray-100 rounded-2xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-2 font-black text-puja-text">Weight</th>
                                <th className="px-4 py-2 font-black text-puja-text">Original Price</th>
                                <th className="px-4 py-2 font-black text-puja-text">Sale Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-150">
                              {parsedTiers.map((t: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2 font-bold text-puja-text">{t.weight}</td>
                                  <td className="px-4 py-2 text-puja-muted">₹{t.price}</td>
                                  <td className="px-4 py-2 text-saffron-600 font-bold">₹{t.salePrice || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    return <p className="text-xs text-gray-400 italic">No custom weight tiers configured.</p>;
                  })()}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block">Material</span>
                    <span className="font-medium text-puja-text">{detailProduct.material || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Dimensions</span>
                    <span className="font-medium text-puja-text">{detailProduct.dimensions || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Weight Spec</span>
                    <span className="font-medium text-puja-text">{detailProduct.weight || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Featured?</span>
                    <span className="font-medium text-puja-text">{detailProduct.isFeatured ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setDetailProduct(null)}
                  className="bg-[#2d4a2d] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
