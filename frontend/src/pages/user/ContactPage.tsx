export function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-playfair font-bold text-puja-text mb-12 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-puja-text mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500" />
                <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500" />
              </div>
              <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500" />
              <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-saffron-500"></textarea>
              <button className="bg-saffron-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-saffron-600 transition-all">Send Message</button>
            </form>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-maroon-700 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-playfair font-bold text-gold-500 mb-6">Store Details</h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gold-500 uppercase text-xs tracking-widest mb-2">Our Address</h4>
                <p>Door No. 23, 11-116, Nageswara Rao Pantulu Rd, Rajan Killi Shop Center, Satyaranayana Puram, Vijayawada, AP 520011</p>
              </div>
              <div>
                <h4 className="font-bold text-gold-500 uppercase text-xs tracking-widest mb-2">Call Us</h4>
                <p className="text-xl">092992 07650</p>
              </div>
              <div>
                <h4 className="font-bold text-gold-500 uppercase text-xs tracking-widest mb-2">Email</h4>
                <p>sriramapoojastore@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}