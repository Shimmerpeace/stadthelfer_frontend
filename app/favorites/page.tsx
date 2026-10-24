"use client";

import { useQuery } from "@tanstack/react-query";
import { ListingCard } from "@/components/ListingCard";
import { getFavoriteListings } from "@/lib/mockApi";
import { useAppStore } from "@/lib/useAppStore";
import type { Listing } from "@/lib/types";

export default function FavoritesPage() {
  const favorites = useAppStore((state) => state.favorites);

  const { data, isLoading } = useQuery<Listing[]>({
    queryKey: ["favorites", favorites],
    queryFn: () => getFavoriteListings(favorites),
    enabled: favorites.length > 0,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Saved listings</h1>

      {favorites.length === 0 ? (
        <p className="text-slate-600">
          You have not saved any listings yet.
        </p>
      ) : isLoading ? (
        <p>Loading favorites...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      )}
    </div>
  );
}