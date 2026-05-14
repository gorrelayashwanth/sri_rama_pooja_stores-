import { Phone, Mail, Globe, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { STORE_LINKS } from "../../config/store";

export function Footer() {
  return (
    <footer className="bg-maroon-900 text-white relative overflow-hidden">
      {/* Divine Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-divine-pattern scale-150" />
      
      {/* Bottom Floating CTAs (Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <a 
          href={STORE_LINKS.tel}
          className="bg-saffron-600 p-4 rounded-full shadow-2xl hover:bg-saffron-700 transition-all transform hover:scale-110 active:scale-95"
        >
          <Phone className="h-6 w-6 text-white" />
        </a>
        <a 
          href={STORE_LINKS.googleMapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-maroon-800 p-4 rounded-full shadow-2xl border border-white/10 hover:bg-maroon-700 transition-all transform hover:scale-110 active:scale-95"
        >
          <Send className="h-6 w-6 text-white" />
        </a>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-saffron-400 mb-2 uppercase tracking-[0.2em]">
            Sri Rama Pooja Store
          </h2>
          <p className="text-saffron-200/60 text-lg font-medium tracking-widest uppercase mb-8">
            ॐ श्री रामाय नमः
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a 
              href={STORE_LINKS.tel}
              className="bg-saffron-600 hover:bg-saffron-700 text-white px-12 py-4 rounded-xl font-bold flex items-center gap-3 transition-all min-w-[200px] justify-center"
            >
              <Phone className="h-5 w-5" /> CALL NOW
            </a>
            <a 
              href={STORE_LINKS.googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-saffron-500/30 hover:border-saffron-500 text-saffron-300 px-12 py-4 rounded-xl font-bold flex items-center gap-3 transition-all min-w-[200px] justify-center"
            >
              <Send className="h-5 w-5 rotate-45" /> GET DIRECTIONS
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 mb-16">
          <div>
            <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link to="/collections/puja-items" className="hover:text-saffron-400 transition-colors">Puja Items</Link></li>
              <li><Link to="/collections/idols-frames" className="hover:text-saffron-400 transition-colors">Idols & Frames</Link></li>
              <li><Link to="/collections/incense-oils" className="hover:text-saffron-400 transition-colors">Incense & Oils</Link></li>
              <li><Link to="/collections/brassware" className="hover:text-saffron-400 transition-colors">Brassware</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link to="/about" className="hover:text-saffron-400 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-saffron-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-saffron-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-saffron-400 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-6">Connect</h4>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Stay updated with our latest collections and divine offerings.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-saffron-600 transition-all text-white/60 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-saffron-600 transition-all text-white/60 hover:text-white">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            Vijayawada, Andhra Pradesh • © 2026 Sri Rama Pooja Store
          </p>
        </div>
      </div>
    </footer>
  );
}
