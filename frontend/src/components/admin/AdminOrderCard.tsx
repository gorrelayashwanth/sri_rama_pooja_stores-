import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
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
    createdAt: string;
    user: {
      name: string;
      phone?: string;
    };
    address: {
      city: string;
      state: string;
    };
    items: {
      product: { name: string };
      quantity: number;
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
  CANCELLED: Clock, // Replace with appropriate icon if needed
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
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref: {order.orderNumber}</span>
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
          <h3 className="font-bold text-puja-text flex items-center gap-2 group-hover:text-saffron-600 transition-colors">
            {order.user.name} <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </h3>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-puja-muted">
          <MapPin className="h-4 w-4 text-saffron-500" />
          <span>{order.address.city}, {order.address.state}</span>
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-4 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs font-medium">
              <span className="text-puja-text truncate mr-4">{item.product.name}</span>
              <span className="text-puja-muted shrink-0">x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Payable</p>
            <p className="font-black text-lg text-puja-text">₹{order.totalAmount}</p>
          </div>
          <button className="bg-puja-text text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-saffron-600 transition-all flex items-center gap-2">
            Details <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
