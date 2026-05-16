import { Star, MessageSquare, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";
import api from "../../api/axios";
import { supabase } from "../../config/supabaseClient";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  product: {
    name: string;
  };
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avg: 0,
    total: 0
  });

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      const data = response.data.data;
      setReviews(data);
      
      const total = data.length;
      const avg = total > 0 ? data.reduce((acc: number, r: Review) => acc + r.rating, 0) / total : 0;
      setStats({ total, avg: Number(avg.toFixed(1)) });
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel('reviews-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        fetchReviews();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
    } catch (error) {
      console.error("Failed to delete review", error);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Reviews" subtitle="Customer Feedback" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.avg}</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Total Reviews</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{stats.total}</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Recent Activity</p>
            <p className="mt-2 text-3xl font-black text-puja-text">{reviews.length > 0 ? "Live" : "None"}</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-playfair font-bold text-puja-text">User Reviews</h1>
            <p className="text-sm text-puja-muted">All reviews from verified customers.</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 text-puja-muted italic">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 text-puja-muted italic">No reviews yet.</div>
            ) : reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-gray-50 bg-[#fcfcfb] p-6 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-puja-text">{review.user.name}</h2>
                      <span className="text-[10px] text-puja-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-black uppercase tracking-widest text-saffron-600">{review.product.name}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-500"
                      title="Delete Review"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-puja-text font-medium italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

