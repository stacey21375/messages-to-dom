"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type GalleryItem = {
  id: number;
  name: string;
  country: string | null;
  image_url: string;
  created_at: string;
};

type GalleryItemWithPreview = GalleryItem & {
  imagePreviewUrl: string;
};

const FEATURED_IMAGE_COUNT = 3;
const TWO_DAYS_IN_MILLISECONDS = 2 * 24 * 60 * 60 * 1000;

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;

  if (value <= 0) {
    value += 2147483646;
  }

  return function seededRandom() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createRotatingSelection(
  items: GalleryItemWithPreview[],
): GalleryItemWithPreview[] {
  if (items.length === 0) {
    return [];
  }

  const currentTwoDayPeriod = Math.floor(
    Date.now() / TWO_DAYS_IN_MILLISECONDS,
  );

  const random = createSeededRandom(currentTwoDayPeriod);
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    [shuffledItems[index], shuffledItems[randomIndex]] = [
      shuffledItems[randomIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems.slice(
    0,
    Math.min(FEATURED_IMAGE_COUNT, shuffledItems.length),
  );
}

function formatGalleryDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemWithPreview[]>([]);
  const [featuredItems, setFeaturedItems] = useState<
    GalleryItemWithPreview[]
  >([]);
  const [selectedItem, setSelectedItem] =
    useState<GalleryItemWithPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadGallery() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("letters")
        .select("id, name, country, image_url, created_at")
        .eq("status", "approved")
        .eq("show_in_gallery", true)
        .not("image_url", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Could not load gallery:", error);
        setLoadError(
          "The gallery could not be loaded. Please try again later.",
        );
        setIsLoading(false);
        return;
      }

      const itemsWithPreviews = await Promise.all(
        (data ?? []).map(async (item: GalleryItem) => {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("letter-uploads")
              .createSignedUrl(item.image_url, 60 * 60);

          if (signedUrlError) {
            console.log(
              `Could not load gallery image ${item.id}:`,
              signedUrlError,
            );

            return null;
          }

          return {
            ...item,
            imagePreviewUrl: signedUrlData.signedUrl,
          };
        }),
      );

      const validItems = itemsWithPreviews.filter(
        (item): item is GalleryItemWithPreview => item !== null,
      );

      setItems(validItems);
      setFeaturedItems(createRotatingSelection(validItems));
      setIsLoading(false);
    }

    loadGallery();
  }, []);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    }

    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [selectedItem]);

  const remainingItems = useMemo(() => {
    const featuredIds = new Set(featuredItems.map((item) => item.id));

    return items.filter((item) => !featuredIds.has(item.id));
  }, [featuredItems, items]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-20 text-6xl text-pink-500/10">
            ♡
          </div>

          <div className="absolute right-16 top-32 text-5xl text-pink-400/10">
            ✦
          </div>

          <div className="absolute bottom-24 left-1/3 text-7xl text-pink-500/10">
            ♡
          </div>

          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Shared by the community
            </p>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
              Community Gallery
            </h1>

            <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
              A curated collection of fan artwork, photos, and creative
              tributes shared with kindness and permission.
            </p>
          </div>

          {isLoading && (
            <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">🎨</div>

              <p className="mt-4 text-pink-200">
                Opening the gallery...
              </p>
            </div>
          )}

          {loadError && (
            <div className="mt-14 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
              {loadError}
            </div>
          )}

          {!isLoading && !loadError && items.length === 0 && (
            <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">🖼️</div>

              <h2 className="mt-4 font-serif text-2xl text-pink-200">
                The gallery is waiting for its first image.
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                Images selected during letter moderation will appear here.
              </p>
            </div>
          )}

          {!isLoading && !loadError && featuredItems.length > 0 && (
            <section className="mt-16">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-pink-400">
                  Community spotlight
                </p>

                <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
                  Featured Gallery
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
                  A rotating selection of community creations, refreshed
                  automatically every other day.
                </p>
              </div>

              <div className="mt-10 grid gap-7 lg:grid-cols-3">
                {featuredItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={`group relative border border-pink-300/40 bg-gradient-to-b from-zinc-950 to-black p-4 shadow-[0_0_35px_rgba(236,72,153,0.16)] ${
                      index === 1
                        ? "lg:-translate-y-4 lg:scale-[1.02]"
                        : ""
                    }`}
                  >
                    <div className="absolute -right-3 -top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/60 bg-pink-950 text-xl shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                      ♡
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="block w-full cursor-zoom-in bg-[#f5e8df] p-3 text-left"
                      aria-label={`Open featured image submitted by ${item.name}`}
                    >
                      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-black">
                        <img
                          src={item.imagePreviewUrl}
                          alt={`Featured gallery submission by ${item.name}`}
                          className="max-h-[480px] w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-16 opacity-0 transition duration-300 group-hover:opacity-100">
                          <p className="text-center text-xs uppercase tracking-[0.2em] text-pink-100">
                            View full image
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="px-3 pb-3 pt-5 text-center">
                      <p className="text-xs uppercase tracking-[0.22em] text-pink-400">
                        Featured creation
                      </p>

                      <p className="mt-3 font-serif text-2xl text-pink-100">
                        {item.name}
                      </p>

                      {item.country && (
                        <p className="mt-1 text-sm text-gray-400">
                          {item.country}
                        </p>
                      )}

                      <p className="mt-3 text-xs text-gray-600">
                        Shared {formatGalleryDate(item.created_at)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!isLoading && !loadError && remainingItems.length > 0 && (
            <section className="mt-24">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pink-400/25 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                    Made with love
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-white">
                    More From the Community
                  </h2>
                </div>

                <span className="rounded-full border border-pink-400/30 bg-pink-950/20 px-4 py-2 text-sm text-pink-200">
                  {items.length}{" "}
                  {items.length === 1 ? "creation" : "creations"}
                </span>
              </div>

              <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
                {remainingItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={`mb-6 break-inside-avoid border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black p-4 shadow-[0_0_25px_rgba(236,72,153,0.14)] ${
                      index % 2 === 0
                        ? "sm:rotate-[0.4deg]"
                        : "sm:-rotate-[0.4deg]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="group block w-full cursor-zoom-in bg-[#f5e8df] p-3 text-left"
                      aria-label={`Open image submitted by ${item.name}`}
                    >
                      <div className="relative overflow-hidden border border-pink-900/15 bg-black">
                        <img
                          src={item.imagePreviewUrl}
                          alt={`Gallery submission by ${item.name}`}
                          className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                        />

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-12 opacity-0 transition group-hover:opacity-100">
                          <p className="text-center text-sm uppercase tracking-[0.18em] text-pink-200">
                            Click to enlarge
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="relative -mt-2 px-3 pb-2 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-pink-300 bg-pink-800 text-lg shadow-[0_0_18px_rgba(236,72,153,0.55)]">
                        ♡
                      </div>

                      <p className="mt-4 font-serif text-xl text-pink-200">
                        {item.name}
                      </p>

                      {item.country && (
                        <p className="mt-1 text-sm text-gray-400">
                          {item.country}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-gray-600">
                        Shared {formatGalleryDate(item.created_at)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!isLoading &&
            !loadError &&
            items.length > 0 &&
            remainingItems.length === 0 && (
              <p className="mt-16 text-center text-sm text-gray-500">
                More community creations will appear here as they are
                approved.
              </p>
            )}
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image submitted by ${selectedItem.name}`}
          onClick={() => setSelectedItem(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/50 bg-black/70 text-2xl text-pink-100 transition hover:border-pink-300 hover:bg-pink-950"
            aria-label="Close image"
          >
            ×
          </button>

          <div
            className="max-h-[92vh] max-w-6xl overflow-auto border border-pink-300/40 bg-zinc-950 p-4 shadow-[0_0_50px_rgba(236,72,153,0.25)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedItem.imagePreviewUrl}
              alt={`Gallery submission by ${selectedItem.name}`}
              className="mx-auto max-h-[76vh] max-w-full object-contain"
            />

            <div className="pt-5 text-center">
              <p className="font-serif text-2xl text-pink-100">
                {selectedItem.name}
              </p>

              {selectedItem.country && (
                <p className="mt-1 text-sm text-gray-400">
                  {selectedItem.country}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-600">
                Shared {formatGalleryDate(selectedItem.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}