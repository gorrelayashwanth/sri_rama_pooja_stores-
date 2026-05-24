import { useAuthStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export function AccountPage() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch my orders", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  if (!user) {
    return <div className="container mx-auto px-4 py-20 text-center">Please login to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-playfair font-bold text-puja-text mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-saffron-50 text-saffron-600' : 'text-puja-text hover:bg-gray-50'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-saffron-50 text-saffron-600' : 'text-puja-text hover:bg-gray-50'}`}
              >
                My Orders
              </button>
              <button 
                onClick={logout}
                className="text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors font-bold text-left mt-4"
              >
                Logout
              </button>
            </nav>
          </div>
        </aside>
        <main className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-xl font-bold text-puja-text mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-puja-text opacity-70">Full Name</label>
                  <p className="text-lg font-bold text-puja-text">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-puja-text opacity-70">Email Address</label>
                  <p className="text-lg font-bold text-puja-text">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-puja-text opacity-70">Phone Number</label>
                  <p className="text-lg font-bold text-puja-text">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-puja-text opacity-70">Account Type</label>
                  <p className="text-lg font-bold text-puja-text">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn">
              <h2 className="text-xl font-bold text-puja-text mb-6">My Orders</h2>
              {loading ? (
                <p className="text-puja-muted">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-puja-muted">You haven't placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                        <div>
                          <p className="text-sm text-puja-muted font-bold">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-puja-text">₹{order.total}</p>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                            'bg-saffron-50 text-saffron-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="text-sm font-bold text-puja-text">{item.quantity}x {item.product.name}</span>
                            <span className="text-sm text-puja-muted">₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}