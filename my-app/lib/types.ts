export type Category = "service" | "event" | "rental" | "community";

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  city: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  ownerName: string;
  createdAt: string;
}

export interface ListingFilters {
  search: string;
  category: Category | "";
  city: string;
  radius: number;
  center: {
    lat: number;
    lng: number;
  };
}