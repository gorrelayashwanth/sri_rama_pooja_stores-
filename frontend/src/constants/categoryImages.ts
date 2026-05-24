import incenseImg from '../assets/home/incense-and-oils.png';
import diyasImg from '../assets/home/brassware.png';
import idolsImg from '../assets/home/idols-and-frames.png';
import thaliImg from '../assets/home/brassware.png';
import powdersImg from '../assets/home/puja-items.png';
import flowersImg from '../assets/home/pooja-essentials-alt.png';
import threadsImg from '../assets/home/puja-items.png';
import fabricsImg from '../assets/home/pooja-essentials-alt.png';
import kitsImg from '../assets/home/festival-supplies.png';
import liquidsImg from '../assets/home/puja-items.png';
import booksImg from '../assets/home/pooja-essentials-alt.png';
import decorImg from '../assets/home/idols-and-frames.png';

/** Maps category slugs from the database to local asset images */
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'incense-fragrance': incenseImg,
  'diyas-lamps': diyasImg,
  'god-idols-murtis': idolsImg,
  'puja-thali-utensils': thaliImg,
  'sacred-powders': powdersImg,
  'flowers-garlands': flowersImg,
  'sacred-threads-malas': threadsImg,
  'puja-fabrics': fabricsImg,
  'puja-kits': kitsImg,
  'sacred-water-liquids': liquidsImg,
  'books-spiritual-items': booksImg,
  'temple-mandir-decoration': decorImg,
  // Legacy slugs from earlier seeds
  'incense-dhoop': incenseImg,
  'incense-oils': incenseImg,
  'sacred-idols-murtis': idolsImg,
  'idols-frames': idolsImg,
  'puja-items': powdersImg,
  'pooja-essentials': powdersImg,
  'kumkum-vibhuti-sacred-powders': powdersImg,
  'fresh-florals-leaves': flowersImg,
  'sacred-threads-raksha': threadsImg,
  'festival-supplies': kitsImg,
  'brassware': diyasImg,
};

export function getCategoryImage(slug: string, dbImage?: string | null): string {
  return dbImage || CATEGORY_IMAGE_MAP[slug] || incenseImg;
}
