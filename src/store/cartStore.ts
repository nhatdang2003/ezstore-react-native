import { create } from 'zustand';

interface CartStore {
    cartCount: number;
    setCartCount: (count: number) => void;
    incrementCartCount: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    cartCount: 0,
    setCartCount: (count) => set({ cartCount: count }),
    incrementCartCount: () => set((state) => ({ cartCount: state.cartCount + 1 })),
}));