export function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair font-bold text-puja-text mb-8">My Wishlist</h1>
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-puja-muted mb-6">You haven't saved any items yet.</p>
        <a href="/collections" className="inline-block bg-saffron-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-saffron-600 transition-colors">
          Explore Products
        </a>
      </div>
    </div>
  );
}