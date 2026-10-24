import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { QueryProvider } from "@/lib/queryProvider";

export const metadata: Metadata = {
  title: "StadtHelfer — Find local services and events",
  description:
    "Discover local services, events, rentals, and community activities near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <QueryProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-bold text-green-600">
                StadtHelfer
              </Link>

              <nav className="flex items-center gap-5 text-sm font-medium">
                <Link href="/" className="hover:text-blue-600">
                  Explore
                </Link>

                <Link href="/favorites" className="hover:text-blue-600">
                  Favorites
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}