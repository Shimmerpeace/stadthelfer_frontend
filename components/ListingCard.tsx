"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";
import { useAppStore } from "@/lib/useAppStore";

export function ListingCard({ listing }: { listing: Listing }) {
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const isFavorite = favorites.includes(listing.id);

  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/listing/${listing.id}`}>
        <div className="h-40 w-full overflow-hidden bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {listing.category}
          </span>

          <span className="text-sm font-semibold">
            {listing.price === 0 ? "Free" : `€${listing.price}`}
          </span>
        </div>

        <Link href={`/listing/${listing.id}`}>
          <h3 className="line-clamp-1 font-semibold hover:text-blue-600">
            {listing.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-slate-600">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{listing.city}</span>
          <span>
            ⭐ {listing.rating.toFixed(1)} ({listing.reviewCount})
          </span>
        </div>

        <button
          onClick={() => toggleFavorite(listing.id)}
          className={`w-full rounded-lg border px-3 py-2 text-sm font-medium transition ${
            isFavorite
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {isFavorite ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}