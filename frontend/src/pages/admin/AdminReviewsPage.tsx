import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminLayout } from "../../components/admin/AdminLayout";

const sampleReviews = [
  {
    id: "review-1",
    customer: "Sowmya Reddy",
    rating: 5,
    product: "Premium Brass Diya Set",
    comment: "Excellent finish and very good packing. Looks premium in our pooja room.",
    status: "Featured",
  },
  {
    id: "review-2",
    customer: "Raghav Sharma",
    rating: 4,
    product: "Lakshmi Ganesh Idol Pair",
    comment: "Good quality and fast delivery. Admin moderation controls can be connected next.",
    status: "Pending Reply",
  },
  {
    id: "review-3",
    customer: "Bhavani Devi",
    rating: 5,
    product: "Festival Pooja Thali",
    comment: "Beautiful traditional look. Very happy with the purchase.",
    status: "Published",
  },
];

export function AdminReviewsPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Reviews" subtitle="Feedback" />

      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="mt-2 text-3xl font-black text-puja-text">4.8</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Published Reviews</p>
            <p className="mt-2 text-3xl font-black text-puja-text">128</p>
          </div>
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">Needs Response</p>
            <p className="mt-2 text-3xl font-black text-puja-text">7</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-playfair font-bold text-puja-text">Customer Reviews</h1>
              <p className="text-sm text-puja-muted">This section is now properly routed and ready for backend integration.</p>
            </div>
          </div>

          <div className="space-y-4">
            {sampleReviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-gray-100 bg-[#fcfcfb] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-puja-text">{review.customer}</h2>
                      <span className="rounded-full bg-saffron-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-saffron-700">
                        {review.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-puja-muted">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-puja-text">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
