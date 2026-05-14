import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      const { user, token } = response.data.data;
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-playfair font-bold text-puja-text mb-2 text-center">Create Account</h1>
        <p className="text-puja-muted text-center mb-8">Join the Sri Rama Pooja Store family</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="john@example.com" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="+91 XXXXX XXXXX" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-puja-text">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-saffron-500 text-white py-4 rounded-xl font-bold hover:bg-saffron-600 transition-all shadow-lg shadow-saffron-200 mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-puja-muted">
          Already have an account? <Link to="/login" className="text-saffron-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}