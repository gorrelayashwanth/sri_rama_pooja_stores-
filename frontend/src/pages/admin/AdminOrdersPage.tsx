import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { AdminOrderCard } from "../../components/admin/AdminOrderCard";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const statusFilter = "All Orders";
  const searchTerm = "";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders', {
        params: { 
          status: statusFilter,
          search: searchTerm
        }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = window.setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [statusFilter, searchTerm]);

  return (
    <AdminLayout>
      <AdminHeader 
        title="Orders" 
        subtitle="Live Monitor" 
      />
      
      <div className="p-8 flex-1 flex flex-col space-y-6">
        {/* Real-time Status Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Monitoring Active
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <RefreshCw className="h-10 w-10 text-saffron-500 animate-spin mb-4" />
            <p className="text-puja-muted font-medium">Updating live feed...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-1 bg-white rounded-[32px] border border-gray-100 border-dashed flex flex-col items-center justify-center text-center p-12">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium italic">
              No orders match your current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => (
              <AdminOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
