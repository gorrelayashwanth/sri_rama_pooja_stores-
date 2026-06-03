import { ArrowLeft, Clock, Heart, Package, ShieldCheck, Star, Truck, CheckCircle2, Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import { io } from "socket.io-client";
import placeholderImage from "../../assets/pooja-placeholder.svg";

const socketUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:5000";

declare const L: any; // Leaflet global

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<string>("PLACED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // States for reviews per product
  const [submittedReviews, setSubmittedReviews] = useState<Record<string, boolean>>({});
  const [reviewForms, setReviewForms] = useState<Record<string, { rating: number; comment: string; error: string; success: boolean }>>({});

  const mapRef = useRef<any>(null);
  const mapInitRef = useRef<boolean>(false);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data.success) {
        const orderData = response.data.data;
        setOrder(orderData);
        setOrderStatus(orderData.status);
        
        // Initialize review form state for each item
        const initialForms: any = {};
        orderData.items.forEach((item: any) => {
          initialForms[item.product.id] = {
            rating: 5,
            comment: "",
            error: "",
            success: false
          };
        });
        setReviewForms(initialForms);
      }
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("Could not retrieve tracking details for this order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchOrderDetails();
    fetchSettings();
  }, [orderId]);

  // Connect Socket.io to receive real-time order status updates
  useEffect(() => {
    const socket = io(socketUrl, { withCredentials: true });

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("order_status_updated", (data: { id: string; status: string }) => {
      if (data.id === orderId) {
        setOrderStatus(data.status);
        // Play soft chime
        try {
          const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav");
          chime.volume = 0.4;
          chime.play();
        } catch (e) {
          console.error("Chime play error:", e);
        }
        fetchOrderDetails();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  // Initialize Leaflet Map once order and settings are loaded
  useEffect(() => {
    if (!order || !settings || mapInitRef.current) return;

    const storeLat = settings.storeLatitude ?? 16.5186;
    const storeLng = settings.storeLongitude ?? 80.6200;
    const customerLat = order.latitude;
    const customerLng = order.longitude;

    const mapElement = document.getElementById("tracking-map");
    if (!mapElement) return;

    try {
      mapInitRef.current = true;
      const map = L.map("tracking-map", { zoomControl: true }).setView([storeLat, storeLng], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Store Marker Icon
      const storeIcon = L.divIcon({
        html: '<div style="background-color: #2d4a2d; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 4px 6px rgba(0,0,0,0.25);">S</div>',
        className: 'custom-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([storeLat, storeLng], { icon: storeIcon })
        .addTo(map)
        .bindPopup("<b>Sri Rama Pooja Store</b><br>Store Hub")
        .openPopup();

      if (customerLat != null && customerLng != null) {
        // Customer Marker Icon
        const customerIcon = L.divIcon({
          html: '<div style="background-color: #f97316; color: white; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 4px 6px rgba(0,0,0,0.255);">C</div>',
          className: 'custom-leaflet-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        L.marker([customerLat, customerLng], { icon: customerIcon })
          .addTo(map)
          .bindPopup("<b>Your Location</b><br>Delivery Point");

        // Draw polyline route
        const routePoints = [
          [storeLat, storeLng],
          [customerLat, customerLng]
        ];
        L.polyline(routePoints, {
          color: "#2d4a2d",
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 8"
        }).addTo(map);

        // Adjust view to fit both locations
        map.fitBounds(routePoints, { padding: [50, 50] });
      }
    } catch (err) {
      console.error("Leaflet initialization failed", err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        mapInitRef.current = false;
      }
    };
  }, [order, settings]);

  const handleReviewSubmit = async (productId: string) => {
    const form = reviewForms[productId];
    if (!form || !form.comment) return;

    setReviewForms(prev => ({
      ...prev,
      [productId]: { ...prev[productId], error: "", success: false }
    }));

    try {
      await api.post("/reviews", {
        rating: form.rating,
        comment: form.comment,
        productId
      });
      setSubmittedReviews(prev => ({ ...prev, [productId]: true }));
      setReviewForms(prev => ({
        ...prev,
        [productId]: { ...prev[productId], success: true, comment: "" }
      }));
    } catch (err: any) {
      setReviewForms(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          error: err.response?.data?.message || "Failed to submit review."
        }
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2d4a2d] border-t-transparent rounded-full animate-spin" />
          <p className="italic text-puja-muted animate-pulse">Accessing celestial records...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
        <h2 className="text-2xl font-playfair font-bold text-red-500 text-center px-4">{error || "Order not found"}</h2>
        <Link to="/account/orders" className="bg-[#2d4a2d] text-white px-8 py-3 rounded-xl font-bold">Back to My Orders</Link>
      </div>
    );
  }

  // Determine active steps in pipeline
  const getStepStatus = (stepName: string) => {
    const statusSequence = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIndex = statusSequence.indexOf(orderStatus);
    const targetIndex = statusSequence.indexOf(stepName);
    
    if (currentIndex >= targetIndex) {
      return "COMPLETED";
    }
    return "PENDING";
  };

  return (
    <div className="bg-[#fcf9f5] min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link to="/account" className="flex items-center gap-2 text-xs font-bold text-puja-text hover:text-saffron-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Account
          </Link>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-wider">
            <span className={`h-2.5 w-2.5 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
            {socketConnected ? 'Live Connection' : 'Polling Status'}
          </div>
        </div>

        {/* Status Milestones Bar */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-saffron-500">Order tracking</span>
              <h2 className="text-2xl font-playfair font-black text-puja-text mt-1">Status Pipeline</h2>
            </div>
            <span className="text-xs bg-[#2d4a2d] text-white px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
              {orderStatus}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 relative mt-8">
            {/* Connector lines */}
            <div className="absolute top-5 left-[12%] right-[12%] h-1 bg-gray-100 -z-0" />
            <div 
              className="absolute top-5 left-[12%] h-1 bg-[#2d4a2d] transition-all duration-700 -z-0" 
              style={{
                width: 
                  orderStatus === "PLACED" ? "0%" : 
                  orderStatus === "PROCESSING" ? "33%" : 
                  orderStatus === "SHIPPED" ? "66%" : "76%"
              }}
            />

            {/* Placed step */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all ${
                getStepStatus("PLACED") === "COMPLETED" ? "bg-[#2d4a2d] border-[#2d4a2d] text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                <Package className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider mt-3 block text-puja-text">Confirmed</span>
            </div>

            {/* Processing step */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all ${
                getStepStatus("PROCESSING") === "COMPLETED" ? "bg-[#2d4a2d] border-[#2d4a2d] text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider mt-3 block text-puja-text">Preparing</span>
            </div>

            {/* Shipped step */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all ${
                getStepStatus("SHIPPED") === "COMPLETED" ? "bg-[#2d4a2d] border-[#2d4a2d] text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider mt-3 block text-puja-text">On the Way</span>
            </div>

            {/* Delivered step */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 transition-all ${
                getStepStatus("DELIVERED") === "COMPLETED" ? "bg-[#2d4a2d] border-[#2d4a2d] text-white" : "bg-white border-gray-200 text-gray-400"
              }`}>
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider mt-3 block text-puja-text">Delivered</span>
            </div>
          </div>
        </div>

        {/* Interactive OpenStreetMap Map */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-saffron-500">Live routing map</span>
              <h3 className="text-lg font-bold text-puja-text font-playfair">Delivery Route</h3>
            </div>
            {order.latitude != null && order.longitude != null ? (
              <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-bold">
                GPS Path Rendered
              </span>
            ) : (
              <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full font-bold">
                Default Store Location
              </span>
            )}
          </div>
          
          <div id="tracking-map" className="h-[350px] w-full bg-gray-50 relative z-10" />
        </div>

        {/* Order Details & Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-8">
          
          {/* Order Details */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-playfair text-puja-text border-b border-gray-50 pb-3">Package Contents</h3>
            
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img 
                      src={item.product?.images?.[0]?.url || placeholderImage} 
                      alt={item.product?.name || "Product"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-puja-text text-sm truncate">{item.product?.name}</h4>
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
                    <span className="text-sm font-black text-puja-text">₹{item.price * item.quantity}</span>
                    <span className="text-[10px] text-gray-400">₹{item.price} each</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-gray-400 font-bold block mb-1">Customer Address</span>
                <p className="font-bold text-puja-text">{order.address?.line1}</p>
                <p className="text-puja-muted">{order.address?.city} - {order.address?.pincode}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold block mb-1">Delivery Instructions / GPS status</span>
                {order.latitude != null && order.longitude != null ? (
                  <p className="text-green-600 font-bold">✓ Satellite pin confirmed ({order.latitude.toFixed(4)}, {order.longitude.toFixed(4)})</p>
                ) : (
                  <p className="text-amber-600 font-medium">Using fallback manual delivery address routing</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-playfair text-puja-text border-b border-gray-50 pb-3 mb-4">Summary</h3>
              
              <div className="space-y-3.5 text-xs text-puja-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-puja-text">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-puja-text">₹{order.shippingFee}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-saffron-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-bold text-puja-text">Amount Payable</span>
                  <span className="text-2xl font-black text-[#2d4a2d]">₹{order.payableAmount}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 text-[10px] uppercase font-black tracking-wider text-puja-muted text-center flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>Paid via Cash on Delivery</span>
              <span className="text-[8px] text-gray-400">Order ID: #{order.orderNumber}</span>
            </div>
          </div>
        </div>

        {/* Rating & Review Section (Prompt on status DELIVERED) */}
        {orderStatus === "DELIVERED" && (
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-green-100 shadow-xl shadow-green-50/50 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2d4a2d]">Devotional Experience</span>
              <h3 className="text-2xl font-playfair font-black text-puja-text mt-1">Review Your Items</h3>
              <p className="text-xs text-puja-muted mt-1 leading-relaxed">Your order was successfully delivered! Please share your spiritual feedback for the items purchased to help others.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item: any) => {
                const prodId = item.product?.id;
                const isSubmitted = submittedReviews[prodId];
                const form = reviewForms[prodId] || { rating: 5, comment: "", error: "", success: false };

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={item.product?.images?.[0]?.url || placeholderImage} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-3 min-w-0">
                      <h4 className="font-bold text-puja-text text-sm">{item.product?.name}</h4>
                      
                      {isSubmitted || form.success ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 w-fit">
                          <CheckCircle2 className="h-4 w-4" /> Thank you! Your spiritual review has been received.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  setReviewForms(prev => ({
                                    ...prev,
                                    [prodId]: { ...prev[prodId], rating: star }
                                  }));
                                }}
                                className={`transition-all transform hover:scale-110 ${form.rating >= star ? 'text-saffron-500' : 'text-gray-200'}`}
                              >
                                <Star className={`h-6 w-6 ${form.rating >= star ? 'fill-current' : ''}`} />
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              value={form.comment}
                              onChange={(e) => {
                                setReviewForms(prev => ({
                                  ...prev,
                                  [prodId]: { ...prev[prodId], comment: e.target.value }
                                }));
                              }}
                              placeholder="Write a brief comment about this product's purity and details..."
                              className="flex-grow px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-saffron-100 focus:bg-white transition-all text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleReviewSubmit(prodId)}
                              disabled={!form.comment.trim()}
                              className="bg-[#2d4a2d] hover:bg-black text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              Submit <Send className="h-3 w-3" />
                            </button>
                          </div>

                          {form.error && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{form.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
