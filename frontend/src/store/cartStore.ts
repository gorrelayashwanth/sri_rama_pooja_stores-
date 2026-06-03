import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartId: string;
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  selectedTier?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartId'> & { cartId?: string }) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const cartId = item.cartId || (item.id + (item.selectedTier ? `-${item.selectedTier}` : ''));
        const items = get().items;
        const existingItem = items.find((i) => i.cartId === cartId);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.cartId === cartId ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, cartId }] });
        }
      },
      removeItem: (cartId) => {
        set({ items: get().items.filter((i) => i.cartId !== cartId) });
      },
      updateQuantity: (cartId, quantity) => {
        set({
          items: get().items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (acc, item) => acc + (item.salePrice || item.price) * item.quantity,
          0
        ),
    }),
    {
      name: 'cart-storage',
    }
  )
);