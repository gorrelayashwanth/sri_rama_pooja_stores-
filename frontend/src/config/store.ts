export const STORE_INFO = {
  name: "Sri Rama Pooja Store",
  phone: "+919299207650",
  phoneDisplay: "+91 92992 07650",
  addressLines: [
    "Door No. 23, 11-116, Nageswara Rao Pantulu Rd,",
    "Rajan Killi Shop Center, Satyanarayana Puram,",
    "Vijayawada, Andhra Pradesh 520011",
  ],
  hours: "7:00 AM - 11:00 PM (Daily)",
  mapQuery:
    "Door No. 23, 11-116, Nageswara Rao Pantulu Rd, Rajan Killi Shop Center, Satyanarayana Puram, Vijayawada, Andhra Pradesh 520011",
};

const encodedMapQuery = encodeURIComponent(STORE_INFO.mapQuery);

export const STORE_LINKS = {
  tel: `tel:${STORE_INFO.phone}`,
  googleMapsPlace: `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`,
  googleMapsDirections: `https://www.google.com/maps/dir/?api=1&destination=${encodedMapQuery}`,
  googleMapsEmbed: `https://www.google.com/maps?q=${encodedMapQuery}&z=17&output=embed`,
} as const;
