"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type GalleryPreviewItem = {
  id: number;
  name: string;
  country: string | null;
  image_url: string;
  created_at: string;
};

type GalleryPreviewItemWithUrl = GalleryPreviewItem & {
  imagePreviewUrl: string;
};

const PREVIEW_IMAGE_COUNT = 6;
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

function selectRotatingImages(
  items: GalleryPreviewItemWithUrl[],
): GalleryPreviewItemWithUrl[] {
  if (items.length <= PREVIEW_IMAGE_COUNT) {
    return items;
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

  return shuffledItems.slice(0, PREVIEW_IMAGE_COUNT);
}

export default function GalleryPreview() {
  const [galleryItems, setGalleryItems] = useState<
    GalleryPreviewItemWithUrl[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadGalleryPreview() {
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
        console.log("Could not load gallery preview:", error);
        setLoadError("The gallery preview could not be loaded.");
        setIsLoading(false);
        return;
      }

      const itemsWithUrls = await Promise.all(
        (data ?? []).map(async (item: GalleryPreviewItem) => {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("letter-uploads")
              .createSignedUrl(item.image_url, 60 * 60);

          if (signedUrlError) {
            console.log(
              `Could not load preview image ${item.id}:`,
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

      const validItems = itemsWithUrls.filter(
        (
          item,
        ): item is GalleryPreviewItemWithUrl => item !== null,
      );

      setGalleryItems(selectRotatingImages(validItems));
      setIsLoading(false);
    }

    loadGalleryPreview();
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-pink-500/20 bg-white/[0.02]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-6 text-6xl text-pink-500/10">
          ♡
        </div>

        <div className="absolute right-16 top-20 text-5xl text-pink-400/10">
          ♡
        </div>

        <div className="absolute bottom-4 left-1/3 text-4xl text-pink-500/10">
          ✦
        </div>

        <div className="absolute right-1/3 top-2 text-3xl text-pink-400/10">
          ✦
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Shared by the community
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Gallery Preview
          </h2>

          <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
            A rotating selection of approved artwork, photos, and creative
            tributes from the community.
          </p>
        </div>

        {isLoading && (
          <div className="border border-pink-400/30 bg-black/40 p-10 text-center">
            <div className="text-4xl">🎨</div>

            <p className="mt-4 text-pink-200">
              Loading gallery images...
            </p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="border border-red-400/40 bg-red-950/20 p-6 text-center text-red-200">
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && galleryItems.length === 0 && (
          <div className="border border-pink-400/30 bg-black/40 p-10 text-center">
            <div className="text-4xl">🖼️</div>

            <p className="mt-4 text-pink-200">
              Approved gallery images will appear here soon.
            </p>
          </div>
        )}

        {!isLoading && !loadError && galleryItems.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {galleryItems.map((item, index) => (
              <Link
                key={item.id}
                href="/gallery"
                aria-label={`View gallery image submitted by ${item.name}`}
                className={`group relative overflow-hidden border border-pink-300/30 bg-zinc-950 shadow-[0_0_20px_rgba(236,72,153,0.1)] transition duration-300 hover:-translate-y-1 hover:border-pink-300/70 hover:shadow-[0_0_28px_rgba(236,72,153,0.25)] ${
                  index % 2 === 0
                    ? "sm:rotate-[0.5deg]"
                    : "sm:-rotate-[0.5deg]"
                }`}
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-950 via-black to-zinc-900">
                  <img
                    src={item.imagePreviewUrl}
                    alt={`Gallery submission by ${item.name}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="truncate text-center font-serif text-sm text-pink-100">
                      {item.name}
                    </p>

                    {item.country && (
                      <p className="mt-1 truncate text-center text-xs text-gray-300">
                        {item.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-pink-300/40 bg-black/70 text-sm text-pink-200 opacity-0 transition group-hover:opacity-100">
                  ♡
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-block border-b border-transparent pb-1 text-sm uppercase tracking-[0.22em] text-pink-400 transition hover:border-pink-400 hover:text-pink-300"
          >
            View full gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}