import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";

export function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="bg-green-50 p-8 rounded-full mb-8">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>
      <h1 className="text-3xl md:text-4xl font-playfair font-black text-puja-text mb-3">
        Order Placed Successfully
      </h1>
      <p className="text-puja-muted mb-2 max-w-md">
        Thank you for your order. We will contact you shortly to confirm delivery.
      </p>
      {orderId && (
        <p className="text-xs font-black uppercase tracking-widest text-saffron-600 mb-8">
          Order ID: {orderId.slice(0, 12)}...
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        {orderId && (
          <Link
            to={`/order-tracking/${orderId}`}
            className="bg-[#2d4a2d] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-green-100"
          >
            <Package className="h-4 w-4" /> Track My Order
          </Link>
        )}
        <Link
          to="/account"
          className="bg-white border border-gray-200 text-puja-text px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
