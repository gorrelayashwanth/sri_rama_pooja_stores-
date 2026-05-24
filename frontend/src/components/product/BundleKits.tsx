import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useLanguage } from "../../context/LanguageContext";
import placeholderImage from "../../assets/pooja-placeholder.svg";

export function BundleKits() {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await api.get('/combos');
        // Filter out inactive combos
        const activeCombos = response.data.data.filter((c: any) => c.isActive);
        setCombos(activeCombos);
      } catch (error) {
        console.error("Failed to fetch combos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const handleAddComboToCart = (combo: any) => {
    if (!Array.isArray(combo.products)) return;
    
    // Add each product in the combo to the cart
    combo.products.forEach((product: any) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0]?.url || placeholderImage,
        quantity: 1
      });
    });
  };

  if (loading) return null;
  if (combos.length === 0) return null;

  return (
    <section className="py-24 bg-saffron-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron-600 mb-3 block">Divine Bundles</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-puja-text">Pooja Samagri Kits</h2>
          <p className="mt-4 text-puja-muted italic">Complete sets thoughtfully curated for your sacred rituals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-saffron-100 flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-puja-text mb-2">{combo.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-saffron-600">₹{combo.salePrice || combo.price}</span>
                    {combo.salePrice && <span className="text-sm line-through text-puja-muted font-bold">₹{combo.price}</span>}
                  </div>
                </div>
                <div className="bg-saffron-100 text-saffron-700 p-2 rounded-full">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              
              <p className="text-puja-muted italic mb-8 flex-grow">{combo.description}</p>
              
              <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-puja-text mb-4">Includes ({combo.products.length} Items):</h4>
                <ul className="space-y-3">
                  {combo.products.slice(0, 4).map((product: any) => (
                    <li key={product.id} className="flex items-center gap-3 text-sm font-medium text-puja-muted">
                      <div className="w-1.5 h-1.5 rounded-full bg-saffron-400 shrink-0" />
                      <span className="truncate">{t(product.name, product.translations, 'name')}</span>
                    </li>
                  ))}
                  {combo.products.length > 4 && (
                    <li className="text-xs font-bold text-saffron-600 pl-4 mt-2">
                      + {combo.products.length - 4} more divine items
                    </li>
                  )}
                </ul>
              </div>
              
              <button 
                onClick={() => handleAddComboToCart(combo)}
                className="w-full bg-saffron-500 hover:bg-saffron-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-saffron-500/30"
              >
                <ShoppingCart className="w-4 h-4" /> Add Entire Kit
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
