import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../api/axios";
import { supabase } from "../../config/supabaseClient";
import { Send, User, MessageCircle, Clock, Mail } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  replies?: Message[];
}

export function ContactPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myMessages, setMyMessages] = useState<Message[]>([]);

  const fetchMyMessages = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const response = await api.get('/messages');
      // On the frontend, we'll filter by email for the user's view
      // Ideally the backend should have a /my-messages route
      const filtered = response.data.data.filter((m: any) => m.email === user.email);
      setMyMessages(filtered);
    } catch (error) {
      console.error("Failed to fetch my messages", error);
    }
  };

  useEffect(() => {
    fetchMyMessages();

    if (isAuthenticated) {
      const channel = supabase
        .channel('user-messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          fetchMyMessages();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', formData);
      setSuccess(true);
      setFormData({ ...formData, subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-playfair font-bold text-puja-text mb-4 text-center">Contact Us</h1>
      <p className="text-puja-muted text-center mb-12 max-w-2xl mx-auto">
        Have questions about our products or your order? Reach out to us and our team will get back to you in real-time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-12">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-puja-text mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 transition-all" 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 transition-all" 
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 transition-all" 
              />
              <textarea 
                placeholder="Your Message" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                rows={5} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 transition-all"
              ></textarea>
              
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold animate-fade-in">
                  Message sent successfully! We will reply shortly.
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#2d4a2d] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#1a2b1a] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-100"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* User's Message History */}
          {isAuthenticated && myMessages.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-saffron-600" />
                <h3 className="text-xl font-bold text-puja-text">Your Conversation History</h3>
              </div>
              <div className="space-y-4">
                {myMessages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600 shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-black uppercase tracking-widest text-puja-text">You</span>
                          <span className="flex items-center gap-1 text-[10px] text-puja-muted"><Clock className="h-3 w-3" /> {new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-puja-text leading-relaxed bg-gray-50/50 p-4 rounded-2xl">{msg.message}</p>
                        
                        {/* Replies */}
                        {msg.replies && msg.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {msg.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-4 pl-4 border-l-2 border-saffron-100">
                                <div className="w-10 h-10 rounded-full bg-[#2d4a2d] flex items-center justify-center text-white shrink-0">
                                  <div className="font-bold text-[10px]">AD</div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-saffron-700">Admin Response</span>
                                    <span className="text-[10px] text-puja-muted">{new Date(reply.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-puja-text leading-relaxed bg-saffron-50/30 p-4 rounded-2xl border border-saffron-100">
                                    {reply.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#4a1d1d] text-white p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-32 w-32" />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-saffron-400 mb-8 relative z-10">Store Details</h2>
            <div className="space-y-8 relative z-10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Send className="h-5 w-5 text-saffron-400" />
                </div>
                <div>
                  <h4 className="font-black text-saffron-400 uppercase text-[10px] tracking-widest mb-2">Our Address</h4>
                  <p className="text-sm leading-relaxed text-gray-200">Door No. 23, 11-116, Nageswara Rao Pantulu Rd, Rajan Killi Shop Center, Satyaranayana Puram, Vijayawada, AP 520011</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-saffron-400" />
                </div>
                <div>
                  <h4 className="font-black text-saffron-400 uppercase text-[10px] tracking-widest mb-2">Call Us</h4>
                  <p className="text-2xl font-playfair font-bold">092992 07650</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-saffron-400" />
                </div>
                <div>
                  <h4 className="font-black text-saffron-400 uppercase text-[10px] tracking-widest mb-2">Email</h4>
                  <p className="text-sm text-gray-200">sriramapoojastore@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-sm h-[300px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.2104523910383!2d80.6288820751454!3d16.515437884232386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35efb960565555%3A0xc346ecb457e5b155!2sSri%20Rama%20Pooja%20Store!5e0!3m2!1sen!2sin!4v1715758800000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}