import { Zap } from "lucide-react";

export function OfferStrip() {
  return (
    <div className="bg-maroon-700 py-4 overflow-hidden border-y border-gold-500/20">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-8 text-gold-500 font-bold uppercase tracking-widest text-sm">
            <Zap className="h-4 w-4 fill-gold-500" />
            <span>Special Festival Sale: Flat 20% Off on All Pooja Kits</span>
            <Zap className="h-4 w-4 fill-gold-500" />
            <span>Use Code: FESTIVE20</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}