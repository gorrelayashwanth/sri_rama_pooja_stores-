import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Clock,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const deleteMsg = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Messages" subtitle="Inquiries" />
      
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#2d4a2d] p-3 rounded-2xl">
              <MessageSquare className="h-6 w-6 text-[#86efac]" />
            </div>
            <div>
              <h1 className="text-2xl font-playfair font-bold text-puja-text">Customer Messages</h1>
              <p className="text-xs text-puja-muted font-medium uppercase tracking-widest">Manage inquiries and feedback</p>
            </div>
          </div>

          <div className="relative w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-saffron-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-gray-100 border-dashed p-20 text-center">
            <p className="text-gray-400 italic">No messages found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-3xl border transition-all p-6 flex gap-6 items-start group ${
                  msg.isRead ? 'border-gray-50' : 'border-[#86efac] shadow-sm shadow-green-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  msg.isRead ? 'bg-gray-50 text-gray-400' : 'bg-green-50 text-green-600'
                }`}>
                  <User className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-puja-text">{msg.name}</h3>
                        {!msg.isRead && (
                          <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-puja-muted">
                        <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {msg.phone}</span>}
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <button 
                          onClick={() => markRead(msg.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Mark as Read"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMsg(msg.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject: {msg.subject || 'No Subject'}</p>
                    <p className="text-sm text-puja-text leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
