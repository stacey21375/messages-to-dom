"use client";

import { useEffect, useState } from "react";
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

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemWithPreview[]>([]);
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

      setItems(
        itemsWithPreviews.filter(
          (item): item is GalleryItemWithPreview => item !== null,
        ),
      );

      setIsLoading(false);
    }

    loadGallery();
  }, []);

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
                The gallery is waiting for its first featured image.
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                Artwork selected during moderation will appear here.
              </p>
            </div>
          )}

          {!isLoading && !loadError && items.length > 0 && (
            <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {items.map((item, index) => (
                <article
                  key={item.id}
                  className="mb-6 break-inside-avoid border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black p-4 shadow-[0_0_25px_rgba(236,72,153,0.14)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        item.imagePreviewUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
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
                      Featured{" "}
                      {new Date(item.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>

                    {index % 3 === 0 && (
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-pink-400/70">
                        Featured fan creation
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}