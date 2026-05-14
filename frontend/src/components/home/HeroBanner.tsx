import { Phone, MapPin } from "lucide-react";
import heroImage from "../../assets/home/hero-store-interior.png";
import { STORE_LINKS } from "../../config/store";

export function HeroBanner() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Divine Pooja Space" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-maroon-900/60 to-maroon-900/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="mb-6 animate-fade-in">
          <span className="text-saffron-200 text-lg md:text-xl font-medium tracking-[0.2em] uppercase">
            ॐ श्री रामाय नमः
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 tracking-tight leading-tight">
          SRI RAMA POOJA <br /> STORE
        </h1>
        
        <p className="text-saffron-100 text-xl md:text-2xl font-medium tracking-widest uppercase mb-4 max-w-3xl mx-auto">
          Divine Puja Essentials For Every Home
        </p>
        
        <p className="text-white/70 text-lg md:text-xl italic mb-12">
          Vijayawada's Trusted Religious Goods Store
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href={STORE_LINKS.tel}
            className="w-full sm:w-auto bg-saffron-600 hover:bg-saffron-700 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-saffron-900/40"
          >
            <Phone className="h-5 w-5" /> CALL NOW
          </a>
          <a 
            href={STORE_LINKS.googleMapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border-2 border-saffron-500/50 hover:border-saffron-500 text-saffron-400 hover:bg-saffron-500/10 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-105"
          >
            <MapPin className="h-5 w-5" /> GET DIRECTIONS
          </a>
        </div>
      </div>

      {/* Divine Pattern Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-puja-bg to-transparent opacity-100" />
    </section>
  );
}
