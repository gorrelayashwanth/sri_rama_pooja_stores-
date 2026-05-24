import { ShoppingCart, Share2, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus, Send, CheckCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProductCarousel } from "../../components/home/ProductCarousel";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";

export function ProductDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${slug}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0]?.url || placeholderImage,
      quantity: quantity
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setSubmittingReview(true);
    setReviewError("");
    try {
      await api.post('/reviews', {
        ...reviewForm,
        productId: product.id
      });
      setReviewSuccess(true);
      setReviewForm({ rating: 5, comment: "" });
      fetchProduct();
    } catch (err: any) {
      setReviewError(err.response?.data?.message || "Failed to submit review. You must have purchased this item.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        <p className="italic text-puja-muted animate-pulse">Summoning divine details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <h2 className="text-3xl font-playfair font-bold text-red-500 text-center px-4">The Item You Seek Has Ascended</h2>
      <Link to="/collections" className="bg-saffron-500 text-white px-8 py-3 rounded-xl font-bold">Return to Collections</Link>
    </div>
  );

  const averageRating = product.reviews.length > 0 
    ? (product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/">Home</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to={`/collections?category=${product.category?.id}`}>{product.category?.name}</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-puja-muted truncate">{t(product.name, product.translations, 'name')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            <div className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl shadow-gray-200/50">
              <img 
                src={product.images[activeImageIdx]?.url || placeholderImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              
              {/* Image Navigation Buttons */}
              {product.images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {product.images.map((_: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`h-2 transition-all rounded-full ${activeImageIdx === i ? 'w-8 bg-saffron-500' : 'w-2 bg-white/60 hover:bg-white'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mask-edge-fade">
              {product.images.map((img: any, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square w-20 md:w-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-gray-50 ${activeImageIdx === idx ? 'border-saffron-500 bg-white' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 text-gold-500 bg-gold-50/50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-gold-500" />
                <span className="text-sm font-black">{averageRating}</span>
                <span className="text-[10px] text-puja-muted font-bold uppercase tracking-widest ml-1">({product.reviews.length})</span>
              </div>
              <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${product.isAvailable ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {product.isAvailable ? "Divine Presence (In Stock)" : "Currently Ascended (Out of Stock)"}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-puja-text leading-[1.1] mb-6">
              {t(product.name, product.translations, 'name')}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-black text-puja-text tracking-tighter">₹{product.salePrice || product.price}</span>
              {product.salePrice && <span className="text-2xl text-puja-muted line-through mb-2 font-medium">₹{product.price}</span>}
              {product.discount && (
                <div className="bg-saffron-500 text-white text-[10px] font-black px-4 py-2 rounded-full mb-2 uppercase tracking-widest animate-bounce">
                  Sacred {product.discount}% OFF
                </div>
              )}
            </div>

            <p className="text-puja-muted leading-relaxed mb-10 text-lg italic border-l-4 border-saffron-100 pl-6 py-2">
              {t(product.description, product.translations, 'description')}
            </p>

            {/* Actions */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-2 bg-gray-50/50 w-full sm:w-auto justify-between">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-saffron-600 transition-colors bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-8 text-lg font-black text-puja-text">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:text-saffron-600 transition-colors bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#2d4a2d] hover:bg-black text-white py-5 px-10 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200 active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-50">
                {[
                  { icon: Truck, label: "Sacred Delivery", sub: "Fast Shipping" },
                  { icon: ShieldCheck, label: "Purity Check", sub: "Guaranteed" },
                  { icon: RotateCcw, label: "Easy Return", sub: "10-Day Window" },
                  { icon: Share2, label: "Share Bliss", sub: "Divine Socials" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4 rounded-[2rem] bg-gray-50/50 group hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all cursor-default">
                    <item.icon className="h-6 w-6 text-saffron-500 mb-3 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-puja-text mb-1">{item.label}</span>
                    <span className="text-[9px] font-medium text-puja-muted uppercase">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex border-b border-gray-100 gap-12 overflow-x-auto scrollbar-hide px-2">
            {["description", "reviews", "specifications"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0 ${
                  activeTab === tab ? 'text-saffron-600' : 'text-puja-muted hover:text-puja-text'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-saffron-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 md:py-16">
            {activeTab === "description" && (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="prose prose-puja max-w-none text-xl text-puja-muted leading-relaxed font-playfair italic">
                  {t(product.description, product.translations, 'description')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100">
                    <h4 className="text-xl font-bold text-puja-text mb-4">Artisan Craftsmanship</h4>
                    <p className="text-sm text-puja-muted leading-relaxed">
                      Every item is handcrafted by traditional artisans who have mastered their craft over generations, ensuring authentic spiritual resonance.
                    </p>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-saffron-50 border border-saffron-100">
                    <h4 className="text-xl font-bold text-saffron-900 mb-4">Divine Materials</h4>
                    <p className="text-sm text-saffron-800 leading-relaxed">
                      We use only the purest materials, from sacred woods to high-grade brass, ensuring your rituals are performed with the highest quality essentials.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="max-w-7xl mx-auto space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16">
                  {/* Reviews List */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-playfair font-bold text-puja-text">Community Feedback</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-saffron-600 bg-saffron-50 px-4 py-1.5 rounded-full">
                        {product.reviews.length} Experiences
                      </span>
                    </div>
                    
                    {product.reviews.length === 0 ? (
                      <div className="bg-gray-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-200">
                        <Send className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-puja-muted">No reviews yet</h4>
                        <p className="text-sm text-puja-muted italic">Be the first to share your spiritual experience!</p>
                      </div>
                    ) : (
                      product.reviews.map((rev: any) => (
                        <div key={rev.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4 items-center">
                              <div className="w-12 h-12 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600 font-black">
                                {rev.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-puja-text">{rev.user.name}</span>
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                </div>
                                <div className="flex items-center gap-1 text-gold-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-puja-muted font-black uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-puja-text italic leading-relaxed text-lg font-playfair">"{rev.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Review Form */}
                  <div className="bg-[#2d4a2d] p-10 rounded-[3rem] text-white shadow-2xl h-fit sticky top-24">
                    <h3 className="text-2xl font-playfair font-bold mb-3">Share Your Experience</h3>
                    <p className="text-sm text-white/60 mb-8 italic">Help other devotees find their perfect spiritual companion.</p>
                    
                    {!isAuthenticated ? (
                      <div className="bg-white/10 p-8 rounded-3xl text-center border border-white/10">
                        <p className="font-bold mb-4 uppercase tracking-widest text-xs">Awaiting Your Presence</p>
                        <Link to="/login" className="block bg-saffron-500 text-white py-4 rounded-xl font-bold mb-4 hover:bg-saffron-600 transition-all">Sign In to Review</Link>
                        <p className="text-[10px] text-white/40 uppercase font-black">Verified Buyer Reviews Only</p>
                      </div>
                    ) : (
                      <form className="space-y-6" onSubmit={handleSubmitReview}>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Celestial Rating</label>
                          <div className="flex gap-3">
                            {[1,2,3,4,5].map((star) => (
                              <button 
                                key={star}
                                type="button"
                                onClick={() => setReviewForm({...reviewForm, rating: star})}
                                className={`p-1 transition-all transform hover:scale-110 ${reviewForm.rating >= star ? "text-saffron-400" : "text-white/20"}`}
                              >
                                <Star className={`h-8 w-8 ${reviewForm.rating >= star ? "fill-current" : ""}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Detailed Feedback</label>
                          <textarea 
                            rows={4}
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                            required
                            placeholder="Share your spiritual journey with this item..."
                            className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/10 focus:outline-none focus:ring-4 focus:ring-saffron-400/20 transition-all text-sm placeholder:text-white/30"
                          />
                        </div>
                        
                        {reviewError && (
                          <div className="bg-red-500/20 text-red-200 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/30 text-center">
                            {reviewError}
                          </div>
                        )}
                        
                        <button 
                          type="submit"
                          disabled={submittingReview || reviewSuccess}
                          className="w-full bg-white text-[#2d4a2d] py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-saffron-400 hover:text-white transition-all disabled:opacity-50 shadow-xl"
                        >
                          {submittingReview ? "Submitting..." : reviewSuccess ? "Submitted!" : "Post Experience"}
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-gray-50 p-12 rounded-[3rem] border border-gray-100">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">Product Essence</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">SKU Code</span>
                        <span className="text-sm font-black text-puja-text">{product.sku}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Category</span>
                        <span className="text-sm font-black text-puja-text">{product.category?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Subcategory</span>
                        <span className="text-sm font-black text-puja-text">{product.subcategory || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Unit</span>
                        <span className="text-sm font-black text-puja-text">{product.unit || "Piece"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">Physical Attributes</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Material</span>
                        <span className="text-sm font-black text-puja-text">{product.material || "Traditional Mix"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Weight</span>
                        <span className="text-sm font-black text-puja-text">{product.weight || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Dimensions</span>
                        <span className="text-sm font-black text-puja-text">{product.dimensions || "N/A"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-200/50">
                        <span className="text-sm font-bold text-puja-muted">Min Order Qty</span>
                        <span className="text-sm font-black text-puja-text">{product.minOrderQty || 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Festivals & Deities */}
                  {(product.festival?.length > 0 || product.deity?.length > 0) && (
                    <div className="md:col-span-2 pt-8 space-y-4">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-saffron-600">Religious Significance</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {product.festival?.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-puja-muted block mb-3">Associated Festivals</span>
                            <div className="flex flex-wrap gap-2">
                              {product.festival.map((f: string) => (
                                <span key={f} className="bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-saffron-100">{f}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.deity?.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-puja-muted block mb-3">Associated Deities</span>
                            <div className="flex flex-wrap gap-2">
                              {product.deity.map((d: string) => (
                                <span key={d} className="bg-puja-text text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{d}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-gray-50 pt-16">
          <ProductCarousel title="Related Products" subtitle="You might also like these spiritual items" />
        </div>
      </div>
    </div>
  );
}


