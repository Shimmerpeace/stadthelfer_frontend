import { faker } from "@faker-js/faker/locale/de";
import type {
  Category,
  Listing,
  ListingFilters,
} from "./types";

const cities = [
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
  { name: "Essen", lat: 51.4556, lng: 7.0116 },
  { name: "Bochum", lat: 51.4818, lng: 7.2165 },
  { name: "Cologne", lat: 50.9375, lng: 6.9603 },
];

const categories: Category[] = [
  "service",
  "event",
  "rental",
  "community",
];

const titles: Record<Category, string[]> = {
  service: [
    "Mobile Bicycle Repair",
    "Home Cleaning Service",
    "Laptop Repair Specialist",
    "Moving Help in NRW",
    "Private German Tutor",
  ],
  event: [
    "Language Café for Learners",
    "Startup Networking Evening",
    "Open-Air Jazz Concert",
    "Community Football Match",
    "Tech Meetup Dortmund",
  ],
  rental: [
    "Furnished Room Near University",
    "Modern 2-Room Apartment",
    "Coworking Desk in City Center",
    "Parking Space for Rent",
    "Studio Apartment with Balcony",
  ],
  community: [
    "Neighborhood Repair Café",
    "Volunteer Garden Project",
    "Food Sharing Initiative",
    "Local Book Exchange",
    "Weekend Hiking Group",
  ],
};

function createListings(count: number): Listing[] {
  return Array.from({ length: count }, (_, index) => {
    const city = faker.helpers.arrayElement(cities);
    const category = faker.helpers.arrayElement(categories);

    const latitude =
      city.lat + faker.number.float({ min: -0.08, max: 0.08 });

    const longitude =
      city.lng + faker.number.float({ min: -0.08, max: 0.08 });

    return {
      id: `listing-${index + 1}`,
      title: faker.helpers.arrayElement(titles[category]),
      description: faker.lorem.paragraphs(2),
      category,
      price: faker.number.int({ min: 0, max: 120 }),
      city: city.name,
      address: `${faker.location.streetAddress()}, ${city.name}`,
      image: `https://picsum.photos/seed/${index + 1}/800/500`,
      rating: faker.number.float({
        min: 3,
        max: 5,
        fractionDigits: 1,
      }),
      reviewCount: faker.number.int({ min: 0, max: 80 }),
      latitude,
      longitude,
      ownerName: faker.person.fullName(),
      createdAt: faker.date.recent({ days: 90 }).toISOString(),
    };
  });
}

export const allListings: Listing[] = createListings(150);

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface PaginatedListings {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getListings(
  filters: ListingFilters,
  page = 1,
  limit = 12
): Promise<PaginatedListings> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filtered = allListings.filter((listing) => {
    const matchesSearch =
      !filters.search ||
      listing.title
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      listing.description
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesCategory =
      !filters.category || listing.category === filters.category;

    const matchesCity =
      !filters.city ||
      listing.city.toLowerCase().includes(filters.city.toLowerCase());

    const distance = calculateDistanceKm(
      filters.center.lat,
      filters.center.lng,
      listing.latitude,
      listing.longitude
    );

    const matchesRadius = distance <= filters.radius / 1000;

    return (
      matchesSearch && matchesCategory && matchesCity && matchesRadius
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const distanceA = calculateDistanceKm(
      filters.center.lat,
      filters.center.lng,
      a.latitude,
      a.longitude
    );

    const distanceB = calculateDistanceKm(
      filters.center.lat,
      filters.center.lng,
      b.latitude,
      b.longitude
    );

    return distanceA - distanceB;
  });

  const start = (page - 1) * limit;
  const listings = sorted.slice(start, start + limit);

  return {
    listings,
    total: sorted.length,
    page,
    totalPages: Math.ceil(sorted.length / limit),
  };
}

export async function getListingById(id: string): Promise<Listing> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const listing = allListings.find((item) => item.id === id);

  if (!listing) {
    throw new Error("Listing not found");
  }

  return listing;
}

export async function getFavoriteListings(
  favoriteIds: string[]
): Promise<Listing[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return allListings.filter((listing) =>
    favoriteIds.includes(listing.id)
  );
}