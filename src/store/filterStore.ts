import { create } from 'zustand';

export interface FilterState {
    categories: number[];
    colors: string[];
    sizes: string[];
    priceRange: {
        min: number | string;
        max: number | string;
    };
    rating: number[];
    isFilterChanged: boolean;
    isFilterReset: boolean;
}

interface FilterStore extends FilterState {
    setCategories: (categories: number[]) => void;
    setColors: (colors: string[]) => void;
    setSizes: (sizes: string[]) => void;
    setPriceRange: (range: { min: number | string; max: number | string }) => void;
    setRating: (rating: number[]) => void;
    resetFilters: () => void;
    setIsFilterChanged: (value: boolean) => void;
    setIsFilterReset: (value: boolean) => void;
}

const initialState: FilterState = {
    categories: [],
    colors: [],
    sizes: [],
    priceRange: { min: '', max: '' },
    rating: [],
    isFilterChanged: false,
    isFilterReset: false,
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...initialState,
    setCategories: (categories) => set((state) => ({
        categories,
        isFilterChanged: true
    })),
    setColors: (colors) => set((state) => ({
        colors,
        isFilterChanged: true
    })),
    setSizes: (sizes) => set((state) => ({
        sizes,
        isFilterChanged: true
    })),
    setPriceRange: (priceRange) => set((state) => ({
        priceRange,
        isFilterChanged: true
    })),
    setRating: (rating) => set((state) => ({
        rating,
        isFilterChanged: true
    })),
    resetFilters: () => set({
        ...initialState,
        isFilterReset: true,
        isFilterChanged: false
    }),
    setIsFilterChanged: (value) => set({ isFilterChanged: value }),
    setIsFilterReset: (value) => set({ isFilterReset: value }),
}));
