import { ChevronRight, CreditCard, MapPin, Package, Percent, ShoppingBag, Truck, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: user?.phone || "",
    paymentMethod: "COD"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = totalPrice();
  const shipping = subtotal > 1000 ? 0 : 99;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + shipping - discount;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        orderValue: subtotal
      });
      setAppliedCoupon(response.data.data);
      setCouponError("");
    } catch (err: any) {
      setCouponError(err.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.salePrice || item.price
        })),
        totalAmount: total,
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone,
        couponCode: appliedCoupon?.code,
        paymentMethod: formData.paymentMethod
      };
      
      const response = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${response.data.data.id}`);
    } catch (error: unknown) {
      console.error("Order failed", error);
      const msg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response: { data: { message: string } } }).response.data.message
          : "Failed to place order. Please try again.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-saffron-50 p-10 rounded-full mb-8 shadow-inner">
          <Lock className="h-16 w-16 text-saffron-500" />
        </div>
        <h2 className="text-4xl font-playfair font-black text-puja-text mb-4 tracking-tight">Sacred Sign-in Required</h2>
        <p className="text-puja-muted mb-10 max-w-md mx-auto">Please create an account or sign in to save your details securely and place an order.</p>
        <Link to="/login" className="bg-[#2d4a2d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-green-100">
          Login / Register
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-saffron-50 p-10 rounded-full mb-8 shadow-inner">
          <ShoppingBag className="h-16 w-16 text-saffron-500" />
        </div>
        <h2 className="text-4xl font-playfair font-black text-puja-text mb-4 tracking-tight">Your divine cart is empty</h2>
        <p className="text-puja-muted mb-10 max-w-md mx-auto">Add sacred items to your cart to begin your spiritual journey with us.</p>
        <Link to="/collections" className="bg-[#2d4a2d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-green-100">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-puja-muted mb-10">
          <Link to="/cart" className="hover:text-saffron-600 transition-colors">Shopping Cart</Link>
          <ChevronRight className="h-3 w-3 text-saffron-300" />
          <span className="text-saffron-600">Checkout Process</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-puja-text tracking-tight mb-2">Checkout</h1>
          <p className="text-sm text-puja-muted font-medium">Complete your order to bring home the divine blessings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          {/* Left: Checkout Form */}
          <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Delivery Address Card */}
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
              <div className="flex items-center gap-5 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center border border-saffron-100/50">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-black text-puja-text">Delivery Address</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-saffron-500 mt-1">Shipping Destination</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-puja-muted px-1">Full Delivery Address *</label>
                  <input 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="House No, Street Name, Area / Landmark"
                    className="w-full px-6 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all text-sm font-medium shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-puja-muted px-1">City *</label>
                  <input 
                    required
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="e.g. Vijayawada"
                    className="w-full px-6 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all text-sm font-medium shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-puja-muted px-1">Pincode *</label>
                  <input 
                    required
                    value={formData.pincode}
                    onChange={e => setFormData({...formData, pincode: e.target.value})}
                    placeholder="6-digit code"
                    className="w-full px-6 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all text-sm font-medium shadow-inner"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-puja-muted px-1">Contact Phone *</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="10-digit mobile number"
                    className="w-full px-6 py-5 rounded-[1.5rem] border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all text-sm font-medium shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
              <div className="flex items-center gap-5 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-maroon-50 text-maroon-600 flex items-center justify-center border border-maroon-100/50">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-playfair font-black text-puja-text">Payment Method</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-saffron-500 mt-1">Choose How You Pay</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                  className={`p-8 rounded-[2.5rem] border-2 text-left transition-all relative group ${formData.paymentMethod === 'COD' ? 'border-saffron-500 bg-saffron-50/30' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}
                >
                  <div className={`absolute top-6 right-6 h-6 w-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'COD' ? 'border-saffron-500 bg-saffron-500' : 'border-gray-200'}`}>
                    {formData.paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <span className="block text-lg font-black text-puja-text mb-2 font-playfair">Cash on Delivery</span>
                  <span className="text-[11px] font-medium text-puja-muted leading-relaxed">Pay with cash when your sacred items are delivered to your doorstep.</span>
                </button>
                
                <button 
                  type="button"
                  disabled
                  className="p-8 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/10 text-left opacity-60 cursor-not-allowed grayscale"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="block text-lg font-black text-gray-400 font-playfair">Online Payment</span>
                    <span className="bg-saffron-100 text-saffron-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Upcoming</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 leading-relaxed">Cards, UPI, and Netbanking will be available soon for a faster experience.</span>
                </button>
              </div>
            </div>
          </form>

          {/* Right: Order Summary Card */}
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(45,74,45,0.12)] border border-gray-100/80 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-50/50 rounded-bl-full -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-playfair font-black text-puja-text">Order Summary</h2>
                  <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </div>
                </div>
                
                <div className="space-y-5 mb-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-5 group">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 p-2 border border-gray-100 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-bold text-puja-text truncate">{item.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-puja-muted mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-saffron-600 mt-1">₹{(item.salePrice || item.price) * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100 mb-10">
                  <div className="flex justify-between text-sm font-medium text-puja-muted">
                    <span>Subtotal</span>
                    <span className="text-puja-text font-bold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-puja-muted">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-saffron-500" />
                      <span>Shipping Fee</span>
                    </div>
                    <span className={shipping === 0 ? "text-green-600 font-black uppercase text-xs" : "text-puja-text font-bold"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-saffron-600 font-black uppercase tracking-widest">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-puja-muted mb-1">Payable Amount</p>
                      <span className="text-3xl font-black text-[#2d4a2d] font-playfair">₹{total}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <ShieldCheck className="h-3 w-3" />
                        Secure
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="space-y-4 mb-10">
                  <div className="relative group">
                    <Percent className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                    <input 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all placeholder:text-gray-300 shadow-inner"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponCode}
                      className="absolute right-3 top-2 bottom-2 bg-saffron-500 hover:bg-black text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {isValidating ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-bold px-4 uppercase tracking-widest">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-green-50/50 px-5 py-3 rounded-2xl border border-green-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-700">{appliedCoupon.code} SAVED!</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[10px] font-black uppercase tracking-widest text-puja-muted hover:text-red-500">Remove</button>
                    </div>
                  )}
                </div>

                <button 
                  form="checkout-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2d4a2d] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all hover:bg-black hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-green-100/50 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Place Your Order"}
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-puja-muted">
                    <Lock className="h-3 w-3" /> SSL Secure
                  </div>
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="text-[9px] font-black uppercase tracking-widest text-puja-muted">Verified Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}