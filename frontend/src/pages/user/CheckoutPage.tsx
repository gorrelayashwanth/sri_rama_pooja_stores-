import { ChevronRight, CreditCard, MapPin, Package, Percent, ShoppingBag, Truck, Lock, ShieldCheck, ArrowRight, Loader2, Navigation, AlertCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";

// Haversine formula to compute distance in km between two sets of coordinates
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

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
  
  const [settings, setSettings] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Address & Location, 2: Review Screen
  const [gpsCoordinates, setGpsCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsError, setGpsError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState(99);
  const [geofenced, setGeofenced] = useState(true); // restricted to Vijayawada
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = totalPrice();
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + shippingFee - discount;

  // Scroll to top on mount and fetch settings
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  // Update geofencing status and shipping fee calculation dynamically
  useEffect(() => {
    if (!settings) return;
    const storeLat = settings.storeLatitude ?? 16.5186;
    const storeLng = settings.storeLongitude ?? 80.6200;
    const radius = settings.deliveryRadiusKm ?? 15;
    const rate = settings.deliveryRatePerKm ?? 10;

    if (gpsCoordinates) {
      const dist = getDistanceKm(storeLat, storeLng, gpsCoordinates.latitude, gpsCoordinates.longitude);
      if (dist > radius) {
        setGeofenced(false);
      } else {
        setGeofenced(true);
        if (subtotal > 1000) {
          setShippingFee(0);
        } else {
          setShippingFee(Math.max(30, Math.round(dist * rate)));
        }
      }
    } else {
      // Fallback validation based on city and pincode text input
      const cityLower = formData.city.toLowerCase().trim();
      const pincodeClean = formData.pincode.replace(/\s+/g, '');
      const isVijayawada = cityLower.includes("vijayawada") || cityLower.includes("wada");
      const isVijayawadaPincode = pincodeClean.startsWith("520") || pincodeClean.startsWith("521");

      if (formData.city && formData.pincode) {
        if (!isVijayawada && !isVijayawadaPincode) {
          setGeofenced(false);
        } else {
          setGeofenced(true);
          setShippingFee(subtotal > 1000 ? 0 : 99);
        }
      } else {
        setGeofenced(true);
        setShippingFee(subtotal > 1000 ? 0 : 99);
      }
    }
  }, [gpsCoordinates, settings, formData.city, formData.pincode, subtotal]);

  const detectGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setGpsCoordinates(coords);
        setGpsLoading(false);
        
        // Auto fill city as Vijayawada on successful location detection (since Vijayawada is our only zone)
        if (!formData.city) {
          setFormData(prev => ({ ...prev, city: "Vijayawada" }));
        }
      },
      (error) => {
        console.error("GPS detection error", error);
        setGpsError("Unable to acquire location details. Please fill in your address, city, and pincode manually.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

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

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.pincode || !formData.phone) {
      alert("Please fill in all shipping details.");
      return;
    }
    if (!geofenced) {
      alert("Delivery is currently available only in and around Vijayawada.");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.salePrice || item.price,
          selectedTier: item.selectedTier || null
        })),
        address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
        phone: formData.phone,
        couponCode: appliedCoupon?.code,
        paymentMethod: formData.paymentMethod,
        latitude: gpsCoordinates?.latitude || null,
        longitude: gpsCoordinates?.longitude || null
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
    <div className="bg-[#fcf9f5] min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-puja-muted">
            <Link to="/cart" className="hover:text-saffron-600 transition-colors">Shopping Cart</Link>
            <ChevronRight className="h-3 w-3 text-saffron-300" />
            <span className="text-saffron-600">Checkout Process</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#2d4a2d] text-white' : 'bg-gray-200 text-gray-400'}`}>1</span>
              <span className={step === 1 ? 'text-puja-text' : 'text-gray-400'}>Address & Location</span>
            </div>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <div className="flex items-center gap-1.5">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#2d4a2d] text-white' : 'bg-gray-200 text-gray-400'}`}>2</span>
              <span className={step === 2 ? 'text-puja-text' : 'text-gray-400'}>Review & Pay</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-playfair font-black text-puja-text tracking-tight mb-2">
            {step === 1 ? "Shipping & GPS Details" : "Review & Place Order"}
          </h1>
          <p className="text-sm text-puja-muted font-medium">
            {step === 1 ? "Verify your GPS location and delivery address to calculate charges." : "Confirm your items, delivery details, and price breakdown."}
          </p>
        </div>

        {!geofenced && (
          <div className="mb-8 p-5 rounded-[2rem] bg-red-50 border border-red-100 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-950">Outside Serviceable Area</h4>
              <p className="text-xs text-red-700 mt-1">Delivery is currently restricted to the Vijayawada municipal bounds. Please verify your address or use GPS detection near Vijayawada.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          
          {/* Left Column: Form Steps */}
          <div className="space-y-8">
            
            {step === 1 ? (
              <form id="checkout-form-step1" onSubmit={handleProceedToReview} className="space-y-8">
                {/* Geolocation Capture Panel */}
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center border border-green-100">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-puja-text font-playfair">GPS Location Capture</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Verification & Accurate Route Navigation</p>
                      </div>
                    </div>

                    {gpsCoordinates && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                        Captured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-puja-muted leading-relaxed mb-6">
                    Tapping the button below locks your GPS coordinates for real-time tracking, stores the coordinates on the order, and computes an accurate, distance-based delivery fare.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <button
                      type="button"
                      onClick={detectGpsLocation}
                      disabled={gpsLoading}
                      className="bg-[#2d4a2d] hover:bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 min-h-[48px]"
                    >
                      {gpsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Pinning Satellite...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          Detect GPS Location
                        </>
                      )}
                    </button>

                    {gpsCoordinates ? (
                      <div className="text-xs font-bold text-puja-text bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1">
                        Coordinates: {gpsCoordinates.latitude.toFixed(5)}, {gpsCoordinates.longitude.toFixed(5)}
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-amber-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 flex-1">
                        GPS coordinate not pinned yet. Default Vijayawada flat rate applies if city/pincode checks pass.
                      </div>
                    )}
                  </div>

                  {gpsError && (
                    <p className="text-[10px] text-red-500 font-bold mt-3 uppercase tracking-wider">{gpsError}</p>
                  )}
                </div>

                {/* Delivery Address Details */}
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center border border-saffron-100">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-puja-text font-playfair">Delivery Address</h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-saffron-500">Shipping Details</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-puja-muted block pl-1">Full Delivery Address *</label>
                      <input 
                        required
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Flat/House No, Building, Road Name, Area"
                        className="w-full px-5 py-4 rounded-[1.25rem] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all text-sm font-medium bg-gray-50/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-puja-muted block pl-1">City / Town *</label>
                      <input 
                        required
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        placeholder="e.g. Vijayawada"
                        className="w-full px-5 py-4 rounded-[1.25rem] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all text-sm font-medium bg-gray-50/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-puja-muted block pl-1">Pincode *</label>
                      <input 
                        required
                        value={formData.pincode}
                        onChange={e => setFormData({...formData, pincode: e.target.value})}
                        placeholder="6-digit code (e.g. 520001)"
                        className="w-full px-5 py-4 rounded-[1.25rem] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all text-sm font-medium bg-gray-50/30"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-puja-muted block pl-1">Contact Phone *</label>
                      <input 
                        required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="w-full px-5 py-4 rounded-[1.25rem] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all text-sm font-medium bg-gray-50/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-maroon-50 text-maroon-600 flex items-center justify-center border border-maroon-100">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-puja-text font-playfair">Payment Method</h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-saffron-500">COD available</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                      className="p-6 rounded-[2rem] border-2 text-left transition-all relative border-saffron-500 bg-saffron-50/20 active:scale-95"
                    >
                      <div className="absolute top-5 right-5 h-5 w-5 rounded-full border-2 flex items-center justify-center border-saffron-500 bg-saffron-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                      <span className="block text-base font-bold text-puja-text mb-1 font-playfair">Cash on Delivery</span>
                      <span className="text-[10px] font-medium text-puja-muted leading-relaxed">Pay with cash when items are delivered.</span>
                    </button>
                    
                    <button 
                      type="button"
                      disabled
                      className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 text-left opacity-60 cursor-not-allowed flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="block text-base font-bold text-gray-400 font-playfair">Online Payment</span>
                        <span className="bg-saffron-100 text-saffron-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Soon</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 leading-relaxed mt-2">Card, Netbanking, UPI channels release soon.</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!geofenced}
                    className="w-full sm:w-auto bg-[#2d4a2d] text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                  >
                    Proceed to Review
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Review Screen Layout
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80 space-y-6">
                  <h3 className="text-xl font-bold text-puja-text font-playfair pb-3 border-b border-gray-100">Review Shipping Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Delivery Address</span>
                      <p className="font-bold text-puja-text">{formData.address}</p>
                      <p className="text-xs text-puja-muted">{formData.city} - {formData.pincode}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Contact Phone</span>
                      <p className="font-bold text-puja-text">{formData.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Satellite Coordinates</span>
                      {gpsCoordinates ? (
                        <p className="font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-xl w-fit">
                          {gpsCoordinates.latitude.toFixed(5)}, {gpsCoordinates.longitude.toFixed(5)}
                        </p>
                      ) : (
                        <p className="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl w-fit">
                          Not Captured (Pincode Verified)
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Payment Method</span>
                      <p className="font-bold text-puja-text">Cash on Delivery (COD)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80 space-y-6">
                  <h3 className="text-xl font-bold text-puja-text font-playfair pb-3 border-b border-gray-100">Review Shopping Bag</h3>
                  
                  <div className="divide-y divide-gray-100">
                    {items.map(item => (
                      <div key={item.cartId} className="flex gap-5 py-4 first:pt-0 last:pb-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-sm font-bold text-puja-text truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.selectedTier && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                                {item.selectedTier}
                              </span>
                            )}
                            <span className="text-xs text-puja-muted font-bold">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <p className="text-sm font-black text-puja-text">₹{(item.salePrice || item.price) * item.quantity}</p>
                          <p className="text-[10px] text-gray-400">₹{item.salePrice || item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto bg-white border border-gray-200 text-puja-text px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Address
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full flex-1 bg-[#2d4a2d] hover:bg-black text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order summary calculations */}
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(45,74,45,0.12)] border border-gray-100/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-50/50 rounded-bl-full -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-playfair font-black text-puja-text">Bag Summary</h2>
                  <div className="bg-green-50 text-green-600 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                    <Package className="h-3 w-3" />
                    {items.length} Items
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100 mb-8">
                  <div className="flex justify-between text-sm font-medium text-puja-muted">
                    <span>Cart Subtotal</span>
                    <span className="text-puja-text font-bold">₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-medium text-puja-muted">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-saffron-500" />
                      <span>Shipping Charge</span>
                    </div>
                    <span className={shippingFee === 0 ? "text-green-600 font-black uppercase text-xs" : "text-puja-text font-bold"}>
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-saffron-600 font-black uppercase tracking-widest">
                      <span>Applied Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-puja-muted mb-1">Payable Total</p>
                      <span className="text-3xl font-black text-[#2d4a2d] font-playfair">₹{total}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Secure Checkout
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Panel */}
                <div className="space-y-4 mb-8">
                  <div className="relative group">
                    <Percent className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
                    <input 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all placeholder:text-gray-300 shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponCode}
                      className="absolute right-3 top-1.5 bottom-1.5 bg-saffron-500 hover:bg-black text-white px-5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {isValidating ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-bold px-4 uppercase tracking-widest">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-green-50/50 px-4 py-2.5 rounded-2xl border border-green-100">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-700">{appliedCoupon.code} SAVED!</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[9px] font-black uppercase tracking-widest text-puja-muted hover:text-red-500">Remove</button>
                    </div>
                  )}
                </div>

                {/* Prompt navigation buttons on the side card too */}
                {step === 1 ? (
                  <button 
                    onClick={handleProceedToReview}
                    disabled={!geofenced}
                    className="w-full bg-[#2d4a2d] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-black hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                  >
                    Proceed to Review
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#2d4a2d] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-black hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                )}
                
                <div className="flex items-center justify-center gap-4 mt-6 border-t border-gray-100 pt-6">
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