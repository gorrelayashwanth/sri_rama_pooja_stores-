export function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair font-bold text-puja-text mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-puja-text mb-6">Delivery Address</h2>
            {/* Address Form Placeholder */}
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-puja-text mb-6">Order Summary</h2>
            {/* Order Summary Placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
}