import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  Plus, 
  Layers, 
  Image as ImageIcon, 
  Save, 
  X,
  Calculator,
  UploadCloud,
  Edit3,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../../api/axios";
import type { Product } from "../../types";

export function AdminCombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    productIds: [] as string[],
    isActive: true
  });

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [combosRes, productsRes] = await Promise.all([
        api.get('/combos'),
        api.get('/products?limit=100')
      ]);
      setCombos(combosRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  const calculateOriginalPrice = () => {
    return products
      .filter(p => formData.productIds.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/combos', formData);
      setCombos([...combos, response.data.data]);
      setIsCreating(false);
      setFormData({
        name: "",
        sku: "",
        description: "",
        price: 0,
        productIds: [],
        isActive: true
      });
    } catch (error) {
      console.error("Failed to save combo:", error);
    }
  };

  const deleteCombo = async (id: string) => {
    if (!window.confirm("Delete this combo?")) return;
    try {
      await api.delete(`/combos/${id}`);
      setCombos(combos.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete combo:", error);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Product Combos" subtitle="Bundles" />
      
      <div className="p-8 space-y-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#2d4a2d] p-3 rounded-2xl">
              <Layers className="h-6 w-6 text-[#86efac]" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-puja-text">Product Combos / Bundles</h1>
              <p className="text-xs text-puja-muted font-medium uppercase tracking-widest">Create value packs for customers</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#2d4a2d] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#1a2b1a] transition-all shadow-lg shadow-green-100"
          >
            <Plus className="h-5 w-5" /> Create New Combo
          </button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-playfair font-bold text-puja-text">New Collection/Combo</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Form Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-puja-text">Combo Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Breakfast Power Pack"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f4f7f4] border border-[#e2ede2] rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#86efac]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-puja-text">SKU / Code</label>
                  <input 
                    type="text" 
                    placeholder="VIN-COMBO-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-[#f4f7f4] border border-[#e2ede2] rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#86efac]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-puja-text">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe what's in this bundle..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#f4f7f4] border border-[#e2ede2] rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#86efac]/20 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-puja-text">Combo Selling Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className="w-full bg-[#f4f7f4] border border-[#e2ede2] rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#86efac]/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-puja-text">Calculated Original Price (₹)</label>
                    <div className="w-full bg-[#e2ede2] border border-[#d1e0d1] rounded-2xl py-4 px-6 text-sm font-bold text-[#2d4a2d] flex items-center justify-between shadow-inner">
                      <span>{calculateOriginalPrice()}</span>
                      <Calculator className="h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`relative w-12 h-6 rounded-full transition-all ${formData.isActive ? 'bg-[#2d4a2d]' : 'bg-[#e2ede2]'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-sm font-bold text-puja-text">Active</span>
                  </label>
                </div>
              </div>

              {/* Right Column: Product Selection & Images */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-puja-text flex justify-between items-center">
                    Select Products to Bundle
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Available Items</span>
                  </label>
                  
                  <div className="bg-[#f4f7f4] border border-[#e2ede2] rounded-[24px] overflow-hidden">
                    <div className="p-6 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {products.map((item) => (
                        <label key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-transparent hover:border-[#86efac] cursor-pointer transition-all group shadow-sm">
                          <div className="flex items-center gap-4">
                            <input 
                              type="checkbox"
                              checked={formData.productIds.includes(item.id)}
                              onChange={() => handleProductToggle(item.id)}
                              className="w-5 h-5 rounded-lg border-[#e2ede2] text-[#2d4a2d] focus:ring-[#86efac]/20"
                            />
                            <span className="text-sm font-medium text-puja-text">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-[#2d4a2d]">₹{item.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-puja-text flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-400" />
                    Combo Images
                  </label>
                  
                  <div className="border-2 border-dashed border-[#e2ede2] bg-[#f4f7f4] rounded-[24px] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#eef2ee] hover:border-[#86efac] transition-all group">
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-8 w-8 text-[#2d4a2d]" />
                    </div>
                    <p className="text-sm font-bold text-puja-text mb-1">Select Photo</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Drag & drop or Click to browse</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end items-center gap-6">
              <button 
                onClick={() => setIsCreating(false)}
                className="text-sm font-bold text-puja-muted hover:text-puja-text transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={formData.productIds.length === 0 || !formData.name}
                className="bg-[#2d4a2d] text-white px-10 py-4 rounded-[18px] font-bold flex items-center gap-3 hover:bg-[#1a2b1a] transition-all shadow-xl shadow-green-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" /> Save Bundle / Combo
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {combos.map((combo) => (
              <div key={combo.id} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-[#f4f7f4] p-3 rounded-2xl">
                    <Layers className="h-6 w-6 text-[#2d4a2d]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-saffron-600 transition-colors">
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteCombo(combo.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{combo.sku}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${combo.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {combo.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-puja-text group-hover:text-saffron-600 transition-colors">{combo.name}</h3>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-4 space-y-2">
                    {combo.products.map((p: any) => (
                      <div key={p.id} className="flex justify-between text-[11px] font-medium text-puja-muted">
                        <span>{p.name}</span>
                        <span>₹{p.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Bundle Price</p>
                      <p className="font-black text-2xl text-puja-text">₹{combo.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-0.5">You Save</p>
                      <p className="font-bold text-sm text-green-600">₹{combo.products.reduce((s:any, p:any) => s + p.price, 0) - combo.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

AdminCombosPage.style = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <style>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2ede2;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #d1e0d1;
      }
    `}</style>
  </>
);
