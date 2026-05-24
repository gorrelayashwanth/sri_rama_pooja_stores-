import { useSettings } from "../../context/SettingsContext";

export function AboutPage() {
  const { settings, content } = useSettings();
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text mb-8 text-center">Our Story</h1>
      <div className="space-y-8 text-lg text-puja-muted leading-relaxed">
        <p>
          {content?.aboutText || "Sri Rama Pooja Store has been a cornerstone of spiritual life in Vijayawada for years. What started as a small local shop dedicated to providing authentic puja items has now grown into a trusted destination for devotees across the region."}
        </p>
        <p>
          {content?.missionText || "Our mission is simple: to make pure, high-quality puja samagri accessible to every household. We believe that every ritual, whether big or small, deserves the finest ingredients and most beautiful artifacts."}
        </p>
        <div className="bg-saffron-50 p-8 rounded-3xl border border-saffron-100 italic">
          "Pure Devotion, Delivered to Your Door" - This isn't just our tagline; it's our promise to you.
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-10">
          <h2 className="text-2xl font-bold text-puja-text mb-4">Store Working Hours</h2>
          <p className="text-xl font-bold text-saffron-600 font-playfair">
            {settings?.workingHours?.replace?.(/(^"|"$)/g, '') || "10:00 AM - 09:00 PM"}
          </p>
        </div>
      </div>
    </div>
  );
}