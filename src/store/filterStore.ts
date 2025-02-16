import { create } from 'zustand';

interface FilterState {
    categories: number[];
    colors: string[];
    sizes: string[];
    priceRange: {
        min: number | string;
        max: number | string;
    };
    rating: number[];
}

interface FilterStore extends FilterState {
    setCategories: (categories: number[]) => void;
    setColors: (colors: string[]) => void;
    setSizes: (sizes: string[]) => void;
    setPriceRange: (range: { min: number | string; max: number | string }) => void;
    setRating: (rating: number[]) => void;
    resetFilters: () => void;
}

const initialState: FilterState = {
    categories: [],
    colors: [],
    sizes: [],
    priceRange: { min: '', max: '' },
    rating: [],
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...initialState,
    setCategories: (categories) => set({ categories }),
    setColors: (colors) => set({ colors }),
    setSizes: (sizes) => set({ sizes }),
    setPriceRange: (priceRange) => set({ priceRange }),
    setRating: (rating) => set({ rating }),
    resetFilters: () => set(initialState),
}));
