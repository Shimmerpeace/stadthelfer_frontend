"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Filters } from "@/components/Filters";
import { ListingCard } from "@/components/ListingCard";
import { getListings } from "@/lib/mockApi";
import { useAppStore } from "@/lib/useAppStore";
import type { PaginatedListings } from "@/lib/mockApi";


const ListingsMap = dynamic(
  () =>
    import("@/components/ListingsMap").then(
      (module) => module.ListingsMap
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[500px] w-full items-center justify-center rounded-xl bg-slate-100 text-slate-500"
        role="status"
      >
        Loading map...
      </div>
    ),
  }
);

export default function HomePage() {
  const [page, setPage] = useState(1);

  const {
    search,
    category,
    city,
    radius,
    center,
  } = useAppStore();

  const { data, isLoading, isError } = useQuery<PaginatedListings>({
    queryKey: [
      "listings",
      { search, category, city, radius, center, page },
    ],
    queryFn: () =>
      getListings(
        {
          search,
          category,
          city,
          radius,
          center,
        },
        page
      ),
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-green-600 to-red-600 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Find services and events near you.
        </h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Discover local help, community activities, rentals, and events
          across Dortmund and North Rhine-Westphalia.
        </p>
      </section>

      <Filters />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-xl bg-white"
                />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-red-600">
              Something went wrong while loading listings.
            </p>
          )}

          {data && (
            <>
              <p className="text-sm text-slate-600">
                {data.total} listings found
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {data.listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                  />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-sm">
                    Page {data.page} of {data.totalPages}
                  </span>

                  <button
                    disabled={page === data.totalPages}
                    onClick={() =>
                      setPage((current) => current + 1)
                    }
                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ListingsMap
          listings={data?.listings ?? []}
          center={center}
        />
      </div>
    </div>
  );
}
