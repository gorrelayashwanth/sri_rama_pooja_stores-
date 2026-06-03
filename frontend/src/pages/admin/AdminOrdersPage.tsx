import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { AdminOrderCard } from "../../components/admin/AdminOrderCard";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : import.meta.env.PROD
  ? window.location.origin
  : "http://localhost:5000";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const statusFilter = "All Orders";
  const searchTerm = "";

  const fetchOrders = async (showLoader = false) => {
    if (showLoader) setLoading(true);
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
      if (showLoader) setLoading(false);
      setIsFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchOrders(isFirstLoad);
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("join_admin");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("new_order", (newOrder: any) => {
      console.log("WebSocket: new order received", newOrder);
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3');
      audio.play().catch(e => console.error("Audio play blocked by browser:", e));

      setOrders((prev) => {
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    });

    socket.on("order_status_updated", (data: { id: string; status: any }) => {
      setOrders((prev) =>
        prev.map(o => (o.id === data.id ? { ...o, status: data.status } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AdminLayout>
      <AdminHeader 
        title="Orders" 
        subtitle="Live Monitor" 
      />
      
      <div className="p-8 flex-1 flex flex-col space-y-6">
        {/* Real-time Status Indicator */}
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border w-fit ${
          socketConnected 
            ? 'text-green-600 bg-green-50 border-green-100' 
            : 'text-amber-600 bg-amber-50 border-amber-100'
        }`}>
          <span className="relative flex h-2 w-2">
            {socketConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              socketConnected ? 'bg-green-500' : 'bg-amber-500'
            }`}></span>
          </span>
          {socketConnected ? "Live Monitor Active" : "Reconnecting to Live Stream..."}
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
