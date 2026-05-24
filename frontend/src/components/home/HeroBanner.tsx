import { Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "../../assets/home/hero-store-interior.png";
import { STORE_LINKS } from "../../config/store";
import { useSettings } from "../../context/SettingsContext";

export function HeroBanner() {
  const { content, settings } = useSettings();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = settings?.logo || heroImage;
    img.onload = () => setImageLoaded(true);
  }, [settings?.logo]);

  return (
    <section className="relative h-[80vh] md:h-[85vh] min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-maroon-950">
      {/* Background Image with Overlay and Blur-up effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`absolute inset-0 bg-maroon-900 transition-opacity duration-1000 ${imageLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'}`} 
          style={{ backgroundImage: 'linear-gradient(45deg, #4a1d1d 25%, #2d1a12 75%)' }}
        />
        <img 
          src={settings?.logo || heroImage} 
          alt="Divine Pooja Space" 
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out ${imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-2xl'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-maroon-950/70 to-maroon-950/95" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className={`mb-6 transition-all duration-1000 delay-300 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-saffron-400 text-sm md:text-xl font-black tracking-[0.3em] uppercase drop-shadow-sm">
            ॐ श्री रामाय नमः
          </span>
        </div>
        
        <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-playfair font-black text-white mb-6 tracking-tighter leading-[0.9] uppercase transition-all duration-1000 delay-500 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {content?.heroTitle?.split('\n')?.map((line, i) => (
            <span key={i} className="block">{line}</span>
          )) || (
            <>
              <span className="block">SRI RAMA</span>
              <span className="text-saffron-500">POOJA STORE</span>
            </>
          )}
        </h1>
        
        <p className={`text-saffron-100 text-lg md:text-2xl font-medium tracking-[0.2em] uppercase mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-700 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {content?.heroSubtitle || "Divine Puja Essentials For Every Home"}
        </p>
        
        <p className="text-white/70 text-lg md:text-xl italic mb-12">
          {settings?.address?.split(',')?.pop() || "Vijayawada's Trusted Religious Goods Store"}
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 transition-all duration-1000 delay-1000 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a 
            href={`tel:${settings?.phone || "+919299207650"}`}
            className="w-full sm:w-auto bg-saffron-600 hover:bg-saffron-500 text-white px-12 py-5 rounded-2xl font-black text-xs md:text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-saffron-950/50 uppercase"
          >
            <Phone className="h-5 w-5" /> Call Now
          </a>
          <a 
            href={STORE_LINKS.googleMapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border-2 border-white/20 hover:border-saffron-500 text-white hover:text-saffron-400 px-12 py-5 rounded-2xl font-black text-xs md:text-sm tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-white/5 active:scale-95 uppercase"
          >
            <MapPin className="h-5 w-5" /> Get Directions
          </a>
        </div>
        <p className={`mt-12 text-white/40 text-xs md:text-sm italic transition-all duration-1000 delay-[1200ms] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {settings?.address?.split(',')?.pop() || "Vijayawada's Trusted Religious Goods Store Since Decades"}
        </p>
      </div>

      {/* Divine Pattern Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fdfaf7] to-transparent z-20" />
    </section>
  );
}

