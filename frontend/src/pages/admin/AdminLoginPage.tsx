import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useAdminAuthStore } from "../../store/adminAuthStore";
import api from "../../api/axios";

export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const setAdminAuth = useAdminAuthStore((state) => state.setAdminAuth);

  const from = (location.state as any)?.from?.pathname || "/admin/orders";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data.data;

      if (user.role !== "ADMIN" && user.role !== "CHIEF_ADMIN") {
        setError("Access Denied: Administrative credentials required.");
        setLoading(false);
        return;
      }

      setAdminAuth(user, token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-saffron-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 mb-6 group transition-all duration-500 hover:bg-green-500/20">
              <ShieldCheck className="h-10 w-10 text-green-500 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <h1 className="text-3xl font-playfair font-black text-white mb-2 tracking-tight">Admin Console</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">Sri Rama Pooja Stores</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Administrative ID</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/40 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-green-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/40 transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-900/20"
            >
              {loading ? "Verifying..." : (
                <>
                  Authenticate <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
