import { CheckCircle2, Clock, Star, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import placeholderImage from "../../assets/pooja-placeholder.svg";

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review states per item
  const [reviewingItemId, setReviewingItemId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

  const fetchOrderDetail = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data?.success) {
        setOrder(response.data.data);
      } else {
        setError("Failed to locate your sacred order details.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred fetching order tracking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
    // Poll status updates every 20 seconds
    const interval = setInterval(fetchOrderDetail, 20000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleReviewSubmit = async (productId: string) => {
    setReviewSubmitting(true);
    setReviewSuccessMessage("");
    try {
      await api.post('/reviews', {
        productId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewSuccessMessage("Thank you for sharing your divine experience!");
      setReviewingItemId(null);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2d4a2d] border-t-transparent rounded-full animate-spin" />
          <p className="italic text-[#2d4a2d] animate-pulse">Locating your sacred delivery...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#fcf9f5]">
        <div className="bg-red-50 p-8 rounded-full mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-playfair font-black text-puja-text mb-4">Tracking Information Unavailable</h2>
        <p className="text-puja-muted mb-8 max-w-md">{error || "The requested order tracking reference could not be found."}</p>
        <Link to="/" className="bg-[#2d4a2d] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  const { status, latitude, longitude, address, orderNumber, createdAt, items, payableAmount, shippingFee, discountAmount, totalAmount } = order;

  // Status index mappings
  const statuses = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStatusIdx = statuses.indexOf(status);

  const steps = [
    { label: "Order Placed", desc: "Received and acknowledged", code: "PLACED" },
    { label: "Preparing", desc: "Items gathered and purified", code: "PREPARING" },
    { label: "Out for Delivery", desc: "Courier dispatched", code: "OUT_FOR_DELIVERY" },
    { label: "Delivered", desc: "Blessed package arrived", code: "DELIVERED" }
  ];

  // Map Iframe coordinates query
  const mapQuery = latitude && longitude
    ? `${latitude},${longitude}`
    : encodeURIComponent(`${address.line1}, ${address.city} - ${address.pincode}`);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  return (
    <div className="bg-[#fcf9f5] min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9a3412] bg-[#fcf9f5] border border-[#f3ebe1] px-4 py-1.5 rounded-full">
            Real-time Order Tracker
          </span>
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-puja-text tracking-tight mt-4">
            Track Order #{orderNumber}
          </h1>
          <p className="text-sm text-puja-muted font-medium mt-2">
            Placed on {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* Left Panel: Status Timeline & Items */}
          <div className="space-y-8">
            {/* Timeline Card */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
              <h2 className="text-2xl font-playfair font-black text-puja-text mb-8">Delivery Progress</h2>
              
              <div className="relative pl-8 md:pl-10 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {steps.map((step, idx) => {
                  const isCompleted = idx < currentStatusIdx || status === "DELIVERED";
                  const isCurrent = status === step.code;
                  
                  return (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-8 md:-left-10 top-1 -translate-x-1/2 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? "border-green-600 bg-green-600 text-white" 
                          : isCurrent
                            ? "border-[#2d4a2d] bg-white text-[#2d4a2d] shadow-lg shadow-green-100 animate-pulse"
                            : "border-gray-200 bg-white text-gray-300"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>

                      <div>
                        <h3 className={`text-lg font-black ${isCompleted || isCurrent ? "text-puja-text" : "text-gray-400"}`}>
                          {step.label}
                        </h3>
                        <p className={`text-xs mt-1 ${isCurrent ? "text-[#9a3412] font-semibold" : "text-puja-muted"}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary & Reviews */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80">
              <h2 className="text-2xl font-playfair font-black text-puja-text mb-6">Sacred Items Ordered</h2>
              
              {reviewSuccessMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs font-black uppercase tracking-wider mb-6 text-center">
                  🎉 {reviewSuccessMessage}
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {items.map((item: any) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 p-1 border border-gray-100 shrink-0 overflow-hidden">
                        <img src={item.product?.images?.[0]?.url || placeholderImage} alt={item.product?.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-puja-text">{item.product?.name}</span>
                          {item.selectedTier && (
                            <span className="text-[9px] bg-saffron-50 text-saffron-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                              {item.selectedTier}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-puja-muted mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="text-sm font-black text-saffron-600 shrink-0">₹{item.total}</span>
                    </div>

                    {/* Review option for Delivered items */}
                    {status === "DELIVERED" && (
                      <div className="mt-4 pl-22">
                        {reviewingItemId !== item.id ? (
                          <button
                            onClick={() => {
                              setReviewingItemId(item.id);
                              setReviewForm({ rating: 5, comment: "" });
                            }}
                            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#2d4a2d] hover:text-[#9a3412]"
                          >
                            <Star className="h-3.5 w-3.5 fill-[#2d4a2d] text-[#2d4a2d]" /> Share Spiritual Experience
                          </button>
                        ) : (
                          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mt-2 space-y-4 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-puja-muted">Rating</span>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    className={`p-0.5 transition-transform hover:scale-110 ${reviewForm.rating >= star ? "text-saffron-500" : "text-gray-300"}`}
                                  >
                                    <Star className={`h-5 w-5 ${reviewForm.rating >= star ? "fill-current" : ""}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              rows={2}
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                              placeholder="Write a feedback about the purity & packaging..."
                              className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-saffron-500"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setReviewingItemId(null)}
                                className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 py-1.5 bg-white border border-gray-200 rounded-lg"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReviewSubmit(item.productId)}
                                disabled={reviewSubmitting}
                                className="text-[10px] font-black uppercase tracking-widest text-white px-4 py-1.5 bg-[#2d4a2d] rounded-lg disabled:opacity-50"
                              >
                                {reviewSubmitting ? "Submitting..." : "Submit Review"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Embedded Map & Address Details */}
          <div className="space-y-8">
            {/* Embedded Directions Map */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80 overflow-hidden h-[400px] flex flex-col">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-black text-puja-text">Delivery Map</h3>
                <p className="text-[10px] font-bold text-puja-muted uppercase tracking-widest mt-0.5">Live destination location</p>
              </div>
              <iframe
                title="Delivery Location Map"
                src={mapSrc}
                width="100%"
                height="100%"
                className="border-0 flex-1 bg-gray-50"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Address & Cost breakdown Card */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100/80 space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#2d4a2d] mb-2">Delivery Address</h3>
                <div className="text-sm text-puja-text leading-relaxed">
                  <p className="font-bold">{address.fullName}</p>
                  <p className="text-puja-muted mt-1">{address.line1}, {address.city} - {address.pincode}</p>
                  <p className="text-puja-muted mt-1">Phone: {address.phone}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#2d4a2d] mb-4">Pricing Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-puja-muted">
                    <span>Subtotal</span>
                    <span className="font-bold text-puja-text">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-puja-muted">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-puja-text">₹{shippingFee}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-saffron-600 font-bold">
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-[#2d4a2d] pt-3 border-t border-dashed border-gray-200">
                    <span>Total Paid</span>
                    <span>₹{payableAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
