"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category } from "./types";

interface AppState {
  search: string;
  category: Category | "";
  city: string;
  radius: number;
  center: { lat: number; lng: number };
  favorites: string[];

  setSearch: (search: string) => void;
  setCategory: (category: Category | "") => void;
  setCity: (city: string) => void;
  setRadius: (radius: number) => void;
  setCenter: (center: { lat: number; lng: number }) => void;
  toggleFavorite: (listingId: string) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      search: "",
      category: "",
      city: "",
      radius: 10000,
      center: {
        lat: 51.5136,
        lng: 7.4653,
      },
      favorites: [],

      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      setCity: (city) => set({ city }),
      setRadius: (radius) => set({ radius }),
      setCenter: (center) => set({ center }),

      toggleFavorite: (listingId) =>
        set((state) => ({
          favorites: state.favorites.includes(listingId)
            ? state.favorites.filter((id) => id !== listingId)
            : [...state.favorites, listingId],
        })),

      resetFilters: () =>
        set({
          search: "",
          category: "",
          city: "",
          radius: 10000,
          center: {
            lat: 51.5136,
            lng: 7.4653,
          },
        }),
    }),
    {
      name: "stadthelfer-storage",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);