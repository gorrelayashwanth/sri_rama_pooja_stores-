import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const festivals = [
  {
    name: "Diwali",
    description: "Festival of Lights. Shop diyas, Lakshmi-Ganesha idols, and puja kits.",
    image: "https://images.unsplash.com/photo-1574269229013-1765c71b12b2?q=80&w=800&auto=format&fit=crop",
    color: "bg-orange-50"
  },
  {
    name: "Navratri",
    description: "Nine nights of Goddess Durga. Find Devi idols, chunris, and havan samagri.",
    image: "https://images.unsplash.com/photo-1601614392237-7756f178cbcf?q=80&w=800&auto=format&fit=crop",
    color: "bg-red-50"
  },
  {
    name: "Ganesh Chaturthi",
    description: "Welcome Lord Ganesha with beautiful eco-friendly murtis and modak offerings.",
    image: "https://images.unsplash.com/photo-1567878673942-be055fed5d30?q=80&w=800&auto=format&fit=crop",
    color: "bg-yellow-50"
  },
  {
    name: "Mahashivaratri",
    description: "The great night of Shiva. Authentic Rudraksha, Bhasma, and Lingams.",
    image: "https://images.unsplash.com/photo-1582650047239-0d17e3e9d482?q=80&w=800&auto=format&fit=crop",
    color: "bg-slate-50"
  },
  {
    name: "Janmashtami",
    description: "Celebrate Krishna's birth with Bal Gopal idols and peacock feathers.",
    image: "https://images.unsplash.com/photo-1629813876020-f5a1cbff39e1?q=80&w=800&auto=format&fit=crop",
    color: "bg-blue-50"
  },
  {
    name: "Varalakshmi Vratam",
    description: "South Indian tradition. Find Devi faces, kalash, and special thali sets.",
    image: "https://images.unsplash.com/photo-1602488258284-93e15f2066d4?q=80&w=800&auto=format&fit=crop",
    color: "bg-pink-50"
  }
];

export function FestivalsPage() {
  return (
    <div className="bg-[#fcfdfc] min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-saffron-600 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-widest">Auspicious Occasions</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text mb-6">
            Shop by Festival
          </h1>
          <p className="text-puja-muted">
            Find the perfect sacred items specifically curated for the most auspicious days in the Hindu calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map((fest) => (
            <Link 
              key={fest.name} 
              to={`/collections?festival=${fest.name}`}
              className="group relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={fest.image} 
                  alt={fest.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-playfair font-bold text-white mb-2 group-hover:text-saffron-400 transition-colors">
                  {fest.name}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {fest.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
