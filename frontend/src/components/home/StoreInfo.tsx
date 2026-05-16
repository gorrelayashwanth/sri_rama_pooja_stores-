import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { STORE_LINKS } from "../../config/store";
import { useSettings } from "../../context/SettingsContext";

export function StoreInfo() {
  const { settings } = useSettings();

  const getIsOpen = () => {
    if (!settings?.workingHours) return null;
    try {
      const now = new Date();
      // Expecting format "7:00 AM - 11:00 PM"
      const [start, end] = settings.workingHours.split('-').map(t => t.trim());
      
      const parseTime = (timeStr: string) => {
        // Handle strings like "11:00 PM (Daily)" by splitting and taking first two
        const parts = timeStr.split(' ');
        const [time, modifier] = parts;
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
      console.error("Working hours parse error:", e);
      return null;
    }
  };

  const isOpen = getIsOpen();

  return (
    <section className="py-24 bg-[#fcf9f5] relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-divine-pattern scale-150" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-600 mb-3 block">Divine Presence</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text mb-6">
            Visit Our Store
          </h2>
          <div className="w-24 h-1.5 bg-saffron-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Info Cards */}
          <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between space-y-10">
            <div className="space-y-10">
              {/* Address */}
              <div className="flex gap-6">
                <div className="bg-saffron-50 p-5 rounded-[2rem] h-fit shrink-0 border border-saffron-100/50">
                  <MapPin className="h-6 w-6 text-saffron-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Address</h3>
                  <p className="text-xl font-bold text-puja-text leading-relaxed font-playfair">
                    {settings?.address || "Door No. 23, 11-116, Nageswara Rao Pantulu Rd, Rajan Killi Shop Center, Satyanarayana Puram, Vijayawada, AP"}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-6">
                <div className="bg-saffron-50 p-5 rounded-[2rem] h-fit shrink-0 border border-saffron-100/50">
                  <Clock className="h-6 w-6 text-saffron-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Hours</h3>
                  <p className="text-xl font-bold text-puja-text font-playfair">{settings?.workingHours || "7:00 AM - 11:00 PM (Daily)"}</p>
                  
                  {isOpen !== null && (
                    <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                      isOpen 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      {isOpen ? 'Open Now' : 'Closed Now'}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6">
                <div className="bg-saffron-50 p-5 rounded-[2rem] h-fit shrink-0 border border-saffron-100/50">
                  <Phone className="h-6 w-6 text-saffron-600" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Phone</h3>
                  <a 
                    href={`tel:${settings?.phone || "+919299207650"}`} 
                    className="text-3xl font-playfair font-black text-saffron-600 hover:text-maroon-600 transition-colors tracking-tight"
                  >
                    {settings?.phone || "+91 92992 07650"}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={STORE_LINKS.googleMapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-puja-text px-8 py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-black shadow-xl shadow-gray-200 active:scale-95"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
              <a
                href={STORE_LINKS.googleMapsPlace}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white px-8 py-5 text-sm font-black uppercase tracking-widest text-puja-text transition-all hover:border-saffron-300 hover:bg-saffron-50 active:scale-95"
              >
                <ExternalLink className="h-4 w-4 text-saffron-500" />
                Open in Maps
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="overflow-hidden rounded-[3rem] border-[12px] border-white bg-white shadow-2xl shadow-gray-200/50">
            <iframe
              title="Store location"
              src={STORE_LINKS.googleMapsEmbed}
              className="h-full min-h-[500px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

