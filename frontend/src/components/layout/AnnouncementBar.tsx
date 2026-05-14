import { X } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-saffron-600 to-saffron-400 text-white text-sm py-2 px-4 text-center relative">
      <p className="font-medium">Free Shipping on Orders above ₹499 | Call: 092992 07650</p>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
