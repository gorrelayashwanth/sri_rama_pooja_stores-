import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const deities = [
  {
    name: "Ganesha",
    description: "The remover of obstacles. Shop idols, modaks, and durva grass.",
    image: "https://images.unsplash.com/photo-1558231645-f09c6ee0f8d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Lakshmi",
    description: "Goddess of wealth and prosperity. Shop lotus garlands and kamal deeps.",
    image: "https://images.unsplash.com/photo-1631527581561-1250284e3658?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Shiva",
    description: "The transformer. Shop Rudraksha malas, bhasma, and lingams.",
    image: "https://images.unsplash.com/photo-1596700547038-71e8a8e137b0?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Krishna",
    description: "The divine protector. Shop Bal Gopal idols, flutes, and tulsi malas.",
    image: "https://images.unsplash.com/photo-1579624641655-e7a83d7fc318?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Hanuman",
    description: "The ultimate devotee. Shop standing murtis and sindoor offerings.",
    image: "https://images.unsplash.com/photo-1563200921-1200df1d850a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Durga",
    description: "The invincible Goddess. Shop chunris, sindoor, and shringaar sets.",
    image: "https://images.unsplash.com/photo-1601614392237-7756f178cbcf?q=80&w=800&auto=format&fit=crop",
  }
];

export function DeitiesPage() {
  return (
    <div className="bg-[#fcfdfc] min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-saffron-600 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">Divine Forms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text mb-6">
            Shop by Deity
          </h1>
          <p className="text-puja-muted">
            Find idols, offerings, and specific puja samagri dedicated to your beloved Ishta Devata.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {deities.map((deity) => (
            <Link 
              key={deity.name} 
              to={`/collections?deity=${deity.name}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl group-hover:border-saffron-100 transition-all duration-500 relative">
                <img 
                  src={deity.image} 
                  alt={deity.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-saffron-500/0 group-hover:bg-saffron-500/20 transition-colors duration-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-playfair font-bold text-puja-text mb-2 group-hover:text-saffron-600 transition-colors">
                {deity.name}
              </h3>
              <p className="text-puja-muted text-sm px-4">
                {deity.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
