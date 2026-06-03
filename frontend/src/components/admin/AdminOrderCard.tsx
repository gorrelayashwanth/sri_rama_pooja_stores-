import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  ChevronDown,
  Phone,
  ShoppingBag
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export type OrderStatus = 'PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

interface AdminOrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    awbNumber?: string;
    status: OrderStatus;
    totalAmount: number;
    discountAmount: number;
    shippingFee: number;
    payableAmount: number;
    createdAt: string;
    latitude?: number | null;
    longitude?: number | null;
    user: {
      name: string;
      phone?: string;
      email?: string;
    };
    address: {
      fullName: string;
      phone: string;
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      pincode: string;
    };
    items: {
      product: { name: string };
      quantity: number;
      price: number;
      total: number;
      selectedTier?: string | null;
    }[];
  };
}

const statusColors = {
  PLACED: 'bg-orange-100 text-orange-600 border-orange-200',
  PREPARING: 'bg-blue-100 text-blue-600 border-blue-200',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-600 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-600 border-green-200',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200',
};

const statusIcons = {
  PLACED: Clock,
  PREPARING: Package,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: Clock,
};

export function AdminOrderCard({ order: initialOrder }: AdminOrderCardProps) {
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const StatusIcon = statusIcons[order.status];

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setIsUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Ref: {order.orderNumber}</span>
            <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 relative ${statusColors[order.status]} ${isUpdating ? 'opacity-50' : ''}`}>
              <StatusIcon className="h-3 w-3" />
              <select 
                value={order.status}
                onChange={handleStatusChange}
                disabled={isUpdating}
                className="bg-transparent border-none outline-none appearance-none font-bold uppercase tracking-wider cursor-pointer pr-3"
              >
                <option value="PLACED">Placed</option>
                <option value="PREPARING">Preparing</option>
                <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="h-2.5 w-2.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <h3 className="font-bold text-puja-text flex items-center gap-1.5 group-hover:text-saffron-600 transition-colors text-sm">
            {order.address.fullName || order.user.name} 
            <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-saffron-500" />
          </h3>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {/* Customer contact & address details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-puja-muted">
            <Phone className="h-3.5 w-3.5 text-saffron-500 shrink-0" />
            <a href={`tel:${order.address.phone}`} className="hover:text-saffron-600 hover:underline font-medium">{order.address.phone}</a>
          </div>

          <div className="flex items-start gap-2 text-puja-muted">
            <MapPin className="h-3.5 w-3.5 text-saffron-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}, <br />
              <span className="font-semibold text-puja-text">{order.address.city}, {order.address.state} - {order.address.pincode}</span>
            </p>
          </div>

          {/* GPS Pin Button */}
          {order.latitude && order.longitude ? (
            <div className="pt-1">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-saffron-600 hover:text-white bg-saffron-50 hover:bg-saffron-500 px-3 py-1.5 rounded-xl border border-saffron-100 transition-all"
              >
                <MapPin className="h-3 w-3" /> View Map Location
              </a>
            </div>
          ) : (
            <span className="text-[9px] text-gray-400 italic">No GPS coordinates captured</span>
          )}
        </div>

        {/* Order Items with tiers */}
        <div className="bg-gray-50/50 rounded-2xl p-4 space-y-2 mt-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" /> Items ({order.items.length})
          </p>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs items-start border-b border-gray-100/50 pb-1 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-puja-text font-bold truncate pr-2">{item.product.name}</p>
                {item.selectedTier && (
                  <span className="inline-block bg-saffron-50 text-saffron-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded mt-0.5">
                    {item.selectedTier}
                  </span>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-puja-muted font-medium">x{item.quantity}</span>
                <p className="text-[10px] font-bold text-puja-text">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-gray-100 mt-3">
          <div className="space-y-1 text-[11px] mb-2 font-medium text-puja-muted">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-puja-text">₹{order.totalAmount}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-red-500 font-bold">
                <span>Discount:</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="text-puja-text">{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">Grand Total</p>
              <p className="font-black text-base text-puja-text">₹{order.payableAmount}</p>
            </div>
            <a 
              href={`/orders/${order.id}/track`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-puja-text text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-saffron-600 transition-all flex items-center gap-1"
            >
              Track <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
