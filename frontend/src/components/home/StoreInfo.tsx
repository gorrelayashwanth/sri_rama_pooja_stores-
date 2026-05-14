import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { STORE_INFO, STORE_LINKS } from "../../config/store";

export function StoreInfo() {
  return (
    <section className="py-24 bg-[#fcf9f5] relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-divine-pattern scale-150" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text mb-4 uppercase tracking-widest">
            Visit Our Store
          </h2>
          <div className="w-24 h-1 bg-saffron-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Info Cards */}
          <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col justify-between space-y-12">
            {/* Address */}
            <div className="flex gap-6">
              <div className="bg-saffron-100 p-4 rounded-2xl h-fit shrink-0">
                <MapPin className="h-6 w-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Address</h3>
                <p className="text-lg font-medium text-puja-text leading-relaxed">
                  {STORE_INFO.addressLines.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-6">
              <div className="bg-saffron-100 p-4 rounded-2xl h-fit shrink-0">
                <Clock className="h-6 w-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hours</h3>
                <p className="text-lg font-medium text-puja-text">{STORE_INFO.hours}</p>
                <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  Closed
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-6">
              <div className="bg-saffron-100 p-4 rounded-2xl h-fit shrink-0">
                <Phone className="h-6 w-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone</h3>
                <a href={STORE_LINKS.tel} className="text-2xl font-playfair font-bold text-saffron-600 hover:text-saffron-700 transition-colors">
                  {STORE_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={STORE_LINKS.googleMapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-puja-text px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-saffron-600"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
              <a
                href={STORE_LINKS.googleMapsPlace}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-puja-text transition-colors hover:border-saffron-300 hover:bg-saffron-50"
              >
                <ExternalLink className="h-4 w-4 text-saffron-500" />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="overflow-hidden rounded-[3rem] border-8 border-white bg-white shadow-2xl">
            <iframe
              title={`${STORE_INFO.name} location`}
              src={STORE_LINKS.googleMapsEmbed}
              className="h-[520px] w-full"
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
