import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
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
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
    user: {
      name: string;
      phone?: string;
      email?: string;
    };
    address: {
      fullName?: string;
      phone?: string;
      line1?: string;
      city: string;
      state: string;
      pincode?: string;
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
  const StatusIcon = statusIcons[order.status];

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
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[380px]">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Ref: {order.orderNumber}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 relative ${statusColors[order.status]} ${isUpdating ? 'opacity-50' : ''}`}>
            <StatusIcon className="h-3 w-3" />
            <select 
              value={order.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-transparent border-none outline-none appearance-none font-bold uppercase tracking-widest cursor-pointer pr-4"
            >
              <option value="PLACED">Placed</option>
              <option value="PREPARING">Preparing</option>
              <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Customer Address Details */}
        <div className="mb-4 space-y-1.5 text-xs border-b border-gray-50 pb-4">
          <div className="flex items-start gap-2 text-puja-muted">
            <MapPin className="h-4 w-4 text-[#2d4a2d] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-puja-text">{order.address?.fullName || order.user.name}</p>
              <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                {order.address?.line1 || 'No address line'}, {order.address?.city || 'Vijayawada'} - {order.address?.pincode || '520001'}
              </p>
              <p className="text-gray-500 text-[11px] font-bold mt-1">Phone: {order.address?.phone || order.user.phone || 'N/A'}</p>
              {order.latitude && order.longitude ? (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-black text-[#9a3412] uppercase tracking-widest mt-2 bg-[#9a3412]/5 px-2 py-1 rounded-lg hover:bg-[#9a3412]/10 transition-colors"
                >
                  📍 Open Live GPS Map Pin <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address?.line1 || ''}, ${order.address?.city || ''} - ${order.address?.pincode || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-widest mt-2 bg-gray-100 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📍 Search Address Map <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 mb-4 max-h-[140px] overflow-y-auto custom-scrollbar">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col text-[11px] font-medium border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
              <div className="flex justify-between items-start">
                <span className="text-puja-text font-bold truncate mr-2">{item.product.name}</span>
                <span className="text-puja-muted shrink-0 font-bold">x{item.quantity}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{item.selectedTier ? `Size: ${item.selectedTier}` : 'Standard'}</span>
                <span>₹{item.price} = ₹{item.total || (item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
        <div className="space-y-1 text-[10px] font-bold text-gray-400">
          <div className="flex gap-2">
            <span>Subtotal: ₹{order.totalAmount}</span>
            <span>•</span>
            <span>Deliv: ₹{order.shippingFee}</span>
          </div>
          {order.discountAmount > 0 && <p className="text-red-500">Disc: -₹{order.discountAmount}</p>}
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Paid</p>
            <p className="font-black text-lg text-puja-text">₹{order.payableAmount}</p>
          </div>
        </div>
        
        <a 
          href={`/order-tracking/${order.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-puja-text text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-saffron-600 transition-all flex items-center gap-1.5"
        >
          Track <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
