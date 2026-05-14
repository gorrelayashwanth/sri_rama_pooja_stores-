import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-playfair font-bold text-puja-text mb-2 text-center">Welcome Back</h1>
        <p className="text-puja-muted text-center mb-8">Login to your account to continue</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="john@example.com" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-saffron-500 text-white py-4 rounded-xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-puja-muted">
          Don't have an account? <Link to="/register" className="text-saffron-600 font-bold hover:underline">Register Now</Link>
        </p>
      </div>
    </div>
  );
}