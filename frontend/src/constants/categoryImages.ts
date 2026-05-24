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

/** Canonical display order for the 12 store categories */
export const CANONICAL_CATEGORY_SLUGS = [
  'incense-fragrance',
  'diyas-lamps',
  'god-idols-murtis',
  'puja-thali-utensils',
  'sacred-powders',
  'flowers-garlands',
  'sacred-threads-malas',
  'puja-fabrics',
  'puja-kits',
  'sacred-water-liquids',
  'books-spiritual-items',
  'temple-mandir-decoration',
] as const;

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
};

/** Prefer bundled assets (always work on Vercel); fall back to absolute URLs only */
export function getCategoryImage(slug: string, dbImage?: string | null): string {
  if (CATEGORY_IMAGE_MAP[slug]) return CATEGORY_IMAGE_MAP[slug];
  if (dbImage?.startsWith('http')) return dbImage;
  return incenseImg;
}

export function isCanonicalCategory(slug: string): boolean {
  return (CANONICAL_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function sortCategoriesByCanonical<T extends { slug: string }>(list: T[]): T[] {
  const order: Record<string, number> = {};
  CANONICAL_CATEGORY_SLUGS.forEach((s, i) => {
    order[s] = i;
  });
  return [...list].sort((a, b) => (order[a.slug] ?? 99) - (order[b.slug] ?? 99));
}
