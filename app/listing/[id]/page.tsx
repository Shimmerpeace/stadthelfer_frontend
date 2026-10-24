"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getListingById } from "@/lib/mockApi";
import { useAppStore } from "@/lib/useAppStore";
import type { Listing } from "@/lib/types";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();

  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  const { data, isLoading, isError } = useQuery<Listing>({
    queryKey: ["listing", params.id],
    queryFn: () => getListingById(params.id),
  });

  if (isLoading) {
    return <p>Loading listing...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">Listing not found.</p>;
  }

  const isFavorite = favorites.includes(data.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to listings
      </Link>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image}
          alt={data.title}
          className="h-72 w-full object-cover"
        />

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {data.category}
            </span>

            <span className="font-semibold">
              {data.price === 0 ? "Free" : `From €${data.price}`}
            </span>
          </div>

          <h1 className="text-2xl font-bold">{data.title}</h1>

          <p className="text-slate-600">{data.description}</p>

          <div className="grid gap-2 text-sm text-slate-600">
            <p>📍 {data.address}</p>
            <p>🏙️ {data.city}</p>
            <p>👤 Listed by {data.ownerName}</p>
            <p>
              ⭐ {data.rating.toFixed(1)} · {data.reviewCount} reviews
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(data.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isFavorite
                ? "bg-red-50 text-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFavorite ? "★ Remove from favorites" : "☆ Save listing"}
          </button>
        </div>
      </div>
    </div>
  );
}