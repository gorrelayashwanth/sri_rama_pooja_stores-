import { Phone, Send, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { STORE_LINKS } from "../../config/store";
import { useSettings } from "../../context/SettingsContext";

export function Footer() {
  const { settings } = useSettings();

  const getIsOpen = () => {
    if (!settings?.workingHours) return null;
    try {
      const now = new Date();
      const [start, end] = settings.workingHours.split('-').map(t => t.trim());
      
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, minutes || 0, 0);
        return d;
      };

      const startTime = parseTime(start);
      const endTime = parseTime(end);
      
      return now >= startTime && now <= endTime;
    } catch (e) {
      return null;
    }
  };

  const isOpen = getIsOpen();

  return (
    <footer className="bg-maroon-900 text-white relative overflow-hidden">
      {/* Divine Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-divine-pattern scale-150" />
      
      {/* Bottom Floating CTAs (Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <a 
          href={`tel:${settings?.phone || "+919299207650"}`}
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
          <div className="flex flex-col items-center gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-saffron-400 uppercase tracking-[0.2em]">
              {settings?.storeName || "Sri Rama Pooja Store"}
            </h2>
            {isOpen !== null && (
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isOpen ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isOpen ? 'Open Now' : 'Closed Now'} • {settings?.workingHours}
              </div>
            )}
          </div>
          <p className="text-saffron-200/60 text-lg font-medium tracking-widest uppercase mb-8">
            ॐ श्री रामाय नमः
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <a 
              href={`tel:${settings?.phone || "+919299207650"}`}
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
              <li><Link to="/collections" className="hover:text-saffron-400 transition-colors">All Collections</Link></li>
              <li><Link to="/collections" className="hover:text-saffron-400 transition-colors">Divine Idols</Link></li>
              <li><Link to="/collections" className="hover:text-saffron-400 transition-colors">Puja Kits</Link></li>
              <li><Link to="/collections" className="hover:text-saffron-400 transition-colors">Brass Items</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link to="/about" className="hover:text-saffron-400 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-saffron-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/account" className="hover:text-saffron-400 transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-saffron-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-4">Location</h4>
              <div className="flex gap-3 text-white/60 text-sm italic">
                <MapPin className="h-5 w-5 text-saffron-500 shrink-0" />
                <p>{settings?.address || "Vijayawada, Andhra Pradesh"}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-saffron-500 uppercase tracking-[0.3em] mb-4">Store Hours</h4>
              <div className="flex gap-3 text-white/60 text-sm italic">
                <Clock className="h-5 w-5 text-saffron-500 shrink-0" />
                <p>{settings?.workingHours || "7:00 AM - 11:00 PM (Daily)"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {settings?.address?.split(',').pop()?.trim() || "Vijayawada"} • © 2026 {settings?.storeName || "Sri Rama Pooja Store"}
          </p>
        </div>
      </div>
    </footer>
  );
}

