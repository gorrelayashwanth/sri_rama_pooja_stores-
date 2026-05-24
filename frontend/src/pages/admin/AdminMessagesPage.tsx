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
  User,
  Reply,
  Send
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  isAdmin: boolean;
  parentId: string | null;
  createdAt: string;
  replies: Message[];
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  const fetchMessages = async () => {
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

    // Poll every 10 seconds for new messages instead of relying on Supabase sockets
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleReply = async (parentId: string, email: string, name: string) => {
    const text = replyText[parentId];
    if (!text?.trim()) return;

    setSendingReply(parentId);
    try {
      await api.post('/messages', {
        name: "Admin",
        email: email, // Reply to this email
        message: text,
        parentId,
        isAdmin: true,
        subject: `Reply to: ${name}`
      });
      setReplyText({ ...replyText, [parentId]: "" });
      fetchMessages(); // Fetch immediately after replying
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSendingReply(null);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.patch(`/messages/${id}/read`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const deleteMsg = async (id: string) => {
    if (!window.confirm("Delete this message and all replies?")) return;
    try {
      await api.delete(`/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-gray-100 border-dashed p-20 text-center">
            <p className="text-gray-400 italic">No messages found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-[32px] border transition-all p-6 space-y-6 ${
                  msg.isRead ? 'border-gray-50' : 'border-[#86efac] shadow-sm shadow-green-50'
                }`}
              >
                <div className="flex gap-6 items-start">
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

                    {/* Replies Thread */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="space-y-4 pl-8 border-l-2 border-gray-100 mt-4">
                        {msg.replies.map((reply) => (
                          <div key={reply.id} className={`p-4 rounded-2xl border ${reply.isAdmin ? 'bg-saffron-50/30 border-saffron-100 ml-4' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-puja-text">
                                {reply.isAdmin ? 'You (Admin)' : reply.name}
                              </span>
                              <span className="text-[10px] text-puja-muted">{new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-puja-text">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="mt-6 flex gap-3">
                      <div className="relative flex-1">
                        <Reply className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Type your reply..."
                          value={replyText[msg.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleReply(msg.id, msg.email, msg.name)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-100 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => handleReply(msg.id, msg.email, msg.name)}
                        disabled={sendingReply === msg.id || !replyText[msg.id]}
                        className="bg-[#2d4a2d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1a2b1a] transition-all disabled:opacity-50"
                      >
                        {sendingReply === msg.id ? <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Send className="h-4 w-4" />}
                        Reply
                      </button>
                    </div>
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

