"use client";

import { useAppStore } from "@/lib/useAppStore";
import type { Category } from "@/lib/types";

const categories: Category[] = [
  "service",
  "event",
  "rental",
  "community",
];

export function Filters() {
  const {
    search,
    category,
    city,
    radius,
    setSearch,
    setCategory,
    setCity,
    setRadius,
    resetFilters,
  } = useAppStore();

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search listings..."
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as Category | "")
          }
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="City"
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={radius}
          onChange={(event) => setRadius(Number(event.target.value))}
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value={2000}>Within 2 km</option>
          <option value={5000}>Within 5 km</option>
          <option value={10000}>Within 10 km</option>
          <option value={25000}>Within 25 km</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="mt-3 text-sm font-medium text-blue-600 hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}