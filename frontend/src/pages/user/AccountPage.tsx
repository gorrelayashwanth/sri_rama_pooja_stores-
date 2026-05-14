export function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair font-bold text-puja-text mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <nav className="flex flex-col space-y-2">
              <a href="/account" className="bg-saffron-50 text-saffron-600 px-4 py-3 rounded-xl font-bold">Profile</a>
              <a href="/account/orders" className="text-puja-text hover:bg-gray-50 px-4 py-3 rounded-xl transition-colors">My Orders</a>
              <a href="/account/addresses" className="text-puja-text hover:bg-gray-50 px-4 py-3 rounded-xl transition-colors">Saved Addresses</a>
              <button className="text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors text-left mt-4">Logout</button>
            </nav>
          </div>
        </aside>
        <main className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-puja-text mb-6">Profile Information</h2>
            {/* Profile Form Placeholder */}
          </div>
        </main>
      </div>
    </div>
  );
}